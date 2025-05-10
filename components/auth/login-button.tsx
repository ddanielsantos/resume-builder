"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import {createClient} from "@/supabase/client";

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
    } catch (error) {
      console.error("Error logging in:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleLogin} disabled={isLoading} className="gap-2">
      <Github size={16} />
      {isLoading ? "Signing in..." : "Sign in with GitHub"}
    </Button>
  )
}
