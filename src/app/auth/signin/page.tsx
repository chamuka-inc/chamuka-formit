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
            <h1 className='text-2xl font-bold text-foreground sm:text-3xl'>
              Welcome to Chamuka FormIt
            </h1>
            <p className='mt-2 text-sm text-foreground-secondary sm:mt-3 sm:text-base'>
              Enter your email to sign in or create an account
            </p>
          </div>

          <div className='rounded-lg border border-border bg-background p-5 shadow-sm sm:p-8'>
            <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-foreground'
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
                    className='block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground shadow-sm focus:border-input-focus focus:ring-2 focus:ring-ring sm:px-4 sm:py-3'
                    placeholder='you@example.com'
                  />
                </div>
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className='group relative flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-3 sm:text-base'
              >
                <Mail className='h-4 w-4 sm:h-5 sm:w-5' />
                {isLoading ? "Sending link..." : "Sign in with Email"}
              </button>
            </form>

            <div className='mt-4 sm:mt-6'>
              <p className='text-center text-xs text-foreground-secondary sm:text-sm'>
                By signing in, you agree to our{" "}
                <Link
                  href='#'
                  className='font-medium text-primary transition-colors hover:text-primary-hover'
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
