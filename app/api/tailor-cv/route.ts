import {NextResponse} from "next/server"
import {OpenAI} from "openai"
import {createClient} from "@/supabase/server";
import {tailorCvRequestSchema, tailorCVResponseSchema} from "@/lib/cv";
const openai = new OpenAI({
    apiKey: process.env.AI_KEY,
    baseURL: process.env.AI_BASE_URL,
})

type WithError = {
    error: string
}

const extractJsonFromMarkdown = (markdown: string | null) => {
    if (!markdown) {
        return {data: null, error: "No markdown content provided"}
    }

    markdown = markdown.trim()

    if (markdown.startsWith("```json")) {
        const jsonString = markdown.replace(/```json/g, "").replace(/```/g, "").trim()
        let parsedJson

        try {
            parsedJson = JSON.parse(jsonString)
            return {data: parsedJson, error: null}
        } catch (error) {
            console.error("Error parsing JSON:", error)
            return {data: null, error: "Failed to parse JSON from markdown"}
        }

        // console.log(parsedJson)
        //
        // const { success, data } = tailorCVResponseSchema.safeParse(parsedJson)
        // if (success) {
        //     return {data, error: null}
        // } else {
        //     return {data: null, error: "Failed to parse JSON from markdown"}
        // }
    }

    let parsedJson
    try {
        parsedJson = JSON.parse(markdown)
        return {data: parsedJson, error: null}
    } catch (error) {
        return {data: null, error: "Failed to parse JSON from markdown"}
    }

    // const { success, data } = tailorCVResponseSchema.safeParse(parsedJson)
    // if (success) {
    //     return {data, error: null}
    // } else {
    //     return {data: null, error: "Failed to parse JSON from markdown"}
    // }
}


export async function POST(request: Request) {

    try {
        // Get the current user session
        const supabase = await createClient();
        const {
            data: {user},
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json<WithError>({error: "Unauthorized. Please sign in."}, {status: 401})
        }

        // Parse the request body
        const {data, error} = tailorCvRequestSchema.safeParse(await request.json())

        if (error || !data) {
            console.error("Validation error:", error)
            return NextResponse.json<WithError>({error: "Invalid input data"}, {status: 400})
        }

        const {jobDescription, jobTitle, company, cvID} = data;
        if (!cvID || !jobDescription) {
            return NextResponse.json<WithError>({error: "Missing required fields: cv and jobDescription"}, {status: 400})
        }

        const fetchCVPromise = async (cvID: string | null) => {
            if (!cvID) {
                return null
            }

            const {data, error} = await supabase
                .from("cvs")
                .select("data")
                .eq("id", cvID)
                .eq("user_id", user.id)
                .single()

            if (error) {
                console.error("Error fetching CV:", error)
                return null
            }

            return data
        }
        const cv = await fetchCVPromise(cvID)

        if (!cv) {
            return NextResponse.json<WithError>({error: "CV not found"}, {status: 404})
        }

        // Create a prompt
        const prompt = `
    You are a professional CV tailoring assistant. Your task is to analyze a CV and a job description, 
    and identify which skills and experiences in the CV are most relevant to the job.
    
    CV DATA:
    ${JSON.stringify(cv.data)}
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    JOB TITLE: ${jobTitle || "Not specified"}
    COMPANY: ${company || "Not specified"}
    
    Please do not respond with Markdown or any other formatting, only pure JSON.
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
            max_completion_tokens: 2000
        })

        const responseContent = completion.choices[0].message.content
        const { data: tailoredJson } = extractJsonFromMarkdown(responseContent)

        if (!tailoredJson) {
            return NextResponse.json<WithError>({error: "Failed to parse AI response"}, {status: 500})
        }
        console.log(tailoredJson)

        return NextResponse.json(tailoredJson, {status: 200})
    } catch (error) {
        console.error("Error in tailor-cv API route:", error)
        return NextResponse.json<WithError>({error: "Failed to tailor CV. Please try again."}, {status: 500})
    }
}
