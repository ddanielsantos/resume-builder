import {TailorCVRequest, TailorCVResponse} from "../cv"


export async function tailorCVWithAI(params: TailorCVRequest): Promise<{ error?: string, data?: TailorCVResponse }> {
  try {
    // Call our API route
    const response = await fetch("/api/tailor-cv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      console.log(`API request failed with status ${response.status}`)
      const errorResponse = await response.json()
      return { error: errorResponse.error || "An unknown error occurred" }
    }

    return { data: await response.json() }
  } catch (error) {
    console.error("Error tailoring CV:", error)
    // TODO: debug this later
    return { error: "An error occurred while tailoring the CV." }
  }
}
