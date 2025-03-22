import type { ComplianceFlag } from "@/types/compliance"

const API_BASE_URL = "/api"

// Fetch compliance flags from the backend
export async function fetchComplianceFlags(): Promise<ComplianceFlag[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/db`)

    if (!response.ok) {
      throw new Error(`Failed to fetch compliance flags: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching compliance flags:", error)
    throw error
  }
}

// Upload PDF to the backend
export async function uploadPDF(file: File, name: string): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("name", name)

    const response = await fetch(`${API_BASE_URL}/upload-pdf`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload PDF: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error uploading PDF:", error)
    throw error
  }
}

// Fetch processed files from the backend
export async function fetchProcessedFiles() {
  try {
    const response = await fetch(`${API_BASE_URL}/processed-files`)

    if (!response.ok) {
      throw new Error(`Failed to fetch processed files: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching processed files:", error)
    throw error
  }
}

// Report a compliance issue (for testing purposes)
export async function reportComplianceIssue(issue: Omit<ComplianceFlag, "id" | "timestamp">): Promise<ComplianceFlag> {
  try {
    const response = await fetch(`${API_BASE_URL}/compliance-issue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(issue),
    })

    if (!response.ok) {
      throw new Error(`Failed to report compliance issue: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error reporting compliance issue:", error)
    throw error
  }
}

