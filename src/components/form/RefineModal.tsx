"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Loader2, Sparkles, X, Save, Edit } from "lucide-react";
import { DiffEditor } from "@monaco-editor/react";
import { api } from "@/lib/trpc/react";
import type { JsonValue } from "@prisma/client/runtime/library";

interface RefineFormModalProps {
  formId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedData?: JsonValue) => void;
}

export function RefineFormModal({
  formId,
  isOpen,
  onClose,
  onSuccess,
}: RefineFormModalProps) {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalStructure, setOriginalStructure] = useState<JsonValue | null>(
    null,
  );
  const [editorValue, setEditorValue] = useState<string>("");
  const [aiPromptOpen, setAiPromptOpen] = useState(false);

  const editorRef = useRef<any>(null);

  // Get current user credits
  const { data: userData } = api.user.getCredits.useQuery();
  const hasCredits = userData?.credits && userData.credits > 0;

  // Get current form data
  const { data: formData } = api.form.getById.useQuery(
    { id: formId },
    {
      enabled: !!formId,
    },
  );

  // Set the original structure when form data is loaded
  useEffect(() => {
    if (formData && !originalStructure) {
      setOriginalStructure(formData.data);
      if (formData.data) {
        setEditorValue(JSON.stringify(formData.data, null, 2));
      }
    }
  }, [formData, originalStructure]);

  // Mutation for getting form refinement preview
  const previewRefinementMutation = api.form.previewRefinement.useMutation({
    onSuccess: (data) => {
      setIsSubmitting(false);
      setEditorValue(JSON.stringify(data.structure, null, 2));
      setAiPromptOpen(false);
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast.error(`Error generating preview: ${error.message}`);
    },
  });

  // Mutation for applying form refinement
  const applyRefinementMutation = api.form.applyRefinement.useMutation({
    onSuccess: () => {
      try {
        // Parse the editor value
        const parsedValue = JSON.parse(editorValue);

        setIsSubmitting(false);
        toast.success("Form changes saved successfully!");
        onSuccess(parsedValue);
        onClose();
      } catch (error) {
        console.error("Error parsing JSON:", error);
        toast.error("Error saving changes");
        setIsSubmitting(false);
      }
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast.error(`Error saving changes: ${error.message}`);
    },
  });

  const handleAIRefine = async (e: React.FormEvent) => {
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

    previewRefinementMutation.mutate({
      id: formId,
      prompt: prompt.trim(),
    });
  };

  const handleOpenAIPrompt = () => {
    setAiPromptOpen(true);
  };

  const handleSaveChanges = () => {
    if (!editorValue.trim()) {
      toast.error("Cannot save empty content");
      return;
    }

    try {
      // Parse the editor value to validate it's proper JSON
      const parsedValue = JSON.parse(editorValue);
      setIsSubmitting(true);

      applyRefinementMutation.mutate({
        id: formId,
        structure: parsedValue,
      });
    } catch (error) {
      toast.error("Invalid JSON format. Please fix the errors before saving.");
      console.error("JSON parse error:", error);
    }
  };

  const handleEditorDidMount = (editor: any) => {
    try {
      editorRef.current = editor;

      if (editor && typeof editor.getModifiedEditor === "function") {
        const modifiedEditor = editor.getModifiedEditor();

        if (modifiedEditor) {
          modifiedEditor.onDidChangeModelContent(() => {
            try {
              const value = modifiedEditor.getValue();
              setEditorValue(value);
            } catch (e) {
              console.warn("Error getting editor value:", e);
            }
          });
        }
      }
    } catch (error) {
      console.error("Error mounting editor:", error);
    }
  };

  if (!isOpen) return null;

  // Check for dark mode
  const isDarkMode =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8'>
      <div className='relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800'>
        {/* Header */}
        <div className='flex items-center justify-between bg-gray-100 px-4 py-3 dark:bg-gray-700'>
          <div className='flex items-center'>
            <Edit className='mr-2 h-5 w-5 text-blue-500' />
            <h3 className='font-medium text-gray-900 dark:text-white'>
              Edit Form JSON
            </h3>
          </div>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            disabled={isSubmitting}
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Content */}
        <div className='p-4'>
          <div className='space-y-4'>
            <div className='h-[50vh] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 sm:h-[60vh] md:h-[500px]'>
              <DiffEditor
                height='100%'
                language='json'
                original={
                  originalStructure
                    ? JSON.stringify(originalStructure, null, 2)
                    : ""
                }
                modified={editorValue}
                theme={isDarkMode ? "vs-dark" : "light"}
                options={{
                  readOnly: false,
                  originalEditable: false,
                  minimap: { enabled: false },
                  renderSideBySide: true,
                  renderOverviewRuler: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: "on",
                  scrollbar: {
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10,
                    alwaysConsumeMouseWheel: false,
                  },
                }}
                onMount={handleEditorDidMount}
                loading={
                  <div className='p-4 text-center'>Loading editor...</div>
                }
              />
            </div>

            <div className='text-sm text-gray-600 dark:text-gray-400'>
              <p>
                Edit the JSON on the right side. The left side shows the
                original structure for reference.
              </p>
            </div>
          </div>

          {aiPromptOpen && (
            <div className='fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4 sm:p-6 md:p-8'>
              <div className='relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-gray-800'>
                <div className='flex items-center justify-between bg-gray-100 px-4 py-3 dark:bg-gray-700'>
                  <div className='flex items-center'>
                    <Sparkles className='mr-2 h-5 w-5 text-purple-500' />
                    <h3 className='font-medium text-gray-900 dark:text-white'>
                      AI Refinement
                    </h3>
                  </div>
                  <button
                    onClick={() => setAiPromptOpen(false)}
                    className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  >
                    <X className='h-5 w-5' />
                  </button>
                </div>

                <div className='p-4'>
                  <form onSubmit={handleAIRefine}>
                    <div className='mb-4'>
                      <label
                        htmlFor='prompt'
                        className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
                      >
                        How would you like to improve your form?
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
                        <Sparkles className='mr-1 inline-block h-4 w-4' /> This
                        will use 1 AI credit and suggest changes based on your
                        instructions.
                      </p>
                    </div>

                    <div className='mb-4 text-sm text-gray-500 dark:text-gray-400'>
                      {userData?.credits !== undefined
                        ? `Available credits: ${userData.credits}`
                        : "Loading credits..."}
                    </div>

                    <div className='flex flex-col justify-end space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0'>
                      <button
                        type='button'
                        className='w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 sm:w-auto'
                        onClick={() => setAiPromptOpen(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        className='flex w-full items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 dark:bg-purple-500 dark:hover:bg-purple-600 sm:w-auto'
                        disabled={isSubmitting || !hasCredits || !prompt.trim()}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />{" "}
                            Processing...
                          </>
                        ) : (
                          <>
                            <Sparkles className='mr-2 h-4 w-4' /> Generate
                            Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='flex flex-col items-center justify-between bg-gray-50 px-4 py-3 dark:bg-gray-700 sm:flex-row'>
          <div className='mb-3 w-full sm:mb-0 sm:w-auto'>
            {hasCredits && (
              <button
                onClick={handleOpenAIPrompt}
                className='inline-flex w-full items-center justify-center rounded bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 sm:w-auto'
              >
                <Sparkles className='mr-1 h-4 w-4' />
                AI Assist
              </button>
            )}
          </div>
          <div className='flex w-full flex-col justify-end space-y-3 sm:w-auto sm:flex-row sm:space-x-3 sm:space-y-0'>
            <button
              type='button'
              className='w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 sm:w-auto'
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type='button'
              className='flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-600 sm:w-auto'
              onClick={handleSaveChanges}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Saving...
                </>
              ) : (
                <>
                  <Save className='mr-2 h-4 w-4' /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
