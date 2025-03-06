"use client";

import { useState } from 'react';
import { Search, Plus, Minus, Mail, MessageSquare, FileText, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "How do I create a new survey?",
    answer: "To create a new survey, navigate to the 'Surveys' section and click the 'Create Survey' button. You'll be guided through our survey builder where you can add questions, customize your survey, and set up distribution options."
  },
  {
    question: "Can I customize the look of my surveys?",
    answer: "Yes! You can customize the appearance of your surveys including colors, fonts, and adding your logo. Go to the 'Appearance' tab when editing a survey to access these customization options."
  },
  {
    question: "How do I share my survey with respondents?",
    answer: "After creating your survey, you can share it via a direct link, email invitation, or embed it on your website. All sharing options are available in the 'Share' tab after publishing your survey."
  },
  {
    question: "Can I export survey responses to Excel or CSV?",
    answer: "Yes, you can export all your survey data to CSV or Excel format. Go to your survey's analytics page and click the 'Export' button to download your data in your preferred format."
  },
  {
    question: "How do I create a branching logic in my survey?",
    answer: "Branching logic allows you to show different questions based on previous answers. To set this up, edit a question and select the 'Logic' tab to create rules for which questions appear next based on the respondent's answer."
  },
  {
    question: "Is there a limit to how many surveys I can create?",
    answer: "The number of surveys you can create depends on your subscription plan. Free accounts can create up to 3 surveys, while premium plans have unlimited survey creation."
  }
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQs, setOpenFAQs] = useState<number[]>([]);
  const [message, setMessage] = useState('');

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (index: number) => {
    if (openFAQs.includes(index)) {
      setOpenFAQs(openFAQs.filter(i => i !== index));
    } else {
      setOpenFAQs([...openFAQs, index]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') {
      toast.error("Please enter a message before sending");
      return;
    }
    
    // Simulate sending a message
    toast.success("Your message has been sent. We'll respond shortly!");
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Help & Support</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Search Bar */}
          <div className="bg-white dark:bg-gray-800 mb-6 p-4 rounded-lg shadow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          {/* FAQs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => (
                  <div key={index} className="p-6">
                    <button
                      className="flex w-full justify-between items-center text-left"
                      onClick={() => toggleFAQ(index)}
                    >
                      <h3 className="text-base font-medium text-gray-900 dark:text-white pr-2">{faq.question}</h3>
                      {openFAQs.includes(index) ? (
                        <Minus className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      ) : (
                        <Plus className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {openFAQs.includes(index) && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-700 dark:text-gray-300">No FAQs found matching your search. Try different keywords or browse our documentation.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Documentation Links */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Documentation</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="#" 
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-start hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FileText className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Getting Started Guide</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Learn the basics of creating and distributing surveys</p>
                </div>
              </a>
              
              <a 
                href="#" 
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-start hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FileText className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Question Types</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Detailed guide on all available question types</p>
                </div>
              </a>
              
              <a 
                href="#" 
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-start hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FileText className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Analytics & Reporting</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">How to analyze and visualize survey results</p>
                </div>
              </a>
              
              <a 
                href="#" 
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-start hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FileText className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Advanced Features</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Logic jumps, scoring, and other advanced features</p>
                </div>
              </a>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-center">
              <a 
                href="#" 
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
              >
                View full documentation
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Support */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Support</h2>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSendMessage}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="message">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue or question..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Send Message
                </button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Other ways to get help</h3>
                
                <div className="space-y-3">
                  <a 
                    href="mailto:support@surveybuilder.com" 
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Mail className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                    <span>support@surveybuilder.com</span>
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <MessageSquare className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                    <span>Live Chat (Mon-Fri, 9am-5pm)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Links</h2>
            </div>
            
            <div className="p-4">
              <ul className="space-y-2">
                <li>
                  <a href="#" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Video Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    API Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Community Forum
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Status Page
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
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