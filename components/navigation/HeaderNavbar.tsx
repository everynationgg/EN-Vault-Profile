"use client";

import React from "react";
import { UserProfileState } from "@/lib/types";
import { DEMO_PROFILES } from "@/lib/assetsCatalog";
import { calculateProgressionStats } from "@/lib/progression";
import {
  Palette,
  Save,
  Check,
  Download,
  Users,
  RotateCcw,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface HeaderNavbarProps {
  profile: UserProfileState;
  isStudioMode: boolean;
  onToggleStudioMode: () => void;
  onSaveProfile: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
  onOpenExport: () => void;
  onSwitchDemoProfile: (profileKey: keyof typeof DEMO_PROFILES) => void;
  onResetToDefault: () => void;
  showHotspots: boolean;
  onToggleHotspots: () => void;
  cardScale: "normal" | "compact";
  onToggleCardScale: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  profile,
  isStudioMode,
  onToggleStudioMode,
  onSaveProfile,
  isSaving,
  saveSuccess,
  onOpenExport,
  onSwitchDemoProfile,
  onResetToDefault,
  showHotspots,
  onToggleHotspots,
  cardScale,
  onToggleCardScale,
}) => {
  const stats = calculateProgressionStats(profile.profileExp);

  return (
    <header
      className="glass-panel"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 90,
        width: "100%",
        padding: "10px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "10px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Left: Branding */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src="/assets/branding/en_logo.svg"
          alt="Every Nation GG"
          style={{ height: "30px", objectFit: "contain" }}
        />
        <span
          className="badge-pill badge-cyan"
          style={{ fontSize: "0.7rem", padding: "2px 8px" }}
        >
          STUDIO
        </span>
      </div>

      {/* Center: Live Stats (Level, EXP, Coins, Demo Switcher) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "rgba(11, 15, 25, 0.6)",
          padding: "4px 12px",
          borderRadius: "9999px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          flexWrap: "wrap",
        }}
      >
        {/* Level */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.95rem",
              fontWeight: 800,
              color: "#38BDF8",
            }}
          >
            LV. {stats.level}
          </span>
        </div>

        {/* Vault Coins Balance */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            borderLeft: "1px solid rgba(255, 255, 255, 0.12)",
            paddingLeft: "10px",
          }}
        >
          <img
            src="/assets/branding/vault_coin_icon.svg"
            alt="Coins"
            style={{ width: "16px", height: "16px" }}
          />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "#F59E0B",
            }}
          >
            {profile.vaultCoins.toLocaleString()}
          </span>
        </div>

        {/* Demo Switcher */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            borderLeft: "1px solid rgba(255, 255, 255, 0.12)",
            paddingLeft: "10px",
          }}
        >
          <Users size={13} color="#94A3B8" />
          <select
            onChange={(e) =>
              onSwitchDemoProfile(e.target.value as keyof typeof DEMO_PROFILES)
            }
            style={{
              background: "transparent",
              border: "none",
              color: "#CBD5E1",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              outline: "none",
            }}
            defaultValue="veteran"
          >
            <option value="veteran" style={{ background: "#0B0F19" }}>
              Veteran (Lv 30)
            </option>
            <option value="raider_violet" style={{ background: "#0B0F19" }}>
              Raider (Lv 52)
            </option>
            <option value="mythic_sovereign" style={{ background: "#0B0F19" }}>
              Sovereign (Lv 100)
            </option>
          </select>
        </div>
      </div>

      {/* Right: Studio Toolbar & Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        {isStudioMode && (
          <>
            {/* Toggle Card Scale (Compact / Normal) */}
            <button
              type="button"
              className="btn-secondary"
              onClick={onToggleCardScale}
              title={
                cardScale === "compact"
                  ? "Switch to Normal Size"
                  : "Switch to Compact Mobile-Friendly Size"
              }
              style={{ padding: "6px 10px", fontSize: "0.8rem" }}
            >
              {cardScale === "compact" ? (
                <Maximize2 size={14} />
              ) : (
                <Minimize2 size={14} />
              )}
              <span style={{ fontSize: "0.75rem" }}>
                {cardScale === "compact" ? "Normal" : "Compact"}
              </span>
            </button>

            {/* Toggle Hotspot Dots Visibility */}
            <button
              type="button"
              className="btn-secondary"
              onClick={onToggleHotspots}
              title={showHotspots ? "Hide Hotspot Dots" : "Show Hotspot Dots"}
              style={{
                padding: "6px 10px",
                fontSize: "0.8rem",
                color: showHotspots ? "#38BDF8" : "#94A3B8",
              }}
            >
              {showHotspots ? <Eye size={14} /> : <EyeOff size={14} />}
              <span style={{ fontSize: "0.75rem" }}>
                {showHotspots ? "Dots: On" : "Dots: Off"}
              </span>
            </button>
          </>
        )}

        <button
          type="button"
          className="btn-secondary"
          onClick={onOpenExport}
          title="Export 1200x675 Card"
          style={{ padding: "6px 12px" }}
        >
          <Download size={14} />
          Export
        </button>

        {isStudioMode ? (
          <>
            <button
              type="button"
              className="btn-secondary"
              onClick={onResetToDefault}
              title="Reset configuration"
              style={{ padding: "6px 10px" }}
            >
              <RotateCcw size={14} />
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={onSaveProfile}
              disabled={isSaving}
              style={{
                padding: "6px 14px",
                background: saveSuccess
                  ? "linear-gradient(135deg, #10B981, #059669)"
                  : undefined,
              }}
            >
              {saveSuccess ? (
                <>
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  Saved
                </>
              ) : (
                <>
                  <Save size={14} />
                  {isSaving ? "Saving..." : "Save"}
                </>
              )}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn-primary"
            onClick={onToggleStudioMode}
            style={{ padding: "6px 14px" }}
          >
            <Palette size={16} />
            Customize Studio
          </button>
        )}
      </div>
    </header>
  );
};
