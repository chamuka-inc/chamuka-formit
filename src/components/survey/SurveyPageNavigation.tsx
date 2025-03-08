"use client";

import React from "react";
import {
  FileText,
  CircleCheck,
  ArrowRight,
} from "lucide-react";

interface SurveyPageNavigationProps {
  pages: Array<{
    title: string;
    description?: string;
    questions?: Array<any>;
    contextElements?: Array<any>;
  }>;
  currentPageIndex: number;
  onPageSelect: (pageIndex: number) => void;
}

export const SurveyPageNavigation = ({
  pages,
  currentPageIndex,
  onPageSelect,
}: SurveyPageNavigationProps) => {
  return (
    <div className='sticky top-4 h-full w-full rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <div className='border-b border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50'>
        <div className='flex items-center gap-2'>
          <FileText className='h-4 w-4 text-gray-500 dark:text-gray-400' />
          <h3 className='text-sm font-medium text-gray-700 dark:text-gray-200'>
            Survey Navigation
          </h3>
        </div>
      </div>

      <div className='max-h-[calc(100vh-250px)] overflow-y-auto px-2 py-3'>
        <ul className='space-y-1.5'>
          {pages.map((page, index) => {
            const isPrevious = index < currentPageIndex;
            const isCurrent = index === currentPageIndex;
            const isNext = index > currentPageIndex;
            const hasQuestions = page.questions && page.questions.length > 0;
            const hasContext =
              page.contextElements && page.contextElements.length > 0;

            return (
              <li key={index}>
                <button
                  onClick={() => onPageSelect(index)}
                  className={`group relative flex w-full items-start rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                    isCurrent
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <div className='mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center'>
                    {isPrevious ? (
                      <CircleCheck className='h-5 w-5 text-green-500' />
                    ) : isCurrent ? (
                      <div className='h-5 w-5 rounded-full border-2 border-blue-500 bg-blue-100 dark:bg-blue-900/50'></div>
                    ) : (
                      <div className='flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-xs font-medium text-gray-500 group-hover:border-gray-400 dark:border-gray-600 dark:text-gray-400'>
                        {index + 1}
                      </div>
                    )}
                  </div>

                  <div className='flex-1 truncate'>
                    <div className='truncate font-medium'>
                      {page.title || `Page ${index + 1}`}
                    </div>
                    <div className='mt-0.5 flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400'>
                      {hasQuestions && (
                        <span>
                          {page.questions?.length} question
                          {page.questions?.length !== 1 ? "s" : ""}
                        </span>
                      )}
                      {hasContext && (
                        <span>
                          {page.contextElements?.length} content block
                          {page.contextElements?.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  {isCurrent && (
                    <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                      <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                    </div>
                  )}
                  {isNext && (
                    <ArrowRight className='absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100' />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
