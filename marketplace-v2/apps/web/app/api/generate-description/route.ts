import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response('Image URL is required', { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    // Mock response if API key is missing
    if (!apiKey) {
      console.warn("GOOGLE_GENERATIVE_AI_API_KEY not found. Using mock response.");
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      return Response.json({ 
        description: `(AI Generated Mock) \n\n**Title:** Premium Item from Image \n\n**Description:** Based on the image provided, this appears to be a high-quality item suitable for listing. \n- **Condition:** Excellent \n- **Material:** Premium finish \n\n*Note: Add GOOGLE_GENERATIVE_AI_API_KEY to .env.local to enable real Gemini AI generation.*` 
      });
    }

    const { text } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'You are an expert e-commerce copywriter. Analyze this image and generate a professional listing.\n\nOutput Format:\nTitle: [Concise, SEO-optimized title]\n\nDescription: [Engaging but concise summary, max 3 sentences]\n\nKey Features:\n• [Feature 1]\n• [Feature 2]\n• [Feature 3]\n\nCondition: [Inferred condition]\nMaterial: [Inferred material (if applicable)]' },
            { type: 'image', image: imageUrl },
          ],
        },
      ],
    });

    return Response.json({ description: text });
  } catch (error) {
    console.error('AI Generation Error:', error);
    // Return mock on error too for resilience during demo
    return Response.json({ 
        description: `(Fallback) Could not generate description. \n\nError details: ${error instanceof Error ? error.message : 'Unknown error'}` 
    });
  }
}
