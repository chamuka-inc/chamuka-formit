"use client";

import { Question as QuestionType } from '@/lib/types';
import { ContextElements } from './ContextElements';
import { Pencil, Trash2, MessageSquare, CheckSquare, AlignLeft } from 'lucide-react';

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

  const QuestionTypeIcon = {
    text: AlignLeft,
    radio: MessageSquare,
    checkbox: CheckSquare,
  }[question.type];

  return (
    <div className={`
      group relative rounded-xl border transition-all duration-200
      ${isBuilder
        ? 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400'
        : 'border-transparent'
      }
      bg-white dark:bg-gray-800 shadow-sm hover:shadow-md
    `}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`
            mt-1 p-2 rounded-lg
            ${isBuilder
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
            }
          `}>
            <QuestionTypeIcon className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            {question.contextElements && question.contextElements.length > 0 && (
              <div className="mb-6">
                <ContextElements elements={question.contextElements} />
              </div>
            )}
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {question.text}
            </h3>

            {question.type === 'text' && !isBuilder && (
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow"
                placeholder="Type your answer here..."
              />
            )}

            {(question.type === 'radio' || question.type === 'checkbox') && (
              <div className="space-y-3">
                {question.options?.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700
                      ${!isBuilder && 'cursor-pointer hover:border-blue-500 dark:hover:border-blue-400'}
                    `}
                  >
                    <input
                      type={question.type}
                      name={isBuilder ? undefined : question.text.replace(/\s/g, '')}
                      disabled={isBuilder}
                      className={`
                        h-4 w-4 border-2 transition-colors
                        ${question.type === 'radio'
                          ? 'rounded-full'
                          : 'rounded'
                        }
                        ${isBuilder
                          ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700'
                          : 'border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400'
                        }
                      `}
                    />
                    <span className="text-gray-700 dark:text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isBuilder && (
        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-2 rounded-lg text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Edit question"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Delete question"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}; 