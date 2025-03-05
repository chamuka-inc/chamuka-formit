"use client";

import { useState } from 'react';
import { toast } from 'react-toastify';
import { User, Settings, Lock, Bell, Moon, Sun, Monitor, Check } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications' | 'appearance'>('profile');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Profile updated successfully");
    }, 1000);
  };
  
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    // In a real app, you would save this to user preferences and update the theme
    toast.success(`Theme changed to ${newTheme}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
            <nav className="p-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center w-full px-4 py-2 mb-2 text-left rounded-md ${
                  activeTab === 'profile'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <User className="w-5 h-5 mr-2" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`flex items-center w-full px-4 py-2 mb-2 text-left rounded-md ${
                  activeTab === 'account'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Lock className="w-5 h-5 mr-2" />
                <span>Account & Security</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center w-full px-4 py-2 mb-2 text-left rounded-md ${
                  activeTab === 'notifications'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Bell className="w-5 h-5 mr-2" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`flex items-center w-full px-4 py-2 mb-2 text-left rounded-md ${
                  activeTab === 'appearance'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Settings className="w-5 h-5 mr-2" />
                <span>Appearance</span>
              </button>
            </nav>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
                <form onSubmit={handleSaveProfile}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      defaultValue="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      defaultValue="john.doe@example.com"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="bio">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      defaultValue="Product Manager with over 5 years of experience in SaaS and consumer products."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {activeTab === 'account' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account & Security</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="current-password">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        name="current_password"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="new-password">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        name="new_password"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="confirm-password">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        name="confirm_password"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <button
                        type="button"
                        className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Danger Zone</h3>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                    <h4 className="text-base font-medium text-red-800 dark:text-red-400">Delete Account</h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1 mb-3">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      type="button"
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Survey Responses</label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" name="survey_responses" id="survey-responses" defaultChecked className="checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                          <label htmlFor="survey-responses" className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"></label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Weekly Summary</label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" name="weekly_summary" id="weekly-summary" defaultChecked className="checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                          <label htmlFor="weekly-summary" className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"></label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Product Updates</label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" name="product_updates" id="product-updates" className="checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                          <label htmlFor="product-updates" className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"></label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Push Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-700 dark:text-gray-300">New Responses</label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" name="new_responses" id="new-responses" defaultChecked className="checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                          <label htmlFor="new-responses" className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"></label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Survey Completion</label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" name="survey_completion" id="survey-completion" className="checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                          <label htmlFor="survey-completion" className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"></label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Theme</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={() => handleThemeChange('light')}
                        className={`relative flex items-center justify-center p-4 border rounded-lg ${
                          theme === 'light' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <Sun className="h-8 w-8 text-yellow-500 mb-2" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Light</span>
                        </div>
                        {theme === 'light' && (
                          <div className="absolute top-2 right-2 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleThemeChange('dark')}
                        className={`relative flex items-center justify-center p-4 border rounded-lg ${
                          theme === 'dark' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <Moon className="h-8 w-8 text-indigo-500 mb-2" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Dark</span>
                        </div>
                        {theme === 'dark' && (
                          <div className="absolute top-2 right-2 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleThemeChange('system')}
                        className={`relative flex items-center justify-center p-4 border rounded-lg ${
                          theme === 'system' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <Monitor className="h-8 w-8 text-gray-500 mb-2" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">System</span>
                        </div>
                        {theme === 'system' && (
                          <div className="absolute top-2 right-2 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 