"use client";

import { useSurveyContext } from '@/lib/context/SurveyContext';
import { Question } from './Question';
import { ContextElements } from './ContextElements';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';

export const PagePreview = () => {
  const { 
    state: { pages, previewPageIndex },
    showPreviousPreviewPage,
    showNextPreviewPage
  } = useSurveyContext();

  if (pages.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center p-4 sm:p-8 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Pages to Preview</h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-sm">
          Add some pages to your survey using the builder tab to see them in preview mode.
        </p>
      </div>
    );
  }

  const currentPage = pages[previewPageIndex];
  
  if (!currentPage) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center p-4 sm:p-8 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Page Not Found</h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-sm">
          The selected page could not be found. Please try selecting a different page.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>Page {previewPageIndex + 1} of {pages.length}</span>
          <span>{Math.round(((previewPageIndex + 1) / pages.length) * 100)}% Complete</span>
        </div>
        <div className="h-1.5 sm:h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300"
            style={{ width: `${((previewPageIndex + 1) / pages.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Page Content */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="p-4 sm:p-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 dark:text-gray-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {currentPage.title}
            </h2>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {currentPage.contextElements && currentPage.contextElements.length > 0 && (
              <ContextElements elements={currentPage.contextElements} />
            )}
            
            {currentPage.questions && currentPage.questions.length > 0 ? (
              currentPage.questions.map((question, index) => (
                <Question key={index} question={question} mode="preview" />
              ))
            ) : (
              !currentPage.contextElements?.length && (
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  No content added to this page.
                </p>
              )
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between gap-4 px-4 sm:px-8 py-3 sm:py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={showPreviousPreviewPage}
            disabled={previewPageIndex === 0}
            className={`
              inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm transition-colors
              ${previewPageIndex === 0
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden xs:inline">Previous</span>
          </button>

          <button
            onClick={showNextPreviewPage}
            disabled={previewPageIndex === pages.length - 1}
            className={`
              inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium text-sm transition-colors
              ${previewPageIndex === pages.length - 1
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
              }
            `}
          >
            <span>{previewPageIndex === pages.length - 1 ? 'Complete' : 'Next'}</span>
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}; 