"use client";

import { ContextElement } from '@/lib/types';
import { Plus, Trash2 } from 'lucide-react';

interface ContextElementEditorProps {
  elements: ContextElement[];
  setElements: (elements: ContextElement[]) => void;
}

export const ContextElementEditor = ({ elements, setElements }: ContextElementEditorProps) => {
  const addContextElement = (elementType: 'paragraph' | 'image' | 'video') => {
    setElements([...elements, { type: elementType, content: '' }]);
  };

  const removeContextElement = (index: number) => {
    setElements(elements.filter((_, i) => i !== index));
  };

  const updateContextElement = (index: number, value: string) => {
    const updatedElements = [...elements];
    updatedElements[index] = { ...updatedElements[index], content: value };
    setElements(updatedElements);
  };

  return (
    <div>
      <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
        Context Elements
      </label>
      <div className="space-y-3">
        {elements.map((element, index) => (
          <div key={index} className="flex items-center gap-2">
            <label className="font-medium text-gray-700 dark:text-gray-300 min-w-[100px]">
              {element.type === 'paragraph'
                ? 'Paragraph:'
                : element.type === 'image'
                ? 'Image URL:'
                : 'Video URL:'}
            </label>
            <input
              type="text"
              value={element.content}
              onChange={(e) => updateContextElement(index, e.target.value)}
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              placeholder={
                element.type === 'paragraph'
                  ? 'Enter paragraph text...'
                  : element.type === 'image'
                  ? 'Enter image URL...'
                  : 'Enter video URL...'
              }
            />
            <button
              onClick={() => removeContextElement(index)}
              className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={() => addContextElement('paragraph')}
          className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Paragraph
        </button>
        <button
          type="button"
          onClick={() => addContextElement('image')}
          className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Image
        </button>
        <button
          type="button"
          onClick={() => addContextElement('video')}
          className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Video
        </button>
      </div>
    </div>
  );
}; 