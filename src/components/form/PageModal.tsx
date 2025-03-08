"use client";

import { useState, useEffect } from "react";
import { FormPage, ContextElement } from "@/lib/types";
import { ContextElementEditor } from "./ContextElementEditor";
import { X } from "lucide-react";

interface PageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage?: FormPage;
  onSave: (page: FormPage) => void;
}

export const PageModal = ({
  isOpen,
  onClose,
  currentPage,
  onSave,
}: PageModalProps) => {
  const [pageTitle, setPageTitle] = useState("");
  const [contextElements, setContextElements] = useState<ContextElement[]>([]);

  useEffect(() => {
    if (isOpen && currentPage) {
      setPageTitle(currentPage.title);
      setContextElements(currentPage.contextElements || []);
    } else {
      setPageTitle("");
      setContextElements([]);
    }
  }, [isOpen, currentPage]);

  const handleSave = () => {
    const newPage: FormPage = {
      title: pageTitle,
      questions: currentPage?.questions || [],
      contextElements: contextElements.length > 0 ? contextElements : undefined,
    };
    onSave(newPage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='fixed inset-0 animate-fade-in bg-black/40 backdrop-blur-sm transition-opacity'
        onClick={onClose}
      />
      <div className='relative w-11/12 max-w-2xl animate-fade-in'>
        <div className='relative overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800'>
          {/* Header */}
          <div className='relative border-b border-gray-200 px-8 py-6 dark:border-gray-700'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
              {currentPage ? "Edit Page" : "Add Page"}
            </h2>
            <button
              onClick={onClose}
              className='absolute right-6 top-6 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-400'
            >
              <X className='h-5 w-5' />
            </button>
          </div>

          {/* Content */}
          <div className='max-h-[calc(80vh-8rem)] overflow-y-auto px-8 py-6'>
            <div className='space-y-6'>
              <div className='space-y-2'>
                <label
                  htmlFor='page-title'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Page Title
                </label>
                <input
                  type='text'
                  id='page-title'
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  className='w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-400'
                  placeholder='Enter a descriptive title for your page...'
                />
              </div>

              <div className='pt-4'>
                <ContextElementEditor
                  elements={contextElements}
                  setElements={setContextElements}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='sticky bottom-0 border-t border-gray-200 bg-gray-50 px-8 py-6 dark:border-gray-700 dark:bg-gray-800/50'>
            <div className='flex justify-end gap-4'>
              <button
                onClick={onClose}
                className='rounded-lg border border-gray-200 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!pageTitle.trim()}
                className={`rounded-lg px-6 py-2.5 font-medium transition-all ${
                  pageTitle.trim()
                    ? "transform bg-blue-500 text-white hover:scale-[1.02] hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                } `}
              >
                {currentPage ? "Save Changes" : "Create Page"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
