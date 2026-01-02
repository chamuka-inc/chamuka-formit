import { NextRequest, NextResponse } from "next/server";
import { streamText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { formStructureSchema, type FormStructure } from "@/lib/zod/formSchemas";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { db } from "@/lib/db";

// Use Node.js runtime (not edge) because of NextAuth/Prisma dependencies
export const maxDuration = 60;

// System prompt for form refinement
const getSystemPrompt = (existingData: FormStructure, prompt: string) => `You are an expert content designer. Refine an existing content based on the user's instructions.
        
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
5. Use placeholder image from https://placehold.co/{widthxheight}/{bg-color}/{text-color}/?text={Short-caption}&font={font-family}

Apply the following refinement instructions to the content: "${prompt}"`;

export async function POST(req: NextRequest) {
  try {
    // Get session for authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Check if user has credits
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user || user.credits < 1) {
      return NextResponse.json(
        { success: false, error: "Insufficient credits" },
        { status: 403 }
      );
    }

    const { existingData, prompt, formId } = await req.json();

    if (!existingData || typeof existingData !== "object") {
      return NextResponse.json(
        { success: false, error: "Existing form data is required" },
        { status: 400 }
      );
    }

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Refinement instructions are required" },
        { status: 400 }
      );
    }

    // Stream the structured object using AI SDK v6
    const result = streamText({
      model: google("gemini-flash-latest"),
      output: Output.object({
        schema: formStructureSchema,
      }),
      prompt: getSystemPrompt(existingData as FormStructure, prompt),
    });

    // Return the streaming response using toTextStreamResponse for useObject hook
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI streaming refinement error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to refine form with AI" },
      { status: 500 }
    );
  }
}
