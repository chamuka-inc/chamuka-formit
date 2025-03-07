"use client";

import { useSurveyContext } from "@/lib/context/SurveyContext";
import { Question } from "./Question";
import { ContextElements } from "./ContextElements";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

export const PagePreview = () => {
  const {
    state: { pages, previewPageIndex },
    showPreviousPreviewPage,
    showNextPreviewPage,
  } = useSurveyContext();

  if (pages.length === 0) {
    return (
      <div className='flex h-[60vh] flex-col items-center justify-center p-4 text-center sm:p-8'>
        <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 sm:h-16 sm:w-16'>
          <FileText className='h-6 w-6 text-gray-400 dark:text-gray-500 sm:h-8 sm:w-8' />
        </div>
        <h2 className='mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl'>
          No Pages to Preview
        </h2>
        <p className='max-w-sm text-sm text-gray-500 dark:text-gray-400 sm:text-base'>
          Add some pages to your survey using the builder tab to see them in
          preview mode.
        </p>
      </div>
    );
  }

  const currentPage = pages[previewPageIndex];

  if (!currentPage) {
    return (
      <div className='flex h-[60vh] flex-col items-center justify-center p-4 text-center sm:p-8'>
        <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 sm:h-16 sm:w-16'>
          <FileText className='h-6 w-6 text-gray-400 dark:text-gray-500 sm:h-8 sm:w-8' />
        </div>
        <h2 className='mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl'>
          Page Not Found
        </h2>
        <p className='max-w-sm text-sm text-gray-500 dark:text-gray-400 sm:text-base'>
          The selected page could not be found. Please try selecting a different
          page.
        </p>
      </div>
    );
  }

  return (
    <div className='w-full'>
      {/* Progress Bar */}
      <div className='mb-6 sm:mb-8'>
        <div className='mb-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 sm:text-sm'>
          <span>
            Page {previewPageIndex + 1} of {pages.length}
          </span>
          <span>
            {Math.round(((previewPageIndex + 1) / pages.length) * 100)}%
            Complete
          </span>
        </div>
        <div className='h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 sm:h-2'>
          <div
            className='h-full bg-blue-500 transition-all duration-300 dark:bg-blue-400'
            style={{
              width: `${((previewPageIndex + 1) / pages.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Page Content */}
      <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
        <div className='p-4 sm:p-8'>
          <div className='mb-6 flex items-center gap-2 sm:mb-8 sm:gap-3'>
            <FileText className='h-5 w-5 text-gray-400 dark:text-gray-500 sm:h-6 sm:w-6' />
            <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl'>
              {currentPage.title}
            </h2>
          </div>

          <div className='space-y-6 sm:space-y-8'>
            {currentPage.contextElements &&
              currentPage.contextElements.length > 0 && (
                <ContextElements elements={currentPage.contextElements} />
              )}

            {currentPage.questions && currentPage.questions.length > 0
              ? currentPage.questions.map((question, index) => (
                  <Question key={index} question={question} mode='preview' />
                ))
              : !currentPage.contextElements?.length && (
                  <p className='text-sm text-gray-500 dark:text-gray-400 sm:text-base'>
                    No content added to this page.
                  </p>
                )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className='flex items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50 sm:px-8 sm:py-4'>
          <button
            onClick={showPreviousPreviewPage}
            disabled={previewPageIndex === 0}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:gap-2 sm:px-4 sm:py-2.5 ${
              previewPageIndex === 0
                ? "cursor-not-allowed text-gray-400 dark:text-gray-600"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            } `}
          >
            <ChevronLeft className='h-4 w-4 sm:h-5 sm:w-5' />
            <span className='xs:inline hidden'>Previous</span>
          </button>

          <button
            onClick={showNextPreviewPage}
            disabled={previewPageIndex === pages.length - 1}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:gap-2 sm:px-6 sm:py-2.5 ${
              previewPageIndex === pages.length - 1
                ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                : "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            } `}
          >
            <span>
              {previewPageIndex === pages.length - 1 ? "Complete" : "Next"}
            </span>
            <ChevronRight className='h-4 w-4 sm:h-5 sm:w-5' />
          </button>
        </div>
      </div>
    </div>
  );
};
