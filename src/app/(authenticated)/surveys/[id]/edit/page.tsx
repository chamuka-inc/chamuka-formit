"use client";

import React, { useEffect, useState, Fragment } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { ArrowLeft, Loader2, Pencil, Save, Share, CheckCircle, X, ExternalLink, FileText } from 'lucide-react';
import { api } from '@/lib/trpc/react';
import { SurveyBuilder } from '@/components/survey/SurveyBuilder';
import { SurveyShareModal } from '@/components/survey/SurveyShareModal';

export default function EditSurveyPage() {
  // Use useParams hook to get the id
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  // State for UI
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Fetch survey data
  const { data: survey, isLoading, error, refetch } = api.survey.getById.useQuery({ id }, {
    retry: 3,
    retryDelay: 1000,
  });
  
  // Handle query error
  useEffect(() => {
    if (error) {
      console.error('Error fetching survey:', error);
      toast.error("Error loading survey: " + error.message);
    }
  }, [error]);
  
  // Set title and description from survey data
  useEffect(() => {
    if (survey) {
      setTitle(survey.title || 'Untitled Survey');
      setDescription(survey.description || '');
    }
  }, [survey]);
  
  // Make sure any time survey changes, we update the local state with the latest data
  useEffect(() => {
    if (survey?.data && typeof survey.data === 'object') {
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
      toast.success('Survey details updated');
      setIsEditingTitle(false);
      refetch();
    },
    onError: (err) => {
      setIsSaving(false);
      toast.error("Error updating survey: " + err.message);
    }
  });
  
  // Publish survey mutation
  const publishSurveyMutation = api.survey.update.useMutation({
    onSuccess: () => {
      setIsPublishing(false);
      setPublishModalOpen(true);
      toast.success('Survey published successfully');
      refetch();
    },
    onError: (error) => {
      setIsPublishing(false);
      toast.error(`Error publishing survey: ${error.message}`);
    }
  });
  
  // Handle updating the survey title and description
  const handleUpdateSurveyDetails = () => {
    if (!title.trim()) {
      toast.error('Survey title is required');
      return;
    }
    
    setIsSaving(true);
    updateSurveyMutation.mutate({
      id,
      title,
      description: description || undefined
    });
  };
  
  // Save the survey
  const handleSaveSurvey = () => {
    if (!id) {
      toast.error('Cannot save: No survey ID');
      return;
    }
    
    setIsSaving(true);
    
    // Call the API to update the survey (just save current title/description)
    updateSurveyMutation.mutate({
      id,
      title,
      description: description || undefined
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
      status: 'published',
    });
  };
  
  // Handle closing the publish success modal
  const handleClosePublishModal = () => {
    setPublishModalOpen(false);
  };
  
  // View the published survey
  const handleViewPublishedSurvey = () => {
    if (survey?.publicShareToken) {
      window.open(`/s/${survey.publicShareToken}`, '_blank');
    } else {
      toast.error('Public link not available');
    }
  };
  
  // Open the share modal
  const handleOpenShareModal = () => {
    if (survey?.status !== 'published') {
      toast.info('You need to publish your survey before sharing it');
      return;
    }
    setShareModalOpen(true);
  };
  
  // Go back to dashboard
  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-medium">Loading survey...</h2>
      </div>
    );
  }
  
  // Map survey data to the format expected by SurveyBuilder
  const surveyData = survey?.data ? (typeof survey.data === 'object' ? survey.data as any : { pages: [] }) : { pages: [] };
  const surveyPages = Array.isArray(surveyData.pages) ? surveyData.pages : [];
  
  // If we have no pages but have a survey, create a default page
  const pagesForBuilder = surveyPages.length > 0 ? surveyPages : [
    {
      title: 'Welcome Page',
      questions: [
        {
          id: `q-${Math.random().toString(36).substr(2, 9)}`,
          type: 'text' as const,
          text: 'What would you like to know?',
          required: true,
          options: [],
          contextElements: []
        }
      ],
      contextElements: [
        {
          type: 'paragraph' as const,
          content: 'Welcome to our survey! Please answer the following questions.',
        }
      ]
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Unified Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative z-10 w-full px-4 py-5 sm:px-6 lg:px-8">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="text-white/80 hover:text-white rounded-full p-1.5 hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              
              {isEditingTitle ? (
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="px-3 py-1.5 text-base font-semibold border border-white/30 rounded bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Enter survey title"
                    autoFocus
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-white/30 rounded bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Enter description (optional)"
                    rows={2}
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={handleUpdateSurveyDetails}
                      className="px-3 py-1 text-xs bg-white text-blue-600 rounded hover:bg-white/90"
                      disabled={updateSurveyMutation.isPending}
                    >
                      {updateSurveyMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingTitle(false);
                        setTitle(survey?.title || 'Untitled Survey');
                        setDescription(survey?.description || '');
                      }}
                      className="px-3 py-1 text-xs bg-white/20 text-white rounded hover:bg-white/30"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-semibold text-white">
                      {survey?.title || 'Untitled Survey'}
                    </h1>
                    <button
                      onClick={() => setIsEditingTitle(true)}
                      className="p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10"
                      title="Edit survey details"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                  {survey?.description && (
                    <p className="text-xs sm:text-sm text-white/80 mt-1">
                      {survey.description}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {lastSaved && (
                <span className="hidden md:inline-flex text-xs text-white/70">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
              
              <div className="flex space-x-2">
                <span className="flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-white/20 text-white/90 border border-white/10">
                  <FileText className="w-3.5 h-3.5 mr-1.5 opacity-80" />
                  {surveyPages.length} page{surveyPages.length !== 1 ? 's' : ''}
                </span>
                
                <button
                  onClick={handleSaveSurvey}
                  disabled={isSaving}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-md flex items-center transition-colors"
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                
                <button
                  onClick={handlePublishSurvey}
                  disabled={isPublishing}
                  className="px-3 py-1.5 bg-white/90 hover:bg-white text-blue-600 text-sm font-medium rounded-md flex items-center transition-colors"
                >
                  <Share className="w-4 h-4 mr-1.5" />
                  {isPublishing ? 'Publishing...' : 'Publish'}
                </button>
                
                {/* Share button - only shown for published surveys */}
                {survey?.status === 'published' && (
                  <button
                    onClick={handleOpenShareModal}
                    className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Share className="w-4 h-4 mr-1" />
                    Share
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <SurveyBuilder 
          initialPages={pagesForBuilder} 
          hideHeader={true}
        />
      </div>
      
      {/* Publish Success Modal */}
      {publishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={handleClosePublishModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Survey Published Successfully
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Your survey is now live and ready to share with respondents.
              </p>
            </div>
            
            <div className="mb-6 bg-gray-50 dark:bg-gray-700 rounded-md p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Share link:
              </p>
              <div className="flex items-center">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/surveys/${id}`}
                  className="flex-1 py-2 px-3 text-sm border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/surveys/${id}`);
                    toast.success("Link copied to clipboard");
                  }}
                  className="py-2 px-3 border border-gray-300 dark:border-gray-600 border-l-0 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleViewPublishedSurvey}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Survey
              </button>
              <button
                onClick={handleBackToDashboard}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Autosave notification */}
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-md rounded-md px-4 py-2 flex items-center">
          <div className="mr-2 h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Saving...</span>
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
    </div>
  );
} 