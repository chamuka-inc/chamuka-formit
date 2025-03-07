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
    <PublicLayout showBackButton backButtonText='Back to Home'>
      <div className='flex flex-1 items-center justify-center px-4 py-12'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Welcome to Survey4
            </h1>
            <p className='mt-3 text-gray-600 dark:text-gray-300'>
              Enter your email to sign in or create an account
            </p>
          </div>

          <div className='rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Email address
                </label>
                <div className='mt-2'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400'
                    placeholder='you@example.com'
                  />
                </div>
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className='group relative flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600'
              >
                <Mail className='h-5 w-5' />
                {isLoading ? "Sending link..." : "Sign in with Email"}
              </button>
            </form>

            <div className='mt-6'>
              <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
                By signing in, you agree to our{" "}
                <Link
                  href='https://example.com/legal'
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
