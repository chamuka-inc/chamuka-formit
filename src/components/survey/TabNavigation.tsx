"use client";

import { PencilRuler, Eye } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'builder' | 'preview';
  onTabChange: (tab: 'builder' | 'preview') => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-gray-700/50 backdrop-blur-sm">
      <button
        onClick={() => onTabChange('builder')}
        className={`
          flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200
          ${activeTab === 'builder'
            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
          }
        `}
      >
        <PencilRuler className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="whitespace-nowrap">Builder</span>
      </button>
      <button
        onClick={() => onTabChange('preview')}
        className={`
          flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200
          ${activeTab === 'preview'
            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
          }
        `}
      >
        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="whitespace-nowrap">Preview</span>
      </button>
    </div>
  );
}; 