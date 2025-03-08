"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import the AppLayout with no SSR to avoid hydration issues
const AppLayout = dynamic(() => import("@/components/layout/AppLayout"), {
  ssr: false,
});

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500'></div>
      </div>
    );
  }

  // Only render the layout if authenticated
  if (status === "authenticated") {
    return <AppLayout>{children}</AppLayout>;
  }

  // Return null while redirecting
  return null;
}
