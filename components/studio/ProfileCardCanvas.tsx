"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { UserProfileState, HotspotZone } from "@/lib/types";
import { calculateProgressionStats, getMilestoneEmblemForLevel } from "@/lib/progression";
import { getAssetById } from "@/lib/assetsCatalog";

export interface ProfileCardCanvasRef {
  getSvgElement: () => SVGSVGElement | null;
  exportToCanvas: () => Promise<HTMLCanvasElement>;
  exportToDataUrl: () => Promise<string>;
}

interface ProfileCardCanvasProps {
  profile: UserProfileState;
  activeHotspot?: HotspotZone | null;
  onHotspotClick?: (zone: HotspotZone) => void;
  isStudioMode?: boolean;
}

export const ProfileCardCanvas = forwardRef<ProfileCardCanvasRef, ProfileCardCanvasProps>(
  ({ profile, activeHotspot, onHotspotClick, isStudioMode = false }, ref) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    const stats = calculateProgressionStats(profile.profileExp);
    const activeMilestone = getMilestoneEmblemForLevel(stats.level);

    // Resolve equipped assets
    const cardFrameAsset = getAssetById(profile.equipped.cardFrameId);
    const avatarFrameAsset = getAssetById(profile.equipped.avatarFrameId);
    const titleAsset = getAssetById(profile.equipped.titleId);
    const titleText = (titleAsset?.metadata?.title_text as string) || titleAsset?.name || "VAULT PIONEER";

    const avatarUrl = profile.customAvatarUrl || profile.discordAvatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

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
      <div className={`profile-card-wrapper ${isStudioMode ? "in-studio" : ""}`}>
        <svg
          ref={svgRef}
          viewBox="0 0 1200 675"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          style={{
            display: "block",
            borderRadius: "28px",
            overflow: "hidden",
            background: "#090B10",
          }}
        >
          <defs>
            {/* Base Card Clip Path */}
            <clipPath id="cardClip">
              <rect x="0" y="0" width="1200" height="675" rx="28" />
            </clipPath>

            {/* Avatar Circular Clip */}
            <clipPath id="avatarClip">
              <circle cx="170" cy="225" r="74" />
            </clipPath>

            {/* Glow Filters */}
            <filter id="nameGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="emblemGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="badgeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <linearGradient id="expBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#38BDF8" />
              <stop offset="50%" stop-color="#818CF8" />
              <stop offset="100%" stop-color="#C084FC" />
            </linearGradient>

            <linearGradient id="glassCardOverlay" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.05" />
              <stop offset="100%" stop-color="#000000" stop-opacity="0.2" />
            </linearGradient>
          </defs>

          {/* Group bounded by card clip */}
          <g clipPath="url(#cardClip)">
            {/* ==============================================================
                1. MULTI-LAYER THEME BACKGROUND (Stackable Layers)
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

            {/* Ambient Glass Highlight */}
            <rect x="0" y="0" width="1200" height="675" fill="url(#glassCardOverlay)" pointerEvents="none" />

            {/* ==============================================================
                2. BRANDING WATERMARK (Every Nation GG Logo)
                ============================================================== */}
            <g transform="translate(980, 36)" opacity="0.9">
              <image href="/assets/branding/en_logo.svg" x="0" y="0" width="180" height="54" />
            </g>

            {/* ==============================================================
                3. AVATAR & AVATAR FRAME ZONE
                ============================================================== */}
            <g
              id="zone-avatar"
              style={{ cursor: isStudioMode ? "pointer" : "default" }}
              onClick={() => onHotspotClick && onHotspotClick("avatar")}
            >
              {/* Avatar Background Shadow */}
              <circle cx="170" cy="225" r="76" fill="#0F172A" />

              {/* Avatar User Image */}
              <image
                href={avatarUrl}
                x="96"
                y="151"
                width="148"
                height="148"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#avatarClip)"
              />

              {/* Equipped Avatar Frame SVG Overlay */}
              {avatarFrameAsset && (
                <image
                  href={avatarFrameAsset.asset_url}
                  x="90"
                  y="145"
                  width="160"
                  height="160"
                  preserveAspectRatio="xMidYMid meet"
                />
              )}
            </g>

            {/* ==============================================================
                4. DISPLAY NAME, TITLE & IDENTITY ZONE
                ============================================================== */}
            <g
              id="zone-name"
              transform="translate(280, 160)"
              style={{ cursor: isStudioMode ? "pointer" : "default" }}
              onClick={() => onHotspotClick && onHotspotClick("name")}
            >
              {/* Custom Display Name */}
              <text
                x="0"
                y="50"
                fontFamily={profile.equipped.nameFont || "Rajdhani"}
                fontWeight="800"
                fontSize="48"
                fill={profile.equipped.nameColor || "#F8FAFC"}
                letterSpacing="1.5"
                filter="url(#nameGlow)"
              >
                {profile.discordDisplayName || profile.discordUsername}
              </text>

              {/* Discord Username Handle */}
              <text
                x="0"
                y="82"
                fontFamily="Inter, sans-serif"
                fontWeight="500"
                fontSize="18"
                fill="#94A3B8"
                letterSpacing="0.5"
              >
                @{profile.discordUsername}
              </text>
            </g>

            {/* Title & Title Frame Zone */}
            <g
              id="zone-title"
              transform="translate(280, 260)"
              style={{ cursor: isStudioMode ? "pointer" : "default" }}
              onClick={() => onHotspotClick && onHotspotClick("title")}
            >
              {/* Title Badge Container */}
              <rect
                x="0"
                y="0"
                width="280"
                height="38"
                rx="8"
                fill="rgba(15, 23, 42, 0.75)"
                stroke={profile.equipped.titleColor || "#38BDF8"}
                strokeWidth="1.5"
              />
              <text
                x="140"
                y="24"
                fontFamily="Rajdhani, Orbitron, sans-serif"
                fontWeight="700"
                fontSize="16"
                fill="#FFFFFF"
                letterSpacing="2.5"
                textAnchor="middle"
              >
                {titleText}
              </text>

              {/* Title Decorative Frame SVG */}
              {titleAsset && (
                <image
                  href={titleAsset.asset_url}
                  x="20"
                  y="2"
                  width="240"
                  height="34"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ filter: `drop-shadow(0 0 8px ${profile.equipped.titleColor || "#38BDF8"})` }}
                />
              )}
            </g>

            {/* ==============================================================
                5. MAIN MILESTONE EMBLEM ZONE (Determined by Level)
                ============================================================== */}
            <g
              id="zone-emblem"
              transform="translate(740, 140)"
              style={{ cursor: isStudioMode ? "pointer" : "default" }}
              onClick={() => onHotspotClick && onHotspotClick("emblem")}
            >
              {/* Ambient Glow Disk */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill={profile.equipped.emblemColor || activeMilestone.color}
                opacity="0.12"
                filter="url(#emblemGlow)"
              />

              {/* Milestone SVG */}
              <image
                href={activeMilestone.assetUrl}
                x="10"
                y="10"
                width="140"
                height="140"
                preserveAspectRatio="xMidYMid meet"
                style={{
                  filter: `drop-shadow(0 0 12px ${profile.equipped.emblemColor || activeMilestone.color})`,
                }}
              />

              {/* Milestone Subtext */}
              <text
                x="80"
                y="170"
                fontFamily="Rajdhani, sans-serif"
                fontWeight="700"
                fontSize="14"
                fill="#94A3B8"
                textAnchor="middle"
                letterSpacing="2"
              >
                {activeMilestone.name.toUpperCase()}
              </text>
            </g>

            {/* ==============================================================
                6. VAULT COINS BADGE ZONE
                ============================================================== */}
            <g
              id="zone-coins"
              transform="translate(940, 155)"
              style={{ cursor: isStudioMode ? "pointer" : "default" }}
              onClick={() => onHotspotClick && onHotspotClick("coins")}
            >
              <rect
                x="0"
                y="0"
                width="180"
                height="56"
                rx="14"
                fill="rgba(15, 23, 42, 0.85)"
                stroke={profile.equipped.coinColor || "#F59E0B"}
                strokeWidth="1.5"
                style={{
                  filter: `drop-shadow(0 0 10px ${profile.equipped.coinColor || "#F59E0B"}40)`,
                }}
              />
              {/* Vault Coin Icon */}
              <image
                href="/assets/branding/vault_coin_icon.svg"
                x="12"
                y="10"
                width="36"
                height="36"
              />
              <text
                x="60"
                y="26"
                fontFamily="Inter, sans-serif"
                fontWeight="600"
                fontSize="11"
                fill="#94A3B8"
                letterSpacing="1"
              >
                VAULT COINS
              </text>
              <text
                x="60"
                y="46"
                fontFamily="Rajdhani, sans-serif"
                fontWeight="800"
                fontSize="22"
                fill={profile.equipped.coinColor || "#F59E0B"}
                letterSpacing="1"
              >
                {profile.vaultCoins.toLocaleString()}
              </text>
            </g>

            {/* ==============================================================
                7. LEVEL & EXP PROGRESSION BAR ZONE
                ============================================================== */}
            <g transform="translate(100, 360)">
              {/* Level Badge Pill */}
              <rect
                x="0"
                y="0"
                width="110"
                height="40"
                rx="10"
                fill="rgba(56, 189, 248, 0.15)"
                stroke="#38BDF8"
                strokeWidth="1.5"
              />
              <text
                x="55"
                y="26"
                fontFamily="Rajdhani, sans-serif"
                fontWeight="800"
                fontSize="20"
                fill="#FFFFFF"
                textAnchor="middle"
                letterSpacing="1.5"
              >
                LV. {stats.level}
              </text>

              {/* EXP Numbers */}
              <text
                x="130"
                y="26"
                fontFamily="Inter, sans-serif"
                fontWeight="600"
                fontSize="15"
                fill="#E2E8F0"
                letterSpacing="0.5"
              >
                {profile.profileExp.toLocaleString()} EXP
              </text>
              <text
                x="1000"
                y="26"
                fontFamily="Inter, sans-serif"
                fontWeight="500"
                fontSize="13"
                fill="#94A3B8"
                textAnchor="end"
              >
                {stats.level >= 100
                  ? "MAX LEVEL"
                  : `${stats.expRemaining.toLocaleString()} EXP to Lv. ${stats.level + 1}`}
              </text>

              {/* Progress Bar Track */}
              <rect x="0" y="52" width="1000" height="12" rx="6" fill="#1E293B" />
              {/* Active Progress Fill */}
              <rect
                x="0"
                y="52"
                width={Math.max(12, (1000 * stats.progressPercent) / 100)}
                height="12"
                rx="6"
                fill="url(#expBarGrad)"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(56, 189, 248, 0.5))",
                }}
              />
            </g>

            {/* ==============================================================
                8. 5 ACHIEVEMENT SHOWCASE BADGES ZONE
                ============================================================== */}
            <g
              id="zone-achievements"
              transform="translate(100, 480)"
              style={{ cursor: isStudioMode ? "pointer" : "default" }}
              onClick={() => onHotspotClick && onHotspotClick("achievements")}
            >
              {/* Showcase Container Bar */}
              <rect
                x="0"
                y="0"
                width="1000"
                height="115"
                rx="18"
                fill="rgba(11, 15, 25, 0.75)"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
              />

              <text
                x="24"
                y="30"
                fontFamily="Rajdhani, sans-serif"
                fontWeight="700"
                fontSize="13"
                fill="#64748B"
                letterSpacing="2"
              >
                ACHIEVEMENT SHOWCASE (5 SLOTS)
              </text>

              {/* 5 Badges Array */}
              {profile.equipped.achievementSlots.map((badgeId, idx) => {
                const badgeAsset = getAssetById(badgeId);
                const xOffset = 80 + idx * 190;
                return (
                  <g key={`badge-slot-${badgeId}-${idx}`} transform={`translate(${xOffset}, 32)`}>
                    {/* Outer Badge Rim */}
                    <circle
                      cx="36"
                      cy="36"
                      r="36"
                      fill="#0F172A"
                      stroke={badgeAsset ? "#38BDF8" : "#334155"}
                      strokeWidth="1.5"
                      opacity="0.8"
                    />

                    {badgeAsset ? (
                      <>
                        <image
                          href={badgeAsset.asset_url}
                          x="4"
                          y="4"
                          width="64"
                          height="64"
                          preserveAspectRatio="xMidYMid meet"
                          filter="url(#badgeGlow)"
                        />
                        <text
                          x="36"
                          y="78"
                          fontFamily="Inter, sans-serif"
                          fontWeight="600"
                          fontSize="11"
                          fill="#E2E8F0"
                          textAnchor="middle"
                        >
                          {badgeAsset.name.length > 16
                            ? badgeAsset.name.slice(0, 14) + "…"
                            : badgeAsset.name}
                        </text>
                      </>
                    ) : (
                      <text
                        x="36"
                        y="42"
                        fontFamily="Inter, sans-serif"
                        fontSize="18"
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
                9. OUTER CARD FRAME (1200 x 675 px)
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
