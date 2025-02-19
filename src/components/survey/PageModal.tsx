"use client";

import { useState, useEffect } from 'react';
import { SurveyPage, ContextElement } from '@/lib/types';
import { ContextElementEditor } from './ContextElementEditor';
import { X, FileText, Info } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-11/12 max-w-2xl animate-fade-in">
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
          {/* Header */}
          <div className="relative px-8 py-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              {pageType === 'survey' ? (
                <FileText className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              ) : (
                <Info className="h-6 w-6 text-purple-500 dark:text-purple-400" />
              )}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {currentPage ? 'Edit Page' : 'Add Page'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="absolute right-6 top-6 p-2 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-6 max-h-[calc(80vh-8rem)] overflow-y-auto">
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="page-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Page Title
                </label>
                <input
                  type="text"
                  id="page-title"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow"
                  placeholder="Enter a descriptive title for your page..."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="page-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Page Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPageType('survey')}
                    className={`
                      flex items-center gap-3 p-4 rounded-lg border-2 transition-all
                      ${pageType === 'survey'
                        ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-500/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400'
                      }
                    `}
                  >
                    <FileText className={`h-5 w-5 ${
                      pageType === 'survey'
                        ? 'text-blue-500 dark:text-blue-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    <span className={`font-medium ${
                      pageType === 'survey'
                        ? 'text-blue-700 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      Survey Page
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPageType('info')}
                    className={`
                      flex items-center gap-3 p-4 rounded-lg border-2 transition-all
                      ${pageType === 'info'
                        ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-500/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400'
                      }
                    `}
                  >
                    <Info className={`h-5 w-5 ${
                      pageType === 'info'
                        ? 'text-purple-500 dark:text-purple-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    <span className={`font-medium ${
                      pageType === 'info'
                        ? 'text-purple-700 dark:text-purple-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      Info Page
                    </span>
                  </button>
                </div>
              </div>

              {pageType === 'info' && (
                <div className="pt-4">
                  <ContextElementEditor
                    elements={contextElements}
                    setElements={setContextElements}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 px-8 py-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!pageTitle.trim()}
                className={`
                  px-6 py-2.5 rounded-lg font-medium transition-all
                  ${pageTitle.trim()
                    ? 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transform hover:scale-[1.02]'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {currentPage ? 'Save Changes' : 'Create Page'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 