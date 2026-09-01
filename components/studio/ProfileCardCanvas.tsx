"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { UserProfileState } from "@/lib/types";
import { calculateProgressionStats, getMilestoneEmblemForLevel } from "@/lib/progression";
import { getAssetById } from "@/lib/assetsCatalog";

export interface ProfileCardCanvasRef {
  getSvgElement: () => SVGSVGElement | null;
  exportToCanvas: () => Promise<HTMLCanvasElement>;
  exportToDataUrl: () => Promise<string>;
}

interface ProfileCardCanvasProps {
  profile: UserProfileState;
}

export const ProfileCardCanvas = forwardRef<ProfileCardCanvasRef, ProfileCardCanvasProps>(
  ({ profile }, ref) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    const stats = calculateProgressionStats(profile.profileExp);
    const activeMilestone = getMilestoneEmblemForLevel(profile.profileLevel || stats.level);

    // Resolve equipped assets
    const cardFrameAsset = getAssetById(profile.equipped.cardFrameId);
    const avatarFrameAsset = getAssetById(profile.equipped.avatarFrameId);
    const titleAsset = getAssetById(profile.equipped.titleId);
    const titleText = (titleAsset?.metadata?.title_text as string) || titleAsset?.name || "Vault Seeker";

    const avatarUrl =
      profile.customAvatarUrl ||
      profile.discordAvatarUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

    // Expose export helpers
    useImperativeHandle(ref, () => ({
      getSvgElement: () => svgRef.current,
      exportToCanvas: async () => {
        const svgEl = svgRef.current;
        if (!svgEl) throw new Error("SVG reference not available");

        const svgData = new XMLSerializer().serializeToString(svgEl);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.crossOrigin = "anonymous";

        return new Promise<HTMLCanvasElement>((resolve, reject) => {
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 1200;
            canvas.height = 675;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Could not get 2d context"));
              return;
            }
            ctx.drawImage(img, 0, 0, 1200, 675);
            URL.revokeObjectURL(blobURL);
            resolve(canvas);
          };
          img.onerror = (e) => {
            URL.revokeObjectURL(blobURL);
            reject(e);
          };
          img.src = blobURL;
        });
      },
      exportToDataUrl: async () => {
        const canvas = await (ref as React.RefObject<ProfileCardCanvasRef>)?.current?.exportToCanvas();
        return canvas ? canvas.toDataURL("image/png") : "";
      },
    }));

    return (
      <div className="profile-card-wrapper">
        <svg
          ref={svgRef}
          viewBox="0 0 1200 675"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          style={{
            display: "block",
            borderRadius: "24px",
            overflow: "hidden",
            background: "#07040D",
          }}
        >
          <defs>
            {/* Card Silhouette Clip Path */}
            <clipPath id="cardClip">
              <rect x="0" y="0" width="1200" height="675" rx="24" />
            </clipPath>

            {/* Avatar Circular Clip */}
            <clipPath id="avatarClip">
              <circle cx="210" cy="245" r="95" />
            </clipPath>

            {/* Glow Filters */}
            <filter id="nameGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="emblemGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="badgeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <linearGradient id="expBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#8B5CF6" />
              <stop offset="100%" stop-color="#C084FC" />
            </linearGradient>

            <linearGradient id="glassCardOverlay" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.04" />
              <stop offset="100%" stop-color="#000000" stop-opacity="0.25" />
            </linearGradient>
          </defs>

          {/* Group bounded by card clip */}
          <g clipPath="url(#cardClip)">
            {/* ==============================================================
                1. BACKGROUND THEME LAYERS
                ============================================================== */}
            {profile.equipped.themeLayers.map((layerId, idx) => {
              const layerAsset = getAssetById(layerId);
              if (!layerAsset) return null;
              return (
                <image
                  key={`theme-layer-${layerId}-${idx}`}
                  href={layerAsset.asset_url}
                  x="0"
                  y="0"
                  width="1200"
                  height="675"
                  preserveAspectRatio="xMidYMid slice"
                />
              );
            })}

            {/* Ambient Overlay */}
            <rect x="0" y="0" width="1200" height="675" fill="url(#glassCardOverlay)" pointerEvents="none" />

            {/* ==============================================================
                2. AVATAR & AVATAR FRAME ZONE
                ============================================================== */}
            <g id="zone-avatar">
              {/* Avatar Background Shadow */}
              <circle cx="210" cy="245" r="98" fill="#0B0914" />

              {/* Avatar User Photo */}
              <image
                href={avatarUrl}
                x="110"
                y="145"
                width="200"
                height="200"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#avatarClip)"
              />

              {/* Equipped Avatar Frame SVG Overlay */}
              {avatarFrameAsset && (
                <image
                  href={avatarFrameAsset.asset_url}
                  x="100"
                  y="135"
                  width="220"
                  height="220"
                  preserveAspectRatio="xMidYMid meet"
                />
              )}
            </g>

            {/* ==============================================================
                3. DISPLAY NAME & TITLE PILL
                ============================================================== */}
            <g id="zone-identity" transform="translate(380, 150)">
              {/* Custom Display Name */}
              <text
                x="0"
                y="55"
                fontFamily={profile.equipped.nameFont || "Rajdhani"}
                fontWeight="800"
                fontSize="52"
                fill={profile.equipped.nameColor || "#FFFFFF"}
                letterSpacing="1.5"
                filter="url(#nameGlow)"
              >
                {profile.discordDisplayName || "EnGG"}
              </text>

              {/* Honorary Title Pill */}
              <g transform="translate(0, 75)">
                <rect
                  x="0"
                  y="0"
                  width="180"
                  height="34"
                  rx="8"
                  fill="rgba(24, 16, 42, 0.85)"
                  stroke={profile.equipped.titleColor || "#8B5CF6"}
                  strokeWidth="1.5"
                />
                <text
                  x="90"
                  y="22"
                  fontFamily="Rajdhani, sans-serif"
                  fontWeight="700"
                  fontSize="15"
                  fill="#FFFFFF"
                  letterSpacing="1.5"
                  textAnchor="middle"
                >
                  {titleText}
                </text>
              </g>
            </g>

            {/* ==============================================================
                4. MAIN MILESTONE EMBLEM ZONE
                ============================================================== */}
            <g id="zone-emblem" transform="translate(860, 130)">
              {/* Ambient Aura Glow Disk */}
              <circle
                cx="90"
                cy="90"
                r="80"
                fill={profile.equipped.emblemColor || activeMilestone.color}
                opacity="0.15"
                filter="url(#emblemGlow)"
              />

              {/* Milestone SVG Crest */}
              <image
                href={activeMilestone.assetUrl}
                x="15"
                y="15"
                width="150"
                height="150"
                preserveAspectRatio="xMidYMid meet"
                style={{
                  filter: `drop-shadow(0 0 16px ${profile.equipped.emblemColor || activeMilestone.color})`,
                }}
              />
            </g>

            {/* ==============================================================
                5. LEVEL, EXP PROGRESS BAR & COINS
                ============================================================== */}
            <g transform="translate(380, 310)">
              {/* LEVEL Label */}
              <text
                x="0"
                y="14"
                fontFamily="Inter, sans-serif"
                fontWeight="700"
                fontSize="12"
                fill="#94A3B8"
                letterSpacing="1.5"
              >
                LEVEL
              </text>
              <text
                x="0"
                y="52"
                fontFamily="var(--font-display)"
                fontWeight="900"
                fontSize="44"
                fill="#FFFFFF"
                letterSpacing="1"
              >
                {profile.profileLevel || stats.level}
              </text>

              {/* Progress Bar Track */}
              <rect x="75" y="24" width="280" height="12" rx="6" fill="#1E1B2E" />
              {/* Active Progress Fill */}
              <rect
                x="75"
                y="24"
                width={Math.max(12, (280 * stats.progressPercent) / 100)}
                height="12"
                rx="6"
                fill="url(#expBarGrad)"
                style={{
                  filter: "drop-shadow(0 0 8px #8B5CF6)",
                }}
              />

              {/* EXP Numbers */}
              <text
                x="355"
                y="52"
                fontFamily="Inter, sans-serif"
                fontWeight="600"
                fontSize="13"
                fill="#94A3B8"
                textAnchor="end"
              >
                {profile.profileExp.toLocaleString()} /{" "}
                {stats.nextLevelExp.toLocaleString()} EXP
              </text>

              {/* Vault Coins Badge */}
              <g transform="translate(470, 75)">
                <image
                  href="/assets/branding/vault_coin_icon.svg"
                  x="0"
                  y="0"
                  width="28"
                  height="28"
                />
                <text
                  x="36"
                  y="20"
                  fontFamily="Rajdhani, sans-serif"
                  fontWeight="800"
                  fontSize="22"
                  fill={profile.equipped.coinColor || "#F59E0B"}
                  letterSpacing="1"
                >
                  {profile.vaultCoins.toLocaleString()}
                </text>
              </g>
            </g>

            {/* ==============================================================
                6. 5 ACHIEVEMENT SHOWCASE BADGES (Horizontal Bottom Row)
                ============================================================== */}
            <g id="zone-achievements" transform="translate(80, 470)">
              {/* 5 Badges Array */}
              {profile.equipped.achievementSlots.slice(0, 5).map((badgeId, idx) => {
                const badgeAsset = getAssetById(badgeId);
                const xOffset = idx * 95;
                return (
                  <g key={`badge-slot-${badgeId}-${idx}`} transform={`translate(${xOffset}, 0)`}>
                    {/* Badge Container Frame */}
                    <rect
                      x="0"
                      y="0"
                      width="76"
                      height="76"
                      rx="16"
                      fill="rgba(15, 12, 28, 0.75)"
                      stroke={badgeAsset ? "rgba(139, 92, 246, 0.4)" : "rgba(255, 255, 255, 0.1)"}
                      strokeWidth="1.5"
                    />

                    {badgeAsset ? (
                      <image
                        href={badgeAsset.asset_url}
                        x="10"
                        y="10"
                        width="56"
                        height="56"
                        preserveAspectRatio="xMidYMid meet"
                        filter="url(#badgeGlow)"
                      />
                    ) : (
                      <text
                        x="38"
                        y="46"
                        fontFamily="Inter, sans-serif"
                        fontSize="22"
                        fill="#475569"
                        textAnchor="middle"
                      >
                        +
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* ==============================================================
                7. OUTER CARD FRAME (1200 x 675 px)
                ============================================================== */}
            {cardFrameAsset && (
              <image
                id="zone-card_frame"
                href={cardFrameAsset.asset_url}
                x="0"
                y="0"
                width="1200"
                height="675"
                preserveAspectRatio="none"
                style={{ pointerEvents: "none" }}
              />
            )}
          </g>
        </svg>
      </div>
    );
  }
);

ProfileCardCanvas.displayName = "ProfileCardCanvas";
