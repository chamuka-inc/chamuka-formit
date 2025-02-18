"use client";

import { useSurveyContext } from '@/lib/context/SurveyContext';
import { ArrowDown, ArrowUp, Plus } from 'lucide-react';

interface PageListSidebarProps {
  onAddPage: () => void;
}

export const PageListSidebar = ({ onAddPage }: PageListSidebarProps) => {
  const {
    pages,
    currentPageIndex,
    selectPage,
    movePageUp,
    movePageDown,
  } = useSurveyContext();

  return (
    <div className="md:w-1/4 p-4">
      <div className="mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Survey Pages
        </h2>
        <ul className="space-y-4">
          {pages.map((page, index) => (
            <li
              key={index}
              onClick={() => selectPage(index)}
              className={`
                cursor-pointer p-4 rounded-xl flex justify-between items-center
                bg-white/70 dark:bg-gray-800/70 hover:bg-white/80 dark:hover:bg-gray-800/80
                transition-all ${index === currentPageIndex ? 'shadow-md ring-2 ring-blue-500' : 'shadow-sm'}
              `}
            >
              <span className="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-200">
                {page.title}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    movePageUp(index);
                  }}
                  disabled={index === 0}
                  className={`p-1.5 rounded-full transition-colors
                    ${index === 0
                      ? 'text-gray-400 dark:text-gray-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                  title="Move Up"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    movePageDown(index);
                  }}
                  disabled={index === pages.length - 1}
                  className={`p-1.5 rounded-full transition-colors
                    ${index === pages.length - 1
                      ? 'text-gray-400 dark:text-gray-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                  title="Move Down"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={onAddPage}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 sm:py-4 sm:px-8 rounded-xl shadow transition-all transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <Plus className="h-5 w-5" />
        Add Page
      </button>
    </div>
  );
}; 