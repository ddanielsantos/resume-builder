"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CvPreview } from "@/components/cv-preview"
import { ArrowLeft, Download, Wand2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function TailorCV() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const cvId = searchParams.get("id")

  const [jobDescription, setJobDescription] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [company, setCompany] = useState("")
  const [tailoredCV, setTailoredCV] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTailoring, setIsTailoring] = useState(false)
  const [originalCV, setOriginalCV] = useState(null)

  const supabase = getSupabaseClient()

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to tailor your CV",
        })
        router.push("/login")
      }
    }

    checkAuth()
  }, [supabase, router, toast])

  useEffect(() => {
    async function loadCV() {
      if (!cvId) {
        // If no CV ID is provided, load the default CV or redirect to dashboard
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) return

        setIsLoading(true)

        try {
          // Try to get the default CV
          const { data, error } = await supabase
            .from("cvs")
            .select("*")
            .eq("user_id", session.user.id)
            .eq("is_default", true)
            .single()

          if (error && error.code !== "PGRST116") {
            // PGRST116 is the error code for no rows returned
            throw error
          }

          if (data) {
            setOriginalCV(data.data)
          } else {
            // If no default CV, get the most recently updated CV
            const { data: recentCv, error: recentError } = await supabase
              .from("cvs")
              .select("*")
              .eq("user_id", session.user.id)
              .order("updated_at", { ascending: false })
              .limit(1)
              .single()

            if (recentError && recentError.code !== "PGRST116") {
              throw recentError
            }

            if (recentCv) {
              setOriginalCV(recentCv.data)
            } else {
              // No CVs found, redirect to builder
              toast({
                title: "No CVs found",
                description: "Please create a CV first",
              })
              router.push("/builder")
            }
          }
        } catch (error) {
          console.error("Error loading CV:", error)
          toast({
            title: "Error loading CV",
            description: "Could not load your CV",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      } else {
        // Load the specified CV
        setIsLoading(true)

        try {
          const { data, error } = await supabase.from("cvs").select("*").eq("id", cvId).single()

          if (error) throw error

          if (data) {
            setOriginalCV(data.data)
          }
        } catch (error) {
          console.error("Error loading CV:", error)
          toast({
            title: "Error loading CV",
            description: "Could not load the requested CV",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadCV()
  }, [cvId, supabase, router, toast])

  const handleTailor = async () => {
    if (!jobDescription) {
      toast({
        title: "Missing Information",
        description: "Please paste the job description to tailor your CV.",
        variant: "destructive",
      })
      return
    }

    setIsTailoring(true)

    try {
      // Get the current user
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to tailor your CV",
        })
        router.push("/login")
        return
      }

      // In a real app with Gemini API, this would call the AI service
      // For now, we'll simulate the tailoring process

      // Simple keyword matching (in a real app, this would use the Gemini API)
      const tailored = JSON.parse(JSON.stringify(originalCV))
      const jobDescLower = jobDescription.toLowerCase()

      // Extract potential keywords from the CV
      const allSkills = [...(tailored.skills.technical || []), ...(tailored.skills.soft || [])]

      // Find matching skills
      const matchedKeywords = allSkills.filter((skill) => jobDescLower.includes(skill.toLowerCase()))

      // Mark matched skills as highlighted
      tailored.highlightedSkills = matchedKeywords

      // Update the job title if provided
      if (jobTitle) {
        tailored.personal.title = jobTitle
      }

      setTailoredCV(tailored)

      // Save the tailored CV to Supabase
      const { error } = await supabase.from("tailored_cvs").insert({
        cv_id: cvId || null, // This might be null if using default CV
        user_id: session.user.id,
        job_title: jobTitle,
        company: company,
        job_description: jobDescription,
        tailored_data: tailored,
      })

      if (error) throw error

      toast({
        title: "CV Tailored",
        description: `Your CV has been tailored for the ${company || "job"} position.`,
      })
    } catch (error) {
      console.error("Error tailoring CV:", error)
      toast({
        title: "Error tailoring CV",
        description: "Could not tailor your CV. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTailoring(false)
    }
  }

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your tailored CV is being exported to PDF.",
    })
  }

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your CV...</p>
        </div>
      </div>
    )
  }

  if (!originalCV) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">No CV Found</h2>
          <p className="mb-6">You need to create a CV before you can tailor it for job applications.</p>
          <Link href="/builder">
            <Button>Create Your First CV</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tailor Your CV</h1>
        <div className="flex gap-2">
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft size={16} /> Back to Dashboard
            </Button>
          </Link>
          <Button variant="outline" onClick={handleExport} className="gap-2" disabled={!tailoredCV}>
            <Download size={16} /> Export Tailored CV
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title</Label>
              <Input
                id="job-title"
                placeholder="e.g., Senior Frontend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="e.g., Tech Solutions Inc."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description here..."
                className="min-h-[300px]"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
            <Button onClick={handleTailor} className="w-full gap-2" disabled={isTailoring || !jobDescription}>
              <Wand2 size={16} />
              {isTailoring ? "Tailoring CV..." : "Tailor CV for This Job"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">
                {tailoredCV ? "Tailored CV Preview" : "Original CV Preview"}
              </h2>
              <div className="h-[600px] overflow-auto border rounded-md p-4 bg-white">
                <CvPreview data={tailoredCV || originalCV} highlightedSkills={tailoredCV?.highlightedSkills} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
