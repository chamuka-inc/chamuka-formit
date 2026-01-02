"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { Loader2, Sparkles, X, Save, Edit, Eye, Code } from "lucide-react";
import { DiffEditor } from "@monaco-editor/react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { api } from "@/lib/trpc/react";
import type { JsonValue } from "@prisma/client/runtime/library";
import { formStructureSchema, type FormStructure } from "@/lib/zod/formSchemas";
import { StreamingFormPreview } from "./StreamingFormPreview";

interface RefineFormModalProps {
  formId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedData?: JsonValue) => void;
}

// Add custom hook for window size
function useWindowSize() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }

    // Set initial value
    checkMobile();

    // Add event listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

type ViewMode = "editor" | "preview";

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
  const [viewMode, setViewMode] = useState<ViewMode>("editor");
  const [isStreamingAI, setIsStreamingAI] = useState(false);

  const editorRef = useRef<any>(null);
  const isMobileScreen = useWindowSize();

  // tRPC utils for cache invalidation
  const utils = api.useUtils();

  // Streaming object hook for AI refinement
  const {
    object: streamedFormData,
    submit: submitStreamRefine,
    isLoading: isStreaming,
    error: streamError,
    stop: stopStreaming,
    clear: clearStreaming,
  } = useObject({
    api: "/api/ai/stream/refine",
    schema: formStructureSchema,
    onFinish: ({ object, error }) => {
      if (error) {
        toast.error(error.message || "An error occurred during refinement");
        setIsStreamingAI(false);
        return;
      }
      if (object) {
        // Update the editor with the completed streamed data
        setEditorValue(JSON.stringify(object, null, 2));
        setIsStreamingAI(false);
        setAiPromptOpen(false);
        // Deduct credit after successful streaming
        deductCreditMutation.mutate({ description: "AI form refinement" });
      }
    },
    onError: (error) => {
      toast.error(error.message || "An error occurred during refinement");
      setIsStreamingAI(false);
    },
  });

  // Mutation for deducting AI credit
  const deductCreditMutation = api.credits.deductAICredit.useMutation({
    onSuccess: () => {
      utils.credits.getAICredits.invalidate();
      utils.user.getCredits.invalidate();
    },
    onError: (error) => {
      console.error("Failed to deduct credit:", error);
    },
  });

  // Helper function to clean up the editor models
  const cleanupEditor = () => {
    if (!editorRef.current) return;

    try {
      // Simply clear our reference to the editor
      // Let Monaco handle its own internal cleanup
      const tempRef = editorRef.current;
      editorRef.current = null;

      // Set a small delay to ensure proper cleanup order in Monaco
      setTimeout(() => {
        try {
          // Some versions of Monaco may require this for proper cleanup
          if (tempRef && typeof tempRef.dispose === "function") {
            tempRef.dispose();
          }
        } catch (err) {
          // Ignore errors during delayed cleanup
        }
      }, 0);
    } catch (error) {
      console.error("Error cleaning up editor:", error);
    }
  };

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

  // Clean up editor when component unmounts or modal is closed
  useEffect(() => {
    // Nothing to do when modal opens
    if (isOpen) {
      return;
    }

    // Modal is closing, clean up the editor
    // No need to run cleanupEditor here as it will be called by handleClose
    // This is a fallback in case the modal is closed programmatically without handleClose
    if (editorRef.current) {
      cleanupEditor();
    }
  }, [isOpen]);

  // Separate useEffect for unmounting cleanup
  useEffect(() => {
    // Return cleanup function for component unmount
    return () => {
      if (editorRef.current) {
        cleanupEditor();
      }
    };
  }, []);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Save the current body overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Prevent body scroll
      document.body.style.overflow = "hidden";

      // Restore original style when modal closes
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Prevent scroll propagation
  const handleContentScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      e.stopPropagation();
    },
    [],
  );

  // Prevent event propagation
  const handleContentClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
    },
    [],
  );

  // Mutation for applying form refinement
  const applyRefinementMutation = api.form.applyRefinement.useMutation({
    onSuccess: () => {
      try {
        // Parse the editor value
        const parsedValue = JSON.parse(editorValue);

        setIsSubmitting(false);
        toast.success("Form changes saved successfully!");

        // Call onSuccess with the parsed value
        onSuccess(parsedValue);

        // Use the safe handleClose instead of direct cleanup + onClose
        handleClose();
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

  // Handle AI refinement with streaming
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

    // Get the current form data from the editor
    let existingData: FormStructure;
    try {
      existingData = JSON.parse(editorValue);
    } catch {
      toast.error(
        "Invalid JSON in editor. Please fix before using AI refinement.",
      );
      return;
    }

    setIsStreamingAI(true);
    clearStreaming();

    // Switch to preview mode to show streaming
    setViewMode("preview");

    // Submit to the streaming endpoint
    submitStreamRefine({
      existingData,
      prompt: prompt.trim(),
      formId,
    });
  };

  // Handle stopping the stream
  const handleStopStream = useCallback(() => {
    stopStreaming();
    setIsStreamingAI(false);
    // If we have partial data, update the editor
    if (streamedFormData) {
      setEditorValue(JSON.stringify(streamedFormData, null, 2));
    }
  }, [stopStreaming, streamedFormData]);

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

  // Create a custom close handler that cleans up before closing
  const handleClose = () => {
    // Stop streaming if active
    if (isStreaming) {
      stopStreaming();
    }

    // Prevent multiple calls to close
    if (!editorRef.current) {
      // Editor already cleaned up, just call onClose
      onClose();
      return;
    }

    // Clean up editor before closing the modal
    cleanupEditor();

    // Call the original onClose after a short delay
    // This gives Monaco time to clean up properly
    setTimeout(() => {
      onClose();
    }, 10);
  };

  // Parse editor value for preview
  const previewFormData = useCallback(() => {
    if (isStreamingAI && streamedFormData) {
      return streamedFormData;
    }
    try {
      return JSON.parse(editorValue) as FormStructure;
    } catch {
      return undefined;
    }
  }, [editorValue, isStreamingAI, streamedFormData]);

  // Check for dark mode
  const isDarkMode =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-overlay/50 p-2 sm:p-4 md:p-6 lg:p-8'
      onScroll={handleContentScroll}
      onClick={handleClose}
    >
      <div
        className='relative max-h-[98vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl'
        onClick={handleContentClick}
      >
        {/* Header */}
        <div className='sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary'>
              <Edit className='h-5 w-5 text-primary-foreground' />
            </div>
            <div>
              <h3 className='text-base font-bold text-foreground sm:text-lg'>
                Edit Form Structure
              </h3>
              <p className='text-xs text-muted-foreground sm:text-sm'>
                Modify your form JSON or use AI to refine it
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            {/* View Mode Toggle */}
            <div className='flex rounded-lg border border-border bg-muted/50 p-1'>
              <button
                onClick={() => setViewMode("editor")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === "editor"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Code className='h-3.5 w-3.5' />
                Editor
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === "preview"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className='h-3.5 w-3.5' />
                Preview
              </button>
            </div>
            <button
              onClick={handleClose}
              className='rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
              disabled={isSubmitting}
            >
              <X className='h-5 w-5' />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='p-4 sm:p-6' onScroll={handleContentScroll}>
          <div className='space-y-4'>
            {/* Editor View */}
            {viewMode === "editor" && (
              <>
                <div
                  className={`overflow-hidden rounded-xl border border-border ${
                    isMobileScreen ? "h-[50vh]" : "h-[60vh]"
                  } md:h-[500px]`}
                >
                  {isOpen && (
                    <DiffEditor
                      key={`diff-editor-${formId}`}
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
                        renderSideBySide: !isMobileScreen,
                        renderOverviewRuler: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        scrollbar: {
                          verticalScrollbarSize: 10,
                          horizontalScrollbarSize: 10,
                          alwaysConsumeMouseWheel: false,
                        },
                        lineNumbers: !isMobileScreen ? "on" : "off",
                        folding: !isMobileScreen,
                        fontSize: isMobileScreen ? 14 : 16,
                      }}
                      onMount={handleEditorDidMount}
                      loading={
                        <div className='flex h-full items-center justify-center'>
                          <Loader2 className='h-8 w-8 animate-spin text-primary' />
                        </div>
                      }
                    />
                  )}
                </div>

                <div className='rounded-xl border border-border/50 bg-muted/30 p-3 text-xs text-muted-foreground sm:text-sm'>
                  <p>
                    Edit the JSON{" "}
                    {!isMobileScreen
                      ? "on the right side. The left side shows the original structure for reference."
                      : "below to modify your form structure."}
                  </p>
                  {isMobileScreen && (
                    <p className='mt-1 italic'>
                      Tip: Rotate your device to landscape mode for a better
                      editing experience.
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Preview View */}
            {viewMode === "preview" && (
              <div
                className={`overflow-y-auto rounded-xl border border-border bg-muted/10 p-4 ${
                  isMobileScreen ? "h-[50vh]" : "h-[60vh]"
                } md:h-[500px]`}
              >
                <StreamingFormPreview
                  formData={
                    isStreamingAI ? streamedFormData : previewFormData()
                  }
                  isLoading={isStreamingAI}
                  error={streamError}
                />
              </div>
            )}
          </div>

          {/* AI Prompt Modal */}
          {aiPromptOpen && (
            <div
              className='fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-overlay/50 p-2 backdrop-blur-sm sm:p-4 md:p-6'
              onScroll={handleContentScroll}
              onClick={() => !isStreamingAI && setAiPromptOpen(false)}
            >
              <div
                className='relative max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl'
                onScroll={handleContentScroll}
                onClick={handleContentClick}
              >
                <div className='sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500'>
                      <Sparkles className='h-4 w-4 text-white' />
                    </div>
                    <h3 className='text-sm font-bold text-foreground sm:text-base'>
                      AI Refinement
                    </h3>
                  </div>
                  <button
                    onClick={() => !isStreamingAI && setAiPromptOpen(false)}
                    className='rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50'
                    disabled={isStreamingAI}
                  >
                    <X className='h-4 w-4 sm:h-5 sm:w-5' />
                  </button>
                </div>

                <div className='p-4 sm:p-6'>
                  <form onSubmit={handleAIRefine}>
                    <div className='mb-4'>
                      <label
                        htmlFor='prompt'
                        className='mb-2 block text-sm font-semibold text-foreground'
                      >
                        How would you like to improve your form?
                      </label>
                      <textarea
                        id='prompt'
                        rows={isMobileScreen ? 4 : 5}
                        className='w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10'
                        placeholder='Example: Add more questions about demographic information, improve the wording of questions on page 2, add more options to multiple choice questions...'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isStreamingAI}
                      ></textarea>
                    </div>

                    <div className='mb-4 rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800 dark:border-purple-900/50 dark:bg-purple-900/20 dark:text-purple-300'>
                      <p className='flex items-center gap-2'>
                        <Sparkles className='h-4 w-4' />
                        This will use 1 AI credit. Watch your form update in
                        real-time!
                      </p>
                    </div>

                    <div className='mb-4 text-sm text-muted-foreground'>
                      {userData?.credits !== undefined
                        ? `Available credits: ${userData.credits}`
                        : "Loading credits..."}
                    </div>

                    <div className='flex flex-col justify-end gap-3 sm:flex-row'>
                      <button
                        type='button'
                        className='rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary-hover disabled:opacity-50'
                        onClick={() => !isStreamingAI && setAiPromptOpen(false)}
                        disabled={isStreamingAI}
                      >
                        Cancel
                      </button>
                      {isStreamingAI ? (
                        <button
                          type='button'
                          onClick={handleStopStream}
                          className='flex items-center justify-center rounded-xl bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition-all hover:bg-destructive/90'
                        >
                          <X className='mr-2 h-4 w-4' />
                          Stop Generation
                        </button>
                      ) : (
                        <button
                          type='submit'
                          className='flex items-center justify-center rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-purple-700 disabled:opacity-50'
                          disabled={!hasCredits || !prompt.trim()}
                        >
                          <Sparkles className='mr-2 h-4 w-4' />
                          Generate Changes
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='sticky bottom-0 flex flex-col items-center justify-between gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-sm sm:flex-row sm:px-6 sm:py-4'>
          <div className='flex w-full items-center gap-2 sm:w-auto'>
            {hasCredits && (
              <button
                onClick={handleOpenAIPrompt}
                disabled={isStreamingAI}
                className='inline-flex w-full items-center justify-center rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-purple-700 disabled:opacity-50 sm:w-auto'
              >
                <Sparkles className='mr-2 h-4 w-4' />
                AI Assist
              </button>
            )}
            {isStreamingAI && (
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 animate-pulse rounded-full bg-purple-500' />
                <span className='text-xs font-medium text-muted-foreground'>
                  Streaming...
                </span>
              </div>
            )}
          </div>
          <div className='flex w-full flex-col justify-end gap-3 sm:w-auto sm:flex-row'>
            <button
              type='button'
              className='rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary-hover'
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type='button'
              className='flex items-center justify-center rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-700 disabled:opacity-50'
              onClick={handleSaveChanges}
              disabled={isSubmitting || isStreamingAI}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                <>
                  <Save className='mr-2 h-4 w-4' />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
