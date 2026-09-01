// ====================================================================
// EN PROFILE — Level 1–100 Progression Curve Engine
// ====================================================================
import { ProgressionStats } from "./types";

/**
 * Progression Constants
 * Level 1: 0 EXP
 * Level 30: 83,429 EXP (~1 year of consistent ENOS participation)
 * Level 100: 417,143 EXP (~5 years of master ENOS participation)
 */
const EXP_COEFFICIENT = 1012.62534;
const EXP_EXPONENT = 1.310805;

// Precomputed exact threshold cache for Levels 1 to 100
const LEVEL_EXP_TABLE: number[] = [0]; // 0-indexed dummy, level 1 starts at index 1

for (let lvl = 1; lvl <= 100; lvl++) {
  if (lvl === 1) {
    LEVEL_EXP_TABLE[lvl] = 0;
  } else if (lvl === 30) {
    LEVEL_EXP_TABLE[lvl] = 83429;
  } else if (lvl === 100) {
    LEVEL_EXP_TABLE[lvl] = 417143;
  } else {
    LEVEL_EXP_TABLE[lvl] = Math.round(
      EXP_COEFFICIENT * Math.pow(lvl - 1, EXP_EXPONENT)
    );
  }
}

/**
 * Get cumulative EXP required to reach a specific level (1-100)
 */
export function getExpForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level >= 100) return LEVEL_EXP_TABLE[100];
  return LEVEL_EXP_TABLE[level] ?? 0;
}

/**
 * Calculate Profile Level from cumulative Profile EXP
 */
export function getLevelFromExp(exp: number): number {
  if (!exp || exp <= 0) return 1;
  if (exp >= LEVEL_EXP_TABLE[100]) return 100;

  for (let lvl = 100; lvl >= 1; lvl--) {
    if (exp >= LEVEL_EXP_TABLE[lvl]) {
      return lvl;
    }
  }
  return 1;
}

/**
 * Milestone Emblems metadata
 */
export const MILESTONE_EMBLEMS = [
  {
    milestoneLevel: 100,
    id: "emblem_milestone_100",
    name: "Celestial Sovereign",
    assetUrl: "/assets/emblems/emblem_lv100.svg",
    color: "#E0E7FF",
  },
  {
    milestoneLevel: 80,
    id: "emblem_milestone_80",
    name: "Obsidian Paragon",
    assetUrl: "/assets/emblems/emblem_lv80.svg",
    color: "#F43F5E",
  },
  {
    milestoneLevel: 60,
    id: "emblem_milestone_60",
    name: "Electrum Reaper",
    assetUrl: "/assets/emblems/emblem_lv60.svg",
    color: "#A855F7",
  },
  {
    milestoneLevel: 40,
    id: "emblem_milestone_40",
    name: "Silver Archon",
    assetUrl: "/assets/emblems/emblem_lv40.svg",
    color: "#38BDF8",
  },
  {
    milestoneLevel: 20,
    id: "emblem_milestone_20",
    name: "Iron Vanguard",
    assetUrl: "/assets/emblems/emblem_lv20.svg",
    color: "#F59E0B",
  },
  {
    milestoneLevel: 1,
    id: "emblem_starter_silver",
    name: "Initiate Crest",
    assetUrl: "/assets/emblems/emblem_lv1.svg",
    color: "#94A3B8",
  },
];

/**
 * Determine the milestone emblem earned based on current level
 */
export function getMilestoneEmblemForLevel(level: number) {
  for (const milestone of MILESTONE_EMBLEMS) {
    if (level >= milestone.milestoneLevel) {
      return milestone;
    }
  }
  return MILESTONE_EMBLEMS[MILESTONE_EMBLEMS.length - 1];
}

/**
 * Get the next milestone level target (or null if maxed)
 */
export function getNextMilestoneLevel(level: number): number | null {
  const milestoneLevels = [20, 40, 60, 80, 100];
  for (const m of milestoneLevels) {
    if (level < m) return m;
  }
  return null;
}

/**
 * Compute full progression breakdown for display and UI
 */
export function calculateProgressionStats(totalExp: number): ProgressionStats {
  const level = getLevelFromExp(totalExp);
  const currentLevelExp = getExpForLevel(level);
  const nextLevelExp =
    level < 100 ? getExpForLevel(level + 1) : getExpForLevel(100);

  const expIntoCurrentLevel = totalExp - currentLevelExp;
  const levelExpRange = nextLevelExp - currentLevelExp;

  const progressPercent =
    level >= 100
      ? 100
      : levelExpRange > 0
      ? Math.min(100, Math.max(0, (expIntoCurrentLevel / levelExpRange) * 100))
      : 100;

  const expRemaining = Math.max(0, nextLevelExp - totalExp);
  const milestoneEmblem = getMilestoneEmblemForLevel(level);
  const nextMilestoneLevel = getNextMilestoneLevel(level);

  return {
    level,
    totalExp,
    currentLevelExp,
    nextLevelExp,
    expIntoCurrentLevel,
    progressPercent,
    expRemaining,
    milestoneEmblem,
    nextMilestoneLevel,
  };
}

/**
 * Daily & Weekly Activity EXP rewards
 */
export const EXP_SOURCES = {
  DAILY_QUEST: {
    name: "Daily Quest",
    expPerAction: 50,
    maxDaily: 3,
    maxDailyExp: 150,
  },
  DAILY_TRIVIA: {
    name: "Daily Trivia",
    expPerAction: 25,
    maxDaily: 1,
    maxDailyExp: 25,
  },
  WORLD_BOSS: {
    name: "Weekly World Boss",
    expPerAP: 75,
    maxWeeklyAP: 5,
    maxWeeklyExp: 375,
  },
  MAX_WEEKLY_EXP: 1600,
};
