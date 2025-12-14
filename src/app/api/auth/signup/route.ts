import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * This API route is DEPRECATED.
 * Registration is now handled directly by Supabase Auth in the client-side registration page.
 * This route is kept for backward compatibility but redirects to use Supabase.
 */
export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Use Supabase for authentication instead of Prisma
    const supabase = await createClient();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
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
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Profile is created automatically by Supabase trigger
    // But we can ensure it exists
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        email: email,
        full_name: name,
        subscription_tier: "Free",
        subscription_expiry: null,
      })
      .select()
      .single();

    // If profile already exists (from trigger), that's fine
    if (profileError && !profileError.message.includes("duplicate")) {
      console.error("Profile creation error:", profileError);
      // Continue anyway - profile might be created by trigger
    }

    return NextResponse.json(
      { message: "User created successfully", userId: authData.user.id },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Signup error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

