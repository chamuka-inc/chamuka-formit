"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function VerifyRequest() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-neutral-50 px-4 dark:from-neutral-900 dark:to-neutral-950'>
      <Link
        href='/'
        className='group absolute left-4 top-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
      >
        <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
        Back
      </Link>

      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <div className='bg-brandBlue-100 dark:bg-brandBlue-900 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
            <Mail className='text-brandBlue-600 dark:text-brandBlue-400 h-6 w-6' />
          </div>
          <h1 className='text-2xl font-bold text-neutral-900 dark:text-white'>
            Check your email
          </h1>
          <p className='mt-3 text-neutral-600 dark:text-neutral-300'>
            A sign in link has been sent to your email address. Please check
            your inbox and click the link to continue.
          </p>
        </div>

        <div className='rounded-2xl bg-white p-8 shadow-xl dark:bg-neutral-800/50'>
          <div className='space-y-4 text-sm text-neutral-600 dark:text-neutral-400'>
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
                  className='text-brandBlue-600 dark:text-brandBlue-400 hover:text-brandBlue-500'
                >
                  try signing in again
                </Link>
              </li>
            </ul>
            <div className='pt-4'>
              <Link
                href='/auth/signin'
                className='bg-brandBlue-100 dark:bg-brandBlue-900 text-brandBlue-600 dark:text-brandBlue-400 hover:bg-brandBlue-200 dark:hover:bg-brandBlue-800 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors'
              >
                <Mail className='h-4 w-4' />
                Send another verification email
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
