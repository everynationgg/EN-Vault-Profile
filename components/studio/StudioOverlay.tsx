"use client";

import React from "react";
import { HotspotCallout, HotspotZone } from "@/lib/types";

export const HOTSPOT_CONFIG: HotspotCallout[] = [
  {
    id: "avatar",
    label: "Avatar & Frame",
    description: "Equip avatar frames & change profile photo",
    x: 14.5,
    y: 33,
    category: "avatar_frame",
  },
  {
    id: "name",
    label: "Display Name & Font",
    description: "Select custom font & neon HEX color",
    x: 35,
    y: 28,
    category: "name_customizer",
  },
  {
    id: "title",
    label: "Title & Title Frame",
    description: "Equip titles and customize frame glow",
    x: 35,
    y: 41,
    category: "title",
  },
  {
    id: "emblem",
    label: "Milestone Emblem",
    description: "Level milestone crest & custom aura tint",
    x: 67,
    y: 32,
    category: "emblem",
  },
  {
    id: "coins",
    label: "Vault Coins",
    description: "Authoritative balance & badge accent color",
    x: 85.5,
    y: 27,
    category: "coins_customizer",
  },
  {
    id: "achievements",
    label: "5-Slot Showcase",
    description: "Equip and reorder 5 achievement trophies",
    x: 50,
    y: 80,
    category: "badge",
  },
  {
    id: "card_frame",
    label: "Card Frame",
    description: "1200x675 outer border & bevels",
    x: 95,
    y: 8,
    category: "card_frame",
  },
  {
    id: "theme",
    label: "Multi-Layer Theme",
    description: "Stack base, circuits, and ambient glows",
    x: 5,
    y: 8,
    category: "theme_stack",
  },
];

interface StudioOverlayProps {
  activeHotspot: HotspotZone | null;
  onSelectHotspot: (zone: HotspotZone) => void;
  isVisible: boolean;
}

export const StudioOverlay: React.FC<StudioOverlayProps> = ({
  activeHotspot,
  onSelectHotspot,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 45,
      }}
    >
      {HOTSPOT_CONFIG.map((spot) => {
        const isActive = activeHotspot === spot.id;
        return (
          <div
            key={spot.id}
            className={`hotspot-dot ${isActive ? "active" : ""}`}
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              pointerEvents: "auto",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectHotspot(spot.id);
            }}
            title={spot.label}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: "#05070C",
                lineHeight: 1,
              }}
            >
              +
            </span>
            <div className="hotspot-tooltip">
              <span style={{ color: "#38BDF8" }}>● </span>
              {spot.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
