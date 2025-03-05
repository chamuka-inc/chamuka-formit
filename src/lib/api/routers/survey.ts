import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { db } from '@/lib/db';
import { TRPCError } from '@trpc/server';

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

// Input schema for adding a page to a survey
const addPageSchema = z.object({
  surveyId: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

// Input schema for updating a page
const updatePageSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

// Input schema for adding a question to a page
const addQuestionSchema = z.object({
  pageId: z.string(),
  text: z.string().min(1, 'Question text is required'),
  type: z.enum(['text', 'radio', 'checkbox']),
  required: z.boolean().optional().default(false),
  options: z.array(z.string()).optional().default([]),
});

// Input schema for updating a question
const updateQuestionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Question text is required'),
  type: z.enum(['text', 'radio', 'checkbox']),
  required: z.boolean().optional().default(false),
  options: z.array(z.string()).optional().default([]),
});

// Input schema for adding a context element
const addContextElementSchema = z.object({
  pageId: z.string().optional(),
  questionId: z.string().optional(),
  type: z.enum(['paragraph', 'image', 'video']),
  content: z.string().min(1, 'Content is required'),
  orderIndex: z.number(),
});

// Input schema for submissions
const createSubmissionSchema = z.object({
  surveyId: z.string(),
  responses: z.array(z.object({
    questionId: z.string(),
    value: z.string(),
  })),
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
      const userId = process.env.NODE_ENV === 'development' ? 'dev-user' : ctx.session.user.id;
      
      // In development, ensure the dev user exists
      if (process.env.NODE_ENV === 'development') {
        const devUser = await db.user.upsert({
          where: { id: 'dev-user' },
          update: {},
          create: {
            id: 'dev-user',
            email: 'dev@example.com',
            name: 'Development User',
            role: 'admin',
          },
        });
      }

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
      const userId = process.env.NODE_ENV === 'development' ? 'dev-user' : ctx.session.user.id;
      
      // In development, ensure the dev user exists
      if (process.env.NODE_ENV === 'development') {
        const devUser = await db.user.upsert({
          where: { id: 'dev-user' },
          update: {},
          create: {
            id: 'dev-user',
            email: 'dev@example.com',
            name: 'Development User',
            role: 'admin',
          },
        });
      }
      
      const survey = await db.survey.findUnique({
        where: {
          id: input.id,
        },
        include: {
          pages: {
            include: {
              questions: {
                include: {
                  contextElements: true,
                },
                orderBy: {
                  orderIndex: 'asc',
                },
              },
              contextElements: {
                orderBy: {
                  orderIndex: 'asc',
                },
              },
            },
            orderBy: {
              orderIndex: 'asc',
            },
          },
        },
      });
      
      // In development mode, if survey not found or has no pages, return a sample survey
      if (process.env.NODE_ENV === 'development' && (!survey || !survey.pages || survey.pages.length === 0)) {
        try {
          // Create a sample survey with pages if it doesn't exist
          const sampleSurvey = await db.survey.upsert({
            where: { id: input.id },
            update: {},
            create: {
              id: input.id,
              title: 'Sample Survey',
              description: 'This is a sample survey for development',
              userId,
              status: 'draft',
            },
          });
          
          // Check if the survey has pages
          const existingPages = await db.surveyPage.findMany({
            where: { surveyId: input.id },
          });
          
          if (existingPages.length === 0) {
            // Create different sample surveys based on the id to provide variety
            const lastChar = input.id.slice(-1);
            const surveyType = parseInt(lastChar, 36) % 4; // Get a number 0-3 based on the last character
            
            switch (surveyType) {
              case 0:
                // Customer Feedback Survey
                await db.surveyPage.create({
                  data: {
                    surveyId: input.id,
                    title: 'Welcome to Our Customer Feedback Survey',
                    orderIndex: 0,
                    questions: {
                      create: []
                    },
                    contextElements: {
                      create: [
                        {
                          type: 'paragraph',
                          content: 'Thank you for taking the time to provide your feedback. Your opinions help us improve our products and services.',
                          orderIndex: 0,
                        },
                        {
                          type: 'paragraph',
                          content: 'This survey should take approximately 5 minutes to complete.',
                          orderIndex: 1,
                        }
                      ]
                    }
                  },
                });
                
                await db.surveyPage.create({
                  data: {
                    surveyId: input.id,
                    title: 'About Your Recent Purchase',
                    orderIndex: 1,
                    questions: {
                      create: [
                        {
                          text: 'How satisfied were you with your recent purchase?',
                          type: 'radio',
                          required: true,
                          orderIndex: 0,
                          options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
                        },
                        {
                          text: 'What influenced your decision to purchase our product?',
                          type: 'checkbox',
                          required: true,
                          orderIndex: 1,
                          options: ['Price', 'Quality', 'Brand Reputation', 'Features', 'Recommendations', 'Previous Experience'],
                        },
                        {
                          text: 'Please share any specific feedback about your purchase experience:',
                          type: 'text',
                          required: false,
                          orderIndex: 2,
                        }
                      ]
                    }
                  },
                });
                
                await db.surveyPage.create({
                  data: {
                    surveyId: input.id,
                    title: 'Customer Service Experience',
                    orderIndex: 2,
                    questions: {
                      create: [
                        {
                          text: 'Did you contact our customer service team?',
                          type: 'radio',
                          required: true,
                          orderIndex: 0,
                          options: ['Yes', 'No'],
                        },
                        {
                          text: 'How would you rate our customer service?',
                          type: 'radio',
                          required: false,
                          orderIndex: 1,
                          options: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'],
                        }
                      ]
                    }
                  },
                });
                
                await db.surveyPage.create({
                  data: {
                    surveyId: input.id,
                    title: 'Thank You',
                    orderIndex: 3,
                    contextElements: {
                      create: [
                        {
                          type: 'paragraph',
                          content: 'Thank you for completing our survey! Your feedback is invaluable to us.',
                          orderIndex: 0,
                        },
                        {
                          type: 'paragraph',
                          content: 'As a token of our appreciation, use code SURVEY10 for 10% off your next purchase.',
                          orderIndex: 1,
                        }
                      ]
                    }
                  },
                });
                break;
                
              case 1:
                // Event Registration Survey
                await db.surveyPage.create({
                  data: {
                    surveyId: input.id,
                    title: 'Annual Conference Registration',
                    orderIndex: 0,
                    contextElements: {
                      create: [
                        {
                          type: 'paragraph',
                          content: 'Welcome to the registration form for our Annual Tech Conference 2024.',
                          orderIndex: 0,
                        },
                        {
                          type: 'paragraph',
                          content: 'Please fill out all required fields to secure your spot.',
                          orderIndex: 1,
                        }
                      ]
                    }
                  },
                });
                
                await db.surveyPage.create({
                  data: {
                    surveyId: input.id,
                    title: 'Personal Information',
                    orderIndex: 1,
                    questions: {
                      create: [
                        {
                          text: 'Full Name',
                          type: 'text',
                          required: true,
                          orderIndex: 0,
                        },
                        {
                          text: 'Email Address',
                          type: 'text',
                          required: true,
                          orderIndex: 1,
                        },
                        {
                          text: 'Company/Organization',
                          type: 'text',
                          required: true,
                          orderIndex: 2,
                        },
                        {
                          text: 'Job Title',
                          type: 'text',
                          required: false,
                          orderIndex: 3,
                        }
                      ]
                    }
                  },
                });
                
                await db.surveyPage.create({
                  data: {
                    surveyId: input.id,
                    title: 'Event Preferences',
                    orderIndex: 2,
                    questions: {
                      create: [
                        {
                          text: 'Which tracks are you interested in attending?',
                          type: 'checkbox',
                          required: true,
                          orderIndex: 0,
                          options: ['AI & Machine Learning', 'Web Development', 'Mobile Development', 'DevOps', 'Cybersecurity', 'Blockchain'],
                        },
                        {
                          text: 'Dietary Restrictions',
                          type: 'checkbox',
                          required: false,
                          orderIndex: 1,
                          options: ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Other'],
                        },
                        {
                          text: 'Will you attend the networking dinner?',
                          type: 'radio',
                          required: true,
                          orderIndex: 2,
                          options: ['Yes', 'No', 'Undecided'],
                        }
                      ]
                    }
                  },
                });
                
                await db.surveyPage.create({
                  data: {
                    surveyId: input.id,
                    title: 'Confirmation',
                    orderIndex: 3,
                    contextElements: {
                      create: [
                        {
                          type: 'paragraph',
                          content: 'Thank you for registering! You will receive a confirmation email shortly.',
                          orderIndex: 0,
                        },
                        {
                          type: 'paragraph',
                          content: 'If you have any questions, please contact events@example.com.',
                          orderIndex: 1,
                        }
                      ]
                    }
                  },
                });
                break;
                
              case 2:
                // Employee Satisfaction Survey
                await db.surveyPage.create({
                  data: {
                    surveyId: input.id,
                    title: 'Employee Satisfaction Survey',
                    orderIndex: 0,
                    contextElements: {
                      create: [
                        {
                          type: 'paragraph',
                          content: 'This confidential survey helps us understand your experience working at our company.',
                          orderIndex: 0,
                        },
                        {
                          type: 'paragraph',
                          content: 'Your honest feedback will help us create a better workplace for everyone.',
                          orderIndex: 1,
                        }
                      ]
                    }
                  },
                });
                
                await db.surveyPage.create({
                  data: {
                    surveyId: input.id,
                    title: 'Work Environment',
                    orderIndex: 1,
                    questions: {
                      create: [
                        {
                          text: 'How satisfied are you with your current role?',
                          type: 'radio',
                          required: true,
                          orderIndex: 0,
                          options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
                        },
                        {
                          text: 'Do you feel your work is valued?',
                          type: 'radio',
                          required: true,
                          orderIndex: 1,
                          options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'],
                        },
                        {
                          text: 'What aspects of your work environment could be improved?',
                          type: 'text',
                          required: false,
                          orderIndex: 2,
                        }
                      ]
                    }
                  },
                });
                
                await db.surveyPage.create({
                  data: {
                    surveyId: input.id,
                    title: 'Management & Leadership',
                    orderIndex: 2,
                    questions: {
                      create: [
                        {
                          text: 'How would you rate communication from leadership?',
                          type: 'radio',
                          required: true,
                          orderIndex: 0,
                          options: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'],
                        },
                        {
                          text: 'Do you receive adequate support from your manager?',
                          type: 'radio',
                          required: true,
                          orderIndex: 1,
                          options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'],
                        },
                        {
                          text: 'What could management do to better support you?',
                          type: 'text',
                          required: false,
                          orderIndex: 2,
                        }
                      ]
                    }
                  },
                });
                
                await db.surveyPage.create({
                  data: {
                    surveyId: input.id,
                    title: 'Growth & Development',
                    orderIndex: 3,
                    questions: {
                      create: [
                        {
                          text: 'Are you satisfied with your professional growth opportunities?',
                          type: 'radio',
                          required: true,
                          orderIndex: 0,
                          options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
                        },
                        {
                          text: 'What training or development opportunities would you like to see?',
                          type: 'text',
                          required: false,
                          orderIndex: 1,
                        }
                      ]
                    }
                  },
                });
                
                await db.surveyPage.create({
                  data: {
                    surveyId: input.id,
                    title: 'Thank You',
                    orderIndex: 4,
                    contextElements: {
                      create: [
                        {
                          type: 'paragraph',
                          content: 'Thank you for your valuable feedback. We are committed to making our workplace better for everyone.',
                          orderIndex: 0,
                        }
                      ]
                    }
                  },
                });
                break;
                
              case 3:
              default:
                // Product Research Survey
                await db.surveyPage.create({
                  data: {
                    surveyId: input.id,
                    title: 'Product Research Survey',
                    orderIndex: 0,
                    contextElements: {
                      create: [
                        {
                          type: 'paragraph',
                          content: 'Help us shape our upcoming product by sharing your preferences and needs.',
                          orderIndex: 0,
                        },
                        {
                          type: 'paragraph',
                          content: 'Your input will directly influence our product development decisions.',
                          orderIndex: 1,
                        }
                      ]
                    }
                  },
                });
                
                await db.surveyPage.create({
                  data: {
                    surveyId: input.id,
                    title: 'Current Solutions',
                    orderIndex: 1,
                    questions: {
                      create: [
                        {
                          text: 'What solutions do you currently use for this problem?',
                          type: 'text',
                          required: true,
                          orderIndex: 0,
                        },
                        {
                          text: 'How satisfied are you with your current solution?',
                          type: 'radio',
                          required: true,
                          orderIndex: 1,
                          options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
                        },
                        {
                          text: 'What challenges do you face with your current solution?',
                          type: 'text',
                          required: false,
                          orderIndex: 2,
                        }
                      ]
                    }
                  },
                });
                
                await db.surveyPage.create({
                  data: {
                    surveyId: input.id,
                    title: 'Feature Preferences',
                    orderIndex: 2,
                    questions: {
                      create: [
                        {
                          text: 'Which features would be most important to you?',
                          type: 'checkbox',
                          required: true,
                          orderIndex: 0,
                          options: ['Easy Integration', 'Mobile Access', 'Data Analytics', 'Automation', 'Customization', 'Collaboration Tools'],
                        },
                        {
                          text: 'How much would you be willing to pay monthly for this solution?',
                          type: 'radio',
                          required: true,
                          orderIndex: 1,
                          options: ['$0-$10', '$11-$25', '$26-$50', '$51-$100', 'More than $100'],
                        },
                        {
                          text: 'Are there any specific features you would like to see?',
                          type: 'text',
                          required: false,
                          orderIndex: 2,
                        }
                      ]
                    }
                  },
                });
                
                await db.surveyPage.create({
                  data: {
                    surveyId: input.id,
                    title: 'Thank You',
                    orderIndex: 3,
                    contextElements: {
                      create: [
                        {
                          type: 'paragraph',
                          content: 'Thank you for participating in our product research survey!',
                          orderIndex: 0,
                        },
                        {
                          type: 'paragraph',
                          content: 'Would you like to be notified when our product launches? If so, please ensure your email is up to date in your profile.',
                          orderIndex: 1,
                        }
                      ]
                    }
                  },
                });
                break;
            }
          }
          
          // Return the survey with pages
          return await db.survey.findUnique({
            where: {
              id: input.id,
            },
            include: {
              pages: {
                include: {
                  questions: {
                    include: {
                      contextElements: true,
                    },
                    orderBy: {
                      orderIndex: 'asc',
                    },
                  },
                  contextElements: {
                    orderBy: {
                      orderIndex: 'asc',
                    },
                  },
                },
                orderBy: {
                  orderIndex: 'asc',
                },
              },
            },
          });
        } catch (error) {
          console.error('Error creating sample survey:', error);
          // If there's an error, continue with the normal flow
        }
      }
      
      if (!survey) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Survey not found',
        });
      }
      
      // Check if the user is the owner (skip in development)
      if (process.env.NODE_ENV !== 'development' && survey.userId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not authorized to access this survey',
        });
      }
      
      return survey;
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
          include: {
            pages: {
              include: {
                questions: {
                  include: {
                    contextElements: true,
                  },
                  orderBy: {
                    orderIndex: 'asc',
                  },
                },
                contextElements: {
                  orderBy: {
                    orderIndex: 'asc',
                  },
                },
              },
              orderBy: {
                orderIndex: 'asc',
              },
            },
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
    
  // Add a page to a survey
  addPage: protectedProcedure
    .input(addPageSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      // Check if the user is the owner of the survey
      const existingSurvey = await db.survey.findUnique({
        where: {
          id: input.surveyId,
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
          message: 'You are not authorized to add pages to this survey',
        });
      }
      
      // Get the current highest orderIndex
      const highestOrderPage = await db.surveyPage.findFirst({
        where: {
          surveyId: input.surveyId,
        },
        orderBy: {
          orderIndex: 'desc',
        },
      });
      
      const newOrderIndex = highestOrderPage ? highestOrderPage.orderIndex + 1 : 0;
      
      // Create the new page
      const page = await db.surveyPage.create({
        data: {
          title: input.title,
          description: input.description,
          surveyId: input.surveyId,
          orderIndex: newOrderIndex,
        },
      });
      
      return page;
    }),
    
  // Update a page
  updatePage: protectedProcedure
    .input(updatePageSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      // Check if the user is the owner of the survey
      const existingPage = await db.surveyPage.findUnique({
        where: {
          id: input.id,
        },
        include: {
          survey: true,
        },
      });
      
      if (!existingPage) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Page not found',
        });
      }
      
      if (existingPage.survey.userId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not authorized to update this page',
        });
      }
      
      // Update the page
      const updatedPage = await db.surveyPage.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
        },
      });
      
      return updatedPage;
    }),
    
  // Delete a page
  deletePage: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      // Check if the user is the owner of the survey
      const existingPage = await db.surveyPage.findUnique({
        where: {
          id: input.id,
        },
        include: {
          survey: true,
        },
      });
      
      if (!existingPage) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Page not found',
        });
      }
      
      if (existingPage.survey.userId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not authorized to delete this page',
        });
      }
      
      // Delete the page
      await db.surveyPage.delete({
        where: {
          id: input.id,
        },
      });
      
      return { success: true };
    }),
    
  // Add a question to a page
  addQuestion: protectedProcedure
    .input(addQuestionSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      // Check if the user is the owner of the survey
      const existingPage = await db.surveyPage.findUnique({
        where: {
          id: input.pageId,
        },
        include: {
          survey: true,
        },
      });
      
      if (!existingPage) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Page not found',
        });
      }
      
      if (existingPage.survey.userId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not authorized to add questions to this page',
        });
      }
      
      // Get the current highest orderIndex
      const highestOrderQuestion = await db.question.findFirst({
        where: {
          pageId: input.pageId,
        },
        orderBy: {
          orderIndex: 'desc',
        },
      });
      
      const newOrderIndex = highestOrderQuestion ? highestOrderQuestion.orderIndex + 1 : 0;
      
      // Create the new question
      const question = await db.question.create({
        data: {
          text: input.text,
          type: input.type,
          required: input.required,
          options: input.options,
          pageId: input.pageId,
          orderIndex: newOrderIndex,
        },
      });
      
      return question;
    }),
    
  // Update a question
  updateQuestion: protectedProcedure
    .input(updateQuestionSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      // Check if the user is the owner of the survey
      const existingQuestion = await db.question.findUnique({
        where: {
          id: input.id,
        },
        include: {
          page: {
            include: {
              survey: true,
            },
          },
        },
      });
      
      if (!existingQuestion) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Question not found',
        });
      }
      
      if (existingQuestion.page.survey.userId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not authorized to update this question',
        });
      }
      
      // Update the question
      const updatedQuestion = await db.question.update({
        where: {
          id: input.id,
        },
        data: {
          text: input.text,
          type: input.type,
          required: input.required,
          options: input.options,
        },
      });
      
      return updatedQuestion;
    }),
    
  // Delete a question
  deleteQuestion: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      // Check if the user is the owner of the survey
      const existingQuestion = await db.question.findUnique({
        where: {
          id: input.id,
        },
        include: {
          page: {
            include: {
              survey: true,
            },
          },
        },
      });
      
      if (!existingQuestion) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Question not found',
        });
      }
      
      if (existingQuestion.page.survey.userId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not authorized to delete this question',
        });
      }
      
      // Delete the question
      await db.question.delete({
        where: {
          id: input.id,
        },
      });
      
      return { success: true };
    }),
    
  // Submit survey responses
  submitResponses: publicProcedure
    .input(createSubmissionSchema)
    .mutation(async ({ ctx, input }) => {
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
          message: 'Survey not found or not published',
        });
      }
      
      // Create the submission
      const submission = await db.submission.create({
        data: {
          surveyId: input.surveyId,
          responses: {
            create: input.responses.map(response => ({
              questionId: response.questionId,
              value: response.value,
            })),
          },
        },
      });
      
      return { success: true, submissionId: submission.id };
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
        include: {
          responses: {
            include: {
              question: true,
            },
          },
        },
        orderBy: {
          submittedAt: 'desc',
        },
      });
      
      return submissions;
    }),
    
  // Create sample surveys (development only)
  createSamples: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (process.env.NODE_ENV !== 'development') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'This operation is only available in development mode',
        });
      }

      const userId = 'dev-user';
      
      // Ensure the dev user exists
      const devUser = await db.user.upsert({
        where: { id: 'dev-user' },
        update: {},
        create: {
          id: 'dev-user',
          email: 'dev@example.com',
          name: 'Development User',
          role: 'admin',
        },
      });
      
      console.log('Creating sample surveys for development...');
      
      // Create multiple sample surveys
      const sampleSurveys = [
        {
          title: 'Customer Feedback Survey',
          description: 'Gather feedback about our products and services',
          status: 'published' as const,
        },
        {
          title: 'Employee Satisfaction',
          description: 'Annual employee satisfaction and engagement survey',
          status: 'draft' as const,
        },
        {
          title: 'Product Research',
          description: 'Research survey for our upcoming product launch',
          status: 'draft' as const,
        },
        {
          title: 'Event Registration',
          description: 'Registration form for our annual conference',
          status: 'published' as const,
        },
        {
          title: 'Website Usability Test',
          description: 'Help us improve our website user experience',
          status: 'published' as const,
        },
        {
          title: 'Market Research Study',
          description: 'Understanding consumer preferences in our target market',
          status: 'draft' as const,
        },
        {
          title: 'Post-Purchase Evaluation',
          description: 'Evaluate customer satisfaction after recent purchases',
          status: 'archived' as const,
        },
        {
          title: 'Training Feedback',
          description: 'Feedback on our recent training program',
          status: 'draft' as const,
        }
      ];
      
      // Create all sample surveys
      const createdSurveys = await Promise.all(
        sampleSurveys.map(survey => 
          db.survey.create({
            data: {
              title: survey.title,
              description: survey.description,
              userId,
              status: survey.status,
            },
          })
        )
      );
      
      return { count: createdSurveys.length };
    }),
    
  // Generate a survey using AI
  generateWithAI: protectedProcedure
    .input(generateSurveySchema)
    .mutation(async ({ ctx, input }) => {
      const { prompt, title, description } = input;
      const userId = ctx.session.user.id;
      
      try {
        // Import AI generation functions
        const { generateChatCompletion, parseJsonResponse } = await import('@/lib/aiClient');
        
        // Create the system prompt for the AI
        const systemPrompt = `You are an expert survey designer. Create a comprehensive multi-page survey based on the user's request. 
        Follow these guidelines:
        
        1. Return a JSON structure with the following format:
        {
          "title": "Survey Title",
          "description": "Survey description",
          "pages": [
            {
              "title": "Page Title",
              "description": "Page description",
              "questions": [
                {
                  "text": "Question text",
                  "type": "text|radio|checkbox", 
                  "required": true|false,
                  "options": ["Option 1", "Option 2"] // Only for radio and checkbox types
                }
              ],
              "contextElements": [
                {
                  "type": "paragraph|image|video",
                  "content": "Content text or URL",
                  "orderIndex": 0
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
          "O1",
          {
            temperature: 0.7,
            max_tokens: 4000,
          }
        );
        
        // Parse the AI response into a JSON structure
        const surveyStructure = parseJsonResponse(aiResponse);
        
        // Create the survey with the generated title and description, or use provided ones
        const survey = await db.survey.create({
          data: {
            title: title || surveyStructure.title || "AI Generated Survey",
            description: description || surveyStructure.description || "",
            userId,
            status: 'draft',
          },
        });
        
        // Create pages, questions, and context elements from the AI structure
        if (surveyStructure.pages && Array.isArray(surveyStructure.pages)) {
          for (let i = 0; i < surveyStructure.pages.length; i++) {
            const pageData = surveyStructure.pages[i];
            
            // Create the page
            const page = await db.surveyPage.create({
              data: {
                surveyId: survey.id,
                title: pageData.title || `Page ${i + 1}`,
                description: pageData.description || "",
                orderIndex: i,
              },
            });
            
            // Create questions for the page
            if (pageData.questions && Array.isArray(pageData.questions)) {
              for (let j = 0; j < pageData.questions.length; j++) {
                const questionData = pageData.questions[j];
                
                await db.question.create({
                  data: {
                    pageId: page.id,
                    text: questionData.text || `Question ${j + 1}`,
                    type: questionData.type || 'text',
                    required: questionData.required || false,
                    options: questionData.options || [],
                    orderIndex: j,
                  },
                });
              }
            }
            
            // Create context elements for the page
            if (pageData.contextElements && Array.isArray(pageData.contextElements)) {
              for (let k = 0; k < pageData.contextElements.length; k++) {
                const elementData = pageData.contextElements[k];
                
                await db.contextElement.create({
                  data: {
                    pageId: page.id,
                    type: elementData.type || 'paragraph',
                    content: elementData.content || "",
                    orderIndex: elementData.orderIndex || k,
                  },
                });
              }
            }
          }
        }
        
        return {
          success: true,
          survey,
          structure: surveyStructure
        };
      } catch (error) {
        console.error('AI survey generation error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate survey with AI',
          cause: error,
        });
      }
    }),
}); 