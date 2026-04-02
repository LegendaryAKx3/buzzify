import test from 'node:test'
import assert from 'node:assert/strict'

import { getOpenRouterConfig } from './openrouter.ts'

test('getOpenRouterConfig returns the configured OpenRouter defaults', () => {
  const previousEnv = {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,
  }

  process.env.OPENROUTER_API_KEY = 'test-key'
  process.env.OPENROUTER_MODEL = 'openai/gpt-4.1-mini'

  const config = getOpenRouterConfig()

  assert.deepEqual(config, {
    apiKey: 'test-key',
    baseURL: 'https://openrouter.ai/api/v1',
    model: 'openai/gpt-4.1-mini',
  })

  Object.assign(process.env, previousEnv)
})

test('getOpenRouterConfig throws when the server key is missing', () => {
  const previousKey = process.env.OPENROUTER_API_KEY
  process.env.OPENROUTER_API_KEY = ''

  assert.throws(() => getOpenRouterConfig(), /OPENROUTER_API_KEY/)

  process.env.OPENROUTER_API_KEY = previousKey
})
