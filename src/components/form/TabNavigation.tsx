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
    <div className='inline-flex rounded-lg bg-muted p-0.5 backdrop-blur-sm sm:rounded-xl sm:p-1'>
      <button
        onClick={() => onTabChange("builder")}
        className={`flex items-center gap-1 rounded-md px-2.5 py-2 text-xs font-medium transition-all duration-200 sm:gap-2 sm:rounded-lg sm:px-6 sm:py-3 sm:text-sm ${
          activeTab === "builder"
            ? "bg-background text-primary shadow-sm"
            : "text-foreground-secondary hover:text-foreground"
        } `}
      >
        <PencilRuler className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
        <span>Builder</span>
      </button>
      <button
        onClick={() => onTabChange("preview")}
        className={`flex items-center gap-1 rounded-md px-2.5 py-2 text-xs font-medium transition-all duration-200 sm:gap-2 sm:rounded-lg sm:px-6 sm:py-3 sm:text-sm ${
          activeTab === "preview"
            ? "bg-background text-primary shadow-sm"
            : "text-foreground-secondary hover:text-foreground"
        } `}
      >
        <Eye className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
        <span>Preview</span>
      </button>
    </div>
  );
};
