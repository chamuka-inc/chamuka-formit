"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { LoginButton } from "@/components/auth/LoginButton";
import { LogIn, LogOut } from "lucide-react";

interface AuthProviderProps {
  className?: string;
}

export function AuthProvider({ className }: AuthProviderProps) {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  if (isLoggedIn) {
    return (
      <SignOutButton className={className}>
        <LogOut className='h-4 w-4' />
        Log Out
      </SignOutButton>
    );
  }

  return (
    <LoginButton className={className}>
      <LogIn className='h-4 w-4' />
      Log In
    </LoginButton>
  );
}
