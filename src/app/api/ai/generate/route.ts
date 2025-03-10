import { NextRequest, NextResponse } from "next/server";
import { generateGeminiWebResponse, parseJsonResponse } from "@/lib/aiClient";
import { verifyEdgeRequest } from "@/lib/auth/edgeAuth";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    // Verify the request is from our own application
    if (!verifyEdgeRequest(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { prompt, title, description } = await req.json();

    // Get system prompt for AI
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
    4. Add context elements (detailed paragraphs, images/videos) to provide context where needed
    5. For each page, include a clear title and description
    6. Design the content that satisfies the user's prompt
    
    Generate a complete content structure based on this prompt: "${prompt}"`;

    // Call the AI to generate the form
    const aiResponse = await generateGeminiWebResponse(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      "GEMINI_FLASH_WEB",
    );

    // Parse the AI response into a JSON structure
    const formStructure = parseJsonResponse(aiResponse.text);

    return NextResponse.json({
      success: true,
      formStructure,
      title: title || formStructure.title || "Generated Content",
      description: description || formStructure.description || "",
    });
  } catch (error) {
    console.error("AI form generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate form with AI" },
      { status: 500 },
    );
  }
}
