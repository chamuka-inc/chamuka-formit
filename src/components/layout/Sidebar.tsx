"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown,
  ChevronRight,
  FileText,
  PlusCircle,
  BarChart3,
  Settings,
  HelpCircle,
  LayoutGrid,
  Home,
  Tag,
  Users,
  Star,
  MessageSquare
} from 'lucide-react';

type SidebarItemProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string;
  isNew?: boolean;
};

const SidebarItem = ({ href, icon, title, active, onClick, badge, isNew }: SidebarItemProps) => (
  <Link
    href={href}
    className={`flex items-center justify-between rounded-md px-3.5 py-2.5 text-sm font-medium transition-all duration-200 group ${
      active
        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/70'
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <div className={`${active ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
        {icon}
      </div>
      <span className="font-medium">{title}</span>
      {isNew && (
        <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          New
        </span>
      )}
    </div>
    {badge && (
      <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium">
        {badge}
      </div>
    )}
  </Link>
);

type SidebarSectionProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
};

const SidebarSection = ({ title, icon, children, defaultOpen = false, badge }: SidebarSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-3">
      <button
        className="flex w-full items-center justify-between rounded-md px-3.5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/70 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="text-gray-500 dark:text-gray-400">
            {icon}
          </div>
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium">
              {badge}
            </div>
          )}
          <div className="text-gray-400 dark:text-gray-500 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </button>
      <div className={`ml-9 mt-1 space-y-1 overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};

export default function Sidebar({ className = '' }: { className?: string }) {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className={`w-64 bg-white dark:bg-gray-800 h-full border-r border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex flex-col h-full p-4">
        <div className="px-2 mb-2">
          <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-2 ml-2">
            Main
          </div>
          <div className="space-y-1">
            <SidebarItem
              href="/dashboard"
              icon={<LayoutGrid className="h-5 w-5" />}
              title="Dashboard"
              active={isActive('/dashboard') || pathname === '/'}
            />
            <SidebarItem
              href="/surveys/create"
              icon={<PlusCircle className="h-5 w-5" />}
              title="Create Survey"
              active={pathname === '/surveys/create'}
              isNew={true}
            />
          </div>
        </div>

        <div className="px-2 mb-2">
          <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-2 ml-2">
            Collaborate
          </div>
          <div className="space-y-1 mb-2">
            <SidebarSection 
              title="Teams" 
              icon={<Users className="h-5 w-5" />}
              defaultOpen={pathname.includes('/teams')}
              badge="3"
            >
              <SidebarItem
                href="/teams"
                icon={<Users className="h-4 w-4" />}
                title="All Teams"
                active={pathname === '/teams'}
              />
              <SidebarItem
                href="/teams/create"
                icon={<PlusCircle className="h-4 w-4" />}
                title="Create Team"
                active={pathname === '/teams/create'}
              />
              {pathname.includes('/teams/') && pathname !== '/teams/create' && !pathname.includes('/settings') && (
                <SidebarItem
                  href={pathname}
                  icon={<Users className="h-4 w-4" />}
                  title="Team Details"
                  active={true}
                />
              )}
              {pathname.includes('/teams/') && pathname.includes('/settings') && (
                <SidebarItem
                  href={pathname}
                  icon={<Settings className="h-4 w-4" />}
                  title="Team Settings"
                  active={true}
                />
              )}
            </SidebarSection>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="px-2">
            <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-2 ml-2">
              Support
            </div>
            <div className="space-y-1">
              <SidebarItem
                href="/settings"
                icon={<Settings className="h-5 w-5" />}
                title="Settings"
                active={isActive('/settings')}
              />
              <SidebarItem
                href="/help"
                icon={<HelpCircle className="h-5 w-5" />}
                title="Help & Support"
                active={isActive('/help')}
              />
            </div>
          </div>
          
          <div className="mt-6 px-4 py-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg mx-2">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-xs text-blue-700 dark:text-blue-400 uppercase tracking-wider">Free Plan</span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">3/5 surveys</span>
            </div>
            <div className="w-full bg-white/50 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <button className="mt-3 text-xs font-medium text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              Upgrade to Pro →
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
} 