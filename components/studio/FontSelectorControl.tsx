"use client";

import React from "react";
import { AVAILABLE_FONTS } from "@/lib/assetsCatalog";
import { Check, Type } from "lucide-react";

interface FontSelectorControlProps {
  currentFont: string;
  previewText?: string;
  onChange: (fontId: string) => void;
}

export const FontSelectorControl: React.FC<FontSelectorControlProps> = ({
  currentFont,
  previewText = "Display Name Preview",
  onChange,
}) => {
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
          Display Name Typography
        </span>
        <span
          style={{
            fontSize: "0.8rem",
            color: "#38BDF8",
            fontFamily: currentFont,
            fontWeight: 700,
          }}
        >
          {currentFont}
        </span>
      </div>

      {/* Font Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "10px",
        }}
      >
        {AVAILABLE_FONTS.map((font) => {
          const isSelected = currentFont === font.id;
          return (
            <button
              key={font.id}
              type="button"
              onClick={() => onChange(font.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "6px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: isSelected
                  ? "rgba(56, 189, 248, 0.15)"
                  : "rgba(15, 23, 42, 0.6)",
                border: isSelected
                  ? "1.5px solid #38BDF8"
                  : "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: isSelected
                  ? "0 0 15px rgba(56, 189, 248, 0.25)"
                  : "none",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.18s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#94A3B8",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {font.name}
                </span>
                {isSelected && <Check size={14} color="#38BDF8" strokeWidth={3} />}
              </div>
              <span
                style={{
                  fontFamily: font.id,
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: isSelected ? "#FFFFFF" : "#CBD5E1",
                  letterSpacing: "1px",
                }}
              >
                {previewText}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
