"use client";

import { useSurveyContext } from '@/lib/context/SurveyContext';
import { Question } from './Question';
import { ContextElements } from './ContextElements';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';

export const PagePreview = () => {
  const {
    state: { pages, previewPageIndex },
    showPreviousPreviewPage,
    showNextPreviewPage,
  } = useSurveyContext();

  const currentPage = pages[previewPageIndex];

  if (!currentPage) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center p-4 sm:p-8 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Pages Created</h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-sm">
          Create some pages in the builder to preview them here.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="absolute inset-x-0 top-0 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300"
          style={{ width: `${((previewPageIndex + 1) / pages.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="pt-6">
        <div className="p-4 sm:p-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 dark:text-gray-500" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {currentPage.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Page {previewPageIndex + 1} of {pages.length}
              </p>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {currentPage.contextElements && currentPage.contextElements.length > 0 && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
                <ContextElements elements={currentPage.contextElements} />
              </div>
            )}

            {currentPage.questions?.map((question, index) => (
              <Question
                key={index}
                question={question}
                index={index}
                mode="preview"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 mt-8 px-4 sm:px-8 py-4 bg-gradient-to-t from-white dark:from-gray-800 to-white/0 dark:to-gray-800/0">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={showPreviousPreviewPage}
            disabled={previewPageIndex === 0}
            className={`
              inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors
              ${previewPageIndex === 0
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }
            `}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={showNextPreviewPage}
            disabled={previewPageIndex === pages.length - 1}
            className={`
              inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors
              ${previewPageIndex === pages.length - 1
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
              }
            `}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}; 