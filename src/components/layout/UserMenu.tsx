"use client";

import { useState } from "react";
import Link from "next/link";
import { User, ChevronDown, Settings, LogOut } from "lucide-react";

interface UserMenuProps {
  userEmail: string;
}

export function UserMenu({ userEmail }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='relative ml-2'>
      <button
        type='button'
        className='flex items-center gap-x-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-blue-500'>
          <User className='h-4 w-4' />
        </div>
        <span className='hidden md:inline'>Account</span>
        <ChevronDown className='h-4 w-4' aria-hidden='true' />
      </button>

      {isOpen && (
        <div className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800'>
          <div className='border-b border-gray-200 px-4 py-3 dark:border-gray-700'>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Signed in as
            </p>
            <p className='truncate text-sm font-medium text-gray-900 dark:text-white'>
              {userEmail}
            </p>
          </div>
          <Link
            href='/settings'
            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
            onClick={() => setIsOpen(false)}
          >
            <div className='flex items-center'>
              <Settings className='mr-2 h-4 w-4' />
              Settings
            </div>
          </Link>
          <Link
            href='/auth/signout'
            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
            onClick={() => setIsOpen(false)}
          >
            <div className='flex items-center'>
              <LogOut className='mr-2 h-4 w-4' />
              Sign out
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
