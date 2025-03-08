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
import { FormBuilder } from "@/components/form/Builder";
import { FormShareModal } from "@/components/form/ShareModal";
import { RefineFormModal } from "@/components/form/RefineModal";

export default function EditFormPage() {
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

  // Fetch form data
  const {
    data: form,
    isLoading,
    error,
    refetch,
  } = api.form.getById.useQuery(
    { id },
    {
      retry: 3,
      retryDelay: 1000,
    },
  );

  // Handle query error
  useEffect(() => {
    if (error) {
      console.error("Error fetching form:", error);
      toast.error("Error loading form: " + error.message);
    }
  }, [error]);

  // Set title and description from form data
  useEffect(() => {
    if (form) {
      setTitle(form.title || "Untitled Form");
      setDescription(form.description || "");
    }
  }, [form]);

  // Make sure any time form changes, we update the local state with the latest data
  useEffect(() => {
    if (form?.data && typeof form.data === "object") {
      const data = form.data as any;
      if (Array.isArray(data.pages) && data.pages.length > 0) {
        // We already have the data loaded from formPages/pagesForBuilder,
        // this just ensures reactivity if the form data changes
      }
    }
  }, [form]);

  // Update form details mutation
  const updateFormMutation = api.form.update.useMutation({
    onSuccess: () => {
      setLastSaved(new Date());
      setIsSaving(false);
      setIsEditingTitle(false);
      refetch();
    },
    onError: (err) => {
      setIsSaving(false);
      toast.error("Error updating form: " + err.message);
    },
  });

  // Publish form mutation
  const publishFormMutation = api.form.update.useMutation({
    onSuccess: () => {
      setIsPublishing(false);
      setPublishModalOpen(true);
      toast.success("Form published successfully");
      refetch();
    },
    onError: (error) => {
      setIsPublishing(false);
      toast.error(`Error publishing form: ${error.message}`);
    },
  });

  // Handle updating the form title and description
  const handleUpdateFormDetails = () => {
    if (!title.trim()) {
      toast.error("Form title is required");
      return;
    }

    setIsSaving(true);
    updateFormMutation.mutate({
      id,
      title,
      description: description || undefined,
    });
  };

  // Save the form
  const handleSaveForm = () => {
    if (!id) {
      toast.error("Cannot save: No form ID");
      return;
    }

    setIsSaving(true);

    // Call the API to update the form (just save current title/description)
    updateFormMutation.mutate({
      id,
      title,
      description: description || undefined,
    });
  };

  // Handle publishing the form
  const handlePublishForm = () => {
    if (!form) {
      toast.error("Cannot publish: Form data not loaded");
      return;
    }

    setIsPublishing(true);

    // Prepare the form data with published status
    publishFormMutation.mutate({
      id,
      title: form.title,
      status: "published",
    });
  };

  // Handle closing the publish success modal
  const handleClosePublishModal = () => {
    setPublishModalOpen(false);
  };

  // View the published form
  const handleViewPublishedForm = () => {
    if (form?.publicShareToken) {
      window.open(`/s/${form.publicShareToken}`, "_blank");
    } else {
      toast.error("Public link not available");
    }
  };

  // Open the share modal
  const handleOpenShareModal = () => {
    if (form?.status !== "published") {
      toast.info("You need to publish your form before sharing it");
      return;
    }
    setShareModalOpen(true);
  };

  // Go back to dashboard
  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  // Open the refine form modal
  const handleOpenRefineModal = () => {
    setRefineModalOpen(true);
  };

  // Handle successful refinement
  const handleRefinementSuccess = (updatedData?: any) => {
    // If we received updated data, use it to update the UI
    if (updatedData && typeof updatedData === "object") {
      // Update form data override for the builder
      setFormDataOverride(updatedData);

      // Trigger re-render of the builder
      setFormKey((prev) => prev + 1);
    }

    // Refetch the latest data from the server
    refetch();

    toast.success("Form updated successfully!");
  };

  // For forcing re-render of the FormBuilder
  const [formKey, setFormKey] = useState(0);
  const [formDataOverride, setFormDataOverride] = useState<any>(null);

  // Loading state
  if (isLoading) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center'>
        <Loader2 className='mb-4 h-12 w-12 animate-spin text-blue-500' />
        <h2 className='text-xl font-medium'>Loading form...</h2>
      </div>
    );
  }

  // Map form data to the format expected by FormBuilder
  const formData =
    formDataOverride ||
    (form?.data
      ? typeof form.data === "object"
        ? (form.data as any)
        : { pages: [] }
      : { pages: [] });
  const formPages = Array.isArray(formData.pages) ? formData.pages : [];

  // If we have no pages but have a form, create a default page
  const pagesForBuilder =
    formPages.length > 0
      ? formPages
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
                  "Welcome to our form! Please answer the following questions.",
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
          <div className='flex w-full flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4'>
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
                    placeholder='Enter form title'
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
                      onClick={handleUpdateFormDetails}
                      className='flex w-[80px] items-center justify-center rounded bg-white px-3 py-1 text-xs text-blue-600 hover:bg-white/90'
                      disabled={updateFormMutation.isPending}
                    >
                      <span className='whitespace-nowrap'>
                        {updateFormMutation.isPending ? "Saving..." : "Save"}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingTitle(false);
                        setTitle(form?.title || "Untitled Form");
                        setDescription(form?.description || "");
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
                      {form?.title || "Untitled Form"}
                    </h1>
                    <button
                      onClick={() => setIsEditingTitle(true)}
                      className='flex-shrink-0 rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white'
                      title='Edit form details'
                    >
                      <Pencil className='h-4 w-4' />
                    </button>
                  </div>
                  {form?.description && (
                    <p className='mt-1 line-clamp-1 text-xs text-white/80 sm:text-sm'>
                      {form.description}
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
                  {formPages.length} page{formPages.length !== 1 ? "s" : ""}
                </span>

                {/* Add the Refine with AI button here */}
                <button
                  onClick={handleOpenRefineModal}
                  className='flex flex-grow items-center justify-center rounded-md bg-white/20 px-2 py-1.5 text-sm font-medium text-white hover:bg-white/30 sm:flex-grow-0 sm:px-3'
                  title='Edit form JSON'
                >
                  <Edit className='mr-1 h-4 w-4 text-blue-300 sm:mr-1.5' />
                  Edit JSON
                </button>

                <button
                  onClick={handleSaveForm}
                  disabled={isSaving}
                  className='relative flex flex-grow items-center justify-center rounded-md bg-white/20 px-2 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/30 sm:w-auto sm:flex-grow-0 sm:px-3'
                  title='Save form'
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
                  onClick={handlePublishForm}
                  disabled={isPublishing}
                  className='flex flex-grow items-center justify-center rounded-md bg-white/90 px-2 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-white sm:w-auto sm:flex-grow-0 sm:px-3'
                  title={
                    form?.status === "published"
                      ? "Update published form"
                      : "Publish form"
                  }
                >
                  <Share className='mr-1 h-4 w-4 flex-shrink-0 sm:mr-1.5' />
                  <span className='whitespace-nowrap'>
                    {isPublishing ? "Publishing..." : "Publish"}
                  </span>
                </button>

                {/* Share button - only shown for published forms */}
                {form?.status === "published" && (
                  <button
                    onClick={handleOpenShareModal}
                    className='flex flex-grow items-center justify-center rounded-md border border-transparent bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-2 sm:flex-grow-0'
                    title='Share form'
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
        <FormBuilder
          key={formKey}
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
                Form Published Successfully
              </h3>
              <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                Your form is now live and ready to share with respondents.
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
                onClick={handleViewPublishedForm}
                className='flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 sm:w-auto'
              >
                <ExternalLink className='mr-2 h-4 w-4' />
                View Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {form && (
        <FormShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          formId={id}
          publicShareToken={form.publicShareToken}
        />
      )}

      {/* Refine Form Modal */}
      {refineModalOpen && id && (
        <RefineFormModal
          formId={id}
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
