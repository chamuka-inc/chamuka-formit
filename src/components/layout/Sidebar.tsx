"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Star,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/trpc/react";

type SidebarItemProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string;
  isNew?: boolean;
};

const SidebarItem = ({
  href,
  icon,
  title,
  active,
  onClick,
  badge,
  isNew,
}: SidebarItemProps) => (
  <Link
    href={href}
    className={`group flex items-center justify-between rounded-md px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
        : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/70"
    }`}
    onClick={onClick}
  >
    <div className='flex items-center gap-3'>
      <div
        className={`${active ? "text-blue-500 dark:text-blue-400" : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"}`}
      >
        {icon}
      </div>
      <span className='font-medium'>{title}</span>
      {isNew && (
        <span className='rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-700 dark:bg-green-900/30 dark:text-green-400'>
          New
        </span>
      )}
    </div>
    {badge && (
      <div className='rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'>
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

const SidebarSection = ({
  title,
  icon,
  children,
  defaultOpen = false,
  badge,
}: SidebarSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className='mb-3'>
      <button
        className='flex w-full items-center justify-between rounded-md px-3.5 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/70'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex items-center gap-3'>
          <div className='text-gray-500 dark:text-gray-400'>{icon}</div>
          <span className='font-medium'>{title}</span>
        </div>
        <div className='flex items-center gap-2'>
          {badge && (
            <div className='rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'>
              {badge}
            </div>
          )}
          <div
            className='text-gray-400 transition-transform duration-200 dark:text-gray-500'
            style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)" }}
          >
            <ChevronDown className='h-4 w-4' />
          </div>
        </div>
      </button>
      <div
        className={`ml-9 mt-1 space-y-1 overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const { data: credits } = api.credits.getCredits.useQuery();

  return (
    <aside
      className={`h-full border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      <div className='flex h-full flex-col p-4'>
        <div className='mb-2 px-2'>
          <div className='mb-2 ml-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400'>
            Main
          </div>
          <div className='space-y-1'>
            <SidebarItem
              href='/dashboard'
              icon={<LayoutGrid className='h-5 w-5' />}
              title='Dashboard'
              active={isActive("/dashboard") || pathname === "/"}
            />
            <SidebarItem
              href='/surveys/create'
              icon={<PlusCircle className='h-5 w-5' />}
              title='Create'
              active={pathname === "/surveys/create"}
              isNew={false}
            />
            <SidebarItem
              href='/credits'
              icon={<Sparkles className='h-5 w-5' />}
              title='Credits'
              active={isActive("/credits")}
              badge={credits?.credits?.toString()}
            />
          </div>
        </div>

        <div className='mt-auto border-t border-gray-200 pt-6 dark:border-gray-700'>
          <div className='px-2'>
            <div className='mb-2 ml-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400'>
              Support
            </div>
            <div className='space-y-1'>
              <SidebarItem
                href='/settings'
                icon={<Settings className='h-5 w-5' />}
                title='Settings'
                active={isActive("/settings")}
              />
              <SidebarItem
                href='/help'
                icon={<HelpCircle className='h-5 w-5' />}
                title='Help & Support'
                active={isActive("/help")}
              />
            </div>
          </div>

          <div className='mx-2 mt-6 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-4 dark:from-blue-900/20 dark:to-indigo-900/20'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-xs font-medium uppercase tracking-wider text-blue-700 dark:text-blue-400'>
                Credits
              </span>
              <span className='text-xs font-medium text-blue-600 dark:text-blue-400'>
                {credits?.credits || 0} remaining
              </span>
            </div>
            <div className='h-1.5 w-full overflow-hidden rounded-full bg-white/50 dark:bg-white/10'>
              <div
                className='h-1.5 rounded-full bg-blue-500'
                style={{
                  width: `${Math.min(100, (credits?.credits || 0) * 20)}%`,
                }}
              ></div>
            </div>
            <Link
              href='/credits'
              className='mt-3 block text-xs font-medium text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
            >
              Get more credits →
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
