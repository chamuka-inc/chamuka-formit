"use client";

import { useFormContext } from "@/lib/context/Context";
import {
  ArrowDown,
  ArrowUp,
  Plus,
  FileText,
  File,
  PlusCircle,
  Trash2,
  Copy,
} from "lucide-react";

interface PageListSidebarProps {
  onAddPage: () => void;
}

export const PageListSidebar = ({ onAddPage }: PageListSidebarProps) => {
  const {
    state: { pages, currentPageIndex },
    selectPage,
    movePageUp,
    movePageDown,
  } = useFormContext();

  const handleAddPage = () => {
    selectPage(-1); // Reset currentPageIndex to -1 when adding a new page
    onAddPage();
  };

  // Improve page selection handling
  const handlePageClick = (index: number) => {
    selectPage(index);
  };

  return (
    <div className='flex-shrink-0 lg:w-80'>
      <div className='rounded-lg border border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/95'>
        <div className='p-4'>
          <div className='mb-4 flex items-center justify-between'>
            <div>
              <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg'>
                Form Pages
              </h2>
              <p className='mt-0.5 text-xs text-gray-500 dark:text-gray-400 sm:text-sm'>
                {pages.length} page{pages.length !== 1 ? "s" : ""} in total
              </p>
            </div>

            <div className='flex items-center'>
              <button
                onClick={handleAddPage}
                className='inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700'
                title='Add New Page'
              >
                <PlusCircle className='h-5 w-5' />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddPage}
            className='mb-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700'
          >
            <Plus className='h-4 w-4' />
            Add New Page
          </button>

          <div className='custom-scrollbar max-h-[calc(100vh-280px)] space-y-2 overflow-y-auto pr-1'>
            {pages.length === 0 ? (
              <div className='px-4 py-6 text-center'>
                <div className='mb-3 inline-flex items-center justify-center rounded-full bg-gray-100 p-3 dark:bg-gray-700/50'>
                  <FileText className='h-6 w-6 text-gray-500 dark:text-gray-400' />
                </div>
                <p className='mb-3 text-sm text-gray-500 dark:text-gray-400'>
                  No pages yet. Start by adding your first page.
                </p>
                <button
                  onClick={handleAddPage}
                  className='inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700'
                >
                  <Plus className='h-4 w-4' />
                  Create First Page
                </button>
              </div>
            ) : (
              pages.map((page, index) => (
                <div
                  key={index}
                  onClick={() => handlePageClick(index)}
                  className={`group relative cursor-pointer rounded-lg border transition-colors duration-200 ${
                    index === currentPageIndex
                      ? "border-blue-500 bg-blue-50/50 dark:border-blue-400 dark:bg-blue-500/5"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-700/30"
                  } `}
                  role='button'
                  aria-current={index === currentPageIndex ? "page" : undefined}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handlePageClick(index);
                    }
                  }}
                >
                  <div className='p-3'>
                    <div className='flex items-start gap-3'>
                      <div
                        className={`mt-0.5 flex-shrink-0 rounded-md p-1.5 ${
                          index === currentPageIndex
                            ? "bg-blue-100/50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                            : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                        }`}
                      >
                        <FileText className='h-4 w-4' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <h3
                          className={`truncate text-sm font-medium ${
                            index === currentPageIndex
                              ? "text-blue-700 dark:text-blue-400"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {page.title || "Untitled Page"}
                        </h3>
                        <div className='mt-1'>
                          <span className='text-xs text-gray-500 dark:text-gray-400'>
                            {[
                              page.questions && page.questions.length
                                ? `${page.questions.length} ${page.questions.length === 1 ? "question" : "questions"}`
                                : null,
                              page.contextElements &&
                              page.contextElements.length
                                ? `${page.contextElements.length} info ${page.contextElements.length === 1 ? "block" : "blocks"}`
                                : null,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Page Actions */}
                  <div className='absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        movePageUp(index);
                      }}
                      className='rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100/50 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30 dark:text-gray-500 dark:hover:bg-gray-700/50 dark:hover:text-gray-300'
                      disabled={index === 0}
                      title='Move Up'
                    >
                      <ArrowUp className='h-4 w-4' />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        movePageDown(index);
                      }}
                      className='rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100/50 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30 dark:text-gray-500 dark:hover:bg-gray-700/50 dark:hover:text-gray-300'
                      disabled={index === pages.length - 1}
                      title='Move Down'
                    >
                      <ArrowDown className='h-4 w-4' />
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
