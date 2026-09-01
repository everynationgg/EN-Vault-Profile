-- ====================================================================
-- EN PROFILE — Asset Catalog Seed Data (Migration 002)
-- 3 Starter Identities: Silver, Electric Violet, Flaming Golden Orange
-- Milestone Emblems: Lv 20, 40, 60, 80, 100
-- Avatar Frames, Card Frames, Titles, Themes & Badges
-- ====================================================================

INSERT INTO public.profile_assets (id, category, name, description, asset_url, preview_url, unlock_type, unlock_req, is_starter, rarity, metadata)
VALUES
-- --------------------------------------------------------------------
-- 1. STARTER IDENTITIES & CARD FRAMES
-- --------------------------------------------------------------------
('frame_card_silver', 'card_frame', 'Silver Aegis Frame', 'Clean minimalist metallic chrome border with edge bevels.', '/assets/frames/card_silver.svg', '/assets/frames/card_silver.svg', 'starter', '{}'::jsonb, TRUE, 'common', '{"theme": "silver"}'::jsonb),
('frame_card_violet', 'card_frame', 'Electric Violet Matrix Frame', 'High-voltage neon violet energy conduit border.', '/assets/frames/card_violet.svg', '/assets/frames/card_violet.svg', 'starter', '{}'::jsonb, TRUE, 'rare', '{"theme": "violet"}'::jsonb),
('frame_card_flame', 'card_frame', 'Flaming Golden Solar Frame', 'Radiant solar-forged golden flare border.', '/assets/frames/card_flame.svg', '/assets/frames/card_flame.svg', 'starter', '{}'::jsonb, TRUE, 'rare', '{"theme": "flame"}'::jsonb),
('frame_card_obsidian', 'card_frame', 'Obsidian Paragon Frame', 'Heavy dark matter geometric frame with crimson pulse.', '/assets/frames/card_obsidian.svg', '/assets/frames/card_obsidian.svg', 'level', '{"level": 50}'::jsonb, FALSE, 'epic', '{"theme": "obsidian"}'::jsonb),
('frame_card_celestial', 'card_frame', 'Celestial Sovereign Frame', 'Mythic astral halo frame with prismatic diamond accents.', '/assets/frames/card_celestial.svg', '/assets/frames/card_celestial.svg', 'level', '{"level": 100}'::jsonb, FALSE, 'mythic', '{"theme": "celestial"}'::jsonb),

-- --------------------------------------------------------------------
-- 2. AVATAR FRAMES
-- --------------------------------------------------------------------
('frame_avatar_silver', 'avatar_frame', 'Silver Core Ring', 'Sleek brushed aluminum circular avatar frame.', '/assets/frames/avatar_silver.svg', '/assets/frames/avatar_silver.svg', 'starter', '{}'::jsonb, TRUE, 'common', '{"theme": "silver"}'::jsonb),
('frame_avatar_violet', 'avatar_frame', 'Violet Arc Reactor', 'Charged electro-plasma avatar frame with lightning prongs.', '/assets/frames/avatar_violet.svg', '/assets/frames/avatar_violet.svg', 'starter', '{}'::jsonb, TRUE, 'rare', '{"theme": "violet"}'::jsonb),
('frame_avatar_flame', 'avatar_frame', 'Solar Corona Ring', 'Blazing solar crest avatar frame with golden rays.', '/assets/frames/avatar_flame.svg', '/assets/frames/avatar_flame.svg', 'starter', '{}'::jsonb, TRUE, 'rare', '{"theme": "flame"}'::jsonb),
('frame_avatar_quantum', 'avatar_frame', 'Quantum Cyber Halo', 'Rotating holographic glyphs surrounding the avatar.', '/assets/frames/avatar_quantum.svg', '/assets/frames/avatar_quantum.svg', 'level', '{"level": 30}'::jsonb, FALSE, 'epic', '{"theme": "quantum"}'::jsonb),
('frame_avatar_crown', 'avatar_frame', 'Imperial Crown of ENOS', 'Ornate crystalline crown for veteran guild champions.', '/assets/frames/avatar_crown.svg', '/assets/frames/avatar_crown.svg', 'level', '{"level": 75}'::jsonb, FALSE, 'legendary', '{"theme": "imperial"}'::jsonb),

-- --------------------------------------------------------------------
-- 3. THEME LAYERS (Stackable multi-layer backgrounds)
-- --------------------------------------------------------------------
-- Silver Identity Layers
('theme_silver_base', 'theme_layer', 'Silver Carbon Base', 'Deep slate carbon weave background layer.', '/assets/themes/silver_base.svg', '/assets/themes/silver_base.svg', 'starter', '{}'::jsonb, TRUE, 'common', '{"slot": "base", "theme": "silver"}'::jsonb),
('theme_silver_circuit', 'theme_layer', 'Silver Cyber Circuit', 'Subtle laser-etched metallic circuit network.', '/assets/themes/silver_circuit.svg', '/assets/themes/silver_circuit.svg', 'starter', '{}'::jsonb, TRUE, 'common', '{"slot": "overlay", "theme": "silver"}'::jsonb),
('theme_silver_vignette', 'theme_layer', 'Silver Dark Vignette', 'Deep edge shadows with subtle top chrome sheen.', '/assets/themes/silver_vignette.svg', '/assets/themes/silver_vignette.svg', 'starter', '{}'::jsonb, TRUE, 'common', '{"slot": "ambient", "theme": "silver"}'::jsonb),

