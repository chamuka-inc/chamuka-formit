import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function SurveyNotFound() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md text-center'>
        <div className='mb-4 flex justify-center'>
          <AlertCircle className='h-16 w-16 text-red-500' />
        </div>
        <h1 className='mb-2 text-3xl font-bold text-gray-900 dark:text-white'>
          Survey Not Found
        </h1>
        <p className='mb-8 text-gray-600 dark:text-gray-300'>
          The survey you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href='/'
          className='inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
