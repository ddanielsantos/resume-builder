import { type NextRequest, NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { CvPdfDocument } from "@/components/pdf/cv-pdf-document"
import {createClient} from "@/supabase/client";

export async function POST(request: NextRequest) {
  try {
    // Get the current user session
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 })
    }

    // Parse the request body
    const { cvData, highlightedSkills = [], fileName = "cv.pdf" } = await request.json()

    if (!cvData) {
      return NextResponse.json({ error: "Missing required field: cvData" }, { status: 400 })
    }

    // Generate the PDF
    const buffer = await renderToBuffer(<CvPdfDocument data={cvData} highlightedSkills={highlightedSkills} />)

    // Return the PDF as a response
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF. Please try again." }, { status: 500 })
  }
}
