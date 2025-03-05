"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, Settings, Share2, Trash2, ChevronLeft, Mail, 
  Plus, Search, UserPlus, MoreHorizontal, Crown
} from 'lucide-react';
import { toast } from 'react-toastify';

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatarUrl?: string;
  dateJoined: string;
};

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
    memberCount: id === 'team-1' ? 8 : id === 'team-2' ? 12 : 5,
    createdAt: id === 'team-1' ? '2023-06-15T00:00:00.000Z' : id === 'team-2' ? '2023-07-22T00:00:00.000Z' : '2023-09-10T00:00:00.000Z',
    isAdmin: id === 'team-1' || id === 'team-3'
  };
};

// Sample team members
const getTeamMembers = (id: string): TeamMember[] => {
  const baseMembers = [
    {
      id: 'user-1',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'admin' as const,
      dateJoined: '2023-04-10T00:00:00.000Z'
    },
    {
      id: 'user-2',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'member' as const,
      dateJoined: '2023-05-15T00:00:00.000Z'
    }
  ];
  
  if (id === 'team-1') {
    return [
      ...baseMembers,
      {
        id: 'user-3',
        name: 'Alex Johnson',
        email: 'alex.j@example.com',
        role: 'member' as const,
        dateJoined: '2023-07-12T00:00:00.000Z'
      },
      {
        id: 'user-4',
        name: 'Sarah Williams',
        email: 'sarah.w@example.com',
        role: 'member' as const,
        dateJoined: '2023-08-22T00:00:00.000Z'
      }
    ];
  }
  
  return baseMembers;
};

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params?.id as string;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [teamData] = useState(getTeamData(teamId));
  const [teamMembers] = useState(getTeamMembers(teamId));
  
  // Filter members based on search query
  const filteredMembers = teamMembers.filter(
    member => 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDeleteTeam = async () => {
    if (window.confirm(`Are you sure you want to delete the team "${teamData.name}"? This action cannot be undone.`)) {
      setIsLoading(true);
      try {
        // This would be replaced with actual API call
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
        
        toast.success(`Team "${teamData.name}" deleted successfully`);
        router.push('/teams');
      } catch (error) {
        toast.error("Failed to delete team. Please try again.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsInviting(true);
    
    try {
      // This would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
    } catch (error) {
      toast.error("Failed to send invitation. Please try again.");
      console.error(error);
    } finally {
      setIsInviting(false);
    }
  };
  
  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      try {
        // This would be replaced with actual API call
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
        
        toast.success(`${memberName} removed from the team`);
      } catch (error) {
        toast.error("Failed to remove member. Please try again.");
        console.error(error);
      }
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/teams"
          className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Teams
        </Link>
      </div>
      
      {/* Team header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{teamData.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {teamData.memberCount} {teamData.memberCount === 1 ? 'member' : 'members'} · Created on {new Date(teamData.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {teamData.isAdmin && (
          <div className="flex space-x-2">
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Invite
            </button>
            <Link
              href={`/teams/${teamId}/settings`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
            <button
              onClick={handleDeleteTeam}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-700 shadow-sm text-sm font-medium rounded-md text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>
      
      {/* Team description */}
      {teamData.description && (
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-md p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">About</h2>
          <p className="text-gray-600 dark:text-gray-300">{teamData.description}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Team Members</h2>
              {teamData.isAdmin && (
                <button
                  onClick={() => document.getElementById('invite-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Member
                </button>
              )}
            </div>
            
            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            {/* Members list */}
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <li key={member.id} className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                          {member.role === 'admin' && (
                            <span className="ml-2 inline-flex items-center">
                              <Crown className="h-3.5 w-3.5 text-yellow-500" />
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                      </div>
                    </div>
                    
                    {teamData.isAdmin && member.id !== 'user-1' && (
                      <div className="relative">
                        <button
                          onClick={() => handleRemoveMember(member.id, member.name)}
                          className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No members found matching your search</p>
                  {searchQuery && (
                    <button 
                      className="mt-2 text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear search
                    </button>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Invite members section */}
        <div id="invite-section" className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Invite Members</h2>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleInviteMember}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        placeholder="team.member@example.com"
                      />
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isInviting}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isInviting ? 'Sending...' : 'Send Invitation'}
                </button>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">Or</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/teams/invite/${teamId}`)
                        .then(() => toast.success("Invitation link copied to clipboard"))
                        .catch(() => toast.error("Failed to copy link"));
                    }}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Copy Invitation Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 