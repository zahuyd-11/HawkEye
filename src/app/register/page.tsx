"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Eye, EyeOff, Mail, Lock, User, TrendingUp, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const validatePassword = (pwd: string) => {
    return pwd.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      toast({
        title: "Mật khẩu không hợp lệ",
        description: "Mật khẩu phải có ít nhất 8 ký tự",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Mật khẩu không khớp",
        description: "Vui lòng nhập lại mật khẩu xác nhận",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Sign up with Supabase
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
        toast({
          title: "Đăng ký thất bại",
          description: authError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Check if email confirmation is required
      if (authData.user && !authData.session) {
        toast({
          title: "Đăng ký thành công!",
          description: "Vui lòng kiểm tra email để xác thực tài khoản trước khi đăng nhập.",
        });
        router.push("/login");
        setIsLoading(false);
        return;
      }

      // Create profile in profiles table
      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            email: email,
            name: name,
            subscription_tier: "Free",
            subscription_expiry: null,
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Log error but don't fail registration - profile can be created later
          // The trigger function should handle this, but if it fails, we continue
        }
      }

      toast({
        title: "Đăng ký thành công!",
        description: "Chào mừng đến với HawkEye",
      });

      // Redirect to onboarding first
      router.push("/onboarding");
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể đăng nhập bằng Google. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-primary/5 to-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Bắt đầu miễn phí</h1>
            <p className="text-muted-foreground">Tạo tài khoản để truy cập tất cả tính năng</p>
          </div>

          <Card className="glass border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Đăng ký</CardTitle>
              <CardDescription>
                Điền thông tin để tạo tài khoản HawkEye của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className={`h-3 w-3 ${validatePassword(password) ? "text-emerald-500" : ""}`} />
                      <span>Ít nhất 8 ký tự</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500">Mật khẩu không khớp</p>
                  )}
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Đang tạo tài khoản..." : "Đăng ký"}
                </Button>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Hoặc tiếp tục với</span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
              </div>
              
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Đã có tài khoản?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Đăng nhập
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

