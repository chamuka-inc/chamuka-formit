"use client";

import React from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

export default function SignOut() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <PublicLayout>
      <div className='flex min-h-[calc(100vh-180px)] flex-1 items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='-mt-8 w-full max-w-md space-y-4 sm:-mt-16 sm:space-y-6'>
          <div className='text-center'>
            <div className='mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent sm:mb-4 sm:h-12 sm:w-12'>
              <LogOut className='h-5 w-5 text-primary sm:h-6 sm:w-6' />
            </div>
            <h1 className='text-xl font-bold text-foreground sm:text-2xl'>
              Sign out
            </h1>
            <p className='mt-2 text-sm text-foreground-secondary sm:mt-3 sm:text-base'>
              Are you sure you want to sign out?
            </p>
          </div>

          <div className='rounded-lg border border-border bg-background p-5 shadow-sm sm:p-8'>
            <div className='flex flex-col gap-3 sm:gap-4'>
              <button
                onClick={handleSignOut}
                disabled={isLoading}
                className='group relative flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-sm text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-4 sm:py-3 sm:text-base'
              >
                <LogOut className='h-4 w-4 sm:h-5 sm:w-5' />
                {isLoading ? "Signing out..." : "Sign out"}
              </button>

              <Link
                href='/dashboard'
                className='flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:gap-2 sm:px-4 sm:py-3 sm:text-base'
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
