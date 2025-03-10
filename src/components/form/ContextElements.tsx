"use client";

import { ContextElement } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import VideoEmbed from "@/components/VideoEmbed";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
// @ts-ignore - Import SyntaxHighlighter without type checking
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore - Import style without type checking
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ReactNode } from "react";
import { Components } from "react-markdown";

interface ContextElementsProps {
  elements?: ContextElement[];
}

// Component for rendering different types of context elements
export const ContextElements = ({ elements }: ContextElementsProps) => {
  if (!elements || elements.length === 0) {
    return null;
  }

  return (
    <div className='w-full max-w-full space-y-4 overflow-hidden'>
      {elements.map((element, index) => (
        <RenderContextElement key={index} element={element} />
      ))}
    </div>
  );
};

// Component to render a single context element based on its type
const RenderContextElement = ({ element }: { element: ContextElement }) => {
  switch (element.type) {
    case "paragraph":
      return <MarkdownContent content={element.content} />;
    case "image":
      return <ImageContent src={element.content} />;
    case "video":
      return <VideoContent url={element.content} />;
    default:
      return null;
  }
};

// Component for rendering markdown content
const MarkdownContent = ({ content }: { content: string }) => {
  const processedContent = processMarkdownContent(content);

  return (
    <div className='prose prose-sm w-full max-w-none text-xs dark:prose-invert sm:prose-base sm:text-sm md:text-base'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={markdownComponents}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

// Component for rendering images
const ImageContent = ({ src }: { src: string }) => (
  <div className='w-full overflow-hidden rounded-lg'>
    <img
      src={src}
      alt='Context'
      className='mx-auto h-auto max-h-[600px] w-full rounded-lg object-contain shadow-sm'
      loading='lazy'
    />
  </div>
);

// Component for rendering videos
const VideoContent = ({ url }: { url: string }) => (
  <div className='aspect-video w-full overflow-hidden rounded-lg shadow-sm'>
    <VideoEmbed url={url} className='h-full w-full' />
  </div>
);

/**
 * Process markdown content to handle language identifiers at the beginning
 * @param content The markdown content to process
 * @returns Properly formatted markdown content
 */
const processMarkdownContent = (content: string): string => {
  const lines = content.split("\n");
  const firstLine = lines[0].trim();

  // If first line is just a language identifier (no backticks)
  if (/^[a-zA-Z0-9_+-]+$/.test(firstLine) && lines.length > 1) {
    const language = firstLine;
    const remainingContent = lines.slice(1).join("\n");

    // Format as proper markdown code block
    return `\`\`\`${language}\n${remainingContent}\n\`\`\``;
  }

  return content;
};

// Type for code component props that includes the inline property
interface CodeProps {
  className?: string;
  children: ReactNode;
  inline?: boolean;
  [key: string]: any;
}

// Custom components for markdown rendering
const markdownComponents: Components = {
  // @ts-ignore - Using ts-ignore for the code component due to type incompatibility
  code(props: CodeProps) {
    const { className, children, inline, ...rest } = props;
    const match = /language-(\w+)/.exec(className || "");

    return !inline && match ? (
      <div className='my-4 w-full overflow-x-auto rounded-md'>
        {/* @ts-ignore - Known issue with SyntaxHighlighter types */}
        <SyntaxHighlighter
          // @ts-ignore - Known issue with style types
          style={atomDark}
          language={match[1]}
          PreTag='div'
          className='rounded-md text-xs sm:text-sm md:text-base'
          customStyle={{
            borderRadius: "0.375rem",
            padding: "0.75rem",
            maxWidth: "100%",
            fontSize: "inherit",
          }}
          showLineNumbers={true}
          wrapLines={true}
          wrapLongLines={true}
          {...rest}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code
        className={`${className} break-words rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800 sm:text-sm`}
        {...rest}
      >
        {children}
      </code>
    );
  },
  p(props) {
    return (
      <p
        className='mb-4 hyphens-auto break-words text-xs sm:text-sm md:text-base'
        {...props}
      />
    );
  },
  h1(props) {
    return (
      <h1
        className='mb-4 mt-6 break-words text-lg font-bold sm:text-xl md:text-2xl lg:text-3xl'
        {...props}
      />
    );
  },
  h2(props) {
    return (
      <h2
        className='mb-3 mt-5 break-words text-base font-bold sm:text-lg md:text-xl lg:text-2xl'
        {...props}
      />
    );
  },
  h3(props) {
    return (
      <h3
        className='mb-2 mt-4 break-words text-sm font-semibold sm:text-base md:text-lg lg:text-xl'
        {...props}
      />
    );
  },
  h4(props) {
    return (
      <h4
        className='mb-2 mt-3 break-words text-xs font-semibold sm:text-sm md:text-base lg:text-lg'
        {...props}
      />
    );
  },
  ul(props) {
    return (
      <ul
        className='mb-4 list-disc pl-4 text-xs sm:pl-5 sm:text-sm md:text-base'
        {...props}
      />
    );
  },
  ol(props) {
    return (
      <ol
        className='mb-4 list-decimal pl-4 text-xs sm:pl-5 sm:text-sm md:text-base'
        {...props}
      />
    );
  },
  li(props) {
    return (
      <li
        className='mb-1 break-words text-xs sm:text-sm md:text-base'
        {...props}
      />
    );
  },
  a(props) {
    return (
      <a
        {...props}
        target='_blank'
        rel='noopener noreferrer'
        className='break-words text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
      />
    );
  },
  table(props) {
    return (
      <div className='my-4 w-full overflow-x-auto rounded-md border border-gray-200 dark:border-gray-800'>
        <table
          className='w-full table-auto border-collapse text-xs sm:text-sm md:text-base'
          {...props}
        />
      </div>
    );
  },
  thead(props) {
    return <thead className='bg-gray-50 dark:bg-gray-800' {...props} />;
  },
  th(props) {
    return (
      <th
        className='border-b border-gray-200 px-2 py-2 text-left text-xs font-medium uppercase tracking-wider dark:border-gray-700 sm:px-3 sm:py-2'
        {...props}
      />
    );
  },
  td(props) {
    return (
      <td
        className='break-words border-b border-gray-200 px-2 py-2 align-top dark:border-gray-800 sm:px-3 sm:py-2'
        {...props}
      />
    );
  },
  tr(props) {
    return (
      <tr className='hover:bg-gray-50 dark:hover:bg-gray-900' {...props} />
    );
  },
  blockquote(props) {
    return (
      <blockquote
        className='my-4 border-l-4 border-gray-300 pl-4 text-xs italic text-gray-700 dark:border-gray-700 dark:text-gray-300 sm:text-sm md:text-base'
        {...props}
      />
    );
  },
  hr(props) {
    return (
      <hr
        className='my-6 border-t border-gray-300 dark:border-gray-700'
        {...props}
      />
    );
  },
  img(props) {
    return (
      <img
        {...props}
        className='mx-auto my-4 h-auto max-h-[500px] max-w-full rounded-md object-contain'
        loading='lazy'
      />
    );
  },
};
