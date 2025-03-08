"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FormsPage() {
  const router = useRouter();

  // Redirect to dashboard
  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className='flex min-h-[60vh] items-center justify-center'>
      <div className='text-center'>
        <div className='mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500'></div>
        <h1 className='mb-4 text-2xl font-bold text-gray-800 dark:text-white'>
          Redirecting to Dashboard
        </h1>
        <p className='text-gray-600 dark:text-gray-300'>
          Forms are now managed from the dashboard...
        </p>
      </div>
    </div>
  );
}
