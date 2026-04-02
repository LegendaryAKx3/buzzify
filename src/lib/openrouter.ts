const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'
const DEFAULT_OPENROUTER_MODEL = 'openai/gpt-5-nano'

export interface OpenRouterConfig {
  apiKey: string
  baseURL: string
  model: string
}

export function getOpenRouterConfig(): OpenRouterConfig {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim()

  if (!apiKey) {
    throw new Error('Missing OPENROUTER_API_KEY')
  }

  return {
    apiKey,
    baseURL: OPENROUTER_BASE_URL,
    model: process.env.OPENROUTER_MODEL?.trim() || DEFAULT_OPENROUTER_MODEL,
  }
}
