"use client";

import React, { useEffect, useState } from "react";
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
  const [titleEditModal, setTitleEditModal] = useState(false);
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
    setTitleEditModal(false);
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
        <Loader2 className='mb-4 h-12 w-12 animate-spin text-primary' />
        <h2 className='text-xl font-medium text-foreground'>Loading form...</h2>
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
    <div className='flex min-h-screen flex-col bg-background-secondary'>
      {/* Unified Header */}
      <div className='sticky top-0 z-20 border-b border-border bg-primary shadow-md'>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-light"></div>
        <div className='relative z-10 w-full px-2 py-2'>
          <div className='flex items-center justify-between'>
            {/* Left section: Back and title */}
            <div className='flex items-center gap-2 overflow-hidden'>
              <Link
                href='/dashboard'
                className='rounded p-1.5 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground'
                title='Back to dashboard'
              >
                <ArrowLeft className='h-5 w-5' />
              </Link>

              {/* Replace the inline editing with a button to open modal */}
              <div
                className='group max-w-full cursor-pointer overflow-hidden truncate rounded p-1 transition-colors hover:bg-primary-foreground/5'
                onClick={() => setTitleEditModal(true)}
              >
                <div className='flex items-center'>
                  <h1
                    className='mr-1 truncate text-sm font-semibold text-primary-foreground sm:text-base'
                    title={form?.title || "Untitled Form"}
                  >
                    {form?.title || "Untitled Form"}
                  </h1>
                  <Pencil className='h-3.5 w-3.5 flex-shrink-0 text-primary-foreground/40 transition-colors group-hover:text-primary-foreground/70' />
                </div>
                {form?.description ? (
                  <p className='mt-0.5 line-clamp-1 hidden w-full pr-2 text-xs text-primary-foreground/80 sm:block sm:text-sm'>
                    {form.description}
                  </p>
                ) : (
                  <p className='mt-0.5 line-clamp-1 hidden w-full pr-2 text-xs italic text-primary-foreground/50 sm:block sm:text-sm'>
                    Add description...
                  </p>
                )}
              </div>
            </div>

            {/* Right section: Action icons */}
            <div className='flex items-center gap-1'>
              {/* Last saved indicator (hidden on mobile) */}
              {lastSaved && (
                <span className='mr-2 hidden text-xs text-primary-foreground/70 lg:inline-flex'>
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}

              {/* Edit JSON button */}
              <button
                onClick={handleOpenRefineModal}
                className='rounded bg-transparent p-1.5 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground sm:flex sm:items-center sm:gap-1.5 sm:px-3'
                title='Edit JSON'
              >
                <Edit className='h-5 w-5' />
                <span className='hidden text-sm font-medium sm:inline'>
                  Edit
                </span>
              </button>

              {/* Save button */}
              <button
                onClick={handleSaveForm}
                disabled={isSaving}
                className='relative rounded bg-transparent p-1.5 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground sm:flex sm:items-center sm:gap-1.5 sm:px-3'
                title='Save form'
              >
                {isSaving ? (
                  <>
                    <Loader2 className='h-5 w-5 animate-spin' />
                    <span className='hidden text-sm font-medium sm:inline'>
                      Saving...
                    </span>
                  </>
                ) : (
                  <>
                    <Save className='h-5 w-5' />
                    <span className='hidden text-sm font-medium sm:inline'>
                      Save
                    </span>
                  </>
                )}
                {lastSaved && !isSaving && (
                  <span className='absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-success sm:right-2 sm:top-2'></span>
                )}
              </button>

              {/* Publish button */}
              <button
                onClick={handlePublishForm}
                disabled={isPublishing}
                className='rounded bg-transparent p-1.5 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 sm:flex sm:items-center sm:gap-1.5 sm:px-3'
                title={
                  form?.status === "published"
                    ? "Update published form"
                    : "Publish form"
                }
              >
                {isPublishing ? (
                  <>
                    <Loader2 className='h-5 w-5 animate-spin' />
                    <span className='hidden text-sm font-medium sm:inline'>
                      Publishing...
                    </span>
                  </>
                ) : (
                  <>
                    <Share className='h-5 w-5' />
                    <span className='hidden text-sm font-medium sm:inline'>
                      Publish
                    </span>
                  </>
                )}
              </button>

              {/* Share button - only shown for published forms */}
              {form?.status === "published" && (
                <button
                  onClick={handleOpenShareModal}
                  className='rounded bg-transparent p-1.5 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 sm:flex sm:items-center sm:gap-1.5 sm:px-3'
                  title='Share form'
                >
                  <ExternalLink className='h-5 w-5' />
                  <span className='hidden text-sm font-medium sm:inline'>
                    Share
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent'></div>
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
        <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-overlay/50 p-4 sm:p-6 md:p-8'>
          <div className='relative w-full max-w-md rounded-lg bg-background p-4 shadow-xl border border-border sm:p-6'>
            <button
              onClick={handleClosePublishModal}
              className='absolute right-3 top-3 text-muted-foreground hover:text-foreground sm:right-4 sm:top-4'
            >
              <X className='h-5 w-5' />
            </button>

            <div className='mb-6 text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/20'>
                <CheckCircle className='h-6 w-6 text-success' />
              </div>
              <h3 className='text-lg font-medium text-foreground'>
                Form Published Successfully
              </h3>
              <p className='mt-2 text-sm text-muted-foreground'>
                Your form is now live and ready to share with respondents.
              </p>
            </div>

            <div className='flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0'>
              <button
                onClick={handleClosePublishModal}
                className='w-full rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted sm:w-auto'
              >
                Close
              </button>
              <button
                onClick={handleViewPublishedForm}
                className='flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover sm:w-auto'
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

      {/* Add Modal for Title and Description Editing */}
      {titleEditModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-overlay/50 p-4 sm:p-6 md:p-8'>
          <div className='relative w-full max-w-md rounded-lg bg-background p-4 shadow-xl border border-border sm:p-6'>
            <button
              onClick={() => setTitleEditModal(false)}
              className='absolute right-3 top-3 text-muted-foreground hover:text-foreground sm:right-4 sm:top-4'
            >
              <X className='h-5 w-5' />
            </button>

            <div className='mb-6'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20'>
                <Pencil className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-center text-lg font-medium text-foreground'>
                Edit Form Details
              </h3>

              <div className='mt-4 space-y-4'>
                <div>
                  <label
                    htmlFor='form-title'
                    className='mb-1 block text-sm font-medium text-foreground'
                  >
                    Form Title *
                  </label>
                  <input
                    id='form-title'
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className='w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring'
                    placeholder='Enter form title'
                    autoFocus
                  />
                </div>

                <div>
                  <label
                    htmlFor='form-description'
                    className='mb-1 block text-sm font-medium text-foreground'
                  >
                    Description (optional)
                  </label>
                  <textarea
                    id='form-description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring'
                    placeholder='Add a description for your form'
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
              <button
                onClick={() => setTitleEditModal(false)}
                className='flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted'
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateFormDetails}
                disabled={updateFormMutation.isPending}
                className='flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
              >
                {updateFormMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
