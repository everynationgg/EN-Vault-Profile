import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { DEMO_PROFILES } from "@/lib/assetsCatalog";
import { UserProfileState } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "891234567890123456";

  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("profile_user_states")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, profile: data });
      }
    } catch (err) {
      console.warn("Supabase fetch error in API route:", err);
    }
  }

  // Graceful fallback to demo profile
  return NextResponse.json({
    success: true,
    profile: DEMO_PROFILES.veteran,
    mode: "demo",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, equipped, customAvatarUrl } = body;

    if (!userId || !equipped) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (supabase && isSupabaseConfigured) {
      const { error } = await supabase
        .from("profile_user_states")
        .update({
          equipped_name_font: equipped.nameFont,
          equipped_name_color: equipped.nameColor,
          equipped_title_id: equipped.titleId,
          equipped_title_color: equipped.titleColor,
          equipped_emblem_id: equipped.emblemId,
          equipped_emblem_color: equipped.emblemColor,
          equipped_avatar_frame_id: equipped.avatarFrameId,
          equipped_card_frame_id: equipped.cardFrameId,
          equipped_theme_layers: equipped.themeLayers,
          equipped_coin_color: equipped.coinColor,
          equipped_achievement_slots: equipped.achievementSlots,
          custom_avatar_url: customAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Profile saved to Supabase" });
    }

    // Demo Mode success response
    return NextResponse.json({
      success: true,
      message: "Profile configuration updated (Demo Mode)",
      mode: "demo",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
