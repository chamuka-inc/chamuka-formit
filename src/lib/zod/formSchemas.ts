import { z } from "zod";

/**
 * Form Structure Schemas for AI Streaming
 *
 * These schemas define the structure of AI-generated forms and are used
 * by the Vercel AI SDK's streamObject for progressive JSON parsing.
 */

// Context elements that provide additional content around questions
export const contextElementSchema = z.object({
  type: z.enum(["paragraph", "image", "video"]),
  content: z
    .string()
    .describe(
      "Detailed markdown text content for paragraph, or valid URL for image/video",
    ),
});

export type ContextElement = z.infer<typeof contextElementSchema>;

// Individual form questions
export const questionSchema = z.object({
  type: z.enum(["text", "radio", "checkbox"]),
  text: z.string().describe("The question text"),
  required: z.boolean().describe("Whether the question is required"),
  options: z
    .array(z.string())
    .optional()
    .describe("Options for radio/checkbox questions"),
  contextElements: z
    .array(contextElementSchema)
    .optional()
    .describe("Context elements for this question"),
});

export type Question = z.infer<typeof questionSchema>;

// Form pages containing questions and context
export const pageSchema = z.object({
  title: z.string().describe("Page title"),
  description: z.string().optional().describe("Optional page description"),
  questions: z.array(questionSchema).describe("Questions on this page"),
  contextElements: z
    .array(contextElementSchema)
    .optional()
    .describe("Page-level context elements"),
});

export type Page = z.infer<typeof pageSchema>;

// Complete form structure
export const formStructureSchema = z.object({
  title: z.string().describe("Form title"),
  description: z.string().optional().describe("Form description"),
  pages: z.array(pageSchema).describe("Form pages"),
});

export type FormStructure = z.infer<typeof formStructureSchema>;

// Partial types for streaming (all fields optional)
export type PartialFormStructure = {
  title?: string;
  description?: string;
  pages?: Array<{
    title?: string;
    description?: string;
    questions?: Array<{
      type?: "text" | "radio" | "checkbox";
      text?: string;
      required?: boolean;
      options?: string[];
      contextElements?: Array<{
        type?: "paragraph" | "image" | "video";
        content?: string;
      }>;
    }>;
    contextElements?: Array<{
      type?: "paragraph" | "image" | "video";
      content?: string;
    }>;
  }>;
};
