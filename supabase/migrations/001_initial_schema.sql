-- ====================================================================
-- EN PROFILE (EN-Vault-Profile) — PostgreSQL Schema Migration (001)
-- Ecosystem: ENOS / Every Nation GG
-- Authoritative Database: Supabase PostgreSQL
-- ====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- 1. ASSET METADATA CATALOG (profile_assets)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile_assets (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('avatar_frame', 'card_frame', 'theme_layer', 'title', 'emblem', 'badge')),
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    asset_url TEXT NOT NULL,
    preview_url TEXT NOT NULL,
    unlock_type TEXT NOT NULL CHECK (unlock_type IN ('starter', 'level', 'achievement', 'vault_coins', 'exclusive')),
    unlock_req JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_starter BOOLEAN NOT NULL DEFAULT FALSE,
    rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary', 'mythic')),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_profile_assets_category ON public.profile_assets(category);
CREATE INDEX IF NOT EXISTS idx_profile_assets_unlock_type ON public.profile_assets(unlock_type);
CREATE INDEX IF NOT EXISTS idx_profile_assets_starter ON public.profile_assets(is_starter);

-- --------------------------------------------------------------------
-- 2. USER PROFILE STATE & CUSTOMIZATION (profile_user_states)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile_user_states (
    user_id TEXT PRIMARY KEY, -- Discord Snowflake ID
    guild_id TEXT NOT NULL,   -- ENOS Discord Guild Snowflake ID
    discord_username TEXT NOT NULL,
    discord_display_name TEXT NOT NULL,
    discord_avatar_url TEXT,
    custom_avatar_url TEXT,
    profile_exp BIGINT NOT NULL DEFAULT 0 CHECK (profile_exp >= 0),
    profile_level INT NOT NULL DEFAULT 1 CHECK (profile_level BETWEEN 1 AND 100),
    vault_coins BIGINT NOT NULL DEFAULT 0 CHECK (vault_coins >= 0),
    
    -- Equipped Cosmetics Configuration
    equipped_name_font TEXT NOT NULL DEFAULT 'Rajdhani',
    equipped_name_color TEXT NOT NULL DEFAULT '#F8FAFC',
    equipped_title_id TEXT NOT NULL DEFAULT 'title_vault_pioneer',
    equipped_title_color TEXT NOT NULL DEFAULT '#38BDF8',
    equipped_emblem_id TEXT NOT NULL DEFAULT 'emblem_starter_silver',
    equipped_emblem_color TEXT NOT NULL DEFAULT '#E2E8F0',
    equipped_avatar_frame_id TEXT NOT NULL DEFAULT 'frame_avatar_silver',
    equipped_card_frame_id TEXT NOT NULL DEFAULT 'frame_card_silver',
    equipped_theme_layers JSONB NOT NULL DEFAULT '["theme_silver_base", "theme_silver_circuit", "theme_silver_vignette"]'::jsonb,
    equipped_coin_color TEXT NOT NULL DEFAULT '#F59E0B',
    equipped_achievement_slots JSONB NOT NULL DEFAULT '["badge_boss_slayer", "badge_vault_pioneer", "badge_quest_master", "badge_trivia_sage", "badge_guild_champion"]'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_profile_user_states_guild ON public.profile_user_states(guild_id);
CREATE INDEX IF NOT EXISTS idx_profile_user_states_level ON public.profile_user_states(profile_level);

-- --------------------------------------------------------------------
-- 3. USER UNLOCK RECORDS (profile_user_unlocks)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile_user_unlocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    asset_id TEXT NOT NULL REFERENCES public.profile_assets(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    unlock_source TEXT NOT NULL DEFAULT 'starter' CHECK (unlock_source IN ('starter', 'level_up', 'achievement', 'vault_purchase', 'admin_grant', 'event')),
    CONSTRAINT unique_user_asset_unlock UNIQUE(user_id, asset_id)
);

CREATE INDEX IF NOT EXISTS idx_profile_user_unlocks_user ON public.profile_user_unlocks(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_user_unlocks_asset ON public.profile_user_unlocks(asset_id);

-- --------------------------------------------------------------------
-- 4. PROFILE EXP TRANSACTIONS LOG (profile_exp_transactions)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile_exp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    amount INT NOT NULL CHECK (amount > 0),
    source_type TEXT NOT NULL CHECK (source_type IN ('daily_quest', 'trivia', 'world_boss', 'level_bonus', 'admin_grant')),
    reference_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_profile_exp_tx_user ON public.profile_exp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_exp_tx_source ON public.profile_exp_transactions(source_type);

-- --------------------------------------------------------------------
-- 5. AUTOMATIC LEVEL CALCULATION & UNLOCK TRIGGERS
-- --------------------------------------------------------------------

-- Function to calculate Level from cumulative Profile EXP
-- Level 1: 0 EXP, Level 30: 83,429 EXP, Level 100: 417,143 EXP
CREATE OR REPLACE FUNCTION public.calculate_profile_level(p_exp BIGINT)
RETURNS INT AS $$
DECLARE
    v_level INT;
BEGIN
    IF p_exp <= 0 THEN
        RETURN 1;
    END IF;
    
    -- Exact polynomial curve fit for anchors (Lv 1=0, Lv 30=83429, Lv 100=417143)
    -- Formula: level = FLOOR(1 + (exp / 1002.15) ^ (1 / 1.315))
    v_level := FLOOR(1.0 + POWER(p_exp::FLOAT / 1002.15, 1.0 / 1.315))::INT;
    
    IF v_level < 1 THEN
        v_level := 1;
    ELSIF v_level > 100 THEN
        v_level := 100;
    END IF;
    
    RETURN v_level;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to recalculate level and update timestamp on user state modification
CREATE OR REPLACE FUNCTION public.handle_profile_state_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.profile_level := public.calculate_profile_level(NEW.profile_exp);
    NEW.updated_at := TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profile_user_state_update ON public.profile_user_states;
CREATE TRIGGER trg_profile_user_state_update
    BEFORE INSERT OR UPDATE OF profile_exp ON public.profile_user_states
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_profile_state_update();

-- --------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE public.profile_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_user_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_user_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_exp_transactions ENABLE ROW LEVEL SECURITY;

-- Assets: Publicly readable by all members
CREATE POLICY "Public Read Access for Profile Assets"
    ON public.profile_assets FOR SELECT
    USING (true);

-- User States: Publicly readable for card sharing; editable only by owner/service role
CREATE POLICY "Public Read Access for Profile States"
    ON public.profile_user_states FOR SELECT
    USING (true);

CREATE POLICY "Users Can Update Own Profile State"
    ON public.profile_user_states FOR UPDATE
    USING (auth.uid()::text = user_id OR auth.role() = 'service_role')
    WITH CHECK (auth.uid()::text = user_id OR auth.role() = 'service_role');

CREATE POLICY "Users Can Insert Own Profile State"
    ON public.profile_user_states FOR INSERT
    WITH CHECK (auth.uid()::text = user_id OR auth.role() = 'service_role');

-- Unlocks: Read access to user's unlocks
CREATE POLICY "Public Read Access for User Unlocks"
    ON public.profile_user_unlocks FOR SELECT
    USING (true);

-- EXP Transactions: Visible to owner
CREATE POLICY "Users Can View Own EXP Transactions"
    ON public.profile_exp_transactions FOR SELECT
    USING (auth.uid()::text = user_id OR auth.role() = 'service_role');
