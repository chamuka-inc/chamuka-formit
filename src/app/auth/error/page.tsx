"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <PublicLayout showBackButton backButtonText='Back to Home'>
      <div className='flex flex-1 items-center justify-center px-4 py-12'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-red-600 dark:text-red-500'>
              Authentication Error
            </h1>
            <p className='mt-3 text-gray-600 dark:text-gray-300'>
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

          <div className='flex justify-center'>
            <Link
              href='/auth/signin'
              className='rounded-lg bg-blue-600 px-6 py-3 text-white shadow-sm transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
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
