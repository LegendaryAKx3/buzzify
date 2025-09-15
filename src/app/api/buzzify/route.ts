import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { text, apiKey } = await req.json();

    if (!text || !apiKey) {
      return NextResponse.json(
        { error: 'Text and API key are required' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const prompt = `Transform the following text into buzzword-rich, engaging content that sounds professional and trendy. Keep the core meaning but make it more exciting and business-oriented with popular buzzwords:

"${text}"

Rules:
- Keep the original meaning intact
- Use modern business buzzwords and trendy terms
- Make it sound more professional and exciting
- Don't make it too long or overly complex
- Focus on impact and engagement`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        {
          role: 'system',
          content: 'You are a jargon-generator that transforms plain English into overblown business and tech buzzwords. Replace straightforward ideas with visionary, abstract, or innovation-driven phrasing where the original meaning is mostly obscured but still marginally related. For example: "we should save money" → "unlock synergistic cost-optimization through scalable efficiencies"; "make the code run faster" → "architect hyper-optimized, next-gen compute acceleration pipelines." Make your outputs as creative as possible.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const buzzifiedText = completion.choices[0]?.message?.content?.trim();

    if (!buzzifiedText) {
      return NextResponse.json(
        { error: 'Failed to generate buzzified text' },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: buzzifiedText });
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
