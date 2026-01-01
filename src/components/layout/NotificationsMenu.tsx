"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

export function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='relative'>
      <button
        type='button'
        className='rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground'
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className='h-5 w-5' />
      </button>

      {isOpen && (
        <div className='absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-popover py-1 shadow-lg ring-1 ring-border focus:outline-none'>
          <div className='border-b border-border px-4 py-2'>
            <h3 className='text-sm font-semibold text-popover-foreground'>
              Notifications
            </h3>
          </div>
          <div className='px-4 py-2 text-center text-sm text-muted-foreground'>
            No new notifications
          </div>
        </div>
      )}
    </div>
  );
}
