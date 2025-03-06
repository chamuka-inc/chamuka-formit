"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Plus, FileText, Edit, Trash2, ExternalLink, LineChart, Database, Filter, Calendar, Clock, Users } from 'lucide-react';
import { api } from '@/lib/trpc/react';

export default function DashboardPage() {
  // Fetch user's surveys
  const { data: surveys, isLoading, isError, refetch } = api.survey.getAll.useQuery();
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Delete survey mutation
  const deleteMutation = api.survey.delete.useMutation({
    onSuccess: () => {
      toast.success('Survey deleted successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(`Error deleting survey: ${error.message}`);
    }
  });
  
  // State for delete confirmation
  const [surveyToDelete, setSurveyToDelete] = useState<string | null>(null);
  
  // Handle delete button click
  const handleDeleteClick = (surveyId: string) => {
    setSurveyToDelete(surveyId);
  };
  
  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (surveyToDelete) {
      deleteMutation.mutate({ id: surveyToDelete });
      setSurveyToDelete(null);
    }
  };
  
  // Handle cancel delete
  const handleCancelDelete = () => {
    setSurveyToDelete(null);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Filter surveys by status
  const filteredSurveys = surveys?.filter(survey => 
    statusFilter ? survey.status === statusFilter : true
  );
  
  // Loading state
  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Surveys</h1>
          <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        
        <div className="mb-6 flex gap-2">
          <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full animate-pulse">
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                <div className="mt-auto space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-between">
                  <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Error state
  if (isError) {
    return (
      <div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">Error Loading Surveys</h2>
          <p className="text-red-600 dark:text-red-300">Failed to load your surveys. Please try again later.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Surveys</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage and analyze your surveys</p>
        </div>
        <div className="flex space-x-3">
          <Link 
            href="/surveys/create" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors"
          >
            <Plus className="w-5 h-5 mr-1.5" />
            Create Survey
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
            <Filter className="w-4 h-4 inline mr-1.5" />
            Filter by status:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter(null)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === null
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-blue-400 dark:ring-blue-500'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'draft'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 ring-1 ring-yellow-400 dark:ring-yellow-500'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Draft
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'published'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 ring-1 ring-green-400 dark:ring-green-500'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setStatusFilter('archived')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'archived'
                  ? 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200 ring-1 ring-gray-400 dark:ring-gray-500'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Archived
            </button>
          </div>
        </div>
      </div>
      
      {/* Survey list */}
      {filteredSurveys && filteredSurveys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSurveys.map((survey) => (
            <div key={survey.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col h-full group hover:shadow-md transition-shadow">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(survey.status)}`}>
                    {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                  </span>
                </div>
                
                <Link href={`/surveys/${survey.id}/edit`} className="block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">{survey.title}</h2>
                </Link>
                
                {survey.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-2">{survey.description}</p>
                )}
                
                <div className="mt-auto space-y-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    <span>Created: {formatDate(survey.createdAt.toString())}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    <span>Updated: {formatDate(survey.updatedAt.toString())}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Link
                      href={`/surveys/${survey.id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded"
                      title="Edit Survey"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(survey.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded"
                      title="Delete Survey"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    {survey.status === 'published' && (
                      <>
                        <Link
                          href={`/s/${survey.publicShareToken}`}
                          target="_blank"
                          className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded"
                          title="Open Survey"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/surveys/${survey.id}/analytics`}
                          className="p-2 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded"
                          title="View Analytics"
                        >
                          <LineChart className="w-4 h-4" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {statusFilter ? `No ${statusFilter} surveys found` : 'No surveys yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
            {statusFilter 
              ? `You don't have any surveys with ${statusFilter} status. Try a different filter or create a new survey.`
              : 'Create your first survey to start collecting feedback and valuable data from your audience.'}
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/surveys/create" 
              className="inline-flex items-center px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-sm transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Survey
            </Link>
          </div>
          {statusFilter && (
            <button 
              onClick={() => setStatusFilter(null)}
              className="mt-6 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all surveys
            </button>
          )}
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {surveyToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delete Survey</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this survey? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 