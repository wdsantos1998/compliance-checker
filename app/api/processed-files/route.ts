import { NextResponse } from "next/server"

// Mock data for demonstration purposes
const mockProcessedFiles = [
  {
    id: "1",
    name: "Compliance Guidelines 2023",
    originalFilename: "compliance_guidelines_2023.pdf",
    uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    status: "processed",
    uploadedBy: "John Smith",
    fileSize: 2457600, // 2.4 MB
  },
  {
    id: "2",
    name: "Customer Data Handling Procedures",
    originalFilename: "data_handling_v3.pdf",
    uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    status: "processed",
    uploadedBy: "Sarah Johnson",
    fileSize: 1843200, // 1.8 MB
  },
  {
    id: "3",
    name: "Financial Disclosure Requirements",
    originalFilename: "financial_disclosure_req_2023.pdf",
    uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    status: "pending",
    uploadedBy: "Michael Chen",
    fileSize: 3276800, // 3.2 MB
  },
  {
    id: "4",
    name: "Privacy Policy Update",
    originalFilename: "privacy_policy_update_march.pdf",
    uploadDate: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    status: "failed",
    uploadedBy: "Lisa Rodriguez",
    fileSize: 1024000, // 1 MB
  },
]

export async function GET() {
  // In a real implementation, you would fetch this from a database
  return NextResponse.json(mockProcessedFiles)
}

