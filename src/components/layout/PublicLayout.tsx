"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, Menu, X } from "lucide-react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PublicLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
  showToasts?: boolean;
}

export default function PublicLayout({
  children,
  showBackButton = false,
  backButtonText = "Back to Home",
  backButtonHref = "/",
  showToasts = false,
}: PublicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className='flex min-h-screen flex-col bg-background'>
      {/* Header */}
      <div className='relative bg-primary'>
        <div className="opacity-light absolute inset-0 bg-[url('/grid.svg')]"></div>
        <div className='relative z-10 w-full px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4'>
          <div className='flex w-full items-center justify-between'>
            {/* Logo - Visible on all screens */}
            <div className='flex items-center gap-1.5 sm:gap-2'>
              <Link
                href='/'
                className='font-display flex items-center gap-1.5 text-base font-semibold text-primary-foreground sm:gap-2 sm:text-lg md:text-xl'
              >
                <FileText className='h-5 w-5 text-primary-foreground sm:h-6 sm:w-6 md:h-7 md:w-7' />
                <span className='whitespace-nowrap'>Chamuka FormIt</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden items-center gap-4 md:flex'>
              <AuthProvider className='flex items-center gap-2 rounded-md bg-primary-foreground/20 px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/30' />
            </div>

            {/* Mobile menu button */}
            <div className='flex md:hidden'>
              <button
                type='button'
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='inline-flex items-center justify-center rounded-md p-1.5 text-primary-foreground hover:bg-primary-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50 sm:p-2'
                aria-expanded='false'
              >
                <span className='sr-only'>Open main menu</span>
                {mobileMenuOpen ? (
                  <X className='h-5 w-5 sm:h-6 sm:w-6' aria-hidden='true' />
                ) : (
                  <Menu className='h-5 w-5 sm:h-6 sm:w-6' aria-hidden='true' />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu, show/hide based on menu state */}
          {mobileMenuOpen && (
            <div className='mt-2 space-y-1.5 border-t border-primary-foreground/20 pb-2 pt-2 sm:space-y-2 sm:pb-3 sm:pt-3 md:hidden'>
              <div
                className='px-3 py-1.5 sm:px-4 sm:py-2'
                onClick={() => setMobileMenuOpen(false)}
              >
                <AuthProvider className='flex w-full items-center justify-center gap-1.5 rounded-md bg-primary-foreground/20 px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/30 sm:gap-2 sm:py-2' />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className='flex-grow'>{children}</div>

      {/* Footer */}
      <footer className='border-t border-border bg-background-secondary py-4 sm:py-6 lg:py-8'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center text-xs text-muted-foreground sm:text-sm'>
            <p>
              &copy; {new Date().getFullYear()} Chamuka FormIt. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Toast notifications */}
      {showToasts && <ToastContainer position='bottom-right' />}
    </div>
  );
}
