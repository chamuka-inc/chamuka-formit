"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FormContextProvider } from "@/lib/context/Context";
import { TabNavigation } from "./TabNavigation";
import { PageListSidebar } from "./PageListSidebar";
import { PageContent } from "./PageContent";
import { PagePreview } from "./PagePreview";
import { PageModal } from "./PageModal";
import { QuestionModal } from "./QuestionModal";
import { useFormContext } from "@/lib/context/Context";
import {
  Layout,
  Menu,
  Save,
  Share,
  CheckCircle,
  X,
  ExternalLink,
  FileText,
} from "lucide-react";
import { Question, FormPage } from "@/lib/types";
import { api } from "@/lib/trpc/react";
import { toast } from "react-toastify";
import { generateId } from "@/lib/utils/shared";

const FormBuilderContent = ({ hideHeader = false }) => {
  const router = useRouter();
  const params = useParams();
  const formId = params?.id as string;

  const [activeTab, setActiveTab] = useState<"builder" | "preview">("builder");
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const {
    state: { pages, currentPageIndex },
    addPage,
    updatePage,
    addQuestion,
    updateQuestion,
    selectPage,
  } = useFormContext();

  // Mutations for saving and publishing
  const saveFormDataMutation = api.form.saveFormData.useMutation({
    onSuccess: (data) => {
      setLastSaved(new Date());
      setIsSaving(false);
    },
    onError: (error) => {
      setIsSaving(false);
      toast.error(`Error saving form data: ${error.message}`);
    },
  });

  const publishFormMutation = api.form.update.useMutation({
    onSuccess: () => {
      setIsPublishing(false);
      setPublishModalOpen(true);
      toast.success("Form published successfully");
    },
    onError: (error) => {
      setIsPublishing(false);
      toast.error(`Error publishing form: ${error.message}`);
    },
  });

  // Get the current form
  const { data: currentForm } = api.form.getById.useQuery(
    { id: formId },
    {
      enabled: !!formId,
      refetchOnWindowFocus: false,
    },
  );

  const handleTabChange = (tab: "builder" | "preview") => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const handleOpenPageModal = () => {
    if (currentPageIndex === -1) {
      selectPage(-1);
    }
    setIsPageModalOpen(true);
    setIsSidebarOpen(false);
  };

  const handleClosePageModal = () => {
    setIsPageModalOpen(false);
  };

  const handleOpenQuestionModal = (questionIndex = -1) => {
    setCurrentQuestionIndex(questionIndex);
    setIsQuestionModalOpen(true);
  };

  const handleCloseQuestionModal = () => {
    setIsQuestionModalOpen(false);
    setTimeout(() => {
      setCurrentQuestionIndex(-1);
    }, 300);
  };

  const handleSavePage = (page: FormPage) => {
    if (currentPageIndex === -1) {
      addPage(page);
    } else {
      updatePage(currentPageIndex, page);
    }
  };

  const handleSaveQuestion = (question: Question) => {
    if (currentPageIndex === -1) {
      return; // Don't add/update if no page is selected
    }

    if (currentQuestionIndex === -1) {
      addQuestion(currentPageIndex, question);
    } else {
      updateQuestion(currentPageIndex, currentQuestionIndex, question);
    }
    handleCloseQuestionModal();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Save the form
  const handleSaveForm = () => {
    if (!formId || pages.length === 0) {
      toast.error("Cannot save: No form ID or no pages");
      return;
    }

    setIsSaving(true);

    // Prepare the complete form data payload
    const formData = {
      title: currentForm?.title || "Untitled Form",
      description: currentForm?.description || "",
      pages: pages.map((page) => ({
        title: page.title || "Untitled Page",
        questions: (page.questions || []).map((q) => ({
          id: q.id || `q-${Math.random().toString(36).substr(2, 9)}`,
          text: q.text || "",
          type: q.type || "text",
          required: q.required !== undefined ? q.required : false,
          options: q.options || [],
          contextElements: q.contextElements || [],
        })),
        contextElements: (page.contextElements || []).map((ce) => ({
          type: ce.type,
          content: ce.content || "",
        })),
      })),
    };

    // Save the form data using the saveFormData mutation
    saveFormDataMutation.mutate({
      id: formId,
      data: formData,
    });
  };

  // Automatically save form when pages change
  useEffect(() => {
    // Skip saving during initial render or if already saving
    if (!formId || pages.length === 0 || isSaving) return;

    const timeoutId = setTimeout(() => {
      // Create a function reference to avoid dependency issues
      const saveData = () => {
        const formData = {
          title: currentForm?.title || "Untitled Form",
          description: currentForm?.description || "",
          pages: pages.map((page) => ({
            title: page.title || "Untitled Page",
            questions: (page.questions || []).map((q) => ({
              id: q.id || `q-${Math.random().toString(36).substr(2, 9)}`,
              text: q.text || "",
              type: q.type || "text",
              required: q.required !== undefined ? q.required : false,
              options: q.options || [],
              contextElements: q.contextElements || [],
            })),
            contextElements: (page.contextElements || []).map((ce) => ({
              type: ce.type,
              content: ce.content || "",
            })),
          })),
        };

        setIsSaving(true);
        saveFormDataMutation.mutate({
          id: formId,
          data: formData,
        });
      };

      saveData();
    }, 2000); // Save 2 seconds after changes stop

    return () => clearTimeout(timeoutId);
  }, [JSON.stringify(pages), formId]); // Use JSON.stringify to properly detect changes

  // Publish the form
  const handlePublishForm = () => {
    if (!formId || pages.length === 0) {
      toast.error("Cannot publish: No form ID or no pages");
      return;
    }

    setIsPublishing(true);

    // Prepare the form data with published status
    publishFormMutation.mutate({
      id: formId,
      title: currentForm?.title || "Untitled Form",
      status: "published",
    });
  };

  // Handle closing the publish success modal
  const handleClosePublishModal = () => {
    setPublishModalOpen(false);
  };

  // View the published form
  const handleViewPublishedForm = () => {
    if (currentForm?.publicShareToken) {
      window.open(`/s/${currentForm.publicShareToken}`, "_blank");
    } else {
      toast.error("Share token not available. Form may not be published yet.");
    }
  };

  // Go back to dashboard
  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div
      className={`${hideHeader ? "h-full" : "min-h-screen"} bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`}
    >
      {/* Header with Save & Publish buttons - only shown if hideHeader is false */}
      {!hideHeader && (
        <header className='relative bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500'>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className='relative z-10 px-4 py-4 sm:px-6 lg:px-8'>
            <div className='mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row'>
              <div className='flex items-center gap-3'>
                <Layout className='h-5 w-5 text-white/90 sm:h-6 sm:w-6' />
                <h1 className='text-lg font-semibold tracking-tight text-white sm:text-xl'>
                  Chamuka FormIt
                </h1>
                <span className='flex items-center rounded-md border border-white/10 bg-white/20 px-3 py-1.5 text-xs font-medium text-white/90'>
                  <FileText className='mr-1.5 h-3.5 w-3.5 opacity-80' />
                  {pages.length} page{pages.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className='flex items-center gap-3'>
                {lastSaved && (
                  <span className='hidden text-xs text-white/70 md:inline-flex'>
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </span>
                )}

                <button
                  onClick={handleSaveForm}
                  disabled={isSaving}
                  className='relative flex w-[100px] items-center justify-center rounded-md bg-white/20 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30'
                >
                  <Save className='mr-1.5 h-4 w-4 flex-shrink-0' />
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
                  className='flex w-[120px] items-center justify-center rounded-md bg-white/90 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-white'
                >
                  <Share className='mr-1.5 h-4 w-4 flex-shrink-0' />
                  <span className='whitespace-nowrap'>
                    {isPublishing ? "Publishing..." : "Publish"}
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent'></div>
        </header>
      )}

      {/* Main Content with Enhanced Container */}
      <main className='h-full w-full'>
        <div className='mx-auto bg-white/80 shadow-sm backdrop-blur-sm dark:bg-gray-800/80'>
          <div className='p-3 sm:p-6'>
            <div className='mb-4 flex items-center justify-between sm:mb-6 lg:hidden'>
              <TabNavigation
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
              {activeTab === "builder" && (
                <button
                  onClick={toggleSidebar}
                  className='rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 sm:p-2'
                >
                  <Menu className='h-5 w-5 sm:h-6 sm:w-6' />
                </button>
              )}
            </div>
            <div className='mb-8 hidden lg:block'>
              <TabNavigation
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </div>

            <div className='mb-8 sm:mb-12'>
              {activeTab === "builder" ? (
                <div className='flex flex-col gap-4 sm:gap-6 lg:flex-row'>
                  {/* Sidebar for mobile */}
                  <div
                    className={`fixed inset-0 z-50 transform transition-transform duration-300 lg:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} `}
                  >
                    <div
                      className='absolute inset-0 bg-black/30 backdrop-blur-[2px]'
                      onClick={toggleSidebar}
                    />
                    <div className='relative h-full w-[85%] max-w-[320px] overflow-y-auto border-r border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/95'>
                      <div className='sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/95 p-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/95'>
                        <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
                          Pages
                        </h2>
                        <button
                          onClick={toggleSidebar}
                          className='rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100/50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200'
                        >
                          <X className='h-5 w-5' />
                        </button>
                      </div>
                      <div className='p-4'>
                        <PageListSidebar onAddPage={handleOpenPageModal} />
                      </div>
                    </div>
                  </div>

                  {/* Sidebar for desktop */}
                  <div className='hidden lg:block'>
                    <PageListSidebar onAddPage={handleOpenPageModal} />
                  </div>

                  <div className='lg:flex-1'>
                    <PageContent
                      onEditPage={handleOpenPageModal}
                      onAddQuestion={handleOpenQuestionModal}
                    />
                  </div>
                </div>
              ) : (
                <PagePreview />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <PageModal
        isOpen={isPageModalOpen}
        onClose={handleClosePageModal}
        currentPage={
          currentPageIndex !== -1 ? pages[currentPageIndex] : undefined
        }
        onSave={handleSavePage}
      />

      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={handleCloseQuestionModal}
        currentQuestion={
          currentQuestionIndex !== -1 &&
          currentPageIndex !== -1 &&
          pages[currentPageIndex]?.questions?.[currentQuestionIndex]
            ? pages[currentPageIndex].questions[currentQuestionIndex]
            : undefined
        }
        onSave={handleSaveQuestion}
      />

      {/* Publish Success Modal */}
      {publishModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800'>
            <button
              onClick={handleClosePublishModal}
              className='absolute right-4 top-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
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

            <div className='mb-6 rounded-md bg-gray-50 p-4 dark:bg-gray-700'>
              <p className='mb-2 text-xs text-gray-500 dark:text-gray-400'>
                Share link:
              </p>
              <div className='flex items-center'>
                <input
                  type='text'
                  readOnly
                  value={`${window.location.origin}/forms/${formId}`}
                  className='flex-1 rounded-l-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/forms/${formId}`,
                    );
                    toast.success("Link copied to clipboard");
                  }}
                  className='rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-3 py-2 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                >
                  Copy
                </button>
              </div>
            </div>

            <div className='mt-6 flex flex-col gap-3 sm:flex-row'>
              <button
                onClick={handleViewPublishedForm}
                className='flex flex-1 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
              >
                <ExternalLink className='mr-2 h-4 w-4' />
                View Form
              </button>
              <button
                onClick={handleBackToDashboard}
                className='flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const FormBuilder = ({
  initialPages = [],
  hideHeader = false,
}: {
  initialPages?: FormPage[];
  hideHeader?: boolean;
}) => {
  // Ensure initialPages has the correct structure
  const validatedPages = initialPages.map((page) => ({
    id: page.id || generateId(),
    title: page.title || "Untitled Page",
    questions: (page.questions || []).map((q) => ({
      id: q.id || generateId(),
      type: q.type || "text",
      text: q.text || "Untitled Question",
      required: q.required !== undefined ? q.required : false,
      options: q.options || [],
      contextElements: (q.contextElements || []).map((ce) => ({
        id: ce.id || generateId(),
        type: ce.type,
        content: ce.content,
      })),
    })),
    contextElements: (page.contextElements || []).map((ce) => ({
      id: ce.id || generateId(),
      type: ce.type,
      content: ce.content,
    })),
  }));

  return (
    <FormContextProvider initialPages={validatedPages}>
      <FormBuilderContent hideHeader={hideHeader} />
    </FormContextProvider>
  );
};
