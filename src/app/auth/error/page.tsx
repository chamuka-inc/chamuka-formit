"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <PublicLayout>
      <div className='flex min-h-[calc(100vh-180px)] flex-1 items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='-mt-8 w-full max-w-md space-y-4 sm:-mt-16 sm:space-y-6'>
          <div className='text-center'>
            <h1 className='text-xl font-bold text-red-600 dark:text-red-500 sm:text-3xl'>
              Authentication Error
            </h1>
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-300 sm:mt-3 sm:text-base'>
              {error === "AccessDenied"
                ? "Access denied. You do not have permission to access this resource."
                : error === "Verification"
                  ? "The verification link has expired or has already been used. Please try signing in again."
                  : error === "Configuration"
                    ? "There is a problem with the server configuration. Please contact support."
                    : error === "EmailSignin"
                      ? "The email sign-in attempt failed. Please try again."
                      : "An error occurred during authentication. Please try again."}
            </p>
          </div>

          <div className='mt-4 flex justify-center sm:mt-6'>
            <Link
              href='/auth/signin'
              className='rounded-lg bg-blue-600 px-4 py-2 text-sm text-white shadow-sm transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 sm:px-6 sm:py-3 sm:text-base'
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
