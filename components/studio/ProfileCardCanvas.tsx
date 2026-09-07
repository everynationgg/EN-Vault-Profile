"use client";

import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect, useCallback } from "react";
import { UserProfileState } from "@/lib/types";
import { calculateProgressionStats, getMilestoneEmblemForLevel } from "@/lib/progression";
import { getAssetById } from "@/lib/assetsCatalog";
import { Move, Check, RotateCcw, Copy, Sliders, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export interface ProfileCardCanvasRef {
  getSvgElement: () => SVGSVGElement | null;
  exportToCanvas: () => Promise<HTMLCanvasElement>;
  exportToDataUrl: () => Promise<string>;
}

interface ProfileCardCanvasProps {
  profile: UserProfileState;
  showToolbar?: boolean;
}

export interface WwmLayoutState {
  avatar: { x: number; y: number; r: number; scale?: number };
  avatarFrame: { x: number; y: number; scale?: number };
  identity: { x: number; y: number; scale?: number };
  name: { x: number; y: number; scale?: number };
  tag: { x: number; y: number; scale?: number };
  level: { x: number; y: number; scale?: number };
  title: { x: number; y: number; scale?: number };
  titleText: { x: number; y: number; scale?: number };
  coins: { x: number; y: number; scale?: number };
  achievements: { x: number; y: number; scale?: number };
}

export const DEFAULT_WWM_LAYOUT: WwmLayoutState = {
  avatar: { x: 288, y: 295, r: 88, scale: 1 },
  avatarFrame: { x: 0, y: 0, scale: 1 },
  identity: { x: 288, y: 465, scale: 1 },
  name: { x: 0, y: 32, scale: 1 },
  tag: { x: 0, y: 62, scale: 1 },
  level: { x: 0, y: 104, scale: 1 },
  title: { x: 0, y: 0, scale: 1 },
  titleText: { x: 690, y: 280, scale: 1 },
  coins: { x: 1020, y: 102, scale: 1 },
  achievements: { x: 0, y: 0, scale: 1 },
};

export const ProfileCardCanvas = forwardRef<ProfileCardCanvasRef, ProfileCardCanvasProps>(
  ({ profile, showToolbar = true }, ref) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    // ================================================================
    // VISUAL LAYOUT EDITOR MODE (Direct Drag & Nudge)
    // ================================================================
    const [isEditorMode, setIsEditorMode] = useState<boolean>(false);
    const [selectedElement, setSelectedElement] = useState<string>("identity");
    const [wwmLayout, setWwmLayout] = useState<WwmLayoutState>(DEFAULT_WWM_LAYOUT);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState<{ mouseX: number; mouseY: number; elemX: number; elemY: number } | null>(null);
    const [saved, setSaved] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    // Load saved layout from localStorage on mount
    useEffect(() => {
      try {
        const savedWwm = localStorage.getItem("en_card_layout_wwm");
        if (savedWwm) {
          setWwmLayout((prev) => ({
            ...DEFAULT_WWM_LAYOUT,
            ...JSON.parse(savedWwm),
          }));
        }
      } catch (e) {
        console.warn("Could not load custom layout:", e);
      }
    }, []);

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

    const isWindsMeet =
      profile.equipped.themeLayers.includes("theme_where_winds_meet_bg") ||
      avatarFrameAsset?.id === "frame_avatar_where_winds_meet" ||
      titleAsset?.id === "title_where_winds_meet";

    const isFullCanvasAvatar =
      avatarFrameAsset?.id === "frame_avatar_where_winds_meet" ||
      avatarFrameAsset?.id === "frame_avatar_palworld" ||
      Boolean(avatarFrameAsset?.metadata?.is_full_canvas);

    const isFullCanvasTitle =
      titleAsset?.id === "title_where_winds_meet" ||
      titleAsset?.id === "title_palworld" ||
      Boolean(titleAsset?.metadata?.is_full_canvas);

    const discordTag = profile.discordUsername || "EnGG#1234";
    const approxTagTextWidth = discordTag.length * 13;
    const discordIconWidth = 24;
    const discordIconGap = 8;
    const totalTagWidth = discordIconWidth + discordIconGap + approxTagTextWidth;
    const discordStartX = -totalTagWidth / 2;

    const avatarUrl =
      profile.customAvatarUrl ||
      profile.discordAvatarUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

    // Convert screen client coordinates to exact 1200x675 SVG coordinates
    const getSvgCoords = useCallback((clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      return { x: Math.round(svgP.x), y: Math.round(svgP.y) };
    }, []);

    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [resizeStart, setResizeStart] = useState<{
      mouseX: number;
      mouseY: number;
      startScale: number;
      centerX: number;
      centerY: number;
    } | null>(null);

    const handleMouseDown = (elemKey: string, e: React.MouseEvent) => {
      if (!isEditorMode) return;
      e.stopPropagation();
      e.preventDefault();
      setSelectedElement(elemKey);
      setIsDragging(true);
      const svgPos = getSvgCoords(e.clientX, e.clientY);
      const currentPos = (wwmLayout as any)[elemKey] || { x: 0, y: 0 };
      setDragStart({
        mouseX: svgPos.x,
        mouseY: svgPos.y,
        elemX: currentPos.x,
        elemY: currentPos.y,
      });
    };

    const handleResizeStart = (
      elemKey: string,
      centerX: number,
      centerY: number,
      e: React.MouseEvent
    ) => {
      if (!isEditorMode) return;
      e.stopPropagation();
      e.preventDefault();
      setSelectedElement(elemKey);
      setIsResizing(true);
      const svgPos = getSvgCoords(e.clientX, e.clientY);
      const cur = (wwmLayout as any)[elemKey] || { scale: 1 };
      const currentScale = cur.scale !== undefined ? cur.scale : 1;
      setResizeStart({
        mouseX: svgPos.x,
        mouseY: svgPos.y,
        startScale: currentScale,
        centerX,
        centerY,
      });
    };

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isEditorMode || !selectedElement) return;

      if (isResizing && resizeStart) {
        const currentSvg = getSvgCoords(e.clientX, e.clientY);
        const startDist = Math.hypot(
          resizeStart.mouseX - resizeStart.centerX,
          resizeStart.mouseY - resizeStart.centerY
        );
        const currentDist = Math.hypot(
          currentSvg.x - resizeStart.centerX,
          currentSvg.y - resizeStart.centerY
        );
        if (startDist > 5) {
          const ratio = currentDist / startDist;
          const newScale = Math.max(
            0.2,
            Math.min(3.0, Math.round(resizeStart.startScale * ratio * 100) / 100)
          );
          setWwmLayout((prev: any) => {
            const cur = prev[selectedElement] || { x: 0, y: 0 };
            return {
              ...prev,
              [selectedElement]: {
                ...cur,
                scale: newScale,
              },
            };
          });
        }
        return;
      }

      if (isDragging && dragStart) {
        const currentSvg = getSvgCoords(e.clientX, e.clientY);
        const deltaX = currentSvg.x - dragStart.mouseX;
        const deltaY = currentSvg.y - dragStart.mouseY;

        setWwmLayout((prev: any) => {
          const cur = prev[selectedElement] || { x: 0, y: 0 };
          return {
            ...prev,
            [selectedElement]: {
              ...cur,
              x: dragStart.elemX + deltaX,
              y: dragStart.elemY + deltaY,
            },
          };
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setDragStart(null);
      setResizeStart(null);
    };

    const changeScale = useCallback(
      (delta: number) => {
        if (!selectedElement) return;
        setWwmLayout((prev: any) => {
          const cur = prev[selectedElement] || { x: 0, y: 0, scale: 1 };
          const currentScale = cur.scale !== undefined ? cur.scale : 1;
          const newScale = Math.max(
            0.2,
            Math.min(3.0, Math.round((currentScale + delta) * 100) / 100)
          );
          return {
            ...prev,
            [selectedElement]: {
              ...cur,
              scale: newScale,
            },
          };
        });
      },
      [selectedElement]
    );

    // Keyboard Arrow Nudge (1px, or Shift = 10px) & +/- scale
    useEffect(() => {
      if (!isEditorMode || !selectedElement) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1;
          let dx = 0;
          let dy = 0;
          if (e.key === "ArrowUp") dy = -step;
          if (e.key === "ArrowDown") dy = step;
          if (e.key === "ArrowLeft") dx = -step;
          if (e.key === "ArrowRight") dx = step;

          setWwmLayout((prev: any) => {
            const cur = prev[selectedElement] || { x: 0, y: 0 };
            return {
              ...prev,
              [selectedElement]: {
                ...cur,
                x: cur.x + dx,
                y: cur.y + dy,
              },
            };
          });
        } else if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          changeScale(e.shiftKey ? 0.1 : 0.05);
        } else if (e.key === "-" || e.key === "_") {
          e.preventDefault();
          changeScale(e.shiftKey ? -0.1 : -0.05);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isEditorMode, selectedElement, changeScale]);

    // Global mousemove/mouseup window listeners so dragging & resizing never drops
    useEffect(() => {
      if (!isDragging && !isResizing) return;

      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (isResizing && resizeStart && selectedElement) {
          const currentSvg = getSvgCoords(e.clientX, e.clientY);
          const startDist = Math.hypot(
            resizeStart.mouseX - resizeStart.centerX,
            resizeStart.mouseY - resizeStart.centerY
          );
          const currentDist = Math.hypot(
            currentSvg.x - resizeStart.centerX,
            currentSvg.y - resizeStart.centerY
          );
          if (startDist > 5) {
            const ratio = currentDist / startDist;
            const newScale = Math.max(
              0.2,
              Math.min(3.0, Math.round(resizeStart.startScale * ratio * 100) / 100)
            );
            setWwmLayout((prev: any) => {
              const cur = prev[selectedElement] || { x: 0, y: 0 };
              return {
                ...prev,
                [selectedElement]: {
                  ...cur,
                  scale: newScale,
                },
              };
            });
          }
          return;
        }

        if (isDragging && dragStart && selectedElement) {
          const currentSvg = getSvgCoords(e.clientX, e.clientY);
          const deltaX = currentSvg.x - dragStart.mouseX;
          const deltaY = currentSvg.y - dragStart.mouseY;

          setWwmLayout((prev: any) => {
            const cur = prev[selectedElement] || { x: 0, y: 0 };
            return {
              ...prev,
              [selectedElement]: {
                ...cur,
                x: dragStart.elemX + deltaX,
                y: dragStart.elemY + deltaY,
              },
            };
          });
        }
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
        setDragStart(null);
        setResizeStart(null);
      };

      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }, [isDragging, isResizing, dragStart, resizeStart, selectedElement, getSvgCoords]);

    // High-visibility interactive corner resize handle
    const renderResizeHandle = (
      x: number,
      y: number,
      key: string,
      centerX: number,
      centerY: number,
      color: string = "#A855F7"
    ) => (
      <g
        transform={`translate(${x}, ${y})`}
        cursor="nwse-resize"
        onMouseDown={(e) => handleResizeStart(key, centerX, centerY, e)}
        style={{ pointerEvents: "all" }}
      >
        <circle r="14" fill="transparent" />
        <rect
          x="-7"
          y="-7"
          width="14"
          height="14"
          rx="3"
          fill={color}
          stroke="#FFFFFF"
          strokeWidth="2"
          style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.85))" }}
        />
        <path
          d="M-3 3 L3 -3 M-0.5 3 L3 -0.5"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>
    );

    const nudge = (dx: number, dy: number) => {
      if (!selectedElement) return;
      setWwmLayout((prev: any) => {
        const cur = prev[selectedElement] || { x: 0, y: 0 };
        return {
          ...prev,
          [selectedElement]: {
            ...cur,
            x: cur.x + dx,
            y: cur.y + dy,
          },
        };
      });
    };

    const handleSaveLayout = () => {
      try {
        localStorage.setItem("en_card_layout_wwm", JSON.stringify(wwmLayout));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        console.error("Save layout error:", err);
      }
    };

    const handleResetLayout = () => {
      setWwmLayout(DEFAULT_WWM_LAYOUT);
      try {
        localStorage.removeItem("en_card_layout_wwm");
      } catch (err) {
        console.error("Reset error:", err);
      }
    };

    const handleCopyConfig = () => {
      const json = JSON.stringify(wwmLayout, null, 2);
      navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const activeCoords = selectedElement ? (wwmLayout as any)[selectedElement] : null;

    // Expose export helpers for full 1200x675 PNG generation
    useImperativeHandle(ref, () => ({
      getSvgElement: () => svgRef.current,
      exportToCanvas: async () => {
        const svgEl = svgRef.current;
        if (!svgEl) throw new Error("SVG reference not available");

        const origin = typeof window !== "undefined" ? window.location.origin : "";
        let svgData = new XMLSerializer().serializeToString(svgEl);
        if (origin) {
          svgData = svgData.replace(/href="\/assets\//g, `href="${origin}/assets/`);
        }
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
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
        {/* ==============================================================
            VISUAL LAYOUT EDITOR TOOLBAR (Compact Sci-Fi HUD)
            ============================================================== */}
        {showToolbar && (
        <div className="layout-editor-panel">
          {!isEditorMode ? (
            /* Mode OFF: Sleek Slim Row */
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "2px 4px" }}>
              <button
                type="button"
                onClick={() => setIsEditorMode(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <Move size={13} />
                📐 EDIT LAYOUT
              </button>
              <span style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 600 }}>
                Click to customize positions & sizes
              </span>
            </div>
          ) : (
            /* Mode ON: Compact Two-Tier Sci-Fi Panel */
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "2px 2px" }}>
              {/* Tier 1: Toggle, Selector, Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setIsEditorMode(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "5px 12px",
                      borderRadius: "7px",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      letterSpacing: "0.5px",
                      background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                      border: "1px solid #A855F7",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
                    }}
                  >
                    <Move size={13} />
                    LAYOUT EDITOR: ON
                  </button>

                  <select
                    value={selectedElement}
                    onChange={(e) => setSelectedElement(e.target.value)}
                    style={{
                      background: "rgba(11, 15, 25, 0.9)",
                      border: "1px solid rgba(168, 85, 247, 0.4)",
                      color: "#E9D5FF",
                      borderRadius: "7px",
                      padding: "4px 8px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      outline: "none",
                      cursor: "pointer",
                      maxWidth: "185px",
                    }}
                  >
                    <option value="avatar">👤 Avatar Photo Circle</option>
                    <option value="avatarFrame">🦁 Avatar Frame Ring</option>
                    <option value="identity">🆔 Entire Identity Block</option>
                    <option value="name">✏️ Name Text</option>
                    <option value="tag">🏷️ Discord Tag</option>
                    <option value="level">⭐ Level Text</option>
                    <option value="title">📜 Title Frame Banner</option>
                    <option value="titleText">🖋️ Title Text</option>
                    <option value="coins">🪙 Coins Block</option>
                    <option value="achievements">🏆 Badges Row</option>
                  </select>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={handleResetLayout}
                    title="Reset layout to defaults"
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#CBD5E1",
                      cursor: "pointer",
                    }}
                  >
                    <RotateCcw size={11} style={{ display: "inline", marginRight: "3px" }} />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyConfig}
                    title="Copy coordinates JSON"
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#CBD5E1",
                      cursor: "pointer",
                    }}
                  >
                    {copied ? <Check size={11} color="#10B981" style={{ display: "inline", marginRight: "3px" }} /> : <Copy size={11} style={{ display: "inline", marginRight: "3px" }} />}
                    {copied ? "Copied!" : "JSON"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveLayout}
                    title="Save layout to local storage"
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      background: saved ? "linear-gradient(135deg, #10B981, #059669)" : "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                      border: "none",
                      color: "#FFFFFF",
                      cursor: "pointer",
                    }}
                  >
                    {saved ? <Check size={11} style={{ display: "inline", marginRight: "3px" }} /> : null}
                    {saved ? "Saved!" : "Save Layout"}
                  </button>
                </div>
              </div>

              {/* Tier 2: Steppers & Coordinate Controls */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px", paddingTop: "5px", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  {/* X Coordinate Stepper */}
                  {activeCoords && (
                    <div style={{ display: "flex", alignItems: "center", gap: "3px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "2px 6px", fontSize: "0.7rem", color: "#CBD5E1", fontWeight: 700 }}>
                      <span style={{ color: "#94A3B8" }}>X:</span>
                      <span style={{ minWidth: "26px", textAlign: "center", color: "#C084FC" }}>{activeCoords.x}</span>
                      <button type="button" onClick={() => nudge(-1, 0)} title="Move Left" style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#FFF", borderRadius: "3px", width: "16px", height: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
                      <button type="button" onClick={() => nudge(1, 0)} title="Move Right" style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#FFF", borderRadius: "3px", width: "16px", height: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                  )}

                  {/* Y Coordinate Stepper */}
                  {activeCoords && (
                    <div style={{ display: "flex", alignItems: "center", gap: "3px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "2px 6px", fontSize: "0.7rem", color: "#CBD5E1", fontWeight: 700 }}>
                      <span style={{ color: "#94A3B8" }}>Y:</span>
                      <span style={{ minWidth: "26px", textAlign: "center", color: "#C084FC" }}>{activeCoords.y}</span>
                      <button type="button" onClick={() => nudge(0, -1)} title="Move Up" style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#FFF", borderRadius: "3px", width: "16px", height: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
                      <button type="button" onClick={() => nudge(0, 1)} title="Move Down" style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#FFF", borderRadius: "3px", width: "16px", height: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                  )}

                  {/* Scale Stepper */}
                  {activeCoords && (
                    <div style={{ display: "flex", alignItems: "center", gap: "3px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "2px 6px", fontSize: "0.7rem", color: "#CBD5E1", fontWeight: 700 }}>
                      <span style={{ color: "#94A3B8" }}>Scale:</span>
                      <span style={{ minWidth: "32px", textAlign: "center", color: "#38BDF8" }}>{Math.round((activeCoords.scale ?? 1) * 100)}%</span>
                      <button type="button" onClick={() => changeScale(-0.05)} title="Scale Down" style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#FFF", borderRadius: "3px", width: "16px", height: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
                      <button type="button" onClick={() => changeScale(0.05)} title="Scale Up" style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#FFF", borderRadius: "3px", width: "16px", height: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                  )}

                  {/* Radius Stepper (Only for Avatar) */}
                  {selectedElement === "avatar" && (
                    <div style={{ display: "flex", alignItems: "center", gap: "3px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "6px", padding: "2px 6px", fontSize: "0.7rem", color: "#CBD5E1", fontWeight: 700 }}>
                      <span style={{ color: "#38BDF8" }}>R:</span>
                      <span style={{ minWidth: "24px", textAlign: "center", color: "#38BDF8" }}>{wwmLayout.avatar.r}</span>
                      <button type="button" onClick={() => setWwmLayout((prev) => ({ ...prev, avatar: { ...prev.avatar, r: Math.max(20, prev.avatar.r - 2) } }))} title="Decrease Radius" style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#FFF", borderRadius: "3px", width: "16px", height: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
                      <button type="button" onClick={() => setWwmLayout((prev) => ({ ...prev, avatar: { ...prev.avatar, r: prev.avatar.r + 2 } }))} title="Increase Radius" style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#FFF", borderRadius: "3px", width: "16px", height: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                  )}
                </div>

                <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>
                  Drag element/handle • Arrows nudge • +/- scale
                </span>
              </div>
            </div>
          )}
        </div>
        )}

        {/* Canonical 16:9 Profile Card Preview */}
        <div className="profile-card-wrapper">

        <svg
          ref={svgRef}
          viewBox="0 0 1200 675"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            aspectRatio: "16 / 9",
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

            {/* Avatar Circular Clip Path for Where Winds Meet */}
            <clipPath id="avatarClipWWM">
              <circle
                cx={wwmLayout.avatar.x}
                cy={wwmLayout.avatar.y}
                r={wwmLayout.avatar.r * (wwmLayout.avatar.scale || 1)}
              />
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
                CARD COMPOSITION (Unified High-Fidelity 16:9 Profile Layout)
                ============================================================== */}
            <>
                {/* 1. Avatar Photo clipped to circular aperture */}
                {(() => {
                  const avScale = wwmLayout.avatar.scale || 1;
                  const avR = wwmLayout.avatar.r * avScale;
                  const avDiag = avR * 0.7071;
                  return (
                    <g id="zone-avatar">
                      <circle cx={wwmLayout.avatar.x} cy={wwmLayout.avatar.y} r={avR} fill="#0E0820" />
                      <image
                        href={avatarUrl}
                        x={wwmLayout.avatar.x - avR}
                        y={wwmLayout.avatar.y - avR}
                        width={avR * 2}
                        height={avR * 2}
                        preserveAspectRatio="xMidYMid slice"
                        clipPath="url(#avatarClipWWM)"
                        style={{ pointerEvents: "none" }}
                      />

                      {/* Interactive Hit Target for Avatar Photo */}
                      <circle
                        cx={wwmLayout.avatar.x}
                        cy={wwmLayout.avatar.y}
                        r={avR}
                        fill="transparent"
                        onMouseDown={(e) => handleMouseDown("avatar", e)}
                        style={{ cursor: isEditorMode ? "move" : "default", pointerEvents: isEditorMode ? "all" : "none" }}
                      />

                      {/* Selection Indicator & Corner Resize Handle for Avatar Circle */}
                      {isEditorMode && selectedElement === "avatar" && (
                        <>
                          <circle
                            cx={wwmLayout.avatar.x}
                            cy={wwmLayout.avatar.y}
                            r={avR + 6}
                            fill="rgba(56, 189, 248, 0.15)"
                            stroke="#38BDF8"
                            strokeWidth="3"
                            strokeDasharray="8 5"
                            style={{ pointerEvents: "none" }}
                          />
                          {renderResizeHandle(
                            wwmLayout.avatar.x + avDiag,
                            wwmLayout.avatar.y + avDiag,
                            "avatar",
                            wwmLayout.avatar.x,
                            wwmLayout.avatar.y,
                            "#38BDF8"
                          )}
                        </>
                      )}
                    </g>
                  );
                })()}

                {/* 2. Avatar Frame (Full 1200x675 Overlay with scale around lion ring center) */}
                {(() => {
                  const afScale = wwmLayout.avatarFrame?.scale || 1;
                  const afCenterX = (wwmLayout.avatarFrame?.x || 0) + 288;
                  const afCenterY = (wwmLayout.avatarFrame?.y || 0) + 295;
                  const afR = 145 * afScale;
                  const afDiag = afR * 0.7071;
                  return (
                    <g id="zone-avatar-frame">
                      <g
                        transform={`translate(${wwmLayout.avatarFrame?.x || 0}, ${wwmLayout.avatarFrame?.y || 0}) translate(288, 295) scale(${afScale}) translate(-288, -295)`}
                      >
                        {isFullCanvasAvatar ? (
                          <image
                            href={avatarFrameAsset?.asset_url || "/assets/themes/where_winds_meet/where_winds_meet_avatar_frame.png"}
                            x="0"
                            y="0"
                            width="1200"
                            height="675"
                            preserveAspectRatio="none"
                            style={{ pointerEvents: "none" }}
                          />
                        ) : avatarFrameAsset?.id === "frame_avatar_vault_seeker" ? (
                          <image
                            href={avatarFrameAsset.asset_url}
                            x={288 - 118}
                            y={295 - 114}
                            width="236"
                            height="236"
                            preserveAspectRatio="xMidYMid meet"
                            style={{ filter: "drop-shadow(0 0 16px rgba(192, 132, 252, 0.7))", pointerEvents: "none" }}
                          />
                        ) : (
                          <image
                            href={avatarFrameAsset?.asset_url || "/assets/frames/avatar_vault_seeker.svg"}
                            x={288 - 105}
                            y={295 - 105}
                            width="210"
                            height="210"
                            preserveAspectRatio="xMidYMid meet"
                            style={{ filter: "drop-shadow(0 0 16px rgba(192, 132, 252, 0.6))", pointerEvents: "none" }}
                          />
                        )}
                      </g>

                      {/* Interactive Hit Target for Avatar Frame Ring */}
                      <circle
                        cx={afCenterX}
                        cy={afCenterY}
                        r={140 * afScale}
                        fill="transparent"
                        stroke="transparent"
                        strokeWidth="30"
                        onMouseDown={(e) => handleMouseDown("avatarFrame", e)}
                        style={{ cursor: isEditorMode ? "move" : "default", pointerEvents: isEditorMode ? "all" : "none" }}
                      />

                      {/* Selection Indicator & Corner Resize Handle for Avatar Frame */}
                      {isEditorMode && selectedElement === "avatarFrame" && (
                        <>
                          <circle
                            cx={afCenterX}
                            cy={afCenterY}
                            r={afR}
                            fill="rgba(96, 165, 250, 0.12)"
                            stroke="#60A5FA"
                            strokeWidth="3"
                            strokeDasharray="8 5"
                            style={{ pointerEvents: "none" }}
                          />
                          {renderResizeHandle(
                            afCenterX + afDiag,
                            afCenterY + afDiag,
                            "avatarFrame",
                            afCenterX,
                            afCenterY,
                            "#60A5FA"
                          )}
                        </>
                      )}
                    </g>
                  );
                })()}

                {/* 3. Identity Stacked Cleanly Under Avatar */}
                {(() => {
                  const idScale = wwmLayout.identity?.scale || 1;
                  return (
                    <g
                      id="zone-identity"
                      transform={`translate(${wwmLayout.identity.x}, ${wwmLayout.identity.y}) scale(${idScale})`}
                    >
                      {/* Selection Indicator for Entire Identity Block */}
                      {isEditorMode && selectedElement === "identity" && (
                        <>
                          <rect
                            x="-140"
                            y="-10"
                            width="280"
                            height="140"
                            rx="10"
                            fill="rgba(192, 132, 252, 0.18)"
                            stroke="#C084FC"
                            strokeWidth="2.5"
                            strokeDasharray="8 5"
                            style={{ pointerEvents: "none" }}
                          />
                          {renderResizeHandle(
                            140,
                            130,
                            "identity",
                            wwmLayout.identity.x,
                            wwmLayout.identity.y + 60,
                            "#C084FC"
                          )}
                        </>
                      )}

                      {/* Interactive Hit Target for Entire Identity Block */}
                      <rect
                        x="-140"
                        y="-10"
                        width="280"
                        height="140"
                        fill="transparent"
                        onMouseDown={(e) => handleMouseDown("identity", e)}
                        style={{ cursor: isEditorMode ? "move" : "default", pointerEvents: isEditorMode ? "all" : "none" }}
                      />

                      {/* Name Text */}
                      {(() => {
                        const nameScale = wwmLayout.name?.scale || 1;
                        const nameX = wwmLayout.name?.x || 0;
                        const nameY = (wwmLayout.name?.y ?? 32) - 32;
                        return (
                          <g transform={`translate(${nameX}, ${nameY}) scale(${nameScale})`}>
                            {isEditorMode && selectedElement === "name" && (
                              <>
                                <rect
                                  x="-130"
                                  y="0"
                                  width="260"
                                  height="44"
                                  rx="8"
                                  fill="rgba(192, 132, 252, 0.25)"
                                  stroke="#C084FC"
                                  strokeWidth="2"
                                  strokeDasharray="6 4"
                                  style={{ pointerEvents: "none" }}
                                />
                                {renderResizeHandle(
                                  130,
                                  44,
                                  "name",
                                  wwmLayout.identity.x + nameX * idScale,
                                  wwmLayout.identity.y + (nameY + 22) * idScale,
                                  "#C084FC"
                                )}
                              </>
                            )}
                            <text
                              x="0"
                              y="32"
                              fontFamily={profile.equipped.nameFont || "Cinzel, serif"}
                              fontWeight="900"
                              fontSize="32"
                              fill={profile.equipped.nameColor || "#FFFFFF"}
                              letterSpacing="1.5"
                              textAnchor="middle"
                              filter="url(#nameGlow)"
                              onMouseDown={(e) => handleMouseDown("name", e)}
                              style={{ cursor: isEditorMode ? "move" : "default", pointerEvents: isEditorMode ? "all" : "none" }}
                            >
                              {profile.discordDisplayName || "EnGG"}
                            </text>
                          </g>
                        );
                      })()}

                      {/* Discord Tag Text */}
                      {(() => {
                        const tagScale = wwmLayout.tag?.scale || 1;
                        const tagX = wwmLayout.tag?.x || 0;
                        const tagY = (wwmLayout.tag?.y ?? 62) - 62;
                        return (
                          <g transform={`translate(${tagX}, ${tagY}) scale(${tagScale})`}>
                            {isEditorMode && selectedElement === "tag" && (
                              <>
                                <rect
                                  x="-100"
                                  y="46"
                                  width="200"
                                  height="26"
                                  rx="6"
                                  fill="rgba(167, 139, 250, 0.25)"
                                  stroke="#A78BFA"
                                  strokeWidth="2"
                                  strokeDasharray="6 4"
                                  style={{ pointerEvents: "none" }}
                                />
                                {renderResizeHandle(
                                  100,
                                  72,
                                  "tag",
                                  wwmLayout.identity.x + tagX * idScale,
                                  wwmLayout.identity.y + (tagY + 59) * idScale,
                                  "#A78BFA"
                                )}
                              </>
                            )}
                            <text
                              x="0"
                              y="62"
                              fontFamily="monospace, sans-serif"
                              fontWeight="700"
                              fontSize="16"
                              fill="#C084FC"
                              letterSpacing="1.5"
                              textAnchor="middle"
                              onMouseDown={(e) => handleMouseDown("tag", e)}
                              style={{ cursor: isEditorMode ? "move" : "default", pointerEvents: isEditorMode ? "all" : "none" }}
                            >
                              {discordTag}
                            </text>
                          </g>
                        );
                      })()}

                      {/* Level Text */}
                      {(() => {
                        const levelScale = wwmLayout.level?.scale || 1;
                        const levelX = wwmLayout.level?.x || 0;
                        const levelY = (wwmLayout.level?.y ?? 104) - 104;
                        return (
                          <g transform={`translate(${levelX}, ${levelY}) scale(${levelScale})`}>
                            {isEditorMode && selectedElement === "level" && (
                              <>
                                <rect
                                  x="-110"
                                  y="76"
                                  width="220"
                                  height="40"
                                  rx="6"
                                  fill="rgba(233, 213, 255, 0.25)"
                                  stroke="#E9D5FF"
                                  strokeWidth="2"
                                  strokeDasharray="6 4"
                                  style={{ pointerEvents: "none" }}
                                />
                                {renderResizeHandle(
                                  110,
                                  116,
                                  "level",
                                  wwmLayout.identity.x + levelX * idScale,
                                  wwmLayout.identity.y + (levelY + 96) * idScale,
                                  "#E9D5FF"
                                )}
                              </>
                            )}
                            <text
                              x="0"
                              y="104"
                              fontFamily="Rajdhani, sans-serif"
                              fontWeight="900"
                              fontSize="32"
                              fill="#E9D5FF"
                              letterSpacing="3"
                              textAnchor="middle"
                              onMouseDown={(e) => handleMouseDown("level", e)}
                              style={{ cursor: isEditorMode ? "move" : "default", pointerEvents: isEditorMode ? "all" : "none" }}
                            >
                              LEVEL {profile.profileLevel || stats.level}
                            </text>
                          </g>
                        );
                      })()}
                    </g>
                  );
                })()}

                {/* 4. Title Frame Banner */}
                {(() => {
                  const titleScale = wwmLayout.title?.scale || 1;
                  const plaqueCenterX = wwmLayout.title.x + 760;
                  const plaqueCenterY = wwmLayout.title.y + 290;
                  return (
                    <g id="zone-title">
                      {/* Scaled Banner & Plaque */}
                      <g
                        transform={`translate(${wwmLayout.title.x}, ${wwmLayout.title.y}) translate(760, 290) scale(${titleScale}) translate(-760, -290)`}
                      >
                        {isFullCanvasTitle ? (
                          <image
                            href={titleAsset?.asset_url || "/assets/themes/where_winds_meet/where_winds_meet_title_frame.png"}
                            x="0"
                            y="0"
                            width="1200"
                            height="675"
                            preserveAspectRatio="none"
                            style={{ pointerEvents: "none" }}
                          />
                        ) : (
                          <image
                            href={titleAsset?.asset_url || "/assets/titles/title_vault_seeker_banner.svg"}
                            x="480"
                            y="235"
                            width="560"
                            height="110"
                            preserveAspectRatio="xMidYMid meet"
                            style={{ filter: "drop-shadow(0 0 16px rgba(192, 132, 252, 0.6))", pointerEvents: "none" }}
                          />
                        )}

                        {/* Interactive Hit Target localized strictly to the Plaque */}
                        <rect
                          x="480"
                          y="210"
                          width="560"
                          height="160"
                          fill="transparent"
                          onMouseDown={(e) => handleMouseDown("title", e)}
                          style={{ cursor: isEditorMode ? "move" : "default", pointerEvents: isEditorMode ? "all" : "none" }}
                        />

                        {/* Selection Indicator & Corner Resize Handle for Title Frame */}
                        {isEditorMode && selectedElement === "title" && (
                          <>
                            <rect
                              x="480"
                              y="210"
                              width="560"
                              height="160"
                              rx="10"
                              fill="rgba(244, 114, 182, 0.15)"
                              stroke="#F472B6"
                              strokeWidth="2.5"
                              strokeDasharray="8 5"
                              style={{ pointerEvents: "none" }}
                            />
                            {renderResizeHandle(
                              1040,
                              370,
                              "title",
                              plaqueCenterX,
                              plaqueCenterY,
                              "#F472B6"
                            )}
                          </>
                        )}
                      </g>

                      {/* Dynamic Title Text (Movable & Scalable independently) */}
                      {(() => {
                        const ttScale = wwmLayout.titleText?.scale || 1;
                        const ttX = wwmLayout.titleText?.x || 760;
                        const ttY = wwmLayout.titleText?.y || 290;
                        const hideText =
                          titleAsset?.id === "title_where_winds_meet" ||
                          titleAsset?.id === "title_palworld";
                        if (hideText) return null;

                        return (
                          <g
                            transform={`translate(${ttX}, ${ttY}) scale(${ttScale})`}
                            style={{ cursor: isEditorMode ? "move" : "default" }}
                          >
                            {isEditorMode && selectedElement === "titleText" && (
                              <>
                                <rect
                                  x="-180"
                                  y="-25"
                                  width="360"
                                  height="50"
                                  rx="8"
                                  fill="rgba(251, 113, 133, 0.25)"
                                  stroke="#FB7185"
                                  strokeWidth="2"
                                  strokeDasharray="6 4"
                                  style={{ pointerEvents: "none" }}
                                />
                                {renderResizeHandle(
                                  180,
                                  25,
                                  "titleText",
                                  ttX,
                                  ttY,
                                  "#FB7185"
                                )}
                              </>
                            )}
                            <text
                              x="0"
                              y="8"
                              fontFamily="Cinzel, serif"
                              fontWeight="900"
                              fontSize="26"
                              fill={profile.equipped.titleColor || "#FDE68A"}
                              letterSpacing="2.5"
                              textAnchor="middle"
                              style={{
                                filter: "drop-shadow(0 0 10px rgba(245, 158, 11, 0.7))",
                                cursor: isEditorMode ? "move" : "default",
                                pointerEvents: isEditorMode ? "all" : "none",
                              }}
                              onMouseDown={(e) => handleMouseDown("titleText", e)}
                            >
                              {titleText.toUpperCase()}
                            </text>
                          </g>
                        );
                      })()}
                    </g>
                  );
                })()}

                {/* 5. Coins Block (Top Right) */}
                {(() => {
                  const coinsScale = wwmLayout.coins?.scale || 1;
                  return (
                    <g
                      id="zone-coins"
                      transform={`translate(${wwmLayout.coins.x}, ${wwmLayout.coins.y}) scale(${coinsScale})`}
                    >
                      {/* Selection Indicator & Corner Resize Handle */}
                      {isEditorMode && selectedElement === "coins" && (
                        <>
                          <rect
                            x="-130"
                            y="-10"
                            width="230"
                            height="95"
                            rx="10"
                            fill="rgba(245, 158, 11, 0.15)"
                            stroke="#F59E0B"
                            strokeWidth="2.5"
                            strokeDasharray="8 5"
                            style={{ pointerEvents: "none" }}
                          />
                          {renderResizeHandle(
                            100,
                            85,
                            "coins",
                            wwmLayout.coins.x - 15,
                            wwmLayout.coins.y + 37.5,
                            "#F59E0B"
                          )}
                        </>
                      )}

                      {/* Interactive Hit Target */}
                      <rect
                        x="-130"
                        y="-10"
                        width="230"
                        height="95"
                        fill="transparent"
                        onMouseDown={(e) => handleMouseDown("coins", e)}
                        style={{ cursor: isEditorMode ? "move" : "default", pointerEvents: isEditorMode ? "all" : "none" }}
                      />

                      <text
                        x="0"
                        y="24"
                        fontFamily="Rajdhani, sans-serif"
                        fontWeight="900"
                        fontSize="32"
                        fill={profile.equipped.coinColor || "#DDD6FE"}
                        letterSpacing="1.5"
                        textAnchor="end"
                        style={{ filter: "drop-shadow(0 0 10px rgba(192, 132, 252, 0.8))", pointerEvents: "none" }}
                      >
                        {profile.vaultCoins.toLocaleString()}
                      </text>
                      <text
                        x="0"
                        y="44"
                        fontFamily="Rajdhani, sans-serif"
                        fontWeight="800"
                        fontSize="14"
                        fill="#A78BFA"
                        letterSpacing="2"
                        textAnchor="end"
                        style={{ pointerEvents: "none" }}
                      >
                        COINS
                      </text>
                      <image
                        href="/assets/branding/en_vault_medallion.png"
                        x="10"
                        y="0"
                        width="76"
                        height="73"
                        preserveAspectRatio="xMidYMid meet"
                        style={{ filter: "drop-shadow(0 0 12px rgba(192, 132, 252, 0.8))", pointerEvents: "none" }}
                      />
                    </g>
                  );
                })()}

                {/* 6. 5 Achievements Row (Bottom Right) */}
                {(() => {
                  const achScale = wwmLayout.achievements?.scale || 1;
                  const achCenterX = wwmLayout.achievements.x + 758;
                  const achCenterY = wwmLayout.achievements.y + 515;
                  return (
                    <g
                      id="zone-achievements"
                      transform={`translate(${wwmLayout.achievements.x}, ${wwmLayout.achievements.y}) translate(758, 515) scale(${achScale}) translate(-758, -515)`}
                    >
                      {/* Selection Indicator & Corner Resize Handle */}
                      {isEditorMode && selectedElement === "achievements" && (
                        <>
                          <rect
                            x="460"
                            y="445"
                            width="595"
                            height="145"
                            rx="10"
                            fill="rgba(168, 85, 247, 0.15)"
                            stroke="#A855F7"
                            strokeWidth="2.5"
                            strokeDasharray="8 5"
                            style={{ pointerEvents: "none" }}
                          />
                          {renderResizeHandle(
                            1055,
                            590,
                            "achievements",
                            achCenterX,
                            achCenterY,
                            "#A855F7"
                          )}
                        </>
                      )}

                      {/* Interactive Hit Target */}
                      <rect
                        x="460"
                        y="445"
                        width="595"
                        height="145"
                        fill="transparent"
                        onMouseDown={(e) => handleMouseDown("achievements", e)}
                        style={{ cursor: isEditorMode ? "move" : "default", pointerEvents: isEditorMode ? "all" : "none" }}
                      />

                      {[524, 641, 758, 875, 993].map((cx, idx) => {
                        const badgeId = profile.equipped.achievementSlots[idx];
                        const badgeAsset = getAssetById(badgeId);
                        return (
                          <g key={`badge-slot-${badgeId || idx}-${idx}`} style={{ pointerEvents: "none" }}>
                            <image
                              href={
                                badgeAsset?.asset_url ||
                                "/assets/themes/where_winds_meet/where_winds_meet_achievement_badge.png"
                              }
                              x={cx - 51}
                              y={457}
                              width={102}
                              height={98}
                              preserveAspectRatio="xMidYMid meet"
                              style={{ filter: "drop-shadow(0 0 12px rgba(168, 85, 247, 0.6))" }}
                            />
                            <text
                              x={cx}
                              y={576}
                              fontFamily="Rajdhani, sans-serif"
                              fontWeight="800"
                              fontSize="12"
                              fill="#DDD6FE"
                              letterSpacing="1.2"
                              textAnchor="middle"
                            >
                              {badgeAsset?.name?.toUpperCase() || "ACHIEVEMENT"}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })()}

                {/* 7. OUTER CARD FRAME (1200x675 overlay for all card frames) */}
                <image
                  id="zone-card_frame"
                  href={
                    cardFrameAsset?.asset_url ||
                    (profile.equipped.themeLayers.includes("theme_palworld_bg") || profile.equipped.avatarFrameId === "frame_avatar_palworld"
                      ? "/assets/themes/palworld/palworld_card_frame.png"
                      : isWindsMeet
                      ? "/assets/themes/where_winds_meet/where_winds_meet_profile_frame.png"
                      : "/assets/frames/card_vault_legendary.svg")
                  }
                  x="0"
                  y="0"
                  width="1200"
                  height="675"
                  preserveAspectRatio="none"
                  style={{ pointerEvents: "none" }}
                />
              </>
          </g>
        </svg>
        </div>
      </div>
    );
  }
);

ProfileCardCanvas.displayName = "ProfileCardCanvas";
