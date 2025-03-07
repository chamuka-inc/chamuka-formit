"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { Share, Copy, X, Link, Code } from "lucide-react";

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
  publicShareToken,
}: SurveyShareModalProps) {
  const [activeTab, setActiveTab] = useState<"link" | "embed">("link");

  if (!isOpen) return null;

  // Get the full URL for the survey
  const surveyUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/s/${publicShareToken}`
      : `/s/${publicShareToken}`;

  // Get the embed code for the survey
  const embedCode = `<iframe src="${surveyUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  // Handle copying to clipboard
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${type} copied to clipboard!`);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800'>
        {/* Header */}
        <div className='flex items-center justify-between bg-gray-100 px-4 py-3 dark:bg-gray-700'>
          <div className='flex items-center'>
            <Share className='mr-2 h-5 w-5 text-blue-500' />
            <h3 className='font-medium text-gray-900 dark:text-white'>
              Share Survey
            </h3>
          </div>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Tabs */}
        <div className='flex border-b border-gray-200 dark:border-gray-700'>
          <button
            className={`flex-1 py-3 text-center text-sm font-medium ${
              activeTab === "link"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            }`}
            onClick={() => setActiveTab("link")}
          >
            <Link className='mr-1 inline h-4 w-4' />
            Share Link
          </button>
          <button
            className={`flex-1 py-3 text-center text-sm font-medium ${
              activeTab === "embed"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            }`}
            onClick={() => setActiveTab("embed")}
          >
            <Code className='mr-1 inline h-4 w-4' />
            Embed Code
          </button>
        </div>

        {/* Content */}
        <div className='p-4'>
          {activeTab === "link" && (
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Share this link with others:
              </label>
              <div className='flex'>
                <input
                  type='text'
                  readOnly
                  value={surveyUrl}
                  className='flex-1 rounded-l-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                />
                <button
                  onClick={() => handleCopy(surveyUrl, "Link")}
                  className='flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-3 py-2 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                >
                  <Copy className='h-4 w-4' />
                </button>
              </div>
              <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                Anyone with this link can view and submit responses to your
                survey.
              </p>
            </div>
          )}

          {activeTab === "embed" && (
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Embed in your website:
              </label>
              <div className='flex'>
                <textarea
                  readOnly
                  value={embedCode}
                  className='flex-1 rounded-l-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  rows={3}
                />
                <button
                  onClick={() => handleCopy(embedCode, "Embed code")}
                  className='flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-3 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                >
                  <Copy className='h-4 w-4' />
                </button>
              </div>
              <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                Copy this code to embed the survey directly in your website or
                application.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='flex justify-end bg-gray-50 px-4 py-3 dark:bg-gray-700'>
          <button
            onClick={onClose}
            className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
