"use client";

import { useSurveyContext } from '@/lib/context/SurveyContext';
import { ArrowDown, ArrowUp, Plus, FileText, File, PlusCircle, Trash2, Copy } from 'lucide-react';

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

  const handleAddPage = () => {
    selectPage(-1); // Reset currentPageIndex to -1 when adding a new page
    onAddPage();
  };

  return (
    <div className="lg:w-80 flex-shrink-0">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                Survey Pages
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {pages.length} page{pages.length !== 1 ? 's' : ''} in total
              </p>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={handleAddPage}
                className="inline-flex items-center justify-center gap-1.5 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                title="Add New Page"
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddPage}
            className="w-full mb-4 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New Page
          </button>

          <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 custom-scrollbar">
            {pages.length === 0 ? (
              <div className="text-center py-6 px-4">
                <div className="inline-flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-full mb-3">
                  <FileText className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                  No pages yet. Start by adding your first page.
                </p>
                <button
                  onClick={handleAddPage}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create First Page
                </button>
              </div>
            ) : (
              pages.map((page, index) => (
                <div
                  key={index}
                  onClick={() => selectPage(index)}
                  className={`
                    group relative rounded-lg border transition-colors duration-200 cursor-pointer
                    ${index === currentPageIndex
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-500/5'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50/50 dark:hover:bg-gray-700/30'
                    }
                  `}
                >
                  <div className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex-shrink-0 p-1.5 rounded-md ${
                        index === currentPageIndex
                          ? 'bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'
                      }`}>
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium truncate text-sm ${
                          index === currentPageIndex
                            ? 'text-blue-700 dark:text-blue-400'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {page.title || 'Untitled Page'}
                        </h3>
                        <div className="mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {[
                              page.questions && page.questions.length ? `${page.questions.length} ${page.questions.length === 1 ? 'question' : 'questions'}` : null,
                              page.contextElements && page.contextElements.length ? `${page.contextElements.length} info ${page.contextElements.length === 1 ? 'block' : 'blocks'}` : null
                            ].filter(Boolean).join(' · ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Page Actions */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        movePageUp(index);
                      }}
                      className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      disabled={index === 0}
                      title="Move Up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        movePageDown(index);
                      }}
                      className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      disabled={index === pages.length - 1}
                      title="Move Down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.2);
          border-radius: 2px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.15);
        }
      `}</style>
    </div>
  );
}; 