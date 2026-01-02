"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight, Menu, X, FileText } from "lucide-react";
import { api } from "@/lib/trpc/react";
import { type FormPage, type Question, type QuestionType } from "@/lib/types";
import { FormPageNavigation } from "./PageNavigation";
import { Question as QuestionComponent } from "./Question";
import { ContextElements } from "./ContextElements";
import { LatexText } from "@/components/LatexText";

// Extended question type for the renderer
type ExtendedQuestionType = QuestionType | "textarea" | "select";

interface FormRendererProps {
  formToken?: string;
  onLoad?: () => void;
  onError?: (message: string) => void;
  onComplete?: () => void;
  showImprovedNavigation?: boolean;
  isPreview?: boolean;
  previewData?: {
    pages: FormPage[];
    pageIndex: number;
    title?: string;
    description?: string;
  };
}

// Form header component to display the form title and description
const FormHeader = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => {
  if (!title) return null;

  return (
    <div className='mb-6 sm:mb-8'>
      <h1 className='font-display text-xl font-bold text-foreground sm:text-2xl'>
        <LatexText>{title}</LatexText>
      </h1>
      {description && (
        <p className='mt-2 text-sm text-foreground-secondary sm:mt-3'>
          <LatexText>{description}</LatexText>
        </p>
      )}
    </div>
  );
};

