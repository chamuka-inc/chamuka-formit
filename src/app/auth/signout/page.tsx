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
            <div className='mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 sm:mb-4 sm:h-12 sm:w-12'>
              <LogOut className='h-5 w-5 text-blue-600 dark:text-blue-400 sm:h-6 sm:w-6' />
            </div>
            <h1 className='text-xl font-bold text-gray-900 dark:text-white sm:text-2xl'>
              Sign out
            </h1>
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-300 sm:mt-3 sm:text-base'>
              Are you sure you want to sign out?
            </p>
          </div>

          <div className='rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8'>
            <div className='flex flex-col gap-3 sm:gap-4'>
              <button
                onClick={handleSignOut}
                disabled={isLoading}
                className='group relative flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2.5 text-sm text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 sm:gap-2 sm:px-4 sm:py-3 sm:text-base'
              >
                <LogOut className='h-4 w-4 sm:h-5 sm:w-5' />
                {isLoading ? "Signing out..." : "Sign out"}
              </button>

              <Link
                href='/dashboard'
                className='flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:gap-2 sm:px-4 sm:py-3 sm:text-base'
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
