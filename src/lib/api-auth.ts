import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireApiSession() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return { session, error: null as null };
  }
  return {
    session: null,
    error: NextResponse.json(
      {
        error: "Unauthorized access blocked",
        hint: "Vui lòng đăng nhập tại /auth/signin (NextAuth) trước khi dùng HawkEye AI Core.",
      },
      { status: 401 }
    ),
  };
}
