"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalInfoForm } from "@/components/personal-info-form"
import { EducationForm } from "@/components/education-form"
import { ExperienceForm } from "@/components/experience-form"
import { SkillsForm } from "@/components/skills-form"
import { ProjectsForm } from "@/components/projects-form"
import { CvPreview } from "@/components/cv-preview"
import { ArrowLeft, ArrowRight, Download, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function CVBuilder() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const cvId = searchParams.get("id")

  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState("My CV")
  const [cvData, setCvData] = useState({
    personal: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      github: "",
      linkedin: "",
      summary: "",
    },
    education: [],
    experience: [],
    skills: {
      technical: [],
      soft: [],
      languages: [],
    },
    projects: [],
  })

  const supabase = getSupabaseClient()

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to create or edit CVs",
        })
        router.push("/login")
      }
    }

    checkAuth()
  }, [supabase, router, toast])

  useEffect(() => {
    async function loadCV() {
      if (!cvId) return

      setIsLoading(true)

      try {
        const { data, error } = await supabase.from("cvs").select("*").eq("id", cvId).single()

        if (error) throw error

        if (data) {
          setTitle(data.title)
          setCvData(data.data as any)
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

    loadCV()
  }, [cvId, supabase, toast])

  const updateCvData = (section, data) => {
    setCvData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const handleSave = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your CV",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsSaving(true)

    try {
      if (cvId) {
        // Update existing CV
        const { error } = await supabase
          .from("cvs")
          .update({
            title,
            data: cvData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", cvId)

        if (error) throw error
      } else {
        // Create new CV
        const { error } = await supabase.from("cvs").insert({
          user_id: session.user.id,
          title,
          data: cvData,
          is_default: false,
        })

        if (error) throw error
      }

      toast({
        title: "CV Saved",
        description: "Your CV has been saved successfully.",
      })

      // Redirect to dashboard after creating a new CV
      if (!cvId) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error saving CV:", error)
      toast({
        title: "Error saving CV",
        description: "Could not save your CV. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = () => {
    // In a real app, this would generate a PDF
    toast({
      title: "Export Started",
      description: "Your CV is being exported to PDF.",
    })
  }

  const nextTab = () => {
    const tabs = ["personal", "education", "experience", "skills", "projects", "preview"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const prevTab = () => {
    const tabs = ["personal", "education", "experience", "skills", "projects", "preview"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1])
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

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">{cvId ? "Edit CV" : "Create New CV"}</h1>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-2 py-1 text-lg"
            placeholder="CV Title"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save size={16} /> {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download size={16} /> Export PDF
          </Button>
          <Link href="/tailor">
            <Button>Tailor for Job</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <div className="mt-6">
                <TabsContent value="personal">
                  <PersonalInfoForm data={cvData.personal} updateData={(data) => updateCvData("personal", data)} />
                </TabsContent>
                <TabsContent value="education">
                  <EducationForm data={cvData.education} updateData={(data) => updateCvData("education", data)} />
                </TabsContent>
                <TabsContent value="experience">
                  <ExperienceForm data={cvData.experience} updateData={(data) => updateCvData("experience", data)} />
                </TabsContent>
                <TabsContent value="skills">
                  <SkillsForm data={cvData.skills} updateData={(data) => updateCvData("skills", data)} />
                </TabsContent>
                <TabsContent value="projects">
                  <ProjectsForm data={cvData.projects} updateData={(data) => updateCvData("projects", data)} />
                </TabsContent>
                <TabsContent value="preview">
                  <div className="flex justify-center">
                    <div className="w-full max-w-3xl">
                      <CvPreview data={cvData} />
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Live Preview</h2>
              <div className="h-[500px] overflow-auto border rounded-md p-4 bg-white">
                <CvPreview data={cvData} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevTab} disabled={activeTab === "personal"} className="gap-2">
              <ArrowLeft size={16} /> Previous
            </Button>
            <Button onClick={nextTab} disabled={activeTab === "preview"} className="gap-2">
              Next <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
