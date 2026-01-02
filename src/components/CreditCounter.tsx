"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/trpc/react";

export function CreditCounter() {
  const {
    data: credits,
    isLoading,
    refetch,
  } = api.credits.getCredits.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchInterval: 30000, // Reduced to 30 seconds
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 25000, // Increased stale time to 25 seconds
    gcTime: 1000 * 60 * 5, // Garbage collection after 5 minutes
  });

  if (isLoading) {
    return (
      <div className='flex animate-pulse items-center gap-1 text-sm text-muted-foreground'>
        <Sparkles className='h-4 w-4 text-warning' />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-3 rounded-full border border-border bg-background px-4 py-1.5 shadow-sm'>
      <div className='flex items-center gap-2'>
        <Sparkles className='h-4 w-4 text-primary' />
        <span className='text-xs font-semibold text-foreground'>
          {credits?.credits ?? 0} Credits
        </span>
      </div>
      <Link
        href='/credits'
        className='border-l border-border pl-3 text-xs font-bold text-primary transition-colors hover:text-primary-hover'
      >
        Add More
      </Link>
    </div>
  );
}
