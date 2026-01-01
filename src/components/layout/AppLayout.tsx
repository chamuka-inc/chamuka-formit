"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Menu, X, ChevronLeft } from "lucide-react";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        // Keep current sidebar state on desktop when resizing
        // If it's the initial load, set it to true
        if (
          typeof window !== "undefined" &&
          !localStorage.getItem("sidebarState")
        ) {
          setSidebarOpen(true);
        }
      }
    };

    // Set initial state
    checkScreenSize();

    // Try to load saved sidebar state from localStorage
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sidebarState");
      if (savedState !== null) {
        setSidebarOpen(savedState === "open");
      }
    }

    // Add listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Toggle sidebar visibility without transition handling
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);

    // Save sidebar state to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarState", !sidebarOpen ? "open" : "closed");
    }
  };

  return (
    <div className='flex min-h-screen flex-col bg-background-secondary'>
      {/* Header - full width, fixed at top */}
      <div className='sticky top-0 z-50'>
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      </div>

      {/* Main content area - below header */}
      <div className='relative flex flex-1 pt-0'>
        {/* Overlay backdrop - visible when sidebar is open on any screen size */}
        {sidebarOpen && (
          <div
            className={`fixed inset-0 z-30 bg-overlay ${
              sidebarOpen ? "opacity-50" : "pointer-events-none opacity-0"
            }`}
            onClick={toggleSidebar}
            aria-hidden='true'
          />
        )}

        {/* Sidebar - overlays on content without pushing it */}
        <div
          className={`fixed bottom-0 left-0 top-16 z-40 ${
            sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
          } w-[90%] min-w-[280px] max-w-[320px] sm:w-[65%] md:w-[45%] lg:w-[30%] xl:w-[22%] 2xl:w-[18%]`}
        >
          <div className='h-full overflow-y-auto border-r border-border bg-background'>
            <Sidebar className='h-full' />
          </div>
        </div>

        {/* Content area - full width without shifting */}
        <main className='min-w-0 flex-1'>
          <div>{children}</div>
        </main>
      </div>

      {/* Footer with improved styling and subtle separator */}
      <footer className='relative mt-auto border-t border-border bg-background py-4 text-center text-sm text-muted-foreground'>
        <div className='container mx-auto'>
          © {new Date().getFullYear()} Chamuka FormIt. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
