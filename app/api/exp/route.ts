import { NextRequest, NextResponse } from "next/server";
import { calculateProgressionStats, EXP_SOURCES } from "@/lib/progression";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, sourceType, amount, referenceId } = body;

    if (!userId || !sourceType) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      );
    }

    let expToAdd = 0;
    if (sourceType === "daily_quest") {
      expToAdd = amount || EXP_SOURCES.DAILY_QUEST.expPerAction;
    } else if (sourceType === "trivia") {
      expToAdd = amount || EXP_SOURCES.DAILY_TRIVIA.expPerAction;
    } else if (sourceType === "world_boss") {
      expToAdd = (amount || 1) * EXP_SOURCES.WORLD_BOSS.expPerAP;
    } else {
      expToAdd = Number(amount) || 50;
    }

    if (supabase && isSupabaseConfigured) {
      // Record transaction
      await supabase.from("profile_exp_transactions").insert({
        user_id: userId,
        amount: expToAdd,
        source_type: sourceType,
        reference_id: referenceId || null,
      });

      // Update user state
      const { data: userState } = await supabase
        .from("profile_user_states")
        .select("profile_exp")
        .eq("user_id", userId)
        .single();

      const newTotalExp = (Number(userState?.profile_exp) || 0) + expToAdd;
      const stats = calculateProgressionStats(newTotalExp);

      await supabase
        .from("profile_user_states")
        .update({
          profile_exp: newTotalExp,
          profile_level: stats.level,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      return NextResponse.json({
        success: true,
        expAdded: expToAdd,
        newTotalExp,
        stats,
      });
    }

    // Demo Mode Response
    return NextResponse.json({
      success: true,
      expAdded: expToAdd,
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
