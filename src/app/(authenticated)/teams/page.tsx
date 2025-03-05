"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusCircle, Users, ChevronRight, Search } from 'lucide-react';
import { toast } from 'react-toastify';

type Team = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  role: 'admin' | 'member';
  createdAt: string;
};

// Sample teams data for UI demonstration
const sampleTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Marketing Team',
    description: 'Our main marketing team focused on product campaigns',
    memberCount: 8,
    role: 'admin',
    createdAt: '2023-06-15T00:00:00.000Z'
  },
  {
    id: 'team-2',
    name: 'Customer Success',
    description: 'Team dedicated to improving customer satisfaction',
    memberCount: 12,
    role: 'member',
    createdAt: '2023-07-22T00:00:00.000Z'
  },
  {
    id: 'team-3',
    name: 'Product Research',
    description: 'Research team for new product development',
    memberCount: 5,
    role: 'admin',
    createdAt: '2023-09-10T00:00:00.000Z'
  }
];

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Filter teams based on search query
  const filteredTeams = sampleTeams.filter(
    team => 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTeam = () => {
    router.push('/teams/create');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teams</h1>
        <button
          onClick={handleCreateTeam}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Team
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Teams list */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <li key={team.id}>
                <Link href={`/teams/${team.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{team.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{team.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-4 flex flex-col items-end">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {team.memberCount} {team.memberCount === 1 ? 'member' : 'members'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            Your role: {team.role}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">No teams found</p>
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

      {/* Join team section */}
      <div className="mt-8 bg-white dark:bg-gray-800 shadow sm:rounded-md p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Join a Team</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Enter a team invitation code to join an existing team.
        </p>
        <div className="flex">
          <input
            type="text"
            placeholder="Enter invitation code"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={() => toast.info("This would join a team with the provided code")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
} 