"use client";

import React, { useState, useRef } from "react";
import { UserProfileState, HotspotZone, EquippedCosmetics } from "@/lib/types";
import { DEMO_PROFILES, STARTER_IDENTITIES } from "@/lib/assetsCatalog";
import { calculateProgressionStats, EXP_SOURCES } from "@/lib/progression";
import { ProfileCardCanvas, ProfileCardCanvasRef } from "@/components/studio/ProfileCardCanvas";
import { StudioOverlay } from "@/components/studio/StudioOverlay";
import { CosmeticDrawer } from "@/components/studio/CosmeticDrawer";
import { ExportModal } from "@/components/studio/ExportModal";
import { HeaderNavbar } from "@/components/navigation/HeaderNavbar";
import {
  Palette,
  Sparkles,
  Download,
  Share2,
  Shield,
  Zap,
  Flame,
  Swords,
  Compass,
  Brain,
  CheckCircle2,
  Layers,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function Home() {
  const [profile, setProfile] = useState<UserProfileState>(DEMO_PROFILES.veteran);
  const [isStudioMode, setIsStudioMode] = useState<boolean>(false);
  const [activeHotspot, setActiveHotspot] = useState<HotspotZone>("avatar");
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const canvasRef = useRef<ProfileCardCanvasRef | null>(null);
  const stats = calculateProgressionStats(profile.profileExp);

  // Switch demo profiles
  const handleSwitchDemoProfile = (key: keyof typeof DEMO_PROFILES) => {
    setProfile(DEMO_PROFILES[key]);
  };

  // Reset to default
  const handleResetToDefault = () => {
    setProfile(DEMO_PROFILES.veteran);
  };

  // Update equipped cosmetic properties
  const handleUpdateEquipped = (newEquipped: Partial<EquippedCosmetics>) => {
    setProfile((prev) => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        ...newEquipped,
      },
    }));
  };

  // Update custom avatar photo URL
  const handleUpdateAvatarUrl = (url: string) => {
    setProfile((prev) => ({
      ...prev,
      customAvatarUrl: url,
    }));
  };

  // Apply one of the 3 free starter identities
  const handleApplyStarterIdentity = (identityKey: "silver" | "violet" | "flame") => {
    const preset = STARTER_IDENTITIES[identityKey];
    if (!preset) return;

    setProfile((prev) => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        nameFont: preset.nameFont,
        nameColor: preset.nameColor,
        titleId: preset.titleId,
        titleColor: preset.titleColor,
        emblemColor: preset.emblemColor,
        avatarFrameId: preset.avatarFrameId,
        cardFrameId: preset.cardFrameId,
        themeLayers: preset.themeLayers,
        coinColor: preset.coinColor,
        achievementSlots: preset.achievementSlots,
      },
    }));

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
      colors:
        identityKey === "violet"
          ? ["#A855F7", "#C084FC", "#E879F9"]
          : identityKey === "flame"
          ? ["#F59E0B", "#EF4444", "#FDE68A"]
          : ["#E2E8F0", "#38BDF8", "#94A3B8"],
    });
  };

  // Save profile state
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: profile.userId,
          equipped: profile.equipped,
          customAvatarUrl: profile.customAvatarUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.5 },
          colors: ["#10B981", "#38BDF8", "#F59E0B"],
        });
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.warn("Save request error, continuing locally:", e);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Navigation Bar */}
      <HeaderNavbar
        profile={profile}
        isStudioMode={isStudioMode}
        onToggleStudioMode={() => setIsStudioMode(!isStudioMode)}
        onSaveProfile={handleSaveProfile}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        onOpenExport={() => setIsExportModalOpen(true)}
        onSwitchDemoProfile={handleSwitchDemoProfile}
        onResetToDefault={handleResetToDefault}
      />

      {/* Main Studio Container */}
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "30px 20px 80px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Hero Section (When not in Studio mode) */}
        {!isStudioMode && (
          <section
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              paddingTop: "10px",
            }}
          >
            <div
              className="badge-pill badge-cyan"
              style={{ fontSize: "0.8rem", letterSpacing: "1.5px" }}
            >
              <Sparkles size={14} />
              CANONICAL 1200 × 675 DIGITAL IDENTITY STUDIO
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: 800,
                letterSpacing: "1.5px",
                lineHeight: 1.1,
                background: "linear-gradient(135deg, #FFFFFF, #94A3B8, #38BDF8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CUSTOMIZE YOUR EN IDENTITY CARD
            </h1>
            <p
              style={{
                maxWidth: "680px",
                color: "#94A3B8",
                fontSize: "1rem",
                lineHeight: 1.6,
              }}
            >
              Earn cosmetics, milestone emblems, and prestige titles through active
              participation in Every Nation GG. Customize and export your 16:9 identity card.
            </p>

            {/* Quick Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "8px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsStudioMode(true)}
              >
                <Palette size={18} />
                Open Customizer Studio
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsExportModalOpen(true)}
              >
                <Download size={18} />
                Export 1200×675 PNG
              </button>
            </div>
          </section>
        )}

        {/* ==============================================================
            MASTER 1200 × 675 CARD CANVAS WRAPPER WITH HOTSPOTS
            ============================================================== */}
        <div style={{ position: "relative", width: "100%" }}>
          <ProfileCardCanvas
            ref={canvasRef}
            profile={profile}
            activeHotspot={isStudioMode ? activeHotspot : null}
            onHotspotClick={(zone) => {
              setActiveHotspot(zone);
              if (!isStudioMode) setIsStudioMode(true);
            }}
            isStudioMode={isStudioMode}
          />

          {/* Interactive Glowing Hotspot Dots */}
          <StudioOverlay
            activeHotspot={activeHotspot}
            onSelectHotspot={(zone) => setActiveHotspot(zone)}
            isVisible={isStudioMode}
          />
        </div>

        {/* ==============================================================
            STUDIO BOTTOM COSMETIC DRAWER
            ============================================================== */}
        {isStudioMode ? (
          <CosmeticDrawer
            profile={profile}
            activeHotspot={activeHotspot}
            onSelectHotspot={(zone) => setActiveHotspot(zone)}
            onUpdateEquipped={handleUpdateEquipped}
            onUpdateAvatarUrl={handleUpdateAvatarUrl}
            onApplyStarterIdentity={handleApplyStarterIdentity}
          />
        ) : (
          /* Feature Overview Cards when in Showcase Mode */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            {/* Progression Card */}
            <div className="glass-panel" style={{ borderRadius: "16px", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <Shield size={20} color="#38BDF8" />
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700 }}>
                  Dedicated 1–100 Progression
                </h3>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.5 }}>
                Level 30 represents ~1 year of consistent ENOS activity (83,429 EXP), while Level 100 is the 5-year master pinnacle (417,143 EXP).
              </p>
            </div>

            {/* Zero-Cost Static Artwork */}
            <div className="glass-panel" style={{ borderRadius: "16px", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <Layers size={20} color="#A855F7" />
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700 }}>
                  Zero-Cost Edge CDN Assets
                </h3>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.5 }}>
                All high-resolution frames, multi-layer themes, and milestone emblems live in static vector format served via Vercel CDN with 0 KB Supabase storage costs.
              </p>
            </div>

            {/* Live Client-Side Composition */}
            <div className="glass-panel" style={{ borderRadius: "16px", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <Zap size={20} color="#F59E0B" />
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700 }}>
                  Real-Time Canvas Composition
                </h3>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.5 }}>
                Zero server-side image render lag on color tweaks or cosmetic switches. Live HTML5 canvas export generates lossless 1200×675 PNGs in seconds.
              </p>
            </div>
          </div>
        )}

        {/* Activity EXP Sources Info Bar */}
        <section
          className="glass-panel"
          style={{
            borderRadius: "16px",
            padding: "20px 24px",
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={18} color="#38BDF8" />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  letterSpacing: "1px",
                  color: "#FFFFFF",
                  textTransform: "uppercase",
                }}
              >
                ENOS Activity EXP Rewards (Max 1,600 Profile EXP / week)
              </span>
            </div>
            <span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>
              Awarded automatically on ENOS Discord task completion
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            <div
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(56, 189, 248, 0.15)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#38BDF8", fontWeight: 700, fontSize: "0.9rem" }}>
                <Compass size={16} />
                Daily Quest
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", marginTop: "4px", fontFamily: "var(--font-display)" }}>
                +50 EXP <span style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 500 }}>(Up to 3/day = 150 EXP)</span>
              </div>
            </div>

            <div
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(168, 85, 247, 0.15)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#C084FC", fontWeight: 700, fontSize: "0.9rem" }}>
                <Brain size={16} />
                Daily Trivia
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", marginTop: "4px", fontFamily: "var(--font-display)" }}>
                +25 EXP <span style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 500 }}>(1/day = 25 EXP)</span>
              </div>
            </div>

            <div
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(245, 158, 11, 0.15)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#F59E0B", fontWeight: 700, fontSize: "0.9rem" }}>
                <Swords size={16} />
                Weekly World Boss
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", marginTop: "4px", fontFamily: "var(--font-display)" }}>
                +75 EXP <span style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 500 }}>/ AP spent (Max 5 AP = 375 EXP)</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Export 1200x675 Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onGenerateCanvas={() => {
          if (!canvasRef.current) throw new Error("Canvas ref is null");
          return canvasRef.current.exportToCanvas();
        }}
        username={profile.discordDisplayName}
      />
    </div>
  );
}
