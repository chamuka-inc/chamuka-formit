import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { generateChatCompletion } from "@/lib/aiClient";
import { aiCreditCheck } from "../middleware/creditCheck";
import { db } from "@/lib/db";
import { CreditTransactionType } from "@/lib/types";

// Schema for the AI form generation input
const generateFormSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  maxPages: z.number().min(1).max(10).default(5),
});

export const aiSurveyRouter = createTRPCRouter({
  // Generate a form structure from a text prompt
  generateFormStructure: protectedProcedure
    .input(generateFormSchema)
    .use(aiCreditCheck)
    .mutation(async ({ ctx, input }) => {
      const { prompt, maxPages } = input;

      try {
        // Generate a system message for the AI
        const systemMessage = `
          You are an expert at creating survey forms. Create a multi-page survey form based on the following user prompt.
          The output should be a valid JSON object with the structure that follows the TypeScript interface:

          \`\`\`typescript
          interface SurveyPage {
            title: string;
            description?: string;
            questions?: Question[];
            contextElements?: ContextElement[];
          }

          interface Question {
            type: 'text' | 'radio' | 'checkbox';
            text: string;
            options?: string[];
            required?: boolean;
            contextElements?: ContextElement[];
          }

          interface ContextElement {
            type: 'paragraph' | 'image' | 'video';
            content: string;
          }
          \`\`\`

          Each question should have a sensible type based on the content, and for 'radio' or 'checkbox' questions, 
          include an 'options' array with reasonable choices.
          
          Limit the output to ${maxPages} pages maximum, with a reasonable number of questions per page.
          Do not include elements that would make the form too long or complex.
          
          Respond ONLY with the valid JSON, nothing else.
        `;

        // Prepare the AI messages
        const messages = [
          { role: "system" as const, content: systemMessage },
          { role: "user" as const, content: prompt },
        ];

        // Generate the form structure using AI
        const aiResponse = await generateChatCompletion(messages, "O1", {
          temperature: 0.7,
          max_tokens: 4000,
        });

        // Parse the JSON response
        let formStructure;
        try {
          // Try to parse the response as a JSON object
          formStructure = JSON.parse(aiResponse);
        } catch (parseError) {
          // If direct parsing fails, try to extract JSON from a code block
          const jsonMatch = aiResponse.match(
            /```(?:json)?\s*(\{[\s\S]*\})\s*```/,
          );
          if (jsonMatch && jsonMatch[1]) {
            formStructure = JSON.parse(jsonMatch[1]);
          } else {
            throw new Error("Failed to parse AI response as JSON");
          }
        }

        // Validate the structure
        if (!Array.isArray(formStructure)) {
          formStructure = [formStructure]; // Convert to array if single page
        }

        // AI generation was successful - record the transaction
        await db.creditTransaction.create({
          data: {
            userId: ctx.session.user.id,
            credits: -1,
            amount: 0,
            type: CreditTransactionType.AI,
          },
        });

        // Return the form structure
        return {
          success: true,
          pages: formStructure,
        };
      } catch (error) {
        console.error("Error generating form structure:", error);

        // Refund the AI credit since generation failed
        await db.user.update({
          where: { id: ctx.session.user.id },
          data: { credits: { increment: 1 } },
        });

        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Unknown error during form generation",
        };
      }
    }),
});
