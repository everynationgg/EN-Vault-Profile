"use client";

import React, { useState } from "react";
import { UserProfileState, EquippedCosmetics, ProfileAsset } from "@/lib/types";
import {
  getAssetsByCategory,
  COMBINED_PROFILE_FRAMES,
} from "@/lib/assetsCatalog";
import {
  User,
  Square,
  Award,
  Check,
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
  // Default active tab to 'avatar_frame'
  const [activeTab, setActiveTab] = useState<string>("avatar_frame");

  const validTabs = ["avatar_frame", "profile_frame", "title_frame"];
  const currentTab = validTabs.includes(activeTab) ? activeTab : "avatar_frame";

  const avatarFrames = getAssetsByCategory("avatar_frame");
  const titles = getAssetsByCategory("title");

  // The 3 Canonical Identity Assets:
  // 1. Avatar Frame
  // 2. Profile Frame (Combined Profile Frame & Background)
  // 3. Title Frame
  const tabs = [
    { id: "avatar_frame", label: "Avatar Frame", icon: User },
    { id: "profile_frame", label: "Profile Frame", icon: Square },
    { id: "title_frame", label: "Title Frame", icon: Award },
  ];

  // Price label helper formatted to match reference (None, 50, 100, 150, 200, etc.)
  const renderCostLabel = (item: ProfileAsset, idx: number) => {
    const cost = item.unlock_req?.vault_coins_cost;
    if (cost !== undefined && cost !== null && cost > 0) {
      const formattedCost = cost >= 1000 ? `${cost / 1000}K` : `${cost}`;
      return (
        <span className="asset-choice-cost">
          <span style={{ color: "#F59E0B", fontSize: "0.6rem" }}>🪙</span> {formattedCost}
        </span>
      );
    }
    const levelReq =
      (item.metadata?.milestone_level as number) || item.unlock_req?.level;
    if (levelReq !== undefined && levelReq !== null && levelReq > 1) {
      return <span className="asset-choice-cost">Lv. {levelReq}</span>;
    }
    if (idx === 0 || item.is_starter) {
      return <span className="asset-choice-cost">None</span>;
    }
    return <span className="asset-choice-cost">Owned</span>;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px", width: "100%", alignItems: "center" }}>
      {/* ==============================================================
          1. HORIZONTAL CATEGORY TABS ROW (The 3 Core Identity Assets)
          ============================================================== */}
      <div className="category-tabs-bar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`category-tab-pill ${isActive ? "active" : ""}`}
              style={{
                padding: "10px 24px",
                fontSize: "0.88rem",
                letterSpacing: "0.6px",
              }}
            >
              <Icon size={17} color={isActive ? "#FFFFFF" : "#A78BFA"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ==============================================================
          2. SHOWCASE PANEL CONTAINER
          ============================================================== */}
      <div className="showcase-panel">
        
        {/* TAB CONTENT 1: AVATAR FRAMES */}
        {currentTab === "avatar_frame" && (
          <div className="showcase-carousel-track">
            {avatarFrames.map((item, idx) => {
              const isEquipped = profile.equipped.avatarFrameId === item.id;
              return (
                <div key={item.id} className="asset-choice-item">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateEquipped({ avatarFrameId: item.id })
                    }
                    className={`asset-tile ${isEquipped ? "equipped" : ""}`}
                    title={item.name}
                    style={{ width: "54px", height: "54px" }}
                  >
                    <img
                      src={item.asset_url}
                      alt={item.name}
                      className="tile-img"
                      style={{ width: "44px", height: "44px" }}
                    />
                    {isEquipped && (
                      <div className="equipped-badge">
                        <Check size={11} color="#FFFFFF" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                  {renderCostLabel(item, idx)}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB CONTENT 2: PROFILE FRAME (Combined Background + Outer Frame) */}
        {currentTab === "profile_frame" && (
          <div className="showcase-carousel-track">
            {COMBINED_PROFILE_FRAMES.map((item) => {
              const isEquipped =
                profile.equipped.themeLayers.includes(item.bgId) ||
                profile.equipped.cardFrameId === item.cardFrameId;
              return (
                <div key={item.id} className="asset-choice-item">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateEquipped({
                        themeLayers: [item.bgId],
                        cardFrameId: item.cardFrameId,
                      })
                    }
                    className={`asset-tile card-frame-tile ${
                      isEquipped ? "equipped" : ""
                    }`}
                    title={item.description}
                    style={{ width: "108px", height: "60px", padding: "2px" }}
                  >
                    <img
                      src={item.preview_url}
                      alt={item.name}
                      className="tile-img-frame"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    {isEquipped && (
                      <div className="equipped-badge">
                        <Check size={11} color="#FFFFFF" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                  <span
                    className="asset-choice-cost"
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      maxWidth: "110px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB CONTENT 3: TITLE FRAME */}
        {currentTab === "title_frame" && (
          <div className="showcase-carousel-track">
            {titles.map((item, idx) => {
              const isEquipped = profile.equipped.titleId === item.id;
              const titleColor =
                (item.metadata?.color as string) || "#FFFFFF";
              return (
                <div key={item.id} className="asset-choice-item">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateEquipped({
                        titleId: item.id,
                        titleColor: titleColor,
                      })
                    }
                    className={`asset-tile title-tile ${
                      isEquipped ? "equipped" : ""
                    }`}
                    style={{ minWidth: "130px", height: "50px", padding: "6px 14px" }}
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
                        <Check size={11} color="#FFFFFF" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                  {renderCostLabel(item, idx)}
                </div>
              );
            })}
          </div>
        )}

        {/* ==============================================================
            3. BOTTOM CENTERED ACTION BUTTONS (Exact match to reference)
            ============================================================== */}
        <div className="showcase-bottom-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onReset}
            style={{
              padding: "8px 24px",
              borderRadius: "9999px",
              fontSize: "0.85rem",
              fontWeight: 700,
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#E2E8F0",
            }}
          >
            <RotateCcw size={14} style={{ display: "inline", marginRight: "6px" }} />
            RESET
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={onSave}
            disabled={isSaving}
            style={{
              padding: "8px 28px",
              borderRadius: "9999px",
              fontSize: "0.85rem",
              fontWeight: 800,
              background: saveSuccess
                ? "linear-gradient(135deg, #10B981, #059669)"
                : "linear-gradient(135deg, #7C3AED, #6D28D9)",
              color: "#FFFFFF",
              boxShadow: "0 4px 18px rgba(124, 58, 237, 0.5)",
            }}
          >
            {saveSuccess ? (
              <>
                <Check size={16} color="#FFFFFF" strokeWidth={3} style={{ display: "inline", marginRight: "6px" }} />
                SAVED
              </>
            ) : (
              <>
                <Save size={16} style={{ display: "inline", marginRight: "6px" }} />
                {isSaving ? "SAVING..." : "SAVE CHANGES"}
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
