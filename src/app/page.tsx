import React from "react";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerAuthSession();

  // If user is logged in, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <main className='flex-1'>
        <div className='relative pb-20 pt-32 sm:pb-24 sm:pt-40'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-3xl text-center'>
              <h1 className='text-4xl font-bold text-gray-900 dark:text-white sm:text-6xl'>
                Create Beautiful Surveys with Ease
              </h1>
              <p className='mt-6 text-lg text-gray-600 dark:text-gray-300 sm:text-xl'>
                Build engaging surveys, collect valuable feedback, and make
                data-driven decisions with our modern survey platform.
              </p>
              <div className='mt-10 flex flex-col justify-center gap-4 sm:flex-row'>
                <Link
                  href='/auth/signin'
                  className='inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                >
                  Get Started for Free
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Link>
                <Link
                  href='/help'
                  className='inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className='mt-32'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
                {[
                  {
                    title: "Modern Design",
                    description:
                      "Create beautiful surveys with our modern, responsive design system.",
                  },
                  {
                    title: "AI-Powered",
                    description:
                      "Generate survey questions automatically with our AI assistant.",
                  },
                  {
                    title: "Real-time Analytics",
                    description:
                      "Get instant insights with real-time response analytics.",
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className='relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='flex-shrink-0'>
                        <CheckCircle className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                      </div>
                      <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                        {feature.title}
                      </h3>
                    </div>
                    <p className='mt-4 text-gray-600 dark:text-gray-300'>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
