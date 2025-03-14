"use client";

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { marked } from "marked";
import { generateHTML } from "@tiptap/html";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3, 
  Quote, 
  Code, 
  Link as LinkIcon,
  Undo,
  Redo
} from "lucide-react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-md transition-colors ${
        isActive
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );
};

// Convert Markdown to HTML
const markdownToHtml = (markdown: string): string => {
  return marked.parse(markdown) as string;
};

// Convert HTML to Markdown (simplified version)
const htmlToMarkdown = (html: string): string => {
  // This is a very simplified conversion
  // In a production app, you might want to use a more robust library
  let markdown = html;
  
  // Replace headings
  markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n');
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n');
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n');
  
  // Replace paragraphs
  markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n\n');
  
  // Replace bold
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
  
  // Replace italic
  markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');
  
  // Replace links
  markdown = markdown.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)');
  
  // Replace lists (without 's' flag)
  markdown = markdown.replace(/<ul>([^]*?)<\/ul>/g, (match, p1) => {
    return p1.replace(/<li>(.*?)<\/li>/g, '- $1\n');
  });
  
  markdown = markdown.replace(/<ol>([^]*?)<\/ol>/g, (match, p1) => {
    let index = 1;
    return p1.replace(/<li>(.*?)<\/li>/g, () => {
      return `${index++}. $1\n`;
    });
  });
  
  // Replace blockquotes (without 's' flag)
  markdown = markdown.replace(/<blockquote>([^]*?)<\/blockquote>/g, '> $1\n\n');
  
  // Replace code blocks (without 's' flag)
  markdown = markdown.replace(/<pre><code>([^]*?)<\/code><\/pre>/g, '```\n$1\n```\n\n');
  
  // Replace inline code
  markdown = markdown.replace(/<code>(.*?)<\/code>/g, '`$1`');
  
  // Clean up extra newlines
  markdown = markdown.replace(/\n\n\n+/g, '\n\n');
  
  return markdown.trim();
};

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onChange,
  placeholder = "Enter text...",
  className = "",
}) => {
  const [mode, setMode] = useState<"markdown" | "wysiwyg">("wysiwyg");
  const [markdownContent, setMarkdownContent] = useState(content);
  const [linkUrl, setLinkUrl] = useState<string>("");
  const [showLinkInput, setShowLinkInput] = useState<boolean>(false);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
      }),
    ],
    content: markdownToHtml(content),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = htmlToMarkdown(html);
      setMarkdownContent(markdown);
      onChange(markdown);
    },
  });

  // Update editor content when external content changes
  useEffect(() => {
    if (editor && content !== markdownContent) {
      setMarkdownContent(content);
      editor.commands.setContent(markdownToHtml(content));
    }
  }, [content, editor, markdownContent]);

  // Handle content changes from the textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setMarkdownContent(newContent);
    onChange(newContent);
    
    // Update the editor content when switching back to WYSIWYG mode
    if (editor) {
      editor.commands.setContent(markdownToHtml(newContent));
    }
  };

  // Handle mode switching
  const handleModeSwitch = (newMode: "markdown" | "wysiwyg") => {
    if (newMode === "wysiwyg" && editor) {
      // When switching to WYSIWYG, convert markdown to HTML
      editor.commands.setContent(markdownToHtml(markdownContent));
    }
    setMode(newMode);
  };

  // Handle link insertion
  const handleLinkInsert = () => {
    if (editor && linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  // Handle link removal
  const handleLinkRemove = () => {
    if (editor) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      setShowLinkInput(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => handleModeSwitch("markdown")}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            mode === "markdown"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Markdown
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch("wysiwyg")}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            mode === "wysiwyg"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          WYSIWYG
        </button>
      </div>
      
      {mode === "wysiwyg" && editor && (
        <div className="flex flex-wrap items-center gap-1 border border-gray-200 rounded-md p-1 bg-white dark:bg-gray-800 dark:border-gray-700">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>
          
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Inline Code"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>
          
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
          
          {showLinkInput ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="text-sm px-2 py-1 border rounded w-40 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLinkInsert();
                  } else if (e.key === 'Escape') {
                    setShowLinkInput(false);
                    setLinkUrl("");
                  }
                }}
                autoFocus
              />
              <button
                onClick={handleLinkInsert}
                className="text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                disabled={!linkUrl}
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowLinkInput(false);
                  setLinkUrl("");
                }}
                className="text-sm px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <ToolbarButton
              onClick={() => {
                if (editor.isActive('link')) {
                  handleLinkRemove();
                } else {
                  setShowLinkInput(true);
                  // Pre-fill with selected text if it looks like a URL
                  const selectedText = editor.state.doc.textBetween(
                    editor.state.selection.from,
                    editor.state.selection.to,
                    ''
                  );
                  if (selectedText.match(/^https?:\/\//)) {
                    setLinkUrl(selectedText);
                  }
                }
              }}
              isActive={editor.isActive('link')}
              title={editor.isActive('link') ? "Remove Link" : "Add Link"}
            >
              <LinkIcon className="h-4 w-4" />
            </ToolbarButton>
          )}
          
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
          
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>
      )}
      
      {mode === "markdown" ? (
        <textarea
          value={markdownContent}
          onChange={handleTextareaChange}
          placeholder={placeholder}
          className="min-h-[100px] w-full resize-y rounded border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 sm:text-base"
        />
      ) : (
        <div className="min-h-[100px] border border-gray-200 rounded p-3 dark:border-gray-700 prose dark:prose-invert prose-sm sm:prose-base max-w-none overflow-auto tiptap-editor">
          <EditorContent editor={editor} />
        </div>
      )}
    </div>
  );
}; 