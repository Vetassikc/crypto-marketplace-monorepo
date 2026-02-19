import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response('Image URL is required', { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'AI provider is not configured. Set OPENROUTER_API_KEY.' },
        { status: 503 },
      );
    }

    const openrouter = createOpenAI({
      baseURL: OPENROUTER_BASE_URL,
      apiKey,
    });

    const { text } = await generateText({
      model: openrouter(DEFAULT_MODEL),
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
    console.error('AI generation failed:', error);
    return Response.json({ error: 'Could not generate description right now.' }, { status: 500 });
  }
}
