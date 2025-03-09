"use client";

import React, { useState } from "react";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import FormRenderer from "@/components/form/Renderer";
import { FormThankYouPage } from "@/components/form/ThankYouPage";
import PublicLayout from "@/components/layout/PublicLayout";

export default function PublicFormPage() {
  const params = useParams();
  const token = params?.token as string;
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
          {/* Completion state */}
          {formCompleted && <FormThankYouPage />}

          {/* Form renderer */}
          {!formError && !formCompleted && (
            <FormRenderer
              formToken={token}
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
