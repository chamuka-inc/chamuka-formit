"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Menu, X, ChevronDown, FileText, Home, User, LogOut, Settings, LayoutGrid, BarChart3, Bell, Sparkles } from 'lucide-react';
import { CreditCounter } from '@/components/CreditCounter';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutGrid className="h-5 w-5" />, active: isActive('/dashboard') || pathname === '/' },
  ];

  // Extract survey information from the URL if we're on a survey page
  const getSurveyInfo = () => {
    if (pathname.includes('/surveys/') && pathname.split('/').length > 3) {
      const id = pathname.split('/')[2];
      let type = 'View';
      
      if (pathname.includes('/edit')) {
        type = 'Edit';
      } else if (pathname.includes('/analytics')) {
        type = 'Analytics';
      }
      
      return { id, type };
    }
    return null;
  };
  
  const surveyInfo = getSurveyInfo();

  // Get user email from session
  const userEmail = session?.user?.email || 'No email available';

  return (
    <header className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
      <div className="w-full mx-auto px-4 sm:px-6">
        <nav className="flex h-16 items-center justify-between" aria-label="Global">
          <div className="flex lg:flex-1 items-center">
            <Link href="/" className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">Survey Builder</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold leading-6 flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  item.active
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            
            {/* Show current survey info if on a survey page */}
            {surveyInfo && (
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <span className="mx-2">|</span>
                <span className="text-blue-600 dark:text-blue-400">{surveyInfo.type} Survey</span>
              </div>
            )}
          </div>
          
          {/* Desktop right section */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-4">
            {/* AI Credits */}
            <div className="hidden md:flex items-center">
              <CreditCounter />
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell className="h-5 w-5" />
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="py-2 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No new notifications
                  </div>
                </div>
              )}
            </div>
            
            <ThemeToggle />
            
            {/* User menu */}
            <div className="relative ml-2">
              <button
                type="button"
                className="flex items-center gap-x-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden md:inline">Account</span>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userEmail}</p>
                  </div>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </div>
                  </Link>
                  <Link
                    href="/auth/signout"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
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
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full bg-white dark:bg-gray-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="text-xl font-semibold text-gray-900 dark:text-white">Survey Builder</span>
              </Link>
              <button
                type="button"
                className="rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {/* Only show the Dashboard link once */}
                  {pathname === '/' || isActive('/dashboard') ? (
                    <Link
                      href="/dashboard"
                      className={`rounded-lg px-3 py-2 text-base font-semibold leading-7 flex items-center text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-700`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutGrid className="mr-2 h-5 w-5" />
                      Dashboard
                    </Link>
                  ) : (
                    navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                          item.active
                            ? 'text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-700'
                            : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <span className="ml-2">{item.name}</span>
                      </Link>
                    ))
                  )}
                  
                  {/* Show current survey info if on a survey page */}
                  {surveyInfo && (
                    <div className="mx-1 my-3 px-2 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 border-l-2 border-blue-500">
                      {surveyInfo.type} Survey
                    </div>
                  )}
                </div>
                <div className="py-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Theme</span>
                    <ThemeToggle />
                  </div>
                  <Link
                    href="/credits"
                    className="block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 mb-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Credits
                    </div>
                  </Link>
                  <Link
                    href="/settings"
                    className="block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Settings className="mr-2 h-5 w-5" />
                      Settings
                    </div>
                  </Link>
                  <Link
                    href="/auth/signout"
                    className="block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-5 w-5" />
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