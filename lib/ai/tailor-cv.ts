interface TailorCVParams {
  cv: any
  jobDescription: string
  jobTitle?: string
  company?: string
}

interface TailoringResult {
  tailoredCV: any
  highlightedSkills: string[]
  suggestedImprovements: string[]
}

export async function tailorCVWithAI({
  cv,
  jobDescription,
  jobTitle,
  company,
}: TailorCVParams): Promise<TailoringResult> {
  try {
    // Call our API route
    const response = await fetch("/api/tailor-cv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cv,
        jobDescription,
        jobTitle,
        company,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error tailoring CV:", error)

    // Fallback to simple keyword matching if the API call fails
    const tailored = JSON.parse(JSON.stringify(cv))
    const jobDescLower = jobDescription.toLowerCase()
    const allSkills = [...(tailored.skills.technical || []), ...(tailored.skills.soft || [])]
    const matchedKeywords = allSkills.filter((skill) => jobDescLower.includes(skill.toLowerCase()))

    return {
      tailoredCV: tailored,
      highlightedSkills: matchedKeywords,
      suggestedImprovements: ["Unable to generate AI suggestions at this time."],
    }
  }
}
