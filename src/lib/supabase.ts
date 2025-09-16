import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          api_key: string | null
          free_requests_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          api_key?: string | null
          free_requests_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          api_key?: string | null
          free_requests_used?: number
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

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
