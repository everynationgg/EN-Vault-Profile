// ====================================================================
// EN PROFILE (EN-Vault-Profile) — Core Type Definitions
// ====================================================================

export type AssetCategory =
  | "avatar_frame"
  | "card_frame"
  | "theme_layer"
  | "title"
  | "emblem"
  | "badge";

export type UnlockType =
  | "starter"
  | "level"
  | "achievement"
  | "vault_coins"
  | "exclusive";

export type AssetRarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export interface UnlockRequirement {
  level?: number;
  achievement_id?: string;
  vault_coins_cost?: number;
  exclusive_code?: string;
}

export interface ProfileAsset {
  id: string;
  category: AssetCategory;
  name: string;
  description: string;
  asset_url: string;
  preview_url: string;
  unlock_type: UnlockType;
  unlock_req: UnlockRequirement;
  is_starter: boolean;
  rarity: AssetRarity;
  metadata?: {
    theme?: string;
    slot?: "base" | "overlay" | "ambient";
    milestone_level?: number;
    title_text?: string;
    icon?: string;
    [key: string]: unknown;
  };
}

export interface EquippedCosmetics {
  nameFont: string;
  nameColor: string;
  titleId: string;
  titleColor: string;
  emblemId: string;
  emblemColor: string;
  avatarFrameId: string;
  cardFrameId: string;
  themeLayers: string[];
  coinColor: string;
  achievementSlots: string[]; // Exactly 5 slots
  customAvatarUrl?: string;
}

export interface UserProfileState {
  userId: string;
  guildId: string;
  discordUsername: string;
  discordDisplayName: string;
  discordAvatarUrl: string;
  customAvatarUrl?: string;
  profileExp: number;
  profileLevel: number;
  vaultCoins: number;
  equipped: EquippedCosmetics;
  unlockedAssetIds: string[];
  updatedAt?: string;
}

export type HotspotZone =
  | "avatar"
  | "name"
  | "title"
  | "emblem"
  | "card_frame"
  | "theme"
  | "coins"
  | "achievements";

export interface HotspotCallout {
  id: HotspotZone;
  label: string;
  description: string;
  // Coordinates as percentage on 1200 x 675 canvas
  x: number; // 0 to 100%
  y: number; // 0 to 100%
  category: AssetCategory | "name_customizer" | "coins_customizer" | "theme_stack";
}

export interface ProgressionStats {
  level: number;
  totalExp: number;
  currentLevelExp: number;
  nextLevelExp: number;
  expIntoCurrentLevel: number;
  progressPercent: number;
  expRemaining: number;
  milestoneEmblem: {
    id: string;
    name: string;
    assetUrl: string;
    milestoneLevel: number;
  };
  nextMilestoneLevel: number | null;
}
