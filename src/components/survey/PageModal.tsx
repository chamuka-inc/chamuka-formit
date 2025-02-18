"use client";

import { useState, useEffect } from 'react';
import { SurveyPage, ContextElement } from '@/lib/types';
import { ContextElementEditor } from './ContextElementEditor';
import { X } from 'lucide-react';

interface PageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage?: SurveyPage;
  onSave: (page: SurveyPage) => void;
}

export const PageModal = ({
  isOpen,
  onClose,
  currentPage,
  onSave,
}: PageModalProps) => {
  const [pageTitle, setPageTitle] = useState('');
  const [pageType, setPageType] = useState<'survey' | 'info'>('survey');
  const [contextElements, setContextElements] = useState<ContextElement[]>([]);

  useEffect(() => {
    if (isOpen && currentPage) {
      setPageTitle(currentPage.title);
      setPageType(currentPage.pageType);
      setContextElements(currentPage.contextElements || []);
    } else {
      setPageTitle('');
      setPageType('survey');
      setContextElements([]);
    }
  }, [isOpen, currentPage]);

  const handleSave = () => {
    const newPage: SurveyPage = {
      title: pageTitle,
      pageType: pageType,
      questions: currentPage?.questions || [],
      contextElements: pageType === 'info' ? contextElements : undefined,
    };
    onSave(newPage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 sm:p-8 w-11/12 max-w-md transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
            {currentPage ? 'Edit Page' : 'Add Page'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="page-title" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
              Page Title
            </label>
            <input
              type="text"
              id="page-title"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              placeholder="Enter page title..."
            />
          </div>

          <div>
            <label htmlFor="page-type" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
              Page Type
            </label>
            <select
              id="page-type"
              value={pageType}
              onChange={(e) => setPageType(e.target.value as 'survey' | 'info')}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            >
              <option value="survey">Survey Page</option>
              <option value="info">Information Page</option>
            </select>
          </div>

          {pageType === 'info' && (
            <ContextElementEditor
              elements={contextElements}
              setElements={setContextElements}
            />
          )}

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-all transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!pageTitle.trim()}
              className={`
                bg-blue-500 text-white font-bold py-2 px-4 rounded transition-all transform
                ${pageTitle.trim()
                  ? 'hover:bg-blue-600 hover:scale-105'
                  : 'opacity-50 cursor-not-allowed'
                }
              `}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 