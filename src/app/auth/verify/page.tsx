"use client";

import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

export default function VerifyRequest() {
  return (
    <PublicLayout showBackButton backButtonText='Back to Home'>
      <div className='flex flex-1 items-center justify-center px-4 py-12'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center'>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900'>
              <Mail className='h-6 w-6 text-blue-600 dark:text-blue-400' />
            </div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
              Check your email
            </h1>
            <p className='mt-3 text-gray-600 dark:text-gray-300'>
              A sign in link has been sent to your email address. Please check
              your inbox and click the link to continue.
            </p>
          </div>

          <div className='rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
            <div className='space-y-4 text-sm text-gray-600 dark:text-gray-400'>
              <p>
                <strong>Didn't receive the email?</strong>
              </p>
              <ul className='list-disc space-y-2 pl-4'>
                <li>Check your spam folder</li>
                <li>Make sure you entered the correct email address</li>
                <li>
                  If you still haven't received it after a few minutes,{" "}
                  <Link
                    href='/auth/signin'
                    className='text-blue-600 hover:text-blue-500 dark:text-blue-400'
                  >
                    try signing in again
                  </Link>
                </li>
              </ul>
              <div className='pt-4'>
                <Link
                  href='/auth/signin'
                  className='inline-flex items-center justify-center gap-2 rounded-lg bg-blue-100 px-4 py-2 text-blue-600 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800'
                >
                  <Mail className='h-4 w-4' />
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
