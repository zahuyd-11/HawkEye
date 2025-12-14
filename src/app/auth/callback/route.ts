import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
    
    // Check if user has completed onboarding
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("risk_appetite, capital_range, investment_goal")
        .eq("id", user.id)
        .single();
      
      // If onboarding not completed, redirect to onboarding
      if (!profile?.risk_appetite || !profile?.capital_range || !profile?.investment_goal) {
        return NextResponse.redirect(new URL("/onboarding", requestUrl.origin));
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
}

