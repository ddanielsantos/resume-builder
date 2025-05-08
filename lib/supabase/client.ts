import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../types/database.types"

// Create a single instance of the client to avoid duplicate instances
let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient<Database>()
  }
  return supabaseClient
}
