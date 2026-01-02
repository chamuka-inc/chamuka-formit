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
import { LatexText } from "@/components/LatexText";

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
        <RenderContextElement key={element.id || index} element={element} />
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
    <div className='prose prose-sm w-full max-w-none text-sm dark:prose-invert sm:prose-base md:text-base'>
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
  const processedLines: string[] = [];
  let currentCodeBlock: string[] = [];
  let currentLanguage = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if line is a language identifier
    if (/^[a-zA-Z0-9_+-]+$/.test(line)) {
      // If we have a previous code block, process it
      if (currentCodeBlock.length > 0) {
        processedLines.push(
          `\`\`\`${currentLanguage}\n${currentCodeBlock.join("\n")}\n\`\`\``,
        );
        currentCodeBlock = [];
      }
      currentLanguage = line;
      continue;
    }

    // If we have a language set, collect code block lines
    if (currentLanguage) {
      currentCodeBlock.push(lines[i]);
    } else {
      processedLines.push(lines[i]);
    }
  }

  // Process any remaining code block
  if (currentCodeBlock.length > 0) {
    processedLines.push(
      `\`\`\`${currentLanguage}\n${currentCodeBlock.join("\n")}\n\`\`\``,
    );
  }

  return processedLines.join("\n");
};

// Helper function to process React children and wrap text nodes with LaTeX support
const processChildrenForLatex = (children: ReactNode): ReactNode => {
  if (typeof children === "string") {
    return <LatexText>{children}</LatexText>;
  }
  if (Array.isArray(children)) {
    return children.map((child, index) => {
      if (typeof child === "string") {
        return <LatexText key={index}>{child}</LatexText>;
      }
      return child;
    });
  }
  return children;
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
          className='rounded-md text-sm md:text-base'
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
        className={`${className} break-words rounded bg-muted px-1 py-0.5 text-sm text-foreground`}
        {...rest}
      >
        {children}
      </code>
    );
  },
  p(props) {
    return (
      <p
        className='mb-4 hyphens-auto break-words text-sm md:text-base'
        {...props}
      >
        {processChildrenForLatex(props.children)}
      </p>
    );
  },
  h1(props) {
    return (
      <h1
        className='mb-4 mt-6 break-words text-lg font-bold sm:text-xl md:text-2xl lg:text-3xl'
        {...props}
      >
        {processChildrenForLatex(props.children)}
      </h1>
    );
  },
  h2(props) {
    return (
      <h2
        className='mb-3 mt-5 break-words text-base font-bold sm:text-lg md:text-xl lg:text-2xl'
        {...props}
      >
        {processChildrenForLatex(props.children)}
      </h2>
    );
  },
  h3(props) {
    return (
      <h3
        className='mb-2 mt-4 break-words text-sm font-semibold sm:text-base md:text-lg lg:text-xl'
        {...props}
      >
        {processChildrenForLatex(props.children)}
      </h3>
    );
  },
  h4(props) {
    return (
      <h4
        className='mb-2 mt-3 break-words text-sm font-semibold sm:text-base md:text-lg lg:text-xl'
        {...props}
      >
        {processChildrenForLatex(props.children)}
      </h4>
    );
  },
  ul(props) {
    return (
      <ul
        className='mb-4 list-disc pl-4 text-sm sm:pl-5 md:text-base'
        {...props}
      />
    );
  },
  ol(props) {
    return (
      <ol
        className='mb-4 list-decimal pl-4 text-sm sm:pl-5 md:text-base'
        {...props}
      />
    );
  },
  li(props) {
    return (
      <li className='mb-1 break-words text-sm md:text-base' {...props}>
        {processChildrenForLatex(props.children)}
      </li>
    );
  },
  a(props) {
    return (
      <a
        {...props}
        target='_blank'
        rel='noopener noreferrer'
        className='break-words text-primary underline transition-colors hover:text-primary-hover'
      />
    );
  },
  table(props) {
    return (
      <div className='my-4 w-full overflow-x-auto rounded-md border border-border'>
        <table
          className='w-full table-auto border-collapse text-sm md:text-base'
          {...props}
        />
      </div>
    );
  },
  thead(props) {
    return <thead className='bg-muted' {...props} />;
  },
  th(props) {
    return (
      <th
        className='border-b border-border px-2 py-2 text-left text-sm font-medium uppercase tracking-wider text-foreground sm:px-3 sm:py-2'
        {...props}
      >
        {processChildrenForLatex(props.children)}
      </th>
    );
  },
  td(props) {
    return (
      <td
        className='break-words border-b border-border px-2 py-2 align-top text-foreground-secondary sm:px-3 sm:py-2'
        {...props}
      >
        {processChildrenForLatex(props.children)}
      </td>
    );
  },
  tr(props) {
    return <tr className='transition-colors hover:bg-muted' {...props} />;
  },
  blockquote(props) {
    return (
      <blockquote
        className='my-4 border-l-4 border-border pl-4 text-sm italic text-foreground-secondary'
        {...props}
      >
        {processChildrenForLatex(props.children)}
      </blockquote>
    );
  },
  hr(props) {
    return <hr className='my-6 border-t border-border' {...props} />;
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
