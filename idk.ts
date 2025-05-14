import { tailorCVResponseSchema } from "@/lib/cv";

const mkd = `\`\`\`json
{
  "tailoredCV": {
    "skills": {
      "soft": [],
      "languages": [],
      "technical": []
    },
    "personal": {
      "name": "Daniel Santos",
      "email": "contatodanieljob@gmail.com",
      "phone": "+55 91 99820 0462",
      "title": "Backend Developer",
      "github": "https://github.com/ddanielsantos",
      "summary": "Highly motivated Backend Developer with a passion for building scalable and resilient systems. Eager to contribute to NebulaGrid's innovative data infrastructure initiatives.",
      "website": "https://ddaniel.me",
      "linkedin": "https://linkedin.com/in/ddanielsantos"
    },
    "projects": [],
    "education": [],
    "experience": []
  },
  "highlightedSkills": [],
  "suggestedImprovements": [
    "The CV is missing key information such as technical skills, programming languages, experience and projects. Please add these sections to showcase your abilities.",
    "Specifically, the job description mentions Go, Kubernetes, and Apache Kafka. If you have experience with these technologies, be sure to highlight them in your skills and experience sections.",
    "Quantify your experience wherever possible. For example, instead of saying 'Developed backend systems,' say 'Developed backend systems that processed X requests per second with Y latency.'",
    "Add a summary section that highlights your relevant experience and enthusiasm for the role at NebulaGrid.",
    "List any projects that demonstrate your experience with distributed systems, container orchestration, or real-time data processing."
  ]
}
\`\`\``

const extractJsonFromMarkdown = (markdown: string | null) => {
    if (!markdown) {
        console.error("No markdown content provided")
        return null
    }
    console.log("Markdown content:", markdown)
    const jsonString = markdown.replace(/```json/g, "").replace(/```/g, "").trim()
    try {
        const parsedJson = JSON.parse(jsonString)
        console.log(parsedJson)

        const result = tailorCVResponseSchema.safeParse(parsedJson)
        if (result.success) {
            return result.data
        } else {
            console.error("Validation error:", result.error)
            return null
        }
    } catch (error) {
        console.error("Error parsing JSON:", error)
        return null
    }
}

const resp = tailorCVResponseSchema.safeParse(extractJsonFromMarkdown(mkd))
console.log(resp.success)
