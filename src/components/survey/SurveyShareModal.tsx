"use client";

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Share, Copy, X, Link, Code } from 'lucide-react';

interface SurveyShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyId: string;
  publicShareToken: string;
}

export function SurveyShareModal({ 
  isOpen, 
  onClose, 
  surveyId, 
  publicShareToken 
}: SurveyShareModalProps) {
  const [activeTab, setActiveTab] = useState<'link' | 'embed'>('link');

  if (!isOpen) return null;
  
  // Get the full URL for the survey
  const surveyUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/s/${publicShareToken}`
    : `/s/${publicShareToken}`;
  
  // Get the embed code for the survey
  const embedCode = `<iframe src="${surveyUrl}" width="100%" height="600" frameborder="0"></iframe>`;
  
  // Handle copying to clipboard
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success(`${type} copied to clipboard!`);
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700">
          <div className="flex items-center">
            <Share className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="font-medium text-gray-900 dark:text-white">Share Survey</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-3 text-sm font-medium text-center ${
              activeTab === 'link'
                ? 'text-blue-600 border-b-2 border-blue-500 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('link')}
          >
            <Link className="w-4 h-4 inline mr-1" />
            Share Link
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium text-center ${
              activeTab === 'embed'
                ? 'text-blue-600 border-b-2 border-blue-500 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('embed')}
          >
            <Code className="w-4 h-4 inline mr-1" />
            Embed Code
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {activeTab === 'link' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Share this link with others:</label>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={surveyUrl}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => handleCopy(surveyUrl, 'Link')}
                  className="flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Anyone with this link can view and submit responses to your survey.
              </p>
            </div>
          )}
          
          {activeTab === 'embed' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Embed in your website:</label>
              <div className="flex">
                <textarea
                  readOnly
                  value={embedCode}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
                <button
                  onClick={() => handleCopy(embedCode, 'Embed code')}
                  className="flex items-center px-3 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Copy this code to embed the survey directly in your website or application.
              </p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 