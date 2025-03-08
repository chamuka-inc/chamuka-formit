"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import YouTubeEmbed from "./YouTubeEmbed";

interface VideoEmbedProps {
  url: string;
  className?: string;
}

export default function VideoEmbed({ url, className = "" }: VideoEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine which video platform the URL belongs to
  const { platform, embedUrl } = useMemo(() => {
    // YouTube
    if (/(?:youtube\.com|youtu\.be)/i.test(url)) {
      return { platform: "youtube", embedUrl: null };
    }

    // Vimeo
    const vimeoRegex = /(?:vimeo\.com)\/(?:video\/)?([0-9]+)/i;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
      return {
        platform: "vimeo",
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?h=0000000000`,
      };
    }

    // Wistia
    const wistiaRegex =
      /(?:wistia\.com|wi\.st)\/(?:medias|embed)\/([a-zA-Z0-9]+)/i;
    const wistiaMatch = url.match(wistiaRegex);
    if (wistiaMatch && wistiaMatch[1]) {
      return {
        platform: "wistia",
        embedUrl: `https://fast.wistia.net/embed/iframe/${wistiaMatch[1]}`,
      };
    }

    // Loom
    const loomRegex = /(?:loom\.com\/share|loom\.com\/embed)\/([a-zA-Z0-9]+)/i;
    const loomMatch = url.match(loomRegex);
    if (loomMatch && loomMatch[1]) {
      return {
        platform: "loom",
        embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
      };
    }

    // Dailymotion
    const dailymotionRegex =
      /(?:dailymotion\.com\/(?:video|embed\/video))\/([a-zA-Z0-9]+)/i;
    const dailymotionMatch = url.match(dailymotionRegex);
    if (dailymotionMatch && dailymotionMatch[1]) {
      return {
        platform: "dailymotion",
        embedUrl: `https://www.dailymotion.com/embed/video/${dailymotionMatch[1]}`,
      };
    }

    // TED
    const tedRegex = /(?:ted\.com\/talks)\/([a-zA-Z0-9_]+)/i;
    const tedMatch = url.match(tedRegex);
    if (tedMatch && tedMatch[1]) {
      return {
        platform: "ted",
        embedUrl: `https://embed.ted.com/talks/${tedMatch[1]}`,
      };
    }

    // Wikimedia Commons
    const wikimediaRegex =
      /(?:upload\.wikimedia\.org|commons\.wikimedia\.org)\/(?:wikipedia\/commons)\/([a-zA-Z0-9]+)\/([a-zA-Z0-9_.]+)/i;
    const wikimediaMatch = url.match(wikimediaRegex);
    if (url.includes("wikimedia.org")) {
      // For Wikimedia videos, we need special handling
      // If it's already the embed URL with player.php, use it directly
      if (url.includes("player.php")) {
        return {
          platform: "wikimedia",
          embedUrl: url,
        };
      }

      // Otherwise, try to convert to a player URL
      // This is approximate and may need adjustments based on actual Wikimedia URL patterns
      const filename = url.split("/").pop();
      if (filename) {
        return {
          platform: "wikimedia",
          embedUrl: `https://commons.wikimedia.org/wiki/File:${filename}?embedplayer=yes`,
        };
      }
    }

    // If it's already an embed URL, use it as is
    if (
      url.includes("/embed/") ||
      url.includes("player.") ||
      url.includes("iframe")
    ) {
      return {
        platform: "generic",
        embedUrl: url,
      };
    }

    // Default - treat as a direct video URL
    return {
      platform: "generic",
      embedUrl: url,
    };
  }, [url]);

  // Handle loading state for non-YouTube videos
  useEffect(() => {
    if (platform === "youtube" || !iframeRef.current) return;

    const handleLoad = () => {
      setIsLoaded(true);
      setError(null);
    };

    const handleError = () => {
      setError("Failed to load video. Please check the URL and try again.");
      setIsLoaded(false);
    };

    const iframe = iframeRef.current;
    iframe.addEventListener("load", handleLoad);
    iframe.addEventListener("error", handleError);

    return () => {
      iframe.removeEventListener("load", handleLoad);
      iframe.removeEventListener("error", handleError);
    };
  }, [platform, embedUrl]);

  // For YouTube videos, use the specialized component
  if (platform === "youtube") {
    return <YouTubeEmbed url={url} className={className} />;
  }

  // Handle case where we could not generate a valid embed URL
  if (!embedUrl) {
    return (
      <div
        className={`flex aspect-video w-full items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 ${className}`}
      >
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Cannot embed this video format
        </p>
      </div>
    );
  }

  // Handle generic or other platform embeds
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
        title='Video player'
        className={`h-full w-full rounded-lg ${!isLoaded ? "opacity-0" : "opacity-100"}`}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        allowFullScreen
        loading='lazy'
      />
    </div>
  );
}
