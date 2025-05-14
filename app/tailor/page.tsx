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

export default function TailorPage() {
    const { toast } = useToast()
    const searchParams = useSearchParams()
    const cvID = searchParams.get("id")
    const form = useForm<TailorCVForm>({
        resolver: zodResolver(tailorCVFormSchema),
        defaultValues: {
            jobTitle: "",
            company: "",
            jobDescription: "",
        },
    })
    const {isLoading} = form.formState
    const [tailoredCV, setTailoredCV] = useState<CvData | null>(null)
    const [suggestions, setSuggestions] = useState<string[]>([])

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
    }, [cvID])

    const handleTailor = async (formData: TailorCVForm) => {
        if (!cvID) {
            toast({
                title: "Error",
                description: "CV not found",
                variant: "destructive",
            })
            console.error("CV not found")
            return
        }

        const {data, error} = await tailorCVWithAI({ ...formData, cvID });

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

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Tailor Your CV</CardTitle>
                </CardHeader>
                <CardContent>
                    {true ? (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleTailor)}>
                                <div className="grid gap-4">
                                    <FormField
                                        name={"jobTitle"}
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Job Title</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Software Engineer"/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name={"company"}
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Company</FormLabel>
                                                <FormControl>
                                                    <Input {...field}
                                                           placeholder="Company (e.g., Tech Solutions Inc.)"/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name={"jobDescription"}
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel></FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} placeholder="Job Description"
                                                              className="min-h-[150px]"/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex gap-4 mt-4">
                                    <Button type={"submit"} disabled={isLoading}>
                                        {isLoading ? "Tailoring..." : "Tailor CV for This Job"}
                                    </Button>
                                    <Button variant="outline" onClick={handleExport}>
                                        Export PDF
                                    </Button>
                                </div>
                                {tailoredCV && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold">Tailored CV</h3>
                                        <pre className="bg-gray-100 p-4 rounded">TODO: TAILORED CV</pre>
                                    </div>
                                )}
                                {suggestions.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold">Suggestions</h3>
                                        <ul className="list-disc pl-6">
                                            {suggestions.map((suggestion, index) => (
                                                <li key={index}>{suggestion}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </form>
                        </Form>
                    ) : (
                        <p>Loading CV...</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
