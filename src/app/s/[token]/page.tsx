"use client";

import React, { useState } from "react";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import SurveyRenderer from "@/components/survey/SurveyRenderer";
import { SurveyThankYouPage } from "@/components/survey/SurveyThankYouPage";
import { Loader2, AlertCircle } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

export default function PublicSurveyPage() {
  const params = useParams();
  const token = params?.token as string;
  const [surveyLoaded, setSurveyLoaded] = useState(false);
  const [surveyError, setSurveyError] = useState<string | null>(null);
  const [surveyCompleted, setSurveyCompleted] = useState(false);

  // Show 404 if no token is provided
  if (!token) {
    notFound();
  }

  // When survey is completed
  const handleSurveyComplete = () => {
    setSurveyCompleted(true);
  };

  // When survey has an error
  const handleSurveyError = (errorMessage: string) => {
    setSurveyError(errorMessage);
  };

  return (
    <PublicLayout>
      <div className='flex flex-1 items-start justify-center px-4 py-12'>
        <div className='w-full'>
          {/* Loading state */}
          {!surveyLoaded && !surveyError && (
            <div className='flex h-64 items-center justify-center'>
              <Loader2 className='h-8 w-8 animate-spin text-blue-600 dark:text-blue-400' />
              <span className='ml-2 text-gray-600 dark:text-gray-300'>
                Loading survey...
              </span>
            </div>
          )}

          {/* Error state */}
          {surveyError && (
            <div className='rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800'>
              <div className='mb-4 flex justify-center'>
                <AlertCircle className='h-12 w-12 text-red-600 dark:text-red-500' />
              </div>
              <h2 className='mb-2 text-xl font-semibold text-gray-900 dark:text-white'>
                Unable to Load Survey
              </h2>
              <p className='mb-6 text-gray-600 dark:text-gray-300'>
                {surveyError}
              </p>
              <Link
                href='/'
                className='inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600'
              >
                Go to Homepage
              </Link>
            </div>
          )}

          {/* Completion state */}
          {surveyCompleted && <SurveyThankYouPage />}

          {/* Survey renderer */}
          {!surveyError && !surveyCompleted && (
            <SurveyRenderer
              surveyToken={token}
              onLoad={() => setSurveyLoaded(true)}
              onError={handleSurveyError}
              onComplete={handleSurveyComplete}
              showImprovedNavigation={true}
            />
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
