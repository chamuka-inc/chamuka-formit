"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ChevronDown,
  PlusCircle,
  Settings,
  HelpCircle,
  LayoutGrid,
  Sparkles,
  LogOut,
  User,
  LogIn,
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
    className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
      active
        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
        : "text-foreground-secondary hover:bg-muted hover:text-foreground"
    }`}
    onClick={onClick}
  >
    <div className='flex items-center gap-3'>
      <div
        className={`${active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary transition-colors"}`}
      >
        {icon}
      </div>
      <span className='tracking-tight'>{title}</span>
      {isNew && (
        <span className='rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success'>
          New
        </span>
      )}
    </div>
    {badge && (
      <div className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
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
    <div className='mb-2'>
      <button
        className='flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground-secondary transition-all hover:bg-muted hover:text-foreground'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex items-center gap-3'>
          <div className='text-muted-foreground'>{icon}</div>
          <span className='tracking-tight'>{title}</span>
        </div>
        <div className='flex items-center gap-2'>
          {badge && (
            <div className='rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground'>
              {badge}
            </div>
          )}
          <div
            className='text-muted-foreground transition-transform duration-200'
            style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)" }}
          >
            <ChevronDown className='h-4 w-4' />
          </div>
        </div>
      </button>
      <div
        className={`ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="pl-3 py-1 border-l border-border/50 ml-2">
          {children}
        </div>
      </div>
    </div>
  );
};

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export default function Sidebar({ className = "", onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { data: credits } = api.credits.getCredits.useQuery();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside
      className={`h-full border-r border-border bg-background ${className}`}
    >
      <div className='flex h-full flex-col p-4'>
        {/* Account section at the top */}
        {status === "authenticated" && session?.user && (
          <div className='mb-6 px-2'>
            <div className='flex items-center gap-3 rounded-2xl bg-muted/50 p-4 border border-border/50'>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground'>
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className='h-full w-full rounded-xl object-cover'
                  />
                ) : (
                  <User className='h-5 w-5' />
                )}
              </div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-semibold tracking-tight text-foreground'>
                  {session.user.name || "User"}
                </p>
                <p className='truncate text-[11px] font-medium text-muted-foreground'>
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className='mb-2 px-2'>
          <div className='mb-3 ml-2 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60'>
            Overview
          </div>
          <div className='space-y-1'>
            <SidebarItem
              href='/dashboard'
              icon={<LayoutGrid className='h-5 w-5' />}
              title='Dashboard'
              active={isActive("/dashboard") || pathname === "/"}
              onClick={onClose}
            />
            <SidebarItem
              href='/forms/create'
              icon={<PlusCircle className='h-5 w-5' />}
              title='Create'
              active={pathname === "/forms/create"}
              isNew={false}
              onClick={onClose}
            />
            <SidebarItem
              href='/credits'
              icon={<Sparkles className='h-5 w-5' />}
              title='Credits'
              active={isActive("/credits")}
              badge={credits?.credits?.toString()}
              onClick={onClose}
            />
          </div>
        </div>

        <div className='mt-auto border-t border-border/50 pt-6'>
          <div className='px-2'>
            <div className='mb-3 ml-2 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60'>
              Account & Support
            </div>
            <div className='space-y-1'>
              {status === "authenticated" && (
                <SidebarItem
                  href='/settings'
                  icon={<Settings className='h-5 w-5' />}
                  title='Settings'
                  active={isActive("/settings")}
                  onClick={onClose}
                />
              )}
              <SidebarItem
                href='/help'
                icon={<HelpCircle className='h-5 w-5' />}
                title='Help Center'
                active={isActive("/help")}
                onClick={onClose}
              />
              {status === "authenticated" ? (
                <SidebarItem
                  href='/auth/signout'
                  icon={<LogOut className='h-5 w-5' />}
                  title='Sign out'
                  onClick={onClose}
                />
              ) : (
                <SidebarItem
                  href='/auth/signin'
                  icon={<LogIn className='h-5 w-5' />}
                  title='Sign in'
                  onClick={onClose}
                />
              )}
            </div>
          </div>

          {status === "authenticated" && (
            <div className='mx-2 mt-6 rounded-2xl bg-primary/5 p-4 border border-primary/10 shadow-sm'>
              <div className='mb-3 flex items-center justify-between'>
                <span className='text-[11px] font-bold uppercase tracking-wider text-primary'>
                  AI Credits
                </span>
                <span className='text-[11px] font-bold text-primary'>
                  {credits?.credits || 0} left
                </span>
              </div>
              <div className='h-2 w-full overflow-hidden rounded-full bg-primary/10'>
                <div
                  className='h-full rounded-full bg-primary transition-all duration-500 shadow-sm shadow-primary/20'
                  style={{
                    width: `${Math.min(100, (credits?.credits || 0) * 20)}%`,
                  }}
                ></div>
              </div>
              <Link
                href='/credits'
                className='mt-3 block text-center text-[11px] font-bold uppercase tracking-tight text-primary hover:text-primary-hover transition-colors'
                onClick={onClose}
              >
                Get More Credits
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
