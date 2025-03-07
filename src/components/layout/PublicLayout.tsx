import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

interface PublicLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
}

export default function PublicLayout({
  children,
  showBackButton = false,
  backButtonText = "Back to Home",
  backButtonHref = "/",
}: PublicLayoutProps) {
  return (
    <div className='flex min-h-screen flex-col bg-white dark:bg-gray-900'>
      {/* Header */}
      <header className='sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        <div className='flex h-16 items-center px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center'>
            <Link
              href='/'
              className='flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white'
            >
              <FileText className='h-8 w-8 text-blue-600 dark:text-blue-400' />
              Survey4
            </Link>
          </div>
          {showBackButton && (
            <Link
              href={backButtonHref}
              className='ml-auto flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
            >
              <ArrowLeft className='h-4 w-4' />
              {backButtonText}
            </Link>
          )}
        </div>
      </header>

      {/* Main content */}
      {children}

      {/* Footer */}
      <footer className='border-t border-gray-200 bg-white py-8 dark:border-gray-700 dark:bg-gray-800'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center text-sm text-gray-600 dark:text-gray-400'>
            <p>
              &copy; {new Date().getFullYear()} Survey4. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
