"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { api } from "@/lib/trpc/react";
import {
  type SurveyPage,
  type Question,
  type ContextElement,
} from "@/lib/types";

interface SurveyRendererProps {
  surveyToken: string;
  onLoad?: () => void;
  onError?: (message: string) => void;
  onComplete?: () => void;
}

export default function SurveyRenderer({
  surveyToken,
  onLoad,
  onError,
  onComplete,
}: SurveyRendererProps) {
  // State for survey data
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);

  // Fetch the survey data using the public share token
  const {
    data: surveyData,
    isLoading,
    error,
  } = api.survey.getByShareToken.useQuery(
    {
      token: surveyToken,
    },
    {
      retry: 1, // Only retry once to avoid excessive error messages
      retryDelay: 1000,
    },
  );

  // Call onLoad callback when survey data is loaded
  useEffect(() => {
    if (surveyData && !isLoading && onLoad) {
      onLoad();
    }
  }, [surveyData, isLoading, onLoad]);

  // Call onError callback when there's an error loading the survey
  useEffect(() => {
    if (error) {
      console.error("Error fetching survey by token:", error);
      if (onError) {
        onError(error.message || "Failed to load survey");
      }
    }
  }, [error, onError]);

  // Handle case when survey is not found or not published
  useEffect(() => {
    if (!isLoading && !surveyData && !error && onError) {
      onError("Survey not found or not available for viewing");
    }
  }, [surveyData, isLoading, error, onError]);

  // Submission mutation
  const submitMutation = api.survey.submitResponses.useMutation({
    onSuccess: () => {
      toast.success("Survey submitted successfully!");
      setSurveyCompleted(true);
      if (onComplete) {
        onComplete();
      }
    },
    onError: (error) => {
      toast.error(`Error submitting survey: ${error.message}`);
      setIsSubmitting(false);
      if (onError) {
        onError(`Error submitting survey: ${error.message}`);
      }
    },
  });

  // Get the current page
  const surveyData1 = surveyData?.data
    ? typeof surveyData.data === "object"
      ? (surveyData.data as any)
      : { pages: [] }
    : { pages: [] };
  const pages = Array.isArray(surveyData1.pages) ? surveyData1.pages : [];
  const currentPage = pages[currentPageIndex];
  const totalPages = pages.length || 0;

  // Handle response changes
  const handleResponseChange = (questionId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Navigate to the next page
  const goToNextPage = () => {
    // Validate required fields
    const requiredQuestions =
      currentPage?.questions?.filter((q: Question) => q.required) || [];
    const missingResponses = requiredQuestions.filter(
      (q: Question) => !responses[q.id!],
    );

    if (missingResponses.length > 0) {
      toast.error("Please answer all required questions");
      return;
    }

    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex((current) => current + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Navigate to the previous page
  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((current) => current - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate required fields on the final page
    const requiredQuestions =
      currentPage?.questions?.filter((q: Question) => q.required) || [];
    const missingResponses = requiredQuestions.filter(
      (q: Question) => !responses[q.id!],
    );

    if (missingResponses.length > 0) {
      toast.error("Please answer all required questions");
      return;
    }

    // Prepare the submission data
    setIsSubmitting(true);

    // Submit the responses with the full JSON data
    submitMutation.mutate({
      surveyId: surveyData?.id || "",
      data: {
        responses,
        submittedAt: new Date().toISOString(),
      },
    });
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500'></div>
      </div>
    );
  }

  // Render error state
  if (error || !surveyData) {
    return (
      <div className='rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20'>
        <h2 className='mb-2 text-lg font-semibold text-red-700 dark:text-red-400'>
          Error Loading Survey
        </h2>
        <p className='text-red-600 dark:text-red-300'>
          {error?.message || "Survey not found or not available"}
        </p>
      </div>
    );
  }

  // Render completion state
  if (surveyCompleted) {
    return (
      <div className='my-8 rounded-lg border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-900/20'>
        <h2 className='mb-3 text-2xl font-bold text-green-700 dark:text-green-400'>
          Thank You!
        </h2>
        <p className='mb-6 text-green-600 dark:text-green-300'>
          Your response has been submitted successfully.
        </p>
      </div>
    );
  }

  return (
    <div className='mx-auto w-full max-w-3xl'>
      {/* Survey title */}
      <div className='mb-8 text-center'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl'>
          {surveyData.title}
        </h1>
        {surveyData.description && (
          <p className='mt-2 text-gray-600 dark:text-gray-300'>
            {surveyData.description}
          </p>
        )}
      </div>

      {/* Progress indicator */}
      <div className='mb-6'>
        <div className='mb-1 flex justify-between text-sm text-gray-500 dark:text-gray-400'>
          <span>
            Page {currentPageIndex + 1} of {totalPages}
          </span>
          <span>
            {Math.round(((currentPageIndex + 1) / totalPages) * 100)}% completed
          </span>
        </div>
        <div className='h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
          <div
            className='h-2 rounded-full bg-blue-500'
            style={{ width: `${((currentPageIndex + 1) / totalPages) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current page */}
      <div className='rounded-lg bg-white p-6 shadow dark:bg-gray-800'>
        {/* Page title */}
        {currentPage && (
          <div className='mb-6'>
            <h2 className='text-xl font-semibold text-gray-800 dark:text-white'>
              {currentPage.title}
            </h2>
            {currentPage.description && (
              <p className='mt-1 text-gray-600 dark:text-gray-300'>
                {currentPage.description}
              </p>
            )}
          </div>
        )}

        {/* Context elements at page level */}
        {currentPage?.contextElements?.map(
          (element: ContextElement, idx: number) => (
            <RenderContextElement
              key={`page-context-${idx}`}
              element={element}
            />
          ),
        )}

        {/* Questions */}
        <div className='space-y-8'>
          {currentPage?.questions?.map((question: Question) => (
            <div
              key={question.id}
              className='border-b border-gray-200 pb-6 last:border-b-0 dark:border-gray-700'
            >
              <RenderQuestion
                question={question}
                value={responses[question.id!] || ""}
                onChange={(value) => handleResponseChange(question.id!, value)}
              />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className='mt-8 flex justify-between'>
          <button
            type='button'
            onClick={goToPrevPage}
            disabled={currentPageIndex === 0}
            className={`flex items-center rounded-md px-4 py-2 ${
              currentPageIndex === 0
                ? "cursor-not-allowed text-gray-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <ChevronLeft className='mr-1 h-5 w-5' />
            Previous
          </button>

          {currentPageIndex < totalPages - 1 ? (
            <button
              type='button'
              onClick={goToNextPage}
              className='flex items-center rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
            >
              Next
              <ChevronRight className='ml-1 h-5 w-5' />
            </button>
          ) : (
            <button
              type='button'
              onClick={handleSubmit}
              disabled={isSubmitting}
              className='flex items-center rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600'
            >
              {isSubmitting ? (
                <>
                  <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit
                  <Send className='ml-2 h-4 w-4' />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Component to render a question based on its type
function RenderQuestion({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className='space-y-3'>
      <div className='flex items-start'>
        <label className='block font-medium text-gray-700 dark:text-gray-200'>
          {question.text}
          {question.required && <span className='ml-1 text-red-500'>*</span>}
        </label>
      </div>

      {/* Context elements */}
      {question.contextElements?.map((element, idx) => (
        <RenderContextElement
          key={`question-context-${idx}`}
          element={element}
        />
      ))}

      {/* Render different input types based on question type */}
      {question.type === "text" && (
        <input
          type='text'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className='mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
          placeholder='Your answer'
          required={question.required}
        />
      )}

      {question.type === "radio" && (
        <div className='space-y-2'>
          {question.options?.map((option, idx) => (
            <div key={idx} className='flex items-center'>
              <input
                type='radio'
                id={`question-${question.id}-option-${idx}`}
                name={`question-${question.id}`}
                value={option}
                checked={value === option}
                onChange={() => onChange(option)}
                className='h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600'
                required={question.required}
              />
              <label
                htmlFor={`question-${question.id}-option-${idx}`}
                className='ml-2 block text-gray-700 dark:text-gray-200'
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      )}

      {question.type === "checkbox" && (
        <div className='space-y-2'>
          {question.options?.map((option, idx) => {
            const values = value ? value.split(",") : [];
            const isChecked = values.includes(option);

            return (
              <div key={idx} className='flex items-center'>
                <input
                  type='checkbox'
                  id={`question-${question.id}-option-${idx}`}
                  name={`question-${question.id}`}
                  value={option}
                  checked={isChecked}
                  onChange={() => {
                    let newValues;
                    if (isChecked) {
                      newValues = values.filter((v) => v !== option);
                    } else {
                      newValues = [...values, option];
                    }
                    onChange(newValues.join(","));
                  }}
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600'
                />
                <label
                  htmlFor={`question-${question.id}-option-${idx}`}
                  className='ml-2 block text-gray-700 dark:text-gray-200'
                >
                  {option}
                </label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Component to render a context element
function RenderContextElement({ element }: { element: ContextElement }) {
  if (element.type === "paragraph") {
    return (
      <div className='prose mb-4 max-w-none dark:prose-invert'>
        <p>{element.content}</p>
      </div>
    );
  }

  if (element.type === "image") {
    return (
      <div className='mb-4'>
        <img
          src={element.content}
          alt='Survey context'
          className='h-auto max-w-full rounded-lg'
        />
      </div>
    );
  }

  if (element.type === "video") {
    return (
      <div className='mb-4'>
        <iframe
          src={element.content}
          title='Survey video'
          className='aspect-video w-full rounded-lg'
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return null;
}
