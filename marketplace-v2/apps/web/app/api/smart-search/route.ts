import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: Request) {
  let query = '';
  
  try {
    const body = await req.json();
    query = body.query;

    if (!query) {
      return new Response('Query is required', { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
        console.warn("⚠️ API Key missing in smart-search route");
        return Response.json({
            query: query,
            sortBy: 'date',
            sortOrder: 'desc'
        });
    }

    console.log("🚀 Sending query to Gemini:", query);

    const systemPrompt = `
      You are a smart search assistant for a marketplace.
      Convert the user's natural language search query into a structured JSON object with the following fields:
      - query: string (keywords to search for)
      - minPrice: number (optional)
      - maxPrice: number (optional)
      - sortBy: string (optional, values: 'price', 'date')
      - sortOrder: string (optional, values: 'asc', 'desc')

      Rules:
      - 'cheapest', 'low price' -> sortBy: 'price', sortOrder: 'asc'
      - 'expensive', 'premium', 'high end' -> sortBy: 'price', sortOrder: 'desc'
      - 'newest', 'latest' -> sortBy: 'date', sortOrder: 'desc'
      - Extract price ranges like 'under 500', 'between 100 and 200'.
      - If no specific sort is implied, default to sortBy: 'date', sortOrder: 'desc' (relevance).
      - Return ONLY the JSON object, no markdown or extra text.

      User Query: "${query}"
    `;

    const { text } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      prompt: systemPrompt,
    });

    console.log("🤖 Gemini Response:", text);

    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return Response.json(JSON.parse(cleanedText));

  } catch (error) {
    console.error('❌ Smart Search Error Details:', error);
    return Response.json({ query: query || "" });
  }
}
