"use client";

import { useSurveyContext } from '@/lib/context/SurveyContext';
import { Question } from './Question';
import { ContextElements } from './ContextElements';
import { Pencil, Plus, Trash2, FileText, Info } from 'lucide-react';

interface PageContentProps {
  onEditPage: () => void;
  onAddQuestion: () => void;
}

export const PageContent = ({ onEditPage, onAddQuestion }: PageContentProps) => {
  const { pages, currentPageIndex, deleteQuestion, deletePage } = useSurveyContext();
  const currentPage = pages[currentPageIndex];

  const handleDeletePage = () => {
    deletePage(currentPageIndex);
  };

  if (!currentPage) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Page Selected</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          Select a page from the sidebar or create a new one to start building your survey.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          {currentPage.pageType === 'survey' ? (
            <FileText className="h-6 w-6 text-gray-400 dark:text-gray-500" />
          ) : (
            <Info className="h-6 w-6 text-gray-400 dark:text-gray-500" />
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {currentPage.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentPage.pageType === 'survey'
                ? `${currentPage.questions.length} question${currentPage.questions.length !== 1 ? 's' : ''}`
                : 'Information page'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <button
            onClick={onEditPage}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Edit Page
          </button>
          <button
            onClick={handleDeletePage}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {currentPage.pageType === 'info' ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          {currentPage.contextElements && currentPage.contextElements.length > 0 ? (
            <ContextElements elements={currentPage.contextElements} />
          ) : (
            <div className="text-center py-8">
              <Info className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <p className="text-gray-500 dark:text-gray-400">No content added to this information page yet.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Click the "Edit Page" button to add content.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {currentPage.questions.map((question, index) => (
            <Question
              key={index}
              question={question}
              index={index}
              mode="builder"
              onEdit={onAddQuestion}
              onDelete={() => deleteQuestion(currentPageIndex, index)}
            />
          ))}

          {currentPage.questions.length === 0 && (
            <div className="text-center py-12 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <p className="text-gray-500 dark:text-gray-400">No questions added to this survey page yet.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Click the button below to add your first question.</p>
            </div>
          )}

          <button
            onClick={onAddQuestion}
            className="mt-8 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </button>
        </div>
      )}
    </div>
  );
}; 