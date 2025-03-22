export interface ComplianceFlag {
  id: string
  title: string
  description: string
  severity: "low" | "medium" | "high"
  timestamp: string
  category?: string
}

