import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

import { getOpenRouterConfig } from '@/lib/openrouter'

const LENGTH_DESCRIPTIONS = {
  short: 'concise and brief',
  medium: 'moderately detailed',
  long: 'extensively detailed with multiple sentences',
} as const

export async function POST(req: NextRequest) {
  try {
    const { text, length = 'medium' } = await req.json()
    const normalizedText = typeof text === 'string' ? text.trim() : ''

    if (!['short', 'medium', 'long'].includes(length)) {
      return NextResponse.json({ error: 'Invalid length value' }, { status: 400 })
    }

    if (!normalizedText) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    const config = getOpenRouterConfig()
    const openai = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    })

    const prompt = `Transform the following text into buzzword-rich, engaging content that sounds professional and trendy. Keep the core meaning but make it more exciting and business-oriented with popular buzzwords:

"${normalizedText}"

Rules:
- Keep the original meaning intact
- Use modern business buzzwords and trendy terms
- Make it sound more professional and complex
- Length should be ${LENGTH_DESCRIPTIONS[length as keyof typeof LENGTH_DESCRIPTIONS]}`

    const completion = await openai.chat.completions.create({
      model: config.model,
      messages: [
        {
          role: 'system',
          content:
            'You are a jargon-generator that transforms plain English into overblown business and tech buzzwords. Replace straightforward ideas with visionary, abstract, or innovation-driven phrasing where the original meaning is mostly obscured but still marginally related. For example: "we should save money" -> "unlock synergistic cost-optimization through scalable efficiencies"; "make the code run faster" -> "architect hyper-optimized, next-gen compute acceleration pipelines." Make your outputs as creative as possible, and extend the length of the text as much as you want to include more buzzwords. You should make it as ridiculous as possible. Here is a list of some buzzwords Synergy, Value-add, Strategic alignment, Core competencies, Holistic framework, Scalable efficiencies, Stakeholder engagement, Operational excellence, Competitive advantage, Paradigm shift, Change management, Customer-centric approach, Ecosystem integration, Thought leadership, Seamless delivery, Leverage best practices, Next-level optimization, End-to-end solution, Agile transformation, ROI maximization, Cloud-native architecture, Hyper-automation, AI-driven insights, Quantum-ready infrastructure, Blockchain-enabled trust, Neural acceleration pipelines, Edge computing scalability, Zero-trust security, Data lakehouse integration, Microservices orchestration, Generative intelligence, Autonomous workflows, API-first design, Serverless deployment, Digital twin ecosystems, Smart contracts, Self-healing networks, Predictive analytics, Cross-platform enablement, Next-gen compute fabric',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const result = completion.choices[0]?.message?.content?.trim() || 'No result generated'

    return NextResponse.json({
      result,
      model: config.model,
    })
  } catch (error: any) {
    console.error('Buzzify API error:', error)

    if (error.message?.includes('OPENROUTER_API_KEY')) {
      return NextResponse.json(
        { error: 'Server is missing OPENROUTER_API_KEY' },
        { status: 500 }
      )
    }

    if (error.status === 401) {
      return NextResponse.json(
        { error: 'OpenRouter rejected the configured server key' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to process request: ' + (error.message || 'Unknown error'),
      },
      { status: 500 }
    )
  }
}
