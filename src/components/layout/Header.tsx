"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Menu,
  X,
  ChevronDown,
  FileText,
  Home,
  User,
  LogOut,
  Settings,
  LayoutGrid,
  BarChart3,
  Bell,
  Sparkles,
} from "lucide-react";
import { CreditCounter } from "@/components/CreditCounter";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutGrid className='h-5 w-5' />,
      active: isActive("/dashboard") || pathname === "/",
    },
  ];

  // Extract survey information from the URL if we're on a survey page
  const getSurveyInfo = () => {
    if (pathname.includes("/surveys/") && pathname.split("/").length > 3) {
      const id = pathname.split("/")[2];
      let type = "View";

      if (pathname.includes("/edit")) {
        type = "Edit";
      } else if (pathname.includes("/analytics")) {
        type = "Analytics";
      }

      return { id, type };
    }
    return null;
  };

  const surveyInfo = getSurveyInfo();

  // Get user email from session
  const userEmail = session?.user?.email || "No email available";

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

          {/* Desktop navigation */}
          <div className='hidden lg:flex lg:gap-x-8'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold leading-6 transition-colors ${
                  item.active
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}

            {/* Show current survey info if on a survey page */}
            {surveyInfo && (
              <div className='flex items-center text-sm font-medium text-gray-500 dark:text-gray-400'>
                <span className='mx-2'>|</span>
                <span className='text-blue-600 dark:text-blue-400'>
                  {surveyInfo.type} Survey
                </span>
              </div>
            )}
          </div>

          {/* Desktop right section */}
          <div className='hidden lg:flex lg:items-center lg:gap-x-4'>
            {/* AI Credits */}
            <div className='hidden items-center md:flex'>
              <CreditCounter />
            </div>

            {/* Notifications */}
            <div className='relative'>
              <button
                type='button'
                className='rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell className='h-5 w-5' />
              </button>

              {notificationsOpen && (
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

            <ThemeToggle />

            {/* User menu */}
            <div className='relative ml-2'>
              <button
                type='button'
                className='flex items-center gap-x-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white'
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-blue-500'>
                  <User className='h-4 w-4' />
                </div>
                <span className='hidden md:inline'>Account</span>
                <ChevronDown className='h-4 w-4' aria-hidden='true' />
              </button>

              {userMenuOpen && (
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
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className='flex items-center'>
                      <Settings className='mr-2 h-4 w-4' />
                      Settings
                    </div>
                  </Link>
                  <Link
                    href='/auth/signout'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className='flex items-center'>
                      <LogOut className='mr-2 h-4 w-4' />
                      Sign out
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className='lg:hidden'>
          <div
            className='fixed inset-0 z-50'
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className='fixed inset-y-0 right-0 z-50 w-full bg-white px-6 py-6 dark:bg-gray-800 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
            <div className='flex items-center justify-between'>
              <Link
                href='/'
                className='flex items-center gap-2'
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText className='h-8 w-8 text-blue-600 dark:text-blue-400' />
                <span className='text-xl font-semibold text-gray-900 dark:text-white'>
                  Survey Builder
                </span>
              </Link>
              <button
                type='button'
                className='rounded-md p-2.5 text-gray-700 dark:text-gray-200'
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className='sr-only'>Close menu</span>
                <X className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>
            <div className='mt-6 flow-root'>
              <div className='-my-6 divide-y divide-gray-500/10'>
                <div className='space-y-2 py-6'>
                  {/* Only show the Dashboard link once */}
                  {pathname === "/" || isActive("/dashboard") ? (
                    <Link
                      href='/dashboard'
                      className={`flex items-center rounded-lg bg-gray-50 px-3 py-2 text-base font-semibold leading-7 text-blue-600 dark:bg-gray-700 dark:text-blue-400`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutGrid className='mr-2 h-5 w-5' />
                      Dashboard
                    </Link>
                  ) : (
                    navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                          item.active
                            ? "bg-gray-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                            : "text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <span className='ml-2'>{item.name}</span>
                      </Link>
                    ))
                  )}

                  {/* Show current survey info if on a survey page */}
                  {surveyInfo && (
                    <div className='mx-1 my-3 border-l-2 border-blue-500 px-2 py-1 text-sm font-medium text-blue-600 dark:text-blue-400'>
                      {surveyInfo.type} Survey
                    </div>
                  )}
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
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className='flex items-center'>
                      <Sparkles className='mr-2 h-5 w-5' />
                      Credits
                    </div>
                  </Link>
                  <Link
                    href='/settings'
                    className='block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className='flex items-center'>
                      <Settings className='mr-2 h-5 w-5' />
                      Settings
                    </div>
                  </Link>
                  <Link
                    href='/auth/signout'
                    className='block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700'
                    onClick={() => setMobileMenuOpen(false)}
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
      )}
    </header>
  );
}
