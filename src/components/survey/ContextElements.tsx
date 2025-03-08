"use client";

import { ContextElement } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import VideoEmbed from "@/components/VideoEmbed";

interface ContextElementsProps {
  elements?: ContextElement[];
}

export const ContextElements = ({ elements }: ContextElementsProps) => {
  if (!elements || elements.length === 0) {
    return null;
  }

  return (
    <div className='space-y-4'>
      {elements.map((element, index) => {
        if (element.type === "paragraph") {
          return (
            <div key={index} className='prose max-w-none dark:prose-invert'>
              <ReactMarkdown>{element.content}</ReactMarkdown>
            </div>
          );
        } else if (element.type === "image") {
          return (
            <img
              key={index}
              src={element.content}
              alt='Context'
              className='w-full rounded-lg shadow-sm'
            />
          );
        } else if (element.type === "video") {
          return (
            <VideoEmbed
              key={index}
              url={element.content}
              className='rounded-lg shadow-sm'
            />
          );
        }
        return null;
      })}
    </div>
  );
};
