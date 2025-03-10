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

    const { existingData, prompt } = await req.json();

    // Generate system prompt for refinement
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
    
    Apply the following refinement instructions to the content: "${prompt}"`;

    // Call the AI to refine the form
    const aiResponse = await generateGeminiWebResponse(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      "GEMINI_FLASH_WEB",
    );

    // Parse the AI response into a JSON structure
    const refinedFormStructure = parseJsonResponse(aiResponse.text);

    return NextResponse.json({
      success: true,
      structure: refinedFormStructure,
    });
  } catch (error) {
    console.error("AI form refinement error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to refine form with AI" },
      { status: 500 },
    );
  }
}
