"use client";

import { useState } from "react";
import { useFormContext } from "@/lib/context/Context";
import { Question } from "./Question";
import { ContextElements } from "./ContextElements";
import { ChevronLeft, ChevronRight, FileText, Menu, X } from "lucide-react";
import { FormPageNavigation } from "./PageNavigation";

// Add description as optional property to the currentPage type
type PageWithOptionalDescription = {
  title: string;
  description?: string;
  questions?: Array<any>;
  contextElements?: Array<any>;
};

export const PagePreview = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const {
    state: { pages, previewPageIndex },
    showPreviousPreviewPage,
    showNextPreviewPage,
    setPreviewPageIndex,
  } = useFormContext();

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
          Add some pages to your form using the builder tab to see them in
          preview mode.
        </p>
      </div>
    );
  }

  const currentPage = pages[previewPageIndex] as PageWithOptionalDescription;

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
      {/* Preview Banner */}
      <div className='mb-6 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 p-3 text-center text-sm text-gray-600 shadow-sm dark:from-gray-800/50 dark:to-blue-900/20 dark:text-gray-300 sm:text-base'>
        <span className='font-medium'>Preview Mode</span> — See how your form
        will appear to respondents
      </div>

      {/* Mobile: Toggle sidebar button */}
      <div className='mb-4 flex lg:hidden'>
        <button
          onClick={() => setSidebarVisible(!sidebarVisible)}
          className='inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
        >
          {sidebarVisible ? (
            <>
              <X className='h-4 w-4' />
              <span>Hide Pages</span>
            </>
          ) : (
            <>
              <Menu className='h-4 w-4' />
              <span>Show Pages</span>
            </>
          )}
        </button>
      </div>

      <div className='flex flex-col gap-6 lg:flex-row'>
        {/* Side Page Navigation */}
        <div
          className={`${
            sidebarVisible ? "block" : "hidden lg:block"
          } w-full lg:w-1/4 xl:w-1/5`}
        >
          <FormPageNavigation
            pages={pages}
            currentPageIndex={previewPageIndex}
            onPageSelect={(index) => {
              setPreviewPageIndex(index);
              setSidebarVisible(false); // Hide sidebar on mobile after selection
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>

        <div className='w-full lg:w-3/4 xl:w-4/5'>
          {/* Progress Bar */}
          <div className='mb-6'>
            <div className='mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
              <div className='mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 sm:mb-0'>
                Page {previewPageIndex + 1} of {pages.length}
              </div>
              <div className='text-sm text-gray-500 dark:text-gray-400'>
                {Math.round(((previewPageIndex + 1) / pages.length) * 100)}%
                Complete
              </div>
            </div>
            <div className='h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700'>
              <div
                className='h-full bg-blue-500 transition-all duration-300 dark:bg-blue-400'
                style={{
                  width: `${((previewPageIndex + 1) / pages.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Page Content */}
          <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800'>
            <div className='p-5 sm:p-8'>
              <div className='mb-8 border-b border-gray-100 pb-4 dark:border-gray-700'>
                <div className='flex items-center gap-2 sm:gap-3'>
                  <FileText className='h-5 w-5 text-gray-400 dark:text-gray-500 sm:h-6 sm:w-6' />
                  <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl'>
                    {currentPage.title}
                  </h2>
                </div>
                {currentPage.description && (
                  <p className='mt-3 pl-8 text-gray-600 dark:text-gray-300'>
                    {currentPage.description}
                  </p>
                )}
              </div>

              <div className='space-y-8'>
                {currentPage.contextElements &&
                  currentPage.contextElements.length > 0 && (
                    <div className='mb-8'>
                      <ContextElements elements={currentPage.contextElements} />
                    </div>
                  )}

                {currentPage.questions && currentPage.questions.length > 0 ? (
                  <div className='space-y-6'>
                    {currentPage.questions.map((question, index) => (
                      <div
                        key={index}
                        className='rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50'
                      >
                        <Question
                          key={index}
                          question={question}
                          mode='preview'
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  !currentPage.contextElements?.length && (
                    <div className='rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-800/30'>
                      <p className='text-sm text-gray-500 dark:text-gray-400 sm:text-base'>
                        No content added to this page.
                      </p>
                      <p className='mt-1 text-xs text-gray-400 dark:text-gray-500'>
                        Switch to builder mode to add questions or content
                        elements
                      </p>
                    </div>
                  )
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
                }`}
              >
                <ChevronLeft className='h-4 w-4 sm:h-5 sm:w-5' />
                <span className='hidden sm:inline'>Previous</span>
              </button>

              <div className='hidden items-center gap-1.5 md:flex'>
                {pages.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPreviewPageIndex(idx);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      idx === previewPageIndex
                        ? "scale-125 bg-blue-500"
                        : idx < previewPageIndex
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    aria-label={`Go to page ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={showNextPreviewPage}
                disabled={previewPageIndex === pages.length - 1}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:gap-2 sm:px-6 sm:py-2.5 ${
                  previewPageIndex === pages.length - 1
                    ? "bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                    : "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                }`}
              >
                <span>
                  {previewPageIndex === pages.length - 1 ? "Submit" : "Next"}
                </span>
                <ChevronRight className='h-4 w-4 sm:h-5 sm:w-5' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
