"use client";

import React from "react";
import {
  UserProfileState,
  HotspotZone,
  EquippedCosmetics,
  AssetCategory,
} from "@/lib/types";
import {
  ASSET_CATALOG,
  getAssetsByCategory,
  STARTER_IDENTITIES,
} from "@/lib/assetsCatalog";
import { ColorPickerControl } from "./ColorPickerControl";
import { FontSelectorControl } from "./FontSelectorControl";
import { LayerOrganizer } from "./LayerOrganizer";
import { AchievementSlotPicker } from "./AchievementSlotPicker";
import {
  Sparkles,
  User,
  Type,
  Shield,
  Award,
  Layers,
  Coins,
  Square,
  Lock,
  Check,
  Zap,
  Flame,
  CircleDot,
  Upload,
} from "lucide-react";

interface CosmeticDrawerProps {
  profile: UserProfileState;
  activeHotspot: HotspotZone;
  onSelectHotspot: (zone: HotspotZone) => void;
  onUpdateEquipped: (newEquipped: Partial<EquippedCosmetics>) => void;
  onUpdateAvatarUrl: (url: string) => void;
  onApplyStarterIdentity: (identityKey: "silver" | "violet" | "flame") => void;
}

export const CosmeticDrawer: React.FC<CosmeticDrawerProps> = ({
  profile,
  activeHotspot,
  onSelectHotspot,
  onUpdateEquipped,
  onUpdateAvatarUrl,
  onApplyStarterIdentity,
}) => {
  const tabs = [
    { id: "avatar" as HotspotZone, label: "Avatar & Frame", icon: User },
    { id: "name" as HotspotZone, label: "Name & Font", icon: Type },
    { id: "title" as HotspotZone, label: "Title & Frame", icon: Award },
    { id: "emblem" as HotspotZone, label: "Milestone Emblem", icon: Shield },
    { id: "card_frame" as HotspotZone, label: "Card Frame", icon: Square },
    { id: "theme" as HotspotZone, label: "Multi-Layer Theme", icon: Layers },
    { id: "coins" as HotspotZone, label: "Vault Coins", icon: Coins },
    { id: "achievements" as HotspotZone, label: "5-Badges Showcase", icon: Award },
  ];

  return (
    <div
      className="glass-panel"
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "24px auto 0 auto",
        borderRadius: "20px",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      {/* 3 Instant Starter Identities Quick Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          paddingBottom: "14px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={18} color="#38BDF8" />
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 800,
              letterSpacing: "1.5px",
              color: "#F8FAFC",
              textTransform: "uppercase",
            }}
          >
            Quick 1-Click Starter Identity Themes:
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onApplyStarterIdentity("silver")}
            style={{
              padding: "6px 14px",
              fontSize: "0.85rem",
              border: "1px solid #94A3B8",
              background: "rgba(148, 163, 184, 0.12)",
            }}
          >
            <CircleDot size={14} color="#E2E8F0" />
            Silver Vanguard
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onApplyStarterIdentity("violet")}
            style={{
              padding: "6px 14px",
              fontSize: "0.85rem",
              border: "1px solid #A855F7",
              background: "rgba(168, 85, 247, 0.12)",
              color: "#F3E8FF",
            }}
          >
            <Zap size={14} color="#C084FC" />
            Electric Violet
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onApplyStarterIdentity("flame")}
            style={{
              padding: "6px 14px",
              fontSize: "0.85rem",
              border: "1px solid #F59E0B",
              background: "rgba(245, 158, 11, 0.12)",
              color: "#FEF3C7",
            }}
          >
            <Flame size={14} color="#F59E0B" />
            Flaming Golden Orange
          </button>
        </div>
      </div>

      {/* Category Tabs Scrollbar */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "6px",
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeHotspot === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectHotspot(tab.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "10px",
                whiteSpace: "nowrap",
                fontSize: "0.85rem",
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                letterSpacing: "0.8px",
                cursor: "pointer",
                background: isActive
                  ? "rgba(56, 189, 248, 0.2)"
                  : "rgba(15, 23, 42, 0.6)",
                color: isActive ? "#38BDF8" : "#94A3B8",
                border: isActive
                  ? "1.5px solid #38BDF8"
                  : "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: isActive ? "0 0 12px rgba(56, 189, 248, 0.25)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ==================================================================
          TAB CONTENTS
          ================================================================== */}
      <div
        style={{
          background: "rgba(11, 15, 25, 0.6)",
          borderRadius: "14px",
          padding: "20px",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        {/* 1. AVATAR & AVATAR FRAME TAB */}
        {activeHotspot === "avatar" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Custom Avatar Upload / URL */}
            <div>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  color: "#94A3B8",
                  textTransform: "uppercase",
                }}
              >
                Profile Photo (Discord PFP / Custom URL)
              </span>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "8px",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  placeholder="Paste custom image URL (https://...)"
                  defaultValue={profile.customAvatarUrl || ""}
                  onBlur={(e) => onUpdateAvatarUrl(e.target.value)}
                  style={{
                    flex: 1,
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    color: "#FFFFFF",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() =>
                    onUpdateAvatarUrl(
                      `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}`
                    )
                  }
                  style={{ padding: "10px 16px" }}
                >
                  <Sparkles size={14} />
                  Randomize PFP
                </button>
              </div>
            </div>

            {/* Avatar Frames Grid */}
            <div>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  color: "#94A3B8",
                  textTransform: "uppercase",
                }}
              >
                Equip Avatar Frame
              </span>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "12px",
                  marginTop: "10px",
                }}
              >
                {getAssetsByCategory("avatar_frame").map((item) => {
                  const isEquipped = profile.equipped.avatarFrameId === item.id;
                  const isUnlocked =
                    item.is_starter ||
                    profile.unlockedAssetIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        isUnlocked &&
                        onUpdateEquipped({ avatarFrameId: item.id })
                      }
                      disabled={!isUnlocked}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        borderRadius: "10px",
                        background: isEquipped
                          ? "rgba(56, 189, 248, 0.15)"
                          : isUnlocked
                          ? "rgba(15, 23, 42, 0.6)"
                          : "rgba(15, 23, 42, 0.3)",
                        border: isEquipped
                          ? "1.5px solid #38BDF8"
                          : isUnlocked
                          ? "1px solid rgba(255, 255, 255, 0.1)"
                          : "1px solid rgba(255, 255, 255, 0.05)",
                        cursor: isUnlocked ? "pointer" : "not-allowed",
                        textAlign: "left",
                        opacity: isUnlocked ? 1 : 0.5,
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <img
                          src={item.asset_url}
                          alt={item.name}
                          style={{
                            width: "48px",
                            height: "48px",
                            objectFit: "contain",
                          }}
                        />
                        {!isUnlocked && (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "rgba(0,0,0,0.6)",
                              borderRadius: "50%",
                            }}
                          >
                            <Lock size={16} color="#94A3B8" />
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: isEquipped ? "#38BDF8" : "#F8FAFC",
                          }}
                        >
                          {item.name}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                          {isUnlocked
                            ? item.rarity.toUpperCase()
                            : `Requires Lv. ${item.unlock_req?.level || 0}`}
                        </div>
                      </div>
                      {isEquipped && (
                        <Check size={16} color="#38BDF8" strokeWidth={3} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. NAME & FONT TAB */}
        {activeHotspot === "name" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <ColorPickerControl
              label="Display Name Neon Color"
              currentColor={profile.equipped.nameColor}
              onChange={(hex) => onUpdateEquipped({ nameColor: hex })}
            />
            <FontSelectorControl
              currentFont={profile.equipped.nameFont}
              previewText={profile.discordDisplayName}
              onChange={(fontId) => onUpdateEquipped({ nameFont: fontId })}
            />
          </div>
        )}

        {/* 3. TITLE & TITLE FRAME TAB */}
        {activeHotspot === "title" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <ColorPickerControl
              label="Title Frame Border & Glow Color"
              currentColor={profile.equipped.titleColor}
              onChange={(hex) => onUpdateEquipped({ titleColor: hex })}
            />
            <div>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  color: "#94A3B8",
                  textTransform: "uppercase",
                }}
              >
                Equip Honorary Title
              </span>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                {getAssetsByCategory("title").map((item) => {
                  const isEquipped = profile.equipped.titleId === item.id;
                  const isUnlocked =
                    item.is_starter ||
                    profile.unlockedAssetIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        isUnlocked && onUpdateEquipped({ titleId: item.id })
                      }
                      disabled={!isUnlocked}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "10px",
                        background: isEquipped
                          ? "rgba(56, 189, 248, 0.15)"
                          : isUnlocked
                          ? "rgba(15, 23, 42, 0.6)"
                          : "rgba(15, 23, 42, 0.3)",
                        border: isEquipped
                          ? "1.5px solid #38BDF8"
                          : isUnlocked
                          ? "1px solid rgba(255, 255, 255, 0.1)"
                          : "1px solid rgba(255, 255, 255, 0.05)",
                        cursor: isUnlocked ? "pointer" : "not-allowed",
                        textAlign: "left",
                        opacity: isUnlocked ? 1 : 0.5,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.95rem",
                            fontWeight: 800,
                            fontFamily: "Rajdhani, sans-serif",
                            color: isEquipped ? "#38BDF8" : "#FFFFFF",
                            letterSpacing: "2px",
                          }}
                        >
                          {item.name}
                        </span>
                        {isEquipped ? (
                          <Check size={16} color="#38BDF8" strokeWidth={3} />
                        ) : !isUnlocked ? (
                          <Lock size={14} color="#94A3B8" />
                        ) : null}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#94A3B8",
                          marginTop: "4px",
                        }}
                      >
                        {item.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4. MILESTONE EMBLEM TAB */}
        {activeHotspot === "emblem" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <ColorPickerControl
              label="Milestone Emblem Ambient Aura Glow"
              currentColor={profile.equipped.emblemColor}
              onChange={(hex) => onUpdateEquipped({ emblemColor: hex })}
            />
            <div>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  color: "#94A3B8",
                  textTransform: "uppercase",
                }}
              >
                Level Milestone Emblems (Earned at Lv. 20, 40, 60, 80, 100)
              </span>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "12px",
                  marginTop: "10px",
                }}
              >
                {getAssetsByCategory("emblem").map((item) => {
                  const reqLevel =
                    (item.metadata?.milestone_level as number) ||
                    item.unlock_req?.level ||
                    1;
                  const isEarned = profile.profileLevel >= reqLevel;
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "14px",
                        borderRadius: "12px",
                        background: isEarned
                          ? "rgba(15, 23, 42, 0.7)"
                          : "rgba(15, 23, 42, 0.3)",
                        border: isEarned
                          ? "1px solid rgba(56, 189, 248, 0.3)"
                          : "1px solid rgba(255, 255, 255, 0.05)",
                        opacity: isEarned ? 1 : 0.45,
                        textAlign: "center",
                      }}
                    >
                      <img
                        src={item.asset_url}
                        alt={item.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "contain",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: isEarned ? "#FFFFFF" : "#94A3B8",
                          marginTop: "8px",
                        }}
                      >
                        {item.name}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: isEarned ? "#38BDF8" : "#EF4444",
                          marginTop: "2px",
                        }}
                      >
                        {isEarned ? "UNLOCKED" : `Requires Level ${reqLevel}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 5. CARD FRAME TAB */}
        {activeHotspot === "card_frame" && (
          <div>
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "1px",
                color: "#94A3B8",
                textTransform: "uppercase",
              }}
            >
              1200 × 675 Card Outer Border
            </span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "12px",
                marginTop: "10px",
              }}
            >
              {getAssetsByCategory("card_frame").map((item) => {
                const isEquipped = profile.equipped.cardFrameId === item.id;
                const isUnlocked =
                  item.is_starter || profile.unlockedAssetIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      isUnlocked && onUpdateEquipped({ cardFrameId: item.id })
                    }
                    disabled={!isUnlocked}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      padding: "12px",
                      borderRadius: "10px",
                      background: isEquipped
                        ? "rgba(56, 189, 248, 0.15)"
                        : isUnlocked
                        ? "rgba(15, 23, 42, 0.6)"
                        : "rgba(15, 23, 42, 0.3)",
                      border: isEquipped
                        ? "1.5px solid #38BDF8"
                        : isUnlocked
                        ? "1px solid rgba(255, 255, 255, 0.1)"
                        : "1px solid rgba(255, 255, 255, 0.05)",
                      cursor: isUnlocked ? "pointer" : "not-allowed",
                      textAlign: "left",
                      opacity: isUnlocked ? 1 : 0.5,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          color: isEquipped ? "#38BDF8" : "#F8FAFC",
                        }}
                      >
                        {item.name}
                      </span>
                      {isEquipped ? (
                        <Check size={16} color="#38BDF8" strokeWidth={3} />
                      ) : !isUnlocked ? (
                        <Lock size={14} color="#94A3B8" />
                      ) : null}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                      {item.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. MULTI-LAYER THEME TAB */}
        {activeHotspot === "theme" && (
          <LayerOrganizer
            equippedLayers={profile.equipped.themeLayers}
            onChangeLayers={(newLayers) =>
              onUpdateEquipped({ themeLayers: newLayers })
            }
          />
        )}

        {/* 7. VAULT COINS TAB */}
        {activeHotspot === "coins" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <ColorPickerControl
              label="Vault Coins Badge & Number Accent Color"
              currentColor={profile.equipped.coinColor}
              onChange={(hex) => onUpdateEquipped({ coinColor: hex })}
            />
            <div
              style={{
                background: "rgba(15, 23, 42, 0.7)",
                borderRadius: "10px",
                padding: "16px",
                border: "1px solid rgba(245, 158, 11, 0.2)",
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#F59E0B",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Authoritative ENOS Staking Balance
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  marginTop: "4px",
                  fontFamily: "Rajdhani, sans-serif",
                }}
              >
                {profile.vaultCoins.toLocaleString()} Coins
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#94A3B8",
                  marginTop: "4px",
                }}
              >
                Vault coins are earned via Discord community activities, weekly
                boss raids, and guild quests in Every Nation GG.
              </p>
            </div>
          </div>
        )}

        {/* 8. 5-BADGES SHOWCASE TAB */}
        {activeHotspot === "achievements" && (
          <AchievementSlotPicker
            equippedSlots={profile.equipped.achievementSlots}
            unlockedAssetIds={profile.unlockedAssetIds}
            onUpdateSlots={(newSlots) =>
              onUpdateEquipped({ achievementSlots: newSlots })
            }
          />
        )}
      </div>
    </div>
  );
};
