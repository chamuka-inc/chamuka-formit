"use client";

import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    checkScreenSize();

    // Add listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Toggle sidebar visibility with transition handling
  const toggleSidebar = () => {
    setIsTransitioning(true);
    setSidebarOpen(!sidebarOpen);
    
    // Reset the transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header - full width, fixed at top */}
      <div className="sticky top-0 z-40">
        <Header />
      </div>

      {/* Main content area - below header */}
      <div className="flex flex-1 pt-0 relative">
        {/* Sidebar - fixed position below header */}
        <div 
          className={`fixed top-16 left-0 bottom-0 z-30 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0 shadow-xl lg:shadow-none' : '-translate-x-full'
          } ${isTransitioning ? 'overflow-hidden' : ''} w-72 lg:w-64`}
        >
          <div className="h-full overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <Sidebar className="h-full" />
          </div>
        </div>

        {/* Mobile overlay for closing sidebar */}
        {sidebarOpen && (
          <div 
            className={`fixed inset-0 bg-black transition-opacity duration-300 lg:hidden ${
              sidebarOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
            } z-20`}
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}

        {/* Sidebar toggle button - improved styling */}
        <button 
          className={`fixed bottom-6 left-6 p-3 rounded-full shadow-lg z-30 lg:hidden transition-all duration-300 ${
            sidebarOpen 
              ? 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200 transform translate-x-64' 
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'
          }`}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Content area - takes remaining width, with padding when sidebar is visible */}
        <main className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'lg:ml-64' : ''
        }`}>
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Footer with improved styling and subtle gradient separator */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 text-center text-sm text-gray-500 dark:text-gray-400 mt-auto relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
        <div className="container mx-auto">
          © {new Date().getFullYear()} Survey Builder. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 