"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { User, ChevronDown, Settings, LogOut } from "lucide-react";

interface UserMenuProps {
  userEmail: string;
}

export function UserMenu({ userEmail }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='relative ml-2' ref={menuRef}>
      <button
        type='button'
        className='flex items-center gap-x-2 rounded-xl border border-transparent px-3 py-1.5 transition-all hover:bg-muted'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/20'>
          <User className='h-4 w-4' />
        </div>
        <span className='hidden text-sm font-semibold text-foreground md:inline'>
          Account
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden='true'
        />
      </button>

      {isOpen && (
        <div className='absolute right-0 z-[100] mt-2 w-64 origin-top-right rounded-2xl border border-border bg-popover p-1.5 shadow-xl shadow-primary/10 focus:outline-none'>
          <div className='mb-1 border-b border-border/50 px-4 py-3'>
            <p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70'>
              Signed in as
            </p>
            <p className='truncate text-sm font-semibold text-foreground'>
              {userEmail}
            </p>
          </div>
          <div className='space-y-0.5'>
            <Link
              href='/settings'
              className='flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted'
              onClick={() => setIsOpen(false)}
            >
              <Settings className='h-4 w-4 text-muted-foreground' />
              Settings
            </Link>
            <Link
              href='/auth/signout'
              className='flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-destructive transition-all hover:bg-destructive/5'
              onClick={() => setIsOpen(false)}
            >
              <LogOut className='h-4 w-4' />
              Sign out
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
