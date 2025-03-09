"use client";

import { ContextElement, ContextElementType } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import { useId } from "react";

interface ContextElementEditorProps {
  elements: ContextElement[];
  setElements: (elements: ContextElement[]) => void;
}

interface ElementLabelProps {
  type: ContextElementType;
}

interface AddElementButtonProps {
  type: ContextElementType;
  onClick: () => void;
}

const ElementLabel = ({ type }: ElementLabelProps) => {
  const labelText =
    type === "paragraph"
      ? "Paragraph:"
      : type === "image"
        ? "Image URL:"
        : "Video URL:";

  return (
    <label className='min-w-[80px] text-sm font-medium text-gray-700 dark:text-gray-300 sm:min-w-[100px] sm:text-base'>
      {labelText}
    </label>
  );
};

const AddElementButton = ({ type, onClick }: AddElementButtonProps) => {
  const label = `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;

  return (
    <button
      type='button'
      onClick={onClick}
      className='flex items-center gap-1 rounded bg-gray-100 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 sm:px-3 sm:py-2 sm:text-sm'
      aria-label={label}
    >
      <Plus className='h-3 w-3 sm:h-4 sm:w-4' />
      {label}
    </button>
  );
};

export const ContextElementEditor = ({
  elements,
  setElements,
}: ContextElementEditorProps) => {
  const headingId = useId();

  const handleAddElement = (elementType: ContextElementType): void => {
    setElements([...elements, { type: elementType, content: "" }]);
  };

  const handleRemoveElement = (index: number): void => {
    setElements(elements.filter((_, i) => i !== index));
  };

  const handleUpdateElement = (index: number, content: string): void => {
    const updatedElements = [...elements];
    updatedElements[index] = { ...updatedElements[index], content };
    setElements(updatedElements);
  };

  const getPlaceholder = (type: ContextElementType): string => {
    switch (type) {
      case "paragraph":
        return "Enter paragraph text...";
      case "image":
        return "Enter image URL...";
      case "video":
        return "Enter video URL...";
      default:
        return "";
    }
  };

  return (
    <div>
      <h3
        id={headingId}
        className='mb-1 block text-sm font-bold text-gray-700 dark:text-gray-300 sm:mb-2 sm:text-base'
      >
        Context Elements
      </h3>

      <div className='space-y-2 sm:space-y-3' aria-labelledby={headingId}>
        {elements.map((element, index) => {
          const inputId = `element-${index}-${element.type}`;
          return (
            <div
              key={index}
              className='flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2'
            >
              <ElementLabel type={element.type} />
              <div className='flex w-full items-center gap-1 sm:gap-2'>
                <input
                  id={inputId}
                  type='text'
                  value={element.content}
                  onChange={(e) => handleUpdateElement(index, e.target.value)}
                  className='flex-1 rounded border p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 sm:p-2 sm:text-base'
                  placeholder={getPlaceholder(element.type)}
                  aria-label={`${element.type} content`}
                />
                <button
                  onClick={() => handleRemoveElement(index)}
                  className='rounded-full p-1.5 text-red-500 hover:bg-gray-100 hover:text-red-700 dark:hover:bg-gray-700 sm:p-2'
                  aria-label={`Remove ${element.type}`}
                  title={`Remove ${element.type}`}
                >
                  <Trash2 className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {elements.length === 0 && (
        <p className='my-2 text-sm italic text-gray-500 dark:text-gray-400'>
          No context elements added yet. Add elements using the buttons below.
        </p>
      )}

      <div className='mt-3 flex flex-wrap gap-2'>
        <AddElementButton
          type='paragraph'
          onClick={() => handleAddElement("paragraph")}
        />
        <AddElementButton
          type='image'
          onClick={() => handleAddElement("image")}
        />
        <AddElementButton
          type='video'
          onClick={() => handleAddElement("video")}
        />
      </div>
    </div>
  );
};
