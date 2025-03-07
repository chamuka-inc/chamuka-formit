"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Loader2, Sparkles, X } from "lucide-react";
import { api } from "@/lib/trpc/react";

interface RefineSurveyModalProps {
  surveyId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback when refinement is successful
}

export function RefineSurveyModal({
  surveyId,
  isOpen,
  onClose,
  onSuccess,
}: RefineSurveyModalProps) {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current user credits
  const { data: userData } = api.user.getCredits.useQuery();
  const hasCredits = userData?.credits && userData.credits > 0;

  // Mutation for refining survey with AI
  const refineSurveyMutation = api.survey.refineWithAI.useMutation({
    onSuccess: () => {
      setIsSubmitting(false);
      toast.success("Survey refined successfully!");
      setPrompt("");
      onSuccess();
      onClose();
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast.error(`Error refining survey: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      toast.error("Please provide refinement instructions");
      return;
    }

    if (!hasCredits) {
      toast.error("You don't have enough credits for AI refinement");
      return;
    }

    setIsSubmitting(true);

    refineSurveyMutation.mutate({
      id: surveyId,
      prompt: prompt.trim(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800'>
        {/* Header */}
        <div className='flex items-center justify-between bg-gray-100 px-4 py-3 dark:bg-gray-700'>
          <div className='flex items-center'>
            <Sparkles className='mr-2 h-5 w-5 text-blue-500' />
            <h3 className='font-medium text-gray-900 dark:text-white'>
              Refine Survey with AI
            </h3>
          </div>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Content */}
        <div className='p-4'>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label
                htmlFor='prompt'
                className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                How would you like to improve your survey?
              </label>
              <textarea
                id='prompt'
                rows={5}
                className='w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500'
                placeholder='Example: Add more questions about demographic information, improve the wording of questions on page 2, add more options to multiple choice questions...'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isSubmitting}
              ></textarea>
            </div>

            <div className='mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'>
              <p>
                <Sparkles className='mr-1 inline-block h-4 w-4' /> This will use
                1 AI credit and modify your survey based on your instructions.
              </p>
            </div>

            <div className='text-sm text-gray-500 dark:text-gray-400'>
              {userData?.credits !== undefined
                ? `Available credits: ${userData.credits}`
                : "Loading credits..."}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className='flex justify-end space-x-3 bg-gray-50 px-4 py-3 dark:bg-gray-700'>
          <button
            type='button'
            className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type='button'
            className='flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600'
            onClick={handleSubmit}
            disabled={isSubmitting || !hasCredits || !prompt.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Refining...
              </>
            ) : (
              <>
                <Sparkles className='mr-2 h-4 w-4' /> Refine Survey
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
