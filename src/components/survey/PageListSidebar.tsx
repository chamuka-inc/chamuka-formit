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
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Survey Pages
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {pages.length} page{pages.length !== 1 ? 's' : ''} in total
              </p>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={handleAddPage}
                className="inline-flex items-center justify-center gap-1.5 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
                title="Add New Page"
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddPage}
            className="w-full mb-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New Page
          </button>

          <div className="space-y-2.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 custom-scrollbar">
            {pages.length === 0 ? (
              <div className="text-center py-8 px-4">
                <div className="inline-flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
                  <FileText className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                  No pages yet. Start by adding your first page.
                </p>
                <button
                  onClick={handleAddPage}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-medium transition-colors"
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
                    group relative rounded-lg border transition-all duration-200 cursor-pointer
                    ${index === currentPageIndex
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-500/10 shadow-sm'
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }
                  `}
                >
                  <div className="p-3.5">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex-shrink-0 p-1.5 rounded-md ${
                        index === currentPageIndex
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'
                      }`}>
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium truncate ${
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
                      className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                      className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.2);
        }
      `}</style>
    </div>
  );
}; 