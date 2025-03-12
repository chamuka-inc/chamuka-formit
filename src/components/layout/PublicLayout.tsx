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
      <div className='relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-blue-500 dark:via-indigo-500 dark:to-blue-600'>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className='relative z-10 w-full px-4 py-4 sm:px-6 sm:py-5 lg:px-8'>
          <div className='flex w-full items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Link
                href='/'
                className='flex items-center gap-2 text-xl font-semibold text-white'
              >
                <FileText className='h-7 w-7 text-white' />
                Chamuka FormIt
              </Link>
            </div>
            {showBackButton && (
              <Link
                href={backButtonHref}
                className='flex items-center gap-2 rounded-md bg-white/20 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/30'
              >
                <ArrowLeft className='h-4 w-4' />
                {backButtonText}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      {children}

      {/* Footer */}
      <footer className='border-t border-gray-200 bg-white py-8 dark:border-gray-700 dark:bg-gray-800'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center text-sm text-gray-600 dark:text-gray-400'>
            <p>
              &copy; {new Date().getFullYear()} Chamuka FormIt. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
