"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LoginButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export function LoginButton({ children, className }: LoginButtonProps) {
  return (
    <Link
      href='/auth/signin'
      className={cn("flex items-center gap-2", className)}
    >
      {children}
    </Link>
  );
}
