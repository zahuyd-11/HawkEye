import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect if already logged in
  if (user) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
