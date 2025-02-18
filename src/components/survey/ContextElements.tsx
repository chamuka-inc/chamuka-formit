"use client";

import { ContextElement } from '@/lib/types';

interface ContextElementsProps {
  elements?: ContextElement[];
}

export const ContextElements = ({ elements }: ContextElementsProps) => {
  if (!elements || elements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {elements.map((element, index) => {
        if (element.type === 'paragraph') {
          return (
            <p key={index} className="text-base text-gray-700 dark:text-gray-300">
              {element.content}
            </p>
          );
        } else if (element.type === 'image') {
          return (
            <img
              key={index}
              src={element.content}
              alt="Context"
              className="w-full rounded-lg shadow-sm"
            />
          );
        } else if (element.type === 'video') {
          return (
            <div key={index} className="w-full aspect-video rounded-lg overflow-hidden shadow-sm">
              <iframe
                src={element.content}
                title="Video"
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}; 