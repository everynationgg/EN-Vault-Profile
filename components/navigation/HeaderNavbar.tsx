"use client";

import React, { useState } from "react";
import { UserProfileState } from "@/lib/types";
import { DEMO_PROFILES, DEFAULT_EN_PROFILE } from "@/lib/assetsCatalog";
import {
  Coins,
  ChevronDown,
  Download,
  Users,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface HeaderNavbarProps {
  profile: UserProfileState;
  onOpenExport: () => void;
  onSwitchDemoProfile: (profileKey: keyof typeof DEMO_PROFILES) => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  profile,
  onOpenExport,
  onSwitchDemoProfile,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "achievements">("profile");

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 90,
        width: "100%",
        padding: "14px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(9, 11, 16, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Left: Branding Lockup */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* EN Shield Badge Icon */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: "0.9rem",
            color: "#FFFFFF",
            fontFamily: "var(--font-display)",
            boxShadow: "0 0 15px rgba(124, 58, 237, 0.4)",
          }}
        >
          EN
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "1px",
              lineHeight: 1.1,
            }}
          >
            EN VAULT
          </span>
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "#94A3B8",
              letterSpacing: "2px",
            }}
          >
            PROFILE
          </span>
        </div>
      </div>

      {/* Center: Navigation Tabs */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "28px",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          style={{
            background: "transparent",
            border: "none",
            color: activeTab === "profile" ? "#FFFFFF" : "#94A3B8",
            fontFamily: "var(--font-display)",
            fontSize: "0.95rem",
            fontWeight: 800,
            letterSpacing: "1.5px",
            cursor: "pointer",
            padding: "8px 4px",
            position: "relative",
            transition: "color 0.2s ease",
          }}
        >
          PROFILE
          {activeTab === "profile" && (
            <div
              style={{
                position: "absolute",
                bottom: "-14px",
                left: 0,
                right: 0,
                height: "3px",
                borderRadius: "2px",
                background: "#8B5CF6",
                boxShadow: "0 0 10px #8B5CF6",
              }}
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("achievements")}
          style={{
            background: "transparent",
            border: "none",
            color: activeTab === "achievements" ? "#FFFFFF" : "#64748B",
            fontFamily: "var(--font-display)",
            fontSize: "0.95rem",
            fontWeight: 700,
            letterSpacing: "1.5px",
            cursor: "pointer",
            padding: "8px 4px",
            position: "relative",
            transition: "color 0.2s ease",
          }}
        >
          ACHIEVEMENTS
          {activeTab === "achievements" && (
            <div
              style={{
                position: "absolute",
                bottom: "-14px",
                left: 0,
                right: 0,
                height: "3px",
                borderRadius: "2px",
                background: "#8B5CF6",
                boxShadow: "0 0 10px #8B5CF6",
              }}
            />
          )}
        </button>
      </nav>

      {/* Right: Vault Coins & User Dropdown */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Vault Coins Balance Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            background: "rgba(15, 23, 42, 0.7)",
            padding: "6px 14px",
            borderRadius: "9999px",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            boxShadow: "0 0 12px rgba(245, 158, 11, 0.15)",
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
              fontWeight: 800,
              color: "#F59E0B",
            }}
          >
            {profile.vaultCoins.toLocaleString()}
          </span>
        </div>

        {/* User Avatar + Discord Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "9999px",
              padding: "4px 12px 4px 4px",
              cursor: "pointer",
            }}
          >
            <img
              src={profile.discordAvatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
              alt="Avatar"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#F8FAFC",
              }}
            >
              {profile.discordUsername || "EnGG#1234"}
            </span>
            <ChevronDown size={14} color="#94A3B8" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className="glass-panel"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "200px",
                borderRadius: "12px",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
                zIndex: 100,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  onOpenExport();
                  setIsDropdownOpen(false);
                }}
                className="btn-secondary"
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  padding: "8px 12px",
                  fontSize: "0.8rem",
                  border: "none",
                }}
              >
                <Download size={14} />
                Export 1200x675 PNG
              </button>

              <div
                style={{
                  height: "1px",
                  background: "rgba(255, 255, 255, 0.1)",
                  margin: "4px 0",
                }}
              />

              <div
                style={{
                  padding: "4px 8px",
                  fontSize: "0.7rem",
                  color: "#64748B",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Switch Demo Profile
              </div>

              <button
                type="button"
                onClick={() => {
                  onSwitchDemoProfile("mystic_cat");
                  setIsDropdownOpen(false);
                }}
                className="btn-secondary"
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  padding: "6px 12px",
                  fontSize: "0.8rem",
                  border: "none",
                  color: "#FDE68A",
                  fontWeight: "bold",
                }}
              >
                🐾 Mystic Cat (Fantasy Theme)
              </button>
              <button
                type="button"
                onClick={() => {
                  onSwitchDemoProfile("veteran");
                  setIsDropdownOpen(false);
                }}
                className="btn-secondary"
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  padding: "6px 12px",
                  fontSize: "0.8rem",
                  border: "none",
                }}
              >
                EnGG (Default Theme)
              </button>
              <button
                type="button"
                onClick={() => {
                  onSwitchDemoProfile("raider_violet");
                  setIsDropdownOpen(false);
                }}
                className="btn-secondary"
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  padding: "6px 12px",
                  fontSize: "0.8rem",
                  border: "none",
                }}
              >
                Valkyrie (Lv 52)
              </button>
              <button
                type="button"
                onClick={() => {
                  onSwitchDemoProfile("mythic_sovereign");
                  setIsDropdownOpen(false);
                }}
                className="btn-secondary"
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  padding: "6px 12px",
                  fontSize: "0.8rem",
                  border: "none",
                }}
              >
                Sol Invictus (Lv 100)
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
