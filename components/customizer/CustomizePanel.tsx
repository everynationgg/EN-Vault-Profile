"use client";

import React, { useRef } from "react";
import { UserProfileState, EquippedCosmetics, ProfileAsset } from "@/lib/types";
import {
  ASSET_CATALOG,
  getAssetsByCategory,
  AVAILABLE_FONTS,
  CURATED_COLOR_SWATCHES,
} from "@/lib/assetsCatalog";
import {
  User,
  Square,
  Image as ImageIcon,
  Award,
  Type,
  Palette,
  Shield,
  Trophy,
  Check,
  Lock,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Save,
} from "lucide-react";

interface CustomizePanelProps {
  profile: UserProfileState;
  onUpdateEquipped: (newEquipped: Partial<EquippedCosmetics>) => void;
  onReset: () => void;
  onSave: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
}

export const CustomizePanel: React.FC<CustomizePanelProps> = ({
  profile,
  onUpdateEquipped,
  onReset,
  onSave,
  isSaving,
  saveSuccess,
}) => {
  const avatarFrames = getAssetsByCategory("avatar_frame");
  const cardFrames = getAssetsByCategory("card_frame");
  const backgrounds = getAssetsByCategory("theme_layer");
  const titles = getAssetsByCategory("title");
  const emblems = getAssetsByCategory("emblem");
  const badges = getAssetsByCategory("badge");

  // Helper for scroll buttons
  const scrollContainer = (id: string, offset: number) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: "20px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        background: "rgba(11, 15, 25, 0.75)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          paddingBottom: "14px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "1px",
              lineHeight: 1.1,
            }}
          >
            CUSTOMIZE PROFILE
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#94A3B8", marginTop: "4px" }}>
            Select and customize your profile assets
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onReset}
            style={{ padding: "8px 16px", fontSize: "0.85rem", fontWeight: 700 }}
          >
            RESET
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={onSave}
            disabled={isSaving}
            style={{
              padding: "8px 20px",
              fontSize: "0.85rem",
              fontWeight: 700,
              background: saveSuccess
                ? "linear-gradient(135deg, #10B981, #059669)"
                : "linear-gradient(135deg, #8B5CF6, #6D28D9)",
              color: "#FFFFFF",
              boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
            }}
          >
            {saveSuccess ? (
              <>
                <Check size={16} color="#FFFFFF" strokeWidth={3} />
                SAVED
              </>
            ) : (
              <>
                <Save size={16} />
                {isSaving ? "SAVING..." : "SAVE CHANGES"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ==============================================================
          CATEGORY ROWS CONTAINER
          ============================================================== */}
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        
        {/* ROW 1: AVATAR FRAME */}
        <div className="category-row">
          <div className="category-meta">
            <div className="category-icon-box">
              <User size={20} color="#C084FC" />
            </div>
            <div className="category-titles">
              <div className="category-title">AVATAR FRAME</div>
              <div className="category-sub">Frame around your avatar</div>
            </div>
          </div>
          <div className="category-options-track" id="track-avatar-frame">
            {avatarFrames.map((item) => {
              const isEquipped = profile.equipped.avatarFrameId === item.id;
              const isUnlocked =
                item.is_starter || profile.unlockedAssetIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    isUnlocked && onUpdateEquipped({ avatarFrameId: item.id })
                  }
                  className={`asset-tile ${isEquipped ? "equipped" : ""} ${
                    !isUnlocked ? "locked" : ""
                  }`}
                  title={item.name}
                >
                  <img
                    src={item.asset_url}
                    alt={item.name}
                    className="tile-img"
                  />
                  {isEquipped && (
                    <div className="equipped-badge">
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    </div>
                  )}
                  {!isUnlocked && (
                    <div className="locked-badge">
                      <Lock size={12} color="#94A3B8" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ROW 2: CARD FRAME */}
        <div className="category-row">
          <div className="category-meta">
            <div className="category-icon-box">
              <Square size={20} color="#C084FC" />
            </div>
            <div className="category-titles">
              <div className="category-title">CARD FRAME</div>
              <div className="category-sub">Frame around your profile card</div>
            </div>
          </div>
          <div className="category-options-track" id="track-card-frame">
            {cardFrames.map((item) => {
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
                  className={`asset-tile card-frame-tile ${
                    isEquipped ? "equipped" : ""
                  } ${!isUnlocked ? "locked" : ""}`}
                  title={item.name}
                >
                  <img
                    src={item.asset_url}
                    alt={item.name}
                    className="tile-img-frame"
                  />
                  {isEquipped && (
                    <div className="equipped-badge">
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    </div>
                  )}
                  {!isUnlocked && (
                    <div className="locked-badge">
                      <Lock size={12} color="#94A3B8" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ROW 3: BACKGROUND */}
        <div className="category-row">
          <div className="category-meta">
            <div className="category-icon-box">
              <ImageIcon size={20} color="#C084FC" />
            </div>
            <div className="category-titles">
              <div className="category-title">BACKGROUND</div>
              <div className="category-sub">Background of your profile</div>
            </div>
          </div>
          <div className="category-options-track" id="track-backgrounds">
            {backgrounds.map((item) => {
              const isEquipped = profile.equipped.themeLayers.includes(item.id);
              const isUnlocked =
                item.is_starter || profile.unlockedAssetIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    isUnlocked && onUpdateEquipped({ themeLayers: [item.id] })
                  }
                  className={`asset-tile bg-tile ${
                    isEquipped ? "equipped" : ""
                  } ${!isUnlocked ? "locked" : ""}`}
                  title={item.name}
                >
                  <img
                    src={item.asset_url}
                    alt={item.name}
                    className="tile-img-bg"
                  />
                  {isEquipped && (
                    <div className="equipped-badge">
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    </div>
                  )}
                  {!isUnlocked && (
                    <div className="locked-badge">
                      <Lock size={12} color="#94A3B8" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ROW 4: TITLE */}
        <div className="category-row">
          <div className="category-meta">
            <div className="category-icon-box">
              <Award size={20} color="#F59E0B" />
            </div>
            <div className="category-titles">
              <div className="category-title">TITLE</div>
              <div className="category-sub">Your profile title</div>
            </div>
          </div>
          <div className="category-options-track" id="track-titles">
            {titles.map((item) => {
              const isEquipped = profile.equipped.titleId === item.id;
              const isUnlocked =
                item.is_starter || profile.unlockedAssetIds.includes(item.id);
              const titleColor =
                (item.metadata?.color as string) || "#FFFFFF";
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    isUnlocked &&
                    onUpdateEquipped({
                      titleId: item.id,
                      titleColor: titleColor,
                    })
                  }
                  className={`asset-tile title-tile ${
                    isEquipped ? "equipped" : ""
                  } ${!isUnlocked ? "locked" : ""}`}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      color: titleColor,
                      letterSpacing: "1px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.name}
                  </span>
                  {isEquipped && (
                    <div className="equipped-badge">
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    </div>
                  )}
                  {!isUnlocked && (
                    <div className="locked-badge">
                      <Lock size={12} color="#94A3B8" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ROW 5: FONT */}
        <div className="category-row">
          <div className="category-meta">
            <div className="category-icon-box">
              <Type size={20} color="#C084FC" />
            </div>
            <div className="category-titles">
              <div className="category-title">FONT</div>
              <div className="category-sub">Font for your name</div>
            </div>
          </div>
          <div className="category-options-track" id="track-fonts">
            {AVAILABLE_FONTS.map((font) => {
              const isEquipped = profile.equipped.nameFont === font.id;
              return (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => onUpdateEquipped({ nameFont: font.id })}
                  className={`asset-tile font-tile ${
                    isEquipped ? "equipped" : ""
                  }`}
                  title={font.name}
                >
                  <span
                    style={{
                      fontFamily: font.id,
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      color: isEquipped ? "#C084FC" : "#FFFFFF",
                      letterSpacing: "1.5px",
                    }}
                  >
                    {font.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ROW 6: NAME COLOR */}
        <div className="category-row">
          <div className="category-meta">
            <div className="category-icon-box">
              <Palette size={20} color="#C084FC" />
            </div>
            <div className="category-titles">
              <div className="category-title">NAME COLOR</div>
              <div className="category-sub">Color for your name</div>
            </div>
          </div>
          <div className="category-options-track" id="track-colors">
            {CURATED_COLOR_SWATCHES.map((swatch) => {
              const isEquipped =
                profile.equipped.nameColor.toLowerCase() ===
                swatch.hex.toLowerCase();
              return (
                <button
                  key={swatch.hex}
                  type="button"
                  onClick={() => onUpdateEquipped({ nameColor: swatch.hex })}
                  className={`asset-tile color-swatch-tile ${
                    isEquipped ? "equipped" : ""
                  }`}
                  style={{
                    backgroundColor: swatch.hex,
                  }}
                  title={swatch.label}
                >
                  {isEquipped && (
                    <Check
                      size={14}
                      color={swatch.hex === "#FFFFFF" ? "#000000" : "#FFFFFF"}
                      strokeWidth={3}
                    />
                  )}
                </button>
              );
            })}

            {/* Rainbow Color Picker Swatch */}
            <label
              className="asset-tile color-swatch-tile rainbow-swatch"
              title="Custom HEX Color"
              style={{
                cursor: "pointer",
                position: "relative",
              }}
            >
              <input
                type="color"
                value={profile.equipped.nameColor}
                onChange={(e) => onUpdateEquipped({ nameColor: e.target.value })}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}
              />
            </label>
          </div>
        </div>

        {/* ROW 7: MAIN EMBLEM */}
        <div className="category-row">
          <div className="category-meta">
            <div className="category-icon-box">
              <Shield size={20} color="#F59E0B" />
            </div>
            <div className="category-titles">
              <div className="category-title">MAIN EMBLEM</div>
              <div className="category-sub">Your level emblem</div>
            </div>
          </div>
          <div className="category-options-track" id="track-emblems">
            {emblems.map((item) => {
              const reqLevel =
                (item.metadata?.milestone_level as number) ||
                item.unlock_req?.level ||
                1;
              const isEarned = profile.profileLevel >= reqLevel;
              const isEquipped = profile.equipped.emblemId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    isEarned &&
                    onUpdateEquipped({
                      emblemId: item.id,
                      emblemColor: (item.metadata?.color as string) || "#C084FC",
                    })
                  }
                  className={`asset-tile emblem-tile ${
                    isEquipped ? "equipped" : ""
                  } ${!isEarned ? "locked" : ""}`}
                  title={`${item.name} (Lv. ${reqLevel})`}
                >
                  <img
                    src={item.asset_url}
                    alt={item.name}
                    className="tile-img"
                  />
                  {isEquipped && (
                    <div className="equipped-badge">
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    </div>
                  )}
                  {!isEarned && (
                    <div className="locked-badge">
                      <Lock size={12} color="#94A3B8" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ROW 8: BADGE SHOWCASE */}
        <div className="category-row">
          <div className="category-meta">
            <div className="category-icon-box">
              <Trophy size={20} color="#C084FC" />
            </div>
            <div className="category-titles">
              <div className="category-title">BADGE SHOWCASE</div>
              <div className="category-sub">Select 5 achievement badges</div>
            </div>
          </div>
          <div className="category-options-track" id="track-badges">
            {badges.map((item) => {
              const isEquipped = profile.equipped.achievementSlots.includes(
                item.id
              );
              const isUnlocked =
                item.is_starter || profile.unlockedAssetIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (!isUnlocked) return;
                    let newSlots = [...profile.equipped.achievementSlots];
                    if (newSlots.includes(item.id)) {
                      // Already equipped
                    } else {
                      // Replace last slot or push
                      newSlots[4] = item.id;
                      onUpdateEquipped({ achievementSlots: newSlots });
                    }
                  }}
                  className={`asset-tile badge-tile ${
                    isEquipped ? "equipped" : ""
                  } ${!isUnlocked ? "locked" : ""}`}
                  title={item.name}
                >
                  <img
                    src={item.asset_url}
                    alt={item.name}
                    className="tile-img"
                  />
                  {isEquipped && (
                    <div className="equipped-badge">
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    </div>
                  )}
                  {!isUnlocked && (
                    <div className="locked-badge">
                      <Lock size={12} color="#94A3B8" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
