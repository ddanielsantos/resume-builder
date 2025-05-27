"use client"

import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {useSearchParams} from "next/navigation"
import {useEffect, useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import {tailorCVWithAI} from "@/lib/ai/tailor-cv";
import { useToast } from "@/hooks/use-toast"
import {CvData, TailorCVForm, tailorCVFormSchema} from "@/lib/cv";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle, ArrowLeft, Download, Globe, Wand2} from "lucide-react"
import {CvPreview} from "@/components/cv-preview";
import {Label} from "@/components/ui/label";
import Link from "next/link";
import {createClient} from "@/supabase/client";

export default function TailorPage() {
    const { toast } = useToast()
    const searchParams = useSearchParams()
    const cvID = searchParams.get("id")
    // const form = useForm<TailorCVForm>({
    //     resolver: zodResolver(tailorCVFormSchema),
    //     defaultValues: {
    //         jobTitle: "",
    //         company: "",
    //         jobDescription: "",
    //     },
    // })
    // const {isLoading} = form.formState
    const [tailoredCV, setTailoredCV] = useState<CvData | null>(null)
    const [suggestions, setSuggestions] = useState<string[]>([])

    const [isLoading, setIsLoading] = useState(false)
    const [jobDescription, setJobDescription] = useState("")
    const [jobTitle, setJobTitle] = useState("")
    const [company, setCompany] = useState("")
    const [isTailoring, setIsTailoring] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [originalCV, setOriginalCV] = useState<CvData | null>(null)
    const [highlightedSkills, setHighlightedSkills] = useState<string[]>([])
    const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false)
    const [isTranslated, setIsTranslated] = useState(false)
    const [originalTailoredCV, setOriginalTailoredCV] = useState(null)

    const supabase = createClient();

    useEffect(() => {
        if (!cvID) {
            toast({
                title: "Error",
                description: "CV ID is required",
                variant: "destructive",
            })
            console.error("CV ID is required")
            return
        }

        const fetchCV = async () => {
            setIsLoading(true)
            try {
                const {data, error} = await supabase
                    .from("cvs")
                    .select("data")
                    .eq("id", cvID)
                    .single()

                if (error) {
                    return;
                }

                if (!data) {
                    return;
                }

                const parsedCV = data.data as CvData;

                setOriginalCV(parsedCV)
            } catch (error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                })
                console.error("Error fetching CV:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCV();
    }, [cvID])

    const handleTailor = async () => {
        if (!cvID) {
            toast({
                title: "Error",
                description: "CV not found",
                variant: "destructive",
            })
            console.error("CV not found")
            return
        }

        const {data, error} = await tailorCVWithAI({
            cvID,
            jobDescription,
            jobTitle,
            company,
        });

        if (error) {
            toast({
                title: "Error",
                description: error,
                variant: "destructive",
            })
            console.error(error)
            return
        }

        if (data) {
            setTailoredCV(data.tailoredCV)
            setSuggestions(data.suggestedImprovements)
            setHighlightedSkills(data.highlightedSkills || [])
            setIsTranslated(false)
            toast({
                title: "Success",
                description: "CV tailored successfully",
                variant: "default",
            })
        }
    }

    const handleExport = async () => {
        // todo
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
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold">Tailor Your CV</h1>
                    {isTranslated && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Translated</span>
                    )}
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        onClick={() => setIsTranslateModalOpen(true)}
                        className="gap-2"
                        disabled={!tailoredCV && !originalCV}
                    >
                        <Globe size={16} /> Translate
                    </Button>
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

            {/*<TranslateCVModal*/}
            {/*    isOpen={isTranslateModalOpen}*/}
            {/*    onClose={() => setIsTranslateModalOpen(false)}*/}
            {/*    cvData={tailoredCV || originalCV}*/}
            {/*    onTranslationComplete={handleTranslationComplete}*/}
            {/*/>*/}
        </div>
    )
}
