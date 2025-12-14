"use client";

// Authentication check removed - allowing access without login
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
import { Header } from "@/components/layout/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication check removed - allowing access without login
  // const { data: session, status } = useSession();
  // const router = useRouter();

  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     router.push("/auth/signin");
  //   } else if (session && session.user?.role !== "ADMIN") {
  //     router.push("/dashboard");
  //   }
  // }, [status, session, router]);

  // if (status === "loading") {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
  //         <p className="mt-4 text-muted-foreground">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!session || session.user?.role !== "ADMIN") {
  //   return null;
  // }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container px-4 py-4 border-b">
        <nav className="flex space-x-6">
          <a href="/admin" className="text-sm font-medium hover:text-primary">
            Dashboard
          </a>
          <a href="/admin/deal-digest" className="text-sm font-medium hover:text-primary">
            DealDigest
          </a>
          <a href="/admin/micro-research" className="text-sm font-medium hover:text-primary">
            Micro Research
          </a>
          <a href="/admin/users" className="text-sm font-medium hover:text-primary">
            Users
          </a>
          <a href="/admin/blog" className="text-sm font-medium hover:text-primary">
            Blog
          </a>
        </nav>
      </div>
      {children}
    </div>
  );
}

