import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { db } from '@/lib/db';
import { TRPCError } from '@trpc/server';
import { parseJsonResponse, generateChatCompletion } from '@/lib/aiClient';
import { aiCreditCheck } from '../middleware/creditCheck';
import { recordCreditTransaction, refundCredits } from '@/lib/utils/credits';
import { CreditTransactionType } from "@/lib/types";

// Input schema for creating a survey
const createSurveySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

// Input schema for updating a survey
const updateSurveySchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

// Input schema for saving survey data
const saveSurveyDataSchema = z.object({
  id: z.string(),
  data: z.any(),
});

// Input schema for submissions
const createSubmissionSchema = z.object({
  surveyId: z.string(),
  data: z.any(),
});

// Input schema for AI survey generation
const generateSurveySchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  title: z.string().optional(),
  description: z.string().optional(),
});

// Export the survey router
export const surveyRouter = createTRPCRouter({
  // Create a new survey
  create: protectedProcedure
    .input(createSurveySchema)
    .mutation(async ({ ctx, input }) => {
      // Create the survey
      const userId = ctx.session.user.id;
      
      const survey = await db.survey.create({
        data: {
          title: input.title,
          description: input.description,
          userId,
          status: 'draft',
        },
      });
      
      return survey;
    }),
    
  // Get all surveys for the current user
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      // Get all surveys for the user
      let surveys = await db.survey.findMany({
        where: {
          userId,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          publicShareToken: true
        }
      });
      
      return surveys;
    }),
    
  // Get a survey by ID (protected - only owner can access)
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      const survey = await db.survey.findUnique({
        where: {
          id: input.id,
        },
      });
      
      if (!survey) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Survey not found',
        });
      }
      
      // Check if the user is the owner
      if (survey.userId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not authorized to access this survey',
        });
      }
      
      return survey;
    }),
    
  // Get submissions for a survey
  getSubmissions: protectedProcedure
    .input(z.object({ surveyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      // Check if the user is the owner of the survey
      const survey = await db.survey.findUnique({
        where: {
          id: input.surveyId,
        },
      });
      
      if (!survey) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Survey not found',
        });
      }
      
      if (survey.userId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not authorized to view submissions for this survey',
        });
      }
      
      // Get the submissions
      const submissions = await db.submission.findMany({
        where: {
          surveyId: input.surveyId,
        },
        orderBy: {
          submittedAt: 'desc',
        },
      });
      
      return submissions;
    }),
    
  // Get a published survey by public share token (public)
  getByShareToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      if (!input.token || input.token.trim() === '') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid share token provided',
        });
      }

      try {
        const survey = await db.survey.findUnique({
          where: {
            publicShareToken: input.token,
            status: 'published',
          },
        });
        
        if (!survey) {
          console.error(`Survey not found for token: ${input.token}`);
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Survey not found or not published',
          });
        }
        
        return survey;
      } catch (error) {
        console.error('Error in getByShareToken:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while retrieving the survey',
        });
      }
    }),
    
  // Update a survey
  update: protectedProcedure
    .input(updateSurveySchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      // Check if the user is the owner
      const existingSurvey = await db.survey.findUnique({
        where: {
          id: input.id,
        },
      });
      
      if (!existingSurvey) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Survey not found',
        });
      }
      
      if (existingSurvey.userId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not authorized to update this survey',
        });
      }
      
      // Update data object
      const updateData: any = {
        title: input.title,
        description: input.description,
      };
      
      // If status is being updated to 'published' and the current status is not 'published',
      // ensure a public share token is generated
      if (input.status === 'published' && existingSurvey.status !== 'published') {
        updateData.status = input.status;
        // Only regenerate the token if it's not already set
        if (!existingSurvey.publicShareToken) {
          // Generate a new CUID for the public share token if one doesn't exist
          const { randomUUID } = require('crypto');
          updateData.publicShareToken = randomUUID();
        }
      } else if (input.status) {
        // Just update the status if provided
        updateData.status = input.status;
      }
      
      // Update the survey
      const updatedSurvey = await db.survey.update({
        where: {
          id: input.id,
        },
        data: updateData,
      });
      
      return updatedSurvey;
    }),
    
  // Save survey data (pages, questions, etc.)
  saveSurveyData: protectedProcedure
    .input(saveSurveyDataSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      // Check if the user is the owner
      const existingSurvey = await db.survey.findUnique({
        where: {
          id: input.id,
        },
      });
      
      if (!existingSurvey) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Survey not found',
        });
      }
      
      if (existingSurvey.userId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not authorized to update this survey',
        });
      }
      
      // Update the survey data
      const updatedSurvey = await db.survey.update({
        where: {
          id: input.id,
        },
        data: {
          data: input.data,
        },
      });
      
      return updatedSurvey;
    }),
    
  // Delete a survey
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      // Check if the user is the owner
      const existingSurvey = await db.survey.findUnique({
        where: {
          id: input.id,
        },
      });
      
      if (!existingSurvey) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Survey not found',
        });
      }
      
      if (existingSurvey.userId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not authorized to delete this survey',
        });
      }
      
      // Delete the survey
      await db.survey.delete({
        where: {
          id: input.id,
        },
      });
      
      return { success: true };
    }),
    
  // Submit survey responses
  submitResponses: publicProcedure
    .input(createSubmissionSchema)
    .mutation(async ({ input }) => {
      try {
        // Check if the survey exists and is published
        const survey = await db.survey.findUnique({
          where: {
            id: input.surveyId,
            status: 'published',
          },
        });
        
        if (!survey) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Survey not found or not available for submission',
          });
        }
        
        // Create the submission with the response data
        const submission = await db.submission.create({
          data: {
            surveyId: input.surveyId,
            data: input.data,
          },
        });
        
        return { success: true, submissionId: submission.id };
      } catch (error) {
        console.error('Error submitting responses:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to submit responses',
          cause: error,
        });
      }
    }),

  // Generate survey with AI
  generateWithAI: protectedProcedure
    .input(generateSurveySchema)
    .use(aiCreditCheck)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;
        const { prompt, title, description } = input;
        
        // System prompt for the AI
        const systemPrompt = `You are an expert survey designer. Create a comprehensive survey based on the user's needs.
        
        Your task is to generate a well-structured JSON survey format following these specifications:
        
        1. Return a JSON object with this structure:
        {
          "title": "Survey Title",
          "description": "Survey description",
          "pages": [
            {
              "title": "Page Title",
              "description": "Optional page description",
              "questions": [
                {
                  "type": "text|radio|checkbox",
                  "text": "Question text",
                  "required": true|false,
                  "options": ["Option 1", "Option 2"] // Only for radio/checkbox
                }
              ],
              "contextElements": [
                {
                  "type": "paragraph|image|video",
                  "content": "Text content or URL for media"
                }
              ]
            }
          ]
        }
        
        2. Make sure to create a logical flow of questions across multiple pages (2-4 pages recommended)
        3. Use appropriate question types (text, radio, checkbox) for different question scenarios
        4. Add context elements (paragraphs, placeholders for images/videos) to provide context where needed
        5. For each page, include a clear title and brief description
        6. Design the survey to collect meaningful, actionable data
        
        Generate a complete survey structure based on this prompt: "${prompt}"`;
        
        // Call the AI to generate the survey structure
        const aiResponse = await generateChatCompletion(
          [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          "GEMINI_FLASH_WEB",
          {
            temperature: 0.7,
            max_tokens: 4000,
          }
        );
        
        // Parse the AI response into a JSON structure
        const surveyStructure = parseJsonResponse(aiResponse);
        
        // Create the survey with the generated data
        const survey = await db.survey.create({
          data: {
            title: title || surveyStructure.title || "AI Generated Survey",
            description: description || surveyStructure.description || "",
            userId,
            status: 'draft',
            data: surveyStructure,
          },
        });
        
        // Record the AI generation transaction
        await db.creditTransaction.create({
          data: {
            userId: ctx.session.user.id,
            credits: -1,
            amount: 0,
            type: CreditTransactionType.AI
          }
        });
        
        return {
          success: true,
          survey,
          structure: surveyStructure
        };
      } catch (error) {
        console.error('AI survey generation error:', error);
        
        // If generation failed, refund the AI credit since it wasn't actually used
        try {
          await db.user.update({
            where: { id: ctx.session.user.id },
            data: { credits: { increment: 1 } }
          });
        } catch (refundError) {
          console.error('Failed to refund AI credit:', refundError);
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate survey with AI',
          cause: error,
        });
      }
    }),
}); 