"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  X,
  FileText,
  LayoutGrid,
  Settings,
  LogOut,
  Sparkles,
  PlusCircle,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { isPathActive } from "@/lib/utils/shared";

interface SurveyInfo {
  id: string;
  type: string;
}

interface MobileMenuProps {
  onClose: () => void;
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <div className='lg:hidden'>
      <div className='fixed inset-0 z-50' onClick={onClose} />
      <div className='fixed inset-y-0 right-0 z-50 w-full bg-white px-6 py-6 dark:bg-gray-800 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
        <div className='flex items-center justify-between'>
          <Link href='/' className='flex items-center gap-2' onClick={onClose}>
            <FileText className='h-8 w-8 text-blue-600 dark:text-blue-400' />
            <span className='text-xl font-semibold text-gray-900 dark:text-white'>
              Survey Builder
            </span>
          </Link>
          <button
            type='button'
            className='rounded-md p-2.5 text-gray-700 dark:text-gray-200'
            onClick={onClose}
          >
            <span className='sr-only'>Close menu</span>
            <X className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>
        <div className='mt-6 flow-root'>
          <div className='-my-6 divide-y divide-gray-500/10'>
            <div className='space-y-2 py-6'>
              {/* Dashboard link */}
              <Link
                href='/dashboard'
                className={`flex items-center rounded-lg ${
                  isPathActive(pathname, "/dashboard") || pathname === "/"
                    ? "bg-gray-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                    : "text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700"
                } px-3 py-2 text-base font-semibold leading-7`}
                onClick={onClose}
              >
                <LayoutGrid className='mr-2 h-5 w-5' />
                Dashboard
              </Link>

              {/* Create Survey link */}
              <Link
                href='/surveys/create'
                className={`flex items-center rounded-lg ${
                  isPathActive(pathname, "/surveys/create")
                    ? "bg-gray-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                    : "text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700"
                } px-3 py-2 text-base font-semibold leading-7`}
                onClick={onClose}
              >
                <PlusCircle className='mr-2 h-5 w-5' />
                Create Survey
              </Link>
            </div>
            <div className='py-6'>
              <div className='mb-4 flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-900 dark:text-white'>
                  Theme
                </span>
                <ThemeToggle />
              </div>
              <Link
                href='/credits'
                className='mb-2 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700'
                onClick={onClose}
              >
                <div className='flex items-center'>
                  <Sparkles className='mr-2 h-5 w-5' />
                  Credits
                </div>
              </Link>
              <Link
                href='/settings'
                className='block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700'
                onClick={onClose}
              >
                <div className='flex items-center'>
                  <Settings className='mr-2 h-5 w-5' />
                  Settings
                </div>
              </Link>
              <Link
                href='/auth/signout'
                className='block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700'
                onClick={onClose}
              >
                <div className='flex items-center'>
                  <LogOut className='mr-2 h-5 w-5' />
                  Sign out
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
