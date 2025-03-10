import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { db } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { aiCreditCheck } from "../middleware/creditCheck";
import { CreditTransactionType } from "@/lib/types";
import { randomUUID } from "crypto";
import { Prisma, FormStatus } from "@prisma/client";
import { getEdgeAuthHeaders } from "@/lib/auth/edgeAuth";

// Define types for form data structure
interface ContextElement {
  type: "paragraph" | "image" | "video";
  content: string;
}

interface FormQuestion {
  type: "text" | "radio" | "checkbox";
  text: string;
  required: boolean;
  options?: string[];
  contextElements?: ContextElement[];
}

interface FormPage {
  title: string;
  description?: string;
  questions: FormQuestion[];
  contextElements?: ContextElement[];
}

interface FormData {
  title: string;
  description?: string;
  pages: FormPage[];
  [key: string]: unknown; // Add index signature for compatibility with Prisma JSON type
}

// Input schema for creating a form
const createFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

// Input schema for updating a form
const updateFormSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

// Input schema for saving form data
const saveFormDataSchema = z.object({
  id: z.string(),
  data: z.custom<FormData>((val) => val !== null && typeof val === "object"),
});

// Input schema for submissions
const createSubmissionSchema = z.object({
  formId: z.string(),
  data: z.record(z.unknown()),
});

// Input schema for AI form generation
const generateFormSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  title: z.string().optional(),
  description: z.string().optional(),
});

// Input schema for AI form refinement
const refineFormSchema = z.object({
  id: z.string(),
  prompt: z.string().min(1, "Refinement instructions are required"),
});

// Add these schema definitions near your other schemas
const previewRefinementSchema = z.object({
  id: z.string(),
  prompt: z.string().min(1),
});

const applyRefinementSchema = z.object({
  id: z.string(),
  structure: z.custom<FormData>(
    (val) => val !== null && typeof val === "object",
  ),
});

// Add pagination and search input schema
const getAllFormsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(9),
  search: z.string().optional(),
});

// Helper functions
const verifyFormOwnership = async (formId: string, userId: string) => {
  const form = await db.form.findUnique({
    where: { id: formId },
  });

  if (!form) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Form not found",
    });
  }

  if (form.userId !== userId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not authorized to access this form",
    });
  }

  return form;
};

const getFormRefinementPrompt = (
  existingData: FormData,
  userPrompt: string,
) => {
  return `You are an expert content designer. Refine an existing content based on the user's instructions.
        
  Your task is to analyze the existing content structure and refine it according to the provided instructions.
  
  Here's the existing content structure:
  ${JSON.stringify(existingData, null, 2)}
  
  Follow these guidelines:
  1. Preserve the overall structure of the content
  2. Make targeted improvements based on the user's instructions
  3. Improve content clarity, organization, and flow
  4. Return the complete refined content JSON with the same structure:
  {
    "title": "Content Title",
    "description": "Content description",
    "pages": [
      {
        "title": "Page Title",
        "description": "Optional page description",
        "questions": [
          {
            "type": "text|radio|checkbox",
            "text": "Question text",
            "required": true|false,
            "options": ["Option 1", "Option 2"], // Only for radio/checkbox
            "contextElements": [
                {
                  "type": "paragraph|image|video",
                  "content": "Detailed markdown text content for the paragraph, and valid URL for image or video"
                }
            ]
          }
        ],
        "contextElements": [
          {
            "type": "paragraph|image|video",
            "content": "Detailed markdown text content for the paragraph, and valid URL for image or video"
          }
        ]
      }
    ]
  }
  
  Apply the following refinement instructions to the content: "${userPrompt}"`;
};

const getFormGenerationPrompt = (prompt: string) => {
  return `You are an expert content creator. Create a comprehensive content based on the user's needs.
        
  Your task is to generate a well-structured JSON content format following these specifications:
  
  1. Return a JSON object with this structure:
  {
    "title": "Content Title",
    "description": "Content description",
    "pages": [
      {
        "title": "Page Title",
        "description": "Optional page description",
        "questions": [
          {
            "type": "text|radio|checkbox",
            "text": "Question text",
            "required": true|false,
            "options": ["Option 1", "Option 2"], // Only for radio/checkbox
            "contextElements": [
              {
                "type": "paragraph|image|video",
                "content": "Detailed markdowntext content for the paragraph, and valid URL for image or video"
              }
        ]
          }
        ],
        "contextElements": [
          {
            "type": "paragraph|image|video",
            "content": "Detailed markdown text content for the paragraph, and valid URL for image or video"
          }
        ]
      }
    ]
  }
  
  2. Make sure to create a logical flow of content across multiple pages
  3. Use appropriate question types (text, radio, checkbox) for different question scenarios
  4. Add context elements (detailed paragraphs, images/videos) to provide context where needed
  5. For each page, include a clear title and description
  6. Design the content that satisfies the user's prompt
  
  Generate a complete content structure based on this prompt: "${prompt}"`;
};

