export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
      }
      cvs: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          title: string
          is_default: boolean
          data: Json
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          title: string
          is_default?: boolean
          data: Json
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          title?: string
          is_default?: boolean
          data?: Json
        }
      }
      tailored_cvs: {
        Row: {
          id: string
          cv_id: string
          user_id: string
          created_at: string
          updated_at: string
          job_title: string | null
          company: string | null
          job_description: string | null
          tailored_data: Json
        }
        Insert: {
          id?: string
          cv_id: string
          user_id: string
          created_at?: string
          updated_at?: string
          job_title?: string | null
          company?: string | null
          job_description?: string | null
          tailored_data: Json
        }
        Update: {
          id?: string
          cv_id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          job_title?: string | null
          company?: string | null
          job_description?: string | null
          tailored_data?: Json
        }
      }
    }
  }
}
