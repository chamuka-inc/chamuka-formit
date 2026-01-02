"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  Circle,
  Type,
  ListChecks,
  CircleDot,
  FileTextIcon,
} from "lucide-react";
import { ContextElements } from "./ContextElements";
import type { ContextElement } from "@/lib/types";

// Use a loose type to accommodate AI SDK's PartialObject with deep partial arrays
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PartialFormData = any;

interface StreamingFormPreviewProps {
  /** Partial form data from streaming - accepts AI SDK's PartialObject type */
  formData: PartialFormData | undefined;
  /** Whether streaming is in progress */
  isLoading: boolean;
  /** Error that occurred during streaming */
  error?: Error | unknown;
}

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Skeleton component for loading states
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-lg bg-muted/60 ${className}`}
  />
);

// Question type icon component
const QuestionTypeIcon = ({ type }: { type?: string }) => {
  switch (type) {
    case "text":
      return <Type className="h-4 w-4 text-blue-500" />;
    case "radio":
      return <CircleDot className="h-4 w-4 text-purple-500" />;
    case "checkbox":
      return <ListChecks className="h-4 w-4 text-green-500" />;
    default:
      return <FileTextIcon className="h-4 w-4 text-muted-foreground" />;
  }
};

// Render a single question preview
const QuestionPreview = ({
  question,
  index,
  isComplete,
}: {
  question: PartialFormData;
  index: number;
  isComplete: boolean;
}) => {
  const hasText = question?.text && question.text.length > 0;
  const hasType = question?.type;
  const hasOptions = question?.options && question.options.length > 0;

  return (
    <motion.div
      variants={itemVariants}
      className="rounded-xl border border-border bg-background p-4 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        {/* Question number indicator */}
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          {/* Question header */}
          <div className="mb-2 flex items-center gap-2">
            <QuestionTypeIcon type={hasType ? question.type : undefined} />
            {hasType && (
              <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {question.type}
              </span>
            )}
            {question?.required && (
              <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                Required
              </span>
            )}
            {isComplete && (
              <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />
            )}
          </div>

          {/* Question text */}
          {hasText ? (
            <p className="text-sm font-medium text-foreground">{question.text}</p>
          ) : (
            <Skeleton className="h-5 w-3/4" />
          )}

          {/* Context elements for question */}
          {question?.contextElements && question.contextElements.length > 0 && (
            <div className="mt-3 rounded-lg border border-border/50 bg-muted/30 p-3">
              <div className="mb-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <FileTextIcon className="h-3 w-3" />
                Context
              </div>
              <ContextElements
                elements={question.contextElements
                  ?.filter(
                    (ce: PartialFormData): ce is ContextElement =>
                      ce?.type !== undefined && ce?.content !== undefined
                  )
                  .map((ce: PartialFormData) => ({
                    id: `streaming-${Date.now()}-${Math.random()}`,
                    type: ce.type as "paragraph" | "image" | "video",
                    content: ce.content as string,
                  }))}
              />
            </div>
          )}

          {/* Options for radio/checkbox */}
          {hasOptions && (question?.type === "radio" || question?.type === "checkbox") && (
            <div className="mt-3 space-y-2">
              {question.options?.map((option: string | undefined, optIndex: number) => (
                <div key={optIndex} className="flex items-center gap-2">
                  {question.type === "radio" ? (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <div className="h-4 w-4 rounded border border-muted-foreground" />
                  )}
                  <span className="text-sm text-foreground-secondary">{option}</span>
                </div>
              ))}
            </div>
          )}

          {/* Input preview for text questions */}
          {hasType && question.type === "text" && (
            <div className="mt-3">
              <div className="h-10 rounded-lg border border-border bg-muted/50" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Render a single page preview
const PagePreview = ({
  page,
  pageIndex,
  isComplete,
}: {
  page: PartialFormData;
  pageIndex: number;
  isComplete: boolean;
}) => {
  const hasTitle = page?.title && page.title.length > 0;
  const hasDescription = page?.description && page.description.length > 0;
  const hasQuestions = page?.questions && page.questions.length > 0;
  const hasContextElements = page?.contextElements && page.contextElements.length > 0;

  // Check if page is fully complete
  const pageIsComplete =
    hasTitle &&
    (!page?.questions ||
      page.questions.every((q: PartialFormData) => q?.text && q?.type !== undefined));

  return (
    <motion.div
      variants={itemVariants}
      className="rounded-2xl border border-border bg-card p-6 shadow-lg"
    >
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            {pageIndex + 1}
          </div>
          <div>
            {hasTitle ? (
              <h3 className="text-lg font-bold text-foreground">{page.title}</h3>
            ) : (
              <Skeleton className="h-6 w-48" />
            )}
            {hasDescription ? (
              <p className="mt-1 text-sm text-muted-foreground">{page.description}</p>
            ) : page?.description !== undefined ? (
              <Skeleton className="mt-1 h-4 w-64" />
            ) : null}
          </div>
        </div>
        {pageIsComplete && isComplete && (
          <div className="flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600">
            <CheckCircle2 className="h-3 w-3" />
            Complete
          </div>
        )}
      </div>

      {/* Page context elements */}
      {hasContextElements && (
        <div className="mb-6 rounded-xl border border-border/50 bg-muted/20 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <FileText className="h-4 w-4" />
            Page Context
          </div>
          <ContextElements
            elements={page.contextElements
              ?.filter(
                (ce: PartialFormData): ce is ContextElement =>
                  ce?.type !== undefined && ce?.content !== undefined
              )
              .map((ce: PartialFormData) => ({
                id: `streaming-${Date.now()}-${Math.random()}`,
                type: ce.type as "paragraph" | "image" | "video",
                content: ce.content as string,
              }))}
          />
        </div>
      )}

      {/* Questions */}
      {hasQuestions ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {page.questions?.filter((q: PartialFormData) => q !== undefined).map((question: PartialFormData, qIndex: number) => (
            <QuestionPreview
              key={qIndex}
              question={question}
              index={qIndex}
              isComplete={
                question?.text !== undefined &&
                question?.type !== undefined &&
                question?.required !== undefined
              }
            />
          ))}
        </motion.div>
      ) : (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}
    </motion.div>
  );
};

/**
 * StreamingFormPreview - Renders form blocks progressively as they stream in
 *
 * This component receives partial form data from the AI SDK's useObject hook
 * and renders pages, questions, and context elements as they become available.
 */
export function StreamingFormPreview({
  formData,
  isLoading,
  error,
}: StreamingFormPreviewProps) {
  const hasTitle = formData?.title && formData.title.length > 0;
  const hasDescription = formData?.description && formData.description.length > 0;
  const hasPages = formData?.pages && formData.pages.length > 0;

  // Error state
  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <FileText className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-destructive">Generation Failed</h3>
        <p className="text-sm text-destructive/80">
          {error instanceof Error ? error.message : "An error occurred during generation"}
        </p>
      </div>
    );
  }

  // Empty state before any data arrives
  if (!formData && isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="mt-3 h-4 w-1/2" />
        </div>
        {/* Page skeletons */}
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // No data and not loading
  if (!formData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Form header */}
      <AnimatePresence mode="wait">
        <motion.div
          key="header"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <FileText className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              {hasTitle ? (
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
                >
                  {formData.title}
                </motion.h2>
              ) : (
                <Skeleton className="h-7 w-3/4" />
              )}
              {hasDescription ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-muted-foreground"
                >
                  {formData.description}
                </motion.p>
              ) : formData?.description !== undefined ? (
                <Skeleton className="mt-2 h-4 w-1/2" />
              ) : null}
              
              {/* Progress indicator */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
                  <div className={`h-2 w-2 rounded-full ${isLoading ? "animate-pulse bg-primary" : "bg-green-500"}`} />
                  <span className="text-xs font-semibold text-muted-foreground">
                    {isLoading ? "Generating..." : "Complete"}
                  </span>
                </div>
                {hasPages && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {formData.pages?.length} {formData.pages?.length === 1 ? "page" : "pages"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pages */}
      {hasPages ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {formData.pages?.filter((p: PartialFormData) => p !== undefined).map((page: PartialFormData, pageIndex: number) => (
            <PagePreview
              key={pageIndex}
              page={page}
              pageIndex={pageIndex}
              isComplete={!isLoading}
            />
          ))}
        </motion.div>
      ) : isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : null}
    </motion.div>
  );
}

export default StreamingFormPreview;
