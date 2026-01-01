"use client";

import React, { useState, useMemo } from "react";
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
import { examplePrompts } from "@/lib/constants/example-prompts";

export default function CreateFormPage() {
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
  const createMutation = api.form.create.useMutation({
    onSuccess: (data) => {
      toast.success("Form created successfully");
      router.push(`/forms/${data.id}/edit`);
    },
    onError: (error) => {
      toast.error(`Error creating form: ${error.message}`);
    },
  });

  // AI generation mutation
  const generateMutation = api.form.generateWithAI.useMutation({
    onSuccess: (data) => {
      toast.success("Form generated successfully with AI");
      // Invalidate the credits query to refresh the credit count
      utils.credits.getAICredits.invalidate();
      router.push(`/forms/${data.form.id}/edit`);
    },
    onError: (error) => {
      setAiGenerationError(error.message);
      toast.error(`Error generating form: ${error.message}`);
      setIsGenerating(false);
      // Also invalidate on error to show the refunded credit
      utils.credits.getAICredits.invalidate();
    },
  });

  // Randomly select 4 example prompts
  const [examplePromptsSeed, setExamplePromptsSeed] = useState(0);
  const examplePromptsList = useMemo(() => {
    const allPrompts = [...examplePrompts.forms, ...examplePrompts.content];
    const shuffled = [...allPrompts].sort(() => {
      // Use the seed to generate different but consistent random orders
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
    <div className='mx-auto max-w-5xl px-6 py-12'>
      {/* Header */}
      <div className='mb-12'>
        <Link
          href='/dashboard'
          className='mb-6 inline-flex items-center text-sm font-semibold text-muted-foreground transition-colors hover:text-primary'
        >
          <ChevronLeft className='mr-1 h-4 w-4' />
          Back to Dashboard
        </Link>
        <h1 className='text-3xl font-bold tracking-tight'>
          Create New Form
        </h1>
        <p className='mt-3 max-w-2xl text-sm font-medium text-muted-foreground leading-relaxed'>
          Choose your preferred method of creation. Build from scratch for full control, or use AI to generate a complete structure in seconds.
        </p>
      </div>

      {/* Creation mode toggle */}
      <div className='mb-12 rounded-3xl border border-border bg-background p-2 shadow-sm'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
          <button
            onClick={() => setCreationMode("ai")}
            className={`group relative flex flex-col items-start p-8 text-left transition-all rounded-2xl ${
              creationMode === "ai"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-transparent hover:bg-muted"
            }`}
          >
            <div
              className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl border-2 transition-all ${
                creationMode === "ai"
                  ? "border-primary-foreground bg-primary-foreground/10 text-primary-foreground"
                  : "border-border bg-muted text-muted-foreground"
              }`}
            >
              <Sparkles className='h-7 w-7' />
            </div>
            <h3
              className='mb-2 text-xl font-bold tracking-tight'
            >
              AI Generation
            </h3>
            <p
              className={`text-sm font-medium leading-relaxed ${
                creationMode === "ai"
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground"
              }`}
            >
              Describe your needs and let AI build a fully functional form for you.
            </p>

            {creationMode === "ai" && (
              <div className='mt-6 flex items-center text-xs font-bold uppercase tracking-widest'>
                Selected <ArrowRight className='ml-2 h-4 w-4' />
              </div>
            )}
          </button>

          <button
            onClick={() => setCreationMode("manual")}
            className={`group relative flex flex-col items-start p-8 text-left transition-all rounded-2xl ${
              creationMode === "manual"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-transparent hover:bg-muted"
            }`}
          >
            <div
              className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl border-2 transition-all ${
                creationMode === "manual"
                  ? "border-primary-foreground bg-primary-foreground/10 text-primary-foreground"
                  : "border-border bg-muted text-muted-foreground"
              }`}
            >
              <LayoutTemplate className='h-7 w-7' />
            </div>
            <h3
              className='mb-2 text-xl font-bold tracking-tight'
            >
              Manual Build
            </h3>
            <p
              className={`text-sm font-medium leading-relaxed ${
                creationMode === "manual"
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground"
              }`}
            >
              Start from scratch and design every aspect of your form manually.
            </p>

            {creationMode === "manual" && (
              <div className='mt-6 flex items-center text-xs font-bold uppercase tracking-widest'>
                Selected <ArrowRight className='ml-2 h-4 w-4' />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Create form - Manual Mode */}
      {creationMode === "manual" && (
        <div className='rounded-3xl border border-border bg-background shadow-sm'>
          <div className='p-8'>
            <h2 className='mb-8 flex items-center text-2xl font-bold tracking-tight text-foreground'>
              <LayoutTemplate className='mr-4 h-7 w-7 text-primary' />
              Form Details
            </h2>

            <form onSubmit={handleManualSubmit}>
              <div className='mb-8'>
                <label
                  htmlFor='title'
                  className='mb-3 block text-sm font-semibold text-foreground'
                >
                  Form Title <span className='text-primary'>*</span>
                </label>
                <input
                  type='text'
                  id='title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className='w-full rounded-2xl border border-border bg-background px-4 py-4 text-base font-medium placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10'
                  placeholder='E.g., Customer Feedback Survey'
                  required
                />
              </div>

              <div className='mb-10'>
                <label
                  htmlFor='description'
                  className='mb-3 block text-sm font-semibold text-foreground'
                >
                  Description <span className='text-muted-foreground'>(Optional)</span>
                </label>
                <textarea
                  id='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className='w-full rounded-2xl border border-border bg-background px-4 py-4 text-base font-medium placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10'
                  placeholder='Describe the purpose of this form...'
                ></textarea>
                <p className='mt-3 text-xs font-medium text-muted-foreground'>
                  Provide context to help your respondents understand the form's objective.
                </p>
              </div>

              <div className='flex flex-col justify-end gap-4 pt-4 sm:flex-row'>
                <Link
                  href='/dashboard'
                  className='inline-flex items-center justify-center rounded-xl bg-secondary px-8 py-3.5 text-sm font-bold text-secondary-foreground transition-all hover:bg-secondary-hover'
                >
                  Cancel
                </Link>
                <button
                  type='submit'
                  disabled={createMutation.isPending}
                  className='inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Creating...
                    </>
                  ) : (
                    "Create Form"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create form - AI Mode */}
      {creationMode === "ai" && (
        <div className='rounded-3xl border border-border bg-background shadow-sm'>
          <div className='p-8'>
            <h2 className='mb-8 flex items-center text-2xl font-bold tracking-tight text-foreground'>
              <Sparkles className='mr-4 h-7 w-7 text-primary' />
              AI Form Generation
            </h2>

            <div className='mb-10 rounded-2xl border border-primary/10 bg-primary/[0.03] p-6'>
              <div className='flex items-start'>
                <Lightbulb className='mr-4 mt-1 h-6 w-6 flex-shrink-0 text-primary' />
                <div className='w-full'>
                  <h3 className='mb-2 text-base font-bold tracking-tight text-foreground'>
                    How it works
                  </h3>
                  <p className='mb-8 text-sm font-medium text-muted-foreground leading-relaxed'>
                    Describe the form you need in plain English. Our AI will automatically design the questions, pages, and structure for you. You can review and refine the results at any time.
                  </p>
                  
                  <div className='mb-4 flex items-center justify-between'>
                    <p className='text-xs font-bold uppercase tracking-wider text-foreground'>
                      Example Prompts
                    </p>
                    <button
                      onClick={handleRefreshExamples}
                      className='inline-flex items-center rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition-all'
                    >
                      <ArrowRight className='mr-1.5 h-3 w-3' />
                      Refresh Examples
                    </button>
                  </div>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    {examplePromptsList.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => setAiPrompt(prompt.prompt)}
                        className='group flex flex-col rounded-xl border border-border bg-background transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5'
                      >
                        <div className='border-b border-border bg-muted/30 p-3 flex items-center justify-between gap-2'>
                          <span className='rounded-md border border-border bg-background px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground'>
                            {prompt.type}
                          </span>
                          <span className='text-[9px] font-bold text-primary uppercase'>
                            {prompt.pages} {prompt.pages === 1 ? 'Page' : 'Pages'}
                          </span>
                        </div>
                        <div className='flex flex-1 flex-col p-3 text-left'>
                          <p className='line-clamp-3 text-xs font-semibold leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground'>
                            {prompt.description}
                          </p>
                          <div className='mt-3 flex items-center justify-end text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 transition-opacity group-hover:opacity-100'>
                            Use Prompt <ArrowRight className='ml-1.5 h-3 w-3' />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleAiSubmit}>
              <div className='mb-8'>
                <label
                  htmlFor='title'
                  className='mb-3 block text-sm font-semibold text-foreground'
                >
                  Form Title <span className='text-muted-foreground'>(Optional)</span>
                </label>
                <input
                  type='text'
                  id='title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className='w-full rounded-2xl border border-border bg-background px-4 py-4 text-base font-medium placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10'
                  placeholder='Leave blank for AI-generated title...'
                />
              </div>

              <div className='mb-8'>
                <label
                  htmlFor='aiPrompt'
                  className='mb-3 block text-sm font-semibold text-foreground'
                >
                  Generation Prompt <span className='text-primary'>*</span>
                </label>
                <textarea
                  id='aiPrompt'
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={6}
                  className='w-full rounded-2xl border border-border bg-background px-4 py-4 text-base font-medium placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10'
                  placeholder='E.g., A multi-page survey for a coffee shop to collect feedback on drink quality and service...'
                  required
                ></textarea>
                <p className='mt-3 text-xs font-medium text-muted-foreground'>
                  Be as specific as possible to get the best results from the AI.
                </p>
              </div>

              {aiGenerationError && (
                <div className='mb-8 flex items-start rounded-2xl border border-destructive/20 bg-destructive/[0.03] p-4'>
                  <AlertCircle className='mr-3 h-5 w-5 flex-shrink-0 text-destructive' />
                  <div>
                    <h3 className='text-sm font-bold text-destructive'>
                      Generation Failed
                    </h3>
                    <p className='text-xs font-medium text-destructive/80'>
                      {aiGenerationError}
                    </p>
                  </div>
                </div>
              )}

              <div className='flex flex-col justify-end gap-4 pt-4 sm:flex-row'>
                <Link
                  href='/dashboard'
                  className='inline-flex items-center justify-center rounded-xl bg-secondary px-8 py-3.5 text-sm font-bold text-secondary-foreground transition-all hover:bg-secondary-hover'
                >
                  Cancel
                </Link>
                <button
                  type='submit'
                  disabled={isGenerating || generateMutation.isPending}
                  className='inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {isGenerating || generateMutation.isPending ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className='mr-2 h-4 w-4' />
                      Generate Form
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
