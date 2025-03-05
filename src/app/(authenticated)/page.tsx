"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthenticatedHome() {
  const router = useRouter();
  
  // Redirect to dashboard
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Redirecting to Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Please wait while we take you to the dashboard...</p>
      </div>
    </div>
  );
} 