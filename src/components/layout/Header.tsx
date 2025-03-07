"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Menu, X, FileText } from "lucide-react";
import { CreditCounter } from "@/components/CreditCounter";
import { UserMenu } from "./UserMenu";
import { NotificationsMenu } from "./NotificationsMenu";
import { MobileMenu } from "./MobileMenu";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className='sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <div className='mx-auto w-full px-4 sm:px-6'>
        <nav
          className='flex h-16 items-center justify-between'
          aria-label='Global'
        >
          <div className='flex items-center lg:flex-1'>
            <Link href='/' className='flex items-center gap-2'>
              <FileText className='h-8 w-8 text-blue-600 dark:text-blue-400' />
              <span className='text-xl font-semibold text-gray-900 dark:text-white'>
                Survey Builder
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className='flex lg:hidden'>
            <button
              type='button'
              className='inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className='sr-only'>Open main menu</span>
              {mobileMenuOpen ? (
                <X className='h-6 w-6' aria-hidden='true' />
              ) : (
                <Menu className='h-6 w-6' aria-hidden='true' />
              )}
            </button>
          </div>

          {/* Desktop right section */}
          <div className='hidden lg:flex lg:items-center lg:gap-x-4'>
            {/* AI Credits */}
            <div className='hidden items-center md:flex'>
              <CreditCounter />
            </div>

            {/* Notifications */}
            <NotificationsMenu />

            <ThemeToggle />

            {/* User menu */}
            <UserMenu
              userEmail={session?.user?.email || "No email available"}
            />
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <MobileMenu onClose={() => setMobileMenuOpen(false)} />
      )}
    </header>
  );
}
