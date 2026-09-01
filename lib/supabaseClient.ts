// ====================================================================
// EN PROFILE — Supabase Client Provider
// Safe graceful fallback for local preview / mock mode
// ====================================================================
import { createClient } from "@supabase/supabase-js";
import { UserProfileState } from "./types";
import { DEMO_PROFILES } from "./assetsCatalog";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-project.supabase.co" &&
    !supabaseUrl.includes("your-project")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch profile state by user ID (or return default demo profile)
 */
export async function getProfileState(
  userId: string
): Promise<UserProfileState> {
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("profile_user_states")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        // Fetch user unlocks
        const { data: unlockData } = await supabase
          .from("profile_user_unlocks")
          .select("asset_id")
          .eq("user_id", userId);

        return {
          userId: data.user_id,
          guildId: data.guild_id,
          discordUsername: data.discord_username,
          discordDisplayName: data.discord_display_name,
          discordAvatarUrl: data.discord_avatar_url,
          customAvatarUrl: data.custom_avatar_url,
          profileExp: Number(data.profile_exp),
          profileLevel: data.profile_level,
          vaultCoins: Number(data.vault_coins),
          equipped: {
            nameFont: data.equipped_name_font,
            nameColor: data.equipped_name_color,
            titleId: data.equipped_title_id,
            titleColor: data.equipped_title_color,
            emblemId: data.equipped_emblem_id,
            emblemColor: data.equipped_emblem_color,
            avatarFrameId: data.equipped_avatar_frame_id,
            cardFrameId: data.equipped_card_frame_id,
            themeLayers: data.equipped_theme_layers || [],
            coinColor: data.equipped_coin_color,
            achievementSlots: data.equipped_achievement_slots || [],
            customAvatarUrl: data.custom_avatar_url,
          },
          unlockedAssetIds: (unlockData || []).map((u) => u.asset_id),
          updatedAt: data.updated_at,
        };
      }
    } catch (e) {
      console.warn("Supabase fetch error, using fallback profile:", e);
    }
  }

  // Safe fallback to demo profile
  return DEMO_PROFILES.veteran;
}
