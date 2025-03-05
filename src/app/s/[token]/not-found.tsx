import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function SurveyNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Survey Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          The survey you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
} 