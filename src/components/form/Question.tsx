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
      className={`group relative rounded-lg border transition-all duration-200 sm:rounded-xl ${
        isBuilder
          ? "border-gray-200 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-400"
          : "border-transparent"
      } bg-white shadow-sm hover:shadow-md dark:bg-gray-800`}
    >
      <div className='p-3 sm:p-6'>
        <div className='min-w-0 flex-1'>
          {question.contextElements && question.contextElements.length > 0 && (
            <div className='mb-3 sm:mb-6'>
              <ContextElements elements={question.contextElements} />
            </div>
          )}

          <h3 className='mb-2.5 pr-16 text-sm font-semibold text-gray-900 dark:text-gray-100 sm:mb-4 sm:pr-0 sm:text-lg'>
            {question.text}
          </h3>

          {question.type === "text" && !isBuilder && (
            <input
              type='text'
              className='w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-400 sm:px-4 sm:py-3 sm:text-base'
              placeholder='Type your answer here...'
            />
          )}

          {(question.type === "radio" || question.type === "checkbox") && (
            <div className='space-y-1.5 sm:space-y-3'>
              {question.options?.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className={`flex items-center gap-2 rounded-lg border border-gray-200 p-2 dark:border-gray-700 sm:gap-3 sm:p-3 ${!isBuilder && "cursor-pointer hover:border-blue-500 dark:hover:border-blue-400"} `}
                >
                  <input
                    type={question.type}
                    name={
                      isBuilder ? undefined : question.text.replace(/\s/g, "")
                    }
                    disabled={isBuilder}
                    className={`h-3.5 w-3.5 border-2 transition-colors sm:h-4 sm:w-4 ${question.type === "radio" ? "rounded-full" : "rounded"} ${
                      isBuilder
                        ? "border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700"
                        : "border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                    } `}
                  />
                  <span className='text-xs text-gray-700 dark:text-gray-300 sm:text-base'>
                    {option}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {isBuilder && (
        <div className='absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 sm:right-4 sm:top-4 sm:gap-2'>
          <button
            onClick={handleEdit}
            className='rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400 sm:p-2'
            title='Edit question'
          >
            <Pencil className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
          </button>
          <button
            onClick={handleDelete}
            className='rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400 sm:p-2'
            title='Delete question'
          >
            <Trash2 className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
          </button>
        </div>
      )}
    </div>
  );
};
