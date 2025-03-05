"use client";

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import SurveyRenderer from '@/components/survey/SurveyRenderer';
import { SurveyThankYouPage } from '@/components/survey/SurveyThankYouPage';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '@/lib/trpc/react';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Loading state */}
        {!surveyLoaded && !surveyError && (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading survey...</span>
          </div>
        )}
        
        {/* Error state */}
        {surveyError && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Unable to Load Survey
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {surveyError}
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Homepage
            </Link>
          </div>
        )}
        
        {/* Completion state */}
        {surveyCompleted && (
          <SurveyThankYouPage />
        )}
        
        {/* Survey renderer */}
        {!surveyError && !surveyCompleted && (
          <SurveyRenderer 
            surveyToken={token} 
            onLoad={() => setSurveyLoaded(true)}
            onError={handleSurveyError}
            onComplete={handleSurveyComplete}
          />
        )}
      </div>
    </div>
  );
} 