"use client";

import React, { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";

function SignInContent() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn("email", { email, callbackUrl });
  };

  return (
    <PublicLayout>
      <div className='flex min-h-[calc(100vh-180px)] flex-1 items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='-mt-8 w-full max-w-md space-y-4 sm:-mt-16 sm:space-y-6'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl'>
              Welcome to Chamuka FormIt
            </h1>
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-300 sm:mt-3 sm:text-base'>
              Enter your email to sign in or create an account
            </p>
          </div>

          <div className='rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8'>
            <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Email address
                </label>
                <div className='mt-1 sm:mt-2'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400 sm:px-4 sm:py-3'
                    placeholder='you@example.com'
                  />
                </div>
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className='group relative flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 sm:px-4 sm:py-3 sm:text-base'
              >
                <Mail className='h-4 w-4 sm:h-5 sm:w-5' />
                {isLoading ? "Sending link..." : "Sign in with Email"}
              </button>
            </form>

            <div className='mt-4 sm:mt-6'>
              <p className='text-center text-xs text-gray-600 dark:text-gray-400 sm:text-sm'>
                By signing in, you agree to our{" "}
                <Link
                  href='#'
                  className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400'
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