-- Electric Violet Identity Layers
('theme_violet_base', 'theme_layer', 'Violet Void Base', 'Dark purple nebula gradient with star dust.', '/assets/themes/violet_base.svg', '/assets/themes/violet_base.svg', 'starter', '{}'::jsonb, TRUE, 'rare', '{"slot": "base", "theme": "violet"}'::jsonb),
('theme_violet_lightning', 'theme_layer', 'Violet Lightning Lattice', 'High-voltage electric lightning arcs and digital grids.', '/assets/themes/violet_lightning.svg', '/assets/themes/violet_lightning.svg', 'starter', '{}'::jsonb, TRUE, 'rare', '{"slot": "overlay", "theme": "violet"}'::jsonb),
('theme_violet_glow', 'theme_layer', 'Violet Plasma Aura', 'Ambient ultraviolet glow radiating from center.', '/assets/themes/violet_glow.svg', '/assets/themes/violet_glow.svg', 'starter', '{}'::jsonb, TRUE, 'rare', '{"slot": "ambient", "theme": "violet"}'::jsonb),

-- Flaming Golden Orange Identity Layers
('theme_flame_base', 'theme_layer', 'Solar Flare Base', 'Deep volcanic obsidian with molten core underlay.', '/assets/themes/flame_base.svg', '/assets/themes/flame_base.svg', 'starter', '{}'::jsonb, TRUE, 'rare', '{"slot": "base", "theme": "flame"}'::jsonb),
('theme_flame_embers', 'theme_layer', 'Golden Embers & Flames', 'Floating golden embers and stylized flame wisps.', '/assets/themes/flame_embers.svg', '/assets/themes/flame_embers.svg', 'starter', '{}'::jsonb, TRUE, 'rare', '{"slot": "overlay", "theme": "flame"}'::jsonb),
('theme_flame_radiance', 'theme_layer', 'Solar Radiance Burst', 'Warm sunburst radiance overlay.', '/assets/themes/flame_radiance.svg', '/assets/themes/flame_radiance.svg', 'starter', '{}'::jsonb, TRUE, 'rare', '{"slot": "ambient", "theme": "flame"}'::jsonb),

-- --------------------------------------------------------------------
-- 4. LEVEL MILESTONE EMBLEMS
-- --------------------------------------------------------------------
('emblem_starter_silver', 'emblem', 'Initiate Crest (Lv 1)', 'Standard Every Nation GG novice member crest.', '/assets/emblems/emblem_lv1.svg', '/assets/emblems/emblem_lv1.svg', 'starter', '{}'::jsonb, TRUE, 'common', '{"milestone_level": 1}'::jsonb),
('emblem_milestone_20', 'emblem', 'Iron Vanguard (Lv 20)', 'Forged iron crest awarded upon reaching Level 20.', '/assets/emblems/emblem_lv20.svg', '/assets/emblems/emblem_lv20.svg', 'level', '{"level": 20}'::jsonb, FALSE, 'rare', '{"milestone_level": 20}'::jsonb),
('emblem_milestone_40', 'emblem', 'Silver Archon (Lv 40)', 'Radiant silver twin-blade emblem for Level 40 veterans.', '/assets/emblems/emblem_lv40.svg', '/assets/emblems/emblem_lv40.svg', 'level', '{"level": 40}'::jsonb, FALSE, 'epic', '{"milestone_level": 40}'::jsonb),
('emblem_milestone_60', 'emblem', 'Electrum Reaper (Lv 60)', 'High-tier crest honoring master RPG raiders at Level 60.', '/assets/emblems/emblem_lv60.svg', '/assets/emblems/emblem_lv60.svg', 'level', '{"level": 60}'::jsonb, FALSE, 'legendary', '{"milestone_level": 60}'::jsonb),
('emblem_milestone_80', 'emblem', 'Obsidian Paragon (Lv 80)', 'Ancient obsidian monolith emblem for elite Level 80 titans.', '/assets/emblems/emblem_lv80.svg', '/assets/emblems/emblem_lv80.svg', 'level', '{"level": 80}'::jsonb, FALSE, 'legendary', '{"milestone_level": 80}'::jsonb),
('emblem_milestone_100', 'emblem', 'Celestial Sovereign (Lv 100)', 'Ultimate mythic emblem awarded upon achieving Level 100 mastery.', '/assets/emblems/emblem_lv100.svg', '/assets/emblems/emblem_lv100.svg', 'level', '{"level": 100}'::jsonb, FALSE, 'mythic', '{"milestone_level": 100}'::jsonb),

