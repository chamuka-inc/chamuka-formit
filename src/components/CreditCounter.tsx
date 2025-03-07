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
    refetchOnWindowFocus: true,
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 5000, // Consider data stale after 5 seconds
  });

  if (isLoading) {
    return (
      <div className='flex animate-pulse items-center gap-1 text-sm'>
        <Sparkles className='h-4 w-4 text-amber-500' />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-2 text-sm'>
      <div className='flex items-center gap-1'>
        <Sparkles className='h-4 w-4 text-amber-500' />
        <span className='font-medium'>
          {credits?.credits ?? 0} Generations Left
        </span>
      </div>
      <Link href='/credits' className='text-xs text-blue-500 hover:underline'>
        Get More
      </Link>
    </div>
  );
}
