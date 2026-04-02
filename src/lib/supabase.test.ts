import test from 'node:test'
import assert from 'node:assert/strict'

import { getSupabaseClient, hasSupabaseEnv } from './supabase.ts'

test('hasSupabaseEnv returns false when the public env vars are missing', () => {
  const previousEnv = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  assert.equal(hasSupabaseEnv(), false)

  Object.assign(process.env, previousEnv)
})

test('getSupabaseClient throws only when called without the public env vars', () => {
  const previousEnv = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  assert.throws(() => getSupabaseClient(), /NEXT_PUBLIC_SUPABASE_URL/)

  Object.assign(process.env, previousEnv)
})
