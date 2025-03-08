"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Loader2,
  ChevronLeft,
  Lightbulb,
  Sparkles,
  AlertCircle,
  Layout,
  LayoutTemplate,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/trpc/react";
import Link from "next/link";

export default function CreateSurveyPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creationMode, setCreationMode] = useState<"manual" | "ai">("ai");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerationError, setAiGenerationError] = useState<string | null>(
    null,
  );

  // Get trpc utils for cache invalidation
  const utils = api.useUtils();

  // Create mutation
  const createMutation = api.survey.create.useMutation({
    onSuccess: (data) => {
      toast.success("Survey created successfully");
      router.push(`/surveys/${data.id}/edit`);
    },
    onError: (error) => {
      toast.error(`Error creating survey: ${error.message}`);
    },
  });

  // AI generation mutation
  const generateMutation = api.survey.generateWithAI.useMutation({
    onSuccess: (data) => {
      toast.success("Survey generated successfully with AI");
      // Invalidate the credits query to refresh the credit count
      utils.credits.getAICredits.invalidate();
      router.push(`/surveys/${data.survey.id}/edit`);
    },
    onError: (error) => {
      setAiGenerationError(error.message);
      toast.error(`Error generating survey: ${error.message}`);
      setIsGenerating(false);
      // Also invalidate on error to show the refunded credit
      utils.credits.getAICredits.invalidate();
    },
  });

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

  // Handle AI generation submission
  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!aiPrompt.trim()) {
      toast.error("AI prompt is required");
      return;
    }

    setIsGenerating(true);
    setAiGenerationError(null);

    generateMutation.mutate({
      prompt: aiPrompt,
      title: title.trim() || undefined,
      description: description.trim() || undefined,
    });
  };

  return (
    <div className='mx-auto max-w-6xl px-4 py-8 sm:px-6'>
      {/* Header */}
      <div className='mb-8'>
        <Link
          href='/dashboard'
          className='mb-4 inline-flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-gray-200'
        >
          <ChevronLeft className='mr-1 h-4 w-4' />
          Back to Dashboard
        </Link>
        <h1 className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-gray-900 text-transparent dark:from-blue-400 dark:to-purple-400 dark:text-white'>
          Create New Survey
        </h1>
        <p className='mt-2 max-w-2xl text-gray-600 dark:text-gray-400'>
          Choose how you want to create your survey. You can build it manually
          or let our AI generate one for you based on your description.
        </p>
      </div>

      {/* Creation mode toggle */}
      <div className='mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        <div className='grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-0'>
          <button
            onClick={() => setCreationMode("ai")}
            className={`group relative flex flex-col items-start p-6 text-left transition-all duration-200 sm:p-8 ${
              creationMode === "ai"
                ? "bg-purple-50/80 dark:bg-purple-950/30"
                : "dark:hover:bg-gray-750/50 bg-transparent hover:bg-gray-50"
            }`}
          >
            <div
              className={`absolute inset-0 ${creationMode === "ai" ? "border-t-4 border-purple-500 dark:border-purple-400 sm:border-l-4 sm:border-t-0" : "border-transparent"}`}
            ></div>
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${
                creationMode === "ai"
                  ? "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              <Sparkles className='h-6 w-6' />
            </div>
            <h3
              className={`mb-2 text-lg font-semibold ${
                creationMode === "ai"
                  ? "text-purple-800 dark:text-purple-300"
                  : "text-gray-800 dark:text-gray-300"
              }`}
            >
              AI-Powered Creation
            </h3>
            <p
              className={`w-full text-left text-sm ${
                creationMode === "ai"
                  ? "text-purple-700 dark:text-purple-200"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Let AI generate a complete survey based on your description.
            </p>

            {creationMode === "ai" && (
              <div className='mt-4 flex items-center text-sm font-medium text-purple-600 dark:text-purple-300'>
                Selected <ArrowRight className='ml-1 h-4 w-4' />
              </div>
            )}
          </button>

          <button
            onClick={() => setCreationMode("manual")}
            className={`group relative flex flex-col items-start p-6 text-left transition-all duration-200 sm:p-8 ${
              creationMode === "manual"
                ? "bg-blue-50/80 dark:bg-blue-950/30"
                : "dark:hover:bg-gray-750/50 bg-transparent hover:bg-gray-50"
            }`}
          >
            <div
              className={`absolute inset-0 ${creationMode === "manual" ? "border-t-4 border-blue-500 dark:border-blue-400 sm:border-l-4 sm:border-t-0" : "border-transparent"}`}
            ></div>
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${
                creationMode === "manual"
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              <LayoutTemplate className='h-6 w-6' />
            </div>
            <h3
              className={`mb-2 text-lg font-semibold ${
                creationMode === "manual"
                  ? "text-blue-800 dark:text-blue-300"
                  : "text-gray-800 dark:text-gray-300"
              }`}
            >
              Manual Creation
            </h3>
            <p
              className={`w-full text-left text-sm ${
                creationMode === "manual"
                  ? "text-blue-700 dark:text-blue-200"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Design your survey from scratch with full control over questions
              and layout.
            </p>

            {creationMode === "manual" && (
              <div className='mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-300'>
                Selected <ArrowRight className='ml-1 h-4 w-4' />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Create form - Manual Mode */}
      {creationMode === "manual" && (
        <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
          <div className='p-6 sm:p-8'>
            <h2 className='mb-6 flex items-center text-xl font-semibold text-gray-900 dark:text-white'>
              <LayoutTemplate className='mr-2 h-5 w-5 text-purple-500 dark:text-purple-400' />
              Create Survey Manually
            </h2>

            <form onSubmit={handleManualSubmit}>
              <div className='mb-6'>
                <label
                  htmlFor='title'
                  className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Survey Title <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  id='title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className='w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='Enter survey title'
                  required
                />
              </div>

              <div className='mb-6'>
                <label
                  htmlFor='description'
                  className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Description (optional)
                </label>
                <textarea
                  id='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className='w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='Enter survey description'
                ></textarea>
                <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                  Add context about your survey's purpose to guide respondents.
                </p>
              </div>

              <div className='flex flex-col justify-end gap-3 pt-2 sm:flex-row'>
                <Link
                  href='/dashboard'
                  className='inline-flex items-center justify-center rounded-lg border border-transparent bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                >
                  Cancel
                </Link>
                <button
                  type='submit'
                  disabled={createMutation.isPending}
                  className='inline-flex items-center justify-center rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create form - AI Mode */}
      {creationMode === "ai" && (
        <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
          <div className='p-6 sm:p-8'>
            <h2 className='mb-6 flex items-center text-xl font-semibold text-gray-900 dark:text-white'>
              <Sparkles className='mr-2 h-5 w-5 text-purple-500 dark:text-purple-400' />
              Generate Survey with AI
            </h2>

            <div className='mb-6 flex items-start rounded-lg border border-purple-100 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20'>
              <Lightbulb className='mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-purple-500 dark:text-purple-400' />
              <div>
                <h3 className='mb-1 text-sm font-medium text-purple-800 dark:text-purple-300'>
                  Let AI Design Your Survey
                </h3>
                <p className='text-sm text-purple-700 dark:text-purple-200'>
                  Describe the survey you want to create in detail, and our AI
                  will generate a complete multi-page survey with relevant
                  questions. You can edit the generated survey afterward.
                </p>
                <p className='mt-1 text-sm text-purple-700 dark:text-purple-200'>
                  <strong>Example:</strong> "Create a customer feedback survey
                  for a coffee shop that asks about service quality, product
                  satisfaction, and suggestions for improvement."
                </p>
              </div>
            </div>

            <form onSubmit={handleAiSubmit}>
              <div className='mb-6'>
                <label
                  htmlFor='title'
                  className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Survey Title (optional)
                </label>
                <input
                  type='text'
                  id='title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className='w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='Enter survey title (or let AI generate one)'
                />
                <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                  Leave blank to use AI-generated title
                </p>
              </div>

              <div className='mb-6'>
                <label
                  htmlFor='description'
                  className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Description (optional)
                </label>
                <textarea
                  id='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className='w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='Enter survey description (or let AI generate one)'
                ></textarea>
                <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                  Leave blank to use AI-generated description
                </p>
              </div>

              <div className='mb-6'>
                <label
                  htmlFor='aiPrompt'
                  className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Describe Your Survey <span className='text-red-500'>*</span>
                </label>
                <textarea
                  id='aiPrompt'
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={6}
                  className='w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='Describe the survey you want to create in detail...'
                  required
                ></textarea>
                <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                  The more details you provide, the better the AI-generated
                  survey will be.
                </p>
              </div>

              {aiGenerationError && (
                <div className='mb-6 flex items-start rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20'>
                  <AlertCircle className='mr-2 h-5 w-5 flex-shrink-0 text-red-500' />
                  <div>
                    <h3 className='text-sm font-medium text-red-800 dark:text-red-300'>
                      Error
                    </h3>
                    <p className='text-sm text-red-700 dark:text-red-200'>
                      {aiGenerationError}
                    </p>
                  </div>
                </div>
              )}

              <div className='flex flex-col justify-end gap-3 pt-2 sm:flex-row'>
                <Link
                  href='/dashboard'
                  className='inline-flex items-center justify-center rounded-lg border border-transparent bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                >
                  Cancel
                </Link>
                <button
                  type='submit'
                  disabled={isGenerating || generateMutation.isPending}
                  className='inline-flex items-center justify-center rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {isGenerating || generateMutation.isPending ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className='mr-2 h-4 w-4' />
                      Generate with AI
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
