import { NextResponse } from "next/server"
import type { ComplianceFlag } from "@/types/compliance"

// Mock data for demonstration purposes
const mockFlags: ComplianceFlag[] = [
  {
    id: "1",
    title: "Unauthorized Disclosure",
    description: "The representative disclosed sensitive customer information without proper verification.",
    severity: "high",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    category: "privacy",
  },
  {
    id: "2",
    title: "Missing Disclaimer",
    description: "Required disclaimer was not provided during the financial advice conversation.",
    severity: "medium",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    category: "regulatory",
  },
  {
    id: "3",
    title: "Inappropriate Language",
    description: "Representative used unprofessional language during customer interaction.",
    severity: "low",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    category: "conduct",
  },
]

// GET /api/compliance-flags
// Returns an array of compliance flags
export async function GET() {
  // In a real implementation, you would fetch this from a database
  return NextResponse.json(mockFlags)
}

