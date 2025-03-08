import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { db } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { parseJsonResponse, generateChatCompletion } from "@/lib/aiClient";
import { aiCreditCheck } from "../middleware/creditCheck";
import { CreditTransactionType } from "@/lib/types";

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
  data: z.any(),
});

// Input schema for submissions
const createSubmissionSchema = z.object({
  formId: z.string(),
  data: z.any(),
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
  structure: z.any(), // We'll validate this structure in the procedure
});

// Export the form router
export const formRouter = createTRPCRouter({
  // Create a new form
  create: protectedProcedure
    .input(createFormSchema)
    .mutation(async ({ ctx, input }) => {
      // Create the form
      const userId = ctx.session.user.id;

      const form = await db.form.create({
        data: {
          title: input.title,
          description: input.description,
          userId,
          status: "draft",
        },
      });

      return form;
    }),

  // Get all forms for the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Get all forms for the user
    let forms = await db.form.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        publicShareToken: true,
      },
    });

    return forms;
  }),

  // Get a form by ID (protected - only owner can access)
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const form = await db.form.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!form) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      // Check if the user is the owner
      if (form.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to access this form",
        });
      }

      return form;
    }),

  // Get submissions for a form
  getSubmissions: protectedProcedure
    .input(z.object({ formId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if the user is the owner of the form
      const form = await db.form.findUnique({
        where: {
          id: input.formId,
        },
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
          message: "You are not authorized to view submissions for this form",
        });
      }

      // Get the submissions
      const submissions = await db.submission.findMany({
        where: {
          formId: input.formId,
        },
        orderBy: {
          submittedAt: "desc",
        },
      });

      return submissions;
    }),

  // Get a published form by public share token (public)
  getByShareToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      if (!input.token || input.token.trim() === "") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid share token provided",
        });
      }

      try {
        const form = await db.form.findUnique({
          where: {
            publicShareToken: input.token,
            status: "published",
          },
        });

        if (!form) {
          console.error(`Form not found for token: ${input.token}`);
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
      const userId = ctx.session.user.id;

      // Check if the user is the owner
      const existingForm = await db.form.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!existingForm) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      if (existingForm.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to update this form",
        });
      }

      // Update data object
      const updateData: any = {
        title: input.title,
        description: input.description,
      };

      // If status is being updated to 'published' and the current status is not 'published',
      // ensure a public share token is generated
      if (input.status === "published" && existingForm.status !== "published") {
        updateData.status = input.status;
        // Only regenerate the token if it's not already set
        if (!existingForm.publicShareToken) {
          // Generate a new CUID for the public share token if one doesn't exist
          const { randomUUID } = require("crypto");
          updateData.publicShareToken = randomUUID();
        }
      } else if (input.status) {
        // Just update the status if provided
        updateData.status = input.status;
      }

      // Update the form
      const updatedForm = await db.form.update({
        where: {
          id: input.id,
        },
        data: updateData,
      });

      return updatedForm;
    }),

  // Save form data (pages, questions, etc.)
  saveFormData: protectedProcedure
    .input(saveFormDataSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if the user is the owner
      const existingForm = await db.form.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!existingForm) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      if (existingForm.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to update this form",
        });
      }

      // Update the form data
      const updatedForm = await db.form.update({
        where: {
          id: input.id,
        },
        data: {
          data: input.data,
        },
      });

      return updatedForm;
    }),

  // Delete a form
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if the user is the owner
      const existingForm = await db.form.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!existingForm) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      if (existingForm.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to delete this form",
        });
      }

      // Delete the form
      await db.form.delete({
        where: {
          id: input.id,
        },
      });

      return { success: true };
    }),

  // Submit form responses
  submitResponses: publicProcedure
    .input(createSubmissionSchema)
    .mutation(async ({ input }) => {
      try {
        // Check if the form exists and is published
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

        // Create the submission with the response data
        const submission = await db.submission.create({
          data: {
            formId: input.formId,
            data: input.data,
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

        // System prompt for the AI
        const systemPrompt = `You are an expert content creator. Create a comprehensive content based on the user's needs.
        
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
                  "options": ["Option 1", "Option 2"] // Only for radio/checkbox,
                  "contextElements": [
                    {
                      "type": "paragraph|image|video",
                      "content": "Detailed text content for the paragraph, and valid URL for image or video"
                    }
              ]
                }
              ],
              "contextElements": [
                {
                  "type": "paragraph|image|video",
                  "content": "Detailed text content for the paragraph, and valid URL for image or video"
                }
              ]
            }
          ]
        }
        
        2. Make sure to create a logical flow of content across multiple pages (2-4 pages recommended)
        3. Use appropriate question types (text, radio, checkbox) for different question scenarios
        4. Add context elements (detailed paragraphs, images/videos) to provide context where needed
        5. For each page, include a clear title and description
        6. Design the content that satisfies the user's prompt
        
        Generate a complete content structure based on this prompt: "${prompt}"`;

        // Call the AI to generate the form structure
        const aiResponse = await generateChatCompletion(
          [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          "GEMINI_FLASH_WEB",
          {
            temperature: 0.7,
            max_tokens: 8192,
          },
        );

        // Parse the AI response into a JSON structure
        const formStructure = parseJsonResponse(aiResponse);

        // Create the form with the generated data
        const form = await db.form.create({
          data: {
            title: title || formStructure.title || "AI Generated Form",
            description: description || formStructure.description || "",
            userId,
            status: "draft",
            data: formStructure,
          },
        });

        // Record the AI generation transaction
        await db.creditTransaction.create({
          data: {
            userId: ctx.session.user.id,
            credits: -1,
            amount: 0,
            type: CreditTransactionType.AI,
          },
        });

        return {
          success: true,
          form,
          structure: formStructure,
        };
      } catch (error) {
        console.error("AI form generation error:", error);

        // If generation failed, refund the AI credit since it wasn't actually used
        try {
          await db.user.update({
            where: { id: ctx.session.user.id },
            data: { credits: { increment: 1 } },
          });
        } catch (refundError) {
          console.error("Failed to refund AI credit:", refundError);
        }

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
        const userId = ctx.session.user.id;
        const { id, prompt } = input;

        // Fetch the existing form
        const existingForm = await db.form.findUnique({
          where: {
            id,
            userId,
          },
        });

        if (!existingForm) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Form not found or you don't have permission to access it",
          });
        }

        const existingData = existingForm.data as any;

        // System prompt for the AI
        const systemPrompt = `You are an expert content designer. Refine an existing content based on the user's instructions.
        
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
                        "content": "Detailed text content for the paragraph, and valid URL for image or video"
                      }
                  ]
                }
              ],
              "contextElements": [
                {
                  "type": "paragraph|image|video",
                  "content": "Detailed text content for the paragraph, and valid URL for image or video"
                }
              ]
            }
          ]
        }
        
        Apply the following refinement instructions to the content: "${prompt}"`;

        // Call the AI to refine the form
        const aiResponse = await generateChatCompletion(
          [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          "GEMINI_FLASH_WEB",
          {
            temperature: 0.7,
            max_tokens: 8192,
          },
        );

        // Parse the AI response into a JSON structure
        const refinedFormStructure = parseJsonResponse(aiResponse);

        // Update the form with the refined data
        const updatedForm = await db.form.update({
          where: {
            id,
            userId,
          },
          data: {
            data: refinedFormStructure,
          },
        });

        // Record the AI refinement transaction
        await db.creditTransaction.create({
          data: {
            userId: ctx.session.user.id,
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

        // If refinement failed, refund the AI credit
        try {
          await db.user.update({
            where: { id: ctx.session.user.id },
            data: { credits: { increment: 1 } },
          });
        } catch (refundError) {
          console.error("Failed to refund AI credit:", refundError);
        }

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
        const userId = ctx.session.user.id;
        const { id, prompt } = input;

        // Fetch the existing form
        const existingForm = await db.form.findUnique({
          where: {
            id,
            userId,
          },
        });

        if (!existingForm) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Form not found or you don't have permission to access it",
          });
        }

        const existingData = existingForm.data as any;

        // System prompt for the AI - same as refineWithAI
        const systemPrompt = `You are an expert content designer. Refine an existing content based on the user's instructions.
        
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
                        "content": "Detailed text content for the paragraph, and valid URL for image or video"
                      }
                  ]
                }
              ],
              "contextElements": [
                {
                  "type": "paragraph|image|video",
                  "content": "Detailed text content for the paragraph, and valid URL for image or video"
                }
              ]
            }
          ]
        }
        
        Apply the following refinement instructions to the content: "${prompt}"`;

        // Call the AI to refine the form
        const aiResponse = await generateChatCompletion(
          [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          "GEMINI_FLASH_WEB",
          {
            temperature: 0.7,
            max_tokens: 8192,
          },
        );

        // Parse the AI response into a JSON structure
        const refinedFormStructure = parseJsonResponse(aiResponse);

        // Record the AI refinement transaction
        await db.creditTransaction.create({
          data: {
            userId: ctx.session.user.id,
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

        // If refinement preview failed, refund the AI credit
        try {
          await db.user.update({
            where: { id: ctx.session.user.id },
            data: { credits: { increment: 1 } },
          });
        } catch (refundError) {
          console.error("Failed to refund AI credit:", refundError);
        }

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
        const userId = ctx.session.user.id;
        const { id, structure } = input;

        // Validate the structure (basic check)
        if (!structure || typeof structure !== "object") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid form structure provided",
          });
        }

        // Fetch the existing form
        const existingForm = await db.form.findUnique({
          where: {
            id,
            userId,
          },
        });

        if (!existingForm) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Form not found or you don't have permission to access it",
          });
        }

        // Update the form with the refined data
        const updatedForm = await db.form.update({
          where: {
            id,
            userId,
          },
          data: {
            data: structure,
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
