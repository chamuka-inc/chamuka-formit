"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const isMobileScreen = useWindowSize();

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

  // Create a custom close handler that cleans up before closing
  const handleClose = () => {
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

  // Check for dark mode
  const isDarkMode =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-2 sm:p-4 md:p-6 lg:p-8'
      onScroll={handleContentScroll}
      onClick={handleClose}
    >
      <div
        className='relative max-h-[98vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800'
        onClick={handleContentClick}
      >
        {/* Header */}
        <div className='sticky top-0 z-10 flex items-center justify-between bg-gray-100 px-3 py-2.5 dark:bg-gray-700 sm:px-4 sm:py-3'>
          <div className='flex items-center'>
            <Edit className='mr-1.5 h-4 w-4 text-blue-500 sm:mr-2 sm:h-5 sm:w-5' />
            <h3 className='text-sm font-medium text-gray-900 dark:text-white sm:text-base'>
              Edit Form JSON
            </h3>
          </div>
          <button
            onClick={handleClose}
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            disabled={isSubmitting}
          >
            <X className='h-4 w-4 sm:h-5 sm:w-5' />
          </button>
        </div>

        {/* Content */}
        <div className='p-2 sm:p-4' onScroll={handleContentScroll}>
          <div className='space-y-3 sm:space-y-4'>
            <div
              className={`h-[60vh] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 ${
                isMobileScreen ? "sm:h-[65vh]" : "sm:h-[70vh]"
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
                    renderSideBySide: !isMobileScreen, // Stack on mobile
                    renderOverviewRuler: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    //wordWrap: "on",
                    scrollbar: {
                      verticalScrollbarSize: 10,
                      horizontalScrollbarSize: 10,
                      alwaysConsumeMouseWheel: false,
                    },
                    lineNumbers: !isMobileScreen ? "on" : "off", // Hide line numbers on mobile
                    folding: !isMobileScreen, // Disable code folding on mobile
                    fontSize: isMobileScreen ? 14 : 16, // Smaller font on mobile
                  }}
                  onMount={handleEditorDidMount}
                  loading={
                    <div className='p-4 text-center'>Loading editor...</div>
                  }
                />
              )}
            </div>

            <div className='space-y-2 text-xs text-gray-600 dark:text-gray-400 sm:text-sm'>
              <p>
                Edit the JSON{" "}
                {!isMobileScreen
                  ? "on the right side. The left side shows the original structure for reference."
                  : "below to modify your form structure."}
              </p>
              {isMobileScreen && (
                <p className='italic'>
                  Tip: Rotate your device to landscape mode for a better editing
                  experience.
                </p>
              )}
            </div>
          </div>

          {aiPromptOpen && (
            <div
              className='fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-2 sm:p-4 md:p-6'
              onScroll={handleContentScroll}
              onClick={() => setAiPromptOpen(false)}
            >
              <div
                className='relative max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-gray-800'
                onScroll={handleContentScroll}
                onClick={handleContentClick}
              >
                <div className='sticky top-0 z-10 flex items-center justify-between bg-gray-100 px-3 py-2.5 dark:bg-gray-700 sm:px-4 sm:py-3'>
                  <div className='flex items-center'>
                    <Sparkles className='mr-1.5 h-4 w-4 text-purple-500 sm:mr-2 sm:h-5 sm:w-5' />
                    <h3 className='text-sm font-medium text-gray-900 dark:text-white sm:text-base'>
                      AI Refinement
                    </h3>
                  </div>
                  <button
                    onClick={() => setAiPromptOpen(false)}
                    className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  >
                    <X className='h-4 w-4 sm:h-5 sm:w-5' />
                  </button>
                </div>

                <div className='p-3 sm:p-4'>
                  <form onSubmit={handleAIRefine}>
                    <div className='mb-3 sm:mb-4'>
                      <label
                        htmlFor='prompt'
                        className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm'
                      >
                        How would you like to improve your form?
                      </label>
                      <textarea
                        id='prompt'
                        rows={isMobileScreen ? 4 : 5}
                        className='w-full rounded-md border border-gray-300 px-2.5 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 sm:px-3 sm:text-sm'
                        placeholder='Example: Add more questions about demographic information, improve the wording of questions on page 2, add more options to multiple choice questions...'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isSubmitting}
                      ></textarea>
                    </div>

                    <div className='mb-3 rounded-md bg-blue-50 p-2.5 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 sm:mb-4 sm:p-3 sm:text-sm'>
                      <p>
                        <Sparkles className='mr-1 inline-block h-3.5 w-3.5 sm:h-4 sm:w-4' />{" "}
                        This will use 1 AI credit and suggest changes based on
                        your instructions.
                      </p>
                    </div>

                    <div className='mb-3 text-xs text-gray-500 dark:text-gray-400 sm:mb-4 sm:text-sm'>
                      {userData?.credits !== undefined
                        ? `Available credits: ${userData.credits}`
                        : "Loading credits..."}
                    </div>

                    <div className='flex flex-col justify-end space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0'>
                      <button
                        type='button'
                        className='w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 sm:w-auto sm:px-4 sm:py-2 sm:text-sm'
                        onClick={() => setAiPromptOpen(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        className='flex w-full items-center justify-center rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700 disabled:opacity-50 dark:bg-purple-500 dark:hover:bg-purple-600 sm:w-auto sm:px-4 sm:py-2 sm:text-sm'
                        disabled={isSubmitting || !hasCredits || !prompt.trim()}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className='mr-1 h-3.5 w-3.5 animate-spin sm:mr-1.5 sm:h-4 sm:w-4' />{" "}
                            Processing...
                          </>
                        ) : (
                          <>
                            <Sparkles className='mr-1 h-3.5 w-3.5 sm:mr-1.5 sm:h-4 sm:w-4' />{" "}
                            Generate Changes
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
        <div className='sticky bottom-0 flex flex-col items-center justify-between bg-gray-50 px-3 py-2.5 dark:bg-gray-700 sm:flex-row sm:px-4 sm:py-3'>
          <div className='mb-2 w-full sm:mb-0 sm:w-auto'>
            {hasCredits && (
              <button
                onClick={handleOpenAIPrompt}
                className='inline-flex w-full items-center justify-center rounded bg-purple-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 sm:w-auto sm:px-3 sm:text-sm'
              >
                <Sparkles className='mr-1 h-3.5 w-3.5 sm:mr-1.5 sm:h-4 sm:w-4' />
                AI Assist
              </button>
            )}
          </div>
          <div className='flex w-full flex-col justify-end space-y-2 sm:w-auto sm:flex-row sm:space-x-3 sm:space-y-0'>
            <button
              type='button'
              className='w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 sm:w-auto sm:px-4 sm:py-2 sm:text-sm'
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type='button'
              className='flex w-full items-center justify-center rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-600 sm:w-auto sm:px-4 sm:py-2 sm:text-sm'
              onClick={handleSaveChanges}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-1 h-3.5 w-3.5 animate-spin sm:mr-1.5 sm:h-4 sm:w-4' />{" "}
                  Saving...
                </>
              ) : (
                <>
                  <Save className='mr-1 h-3.5 w-3.5 sm:mr-1.5 sm:h-4 sm:w-4' />{" "}
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
