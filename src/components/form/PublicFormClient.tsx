"use client";

import React, { useState } from "react";
import FormRenderer from "@/components/form/Renderer";
import { FormThankYouPage } from "@/components/form/ThankYouPage";
import PublicLayout from "@/components/layout/PublicLayout";
import { Form } from "@prisma/client";

interface PublicFormClientProps {
  form: Form;
}

export default function PublicFormClient({ form }: PublicFormClientProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [formCompleted, setFormCompleted] = useState(false);

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
      <article className='flex flex-1 items-start justify-center px-4 py-12'>
        <div className='w-full'>
          {/* Completion state */}
          {formCompleted && <FormThankYouPage />}

          {/* Form renderer */}
          {!formError && !formCompleted && (
            <main>
              <FormRenderer
                formToken={form.publicShareToken}
                onError={handleFormError}
                onComplete={handleFormComplete}
                showImprovedNavigation={true}
              />
            </main>
          )}
        </div>
      </article>
    </PublicLayout>
  );
}
