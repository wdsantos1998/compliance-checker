import { type NextRequest, NextResponse } from "next/server"
import type { ComplianceFlag } from "@/types/compliance"
import { v4 as uuidv4 } from "uuid"

// POST /api/compliance-issue
// Accepts a compliance issue object and returns the created flag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: "Missing required fields: title and description are required" },
        { status: 400 },
      )
    }

    // Create a new compliance flag with generated ID and timestamp
    const newFlag: ComplianceFlag = {
      id: uuidv4(),
      title: body.title,
      description: body.description,
      severity: body.severity || "medium",
      timestamp: new Date().toISOString(),
      category: body.category || "general",
    }

    // In a real implementation, you would save this to a database
    // For now, we'll just return the created flag

    return NextResponse.json(newFlag, { status: 201 })
  } catch (error) {
    console.error("Error processing compliance issue:", error)
    return NextResponse.json({ error: "Failed to process compliance issue" }, { status: 500 })
  }
}

