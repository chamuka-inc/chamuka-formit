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
      <div className='rounded-lg border border-border bg-background/95 backdrop-blur-sm'>
        <div className='p-4'>
          <div className='mb-4 flex items-center justify-between'>
            <div>
              <h2 className='text-base font-semibold text-foreground sm:text-lg'>
                Form Pages
              </h2>
              <p className='mt-0.5 text-xs text-muted-foreground sm:text-sm'>
                {pages.length} page{pages.length !== 1 ? "s" : ""} in total
              </p>
            </div>

            <div className='flex items-center'>
              <button
                onClick={handleAddPage}
                className='inline-flex items-center justify-center gap-1.5 rounded-lg bg-secondary p-2 text-secondary-foreground transition-colors hover:bg-secondary-hover'
                title='Add New Page'
              >
                <PlusCircle className='h-5 w-5' />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddPage}
            className='mb-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary-hover'
          >
            <Plus className='h-4 w-4' />
            Add New Page
          </button>

          <div className='custom-scrollbar max-h-[calc(100vh-280px)] space-y-2 overflow-y-auto pr-1'>
            {pages.length === 0 ? (
              <div className='px-4 py-6 text-center'>
                <div className='mb-3 inline-flex items-center justify-center rounded-full bg-muted p-3'>
                  <FileText className='h-6 w-6 text-muted-foreground' />
                </div>
                <p className='mb-3 text-sm text-muted-foreground'>
                  No pages yet. Start by adding your first page.
                </p>
                <button
                  onClick={handleAddPage}
                  className='inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary-hover'
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
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-border-hover hover:bg-muted/50"
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
                            ? "bg-primary/20 text-primary"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      >
                        <FileText className='h-4 w-4' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <h3
                          className={`truncate text-sm font-medium ${
                            index === currentPageIndex
                              ? "text-primary"
                              : "text-foreground"
                          }`}
                        >
                          {page.title || "Untitled Page"}
                        </h3>
                        <div className='mt-1'>
                          <span className='text-xs text-muted-foreground'>
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
                      className='rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30'
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
                      className='rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30'
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
          background-color: hsl(var(--muted-foreground) / 0.2);
          border-radius: 2px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: hsl(var(--muted-foreground) / 0.15);
        }
      `}</style>
    </div>
  );
};
