import { NextRequest, NextResponse } from "next/server";
import { streamText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { formStructureSchema } from "@/lib/zod/formSchemas";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { db } from "@/lib/db";

// Use Node.js runtime (not edge) because of NextAuth/Prisma dependencies
export const maxDuration = 60;

// System prompt for form generation
const getSystemPrompt = (prompt: string) => `You are an expert content creator. Create a comprehensive content based on the user's needs.
        
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

2. Make sure to create a logical flow of content across multiple pages
3. Use appropriate question types (text, radio, checkbox) for different question scenarios
4. Add context elements (detailed paragraphs, images/videos) to provide context where needed.
5. For each page, include a clear title and description
6. Design the content that satisfies the user's prompt
7. Use placeholder image from https://placehold.co/{widthxheight}/{bg-color}/{text-color}/?text={Short-caption}&font={font-family}

Generate a complete content structure based on this prompt: "${prompt}"`;

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

    const { prompt, title, description } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Stream the structured object using AI SDK v6
    const result = streamText({
      model: google("gemini-flash-latest"),
      output: Output.object({
        schema: formStructureSchema,
      }),
      prompt: getSystemPrompt(prompt),
    });

    // Return the streaming response using toTextStreamResponse for useObject hook
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI streaming generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate form with AI" },
      { status: 500 }
    );
  }
}
