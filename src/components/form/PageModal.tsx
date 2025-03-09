"use client";

import { useState, useEffect, useId } from "react";
import { FormPage, ContextElement } from "@/lib/types";
import { ContextElementEditor } from "./ContextElementEditor";
import { X } from "lucide-react";

interface PageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage?: FormPage;
  onSave: (page: FormPage) => void;
}

interface ModalHeaderProps {
  isEdit: boolean;
  onClose: () => void;
  headingId: string;
}

interface ModalFooterProps {
  onCancel: () => void;
  onSave: () => void;
  isSaveDisabled: boolean;
  isEdit: boolean;
}

const ModalHeader = ({ isEdit, onClose, headingId }: ModalHeaderProps) => {
  return (
    <div className='relative border-b border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-6 sm:py-6 md:px-8'>
      <h2
        id={headingId}
        className='pr-8 text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl'
      >
        {isEdit ? "Edit Page" : "Add Page"}
      </h2>
      <button
        onClick={onClose}
        className='absolute right-3 top-3 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-400 sm:right-6 sm:top-6 sm:p-2'
        aria-label='Close modal'
      >
        <X className='h-4 w-4 sm:h-5 sm:w-5' />
      </button>
    </div>
  );
};

const ModalFooter = ({
  onCancel,
  onSave,
  isSaveDisabled,
  isEdit,
}: ModalFooterProps) => {
  return (
    <div className='sticky bottom-0 border-t border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-gray-800/50 sm:px-6 sm:py-6 md:px-8'>
      <div className='flex flex-col-reverse justify-end gap-3 sm:flex-row sm:gap-4'>
        <button
          onClick={onCancel}
          className='rounded-lg border border-gray-200 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-6 sm:py-2.5'
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={isSaveDisabled}
          className={`rounded-lg px-4 py-2 font-medium transition-all sm:px-6 sm:py-2.5 ${
            !isSaveDisabled
              ? "transform bg-blue-500 text-white hover:scale-[1.02] hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
          }`}
        >
          {isEdit ? "Save Changes" : "Create Page"}
        </button>
      </div>
    </div>
  );
};

export const PageModal = ({
  isOpen,
  onClose,
  currentPage,
  onSave,
}: PageModalProps) => {
  const [pageTitle, setPageTitle] = useState("");
  const [contextElements, setContextElements] = useState<ContextElement[]>([]);
  const modalHeadingId = useId();
  const pageTitleId = useId();

  const isEditMode = Boolean(currentPage);

  // Reset form state when modal opens/closes or current page changes
  useEffect(() => {
    if (isOpen && currentPage) {
      setPageTitle(currentPage.title);
      setContextElements(currentPage.contextElements || []);
    } else if (!isOpen) {
      setPageTitle("");
      setContextElements([]);
    }
  }, [isOpen, currentPage]);

  // Handle body scroll lock
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  const handleSave = () => {
    const newPage: FormPage = {
      title: pageTitle.trim(),
      questions: currentPage?.questions || [],
      contextElements: contextElements.length > 0 ? contextElements : undefined,
    };
    onSave(newPage);
    onClose();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageTitle(e.target.value);
  };

  if (!isOpen) return null;

  const isSaveDisabled = !pageTitle.trim();

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8'
      role='dialog'
      aria-labelledby={modalHeadingId}
      aria-modal='true'
    >
      {/* Backdrop overlay */}
      <div
        className='fixed inset-0 animate-fade-in bg-black/40 backdrop-blur-sm transition-opacity'
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Modal container */}
      <div className='relative w-full max-w-xs animate-fade-in sm:max-w-md md:max-w-lg lg:max-w-2xl'>
        <div className='relative overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-800 sm:rounded-2xl'>
          {/* Header */}
          <ModalHeader
            isEdit={isEditMode}
            onClose={onClose}
            headingId={modalHeadingId}
          />

          {/* Content */}
          <div className='max-h-[50vh] overflow-y-auto px-4 py-4 sm:max-h-[60vh] sm:px-6 sm:py-6 md:max-h-[70vh] md:px-8 lg:max-h-[calc(80vh-8rem)]'>
            <div className='space-y-4 sm:space-y-6'>
              <div className='space-y-1 sm:space-y-2'>
                <label
                  htmlFor={pageTitleId}
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Page Title
                </label>
                <input
                  type='text'
                  id={pageTitleId}
                  value={pageTitle}
                  onChange={handleTitleChange}
                  className='w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-400 sm:px-4 sm:py-3'
                  placeholder='Enter a descriptive title for your page...'
                  required
                  aria-required='true'
                />
              </div>

              <div className='pt-2 sm:pt-4'>
                <ContextElementEditor
                  elements={contextElements}
                  setElements={setContextElements}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <ModalFooter
            onCancel={onClose}
            onSave={handleSave}
            isSaveDisabled={isSaveDisabled}
            isEdit={isEditMode}
          />
        </div>
      </div>
    </div>
  );
};
