"use client";

import React, { useState } from "react";
import { getAssetById, getAssetsByCategory } from "@/lib/assetsCatalog";
import { Check, Trophy, Lock } from "lucide-react";
import { ProfileAsset } from "@/lib/types";

interface AchievementSlotPickerProps {
  equippedSlots: string[]; // 5 slots
  unlockedAssetIds: string[];
  onUpdateSlots: (newSlots: string[]) => void;
}

export const AchievementSlotPicker: React.FC<AchievementSlotPickerProps> = ({
  equippedSlots,
  unlockedAssetIds,
  onUpdateSlots,
}) => {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
  const allBadges = getAssetsByCategory("badge");

  const handleEquipBadgeToSlot = (badgeId: string) => {
    const newSlots = [...equippedSlots];
    newSlots[selectedSlotIndex] = badgeId;
    onUpdateSlots(newSlots);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* 5 Slots Selector Header */}
      <div>
        <span
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            letterSpacing: "1px",
            color: "#94A3B8",
            textTransform: "uppercase",
          }}
        >
          Select Showcase Slot to Customize (1 to 5)
        </span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(58px, 1fr))",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          {equippedSlots.map((badgeId, idx) => {
            const asset = getAssetById(badgeId);
            const isSelected = selectedSlotIndex === idx;
            return (
              <button
                key={`slot-${idx}`}
                type="button"
                onClick={() => setSelectedSlotIndex(idx)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 6px",
                  borderRadius: "12px",
                  background: isSelected
                    ? "rgba(56, 189, 248, 0.15)"
                    : "rgba(15, 23, 42, 0.6)",
                  border: isSelected
                    ? "2px solid #38BDF8"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: isSelected
                    ? "0 0 15px rgba(56, 189, 248, 0.3)"
                    : "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: isSelected ? "#38BDF8" : "#64748B",
                  }}
                >
                  SLOT {idx + 1}
                </span>
                {asset ? (
                  <img
                    src={asset.asset_url}
                    alt={asset.name}
                    style={{
                      width: "44px",
                      height: "44px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#475569",
                    }}
                  >
                    +
                  </div>
                )}
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#F8FAFC",
                    maxWidth: "90px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {asset?.name || "Empty"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Badges Grid */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "1px",
              color: "#94A3B8",
              textTransform: "uppercase",
            }}
          >
            Available Badges for Slot #{selectedSlotIndex + 1}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "10px",
          }}
        >
          {allBadges.map((badge) => {
            const isEquippedInThisSlot =
              equippedSlots[selectedSlotIndex] === badge.id;
            const isEquippedInOtherSlot =
              equippedSlots.includes(badge.id) && !isEquippedInThisSlot;
            const isUnlocked =
              badge.is_starter || unlockedAssetIds.includes(badge.id);

            return (
              <button
                key={badge.id}
                type="button"
                onClick={() => isUnlocked && handleEquipBadgeToSlot(badge.id)}
                disabled={!isUnlocked}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: isEquippedInThisSlot
                    ? "rgba(56, 189, 248, 0.15)"
                    : isUnlocked
                    ? "rgba(15, 23, 42, 0.6)"
                    : "rgba(15, 23, 42, 0.3)",
                  border: isEquippedInThisSlot
                    ? "1.5px solid #38BDF8"
                    : isUnlocked
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(255, 255, 255, 0.05)",
                  cursor: isUnlocked ? "pointer" : "not-allowed",
                  textAlign: "left",
                  opacity: isUnlocked ? 1 : 0.5,
                  transition: "all 0.18s ease",
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={badge.asset_url}
                    alt={badge.name}
                    style={{
                      width: "42px",
                      height: "42px",
                      objectFit: "contain",
                      filter: isUnlocked ? "none" : "grayscale(80%)",
                    }}
                  />
                  {!isUnlocked && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0, 0, 0, 0.6)",
                        borderRadius: "50%",
                      }}
                    >
                      <Lock size={16} color="#94A3B8" />
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: isEquippedInThisSlot ? "#38BDF8" : "#F8FAFC",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {badge.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#94A3B8",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isUnlocked
                      ? badge.description
                      : `Locked • Requires ${badge.unlock_type}`}
                  </div>
                </div>

                {isEquippedInThisSlot && (
                  <Check size={16} color="#38BDF8" strokeWidth={3} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
