import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { email, password, name, fullName } = await request.json();
    const resolvedName = fullName || name;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: resolvedName,
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "User generation failed." },
        { status: 500 }
      );
    }

    // Profiles table insertion is done automatically by the handle_new_user database trigger.
    // Since Confirm Signup is disabled, the user gets logged in immediately and returns a session.

    return NextResponse.json({ 
      success: true, 
      user: authData.user,
      redirectUrl: '/onboarding' 
    });

  } catch (error: unknown) {
    console.error("Signup error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}


