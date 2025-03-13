import React from "react";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Shield,
  CreditCard,
  Layers,
  Brain,
  Clock,
  BarChart3,
  FileText,
  ChevronRight,
  LogIn,
} from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { LoginButton } from "@/components/auth/LoginButton";

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
        <div className='relative overflow-hidden'>
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>

          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='relative pb-20 pt-32 sm:pb-24 sm:pt-40'>
              <div className='mx-auto max-w-3xl text-center'>
                <div className='mb-8 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'>
                  <Sparkles className='mr-2 h-4 w-4' />
                  AI-Powered Form & Content Builder
                </div>
                <h1 className='text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl'>
                  <span className='block'>Transform Data Collection</span>
                  <span className='block bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400'>
                    And Content Creation
                  </span>
                </h1>
                <p className='mt-4 text-base leading-7 text-gray-600 dark:text-gray-300 sm:mt-6 sm:text-lg sm:leading-8 md:text-xl'>
                  Chamuka FormIt uses AI to help you create engaging,
                  intelligent forms and interactive content in minutes, not
                  hours. Collect better data and deliver rich learning
                  experiences with a single versatile platform.
                </p>
                <div className='mt-8 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4'>
                  <Link
                    href='/auth/signin'
                    className='group inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 sm:px-6 sm:py-3.5 sm:text-base'
                  >
                    Get Started for Free
                    <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5' />
                  </Link>
                  <Link
                    href='#features'
                    className='inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-6 sm:py-3.5 sm:text-base'
                  >
                    See How It Works
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className='mx-auto mb-10 mt-6 max-w-4xl rounded-2xl bg-white p-5 shadow-md dark:bg-gray-800 sm:mb-12 sm:mt-8 sm:p-6'>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6'>
                <div className='py-2 text-center'>
                  <p className='text-3xl font-bold text-blue-600 dark:text-blue-400 sm:text-4xl'>
                    90%
                  </p>
                  <p className='mt-1 text-sm text-gray-700 dark:text-gray-300 sm:mt-2 sm:text-base'>
                    Faster Form Creation
                  </p>
                </div>
                <div className='py-2 text-center'>
                  <p className='text-3xl font-bold text-blue-600 dark:text-blue-400 sm:text-4xl'>
                    24/7
                  </p>
                  <p className='mt-1 text-sm text-gray-700 dark:text-gray-300 sm:mt-2 sm:text-base'>
                    Secure Data Collection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Differentiators Section */}
        <div
          id='features'
          className='bg-gray-50 py-16 dark:bg-gray-900/50 sm:py-20 md:py-24'
        >
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl text-center'>
              <h2 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl'>
                What Makes Us Different
              </h2>
              <p className='mt-4 text-base leading-7 text-gray-600 dark:text-gray-300 sm:mt-6 sm:text-lg'>
                Chamuka FormIt combines AI intelligence with user-friendly
                design to help you create both forms and interactive content
                with ease.
              </p>
            </div>

            <div className='mx-auto mt-10 max-w-5xl sm:mt-16'>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3'>
                {/* AI-Powered Form Creation */}
                <div className='group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 sm:rounded-2xl sm:p-8'>
                  <div className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 sm:mb-5 sm:h-12 sm:w-12 sm:rounded-xl'>
                    <Brain className='h-5 w-5 sm:h-6 sm:w-6' />
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white sm:text-xl'>
                    AI-Powered Form Creation
                  </h3>
                  <p className='mt-3 text-sm text-gray-600 dark:text-gray-300 sm:mt-4 sm:text-base'>
                    Simply describe what you need, and our AI will generate the
                    perfect form for you. Get intelligent suggestions for
                    questions based on your form's purpose.
                  </p>
                  <ul className='mt-5 space-y-2 sm:mt-6 sm:space-y-3'>
                    <li className='flex items-start'>
                      <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5' />
                      <span className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                        Create forms with natural language
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5' />
                      <span className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                        AI-suggested questions and fields
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5' />
                      <span className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                        Intelligent form optimization
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Interactive Content Creation */}
                <div className='group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 sm:rounded-2xl sm:p-8'>
                  <div className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 sm:mb-5 sm:h-12 sm:w-12 sm:rounded-xl'>
                    <FileText className='h-5 w-5 sm:h-6 sm:w-6' />
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white sm:text-xl'>
                    Interactive Content Creation
                  </h3>
                  <p className='mt-3 text-sm text-gray-600 dark:text-gray-300 sm:mt-4 sm:text-base'>
                    Go beyond forms to create courses, manuals, and interactive
                    content. Transform static information into engaging guided
                    experiences.
                  </p>
                  <ul className='mt-5 space-y-2 sm:mt-6 sm:space-y-3'>
                    <li className='flex items-start'>
                      <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5' />
                      <span className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                        Create courses and training materials
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5' />
                      <span className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                        Build interactive documentation
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5' />
                      <span className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                        Track progress and engagement
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Multi-Page Experience */}
                <div className='group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 sm:rounded-2xl sm:p-8'>
                  <div className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 sm:mb-5 sm:h-12 sm:w-12 sm:rounded-xl'>
                    <Layers className='h-5 w-5 sm:h-6 sm:w-6' />
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white sm:text-xl'>
                    Multi-Page Experience
                  </h3>
                  <p className='mt-3 text-sm text-gray-600 dark:text-gray-300 sm:mt-4 sm:text-base'>
                    Create sophisticated multi-page forms and content with
                    advanced navigation. Perfect for applications, courses, and
                    complex interactions.
                  </p>
                  <ul className='mt-5 space-y-2 sm:mt-6 sm:space-y-3'>
                    <li className='flex items-start'>
                      <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5' />
                      <span className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                        Advanced navigation controls
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5' />
                      <span className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                        Conditional logic between pages
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5' />
                      <span className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                        Guided interactive experiences
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Flexible Credit System */}
                <div className='group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 sm:rounded-2xl sm:p-8'>
                  <div className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 sm:mb-5 sm:h-12 sm:w-12 sm:rounded-xl'>
                    <CreditCard className='h-5 w-5 sm:h-6 sm:w-6' />
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white sm:text-xl'>
                    Flexible Credit System
                  </h3>
                  <p className='mt-3 text-sm text-gray-600 dark:text-gray-300 sm:mt-4 sm:text-base'>
                    Pay only for what you use with our credit-based system.
                    Access premium features without committing to expensive
                    subscriptions.
                  </p>
                  <ul className='mt-5 space-y-2 sm:mt-6 sm:space-y-3'>
                    <li className='flex items-start'>
                      <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5' />
                      <span className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                        Cost-effective for occasional users
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5' />
                      <span className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                        Tailored credit packages for all users
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5' />
                      <span className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                        Premium features without subscriptions
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Comprehensive Data Security */}
                <div className='group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 sm:rounded-2xl sm:p-8'>
                  <div className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 sm:mb-5 sm:h-12 sm:w-12 sm:rounded-xl'>
                    <Shield className='h-5 w-5 sm:h-6 sm:w-6' />
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white sm:text-xl'>
                    Comprehensive Data Security
                  </h3>
                  <p className='mt-3 text-sm text-gray-600 dark:text-gray-300 sm:mt-4 sm:text-base'>
                    Keep your data safe with our enterprise-grade security
                    features. Control who can access your forms and submissions.
                  </p>
                  <ul className='mt-5 space-y-2 sm:mt-6 sm:space-y-3'>
                    <li className='flex items-start'>
                      <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5' />
                      <span className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                        Secure submission handling
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5' />
                      <span className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                        Ownership verification
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5' />
                      <span className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                        Granular access controls
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Analytics & Insights */}
                <div className='group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 sm:rounded-2xl sm:p-8'>
                  <div className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 sm:mb-5 sm:h-12 sm:w-12 sm:rounded-xl'>
                    <BarChart3 className='h-5 w-5 sm:h-6 sm:w-6' />
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white sm:text-xl'>
                    Analytics & Insights
                  </h3>
                  <p className='mt-3 text-sm text-gray-600 dark:text-gray-300 sm:mt-4 sm:text-base'>
                    Gain valuable insights from your forms and content with
                    powerful analytics. Understand engagement and optimize your
                    experiences.
                  </p>
                  <ul className='mt-5 space-y-2 sm:mt-6 sm:space-y-3'>
                    <li className='flex items-start'>
                      <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5' />
                      <span className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                        Real-time response tracking
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5' />
                      <span className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                        Visual data representations
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5' />
                      <span className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                        Engagement metrics and trends
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Target Markets Section */}
        <div className='py-16 sm:py-20 md:py-24 lg:py-32'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl text-center'>
              <h2 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl'>
                Perfect For Every Need
              </h2>
              <p className='mt-4 text-base leading-7 text-gray-600 dark:text-gray-300 sm:mt-6 sm:text-lg'>
                Whether you're a small business, educational institution, or
                freelancer, Chamuka FormIt has the tools you need.
              </p>
            </div>

            <div className='mx-auto mt-10 max-w-5xl sm:mt-16'>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4'>
                {/* Small to Medium-Sized Businesses */}
                <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:rounded-2xl sm:p-8'>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white sm:text-xl'>
                    Small to Medium-Sized Businesses
                  </h3>
                  <p className='mt-3 text-sm text-gray-600 dark:text-gray-300 sm:mt-4 sm:text-base'>
                    Create professional forms without the professional price tag
                    or learning curve.
                  </p>
                  <div className='mt-5 sm:mt-6'>
                    <Link
                      href='/auth/signin'
                      className='inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
                    >
                      Learn more
                      <ChevronRight className='ml-1 h-4 w-4' />
                    </Link>
                  </div>
                </div>

                {/* Educational Institutions */}
                <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:rounded-2xl sm:p-8'>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white sm:text-xl'>
                    Educational Institutions
                  </h3>
                  <p className='mt-3 text-sm text-gray-600 dark:text-gray-300 sm:mt-4 sm:text-base'>
                    Streamline your application process and create engaging
                    learning materials.
                  </p>
                  <div className='mt-5 sm:mt-6'>
                    <Link
                      href='/auth/signin'
                      className='inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
                    >
                      Learn more
                      <ChevronRight className='ml-1 h-4 w-4' />
                    </Link>
                  </div>
                </div>

                {/* Content Creators & Educators */}
                <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:rounded-2xl sm:p-8'>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white sm:text-xl'>
                    Content Creators & Educators
                  </h3>
                  <p className='mt-3 text-sm text-gray-600 dark:text-gray-300 sm:mt-4 sm:text-base'>
                    Create engaging learning experiences without technical
                    expertise or specialized tools.
                  </p>
                  <div className='mt-5 sm:mt-6'>
                    <Link
                      href='/auth/signin'
                      className='inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
                    >
                      Learn more
                      <ChevronRight className='ml-1 h-4 w-4' />
                    </Link>
                  </div>
                </div>

                {/* Freelancers and Solopreneurs */}
                <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:rounded-2xl sm:p-8'>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white sm:text-xl'>
                    Freelancers and Solopreneurs
                  </h3>
                  <p className='mt-3 text-sm text-gray-600 dark:text-gray-300 sm:mt-4 sm:text-base'>
                    Professional client interactions without the enterprise
                    price tag.
                  </p>
                  <div className='mt-5 sm:mt-6'>
                    <Link
                      href='/auth/signin'
                      className='inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
                    >
                      Learn more
                      <ChevronRight className='ml-1 h-4 w-4' />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className='relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 py-16 dark:from-blue-500 dark:via-indigo-500 dark:to-blue-600 sm:py-20 md:py-24'>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl text-center'>
              <h2 className='text-2xl font-bold tracking-tight text-white sm:text-3xl'>
                Ready to Transform Your Data Collection and Content Creation?
              </h2>
              <p className='mt-4 text-base leading-7 text-blue-100 sm:mt-6 sm:text-lg'>
                Start creating intelligent forms and interactive content
                experiences with our powerful, easy-to-use platform.
              </p>
              <div className='mt-8 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4'>
                <Link
                  href='/auth/signin'
                  className='group inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-medium text-blue-600 shadow-sm transition-all hover:bg-blue-50 dark:bg-white dark:text-blue-600 dark:hover:bg-blue-50 sm:px-6 sm:py-3.5 sm:text-base'
                >
                  Get Started for Free
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5' />
                </Link>
                <LoginButton className='inline-flex items-center justify-center rounded-lg border border-white/20 bg-transparent px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/10 sm:px-6 sm:py-3.5 sm:text-base'>
                  <LogIn className='mr-2 h-4 w-4' />
                  Log In
                </LoginButton>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
