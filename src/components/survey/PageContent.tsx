"use client";

import { useSurveyContext } from '@/lib/context/SurveyContext';
import { Question } from './Question';
import { ContextElements } from './ContextElements';
import { Pencil, Plus, Trash2 } from 'lucide-react';

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
      <div className="p-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">Page Content</h2>
        <div className="text-gray-600 dark:text-gray-400">Please select a page to view content.</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 sm:mb-0 text-gray-800 dark:text-gray-100">
          {currentPage.title}
        </h2>
        <button
          onClick={onEditPage}
          className="bg-white dark:bg-gray-800 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 font-semibold py-3 px-6 sm:px-8 rounded-xl shadow transition-all transform hover:scale-105 flex items-center gap-2"
        >
          <Pencil className="h-5 w-5" />
          Edit Page
        </button>
      </div>

      {currentPage.pageType === 'info' ? (
        <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
          {currentPage.contextElements && currentPage.contextElements.length > 0 ? (
            <ContextElements elements={currentPage.contextElements} />
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No content added.</p>
          )}
        </div>
      ) : (
        <div className="space-y-8">
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
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        {currentPage.pageType === 'survey' && (
          <button
            onClick={onAddQuestion}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 sm:py-4 sm:px-8 rounded-xl shadow transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Question
          </button>
        )}
        <button
          onClick={handleDeletePage}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 sm:py-4 sm:px-8 rounded-xl shadow transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <Trash2 className="h-5 w-5" />
          Delete Page
        </button>
      </div>
    </div>
  );
}; 