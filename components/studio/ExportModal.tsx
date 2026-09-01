"use client";

import React, { useState } from "react";
import { Download, Copy, Check, X, Share2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateCanvas: () => Promise<HTMLCanvasElement>;
  username: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onGenerateCanvas,
  username,
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsRendering(true);
      onGenerateCanvas()
        .then((canvas) => {
          setDataUrl(canvas.toDataURL("image/png"));
          setIsRendering(false);
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#38BDF8", "#A855F7", "#F59E0B"],
          });
        })
        .catch((err) => {
          console.error("Export render error:", err);
          setIsRendering(false);
        });
    } else {
      setDataUrl(null);
    }
  }, [isOpen, onGenerateCanvas]);

  if (!isOpen) return null;

  const handleDownloadPng = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `EN-Profile-${username.replace(/\s+/g, "_")}-1200x675.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(5, 7, 12, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "800px",
          borderRadius: "24px",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          position: "relative",
          boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(56, 189, 248, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Sparkles size={22} color="#38BDF8" />
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "1px",
              }}
            >
              CANONICAL PROFILE CARD EXPORT (1200 × 675 PX)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "rgba(30, 41, 59, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#CBD5E1",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Export Preview */}
        <div
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: "16px",
            overflow: "hidden",
            background: "#090B10",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
          }}
        >
          {isRendering ? (
            <div style={{ color: "#38BDF8", fontWeight: 700, letterSpacing: "1px" }}>
              Rendering High-Resolution 1200×675 Canvas...
            </div>
          ) : dataUrl ? (
            <img
              src={dataUrl}
              alt="EN Profile 1200x675 Card"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <div style={{ color: "#EF4444" }}>Failed to generate export canvas.</div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ fontSize: "0.85rem", color: "#94A3B8" }}>
            Lossless 24-bit PNG with high-DPI vector rasterization.
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCopyLink}
            >
              {copied ? (
                <>
                  <Check size={16} color="#10B981" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 size={16} />
                  Share Profile
                </>
              )}
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleDownloadPng}
              disabled={isRendering || !dataUrl}
            >
              <Download size={18} />
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