const handleAiCreditRefund = async (userId: string, errorMessage: string) => {
  try {
    await db.user.update({
      where: { id: userId },
      data: { credits: { increment: 1 } },
    });
  } catch (refundError) {
    console.error(`Failed to refund AI credit: ${errorMessage}`, refundError);
  }
};

// Helper to convert data to Prisma-compatible JSON
const toPrismaJson = <T>(data: T): Prisma.InputJsonValue => {
  return data as unknown as Prisma.InputJsonValue;
};

// Export the form router
export const formRouter = createTRPCRouter({
  // Create a new form
  create: protectedProcedure
    .input(createFormSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return db.form.create({
        data: {
          title: input.title,
          description: input.description,
          userId,
          status: "draft",
        },
      });
    }),

  // Get all forms for the current user with pagination and search
  getAll: protectedProcedure
    .input(getAllFormsSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const skip = (input.page - 1) * input.limit;

      const where: Prisma.FormWhereInput = {
        userId,
        ...(input.search
          ? {
              OR: [
                {
                  title: {
                    contains: input.search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                {
                  description: {
                    contains: input.search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              ],
            }
          : {}),
      };

      const [forms, total] = await Promise.all([
        db.form.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          skip,
          take: input.limit,
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            publicShareToken: true,
          },
        }),
        db.form.count({ where }),
      ]);

      return {
        forms,
        pagination: {
          total,
          pageCount: Math.ceil(total / input.limit),
          page: input.page,
          limit: input.limit,
        },
      };
    }),

  // Get a form by ID (protected - only owner can access)
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return verifyFormOwnership(input.id, ctx.session.user.id);
    }),

  // Get submissions for a form
  getSubmissions: protectedProcedure
    .input(z.object({ formId: z.string() }))
    .query(async ({ ctx, input }) => {
      await verifyFormOwnership(input.formId, ctx.session.user.id);

      return db.submission.findMany({
        where: { formId: input.formId },
        orderBy: { submittedAt: "desc" },
      });
    }),

  // Get a published form by public share token (public)
  getByShareToken: publicProcedure
    .input(z.object({ token: z.string().min(1, "Token is required") }))
    .query(async ({ input }) => {
      try {
        const form = await db.form.findUnique({
          where: {
            publicShareToken: input.token,
            status: "published",
          },
        });

        if (!form) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Form not found or not published",
          });
        }

        return form;
      } catch (error) {
        console.error("Error in getByShareToken:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while retrieving the form",
        });
      }
    }),

  // Update a form
  update: protectedProcedure
    .input(updateFormSchema)
    .mutation(async ({ ctx, input }) => {
      const existingForm = await verifyFormOwnership(
        input.id,
        ctx.session.user.id,
      );

      const updateData: {
        title: string;
        description?: string;
        status?: FormStatus;
        publicShareToken?: string;
      } = {
        title: input.title,
        description: input.description,
      };

      // Handle publishing logic
      if (input.status === "published" && existingForm.status !== "published") {
        updateData.status = input.status as FormStatus;

        if (!existingForm.publicShareToken) {
          updateData.publicShareToken = randomUUID();
        }
      } else if (input.status) {
        updateData.status = input.status as FormStatus;
      }

      return db.form.update({
        where: { id: input.id },
        data: updateData,
      });
    }),

  // Save form data (pages, questions, etc.)
  saveFormData: protectedProcedure
    .input(saveFormDataSchema)
    .mutation(async ({ ctx, input }) => {
      await verifyFormOwnership(input.id, ctx.session.user.id);

      return db.form.update({
        where: { id: input.id },
        data: {
          data: toPrismaJson(input.data),
        },
      });
    }),

  // Delete a form
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await verifyFormOwnership(input.id, ctx.session.user.id);

      await db.form.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Submit form responses
  submitResponses: publicProcedure
    .input(createSubmissionSchema)
    .mutation(async ({ input }) => {
      try {
        const form = await db.form.findUnique({
          where: {
            id: input.formId,
            status: "published",
          },
        });

        if (!form) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Form not found or not available for submission",
          });
        }

        const submission = await db.submission.create({
          data: {
            formId: input.formId,
            data: toPrismaJson(input.data),
          },
        });

        return { success: true, submissionId: submission.id };
      } catch (error) {
        console.error("Error submitting responses:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit responses",
          cause: error,
        });
      }
    }),

  // Generate form with AI
  generateWithAI: protectedProcedure
    .input(generateFormSchema)
    .use(aiCreditCheck)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;
        const { prompt, title, description } = input;

        // Call the Edge API for AI generation
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/ai/generate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...getEdgeAuthHeaders(),
            },
            body: JSON.stringify({ prompt, title, description }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to generate form with AI");
        }

        const {
          formStructure,
          title: generatedTitle,
          description: generatedDescription,
        } = await response.json();

        // Create the form with the AI-generated structure
        const form = await db.form.create({
          data: {
            title: generatedTitle,
            description: generatedDescription,
            userId,
            status: "draft",
            data: toPrismaJson(formStructure),
          },
        });

        // Record the AI generation transaction
        await db.creditTransaction.create({
          data: {
            userId,
            credits: -1,
            amount: 0,
            type: CreditTransactionType.AI,
            description: "Form generation",
          },
        });

        return { success: true, formId: form.id, form };
      } catch (error) {
        console.error("AI form generation error:", error);

        // Refund the AI credit if generation failed
        await handleAiCreditRefund(
          ctx.session.user.id,
          "Failed to generate form with AI",
        );

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate form with AI",
          cause: error,
        });
      }
    }),

  // Refine form with AI
  refineWithAI: protectedProcedure
    .input(refineFormSchema)
    .use(aiCreditCheck)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, prompt } = input;
        const userId = ctx.session.user.id;

        // Get the existing form
        const existingForm = await verifyFormOwnership(id, userId);
        const existingData = existingForm.data as unknown as FormData;

        // Call the Edge API for AI refinement
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/ai/refine`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...getEdgeAuthHeaders(),
            },
            body: JSON.stringify({ existingData, prompt }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to refine form with AI");
        }

        const { structure: refinedFormStructure } = await response.json();

        // Update the form with the refined data
        const updatedForm = await db.form.update({
          where: { id, userId },
          data: {
            data: toPrismaJson(refinedFormStructure),
            // Also update the form title and description from the structure if they exist
            ...(refinedFormStructure.title && {
              title: refinedFormStructure.title,
            }),
            ...(refinedFormStructure.description !== undefined && {
              description: refinedFormStructure.description,
            }),
          },
        });

        // Record the AI refinement transaction
        await db.creditTransaction.create({
          data: {
            userId,
            credits: -1,
            amount: 0,
            type: CreditTransactionType.AI,
            description: "Form refinement",
          },
        });

        return {
          success: true,
          form: updatedForm,
          structure: refinedFormStructure,
        };
      } catch (error) {
        console.error("AI form refinement error:", error);

        // Refund the AI credit if refinement failed
        await handleAiCreditRefund(
          ctx.session.user.id,
          "Failed to refine form with AI",
        );

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to refine form with AI",
          cause: error,
        });
      }
    }),

  // Preview refinement with AI (without applying changes)
  previewRefinement: protectedProcedure
    .input(previewRefinementSchema)
    .use(aiCreditCheck)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, prompt } = input;
        const userId = ctx.session.user.id;

        // Get the existing form
        const existingForm = await verifyFormOwnership(id, userId);
        const existingData = existingForm.data as unknown as FormData;

        // Call the Edge API for AI refinement
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/ai/refine`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...getEdgeAuthHeaders(),
            },
            body: JSON.stringify({ existingData, prompt }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to preview form refinement with AI");
        }

        const { structure: refinedFormStructure } = await response.json();

        // Record the AI refinement transaction
        await db.creditTransaction.create({
          data: {
            userId,
            credits: -1,
            amount: 0,
            type: CreditTransactionType.AI,
            description: "Form refinement preview",
          },
        });

        return {
          success: true,
          structure: refinedFormStructure,
        };
      } catch (error) {
        console.error("AI form refinement preview error:", error);

        // Refund the AI credit if refinement preview failed
        await handleAiCreditRefund(
          ctx.session.user.id,
          "Failed to preview form refinement with AI",
        );

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to preview form refinement with AI",
          cause: error,
        });
      }
    }),

  // Apply a previously previewed refinement
  applyRefinement: protectedProcedure
    .input(applyRefinementSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, structure } = input;
        const userId = ctx.session.user.id;

        await verifyFormOwnership(id, userId);

        // Update the form with the refined data
        const updatedForm = await db.form.update({
          where: { id, userId },
          data: {
            data: toPrismaJson(structure),
            // Also update the form title and description from the structure if they exist
            ...(structure.title && { title: structure.title }),
            ...(structure.description !== undefined && {
              description: structure.description,
            }),
          },
        });

        return {
          success: true,
          form: updatedForm,
        };
      } catch (error) {
        console.error("Form refinement application error:", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to apply form refinement",
          cause: error,
        });
      }
    }),
});
