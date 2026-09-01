"use client";

import React from "react";
import { getAssetById, getAssetsByCategory } from "@/lib/assetsCatalog";
import { ArrowUp, ArrowDown, Eye, Plus, Trash2 } from "lucide-react";

interface LayerOrganizerProps {
  equippedLayers: string[];
  onChangeLayers: (newLayers: string[]) => void;
}

export const LayerOrganizer: React.FC<LayerOrganizerProps> = ({
  equippedLayers,
  onChangeLayers,
}) => {
  const allThemeLayers = getAssetsByCategory("theme_layer");

  const moveLayer = (index: number, direction: "up" | "down") => {
    const newLayers = [...equippedLayers];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newLayers.length) return;

    const temp = newLayers[index];
    newLayers[index] = newLayers[targetIdx];
    newLayers[targetIdx] = temp;
    onChangeLayers(newLayers);
  };

  const removeLayer = (index: number) => {
    const newLayers = equippedLayers.filter((_, i) => i !== index);
    onChangeLayers(newLayers);
  };

  const addLayer = (layerId: string) => {
    if (!equippedLayers.includes(layerId)) {
      onChangeLayers([...equippedLayers, layerId]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
          Active Background Layer Stack (Rendered Bottom to Top)
        </span>
        <span style={{ fontSize: "0.8rem", color: "#64748B" }}>
          {equippedLayers.length} Active Layers
        </span>
      </div>

      {/* Equipped Stack List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {equippedLayers.map((layerId, idx) => {
          const asset = getAssetById(layerId);
          if (!asset) return null;
          return (
            <div
              key={`${layerId}-${idx}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderRadius: "10px",
                background: "rgba(15, 23, 42, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                    color: "#38BDF8",
                    fontWeight: 700,
                  }}
                >
                  #{idx + 1}
                </span>
                <img
                  src={asset.asset_url}
                  alt={asset.name}
                  style={{
                    width: "48px",
                    height: "28px",
                    borderRadius: "4px",
                    objectFit: "cover",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#F8FAFC",
                    }}
                  >
                    {asset.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                    Slot: {asset.metadata?.slot || "overlay"} • Rarity:{" "}
                    {asset.rarity}
                  </div>
                </div>
              </div>

              {/* Reorder & Remove Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => moveLayer(idx, "up")}
                  disabled={idx === 0}
                  style={{
                    padding: "6px",
                    borderRadius: "6px",
                    background: "rgba(30, 41, 59, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: idx === 0 ? "#475569" : "#E2E8F0",
                    cursor: idx === 0 ? "not-allowed" : "pointer",
                  }}
                  title="Move Layer Down (Render earlier)"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => moveLayer(idx, "down")}
                  disabled={idx === equippedLayers.length - 1}
                  style={{
                    padding: "6px",
                    borderRadius: "6px",
                    background: "rgba(30, 41, 59, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color:
                      idx === equippedLayers.length - 1
                        ? "#475569"
                        : "#E2E8F0",
                    cursor:
                      idx === equippedLayers.length - 1
                        ? "not-allowed"
                        : "pointer",
                  }}
                  title="Move Layer Up (Render later)"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removeLayer(idx)}
                  disabled={equippedLayers.length <= 1}
                  style={{
                    padding: "6px",
                    borderRadius: "6px",
                    background: "rgba(244, 63, 94, 0.15)",
                    border: "1px solid rgba(244, 63, 94, 0.3)",
                    color: "#F43F5E",
                    cursor:
                      equippedLayers.length <= 1 ? "not-allowed" : "pointer",
                  }}
                  title="Remove Layer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Available Layer Pool to Add */}
      <div style={{ marginTop: "6px" }}>
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "#64748B",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Add Available Theme Layers
        </span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          {allThemeLayers
            .filter((l) => !equippedLayers.includes(l.id))
            .map((layer) => (
              <button
                key={layer.id}
                type="button"
                onClick={() => addLayer(layer.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#CBD5E1",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <Plus size={14} color="#38BDF8" />
                <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  {layer.name}
                </span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};
