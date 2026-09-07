"use client";

import React, { useState, useRef } from "react";
import { UserProfileState, EquippedCosmetics } from "@/lib/types";
import { DEMO_PROFILES, DEFAULT_EN_PROFILE } from "@/lib/assetsCatalog";
import { ProfileCardCanvas, ProfileCardCanvasRef } from "@/components/studio/ProfileCardCanvas";
import { CustomizePanel } from "@/components/customizer/CustomizePanel";
import { ExportModal } from "@/components/studio/ExportModal";
import { HeaderNavbar } from "@/components/navigation/HeaderNavbar";
import confetti from "canvas-confetti";
import {
  Upload,
  Eye,
  Move,
  Maximize2,
  Sliders,
  Check,
  RotateCcw,
  ArrowUpDown,
} from "lucide-react";

export default function Home() {
  const [profile, setProfile] = useState<UserProfileState>(
    DEMO_PROFILES.where_winds_meet || DEFAULT_EN_PROFILE
  );
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isEditorMode, setIsEditorMode] = useState<boolean>(false);
  const [frameApplied, setFrameApplied] = useState<boolean>(false);

  const canvasRef = useRef<ProfileCardCanvasRef | null>(null);

  // Switch demo profiles
  const handleSwitchDemoProfile = (key: keyof typeof DEMO_PROFILES) => {
    setProfile(DEMO_PROFILES[key]);
  };

  // Reset to default
  const handleResetToDefault = () => {
    setProfile(DEFAULT_EN_PROFILE);
  };

  // Update equipped cosmetic properties (instant live update on profile card above!)
  const handleUpdateEquipped = (newEquipped: Partial<EquippedCosmetics>) => {
    setProfile((prev) => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        ...newEquipped,
      },
    }));
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
          particleCount: 60,
          spread: 50,
          origin: { y: 0.5 },
          colors: ["#8B5CF6", "#A855F7", "#F59E0B"],
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
      {/* Top Header Navigation matching reference layout */}
      <HeaderNavbar
        profile={profile}
        onOpenExport={() => setIsExportModalOpen(true)}
        onSwitchDemoProfile={handleSwitchDemoProfile}
      />

      {/* Main Studio Container matching reference positioning */}
      <main className="dashboard-container">
        
        {/* ==============================================================
            1. UPPER HERO ROW (Left: Welcome text | Right: Profile Card)
            ============================================================== */}
        <section className="hero-section">
          {/* Left: Welcome Copy */}
          <div className="hero-left">
            <h1 className="hero-title">
              Hi {profile.discordUsername || "EngG#1234"}, welcome to your dashboard.
            </h1>
            <p className="hero-desc">
              This is your EN profile, a customized space where you can add your frame, profile page, and more. Find it in <span style={{ color: "#C084FC", fontWeight: 700 }}>[ENOS]</span>.
            </p>
            <p className="hero-tagline">
              Make your mark. Unlock. Collect. Flex. It&apos;s all you, in one place.
            </p>

            {/* Quick Theme Presets */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 800, letterSpacing: "1px" }}>THEMES:</span>
              <button
                type="button"
                className="preset-chip"
                onClick={() => handleSwitchDemoProfile("where_winds_meet")}
              >
                🌪️ Where Winds Meet
              </button>
              <button
                type="button"
                className="preset-chip"
                onClick={() => handleSwitchDemoProfile("palworld")}
              >
                🐾 Palworld
              </button>
              <button
                type="button"
                className="preset-chip"
                onClick={handleResetToDefault}
              >
                ⚡ Default
              </button>
            </div>
          </div>

          {/* Right: Canonical 16:9 Profile Card Preview */}
          <div className="hero-right">
            <ProfileCardCanvas
              ref={canvasRef}
              profile={profile}
              showToolbar={isEditorMode}
            />
          </div>
        </section>

        {/* ==============================================================
            2. MIDDLE CONTROL BOX (Exact match to reference)
            ============================================================== */}
        <section className="middle-control-box">
          {/* Row 1: Upload button & size indicator */}
          <div className="control-box-row">
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "6px 16px",
                borderRadius: "8px",
                fontSize: "0.78rem",
                fontWeight: 800,
                letterSpacing: "0.6px",
                background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                color: "#FFFFFF",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(124, 58, 237, 0.35)",
              }}
            >
              <Upload size={13} strokeWidth={2.5} />
              ADD / CHANGE PNG
            </button>

            <span style={{ fontSize: "0.76rem", color: "#94A3B8", fontWeight: 500 }}>
              Supports 16:9 PNG (1200×675, &lt;2MB)
            </span>

            <button
              type="button"
              onClick={() => setIsEditorMode(!isEditorMode)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 12px",
                borderRadius: "7px",
                fontSize: "0.74rem",
                fontWeight: 800,
                letterSpacing: "0.4px",
                background: isEditorMode ? "rgba(139, 92, 246, 0.25)" : "rgba(255, 255, 255, 0.05)",
                color: isEditorMode ? "#C084FC" : "#94A3B8",
                border: isEditorMode ? "1px solid #8B5CF6" : "1px solid rgba(255, 255, 255, 0.1)",
                cursor: "pointer",
              }}
            >
              <Move size={12} />
              LAYOUT EDITOR: {isEditorMode ? "ON" : "OFF"}
            </button>
          </div>

          {/* Row 2: Frame Controls */}
          <div className="control-box-row" style={{ paddingTop: "6px", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <select className="control-select" defaultValue="show">
                <option value="show">👁 Show Frame</option>
                <option value="hide">👁 Hide Frame</option>
              </select>

              <select className="control-select" defaultValue="16:9">
                <option value="16:9">16 : 9</option>
                <option value="1:1">1 : 1</option>
                <option value="4:3">4 : 3</option>
              </select>

              <button
                type="button"
                className="control-select"
                title="Flip / Mirror orientation"
                style={{ display: "flex", alignItems: "center", padding: "5px 10px" }}
              >
                <ArrowUpDown size={13} />
              </button>

              <select className="control-select" defaultValue="center">
                <option value="center">⛶ Center Both</option>
                <option value="center-x">Center Horizontal</option>
                <option value="center-y">Center Vertical</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setFrameApplied(true);
                setTimeout(() => setFrameApplied(false), 2000);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 16px",
                borderRadius: "7px",
                fontSize: "0.78rem",
                fontWeight: 800,
                letterSpacing: "0.6px",
                background: frameApplied
                  ? "linear-gradient(135deg, #10B981, #059669)"
                  : "linear-gradient(135deg, #7C3AED, #6D28D9)",
                color: "#FFFFFF",
                border: "none",
                cursor: "pointer",
              }}
            >
              {frameApplied ? <Check size={13} /> : null}
              {frameApplied ? "APPLIED" : "APPLY FRAME"}
            </button>
          </div>
        </section>

        {/* ==============================================================
            3. CUSTOMIZE PROFILE (Category Tabs & Showcase Carousel)
            ============================================================== */}
        <section style={{ width: "100%" }}>
          <CustomizePanel
            profile={profile}
            onUpdateEquipped={handleUpdateEquipped}
            onReset={handleResetToDefault}
            onSave={handleSaveProfile}
            isSaving={isSaving}
            saveSuccess={saveSuccess}
          />
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
