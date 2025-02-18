"use client";

import { useSurveyContext } from '@/lib/context/SurveyContext';
import { ArrowDown, ArrowUp, Plus, FileText, Info } from 'lucide-react';

interface PageListSidebarProps {
  onAddPage: () => void;
}

export const PageListSidebar = ({ onAddPage }: PageListSidebarProps) => {
  const {
    pages,
    currentPageIndex,
    selectPage,
    movePageUp,
    movePageDown,
  } = useSurveyContext();

  return (
    <div className="lg:w-80 flex-shrink-0">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-sm">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Survey Pages
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {pages.length} page{pages.length !== 1 ? 's' : ''} in total
          </p>

          <div className="space-y-2">
            {pages.map((page, index) => (
              <div
                key={index}
                onClick={() => selectPage(index)}
                className={`
                  group relative rounded-lg border transition-all duration-200 cursor-pointer
                  ${index === currentPageIndex
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-500/10'
                    : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                <div className="p-3">
                  <div className="flex items-start gap-3">
                    {page.pageType === 'survey' ? (
                      <FileText className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        index === currentPageIndex
                          ? 'text-blue-500 dark:text-blue-400'
                          : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'
                      }`} />
                    ) : (
                      <Info className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        index === currentPageIndex
                          ? 'text-blue-500 dark:text-blue-400'
                          : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'
                      }`} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        index === currentPageIndex
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-200'
                      }`}>
                        {page.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {page.pageType === 'survey'
                          ? `${page.questions.length} question${page.questions.length !== 1 ? 's' : ''}`
                          : 'Information page'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        movePageUp(index);
                      }}
                      disabled={index === 0}
                      className={`p-1 rounded-md transition-colors ${
                        index === 0
                          ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600'
                      }`}
                      title="Move Up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        movePageDown(index);
                      }}
                      disabled={index === pages.length - 1}
                      className={`p-1 rounded-md transition-colors ${
                        index === pages.length - 1
                          ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600'
                      }`}
                      title="Move Down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onAddPage}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New Page
          </button>
        </div>
      </div>
    </div>
  );
}; 