"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

interface SurveyThankYouPageProps {
  title?: string;
  message?: string;
  showHomeLink?: boolean;
}

export function SurveyThankYouPage({
  title = "Thank You for Your Response!",
  message = "Your submission has been recorded successfully.",
  showHomeLink = true,
}: SurveyThankYouPageProps) {
  return (
    <div className='rounded-lg bg-white p-8 text-center shadow-md dark:bg-gray-800'>
      <div className='mb-4 flex justify-center'>
        <CheckCircle className='h-16 w-16 text-green-500' />
      </div>
      <h2 className='mb-3 text-2xl font-bold text-gray-900 dark:text-white'>
        {title}
      </h2>
      <p className='mx-auto mb-6 max-w-md text-gray-600 dark:text-gray-300'>
        {message}
      </p>

      {showHomeLink && (
        <Link
          href='/'
          className='inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        >
          Return to Homepage
        </Link>
      )}
    </div>
  );
}
