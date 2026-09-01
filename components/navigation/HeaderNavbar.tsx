"use client";

import React from "react";
import { UserProfileState } from "@/lib/types";
import { DEMO_PROFILES } from "@/lib/assetsCatalog";
import { calculateProgressionStats } from "@/lib/progression";
import {
  Palette,
  Save,
  Check,
  Coins,
  ShieldAlert,
  Download,
  Users,
  Eye,
  RotateCcw,
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
        padding: "14px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Left: Branding & Tag */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <img
          src="/assets/branding/en_logo.svg"
          alt="Every Nation GG"
          style={{ height: "36px", objectFit: "contain" }}
        />
        <div
          style={{
            height: "24px",
            width: "1px",
            background: "rgba(255, 255, 255, 0.15)",
          }}
        />
        <span
          className="badge-pill badge-cyan"
          style={{ fontSize: "0.75rem" }}
        >
          ENOS STUDIO
        </span>
      </div>

      {/* Center: Live Stats (Level, EXP Bar, Coins) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          background: "rgba(11, 15, 25, 0.6)",
          padding: "6px 18px",
          borderRadius: "9999px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Level & Milestone */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "#38BDF8",
            }}
          >
            LV. {stats.level}
          </span>
          <span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>
            ({profile.profileExp.toLocaleString()} EXP)
          </span>
        </div>

        {/* Vault Coins Balance */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            borderLeft: "1px solid rgba(255, 255, 255, 0.12)",
            paddingLeft: "14px",
          }}
        >
          <img
            src="/assets/branding/vault_coin_icon.svg"
            alt="Coins"
            style={{ width: "18px", height: "18px" }}
          />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              fontWeight: 700,
              color: "#F59E0B",
            }}
          >
            {profile.vaultCoins.toLocaleString()}
          </span>
        </div>

        {/* Demo Switcher Dropdown */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            borderLeft: "1px solid rgba(255, 255, 255, 0.12)",
            paddingLeft: "14px",
          }}
        >
          <Users size={14} color="#94A3B8" />
          <select
            onChange={(e) =>
              onSwitchDemoProfile(e.target.value as keyof typeof DEMO_PROFILES)
            }
            style={{
              background: "transparent",
              border: "none",
              color: "#CBD5E1",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              outline: "none",
            }}
            defaultValue="veteran"
          >
            <option value="veteran" style={{ background: "#0B0F19" }}>
              Demo: Veteran (Lv 30)
            </option>
            <option value="raider_violet" style={{ background: "#0B0F19" }}>
              Demo: Violet Raider (Lv 52)
            </option>
            <option value="mythic_sovereign" style={{ background: "#0B0F19" }}>
              Demo: Sovereign (Lv 100)
            </option>
          </select>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={onOpenExport}
          title="Export 1200x675 Card"
        >
          <Download size={16} />
          Export PNG
        </button>

        {isStudioMode ? (
          <>
            <button
              type="button"
              className="btn-secondary"
              onClick={onResetToDefault}
              title="Reset configuration"
            >
              <RotateCcw size={16} />
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={onSaveProfile}
              disabled={isSaving}
              style={{
                background: saveSuccess
                  ? "linear-gradient(135deg, #10B981, #059669)"
                  : undefined,
              }}
            >
              {saveSuccess ? (
                <>
                  <Check size={16} color="#FFFFFF" strokeWidth={3} />
                  Saved!
                </>
              ) : (
                <>
                  <Save size={16} />
                  {isSaving ? "Saving..." : "Save Config"}
                </>
              )}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn-primary"
            onClick={onToggleStudioMode}
          >
            <Palette size={18} />
            Customize Studio
          </button>
        )}
      </div>
    </header>
  );
};