-- --------------------------------------------------------------------
-- 5. TITLES & TITLE FRAMES
-- --------------------------------------------------------------------
('title_vault_pioneer', 'title', 'VAULT PIONEER', 'Honoring founding participants of the EN Vault.', '/assets/titles/title_pioneer.svg', '/assets/titles/title_pioneer.svg', 'starter', '{}'::jsonb, TRUE, 'common', '{"title_text": "VAULT PIONEER"}'::jsonb),
('title_apex_raider', 'title', 'APEX RAIDER', 'Title forged in the fires of weekly World Boss battles.', '/assets/titles/title_raider.svg', '/assets/titles/title_raider.svg', 'achievement', '{"achievement_id": "boss_veteran"}'::jsonb, FALSE, 'rare', '{"title_text": "APEX RAIDER"}'::jsonb),
('title_neo_vanguard', 'title', 'NEO VANGUARD', 'Cybernetic vanguard title of Every Nation GG.', '/assets/titles/title_vanguard.svg', '/assets/titles/title_vanguard.svg', 'starter', '{}'::jsonb, TRUE, 'rare', '{"title_text": "NEO VANGUARD"}'::jsonb),
('title_celestial_archon', 'title', 'CELESTIAL ARCHON', 'Supreme honorary title for dedicated community leaders.', '/assets/titles/title_archon.svg', '/assets/titles/title_archon.svg', 'level', '{"level": 80}'::jsonb, FALSE, 'legendary', '{"title_text": "CELESTIAL ARCHON"}'::jsonb),
('title_eternal_sovereign', 'title', 'ETERNAL SOVEREIGN', 'The pinnacle title reserved for Level 100 achievers.', '/assets/titles/title_sovereign.svg', '/assets/titles/title_sovereign.svg', 'level', '{"level": 100}'::jsonb, FALSE, 'mythic', '{"title_text": "ETERNAL SOVEREIGN"}'::jsonb),

-- --------------------------------------------------------------------
-- 6. ACHIEVEMENT SHOWCASE BADGES (5 Showcase Slots)
-- --------------------------------------------------------------------
('badge_boss_slayer', 'badge', 'World Boss Slayer', 'Earned by participating in weekly World Boss combat in ENOS.', '/assets/badges/badge_boss.svg', '/assets/badges/badge_boss.svg', 'starter', '{}'::jsonb, TRUE, 'rare', '{"icon": "skull"}'::jsonb),
('badge_vault_pioneer', 'badge', 'Vault Pioneer', 'Awarded for active Vault Coin staking and community governance.', '/assets/badges/badge_vault.svg', '/assets/badges/badge_vault.svg', 'starter', '{}'::jsonb, TRUE, 'common', '{"icon": "coins"}'::jsonb),
('badge_quest_master', 'badge', 'Quest Master', 'Completed over 100 Daily Quests in the Every Nation Discord.', '/assets/badges/badge_quest.svg', '/assets/badges/badge_quest.svg', 'starter', '{}'::jsonb, TRUE, 'rare', '{"icon": "compass"}'::jsonb),
('badge_trivia_sage', 'badge', 'Trivia Sage', 'Proved supreme intellect in Daily Community Trivia.', '/assets/badges/badge_trivia.svg', '/assets/badges/badge_trivia.svg', 'starter', '{}'::jsonb, TRUE, 'rare', '{"icon": "brain"}'::jsonb),
('badge_guild_champion', 'badge', 'Guild Champion', 'Top contributor in Every Nation GG seasonal rankings.', '/assets/badges/badge_guild.svg', '/assets/badges/badge_guild.svg', 'starter', '{}'::jsonb, TRUE, 'epic', '{"icon": "trophy"}'::jsonb),
('badge_ap_conqueror', 'badge', 'AP Conqueror', 'Maxed out weekly action points 20 weeks in a row.', '/assets/badges/badge_conqueror.svg', '/assets/badges/badge_conqueror.svg', 'achievement', '{"achievement_id": "ap_20"}'::jsonb, FALSE, 'legendary', '{"icon": "zap"}'::jsonb),
('badge_flawless_streak', 'badge', 'Flawless 365 Streak', 'Maintained daily community check-ins for an entire calendar year.', '/assets/badges/badge_streak.svg', '/assets/badges/badge_streak.svg', 'achievement', '{"achievement_id": "streak_365"}'::jsonb, FALSE, 'mythic', '{"icon": "flame"}'::jsonb)

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    asset_url = EXCLUDED.asset_url,
    preview_url = EXCLUDED.preview_url,
    unlock_type = EXCLUDED.unlock_type,
    unlock_req = EXCLUDED.unlock_req,
    is_starter = EXCLUDED.is_starter,
    rarity = EXCLUDED.rarity,
    metadata = EXCLUDED.metadata;
