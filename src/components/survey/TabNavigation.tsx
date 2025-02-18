"use client";

interface TabNavigationProps {
  activeTab: 'builder' | 'preview';
  onTabChange: (tab: 'builder' | 'preview') => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="mb-8 border-b border-gray-300 dark:border-gray-700">
      <ul className="flex space-x-4 sm:space-x-8">
        <li>
          <button
            onClick={() => onTabChange('builder')}
            className={`
              py-3 px-4 sm:py-4 sm:px-8 font-semibold rounded-t-xl transition-all
              ${activeTab === 'builder'
                ? 'bg-white dark:bg-gray-800 text-blue-500 shadow'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }
            `}
          >
            Builder
          </button>
        </li>
        <li>
          <button
            onClick={() => onTabChange('preview')}
            className={`
              py-3 px-4 sm:py-4 sm:px-8 font-semibold rounded-t-xl transition-all
              ${activeTab === 'preview'
                ? 'bg-white dark:bg-gray-800 text-blue-500 shadow'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }
            `}
          >
            Preview
          </button>
        </li>
      </ul>
    </div>
  );
}; 