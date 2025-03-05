"use client";

import React from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface SurveyThankYouPageProps {
  title?: string;
  message?: string;
  showHomeLink?: boolean;
}

export function SurveyThankYouPage({
  title = 'Thank You for Your Response!',
  message = 'Your submission has been recorded successfully.',
  showHomeLink = true
}: SurveyThankYouPageProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
      <div className="flex justify-center mb-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      {showHomeLink && (
        <Link 
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Return to Homepage
        </Link>
      )}
    </div>
  );
} 