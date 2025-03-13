"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface SignOutButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export function SignOutButton({ children, className }: SignOutButtonProps) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <button
      onClick={handleSignOut}
      className={cn("flex items-center gap-2", className)}
    >
      {children}
    </button>
  );
}
