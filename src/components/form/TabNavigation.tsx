"use client";

import { PencilRuler, Eye } from "lucide-react";

interface TabNavigationProps {
  activeTab: "builder" | "preview";
  onTabChange: (tab: "builder" | "preview") => void;
}

export const TabNavigation = ({
  activeTab,
  onTabChange,
}: TabNavigationProps) => {
  return (
    <div className='inline-flex rounded-lg bg-gray-100 p-0.5 backdrop-blur-sm dark:bg-gray-700/50 sm:rounded-xl sm:p-1'>
      <button
        onClick={() => onTabChange("builder")}
        className={`flex items-center gap-1 rounded-md px-2.5 py-2 text-xs font-medium transition-all duration-200 sm:gap-2 sm:rounded-lg sm:px-6 sm:py-3 sm:text-sm ${
          activeTab === "builder"
            ? "bg-white text-blue-600 shadow-sm dark:bg-gray-800 dark:text-blue-400"
            : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
        } `}
      >
        <PencilRuler className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
        <span>Builder</span>
      </button>
      <button
        onClick={() => onTabChange("preview")}
        className={`flex items-center gap-1 rounded-md px-2.5 py-2 text-xs font-medium transition-all duration-200 sm:gap-2 sm:rounded-lg sm:px-6 sm:py-3 sm:text-sm ${
          activeTab === "preview"
            ? "bg-white text-blue-600 shadow-sm dark:bg-gray-800 dark:text-blue-400"
            : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
        } `}
      >
        <Eye className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
        <span>Preview</span>
      </button>
    </div>
  );
};
