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
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-neutral-900 dark:text-white">
                Survey4
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-neutral-900 dark:text-white bg-white dark:bg-neutral-800 shadow-lg shadow-brandBlue-500/20 transition-all hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          </div>
          <div className="relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brandBlue-500 to-brandBlue-700 dark:from-brandBlue-400 dark:to-brandBlue-600">
                  Create Beautiful Surveys with Ease
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-neutral-600 dark:text-neutral-300">
                  Build engaging surveys, collect valuable feedback, and make data-driven decisions with our modern survey platform.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-brandBlue-500 to-brandBlue-600 px-6 py-3 text-base font-medium text-neutral-900 shadow-lg shadow-brandBlue-500/20 transition-all hover:from-brandBlue-600 hover:to-brandBlue-700 hover:shadow-xl hover:shadow-brandBlue-500/30 dark:text-white"
                  >
                    Get Started for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/help"
                    className="inline-flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-6 py-3 text-base font-medium text-neutral-700 dark:text-neutral-300 shadow-sm transition-all hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Modern Design",
                    description: "Create beautiful surveys with our modern, responsive design system.",
                  },
                  {
                    title: "AI-Powered",
                    description: "Generate survey questions automatically with our AI assistant.",
                  },
                  {
                    title: "Real-time Analytics",
                    description: "Get instant insights with real-time response analytics.",
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="relative rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-6 w-6 text-brandBlue-500 dark:text-brandBlue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-neutral-600 dark:text-neutral-300">
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
      <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
            <p>&copy; {new Date().getFullYear()} Survey4. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
