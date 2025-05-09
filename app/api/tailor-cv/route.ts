import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { OpenAI } from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
})

export async function POST(request: Request) {
  try {
    // Get the current user session
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 })
    }

    // Parse the request body
    const { cv, jobDescription, jobTitle, company } = await request.json()

    if (!cv || !jobDescription) {
      return NextResponse.json({ error: "Missing required fields: cv and jobDescription" }, { status: 400 })
    }

    // Create a prompt for OpenAI
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
      model: "gpt-4",
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
      max_tokens: 2000,
    })

    // Parse the response
    const responseContent = completion.choices[0].message.content
    let tailoringResult

    try {
      // Try to parse the JSON response
      tailoringResult = JSON.parse(responseContent)
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
