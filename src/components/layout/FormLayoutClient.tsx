"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Menu, X } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

export default function FormLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className='flex min-h-screen flex-col bg-white dark:bg-gray-900'>
      {/* Header */}
      <div className='relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-blue-500 dark:via-indigo-500 dark:to-blue-600'>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className='relative z-10 w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5'>
          <div className='flex w-full items-center justify-between'>
            {/* Logo - Visible on all screens */}
            <div className='flex items-center gap-2'>
              <Link
                href='/'
                className='flex items-center gap-2 text-lg font-semibold text-white sm:text-xl'
              >
                <FileText className='h-6 w-6 text-white sm:h-7 sm:w-7' />
                <span className='whitespace-nowrap'>Chamuka FormIt</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden items-center gap-4 md:flex'>
              <Link
                href='/'
                className='flex items-center gap-2 rounded-md bg-white/20 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/30'
              >
                <ArrowLeft className='h-4 w-4' />
                Back to Home
              </Link>

              <AuthProvider className='flex items-center gap-2 rounded-md bg-white/20 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/30' />
            </div>

            {/* Mobile menu button */}
            <div className='flex md:hidden'>
              <button
                type='button'
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50'
                aria-expanded='false'
              >
                <span className='sr-only'>Open main menu</span>
                {mobileMenuOpen ? (
                  <X className='h-6 w-6' aria-hidden='true' />
                ) : (
                  <Menu className='h-6 w-6' aria-hidden='true' />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu, show/hide based on menu state */}
          {mobileMenuOpen && (
            <div className='mt-2 space-y-2 border-t border-white/20 pb-3 pt-3 md:hidden'>
              <Link
                href='/'
                className='flex items-center gap-2 px-4 py-2 text-base font-medium text-white hover:bg-white/10'
                onClick={() => setMobileMenuOpen(false)}
              >
                <ArrowLeft className='h-5 w-5' />
                Back to Home
              </Link>
              <div
                className='px-4 py-2'
                onClick={() => setMobileMenuOpen(false)}
              >
                <AuthProvider className='flex w-full items-center justify-center gap-2 rounded-md bg-white/20 px-3 py-2 text-base font-medium text-white transition-colors hover:bg-white/30' />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className='flex-grow'>{children}</div>

      {/* Toast container for notifications */}
      <ToastContainer position='bottom-right' />
    </div>
  );
}
