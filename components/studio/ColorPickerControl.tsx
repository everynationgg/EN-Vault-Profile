"use client";

import React, { useState } from "react";
import { CURATED_COLOR_SWATCHES } from "@/lib/assetsCatalog";
import { Check, Pipette } from "lucide-react";

interface ColorPickerControlProps {
  label: string;
  currentColor: string;
  onChange: (hex: string) => void;
}

export const ColorPickerControl: React.FC<ColorPickerControlProps> = ({
  label,
  currentColor,
  onChange,
}) => {
  const [customHex, setCustomHex] = useState(currentColor);

  const handleHexInput = (val: string) => {
    setCustomHex(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
          {label}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "4px",
              background: currentColor,
              boxShadow: `0 0 10px ${currentColor}80`,
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.85rem",
              color: "#F8FAFC",
            }}
          >
            {currentColor.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Preset Swatches Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(36px, 1fr))",
          gap: "8px",
        }}
      >
        {CURATED_COLOR_SWATCHES.map((swatch) => {
          const isSelected =
            currentColor.toLowerCase() === swatch.hex.toLowerCase();
          return (
            <button
              key={swatch.hex}
              type="button"
              onClick={() => {
                setCustomHex(swatch.hex);
                onChange(swatch.hex);
              }}
              title={swatch.label}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: swatch.hex,
                border: isSelected
                  ? "2px solid #FFFFFF"
                  : "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: isSelected ? `0 0 14px ${swatch.hex}` : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
            >
              {isSelected && <Check size={16} color="#000000" strokeWidth={3} />}
            </button>
          );
        })}
      </div>

      {/* Custom HEX Input */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "4px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "8px",
            padding: "6px 10px",
            flex: 1,
          }}
        >
          <Pipette size={14} color="#94A3B8" />
          <input
            type="text"
            value={customHex}
            onChange={(e) => handleHexInput(e.target.value)}
            placeholder="#38BDF8"
            maxLength={7}
            style={{
              background: "transparent",
              border: "none",
              color: "#FFFFFF",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              width: "100%",
              outline: "none",
            }}
          />
        </div>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => {
            setCustomHex(e.target.value);
            onChange(e.target.value);
          }}
          style={{
            width: "36px",
            height: "36px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            background: "transparent",
          }}
        />
      </div>
    </div>
  );
};
