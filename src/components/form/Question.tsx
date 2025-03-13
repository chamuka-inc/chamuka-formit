"use client";

import { Question as QuestionType } from "@/lib/types";
import { ContextElements } from "./ContextElements";
import { Pencil, Trash2 } from "lucide-react";

interface QuestionProps {
  question: QuestionType;
  index?: number;
  mode?: "builder" | "preview";
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
}

export const Question = ({
  question,
  index = -1,
  mode = "preview",
  onEdit,
  onDelete,
}: QuestionProps) => {
  const isBuilder = mode === "builder";

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
    <div
      className={`group relative rounded-lg border p-3 transition-all duration-200 sm:rounded-xl sm:p-4 md:p-6 ${
        isBuilder
          ? "border-gray-200 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-400"
          : "border-transparent"
      } bg-white shadow-sm hover:shadow-md dark:bg-gray-800`}
      data-question-id={question.id}
    >
      {question.contextElements && question.contextElements.length > 0 && (
        <div className='mb-2 sm:mb-3 md:mb-6'>
          <ContextElements elements={question.contextElements} />
        </div>
      )}

      <h3 className='mb-2 pr-12 text-sm font-semibold text-gray-900 dark:text-gray-100 sm:mb-3 sm:pr-14 md:mb-4 md:pr-0 md:text-lg'>
        {question.text}
        {question.required && (
          <span className='ml-1 text-red-500 dark:text-red-400'>*</span>
        )}
      </h3>

      {question.type === "text" && !isBuilder && (
        <input
          type='text'
          className='w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-900 placeholder-gray-400 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-400 sm:px-3 sm:py-2 sm:text-sm md:px-4 md:py-3 md:text-base'
          placeholder='Type your answer here...'
        />
      )}

      {(question.type === "radio" || question.type === "checkbox") && (
        <div className='space-y-1 sm:space-y-1.5 md:space-y-3'>
          {question.options?.map((option, optionIndex) => (
            <label
              key={optionIndex}
              className={`flex items-center gap-1.5 rounded-lg border border-gray-200 p-1.5 dark:border-gray-700 sm:gap-2 sm:p-2 md:gap-3 md:p-3 ${!isBuilder && "cursor-pointer hover:border-blue-500 dark:hover:border-blue-400"} `}
            >
              <input
                type={question.type}
                name={isBuilder ? undefined : question.text.replace(/\s/g, "")}
                disabled={isBuilder}
                className={`h-3 w-3 border-2 transition-colors sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 ${question.type === "radio" ? "rounded-full" : "rounded"} ${
                  isBuilder
                    ? "border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700"
                    : "border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                } `}
              />
              <span className='text-xs text-gray-700 dark:text-gray-300 sm:text-sm md:text-base'>
                {option}
              </span>
            </label>
          ))}
        </div>
      )}

      {isBuilder && (
        <div className='absolute right-1.5 top-1.5 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 sm:right-2.5 sm:top-2.5 sm:gap-1 md:right-4 md:top-4 md:gap-2'>
          <button
            onClick={handleEdit}
            className='rounded-lg p-0.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400 sm:p-1 md:p-2'
            title='Edit question'
          >
            <Pencil className='h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4' />
          </button>
          <button
            onClick={handleDelete}
            className='rounded-lg p-0.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400 sm:p-1 md:p-2'
            title='Delete question'
          >
            <Trash2 className='h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4' />
          </button>
        </div>
      )}
    </div>
  );
};
