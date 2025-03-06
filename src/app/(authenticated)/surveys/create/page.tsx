"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Loader2, ChevronLeft, Lightbulb, Sparkles, AlertCircle, Layout, LayoutTemplate, ArrowRight } from 'lucide-react';
import { api } from '@/lib/trpc/react';
import Link from 'next/link';

export default function CreateSurveyPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creationMode, setCreationMode] = useState<'manual' | 'ai'>('manual');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerationError, setAiGenerationError] = useState<string | null>(null);
  
  // Get trpc utils for cache invalidation
  const utils = api.useUtils();
  
  // Create survey mutation
  const createMutation = api.survey.create.useMutation({
    onSuccess: (data) => {
      toast.success('Survey created successfully');
      router.push(`/surveys/${data.id}/edit`);
    },
    onError: (error) => {
      toast.error(`Error creating survey: ${error.message}`);
    }
  });
  
  // AI generation mutation
  const generateMutation = api.survey.generateWithAI.useMutation({
    onSuccess: (data) => {
      toast.success('Survey generated successfully with AI');
      // Invalidate the credits query to refresh the credit count
      utils.credits.getAICredits.invalidate();
      router.push(`/surveys/${data.survey.id}/edit`);
    },
    onError: (error) => {
      setAiGenerationError(error.message);
      toast.error(`Error generating survey: ${error.message}`);
      setIsGenerating(false);
      // Also invalidate on error to show the refunded credit
      utils.credits.getAICredits.invalidate();
    }
  });
  
  // Handle manual form submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    createMutation.mutate({
      title,
      description: description.trim() || undefined
    });
  };
  
  // Handle AI generation submission
  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aiPrompt.trim()) {
      toast.error('AI prompt is required');
      return;
    }
    
    setIsGenerating(true);
    setAiGenerationError(null);
    
    generateMutation.mutate({
      prompt: aiPrompt,
      title: title.trim() || undefined,
      description: description.trim() || undefined
    });
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-4 hover:underline"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Create New Survey</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">Choose how you want to create your survey. You can build it manually or let our AI generate one for you based on your description.</p>
      </div>
      
      {/* Creation mode toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-0">
          <button
            onClick={() => setCreationMode('manual')}
            className={`relative p-6 sm:p-8 flex flex-col items-start transition-all duration-200 group ${
              creationMode === 'manual'
                ? 'bg-blue-50/80 dark:bg-blue-950/30'
                : 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-750/50'
            }`}
          >
            <div className={`absolute inset-0 ${creationMode === 'manual' ? 'border-t-4 sm:border-t-0 sm:border-l-4 border-blue-500 dark:border-blue-400' : 'border-transparent'}`}></div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
              creationMode === 'manual'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${
              creationMode === 'manual'
                ? 'text-blue-800 dark:text-blue-300'
                : 'text-gray-800 dark:text-gray-300'
            }`}>Manual Creation</h3>
            <p className={`text-sm ${
              creationMode === 'manual'
                ? 'text-blue-700 dark:text-blue-200'
                : 'text-gray-600 dark:text-gray-400'
            }`}>Design your survey from scratch with full control over questions and layout.</p>
            
            {creationMode === 'manual' && 
              <div className="mt-4 text-blue-600 dark:text-blue-300 font-medium text-sm flex items-center">
                Selected <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            }
          </button>
          
          <button
            onClick={() => setCreationMode('ai')}
            className={`relative p-6 sm:p-8 flex flex-col items-start transition-all duration-200 group ${
              creationMode === 'ai'
                ? 'bg-purple-50/80 dark:bg-purple-950/30'
                : 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-750/50'
            }`}
          >
            <div className={`absolute inset-0 ${creationMode === 'ai' ? 'border-t-4 sm:border-t-0 sm:border-l-4 border-purple-500 dark:border-purple-400' : 'border-transparent'}`}></div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
              creationMode === 'ai'
                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300' 
                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${
              creationMode === 'ai'
                ? 'text-purple-800 dark:text-purple-300'
                : 'text-gray-800 dark:text-gray-300'
            }`}>AI-Powered Creation</h3>
            <p className={`text-sm ${
              creationMode === 'ai'
                ? 'text-purple-700 dark:text-purple-200'
                : 'text-gray-600 dark:text-gray-400'
            }`}>Let AI generate a complete survey based on your description.</p>
            
            {creationMode === 'ai' && 
              <div className="mt-4 text-purple-600 dark:text-purple-300 font-medium text-sm flex items-center">
                Selected <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            }
          </button>
        </div>
      </div>
      
      {/* Create form - Manual Mode */}
      {creationMode === 'manual' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <LayoutTemplate className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
              Create Survey Manually
            </h2>
            
            <form onSubmit={handleManualSubmit}>
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Survey Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base"
                  placeholder="Enter survey title"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base"
                  placeholder="Enter survey description"
                ></textarea>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Add context about your survey's purpose to guide respondents.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors inline-flex items-center justify-center border border-transparent"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Survey'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Create form - AI Mode */}
      {creationMode === 'ai' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" />
              Generate Survey with AI
            </h2>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6 flex items-start border border-purple-100 dark:border-purple-800">
              <Lightbulb className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-1">
                  Let AI Design Your Survey
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-200">
                  Describe the survey you want to create in detail, and our AI will generate a complete multi-page survey with relevant questions. You can edit the generated survey afterward.
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-200 mt-1">
                  <strong>Example:</strong> "Create a customer feedback survey for a coffee shop that asks about service quality, product satisfaction, and suggestions for improvement."
                </p>
              </div>
            </div>
            
            <form onSubmit={handleAiSubmit}>
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Survey Title (optional)
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base"
                  placeholder="Enter survey title (or let AI generate one)"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Leave blank to use AI-generated title
                </p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base"
                  placeholder="Enter survey description (or let AI generate one)"
                ></textarea>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Leave blank to use AI-generated description
                </p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="aiPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Describe Your Survey <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="aiPrompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base"
                  placeholder="Describe the survey you want to create in detail..."
                  required
                ></textarea>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  The more details you provide, the better the AI-generated survey will be.
                </p>
              </div>
              
              {aiGenerationError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error</h3>
                    <p className="text-sm text-red-700 dark:text-red-200">{aiGenerationError}</p>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors inline-flex items-center justify-center border border-transparent"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isGenerating || generateMutation.isPending}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {isGenerating || generateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate with AI
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 