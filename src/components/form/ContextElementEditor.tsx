"use client";

import { ContextElement, ContextElementType } from "@/lib/types";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";

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
  const [collapsedElements, setCollapsedElements] = useState<number[]>([]);

  const handleAddElement = (elementType: ContextElementType): void => {
    setElements([...elements, { type: elementType, content: "" }]);
  };

  const handleRemoveElement = (index: number): void => {
    setElements(elements.filter((_, i) => i !== index));
    // Remove the index from collapsed state if it exists
    setCollapsedElements(collapsedElements.filter((i) => i !== index));
  };

  const handleUpdateElement = (index: number, content: string): void => {
    const updatedElements = [...elements];
    updatedElements[index] = { ...updatedElements[index], content };
    setElements(updatedElements);
  };

  const toggleCollapse = (index: number): void => {
    if (collapsedElements.includes(index)) {
      setCollapsedElements(collapsedElements.filter((i) => i !== index));
    } else {
      setCollapsedElements([...collapsedElements, index]);
    }
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
          const isCollapsed = collapsedElements.includes(index);

          return (
            <div
              key={index}
              className='overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700'
            >
              <div className='flex items-center justify-between bg-gray-50 p-2 dark:bg-gray-800 sm:p-3'>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => toggleCollapse(index)}
                    className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    aria-label={isCollapsed ? "Expand" : "Collapse"}
                    title={isCollapsed ? "Expand" : "Collapse"}
                  >
                    {isCollapsed ? (
                      <ChevronDown className='h-4 w-4' />
                    ) : (
                      <ChevronUp className='h-4 w-4' />
                    )}
                  </button>
                  <ElementLabel type={element.type} />
                  {isCollapsed && (
                    <span className='max-w-[200px] truncate text-xs text-gray-500 dark:text-gray-400'>
                      {element.content || "Empty"}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveElement(index)}
                  className='ml-2 rounded-full p-1 text-red-500 hover:bg-gray-200 hover:text-red-700 dark:hover:bg-gray-700'
                  aria-label={`Remove ${element.type}`}
                  title={`Remove ${element.type}`}
                >
                  <Trash2 className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                </button>
              </div>

              {!isCollapsed && (
                <div className='p-2 sm:p-3'>
                  {element.type === "paragraph" ? (
                    <textarea
                      id={inputId}
                      value={element.content}
                      onChange={(e) =>
                        handleUpdateElement(index, e.target.value)
                      }
                      className='min-h-[100px] w-full resize-y rounded border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 sm:text-base'
                      placeholder={getPlaceholder(element.type)}
                      aria-label={`${element.type} content`}
                    />
                  ) : (
                    <input
                      id={inputId}
                      type='text'
                      value={element.content}
                      onChange={(e) =>
                        handleUpdateElement(index, e.target.value)
                      }
                      className='w-full rounded border p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 sm:p-2 sm:text-base'
                      placeholder={getPlaceholder(element.type)}
                      aria-label={`${element.type} content`}
                    />
                  )}
                </div>
              )}
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
