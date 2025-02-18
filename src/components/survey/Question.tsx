"use client";

import { Question as QuestionType } from '@/lib/types';
import { ContextElements } from './ContextElements';
import { Pencil, Trash2 } from 'lucide-react';

interface QuestionProps {
  question: QuestionType;
  index?: number;
  mode?: 'builder' | 'preview';
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
}

export const Question = ({
  question,
  index = -1,
  mode = 'preview',
  onEdit,
  onDelete,
}: QuestionProps) => {
  const isBuilder = mode === 'builder';

  const handleEdit = () => {
    if (isBuilder && onEdit && index !== -1) {
      onEdit(index);
    }
  };

  const handleDelete = () => {
    if (isBuilder && onDelete && index !== -1) {
      onDelete(index);
    }
  };

  return (
    <div className={`${isBuilder ? 'border' : ''} rounded-xl p-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow transition-shadow relative`}>
      {question.contextElements && question.contextElements.length > 0 && (
        <ContextElements elements={question.contextElements} />
      )}
      
      <p className="my-4 font-semibold text-2xl text-gray-800 dark:text-gray-100">
        {question.text}
      </p>

      {question.type === 'text' && !isBuilder && (
        <input
          type="text"
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          placeholder="Your answer"
        />
      )}

      {(question.type === 'radio' || question.type === 'checkbox') && (
        <ul className="space-y-3">
          {question.options?.map((option, optionIndex) => (
            <li key={optionIndex} className="flex items-center">
              <input
                type={question.type}
                name={isBuilder ? undefined : question.text.replace(/\s/g, '')}
                disabled={isBuilder}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-gray-700 dark:text-gray-300">{option}</span>
            </li>
          ))}
        </ul>
      )}

      {isBuilder && (
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={handleEdit}
            className="p-2 text-blue-500 hover:text-blue-700 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-500 hover:text-red-700 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}; 