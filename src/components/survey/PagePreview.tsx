"use client";

import { useSurveyContext } from '@/lib/context/SurveyContext';
import { Question } from './Question';
import { ContextElements } from './ContextElements';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const PagePreview = () => {
  const { pages, previewPageIndex, showPreviousPreviewPage, showNextPreviewPage } = useSurveyContext();

  if (pages.length === 0) {
    return (
      <div className="p-6 text-gray-600 dark:text-gray-400">
        No pages to preview.
      </div>
    );
  }

  const currentPage = pages[previewPageIndex];

  return (
    <div className="p-4">
      <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          {currentPage.title}
        </h2>

        <div className="space-y-6">
          {currentPage.pageType === 'info' ? (
            currentPage.contextElements && currentPage.contextElements.length > 0 ? (
              <ContextElements elements={currentPage.contextElements} />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No content added.</p>
            )
          ) : (
            currentPage.questions.map((question, index) => (
              <Question key={index} question={question} mode="preview" />
            ))
          )}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          {previewPageIndex > 0 && (
            <button
              onClick={showPreviousPreviewPage}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-4 sm:py-4 sm:px-8 rounded-xl shadow transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </button>
          )}
          {previewPageIndex < pages.length - 1 && (
            <button
              onClick={showNextPreviewPage}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 sm:py-4 sm:px-8 rounded-xl shadow transition-all transform hover:scale-105 flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 