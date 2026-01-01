"use client";

import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

export default function VerifyRequest() {
  return (
    <PublicLayout>
      <div className='flex min-h-[calc(100vh-180px)] flex-1 items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='-mt-8 w-full max-w-md space-y-4 sm:-mt-16 sm:space-y-6'>
          <div className='text-center'>
            <div className='mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent sm:mb-4 sm:h-12 sm:w-12'>
              <Mail className='h-5 w-5 text-primary sm:h-6 sm:w-6' />
            </div>
            <h1 className='text-xl font-bold text-foreground sm:text-2xl'>
              Check your email
            </h1>
            <p className='mt-2 text-sm text-foreground-secondary sm:mt-3 sm:text-base'>
              A sign in link has been sent to your email address. Please check
              your inbox and click the link to continue.
            </p>
          </div>

          <div className='rounded-lg border border-border bg-background p-5 shadow-sm sm:p-8'>
            <div className='space-y-3 text-xs text-foreground-secondary sm:space-y-4 sm:text-sm'>
              <p>
                <strong>Didn't receive the email?</strong>
              </p>
              <ul className='list-disc space-y-1 pl-4 sm:space-y-2'>
                <li>Check your spam folder</li>
                <li>Make sure you entered the correct email address</li>
                <li>
                  If you still haven't received it after a few minutes,{" "}
                  <Link
                    href='/auth/signin'
                    className='text-primary hover:text-primary-hover transition-colors'
                  >
                    try signing in again
                  </Link>
                </li>
              </ul>
              <div className='pt-3 sm:pt-4'>
                <Link
                  href='/auth/signin'
                  className='inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs text-primary transition-colors hover:bg-accent/80 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm'
                >
                  <Mail className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                  Send another verification email
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
