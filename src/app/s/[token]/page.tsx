"use client";

import React, { useState } from "react";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import FormRenderer from "@/components/form/Renderer";
import { FormThankYouPage } from "@/components/form/ThankYouPage";
import { Loader2, AlertCircle } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

export default function PublicFormPage() {
  const params = useParams();
  const token = params?.token as string;
  const [formLoaded, setFormLoaded] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formCompleted, setFormCompleted] = useState(false);

  // Show 404 if no token is provided
  if (!token) {
    notFound();
  }

  // When form is completed
  const handleFormComplete = () => {
    setFormCompleted(true);
  };

  // When form has an error
  const handleFormError = (errorMessage: string) => {
    setFormError(errorMessage);
  };

  return (
    <PublicLayout>
      <div className='flex flex-1 items-start justify-center px-4 py-12'>
        <div className='w-full'>
          {/* Loading state */}
          {!formLoaded && !formError && (
            <div className='flex h-64 items-center justify-center'>
              <Loader2 className='h-8 w-8 animate-spin text-blue-600 dark:text-blue-400' />
              <span className='ml-2 text-gray-600 dark:text-gray-300'>
                Loading form...
              </span>
            </div>
          )}

          {/* Error state */}
          {formError && (
            <div className='rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800'>
              <div className='mb-4 flex justify-center'>
                <AlertCircle className='h-12 w-12 text-red-600 dark:text-red-500' />
              </div>
              <h2 className='mb-2 text-xl font-semibold text-gray-900 dark:text-white'>
                Unable to Load Form
              </h2>
              <p className='mb-6 text-gray-600 dark:text-gray-300'>
                {formError}
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
          {formCompleted && <FormThankYouPage />}

          {/* Form renderer */}
          {!formError && !formCompleted && (
            <FormRenderer
              formToken={token}
              onLoad={() => setFormLoaded(true)}
              onError={handleFormError}
              onComplete={handleFormComplete}
              showImprovedNavigation={true}
            />
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
