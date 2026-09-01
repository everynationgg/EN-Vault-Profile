"use client";

import React from "react";
import { UserProfileState } from "@/lib/types";
import {
  MessageSquare,
  Shield,
  Calendar,
  Zap,
  Trophy,
  ExternalLink,
} from "lucide-react";

interface ProfileOverviewProps {
  profile: UserProfileState;
}

export const ProfileOverview: React.FC<ProfileOverviewProps> = ({ profile }) => {
  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: "16px",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        background: "rgba(11, 15, 25, 0.75)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div
        style={{
          fontSize: "0.85rem",
          fontWeight: 800,
          fontFamily: "var(--font-display)",
          color: "#94A3B8",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
        }}
      >
        PROFILE OVERVIEW
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Discord Tag */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.9rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#94A3B8" }}>
            <MessageSquare size={16} color="#818CF8" />
            <span>Discord</span>
          </div>
          <span style={{ fontWeight: 600, color: "#F8FAFC" }}>
            {profile.discordUsername || "EnGG#1234"}
          </span>
        </div>

        {/* Server */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.9rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#94A3B8" }}>
            <Shield size={16} color="#38BDF8" />
            <span>Server</span>
          </div>
          <span style={{ fontWeight: 600, color: "#F8FAFC" }}>
            ENOS Headquarters
          </span>
        </div>

        {/* Member Since */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.9rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#94A3B8" }}>
            <Calendar size={16} color="#A855F7" />
            <span>Member Since</span>
          </div>
          <span style={{ fontWeight: 600, color: "#F8FAFC" }}>
            Jan 15, 2024
          </span>
        </div>

        {/* Total EXP */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.9rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#94A3B8" }}>
            <Zap size={16} color="#F59E0B" />
            <span>Total EXP</span>
          </div>
          <span style={{ fontWeight: 700, color: "#F8FAFC" }}>
            {profile.profileExp.toLocaleString()} EXP
          </span>
        </div>

        {/* Global Rank */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.9rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#94A3B8" }}>
            <Trophy size={16} color="#EAB308" />
            <span>Global Rank</span>
          </div>
          <span style={{ fontWeight: 700, color: "#F8FAFC" }}>
            #1,248
          </span>
        </div>
      </div>

      {/* View in Discord CTA Button */}
      <a
        href="https://discord.gg/everynation"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary"
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "6px",
          justifyContent: "center",
          background: "rgba(88, 101, 242, 0.15)",
          border: "1px solid rgba(88, 101, 242, 0.35)",
          color: "#E0E7FF",
          fontWeight: 700,
          fontFamily: "var(--font-display)",
          letterSpacing: "1px",
          fontSize: "0.9rem",
          textDecoration: "none",
        }}
      >
        <MessageSquare size={16} color="#5865F2" />
        VIEW IN DISCORD
      </a>
    </div>
  );
};
