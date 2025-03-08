"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Minus,
  Mail,
  MessageSquare,
  FileText,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "How do I create a new form?",
    answer:
      "To create a new form, navigate to the 'Forms' section and click the 'Create Form' button. You'll be guided through our form builder where you can add questions, customize your form, and set up distribution options.",
  },
  {
    question: "Can I customize the look of my forms?",
    answer:
      "Yes! You can customize the appearance of your forms including colors, fonts, and adding your logo. Go to the 'Appearance' tab when editing a form to access these customization options.",
  },
  {
    question: "How do I share my form with respondents?",
    answer:
      "After creating your form, you can share it via a direct link, email invitation, or embed it on your website. All sharing options are available in the 'Share' tab after publishing your form.",
  },
  {
    question: "Can I export form responses to Excel or CSV?",
    answer:
      "Yes, you can export all your form data to CSV or Excel format. Go to your form's analytics page and click the 'Export' button to download your data in your preferred format.",
  },
  {
    question: "How do I create a branching logic in my form?",
    answer:
      "Branching logic allows you to show different questions based on previous answers. To set this up, edit a question and select the 'Logic' tab to create rules for which questions appear next based on the respondent's answer.",
  },
  {
    question: "Is there a limit to how many forms I can create?",
    answer:
      "The number of forms you can create depends on your subscription plan. Free accounts can create up to 3 forms, while premium plans have unlimited form creation.",
  },
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFAQs, setOpenFAQs] = useState<number[]>([]);
  const [message, setMessage] = useState("");

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleFAQ = (index: number) => {
    if (openFAQs.includes(index)) {
      setOpenFAQs(openFAQs.filter((i) => i !== index));
    } else {
      setOpenFAQs([...openFAQs, index]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === "") {
      toast.error("Please enter a message before sending");
      return;
    }

    // Simulate sending a message
    toast.success("Your message has been sent. We'll respond shortly!");
    setMessage("");
  };

  return (
    <div className='mx-auto max-w-6xl p-4'>
      <h1 className='mb-6 text-2xl font-bold text-gray-900 dark:text-white'>
        Help & Support
      </h1>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Main Content */}
        <div className='lg:col-span-2'>
          {/* Search Bar */}
          <div className='mb-6 rounded-lg bg-white p-4 shadow dark:bg-gray-800'>
            <div className='relative'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <Search className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='text'
                placeholder='Search for help articles...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
            </div>
          </div>

          {/* FAQs */}
          <div className='mb-6 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800'>
            <div className='border-b border-gray-200 px-6 py-4 dark:border-gray-700'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Frequently Asked Questions
              </h2>
            </div>

            <div className='divide-y divide-gray-200 dark:divide-gray-700'>
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => (
                  <div key={index} className='p-6'>
                    <button
                      className='flex w-full items-center justify-between text-left'
                      onClick={() => toggleFAQ(index)}
                    >
                      <h3 className='pr-2 text-base font-medium text-gray-900 dark:text-white'>
                        {faq.question}
                      </h3>
                      {openFAQs.includes(index) ? (
                        <Minus className='h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400' />
                      ) : (
                        <Plus className='h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400' />
                      )}
                    </button>
                    {openFAQs.includes(index) && (
                      <div className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className='p-6 text-center'>
                  <p className='text-gray-700 dark:text-gray-300'>
                    No FAQs found matching your search. Try different keywords
                    or browse our documentation.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Documentation Links */}
          <div className='overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800'>
            <div className='border-b border-gray-200 px-6 py-4 dark:border-gray-700'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Documentation
              </h2>
            </div>

            <div className='grid grid-cols-1 gap-4 p-6 md:grid-cols-2'>
              <a
                href='#'
                className='flex items-start rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
              >
                <FileText className='mr-3 h-6 w-6 flex-shrink-0 text-blue-500' />
                <div>
                  <h3 className='mb-1 font-medium text-gray-900 dark:text-white'>
                    Getting Started Guide
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    Learn the basics of creating and distributing forms
                  </p>
                </div>
              </a>

              <a
                href='#'
                className='flex items-start rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
              >
                <FileText className='mr-3 h-6 w-6 flex-shrink-0 text-blue-500' />
                <div>
                  <h3 className='mb-1 font-medium text-gray-900 dark:text-white'>
                    Question Types
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    Detailed guide on all available question types
                  </p>
                </div>
              </a>

              <a
                href='#'
                className='flex items-start rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
              >
                <FileText className='mr-3 h-6 w-6 flex-shrink-0 text-blue-500' />
                <div>
                  <h3 className='mb-1 font-medium text-gray-900 dark:text-white'>
                    Analytics & Reporting
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    How to analyze and visualize form results
                  </p>
                </div>
              </a>

              <a
                href='#'
                className='flex items-start rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
              >
                <FileText className='mr-3 h-6 w-6 flex-shrink-0 text-blue-500' />
                <div>
                  <h3 className='mb-1 font-medium text-gray-900 dark:text-white'>
                    Advanced Features
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    Logic jumps, scoring, and other advanced features
                  </p>
                </div>
              </a>
            </div>

            <div className='bg-gray-50 px-6 py-4 text-center dark:bg-gray-700'>
              <a
                href='#'
                className='inline-flex items-center text-blue-600 hover:underline dark:text-blue-400'
              >
                View full documentation
                <ExternalLink className='ml-1 h-4 w-4' />
              </a>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-6 lg:col-span-1'>
          {/* Contact Support */}
          <div className='overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800'>
            <div className='border-b border-gray-200 px-6 py-4 dark:border-gray-700'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Contact Support
              </h2>
            </div>

            <div className='p-6'>
              <form onSubmit={handleSendMessage}>
                <div className='mb-4'>
                  <label
                    className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
                    htmlFor='message'
                  >
                    Your Message
                  </label>
                  <textarea
                    id='message'
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Describe your issue or question...'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    required
                  />
                </div>

                <button
                  type='submit'
                  className='inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                >
                  Send Message
                </button>
              </form>

              <div className='mt-6 border-t border-gray-200 pt-6 dark:border-gray-700'>
                <h3 className='mb-3 text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Other ways to get help
                </h3>

                <div className='space-y-3'>
                  <a
                    href='mailto:support@formbuilder.com'
                    className='flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                  >
                    <Mail className='mr-2 h-5 w-5 text-gray-500 dark:text-gray-400' />
                    <span>support@formbuilder.com</span>
                  </a>

                  <a
                    href='#'
                    className='flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                  >
                    <MessageSquare className='mr-2 h-5 w-5 text-gray-500 dark:text-gray-400' />
                    <span>Live Chat (Mon-Fri, 9am-5pm)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className='overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800'>
            <div className='border-b border-gray-200 px-6 py-4 dark:border-gray-700'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Quick Links
              </h2>
            </div>

            <div className='p-4'>
              <ul className='space-y-2'>
                <li>
                  <a
                    href='#'
                    className='block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400'
                  >
                    Video Tutorials
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400'
                  >
                    API Documentation
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400'
                  >
                    Community Forum
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400'
                  >
                    Status Page
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400'
                  >
                    Release Notes
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
