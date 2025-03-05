"use client";

import dynamic from 'next/dynamic';

// Dynamically import the AppLayout with no SSR to avoid hydration issues
const AppLayout = dynamic(() => import('@/components/layout/AppLayout'), {
  ssr: false,
});

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
} 