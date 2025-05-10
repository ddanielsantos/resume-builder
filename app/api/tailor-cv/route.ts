import { NextResponse } from "next/server"
import { OpenAI } from "openai"
import {createClient} from "@/supabase/server";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_BASE_URL,
})

const cvSchema = z.object({
  cv: z.object({}),
  jobDescription: z.string(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
});

const tailoredCVSchema = z.object({
  highlightedSkills: z.array(z.string()),
  suggestedImprovements: z.array(z.string()),
  tailoredCV: cvSchema,
})

export async function POST(request: Request) {
  try {
    // Get the current user session
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 })
    }

    // Parse the request body
    const { data, error } = cvSchema.safeParse(await request.json())

    if (error) {
      console.error("Validation error:", error)
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    const { jobDescription, jobTitle, company, cv } = data!;


    if (!cv || !jobDescription) {
      return NextResponse.json({ error: "Missing required fields: cv and jobDescription" }, { status: 400 })
    }

    // Create a prompt
    const prompt = `
    You are a professional CV tailoring assistant. Your task is to analyze a CV and a job description, 
    and identify which skills and experiences in the CV are most relevant to the job.
    
    CV DATA:
    ${JSON.stringify(cv)}
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    JOB TITLE: ${jobTitle || "Not specified"}
    COMPANY: ${company || "Not specified"}
    
    Please analyze the CV and job description, and return a JSON object with the following structure:
    {
      "tailoredCV": {
        // The entire CV with any modifications you recommend
      },
      "highlightedSkills": [
        // Array of skills from the CV that are most relevant to the job
      ],
      "suggestedImprovements": [
        // Array of suggestions for improving the CV for this specific job
      ]
    }
    
    Focus on identifying relevant skills, experiences, and projects that match the job requirements.
    Do not invent new information, only work with what is provided in the CV.
    `

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL!,
      messages: [
        {
          role: "system",
          content: "You are a professional CV tailoring assistant that helps match CVs to job descriptions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_completion_tokens: 2000,
      response_format: {
        type: "json_schema",
        json_schema: zodTextFormat(tailoredCVSchema, "tailoredCV"),
      }
    })

    // Parse the response
    const responseContent = completion.choices[0].message.content
    let tailoringResult

    try {
      // Try to parse the JSON response
      tailoringResult = JSON.parse(responseContent || "{}")
    } catch (error) {
      console.error("Failed to parse OpenAI response:", error)

      // Fallback to simple keyword matching if parsing fails
      const tailored = JSON.parse(JSON.stringify(cv))
      const jobDescLower = jobDescription.toLowerCase()
      const allSkills = [...(tailored.skills.technical || []), ...(tailored.skills.soft || [])]
      const matchedKeywords = allSkills.filter((skill) => jobDescLower.includes(skill.toLowerCase()))

      tailoringResult = {
        tailoredCV: tailored,
        highlightedSkills: matchedKeywords,
        suggestedImprovements: ["Consider adding more specific details to your experience section."],
      }
    }

    return NextResponse.json(tailoringResult)
  } catch (error) {
    console.error("Error in tailor-cv API route:", error)
    return NextResponse.json({ error: "Failed to tailor CV. Please try again." }, { status: 500 })
  }
}
