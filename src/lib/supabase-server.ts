import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          api_key: string | null
          free_requests_used: number
          free_requests_reset_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          api_key?: string | null
          free_requests_used?: number
          free_requests_reset_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          api_key?: string | null
          free_requests_used?: number
          free_requests_reset_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      requests: {
        Row: {
          id: string
          user_id: string
          input_text: string
          output_text: string | null
          used_free_request: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          input_text: string
          output_text?: string | null
          used_free_request?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          input_text?: string
          output_text?: string | null
          used_free_request?: boolean
          created_at?: string
        }
      }
    }
  }
}

export const createClient = async (request?: NextRequest) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (request) {
    // For API routes
    const response = NextResponse.next()
    
    const supabase = createServerClient<Database>(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    return { supabase, response }
  } else {
    // For server components (not used in this case)
    const supabase = createServerClient<Database>(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return []
          },
          setAll() {
            // No-op for server components
          },
        },
      }
    )

    return { supabase }
  }
}
