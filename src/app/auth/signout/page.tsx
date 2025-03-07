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
    <PublicLayout
      showBackButton
      backButtonText='Back to Dashboard'
      backButtonHref='/dashboard'
    >
      <div className='flex flex-1 items-center justify-center px-4 py-12'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center'>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900'>
              <LogOut className='h-6 w-6 text-blue-600 dark:text-blue-400' />
            </div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
              Sign out
            </h1>
            <p className='mt-3 text-gray-600 dark:text-gray-300'>
              Are you sure you want to sign out?
            </p>
          </div>

          <div className='rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
            <div className='flex flex-col gap-4'>
              <button
                onClick={handleSignOut}
                disabled={isLoading}
                className='group relative flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600'
              >
                <LogOut className='h-5 w-5' />
                {isLoading ? "Signing out..." : "Sign out"}
              </button>

              <Link
                href='/dashboard'
                className='flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
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
