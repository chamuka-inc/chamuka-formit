"use client";

import { useSurveyContext } from '@/lib/context/SurveyContext';
import { FileText, Plus, ChevronUp, ChevronDown } from 'lucide-react';

interface PageListSidebarProps {
  onAddPage: () => void;
}

export const PageListSidebar = ({ onAddPage }: PageListSidebarProps) => {
  const {
    state: { pages, currentPageIndex },
    selectPage,
    movePageUp,
    movePageDown,
  } = useSurveyContext();

  return (
    <div className="w-72 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Pages</h2>
        <button
          onClick={onAddPage}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="space-y-2">
          {pages.map((page, index) => (
            <div
              key={index}
              className={`
                group relative rounded-lg border transition-all
                ${index === currentPageIndex
                  ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-500/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400'
                }
              `}
            >
              <button
                onClick={() => selectPage(index)}
                className="w-full p-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <FileText className={`h-4 w-4 ${
                    index === currentPageIndex
                      ? 'text-blue-500 dark:text-blue-400'
                      : 'text-gray-400 dark:text-gray-500'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-medium truncate ${
                      index === currentPageIndex
                        ? 'text-blue-700 dark:text-blue-400'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {page.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {page.questions?.length
                        ? `${page.questions.length} question${page.questions.length !== 1 ? 's' : ''}`
                        : 'Content page'
                      }
                    </p>
                  </div>
                </div>
              </button>

              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => movePageUp(index)}
                  disabled={index === 0}
                  className={`
                    p-1 rounded-md transition-colors
                    ${index === 0
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => movePageDown(index)}
                  disabled={index === pages.length - 1}
                  className={`
                    p-1 rounded-md transition-colors
                    ${index === pages.length - 1
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {pages.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No pages created yet.</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click the + button to add your first page.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 