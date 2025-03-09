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
    <div className='space-y-2 sm:space-y-3 md:space-y-4'>
      {elements.map((element, index) => {
        if (element.type === "paragraph") {
          return (
            <div
              key={index}
              className='prose prose-sm max-w-none text-xs dark:prose-invert sm:prose-base sm:text-sm md:text-base'
            >
              <ReactMarkdown>{element.content}</ReactMarkdown>
            </div>
          );
        } else if (element.type === "image") {
          return (
            <div key={index} className='overflow-hidden'>
              <img
                src={element.content}
                alt='Context'
                className='w-full rounded-lg object-cover shadow-sm'
                loading='lazy'
              />
            </div>
          );
        } else if (element.type === "video") {
          return (
            <div
              key={index}
              className='aspect-video w-full overflow-hidden rounded-lg shadow-sm'
            >
              <VideoEmbed url={element.content} className='h-full w-full' />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};
