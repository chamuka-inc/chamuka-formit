"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

export function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='relative'>
      <button
        type='button'
        className='rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className='h-5 w-5' />
      </button>

      {isOpen && (
        <div className='absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800'>
          <div className='border-b border-gray-200 px-4 py-2 dark:border-gray-700'>
            <h3 className='text-sm font-semibold text-gray-900 dark:text-white'>
              Notifications
            </h3>
          </div>
          <div className='px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400'>
            No new notifications
          </div>
        </div>
      )}
    </div>
  );
}
