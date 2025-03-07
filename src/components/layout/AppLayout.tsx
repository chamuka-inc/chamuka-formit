"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

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
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
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
    <div className='flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900'>
      {/* Header - full width, fixed at top */}
      <div className='sticky top-0 z-40'>
        <Header />
      </div>

      {/* Main content area - below header */}
      <div className='relative flex flex-1 pt-0'>
        {/* Sidebar - fixed position below header */}
        <div
          className={`fixed bottom-0 left-0 top-16 z-30 transition-all duration-300 ease-in-out ${
            sidebarOpen
              ? "translate-x-0 shadow-xl lg:shadow-none"
              : "-translate-x-full"
          } ${isTransitioning ? "overflow-hidden" : ""} w-72 lg:w-64`}
        >
          <div className='h-full overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
            <Sidebar className='h-full' />
          </div>
        </div>

        {/* Mobile overlay for closing sidebar */}
        {sidebarOpen && (
          <div
            className={`fixed inset-0 bg-black transition-opacity duration-300 lg:hidden ${
              sidebarOpen ? "opacity-50" : "pointer-events-none opacity-0"
            } z-20`}
            onClick={toggleSidebar}
            aria-hidden='true'
          />
        )}

        {/* Sidebar toggle button - improved styling */}
        <button
          className={`fixed bottom-6 left-6 z-30 rounded-full p-3 shadow-lg transition-all duration-300 lg:hidden ${
            sidebarOpen
              ? "translate-x-64 transform bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl"
          }`}
          onClick={toggleSidebar}
          aria-label='Toggle sidebar'
        >
          {sidebarOpen ? (
            <X className='h-6 w-6' />
          ) : (
            <Menu className='h-6 w-6' />
          )}
        </button>

        {/* Content area - takes remaining width, with padding when sidebar is visible */}
        <main
          className={`min-w-0 flex-1 transition-all duration-300 ease-in-out ${
            sidebarOpen ? "lg:ml-64" : ""
          }`}
        >
          <div>{children}</div>
        </main>
      </div>

      {/* Footer with improved styling and subtle gradient separator */}
      <footer className='relative mt-auto border-t border-gray-200 bg-white py-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'>
        <div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700'></div>
        <div className='container mx-auto'>
          © {new Date().getFullYear()} Survey Builder. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
