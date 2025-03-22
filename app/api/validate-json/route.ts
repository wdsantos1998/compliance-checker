import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(req: NextRequest) {
    const policyPath = path.resolve(process.cwd(), "public", "resources", "sanitized_compliance_rules.json")

    try {
        // Read the file
        const fileContent = fs.readFileSync(policyPath, "utf-8")

        try {
            // Try to parse the JSON
            const parsedJson = JSON.parse(fileContent)
            return NextResponse.json({
                success: true,
                message: "JSON is valid",
                fileSize: fileContent.length,
            })
        } catch (parseError: any) {
            // If parsing fails, return detailed error
            return NextResponse.json(
                {
                    success: false,
                    error: "JSON parsing error",
                    message: parseError.message,
                    position: parseError.message.match(/position (\d+)/)?.[1],
                    // Include a snippet of the content around the error position
                    snippet: getErrorSnippet(fileContent, parseError),
                },
                { status: 400 },
            )
        }
    } catch (fileError: any) {
        return NextResponse.json(
            {
                success: false,
                error: "File reading error",
                message: fileError.message,
            },
            { status: 500 },
        )
    }
}

// Helper function to get a snippet of the content around the error
function getErrorSnippet(content: string, error: Error): string | null {
    const positionMatch = error.message.match(/position (\d+)/)
    if (!positionMatch) return null

    const position = Number.parseInt(positionMatch[1], 10)
    const start = Math.max(0, position - 20)
    const end = Math.min(content.length, position + 20)

    return content.substring(start, end)
}