// Progress indicator component
const ProgressIndicator = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => {
  const percentage = Math.round(((current + 1) / total) * 100);

  return (
    <div className='mb-6'>
      <div className='mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <div className='mb-1 text-sm font-medium text-foreground-secondary sm:mb-0'>
          Page {current + 1} of {total}
        </div>
        <div className='text-sm text-muted-foreground'>
          {percentage}% Complete
        </div>
      </div>
      <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
        <div
          className='h-full bg-primary transition-all duration-300'
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Loading state component
const LoadingState = () => (
  <div className='flex h-[60vh] flex-col items-center justify-center p-4 text-center sm:p-8'>
    <div className='mb-4 flex h-12 w-12 animate-spin items-center justify-center rounded-full border-2 border-border border-t-primary sm:h-16 sm:w-16'></div>
    <h2 className='font-display mb-2 text-lg font-semibold text-foreground sm:text-xl'>
      Loading Form
    </h2>
    <p className='max-w-sm text-sm text-muted-foreground sm:text-base'>
      Please wait while we load the form content...
    </p>
  </div>
);

// Error state component
const ErrorState = ({ message }: { message: string }) => (
  <div className='flex h-[60vh] flex-col items-center justify-center p-4 text-center sm:p-8'>
    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20 sm:h-16 sm:w-16'>
      <svg
        className='h-6 w-6 text-destructive sm:h-8 sm:w-8'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M6 18L18 6M6 6l12 12'
        />
      </svg>
    </div>
    <h2 className='font-display mb-2 text-lg font-semibold text-foreground sm:text-xl'>
      Error Loading Form
    </h2>
    <p className='max-w-sm text-sm text-destructive sm:text-base'>
      {message || "An unexpected error occurred"}
    </p>
  </div>
);

// Success state component
const SuccessState = () => (
  <div className='flex h-[60vh] flex-col items-center justify-center p-4 text-center sm:p-8'>
    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/20 sm:h-16 sm:w-16'>
      <svg
        className='h-6 w-6 text-success sm:h-8 sm:w-8'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M5 13l4 4L19 7'
        />
      </svg>
    </div>
    <h2 className='font-display mb-2 text-lg font-semibold text-foreground sm:text-xl'>
      Response Submitted
    </h2>
    <p className='max-w-sm text-sm text-muted-foreground sm:text-base'>
      Thank you for completing this form. Your response has been recorded.
    </p>
  </div>
);

// Empty state component
const EmptyState = ({ isPreview }: { isPreview: boolean }) => (
  <div className='flex h-[60vh] flex-col items-center justify-center p-4 text-center sm:p-8'>
    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted sm:h-16 sm:w-16'>
      <FileText className='h-6 w-6 text-muted-foreground sm:h-8 sm:w-8' />
    </div>
    <h2 className='font-display mb-2 text-lg font-semibold text-foreground sm:text-xl'>
      {isPreview ? "No Pages to Preview" : "No Form Content"}
    </h2>
    <p className='max-w-sm text-sm text-muted-foreground sm:text-base'>
      {isPreview
        ? "Add some pages to your form using the builder tab to see them in preview mode."
        : "This form has no content yet. Check back later."}
    </p>
  </div>
);

// Navigation buttons component
interface NavigationProps {
  currentPageIndex: number;
  totalPages: number;
  isSubmitting: boolean;
  isPreview: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  pages: FormPage[];
  setPageIndex: (index: number) => void;
}

const FormNavigation = ({
  currentPageIndex,
  totalPages,
  isSubmitting,
  isPreview,
  onPrevious,
  onNext,
  onSubmit,
  pages,
  setPageIndex,
}: NavigationProps) => {
  const isLastPage = currentPageIndex === totalPages - 1;

  const handlePageDotClick = (idx: number) => {
    // Only allow skipping ahead in preview mode
    if (isPreview || idx <= currentPageIndex) {
      setPageIndex(idx);
    } else {
      toast.error("Please complete the current page before skipping ahead");
    }
  };

  return (
    <div className='flex items-center justify-between gap-4 border-t border-border bg-background-secondary px-4 py-3 sm:px-8 sm:py-4'>
      <button
        onClick={onPrevious}
        disabled={currentPageIndex === 0}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:gap-2 sm:px-4 sm:py-2.5 ${
          currentPageIndex === 0
            ? "cursor-not-allowed text-muted-foreground opacity-50"
            : "text-foreground-secondary hover:bg-secondary hover:text-foreground"
        }`}
      >
        <ChevronLeft className='h-4 w-4 sm:h-5 sm:w-5' />
        <span className='hidden sm:inline'>Previous</span>
      </button>

      <div className='hidden items-center gap-2.5 md:flex'>
        {pages.map((_, idx) => {
          const isCurrent = idx === currentPageIndex;
          const isCompleted = idx < currentPageIndex;
          return (
            <button
              key={idx}
              onClick={() => handlePageDotClick(idx)}
              className={`group relative flex h-6 w-6 items-center justify-center rounded-full transition-all ${
                isCurrent
                  ? "bg-accent"
                  : isCompleted
                    ? "bg-accent/50"
                    : "bg-muted"
              }`}
              aria-label={`Go to page ${idx + 1}`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  isCurrent
                    ? "bg-primary"
                    : isCompleted
                      ? "bg-primary/70"
                      : "bg-muted-foreground/30"
                }`}
              />
              {idx < pages.length - 1 && (
                <span
                  className={`absolute left-[24px] h-0.5 w-3 ${
                    isCompleted ? "bg-primary/50" : "bg-border"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={isLastPage ? onSubmit : onNext}
        disabled={isSubmitting && !isPreview}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:gap-2 sm:px-6 sm:py-2.5 ${
          isLastPage
            ? "bg-primary text-primary-foreground hover:bg-primary-hover"
            : "bg-primary text-primary-foreground hover:bg-primary-hover"
        } ${isSubmitting && !isPreview ? "cursor-not-allowed opacity-70" : ""}`}
      >
        {isSubmitting && !isPreview ? (
          <span className='flex items-center gap-2'>
            <svg className='h-4 w-4 animate-spin' viewBox='0 0 24 24'>
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
                fill='none'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
            <span>Submitting...</span>
          </span>
        ) : (
          <>
            <span>{isLastPage ? "Submit" : "Next"}</span>
            <ChevronRight className='h-4 w-4 sm:h-5 sm:w-5' />
          </>
        )}
      </button>
    </div>
  );
};

// Input component for different question types
interface QuestionInputProps {
  question: Question;
  value: string;
  onChange: (id: string, value: string) => void;
}

const QuestionInput = ({ question, value, onChange }: QuestionInputProps) => {
  const questionId = question.id as string;

  switch (question.type as ExtendedQuestionType) {
    case "text":
      return (
        <input
          type='text'
          value={value}
          onChange={(e) => onChange(questionId, e.target.value)}
          className='w-full rounded-lg border border-input px-3 py-2 text-sm text-foreground shadow-sm focus:border-input-focus focus:outline-none focus:ring-2 focus:ring-ring sm:text-base'
          placeholder='Your answer'
          required={question.required}
        />
      );

    case "textarea":
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(questionId, e.target.value)}
          className='h-20 w-full rounded-lg border border-input px-3 py-2 text-sm text-foreground shadow-sm focus:border-input-focus focus:outline-none focus:ring-2 focus:ring-ring sm:h-24 sm:text-base'
          placeholder='Your answer'
          required={question.required}
        />
      );

    case "radio":
      return (
        <div className='space-y-1.5 sm:space-y-2'>
          {question.options?.map((option, idx) => (
            <label
              key={idx}
              className='flex items-center space-x-2 sm:space-x-3'
            >
              <input
                type='radio'
                name={`question-${questionId}`}
                value={option}
                checked={value === option}
                onChange={() => onChange(questionId, option)}
                className='h-3.5 w-3.5 text-primary focus:ring-ring sm:h-4 sm:w-4'
                required={question.required}
              />
              <span className='text-sm text-foreground-secondary sm:text-base'>
                <LatexText>{option}</LatexText>
              </span>
            </label>
          ))}
        </div>
      );

    case "checkbox":
      return (
        <div className='space-y-1.5 sm:space-y-2'>
          {question.options?.map((option, idx) => {
            const currentSelections = (value || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);

            return (
              <label
                key={idx}
                className='flex items-center space-x-2 sm:space-x-3'
              >
                <input
                  type='checkbox'
                  name={`question-${questionId}-${idx}`}
                  value={option}
                  checked={currentSelections.includes(option)}
                  onChange={(e) => {
                    let newSelections = [...currentSelections];

                    if (e.target.checked) {
                      newSelections.push(option);
                    } else {
                      newSelections = newSelections.filter((s) => s !== option);
                    }

                    onChange(questionId, newSelections.join(", "));
                  }}
                  className='h-3.5 w-3.5 rounded text-primary focus:ring-ring sm:h-4 sm:w-4'
                />
                <span className='text-sm text-foreground-secondary sm:text-base'>
                  <LatexText>{option}</LatexText>
                </span>
              </label>
            );
          })}
        </div>
      );

    case "select":
      return (
        <select
          value={value}
          onChange={(e) => onChange(questionId, e.target.value)}
          className='w-full rounded-lg border border-input px-3 py-2 text-sm text-foreground shadow-sm focus:border-input-focus focus:outline-none focus:ring-2 focus:ring-ring sm:text-base'
          required={question.required}
        >
          <option value=''>Select an option</option>
          {question.options?.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    default:
      return null;
  }
};

export default function FormRenderer({
  formToken,
  onLoad,
  onError,
  onComplete,
  showImprovedNavigation = true,
  isPreview = false,
  previewData,
}: FormRendererProps) {
  // State management
  const [currentPageIndex, setCurrentPageIndex] = useState(
    isPreview && previewData ? previewData.pageIndex : 0,
  );
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // API queries and mutations
  const submitResponsesMutation = api.form.submitResponses.useMutation({
    onSuccess: () => {
      setFormCompleted(true);
      onComplete?.();
    },
    onError: (err) => {
      const errorMessage = err.message || "Failed to submit form";
      toast.error(errorMessage);
      onError?.(errorMessage);
      setIsSubmitting(false);
    },
  });

  const {
    data: formData,
    isLoading,
    error,
  } = !isPreview && formToken
    ? api.form.getByShareToken.useQuery(
        { token: formToken },
        {
          retry: 1,
          retryDelay: 1000,
        },
      )
    : { data: undefined, isLoading: false, error: undefined };

  // Get pages data from either preview or form data
  const formDataPages = formData?.data
    ? typeof formData.data === "object" && "pages" in formData.data
      ? (formData.data as any).pages
      : []
    : [];

  const pages = isPreview && previewData ? previewData.pages : formDataPages;
  const totalPages = pages.length;
  const currentPage = pages[currentPageIndex];

  // Get form title and description from either preview or form data
  const formTitle =
    isPreview && previewData?.title
      ? previewData.title
      : formData?.data &&
          typeof formData.data === "object" &&
          "title" in formData.data
        ? (formData.data as any).title
        : formData?.title;

  const formDescription =
    isPreview && previewData?.description
      ? previewData.description
      : formData?.data &&
          typeof formData.data === "object" &&
          "description" in formData.data
        ? (formData.data as any).description
        : formData?.description;

  // Effects
  useEffect(() => {
    if (!isPreview && formData && onLoad) {
      onLoad();
    }
  }, [formData, isPreview, onLoad]);

  useEffect(() => {
    if (!isPreview && error && onError) {
      onError(error.message);
    }
  }, [error, isPreview, onError]);

  // Handler functions
  const handleResponseChange = useCallback(
    (questionId: string, value: string) => {
      if (isPreview) return;

      setResponses((prev) => ({
        ...prev,
        [questionId]: value,
      }));
    },
    [isPreview],
  );

  const validateRequiredFields = useCallback(() => {
    if (isPreview) return true;

    const requiredQuestions =
      currentPage?.questions?.filter((q: Question) => q.required) || [];
    const missingResponses = requiredQuestions.filter(
      (q: Question) => !responses[q.id!],
    );

    if (missingResponses.length > 0) {
      toast.error("Please answer all required questions");
      return false;
    }

    return true;
  }, [currentPage, responses, isPreview]);

  const goToNextPage = useCallback(() => {
    if (!validateRequiredFields()) return;

    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex((current) => current + 1);
    }
  }, [currentPageIndex, totalPages, validateRequiredFields]);

  const goToPrevPage = useCallback(() => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((current) => current - 1);
    }
  }, [currentPageIndex]);

  const handleSubmit = useCallback(async () => {
    if (isPreview) {
      toast.info("Form submission is disabled in preview mode");
      return;
    }

    if (!validateRequiredFields()) return;

    setIsSubmitting(true);

    if (formToken) {
      submitResponsesMutation.mutate({
        formId: formData?.id || "",
        data: {
          responses,
          submittedAt: new Date().toISOString(),
        },
      });
    } else {
      setIsSubmitting(false);
    }
  }, [
    isPreview,
    validateRequiredFields,
    formToken,
    submitResponsesMutation,
    formData,
    responses,
  ]);

  // Render states
  if (formCompleted && !isPreview) {
    return <SuccessState />;
  }

  if (!isPreview && isLoading) {
    return <LoadingState />;
  }

  if (!isPreview && error) {
    return <ErrorState message={error.message} />;
  }

  if (pages.length === 0) {
    return <EmptyState isPreview={isPreview} />;
  }

  if (!currentPage) {
    return (
      <div className='flex h-[60vh] flex-col items-center justify-center p-4 text-center sm:p-8'>
        <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted sm:h-16 sm:w-16'>
          <FileText className='h-6 w-6 text-muted-foreground sm:h-8 sm:w-8' />
        </div>
        <h2 className='font-display mb-2 text-lg font-semibold text-foreground sm:text-xl'>
          Page Not Found
        </h2>
        <p className='max-w-sm text-sm text-muted-foreground sm:text-base'>
          The selected page could not be found. Please try selecting a different
          page.
        </p>
      </div>
    );
  }

  return (
    <div className='w-full'>
      {/* Preview Banner - only show in preview mode */}
      {isPreview && (
        <div className='mb-6 rounded-lg bg-accent p-3 text-center text-sm text-accent-foreground shadow-sm sm:text-base'>
          <span className='font-medium'>Preview Mode</span> — See how your form
          will appear to respondents
        </div>
      )}

      {/* Form Title and Description */}
      <FormHeader title={formTitle} description={formDescription} />

      {/* Mobile: Toggle sidebar button */}
      <div className='mb-4 flex lg:hidden'>
        <button
          onClick={() => setSidebarVisible(!sidebarVisible)}
          className='inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground-secondary shadow-sm transition-colors hover:bg-secondary'
        >
          {sidebarVisible ? (
            <>
              <X className='h-4 w-4' />
              <span>Hide Pages</span>
            </>
          ) : (
            <>
              <Menu className='h-4 w-4' />
              <span>Show Pages</span>
            </>
          )}
        </button>
      </div>

      <div className='flex flex-col gap-6 lg:flex-row'>
        {/* Side Page Navigation */}
        <div
          className={`${
            sidebarVisible ? "block" : "hidden lg:block"
          } w-full lg:w-1/4 xl:w-1/5`}
        >
          <FormPageNavigation
            pages={pages}
            currentPageIndex={currentPageIndex}
            onPageSelect={(index) => {
              // In non-preview mode, validate required fields before allowing navigation
              if (!isPreview && currentPageIndex !== index) {
                const requiredQuestions =
                  currentPage?.questions?.filter((q: Question) => q.required) ||
                  [];
                const missingResponses = requiredQuestions.filter(
                  (q: Question) => !responses[q.id!],
                );

                if (missingResponses.length > 0 && index > currentPageIndex) {
                  toast.error(
                    "Please answer all required questions before proceeding",
                  );
                  return;
                }
              }

              setCurrentPageIndex(index);
              setSidebarVisible(false); // Hide sidebar on mobile after selection
            }}
          />
        </div>

        <div className='w-full lg:w-3/4 xl:w-4/5'>
          {/* Progress Bar */}
          <ProgressIndicator current={currentPageIndex} total={pages.length} />

          {/* Page Content */}
          <div className='overflow-hidden rounded-xl border border-border bg-background shadow-md'>
            <div className='p-5 sm:p-8'>
              <div className='mb-8 border-b border-border pb-4'>
                <div className='flex items-center gap-2 sm:gap-3'>
                  <FileText className='h-5 w-5 text-muted-foreground sm:h-6 sm:w-6' />
                  <h2 className='font-display text-xl font-bold text-foreground sm:text-2xl'>
                    <LatexText>{currentPage.title}</LatexText>
                  </h2>
                </div>
                {currentPage.description && (
                  <p className='mt-3 pl-8 text-foreground-secondary'>
                    <LatexText>{currentPage.description}</LatexText>
                  </p>
                )}
              </div>

              <div className='space-y-8'>
                {currentPage.contextElements &&
                  currentPage.contextElements.length > 0 && (
                    <div className='mb-6 md:mb-8'>
                      <ContextElements elements={currentPage.contextElements} />
                    </div>
                  )}

                {currentPage.questions && currentPage.questions.length > 0 ? (
                  <div className='space-y-4 sm:space-y-6'>
                    {currentPage.questions.map(
                      (question: Question, index: number) =>
                        isPreview ? (
                          <QuestionComponent
                            key={question.id || index}
                            question={question}
                            mode='preview'
                          />
                        ) : (
                          <div
                            key={question.id || index}
                            className='rounded-lg border border-border bg-muted p-4 sm:p-5 md:p-6'
                          >
                            <div className='flex items-start'>
                              <label className='block text-sm font-medium text-foreground sm:text-base'>
                                <LatexText>{question.text}</LatexText>
                                {question.required && (
                                  <span className='ml-1 text-destructive'>
                                    *
                                  </span>
                                )}
                              </label>
                            </div>

                            {/* Context elements */}
                            {question.contextElements &&
                              question.contextElements.length > 0 && (
                                <div className='mt-2 sm:mt-3'>
                                  <ContextElements
                                    elements={question.contextElements}
                                  />
                                </div>
                              )}

                            {/* Render the appropriate input type */}
                            <div className='mt-2 sm:mt-3'>
                              <QuestionInput
                                question={question}
                                value={responses[question.id!] || ""}
                                onChange={handleResponseChange}
                              />
                            </div>
                          </div>
                        ),
                    )}
                  </div>
                ) : (
                  !currentPage.contextElements?.length && (
                    <div className='rounded-lg border border-dashed border-border bg-muted p-4 text-center sm:p-6 md:p-8'>
                      <p className='text-sm text-foreground-secondary sm:text-base'>
                        No content added to this page.
                      </p>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        {isPreview
                          ? "Switch to builder mode to add questions or content elements"
                          : "This page has no content yet."}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Navigation Footer - at bottom of page */}
            <FormNavigation
              currentPageIndex={currentPageIndex}
              totalPages={totalPages}
              isSubmitting={isSubmitting}
              isPreview={isPreview}
              onPrevious={goToPrevPage}
              onNext={goToNextPage}
              onSubmit={handleSubmit}
              pages={pages}
              setPageIndex={setCurrentPageIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
