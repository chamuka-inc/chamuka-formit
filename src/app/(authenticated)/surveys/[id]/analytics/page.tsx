"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { ArrowLeft, BarChart, Download, FileText } from 'lucide-react';
import { api } from '@/lib/trpc/react';

export default function SurveyAnalyticsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions'>('overview');
  
  // Fetch survey data
  const { data: survey, isLoading: surveyLoading, error: surveyError } = api.survey.getById.useQuery({ id });
  
  // Fetch submissions
  const { data: submissions, isLoading: submissionsLoading, error: submissionsError } = api.survey.getSubmissions.useQuery(
    { surveyId: id },
    { enabled: !!id }
  );
  
  // Download responses as CSV
  const downloadCSV = () => {
    if (!survey || !submissions) return;
    
    // Prepare headers
    let headers = ['Submission ID', 'Submission Date'];
    const questionMap = new Map();
    
    // Collect all questions from all pages
    survey.pages.forEach(page => {
      page.questions.forEach(question => {
        questionMap.set(question.id, question.text);
        headers.push(question.text);
      });
    });
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    // Add submission data
    submissions.forEach(submission => {
      let row = [
        submission.id,
        new Date(submission.submittedAt).toLocaleString()
      ];
      
      // Initialize all question values as empty
      const responseValues = Array(questionMap.size).fill('');
      
      // Fill in responses
      submission.responses.forEach(response => {
        const questionIndex = Array.from(questionMap.keys()).indexOf(response.questionId);
        if (questionIndex >= 0) {
          responseValues[questionIndex] = `"${response.value.replace(/"/g, '""')}"`;
        }
      });
      
      row = row.concat(responseValues);
      csvContent += row.join(',') + '\n';
    });
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${survey.title.replace(/\s+/g, '_')}_responses.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Loading state
  if (surveyLoading || submissionsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (surveyError || submissionsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">Error Loading Data</h2>
          <p className="text-red-600 dark:text-red-300">
            {surveyError?.message || submissionsError?.message || 'Failed to load survey data'}
          </p>
        </div>
      </div>
    );
  }
  
  // No survey found
  if (!survey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-yellow-700 dark:text-yellow-400">Survey Not Found</h2>
          <p className="text-yellow-600 dark:text-yellow-300">The requested survey does not exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{survey.title} - Analytics</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">{survey.description || 'No description provided'}</p>
      </div>
      
      {/* Tab navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <BarChart className="w-4 h-4 inline-block mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`ml-8 py-2 px-4 text-center border-b-2 font-medium text-sm ${
              activeTab === 'submissions'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <FileText className="w-4 h-4 inline-block mr-2" />
            Submissions
          </button>
        </nav>
      </div>
      
      {activeTab === 'overview' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-1">Total Submissions</h3>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">{submissions?.length || 0}</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-1">Completion Rate</h3>
              <p className="text-3xl font-bold text-green-900 dark:text-green-200">100%</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-1">Average Time</h3>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-200">N/A</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Response Summary</h3>
            
            {submissions && submissions.length > 0 ? (
              <div className="mt-4">
                <button
                  onClick={downloadCSV}
                  className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download CSV
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                <FileText className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Submissions Yet</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  You haven't received any submissions for this survey yet.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'submissions' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {submissions && submissions.length > 0 ? (
            <>
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">All Submissions</h3>
                <button
                  onClick={downloadCSV}
                  className="inline-flex items-center px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Submitted At
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        # Responses
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User Agent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {submission.id.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {new Date(submission.submittedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {submission.responses.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 truncate max-w-xs">
                          {submission.userAgent || 'Unknown'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Submissions</h4>
              <p className="text-gray-600 dark:text-gray-400">
                You haven't received any submissions for this survey yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 