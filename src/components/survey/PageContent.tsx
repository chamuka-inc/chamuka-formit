"use client";

import { useSurveyContext } from '@/lib/context/SurveyContext';
import { Question } from './Question';
import { ContextElements } from './ContextElements';
import { Pencil, Plus, Trash2, FileText } from 'lucide-react';

interface PageContentProps {
  onEditPage: () => void;
  onAddQuestion: (questionIndex?: number) => void;
}

export const PageContent = ({ onEditPage, onAddQuestion }: PageContentProps) => {
  const { 
    state: { pages, currentPageIndex },
    deleteQuestion,
    deletePage
  } = useSurveyContext();
  
  const currentPage = pages[currentPageIndex];

  const handleDeletePage = () => {
    deletePage(currentPageIndex);
  };

  if (!currentPage) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center p-4 sm:p-8 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Page Selected</h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-sm">
          Select a page from the sidebar or create a new one to start building your survey.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 dark:text-gray-500" />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {currentPage.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {currentPage.questions?.length ? `${currentPage.questions.length} question${currentPage.questions.length !== 1 ? 's' : ''}` : 'No questions'}
              {currentPage.contextElements?.length ? `, ${currentPage.contextElements.length} content element${currentPage.contextElements.length !== 1 ? 's' : ''}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onEditPage}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Edit Page
          </button>
          <button
            onClick={handleDeletePage}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-sm"
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Context Elements Section */}
        {currentPage.contextElements && currentPage.contextElements.length > 0 && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
            <ContextElements elements={currentPage.contextElements} />
          </div>
        )}

        {/* Questions Section */}
        {currentPage.questions?.map((question, index) => (
          <Question
            key={index}
            question={question}
            index={index}
            mode="builder"
            onEdit={(index) => onAddQuestion(index)}
            onDelete={() => deleteQuestion(currentPageIndex, index)}
          />
        ))}

        {(!currentPage.questions?.length && !currentPage.contextElements?.length) && (
          <div className="text-center py-8 sm:py-12 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <FileText className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-gray-400 dark:text-gray-500" />
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No content added to this page yet.</p>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1">Click the "Edit Page" button to add content or add a question below.</p>
          </div>
        )}

        <button
          onClick={() => onAddQuestion()}
          className="mt-6 sm:mt-8 w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:py-3 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium transition-colors text-sm"
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Add Question
        </button>
      </div>
    </div>
  );
}; 