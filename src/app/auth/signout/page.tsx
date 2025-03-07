"use client";

import React from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";

export default function SignOut() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-neutral-50 px-4 dark:from-neutral-900 dark:to-neutral-950'>
      <Link
        href='/dashboard'
        className='group absolute left-4 top-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
      >
        <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
        Back
      </Link>

      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <div className='bg-brandBlue-100 dark:bg-brandBlue-900 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
            <LogOut className='text-brandBlue-600 dark:text-brandBlue-400 h-6 w-6' />
          </div>
          <h1 className='text-2xl font-bold text-neutral-900 dark:text-white'>
            Sign out
          </h1>
          <p className='mt-3 text-neutral-600 dark:text-neutral-300'>
            Are you sure you want to sign out?
          </p>
        </div>

        <div className='rounded-2xl bg-white p-8 shadow-xl dark:bg-neutral-800/50'>
          <div className='flex flex-col gap-4'>
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className='from-brandBlue-500 to-brandBlue-600 shadow-brandBlue-500/20 hover:from-brandBlue-600 hover:to-brandBlue-700 hover:shadow-brandBlue-500/30 focus:ring-brandBlue-500 group relative flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-4 py-3 text-neutral-900 shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white'
            >
              <LogOut className='h-5 w-5' />
              {isLoading ? "Signing out..." : "Sign out"}
            </button>

            <Link
              href='/dashboard'
              className='focus:ring-brandBlue-500 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
