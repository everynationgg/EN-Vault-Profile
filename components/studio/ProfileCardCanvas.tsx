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
    const equippedEmblemAsset = getAssetById(profile.equipped.emblemId);
    const emblemUrl = equippedEmblemAsset?.asset_url || activeMilestone.assetUrl;
    const emblemColor =
      profile.equipped.emblemColor ||
      (equippedEmblemAsset?.metadata?.color as string) ||
      activeMilestone.color;

    const titleText =
      (titleAsset?.metadata?.title_text as string) || titleAsset?.name || "VAULT SEEKER";

    const avatarUrl =
      profile.customAvatarUrl ||
      profile.discordAvatarUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

    // Expose export helpers for full 1200x675 PNG generation
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
            borderRadius: "20px",
            overflow: "hidden",
            background: "#080414",
          }}
        >
          <defs>
            {/* Card Silhouette Clip Path */}
            <clipPath id="cardClip">
              <rect x="0" y="0" width="1200" height="675" rx="20" />
            </clipPath>

            {/* Avatar Circular Clip (Diameter ~260px) */}
            <clipPath id="avatarClip">
              <circle cx="240" cy="245" r="126" />
            </clipPath>

            {/* Visual Filters */}
            <filter id="nameGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="emblemGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="14" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="expBarGlow" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="badgeCardGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradients */}
            <linearGradient id="expBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#D946EF" />
            </linearGradient>

            <linearGradient id="coinGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="75%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            <linearGradient id="cardBadgeBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1C1133" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0B0617" stopOpacity="0.95" />
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

            {/* ==============================================================
                2. AVATAR & AVATAR FRAME ZONE (Top Left)
                ============================================================== */}
            <g id="zone-avatar">
              {/* Avatar Dark Underlay */}
              <circle cx="240" cy="245" r="130" fill="#0E0820" />

              {/* Avatar User Photo */}
              <image
                href={avatarUrl}
                x="110"
                y="115"
                width="260"
                height="260"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#avatarClip)"
              />

              {/* Equipped Ornate Avatar Frame */}
              <image
                href={avatarFrameAsset?.asset_url || "/assets/frames/avatar_vault_seeker.svg"}
                x={avatarFrameAsset?.id === "frame_avatar_mystic_cat" ? "50" : "80"}
                y={avatarFrameAsset?.id === "frame_avatar_mystic_cat" ? "65" : "90"}
                width={avatarFrameAsset?.id === "frame_avatar_mystic_cat" ? "380" : "320"}
                height={avatarFrameAsset?.id === "frame_avatar_mystic_cat" ? "380" : "320"}
                preserveAspectRatio="xMidYMid meet"
              />
            </g>

            {/* ==============================================================
                3. DISCORD DISPLAY NAME & USERNAME (Beside Avatar)
                ============================================================== */}
            <g id="zone-identity" transform="translate(435, 55)">
              {/* Display Name */}
              <text
                x="0"
                y="70"
                fontFamily={profile.equipped.nameFont || "Rajdhani, sans-serif"}
                fontWeight="900"
                fontSize="72"
                fill={profile.equipped.nameColor || "#FFFFFF"}
                letterSpacing="2"
                filter="url(#nameGlow)"
              >
                {profile.discordDisplayName || "EnGG"}
              </text>

              {/* Discord Logo + Discord Username */}
              <g transform="translate(0, 96)">
                {/* Discord Icon */}
                <svg
                  x="0"
                  y="0"
                  width="28"
                  height="28"
                  viewBox="0 0 127.14 96.36"
                  fill="#A855F7"
                >
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
                </svg>

                <text
                  x="38"
                  y="22"
                  fontFamily="Inter, sans-serif"
                  fontWeight="700"
                  fontSize="26"
                  fill="#E2E8F0"
                  letterSpacing="0.5"
                >
                  {profile.discordUsername || "EnGG#1234"}
                </text>
              </g>
            </g>

            {/* ==============================================================
                4. ORNATE TITLE FRAME BANNER PLAQUE
                ============================================================== */}
            <g
              id="zone-title"
              transform={
                titleAsset?.id === "title_mystic_cat"
                  ? "translate(400, 195)"
                  : "translate(435, 212)"
              }
            >
              {/* Beveled Plaque Frame */}
              <image
                href={
                  titleAsset?.asset_url ||
                  "/assets/titles/title_vault_seeker_banner.svg"
                }
                x="0"
                y="0"
                width={titleAsset?.id === "title_mystic_cat" ? "520" : "540"}
                height={titleAsset?.id === "title_mystic_cat" ? "150" : "76"}
                preserveAspectRatio={
                  titleAsset?.id === "title_mystic_cat"
                    ? "xMidYMid meet"
                    : "none"
                }
              />

              {/* Title Text */}
              <text
                x={titleAsset?.id === "title_mystic_cat" ? "260" : "270"}
                y={titleAsset?.id === "title_mystic_cat" ? "82" : "46"}
                fontFamily="Cinzel, serif"
                fontWeight="700"
                fontSize={titleAsset?.id === "title_mystic_cat" ? "22" : "24"}
                fill={profile.equipped.titleColor || "#FFFFFF"}
                letterSpacing="4"
                textAnchor="middle"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(232, 121, 249, 0.6))",
                }}
              >
                {titleText.toUpperCase()}
              </text>
            </g>

            {/* ==============================================================
                5. MAIN MILESTONE LEVEL EMBLEM (Top Right)
                ============================================================== */}
            <g id="zone-emblem" transform="translate(835, 70)">
              {/* Ambient Glow */}
              <circle
                cx="65"
                cy="75"
                r="70"
                fill={emblemColor}
                opacity="0.2"
                filter="url(#emblemGlow)"
              />

              {/* 3D Milestone Crest */}
              <image
                href={emblemUrl}
                x="0"
                y="0"
                width="130"
                height="145"
                preserveAspectRatio="xMidYMid meet"
                style={{
                  filter: `drop-shadow(0 0 18px ${emblemColor})`,
                }}
              />
            </g>

            {/* ==============================================================
                6. LEVEL + EXP PROGRESS BAR & VAULT COINS (Middle Row)
                ============================================================== */}
            <g transform="translate(440, 320)">
              {/* LEVEL Column */}
              <text
                x="0"
                y="14"
                fontFamily="Inter, sans-serif"
                fontWeight="800"
                fontSize="14"
                fill="#A855F7"
                letterSpacing="2"
              >
                LEVEL
              </text>
              <text
                x="0"
                y="62"
                fontFamily="var(--font-display)"
                fontWeight="900"
                fontSize="50"
                fill="#FFFFFF"
                letterSpacing="1"
              >
                {profile.profileLevel || stats.level}
              </text>

              {/* Progress Bar Track & Fill */}
              <rect x="95" y="32" width="250" height="14" rx="7" fill="#18102B" />
              <rect
                x="95"
                y="32"
                width={Math.max(14, (250 * stats.progressPercent) / 100)}
                height="14"
                rx="7"
                fill="url(#expBarGrad)"
                filter="url(#expBarGlow)"
              />

              {/* EXP Numbers */}
              <text
                x="345"
                y="65"
                fontFamily="Inter, sans-serif"
                fontWeight="600"
                fontSize="13"
                fill="#94A3B8"
                textAnchor="end"
              >
                {profile.profileExp.toLocaleString()} /{" "}
                {stats.nextLevelExp.toLocaleString()} EXP
              </text>

              {/* VAULT COINS (Right of Level Row) */}
              <g transform="translate(390, 0)">
                <text
                  x="48"
                  y="14"
                  fontFamily="Inter, sans-serif"
                  fontWeight="800"
                  fontSize="13"
                  fill="#F59E0B"
                  letterSpacing="1.5"
                >
                  VAULT COINS
                </text>

                {/* 3D Gold Star Coin Icon */}
                <g transform="translate(0, 24)">
                  <circle cx="20" cy="20" r="18" fill="url(#coinGoldGrad)" />
                  <circle cx="20" cy="20" r="14" stroke="#FEF08A" strokeWidth="1.5" fill="#B45309" />
                  <polygon
                    points="20,10 23,17 30,18 25,23 26,30 20,26 14,30 15,23 10,18 17,17"
                    fill="#FEF08A"
                  />
                </g>

                {/* Coin Numbers */}
                <text
                  x="48"
                  y="58"
                  fontFamily="var(--font-display)"
                  fontWeight="900"
                  fontSize="34"
                  fill={profile.equipped.coinColor || "#FFFFFF"}
                  letterSpacing="1"
                >
                  {profile.vaultCoins.toLocaleString()}
                </text>
              </g>
            </g>

            {/* ==============================================================
                7. 5 LARGE ACHIEVEMENT SHOWCASE CARDS (Bottom Row)
                ============================================================== */}
            <g id="zone-achievements" transform="translate(70, 445)">
              {profile.equipped.achievementSlots.slice(0, 5).map((badgeId, idx) => {
                const badgeAsset = getAssetById(badgeId);
                const slotX = idx * 215; // 5 cards spaced across 1060px width
                const badgeColor =
                  (badgeAsset?.metadata?.color as string) || "#C084FC";

                return (
                  <g key={`badge-slot-${badgeId}-${idx}`} transform={`translate(${slotX}, 0)`}>
                    {/* Glass Card Container */}
                    <rect
                      x="0"
                      y="0"
                      width="196"
                      height="180"
                      rx="16"
                      fill="url(#cardBadgeBg)"
                      stroke={badgeColor}
                      strokeWidth="1.5"
                      strokeOpacity="0.45"
                      filter="url(#badgeCardGlow)"
                    />

                    {/* Inner Glass Highlight */}
                    <rect
                      x="4"
                      y="4"
                      width="188"
                      height="172"
                      rx="12"
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeWidth="1"
                      fill="none"
                    />

                    {badgeAsset ? (
                      <>
                        {/* 3D Badge Artwork (Top) */}
                        <image
                          href={badgeAsset.asset_url}
                          x="58"
                          y="15"
                          width="80"
                          height="80"
                          preserveAspectRatio="xMidYMid meet"
                        />

                        {/* Badge Name (Middle) */}
                        <text
                          x="98"
                          y="118"
                          fontFamily="var(--font-display)"
                          fontWeight="800"
                          fontSize="14"
                          fill={badgeColor}
                          letterSpacing="1"
                          textAnchor="middle"
                        >
                          {badgeAsset.name.toUpperCase()}
                        </text>

                        {/* Badge Criteria / Description (Bottom) */}
                        <text
                          x="98"
                          y="142"
                          fontFamily="Inter, sans-serif"
                          fontWeight="500"
                          fontSize="11"
                          fill="#94A3B8"
                          textAnchor="middle"
                        >
                          {badgeAsset.description.length > 25 ? (
                            <>
                              <tspan x="98" dy="0">
                                {badgeAsset.description.slice(0, 24)}
                              </tspan>
                              <tspan x="98" dy="14">
                                {badgeAsset.description.slice(24)}
                              </tspan>
                            </>
                          ) : (
                            badgeAsset.description
                          )}
                        </text>
                      </>
                    ) : (
                      <text
                        x="98"
                        y="95"
                        fontFamily="Inter, sans-serif"
                        fontSize="28"
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
                8. OUTER BEVELED CRYSTAL CORNERS FRAME (1200 x 675 px)
                ============================================================== */}
            <image
              id="zone-card_frame"
              href={cardFrameAsset?.asset_url || "/assets/frames/card_vault_legendary.svg"}
              x="0"
              y="0"
              width="1200"
              height="675"
              preserveAspectRatio="none"
              style={{ pointerEvents: "none" }}
            />
          </g>
        </svg>
      </div>
    );
  }
);

ProfileCardCanvas.displayName = "ProfileCardCanvas";
