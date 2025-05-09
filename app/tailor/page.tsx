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
import { ArrowLeft, Download, Wand2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseClient } from "@/lib/supabase/client"
import { tailorCVWithAI } from "@/lib/ai/tailor-cv"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { exportCvAsPdf } from "@/lib/pdf/export-cv"

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
  const [isExporting, setIsExporting] = useState(false)
  const [originalCV, setOriginalCV] = useState(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [highlightedSkills, setHighlightedSkills] = useState<string[]>([])

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

      // Call our AI tailoring function
      const result = await tailorCVWithAI({
        cv: originalCV,
        jobDescription,
        jobTitle,
        company,
      })

      // Update state with the tailored CV and suggestions
      setTailoredCV(result.tailoredCV)
      setSuggestions(result.suggestedImprovements)
      setHighlightedSkills(result.highlightedSkills || [])

      // Save the tailored CV to Supabase
      const { error } = await supabase.from("tailored_cvs").insert({
        cv_id: cvId || null, // This might be null if using default CV
        user_id: session.user.id,
        job_title: jobTitle,
        company: company,
        job_description: jobDescription,
        tailored_data: result.tailoredCV,
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

  const handleExport = async () => {
    setIsExporting(true)

    try {
      // Generate a filename based on the CV title and job details
      const userName = (tailoredCV || originalCV).personal.name
        ? (tailoredCV || originalCV).personal.name.replace(/\s+/g, "_").toLowerCase()
        : "user"

      const jobSuffix = jobTitle ? `_${jobTitle.replace(/\s+/g, "_").toLowerCase()}` : ""

      const companySuffix = company ? `_${company.replace(/\s+/g, "_").toLowerCase()}` : ""

      const fileName = `cv_${userName}${jobSuffix}${companySuffix}.pdf`

      await exportCvAsPdf(tailoredCV || originalCV, highlightedSkills, fileName)

      toast({
        title: "Export Successful",
        description: "Your CV has been exported as a PDF.",
      })
    } catch (error) {
      console.error("Error exporting CV:", error)
      toast({
        title: "Export Failed",
        description: "Could not export your CV. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
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
          <Button variant="outline" onClick={handleExport} disabled={isExporting} className="gap-2">
            <Download size={16} /> {isExporting ? "Exporting..." : "Export PDF"}
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
              <div className="h-[500px] overflow-auto border rounded-md p-4 bg-white">
                <CvPreview data={tailoredCV || originalCV} highlightedSkills={highlightedSkills} />
              </div>
            </CardContent>
          </Card>

          {suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Improvement Suggestions</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm">
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
