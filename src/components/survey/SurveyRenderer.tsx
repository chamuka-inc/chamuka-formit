"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { api } from '@/lib/trpc/react';
import { type SurveyPage, type Question, type ContextElement } from '@/lib/types';

interface SurveyRendererProps {
  surveyToken: string;
  onLoad?: () => void;
  onError?: (message: string) => void;
  onComplete?: () => void;
}

export default function SurveyRenderer({ 
  surveyToken, 
  onLoad,
  onError,
  onComplete 
}: SurveyRendererProps) {
  // State for survey data
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  
  // Fetch the survey data using the public share token
  const { data: surveyData, isLoading, error } = api.survey.getByShareToken.useQuery({ 
    token: surveyToken 
  }, {
    retry: 1, // Only retry once to avoid excessive error messages
    retryDelay: 1000,
  });
  
  // Call onLoad callback when survey data is loaded
  useEffect(() => {
    if (surveyData && !isLoading && onLoad) {
      onLoad();
    }
  }, [surveyData, isLoading, onLoad]);
  
  // Call onError callback when there's an error loading the survey
  useEffect(() => {
    if (error) {
      console.error('Error fetching survey by token:', error);
      if (onError) {
        onError(error.message || 'Failed to load survey');
      }
    }
  }, [error, onError]);
  
  // Handle case when survey is not found or not published
  useEffect(() => {
    if (!isLoading && !surveyData && !error && onError) {
      onError('Survey not found or not available for viewing');
    }
  }, [surveyData, isLoading, error, onError]);
  
  // Submission mutation
  const submitMutation = api.survey.submitResponses.useMutation({
    onSuccess: () => {
      toast.success('Survey submitted successfully!');
      setSurveyCompleted(true);
      if (onComplete) {
        onComplete();
      }
    },
    onError: (error) => {
      toast.error(`Error submitting survey: ${error.message}`);
      setIsSubmitting(false);
      if (onError) {
        onError(`Error submitting survey: ${error.message}`);
      }
    }
  });
  
  // Get the current page
  const currentPage = surveyData?.pages[currentPageIndex];
  const totalPages = surveyData?.pages.length || 0;
  
  // Handle response changes
  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  // Navigate to the next page
  const goToNextPage = () => {
    // Validate required fields
    const requiredQuestions = currentPage?.questions?.filter((q: Question) => q.required) || [];
    const missingResponses = requiredQuestions.filter((q: Question) => !responses[q.id!]);
    
    if (missingResponses.length > 0) {
      toast.error('Please answer all required questions');
      return;
    }
    
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(current => current + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Navigate to the previous page
  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(current => current - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate required fields on the final page
    const requiredQuestions = currentPage?.questions?.filter((q: Question) => q.required) || [];
    const missingResponses = requiredQuestions.filter((q: Question) => !responses[q.id!]);
    
    if (missingResponses.length > 0) {
      toast.error('Please answer all required questions');
      return;
    }
    
    // Prepare the submission data
    setIsSubmitting(true);
    
    // Transform responses to the required format
    const formattedResponses = Object.entries(responses).map(([questionId, value]) => ({
      questionId,
      value
    }));
    
    // Submit the responses
    submitMutation.mutate({
      surveyId: surveyData?.id || '',
      responses: formattedResponses
    });
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Render error state
  if (error || !surveyData) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg text-center">
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Error Loading Survey</h2>
        <p className="text-red-600 dark:text-red-300">{error?.message || 'Survey not found or not available'}</p>
      </div>
    );
  }
  
  // Render completion state
  if (surveyCompleted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-8 rounded-lg text-center my-8">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-3">Thank You!</h2>
        <p className="text-green-600 dark:text-green-300 mb-6">Your response has been submitted successfully.</p>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Survey title */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{surveyData.title}</h1>
        {surveyData.description && (
          <p className="mt-2 text-gray-600 dark:text-gray-300">{surveyData.description}</p>
        )}
      </div>
      
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
          <span>Page {currentPageIndex + 1} of {totalPages}</span>
          <span>{Math.round(((currentPageIndex + 1) / totalPages) * 100)}% completed</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full" 
            style={{ width: `${((currentPageIndex + 1) / totalPages) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Current page */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {/* Page title */}
        {currentPage && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{currentPage.title}</h2>
            {currentPage.description && (
              <p className="mt-1 text-gray-600 dark:text-gray-300">{currentPage.description}</p>
            )}
          </div>
        )}
        
        {/* Context elements at page level */}
        {currentPage?.contextElements?.map((element: ContextElement, idx: number) => (
          <RenderContextElement key={`page-context-${idx}`} element={element} />
        ))}
        
        {/* Questions */}
        <div className="space-y-8">
          {currentPage?.questions?.map((question: Question) => (
            <div key={question.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
              <RenderQuestion 
                question={question} 
                value={responses[question.id!] || ''} 
                onChange={(value) => handleResponseChange(question.id!, value)} 
              />
            </div>
          ))}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={goToPrevPage}
            disabled={currentPageIndex === 0}
            className={`px-4 py-2 flex items-center rounded-md ${
              currentPageIndex === 0 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </button>
          
          {currentPageIndex < totalPages - 1 ? (
            <button
              type="button"
              onClick={goToNextPage}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Component to render a question based on its type
function RenderQuestion({ 
  question, 
  value, 
  onChange 
}: { 
  question: Question; 
  value: string; 
  onChange: (value: string) => void; 
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start">
        <label className="block text-gray-700 dark:text-gray-200 font-medium">
          {question.text}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      
      {/* Context elements */}
      {question.contextElements?.map((element, idx) => (
        <RenderContextElement key={`question-context-${idx}`} element={element} />
      ))}
      
      {/* Render different input types based on question type */}
      {question.type === 'text' && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Your answer"
          required={question.required}
        />
      )}
      
      {question.type === 'radio' && (
        <div className="space-y-2">
          {question.options?.map((option, idx) => (
            <div key={idx} className="flex items-center">
              <input
                type="radio"
                id={`question-${question.id}-option-${idx}`}
                name={`question-${question.id}`}
                value={option}
                checked={value === option}
                onChange={() => onChange(option)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                required={question.required}
              />
              <label
                htmlFor={`question-${question.id}-option-${idx}`}
                className="ml-2 block text-gray-700 dark:text-gray-200"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      )}
      
      {question.type === 'checkbox' && (
        <div className="space-y-2">
          {question.options?.map((option, idx) => {
            const values = value ? value.split(',') : [];
            const isChecked = values.includes(option);
            
            return (
              <div key={idx} className="flex items-center">
                <input
                  type="checkbox"
                  id={`question-${question.id}-option-${idx}`}
                  name={`question-${question.id}`}
                  value={option}
                  checked={isChecked}
                  onChange={() => {
                    let newValues;
                    if (isChecked) {
                      newValues = values.filter(v => v !== option);
                    } else {
                      newValues = [...values, option];
                    }
                    onChange(newValues.join(','));
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300 dark:border-gray-600"
                />
                <label
                  htmlFor={`question-${question.id}-option-${idx}`}
                  className="ml-2 block text-gray-700 dark:text-gray-200"
                >
                  {option}
                </label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Component to render a context element
function RenderContextElement({ element }: { element: ContextElement }) {
  if (element.type === 'paragraph') {
    return (
      <div className="prose dark:prose-invert max-w-none mb-4">
        <p>{element.content}</p>
      </div>
    );
  }
  
  if (element.type === 'image') {
    return (
      <div className="mb-4">
        <img 
          src={element.content} 
          alt="Survey context" 
          className="max-w-full h-auto rounded-lg"
        />
      </div>
    );
  }
  
  if (element.type === 'video') {
    return (
      <div className="mb-4">
        <iframe
          src={element.content}
          title="Survey video"
          className="w-full aspect-video rounded-lg"
          allowFullScreen
        ></iframe>
      </div>
    );
  }
  
  return null;
} 