"use client";

// Authentication check removed - allowing access without login
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
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
  //   }
  // }, [status, router]);

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

  // if (!session) {
  //   return null;
  // }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {children}
    </div>
  );
}

