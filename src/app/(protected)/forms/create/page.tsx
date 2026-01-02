"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ChevronLeft,
  Lightbulb,
  Sparkles,
  AlertCircle,
  LayoutTemplate,
  ArrowRight,
  CheckCircle2,
  X,
  Save,
  FileText,
  Zap,
  PenTool,
} from "lucide-react";
import { api } from "@/lib/trpc/react";
import Link from "next/link";
import { examplePrompts } from "@/lib/constants/example-prompts";
import { formStructureSchema, type FormStructure } from "@/lib/zod/formSchemas";
import { StreamingFormPreview } from "@/components/form/StreamingFormPreview";

export default function CreateFormPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creationMode, setCreationMode] = useState<"manual" | "ai">("ai");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerationError, setAiGenerationError] = useState<string | null>(
    null,
  );
  const [showStreamingPreview, setShowStreamingPreview] = useState(false);
  const [completedFormData, setCompletedFormData] =
    useState<FormStructure | null>(null);

  // Get trpc utils for cache invalidation
  const utils = api.useUtils();

  // Create mutation for manual form creation
  const createMutation = api.form.create.useMutation({
    onSuccess: (data) => {
      toast.success("Form created successfully");
      router.push(`/forms/${data.id}/edit`);
    },
    onError: (error) => {
      toast.error(`Error creating form: ${error.message}`);
    },
  });

  // Mutation for saving the streamed form to database
  const saveStreamedFormMutation = api.form.create.useMutation({
    onSuccess: async (data) => {
      await saveFormDataMutation.mutateAsync({
        id: data.id,
        data: completedFormData!,
      });
    },
    onError: (error) => {
      toast.error(`Error creating form: ${error.message}`);
      setShowStreamingPreview(false);
    },
  });

  // Mutation for saving form data after creation
  const saveFormDataMutation = api.form.saveFormData.useMutation({
    onSuccess: (data) => {
      toast.success("Form generated and saved successfully!");
      deductCreditMutation.mutate();
      router.push(`/forms/${data.id}/edit`);
    },
    onError: (error) => {
      toast.error(`Error saving form data: ${error.message}`);
    },
  });

  // Mutation for deducting AI credit
  const deductCreditMutation = api.credits.deductAICredit.useMutation({
    onSuccess: () => {
      utils.credits.getAICredits.invalidate();
    },
    onError: (error) => {
      console.error("Failed to deduct credit:", error);
    },
  });

  // Streaming object hook for AI generation
  const {
    object: streamedFormData,
    submit: submitStreamGeneration,
    isLoading: isStreaming,
    error: streamError,
    stop: stopStreaming,
  } = useObject({
    api: "/api/ai/stream/generate",
    schema: formStructureSchema,
    onFinish: ({ object, error }) => {
      if (error) {
        setAiGenerationError(
          error.message || "An error occurred during generation",
        );
        return;
      }
      if (object) {
        setCompletedFormData(object as FormStructure);
      }
    },
    onError: (error) => {
      setAiGenerationError(
        error.message || "An error occurred during generation",
      );
    },
  });

  // Update completed form data when streaming finishes
  useEffect(() => {
    if (!isStreaming && streamedFormData && !streamError) {
      if (
        streamedFormData.title &&
        streamedFormData.pages &&
        streamedFormData.pages.length > 0
      ) {
        setCompletedFormData(streamedFormData as FormStructure);
      }
    }
  }, [isStreaming, streamedFormData, streamError]);

  // Randomly select 4 example prompts
  const [examplePromptsSeed, setExamplePromptsSeed] = useState(0);
  const examplePromptsList = useMemo(() => {
    const allPrompts = [...examplePrompts.forms, ...examplePrompts.content];
    const shuffled = [...allPrompts].sort(() => {
      return 0.5 - Math.random() + Math.sin(examplePromptsSeed);
    });
    return shuffled.slice(0, 4);
  }, [examplePromptsSeed]);

  const handleRefreshExamples = () => {
    setExamplePromptsSeed((prev) => prev + 1);
  };

  // Handle manual form submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    createMutation.mutate({
      title,
      description: description.trim() || undefined,
    });
  };

  // Handle AI generation submission with streaming
  const handleAiSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!aiPrompt.trim()) {
        toast.error("AI prompt is required");
        return;
      }

      setAiGenerationError(null);
      setCompletedFormData(null);
      setShowStreamingPreview(true);

      submitStreamGeneration({
        prompt: aiPrompt,
        title: title.trim() || undefined,
        description: description.trim() || undefined,
      });
    },
    [aiPrompt, title, description, submitStreamGeneration],
  );

  // Handle saving the completed streamed form
  const handleSaveStreamedForm = useCallback(() => {
    if (!completedFormData) {
      toast.error("No form data to save");
      return;
    }

    saveStreamedFormMutation.mutate({
      title: completedFormData.title || title || "AI Generated Form",
      description: completedFormData.description || description || undefined,
    });
  }, [completedFormData, title, description, saveStreamedFormMutation]);

  // Handle canceling the streaming preview
  const handleCancelPreview = useCallback(() => {
    if (isStreaming) {
      stopStreaming();
    }
    setShowStreamingPreview(false);
    setCompletedFormData(null);
    setAiGenerationError(null);
  }, [isStreaming, stopStreaming]);

  const canSaveForm = !isStreaming && completedFormData && !streamError;

  return (
    <div className='min-h-screen bg-background'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16'>
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='mb-10 sm:mb-12 lg:mb-16'
        >
          <Link
            href='/dashboard'
            className='group mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:mb-8'
          >
            <ChevronLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
            <span>Back to Dashboard</span>
          </Link>
          <div className='space-y-3 sm:space-y-4'>
            <h1 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl'>
              Create New Form
            </h1>
            <p className='max-w-3xl text-base font-medium leading-relaxed text-foreground-secondary sm:text-lg'>
              Choose your preferred method of creation. Build from scratch for
              full control, or use AI to generate a complete structure in
              seconds.
            </p>
          </div>
        </motion.div>

        {/* Streaming Preview Modal */}
        <AnimatePresence>
          {showStreamingPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-overlay/80 p-4 backdrop-blur-sm sm:p-6 lg:p-8'
              onClick={handleCancelPreview}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className='relative w-full max-w-4xl rounded-3xl border border-border bg-background shadow-2xl'
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className='sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-border bg-background/95 px-6 py-4 backdrop-blur-sm'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary'>
                      <Sparkles className='h-5 w-5 text-primary-foreground' />
                    </div>
                    <div>
                      <h2 className='text-lg font-bold tracking-tight'>
                        {isStreaming
                          ? "Generating Your Form..."
                          : "Form Generated"}
                      </h2>
                      <p className='text-sm text-muted-foreground'>
                        {isStreaming
                          ? "Watch as AI creates your form in real-time"
                          : "Review and save your generated form"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCancelPreview}
                    className='rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
                  >
                    <X className='h-5 w-5' />
                  </button>
                </div>

                {/* Modal Content */}
                <div className='max-h-[60vh] overflow-y-auto p-6'>
                  <StreamingFormPreview
                    formData={streamedFormData}
                    isLoading={isStreaming}
                    error={streamError}
                  />
                </div>

                {/* Modal Footer */}
                <div className='sticky bottom-0 flex items-center justify-between rounded-b-3xl border-t border-border bg-background/95 px-6 py-4 backdrop-blur-sm'>
                  <div className='flex items-center gap-2'>
                    {isStreaming && (
                      <>
                        <div className='h-2 w-2 animate-pulse rounded-full bg-primary' />
                        <span className='text-sm font-medium text-muted-foreground'>
                          Generating...
                        </span>
                      </>
                    )}
                    {canSaveForm && (
                      <>
                        <CheckCircle2 className='h-4 w-4 text-green-500' />
                        <span className='text-sm font-medium text-green-600'>
                          Ready to save
                        </span>
                      </>
                    )}
                  </div>
                  <div className='flex items-center gap-3'>
                    <button
                      onClick={handleCancelPreview}
                      className='inline-flex items-center justify-center rounded-xl bg-secondary px-6 py-2.5 text-sm font-bold text-secondary-foreground transition-all hover:bg-secondary-hover'
                    >
                      {isStreaming ? "Stop & Cancel" : "Cancel"}
                    </button>
                    <button
                      onClick={handleSaveStreamedForm}
                      disabled={
                        !canSaveForm ||
                        saveStreamedFormMutation.isPending ||
                        saveFormDataMutation.isPending
                      }
                      className='inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      {saveStreamedFormMutation.isPending ||
                      saveFormDataMutation.isPending ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className='mr-2 h-4 w-4' />
                          Save Form
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Creation Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className='mb-10 sm:mb-12 lg:mb-16'
        >
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6'>
            {/* AI Generation Mode */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCreationMode("ai")}
              className={`group relative flex flex-col items-start overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 sm:rounded-3xl sm:p-8 lg:p-10 ${
                creationMode === "ai"
                  ? "border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg shadow-primary/10"
                  : "border-border bg-background hover:border-primary/50 hover:bg-muted/30"
              }`}
            >
              {/* Decorative gradient overlay when selected */}
              {creationMode === "ai" && (
                <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent' />
              )}

              <div className='relative z-10 w-full'>
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all duration-300 sm:mb-6 sm:h-14 sm:w-14 sm:rounded-2xl ${
                    creationMode === "ai"
                      ? "border-primary/30 bg-primary/10 text-primary shadow-md"
                      : "border-border bg-muted text-muted-foreground group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:text-primary"
                  }`}
                >
                  <Sparkles className='h-6 w-6 sm:h-7 sm:w-7' />
                </div>

                <h3 className='mb-2 text-xl font-bold tracking-tight text-foreground sm:mb-3 sm:text-2xl'>
                  AI Generation
                </h3>
                <p
                  className={`mb-4 text-sm leading-relaxed sm:text-base ${
                    creationMode === "ai"
                      ? "text-foreground"
                      : "text-foreground-secondary"
                  }`}
                >
                  Describe your needs and let AI build a fully functional form
                  for you. Watch it generate in real-time.
                </p>

                {creationMode === "ai" && (
                  <div className='inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary'>
                    <span>Active</span>
                    <ArrowRight className='h-3.5 w-3.5' />
                  </div>
                )}
              </div>
            </motion.button>

            {/* Manual Build Mode */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCreationMode("manual")}
              className={`group relative flex flex-col items-start overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 sm:rounded-3xl sm:p-8 lg:p-10 ${
                creationMode === "manual"
                  ? "border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg shadow-primary/10"
                  : "border-border bg-background hover:border-primary/50 hover:bg-muted/30"
              }`}
            >
              {/* Decorative gradient overlay when selected */}
              {creationMode === "manual" && (
                <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent' />
              )}

              <div className='relative z-10 w-full'>
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all duration-300 sm:mb-6 sm:h-14 sm:w-14 sm:rounded-2xl ${
                    creationMode === "manual"
                      ? "border-primary/30 bg-primary/10 text-primary shadow-md"
                      : "border-border bg-muted text-muted-foreground group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:text-primary"
                  }`}
                >
                  <LayoutTemplate className='h-6 w-6 sm:h-7 sm:w-7' />
                </div>

                <h3 className='mb-2 text-xl font-bold tracking-tight text-foreground sm:mb-3 sm:text-2xl'>
                  Manual Build
                </h3>
                <p
                  className={`mb-4 text-sm leading-relaxed sm:text-base ${
                    creationMode === "manual"
                      ? "text-foreground"
                      : "text-foreground-secondary"
                  }`}
                >
                  Start from scratch and design every aspect of your form
                  manually with full control.
                </p>

                {creationMode === "manual" && (
                  <div className='inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary'>
                    <span>Active</span>
                    <ArrowRight className='h-3.5 w-3.5' />
                  </div>
                )}
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Manual Mode Form */}
        <AnimatePresence mode='wait'>
          {creationMode === "manual" && (
            <motion.div
              key='manual'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='rounded-2xl border border-border bg-background shadow-sm sm:rounded-3xl'
            >
              <div className='p-6 sm:p-8 lg:p-10'>
                <div className='mb-8 flex items-center gap-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10'>
                    <PenTool className='h-6 w-6 text-primary' />
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
                      Form Details
                    </h2>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      Create a new form from scratch
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleManualSubmit}
                  className='space-y-6 sm:space-y-8'
                >
                  <div className='space-y-2'>
                    <label
                      htmlFor='title'
                      className='block text-sm font-semibold text-foreground'
                    >
                      Form Title <span className='text-primary'>*</span>
                    </label>
                    <input
                      type='text'
                      id='title'
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className='w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm font-medium text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-base'
                      placeholder='E.g., Customer Feedback Survey'
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <label
                      htmlFor='description'
                      className='block text-sm font-semibold text-foreground'
                    >
                      Description{" "}
                      <span className='text-muted-foreground'>(Optional)</span>
                    </label>
                    <textarea
                      id='description'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className='w-full resize-none rounded-xl border border-border bg-background px-4 py-3.5 text-sm font-medium leading-relaxed text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-base'
                      placeholder='Describe the purpose of this form...'
                    />
                    <p className='text-xs text-muted-foreground'>
                      Provide context to help your respondents understand the
                      form's objective.
                    </p>
                  </div>

                  <div className='flex flex-col items-stretch justify-end gap-3 border-t border-border pt-4 sm:flex-row sm:items-center'>
                    <Link
                      href='/dashboard'
                      className='inline-flex items-center justify-center rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted'
                    >
                      Cancel
                    </Link>
                    <button
                      type='submit'
                      disabled={createMutation.isPending}
                      className='inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      {createMutation.isPending ? (
                        <>
                          <Loader2 className='h-4 w-4 animate-spin' />
                          Creating...
                        </>
                      ) : (
                        "Create Form"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* AI Mode Form */}
          {creationMode === "ai" && (
            <motion.div
              key='ai'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='space-y-6 sm:space-y-8'
            >
              {/* Hero Section */}
              <div className='relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background via-background to-muted/20 p-8 shadow-sm sm:rounded-3xl sm:p-10 lg:p-12'>
                {/* Subtle background pattern */}
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,hsl(var(--foreground))_1px,transparent_0)] bg-[length:24px_24px] opacity-[0.02]' />

                <div className='relative grid items-start gap-6 sm:grid-cols-[auto_1fr] sm:gap-8'>
                  <div className='flex-shrink-0'>
                    <div className='flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-primary/20 bg-primary/10 shadow-md sm:h-16 sm:w-16'>
                      <Zap className='h-7 w-7 text-primary sm:h-8 sm:w-8' />
                    </div>
                  </div>

                  <div className='space-y-3 sm:space-y-4'>
                    <div>
                      <h2 className='mb-2 text-2xl font-bold tracking-tight text-foreground sm:mb-3 sm:text-3xl lg:text-4xl'>
                        AI Form Generation
                      </h2>
                      <p className='max-w-2xl text-sm leading-relaxed text-foreground-secondary sm:text-base'>
                        Transform your ideas into structured forms instantly.
                        Describe what you need, and watch as AI builds your form
                        in real-time.
                      </p>
                    </div>

                    {/* Feature highlights */}
                    <div className='flex flex-wrap gap-4 pt-2 sm:gap-6'>
                      <div className='flex items-center gap-2 text-xs text-muted-foreground sm:text-sm'>
                        <div className='h-1.5 w-1.5 rounded-full bg-primary' />
                        <span>Real-time generation</span>
                      </div>
                      <div className='flex items-center gap-2 text-xs text-muted-foreground sm:text-sm'>
                        <div className='h-1.5 w-1.5 rounded-full bg-primary' />
                        <span>Multi-page support</span>
                      </div>
                      <div className='flex items-center gap-2 text-xs text-muted-foreground sm:text-sm'>
                        <div className='h-1.5 w-1.5 rounded-full bg-primary' />
                        <span>Smart structure</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two-column layout for desktop */}
              <div className='grid gap-6 sm:gap-8 lg:grid-cols-[1fr_1.1fr]'>
                {/* Left Column - Instructions & Examples */}
                <div className='space-y-6 sm:space-y-8'>
                  {/* How it works */}
                  <div className='rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8'>
                    <div className='mb-6 flex items-start gap-4'>
                      <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10'>
                        <Lightbulb className='h-6 w-6 text-primary' />
                      </div>
                      <div className='flex-1'>
                        <h3 className='mb-2 text-lg font-bold text-foreground sm:text-xl'>
                          How it works
                        </h3>
                        <p className='text-sm leading-relaxed text-foreground-secondary sm:text-base'>
                          Describe the form you need in plain English. Our AI
                          will automatically design the questions, pages, and
                          structure for you. Watch the form build in real-time
                          as it generates!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Example Prompts */}
                  <div className='rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8'>
                    <div className='mb-6 flex items-center justify-between'>
                      <div>
                        <h4 className='mb-1 text-base font-bold text-foreground sm:text-lg'>
                          Example Prompts
                        </h4>
                        <p className='text-xs text-muted-foreground sm:text-sm'>
                          Click to use
                        </p>
                      </div>
                      <button
                        onClick={handleRefreshExamples}
                        className='group flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:border-primary/50 hover:bg-muted'
                      >
                        <ArrowRight className='h-3 w-3 transition-transform group-hover:translate-x-0.5' />
                        Refresh
                      </button>
                    </div>

                    {/* Prompt cards - Grid layout */}
                    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'>
                      {examplePromptsList.map((prompt, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setAiPrompt(prompt.prompt)}
                          className='group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background text-left transition-all duration-200 hover:border-primary hover:shadow-md hover:shadow-primary/5'
                        >
                          {/* Card header */}
                          <div className='flex items-center justify-between gap-2 border-b border-border bg-muted/20 p-3'>
                            <span className='inline-flex items-center rounded-md border border-border/50 bg-background px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
                              {prompt.type}
                            </span>
                            <span className='inline-flex items-center gap-1.5 text-[10px] font-bold text-primary'>
                              <FileText className='h-3 w-3' />
                              {prompt.pages}{" "}
                              {prompt.pages === 1 ? "page" : "pages"}
                            </span>
                          </div>

                          {/* Card content */}
                          <div className='flex-1 p-4'>
                            <p className='line-clamp-3 text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-primary'>
                              {prompt.description}
                            </p>
                          </div>

                          {/* Hover accent */}
                          <div className='absolute bottom-0 left-0 right-0 h-1 origin-left scale-x-0 transform bg-primary transition-transform duration-300 group-hover:scale-x-100' />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Form Inputs */}
                <div className='lg:sticky lg:top-8 lg:self-start'>
                  <div className='rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8'>
                    <form onSubmit={handleAiSubmit} className='space-y-6'>
                      {/* Form Title */}
                      <div className='space-y-2'>
                        <label
                          htmlFor='title'
                          className='block text-sm font-semibold text-foreground'
                        >
                          Form Title
                          <span className='ml-2 text-xs font-normal text-muted-foreground'>
                            (Optional)
                          </span>
                        </label>
                        <input
                          type='text'
                          id='title'
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className='w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                          placeholder='Leave blank for AI-generated title...'
                        />
                      </div>

                      {/* Generation Prompt */}
                      <div className='space-y-2'>
                        <label
                          htmlFor='aiPrompt'
                          className='block text-sm font-semibold text-foreground'
                        >
                          Generation Prompt
                          <span className='ml-2 text-primary'>*</span>
                        </label>
                        <textarea
                          id='aiPrompt'
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          rows={8}
                          className='w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium leading-relaxed text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                          placeholder='E.g., A multi-page survey for a coffee shop to collect feedback on drink quality and service...'
                          required
                        />
                        <p className='text-xs leading-relaxed text-muted-foreground'>
                          Be as specific as possible to get the best results
                          from the AI.
                        </p>
                      </div>

                      {/* Error Display */}
                      {aiGenerationError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4'
                        >
                          <AlertCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-destructive' />
                          <div>
                            <h3 className='mb-1 text-sm font-bold text-destructive'>
                              Generation Failed
                            </h3>
                            <p className='text-xs leading-relaxed text-destructive/80'>
                              {aiGenerationError}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {/* Action Buttons */}
                      <div className='flex flex-col items-stretch justify-end gap-3 border-t border-border pt-4 sm:flex-row sm:items-center'>
                        <Link
                          href='/dashboard'
                          className='inline-flex items-center justify-center rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted'
                        >
                          Cancel
                        </Link>
                        <button
                          type='submit'
                          disabled={isStreaming}
                          className='inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50'
                        >
                          {isStreaming ? (
                            <>
                              <Loader2 className='h-4 w-4 animate-spin' />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className='h-4 w-4' />
                              Generate Form
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
