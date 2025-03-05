"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, Users, Lock, Bell, Globe, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

// Sample team data for UI demonstration
const getTeamData = (id: string) => {
  return {
    id,
    name: id === 'team-1' ? 'Marketing Team' : id === 'team-2' ? 'Customer Success' : 'Product Research',
    description: id === 'team-1' 
      ? 'Our main marketing team focused on product campaigns' 
      : id === 'team-2' 
        ? 'Team dedicated to improving customer satisfaction' 
        : 'Research team for new product development',
    isPrivate: id === 'team-1',
    notificationsEnabled: true,
    memberJoinApproval: id === 'team-1',
    surveyCollaboration: 'all',
    memberCount: id === 'team-1' ? 8 : id === 'team-2' ? 12 : 5,
    createdAt: id === 'team-1' ? '2023-06-15T00:00:00.000Z' : id === 'team-2' ? '2023-07-22T00:00:00.000Z' : '2023-09-10T00:00:00.000Z',
  };
};

export default function TeamSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params?.id as string;
  
  const initialTeamData = getTeamData(teamId);
  const [activeTab, setActiveTab] = useState<'general' | 'permissions' | 'notifications' | 'danger'>('general');
  const [formData, setFormData] = useState({
    name: initialTeamData.name,
    description: initialTeamData.description || '',
    isPrivate: initialTeamData.isPrivate,
    notificationsEnabled: initialTeamData.notificationsEnabled,
    memberJoinApproval: initialTeamData.memberJoinApproval,
    surveyCollaboration: initialTeamData.surveyCollaboration,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Team name is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      toast.success("Team settings updated successfully");
    } catch (error) {
      toast.error("Failed to update team settings. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link 
          href={`/teams/${teamId}`}
          className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Team
        </Link>
      </div>
      
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
          <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {initialTeamData.name} Settings
        </h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-1 px-4 py-3" aria-label="Settings Tabs">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                activeTab === 'general'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              General
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                activeTab === 'permissions'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Shield className="h-4 w-4 mr-2" />
              Permissions
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                activeTab === 'notifications'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('danger')}
              className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                activeTab === 'danger'
                  ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Lock className="h-4 w-4 mr-2" />
              Danger Zone
            </button>
          </nav>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Team Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Describe your team's purpose and focus areas"
                  />
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="isPrivate"
                      name="isPrivate"
                      type="checkbox"
                      checked={formData.isPrivate}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="isPrivate" className="font-medium text-gray-700 dark:text-gray-300">Private team</label>
                    <p className="text-gray-500 dark:text-gray-400">
                      When enabled, the team and its surveys are only visible to team members.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'permissions' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-start mb-4">
                    <div className="flex items-center h-5">
                      <input
                        id="memberJoinApproval"
                        name="memberJoinApproval"
                        type="checkbox"
                        checked={formData.memberJoinApproval}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="memberJoinApproval" className="font-medium text-gray-700 dark:text-gray-300">
                        Require admin approval for new members
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        When enabled, admins must approve member requests before they can join the team.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label htmlFor="surveyCollaboration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Survey Collaboration
                    </label>
                    <select
                      id="surveyCollaboration"
                      name="surveyCollaboration"
                      value={formData.surveyCollaboration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="all">All members can edit and create surveys</option>
                      <option value="restricted">Only admins can create new surveys, members can edit</option>
                      <option value="admins">Only admins can create and edit surveys</option>
                    </select>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Determines who can create and edit surveys associated with this team.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="notificationsEnabled"
                      name="notificationsEnabled"
                      type="checkbox"
                      checked={formData.notificationsEnabled}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="notificationsEnabled" className="font-medium text-gray-700 dark:text-gray-300">
                      Enable team notifications
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Receive notifications about team activity, new members, and survey updates.
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Additional notifications (coming soon)
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    More granular notification settings will be available in a future update.
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'danger' && (
              <div className="space-y-6">
                <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Lock className="h-5 w-5 text-red-400 dark:text-red-500" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Danger Zone</h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                        <p>
                          Actions in this section can have irreversible consequences. Please proceed with caution.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Transfer Ownership</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Transfer ownership of this team to another team admin.
                  </p>
                  <button
                    type="button"
                    onClick={() => toast.info("This would open a modal to transfer ownership")}
                    className="mt-3 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
                  >
                    Transfer Ownership
                  </button>
                </div>
                
                <div className="rounded-md border border-red-300 dark:border-red-700 p-4">
                  <h3 className="text-sm font-medium text-red-700 dark:text-red-400">Delete Team</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Once you delete a team, all team data including surveys and responses will be permanently removed.
                    This action cannot be undone.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
                        toast.info("This would delete the team and redirect to teams list");
                        router.push('/teams');
                      }
                    }}
                    className="mt-3 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                  >
                    Delete Team
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {(activeTab === 'general' || activeTab === 'permissions' || activeTab === 'notifications') && (
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 