"use client";

import { Question as QuestionType } from "@/lib/types";
import { ContextElements } from "./ContextElements";
import { Pencil, Trash2 } from "lucide-react";
import { LatexText } from "@/components/LatexText";

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
        isBuilder ? "border-border hover:border-primary" : "border-transparent"
      } bg-background shadow-sm hover:shadow-md`}
      data-question-id={question.id}
    >
      {question.contextElements && question.contextElements.length > 0 && (
        <div className='mb-2 sm:mb-3 md:mb-6'>
          <ContextElements elements={question.contextElements} />
        </div>
      )}

      <h3 className='mb-2 pr-12 text-sm font-semibold text-foreground sm:mb-3 sm:pr-14 md:mb-4 md:pr-0 md:text-lg'>
        <LatexText>{question.text}</LatexText>
        {question.required && <span className='ml-1 text-destructive'>*</span>}
      </h3>

      {question.type === "text" && !isBuilder && (
        <input
          type='text'
          className='w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs text-foreground placeholder-muted-foreground transition-shadow focus:border-input-focus focus:outline-none focus:ring-2 focus:ring-ring sm:px-3 sm:py-2 sm:text-sm md:px-4 md:py-3 md:text-base'
          placeholder='Type your answer here...'
        />
      )}

      {(question.type === "radio" || question.type === "checkbox") && (
        <div className='space-y-1 sm:space-y-1.5 md:space-y-3'>
          {question.options?.map((option, optionIndex) => (
            <label
              key={optionIndex}
              className={`flex items-center gap-1.5 rounded-lg border border-border p-1.5 sm:gap-2 sm:p-2 md:gap-3 md:p-3 ${!isBuilder && "cursor-pointer transition-colors hover:border-primary"} `}
            >
              <input
                type={question.type}
                name={isBuilder ? undefined : question.text.replace(/\s/g, "")}
                disabled={isBuilder}
                className={`h-3 w-3 border-2 transition-colors sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 ${question.type === "radio" ? "rounded-full" : "rounded"} ${
                  isBuilder
                    ? "border-muted bg-muted"
                    : "border-input text-primary focus:ring-ring"
                } `}
              />
              <span className='text-xs text-foreground-secondary sm:text-sm md:text-base'>
                <LatexText>{option}</LatexText>
              </span>
            </label>
          ))}
        </div>
      )}

      {isBuilder && (
        <div className='absolute right-1.5 top-1.5 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 sm:right-2.5 sm:top-2.5 sm:gap-1 md:right-4 md:top-4 md:gap-2'>
          <button
            onClick={handleEdit}
            className='rounded-lg p-0.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary sm:p-1 md:p-2'
            title='Edit question'
          >
            <Pencil className='h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4' />
          </button>
          <button
            onClick={handleDelete}
            className='rounded-lg p-0.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive sm:p-1 md:p-2'
            title='Delete question'
          >
            <Trash2 className='h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4' />
          </button>
        </div>
      )}
    </div>
  );
};
