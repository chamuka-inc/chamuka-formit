import React from "react";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerAuthSession();

  // If user is logged in, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className='flex min-h-screen flex-col'>
      {/* Header */}
      <header className='fixed left-0 right-0 top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex items-center'>
              <Link
                href='/'
                className='text-xl font-bold text-neutral-900 dark:text-white'
              >
                Survey4
              </Link>
            </div>
            <div className='flex items-center gap-4'>
              <Link
                href='/auth/signin'
                className='text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
              >
                Sign in
              </Link>
              <Link
                href='/auth/signin'
                className='shadow-brandBlue-500/20 inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-lg transition-all hover:bg-neutral-50 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700'
              >
                Get Started
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className='flex-1'>
        <div className='relative pb-20 pt-32 sm:pb-24 sm:pt-40'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          </div>
          <div className='relative'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <div className='mx-auto max-w-3xl text-center'>
                <h1 className='from-brandBlue-500 to-brandBlue-700 dark:from-brandBlue-400 dark:to-brandBlue-600 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent sm:text-6xl'>
                  Create Beautiful Surveys with Ease
                </h1>
                <p className='mt-6 text-lg text-neutral-600 dark:text-neutral-300 sm:text-xl'>
                  Build engaging surveys, collect valuable feedback, and make
                  data-driven decisions with our modern survey platform.
                </p>
                <div className='mt-10 flex flex-col justify-center gap-4 sm:flex-row'>
                  <Link
                    href='/auth/signin'
                    className='from-brandBlue-500 to-brandBlue-600 shadow-brandBlue-500/20 hover:from-brandBlue-600 hover:to-brandBlue-700 hover:shadow-brandBlue-500/30 inline-flex items-center justify-center rounded-lg bg-gradient-to-r px-6 py-3 text-base font-medium text-neutral-900 shadow-lg transition-all hover:shadow-xl dark:text-white'
                  >
                    Get Started for Free
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Link>
                  <Link
                    href='/help'
                    className='inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-6 py-3 text-base font-medium text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                  >
                    Learn More
                  </Link>
                </div>
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
                    className='relative rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='flex-shrink-0'>
                        <CheckCircle className='text-brandBlue-500 dark:text-brandBlue-400 h-6 w-6' />
                      </div>
                      <h3 className='text-lg font-semibold text-neutral-900 dark:text-white'>
                        {feature.title}
                      </h3>
                    </div>
                    <p className='mt-4 text-neutral-600 dark:text-neutral-300'>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
          <div className='text-center text-sm text-neutral-600 dark:text-neutral-400'>
            <p>
              &copy; {new Date().getFullYear()} Survey4. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
