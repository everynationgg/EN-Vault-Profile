"use client";

import React, { useState, useRef } from "react";
import { UserProfileState, EquippedCosmetics } from "@/lib/types";
import { DEMO_PROFILES, DEFAULT_EN_PROFILE } from "@/lib/assetsCatalog";
import { ProfileCardCanvas, ProfileCardCanvasRef } from "@/components/studio/ProfileCardCanvas";
import { ProfileOverview } from "@/components/profile/ProfileOverview";
import { CustomizePanel } from "@/components/customizer/CustomizePanel";
import { ExportModal } from "@/components/studio/ExportModal";
import { HeaderNavbar } from "@/components/navigation/HeaderNavbar";
import confetti from "canvas-confetti";

export default function Home() {
  const [profile, setProfile] = useState<UserProfileState>(DEFAULT_EN_PROFILE);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

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

      {/* Main Studio Container */}
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "24px 20px 60px 20px",
        }}
      >
        {/* Desktop Side-by-Side / Mobile Vertical Stack Grid */}
        <div className="profile-page-grid">
          
          {/* ==============================================================
              LEFT COLUMN: PROFILE CARD & PROFILE OVERVIEW
              ============================================================== */}
          <section className="left-profile-column">
            {/* Canonical 1200 x 675 Profile Card */}
            <div style={{ width: "100%" }}>
              <ProfileCardCanvas ref={canvasRef} profile={profile} />
            </div>

            {/* Profile Overview Card Underneath */}
            <ProfileOverview profile={profile} />
          </section>

          {/* ==============================================================
              RIGHT COLUMN: CUSTOMIZE PROFILE PANEL
              (Contains Horizontal Category Rows: Icon | Scrollable Options)
              ============================================================== */}
          <section className="right-customizer-column">
            <CustomizePanel
              profile={profile}
              onUpdateEquipped={handleUpdateEquipped}
              onReset={handleResetToDefault}
              onSave={handleSaveProfile}
              isSaving={isSaving}
              saveSuccess={saveSuccess}
            />
          </section>

        </div>
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
