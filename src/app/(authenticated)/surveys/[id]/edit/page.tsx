"use client";

import React, { useEffect, useState, Fragment } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Loader2,
  Pencil,
  Save,
  Share,
  CheckCircle,
  X,
  ExternalLink,
  FileText,
  Sparkles,
  Edit,
} from "lucide-react";
import { api } from "@/lib/trpc/react";
import { SurveyBuilder } from "@/components/survey/SurveyBuilder";
import { SurveyShareModal } from "@/components/survey/SurveyShareModal";
import { RefineSurveyModal } from "@/components/survey/RefineSurveyModal";

export default function EditSurveyPage() {
  // Use useParams hook to get the id
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  // State for UI
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [refineModalOpen, setRefineModalOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Fetch survey data
  const {
    data: survey,
    isLoading,
    error,
    refetch,
  } = api.survey.getById.useQuery(
    { id },
    {
      retry: 3,
      retryDelay: 1000,
    },
  );

  // Handle query error
  useEffect(() => {
    if (error) {
      console.error("Error fetching survey:", error);
      toast.error("Error loading survey: " + error.message);
    }
  }, [error]);

  // Set title and description from survey data
  useEffect(() => {
    if (survey) {
      setTitle(survey.title || "Untitled Survey");
      setDescription(survey.description || "");
    }
  }, [survey]);

  // Make sure any time survey changes, we update the local state with the latest data
  useEffect(() => {
    if (survey?.data && typeof survey.data === "object") {
      const data = survey.data as any;
      if (Array.isArray(data.pages) && data.pages.length > 0) {
        // We already have the data loaded from surveyPages/pagesForBuilder,
        // this just ensures reactivity if the survey data changes
      }
    }
  }, [survey]);

  // Update survey details mutation
  const updateSurveyMutation = api.survey.update.useMutation({
    onSuccess: () => {
      setLastSaved(new Date());
      setIsSaving(false);
      setIsEditingTitle(false);
      refetch();
    },
    onError: (err) => {
      setIsSaving(false);
      toast.error("Error updating survey: " + err.message);
    },
  });

  // Publish survey mutation
  const publishSurveyMutation = api.survey.update.useMutation({
    onSuccess: () => {
      setIsPublishing(false);
      setPublishModalOpen(true);
      toast.success("Survey published successfully");
      refetch();
    },
    onError: (error) => {
      setIsPublishing(false);
      toast.error(`Error publishing survey: ${error.message}`);
    },
  });

  // Handle updating the survey title and description
  const handleUpdateSurveyDetails = () => {
    if (!title.trim()) {
      toast.error("Survey title is required");
      return;
    }

    setIsSaving(true);
    updateSurveyMutation.mutate({
      id,
      title,
      description: description || undefined,
    });
  };

  // Save the survey
  const handleSaveSurvey = () => {
    if (!id) {
      toast.error("Cannot save: No survey ID");
      return;
    }

    setIsSaving(true);

    // Call the API to update the survey (just save current title/description)
    updateSurveyMutation.mutate({
      id,
      title,
      description: description || undefined,
    });
  };

  // Handle publishing the survey
  const handlePublishSurvey = () => {
    if (!survey) {
      toast.error("Cannot publish: Survey data not loaded");
      return;
    }

    setIsPublishing(true);

    // Prepare the survey data with published status
    publishSurveyMutation.mutate({
      id,
      title: survey.title,
      status: "published",
    });
  };

  // Handle closing the publish success modal
  const handleClosePublishModal = () => {
    setPublishModalOpen(false);
  };

  // View the published survey
  const handleViewPublishedSurvey = () => {
    if (survey?.publicShareToken) {
      window.open(`/s/${survey.publicShareToken}`, "_blank");
    } else {
      toast.error("Public link not available");
    }
  };

  // Open the share modal
  const handleOpenShareModal = () => {
    if (survey?.status !== "published") {
      toast.info("You need to publish your survey before sharing it");
      return;
    }
    setShareModalOpen(true);
  };

  // Go back to dashboard
  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  // Open the refine survey modal
  const handleOpenRefineModal = () => {
    setRefineModalOpen(true);
  };

  // Handle successful refinement
  const handleRefinementSuccess = (updatedData?: any) => {
    // If we received updated data, use it to update the UI
    if (updatedData && typeof updatedData === "object") {
      // Update survey data override for the builder
      setSurveyDataOverride(updatedData);

      // Trigger re-render of the builder
      setSurveyKey((prev) => prev + 1);
    }

    // Refetch the latest data from the server
    refetch();

    toast.success("Survey updated successfully!");
  };

  // For forcing re-render of the SurveyBuilder
  const [surveyKey, setSurveyKey] = useState(0);
  const [surveyDataOverride, setSurveyDataOverride] = useState<any>(null);

  // Loading state
  if (isLoading) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center'>
        <Loader2 className='mb-4 h-12 w-12 animate-spin text-blue-500' />
        <h2 className='text-xl font-medium'>Loading survey...</h2>
      </div>
    );
  }

  // Map survey data to the format expected by SurveyBuilder
  const surveyData =
    surveyDataOverride ||
    (survey?.data
      ? typeof survey.data === "object"
        ? (survey.data as any)
        : { pages: [] }
      : { pages: [] });
  const surveyPages = Array.isArray(surveyData.pages) ? surveyData.pages : [];

  // If we have no pages but have a survey, create a default page
  const pagesForBuilder =
    surveyPages.length > 0
      ? surveyPages
      : [
          {
            title: "Welcome Page",
            questions: [
              {
                id: `q-${Math.random().toString(36).substr(2, 9)}`,
                type: "text" as const,
                text: "What would you like to know?",
                required: true,
                options: [],
                contextElements: [],
              },
            ],
            contextElements: [
              {
                type: "paragraph" as const,
                content:
                  "Welcome to our survey! Please answer the following questions.",
              },
            ],
          },
        ];

  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
      {/* Unified Header */}
      <div className='relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500'>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className='relative z-10 w-full px-3 py-4 sm:px-6 sm:py-5 lg:px-8'>
          <div className='mx-auto flex max-w-[1600px] flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4'>
            <div className='flex items-center gap-2'>
              <Link
                href='/dashboard'
                className='rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white'
              >
                <ArrowLeft className='h-5 w-5' />
              </Link>

              {isEditingTitle ? (
                <div className='flex w-full flex-1 flex-col gap-2 sm:w-auto'>
                  <input
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className='rounded border border-white/30 bg-white/10 px-3 py-1.5 text-base font-semibold text-white focus:outline-none focus:ring-2 focus:ring-white/50'
                    placeholder='Enter survey title'
                    autoFocus
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='rounded border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50'
                    placeholder='Enter description (optional)'
                    rows={2}
                  />
                  <div className='mt-1 flex gap-2'>
                    <button
                      onClick={handleUpdateSurveyDetails}
                      className='flex w-[80px] items-center justify-center rounded bg-white px-3 py-1 text-xs text-blue-600 hover:bg-white/90'
                      disabled={updateSurveyMutation.isPending}
                    >
                      <span className='whitespace-nowrap'>
                        {updateSurveyMutation.isPending ? "Saving..." : "Save"}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingTitle(false);
                        setTitle(survey?.title || "Untitled Survey");
                        setDescription(survey?.description || "");
                      }}
                      className='rounded bg-white/20 px-3 py-1 text-xs text-white hover:bg-white/30'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className='flex-1 overflow-hidden'>
                  <div className='flex items-center gap-2'>
                    <h1 className='truncate text-lg font-semibold text-white sm:text-xl'>
                      {survey?.title || "Untitled Survey"}
                    </h1>
                    <button
                      onClick={() => setIsEditingTitle(true)}
                      className='flex-shrink-0 rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white'
                      title='Edit survey details'
                    >
                      <Pencil className='h-4 w-4' />
                    </button>
                  </div>
                  {survey?.description && (
                    <p className='mt-1 line-clamp-1 text-xs text-white/80 sm:text-sm'>
                      {survey.description}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className='mt-2 flex flex-wrap items-center gap-2 md:mt-0 md:gap-3'>
              {lastSaved && (
                <span className='hidden text-xs text-white/70 md:inline-flex'>
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}

              <div className='flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap'>
                <span className='flex items-center rounded-md border border-white/10 bg-white/20 px-2 py-1.5 text-xs font-medium text-white/90 sm:px-3'>
                  <FileText className='mr-1 h-3.5 w-3.5 opacity-80 sm:mr-1.5' />
                  {surveyPages.length} page{surveyPages.length !== 1 ? "s" : ""}
                </span>

                {/* Add the Refine with AI button here */}
                <button
                  onClick={handleOpenRefineModal}
                  className='flex flex-grow items-center justify-center rounded-md bg-white/20 px-2 py-1.5 text-sm font-medium text-white hover:bg-white/30 sm:flex-grow-0 sm:px-3'
                  title='Edit survey JSON'
                >
                  <Edit className='mr-1 h-4 w-4 text-blue-300 sm:mr-1.5' />
                  Edit JSON
                </button>

                <button
                  onClick={handleSaveSurvey}
                  disabled={isSaving}
                  className='relative flex flex-grow items-center justify-center rounded-md bg-white/20 px-2 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/30 sm:w-auto sm:flex-grow-0 sm:px-3'
                  title='Save survey'
                >
                  <Save className='mr-1 h-4 w-4 flex-shrink-0 sm:mr-1.5' />
                  <span className='whitespace-nowrap'>
                    {isSaving ? "Saving..." : "Save"}
                  </span>
                  {lastSaved && !isSaving && (
                    <span className='absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-green-400'></span>
                  )}
                </button>

                <button
                  onClick={handlePublishSurvey}
                  disabled={isPublishing}
                  className='flex flex-grow items-center justify-center rounded-md bg-white/90 px-2 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-white sm:w-auto sm:flex-grow-0 sm:px-3'
                  title={
                    survey?.status === "published"
                      ? "Update published survey"
                      : "Publish survey"
                  }
                >
                  <Share className='mr-1 h-4 w-4 flex-shrink-0 sm:mr-1.5' />
                  <span className='whitespace-nowrap'>
                    {isPublishing ? "Publishing..." : "Publish"}
                  </span>
                </button>

                {/* Share button - only shown for published surveys */}
                {survey?.status === "published" && (
                  <button
                    onClick={handleOpenShareModal}
                    className='flex flex-grow items-center justify-center rounded-md border border-transparent bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-2 sm:flex-grow-0'
                    title='Share survey'
                  >
                    <Share className='mr-1 h-4 w-4 sm:mr-1.5' />
                    Share
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent'></div>
      </div>

      {/* Main Content */}
      <div className='flex-1'>
        <SurveyBuilder
          key={surveyKey}
          initialPages={pagesForBuilder}
          hideHeader={true}
        />
      </div>

      {/* Publish Success Modal */}
      {publishModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4 sm:p-6 md:p-8'>
          <div className='relative w-full max-w-md rounded-lg bg-white p-4 shadow-xl dark:bg-gray-800 sm:p-6'>
            <button
              onClick={handleClosePublishModal}
              className='absolute right-3 top-3 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 sm:right-4 sm:top-4'
            >
              <X className='h-5 w-5' />
            </button>

            <div className='mb-6 text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900'>
                <CheckCircle className='h-6 w-6 text-green-600 dark:text-green-300' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                Survey Published Successfully
              </h3>
              <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                Your survey is now live and ready to share with respondents.
              </p>
            </div>

            <div className='flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0'>
              <button
                onClick={handleClosePublishModal}
                className='w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 sm:w-auto'
              >
                Close
              </button>
              <button
                onClick={handleViewPublishedSurvey}
                className='flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 sm:w-auto'
              >
                <ExternalLink className='mr-2 h-4 w-4' />
                View Survey
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {survey && (
        <SurveyShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          surveyId={id}
          publicShareToken={survey.publicShareToken}
        />
      )}

      {/* Refine Survey Modal */}
      {refineModalOpen && id && (
        <RefineSurveyModal
          surveyId={id}
          isOpen={refineModalOpen}
          onClose={() => {
            setRefineModalOpen(false);
          }}
          onSuccess={handleRefinementSuccess}
        />
      )}
    </div>
  );
}
