export async function exportCvAsPdf(cvData: any, highlightedSkills: string[] = [], fileName = "cv.pdf") {
  try {
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cvData,
        highlightedSkills,
        fileName,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to generate PDF: ${response.statusText}`)
    }

    // Get the PDF blob
    const blob = await response.blob()

    // Create a download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", fileName)

    // Append to the document, click it, and remove it
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the URL object
    window.URL.revokeObjectURL(url)

    return true
  } catch (error) {
    console.error("Error exporting CV as PDF:", error)
    throw error
  }
}
