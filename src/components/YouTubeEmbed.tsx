"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface YouTubeEmbedProps {
  url: string;
  className?: string;
}

export default function YouTubeEmbed({
  url,
  className = "",
}: YouTubeEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract video ID from YouTube URL
  const videoId = useMemo(() => {
    try {
      const youtubeRegex =
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
      const match = url.match(youtubeRegex);
      return match && match[1] ? match[1] : null;
    } catch (err) {
      console.error("Error parsing YouTube URL:", err);
      return null;
    }
  }, [url]);

  // Create embedded URL with proper parameters
  const embedUrl = useMemo(() => {
    if (!videoId) return null;

    // Get origin for postMessage API
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(origin)}&rel=0`;
  }, [videoId]);

  // Handle loading state
  useEffect(() => {
    if (!iframeRef.current) return;

    const handleLoad = () => {
      setIsLoaded(true);
      setError(null);
    };

    const handleError = () => {
      setError("Failed to load video. Please try again later.");
      setIsLoaded(false);
    };

    const iframe = iframeRef.current;
    iframe.addEventListener("load", handleLoad);
    iframe.addEventListener("error", handleError);

    return () => {
      iframe.removeEventListener("load", handleLoad);
      iframe.removeEventListener("error", handleError);
    };
  }, [embedUrl]);

  if (!videoId || !embedUrl) {
    return (
      <div
        className={`flex aspect-video w-full items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 ${className}`}
      >
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Invalid YouTube URL
        </p>
      </div>
    );
  }

  return (
    <div className={`relative aspect-video w-full ${className}`}>
      {!isLoaded && !error && (
        <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800'>
          <div className='flex animate-pulse space-x-4'>
            <div className='h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600'></div>
          </div>
        </div>
      )}

      {error && (
        <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800'>
          <p className='text-sm text-red-500'>{error}</p>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={embedUrl}
        title='YouTube video player'
        className={`h-full w-full rounded-lg ${!isLoaded ? "opacity-0" : "opacity-100"}`}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        allowFullScreen
        loading='lazy'
      />
    </div>
  );
}
