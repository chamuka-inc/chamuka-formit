"use client";

import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

interface LatexTextProps {
  children: string;
  className?: string;
}

/**
 * Component that renders text with LaTeX support.
 * Supports both inline LaTeX ($...$ or \(...\)) and block LaTeX ($$...$$ or \[...\]).
 * Regular text is rendered as-is.
 */
export const LatexText = ({ children, className = "" }: LatexTextProps) => {
  if (!children) return null;

  // Pattern to match LaTeX expressions
  // Matches: $...$, $$...$$, \(...\), \[...\]
  const latexPattern =
    /(\$\$[\s\S]*?\$\$|\$[^$\n]*?\$|\\\[[\s\S]*?\\\]|\\\([^)]*?\\\))/g;

  const parts: Array<{ type: "text" | "inline" | "block"; content: string }> =
    [];
  let lastIndex = 0;
  let match;

  // Find all LaTeX expressions
  while ((match = latexPattern.exec(children)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      const textContent = children.slice(lastIndex, match.index);
      if (textContent) {
        parts.push({ type: "text", content: textContent });
      }
    }

    // Determine if it's block or inline LaTeX
    const latexContent = match[0];
    let type: "inline" | "block";
    let content: string;

    if (latexContent.startsWith("$$") && latexContent.endsWith("$$")) {
      // Block LaTeX: $$...$$
      type = "block";
      content = latexContent.slice(2, -2).trim();
    } else if (latexContent.startsWith("$") && latexContent.endsWith("$")) {
      // Inline LaTeX: $...$
      type = "inline";
      content = latexContent.slice(1, -1).trim();
    } else if (latexContent.startsWith("\\[") && latexContent.endsWith("\\]")) {
      // Block LaTeX: \[...\]
      type = "block";
      content = latexContent.slice(2, -2).trim();
    } else if (latexContent.startsWith("\\(") && latexContent.endsWith("\\)")) {
      // Inline LaTeX: \(...\)
      type = "inline";
      content = latexContent.slice(2, -2).trim();
    } else {
      // Fallback: treat as text
      parts.push({ type: "text", content: latexContent });
      lastIndex = match.index + match[0].length;
      continue;
    }

    parts.push({ type, content });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last match
  if (lastIndex < children.length) {
    const textContent = children.slice(lastIndex);
    if (textContent) {
      parts.push({ type: "text", content: textContent });
    }
  }

  // If no LaTeX found, return plain text
  if (parts.length === 0) {
    return <span className={className}>{children}</span>;
  }

  // Render parts
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.type === "text") {
          return <span key={index}>{part.content}</span>;
        } else if (part.type === "block") {
          return (
            <div key={index} className='my-2'>
              <BlockMath math={part.content} />
            </div>
          );
        } else {
          return <InlineMath key={index} math={part.content} />;
        }
      })}
    </span>
  );
};
