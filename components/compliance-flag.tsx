"use client"

import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ComplianceFlag as ComplianceFlagType } from "@/types/compliance"

interface ComplianceFlagProps {
  flag: ComplianceFlagType
  onDismiss: () => void
}

export default function ComplianceFlag({ flag, onDismiss }: ComplianceFlagProps) {
  // Optional: Color only the left border based on severity
  const severityBorder = {
    high: "border-red-500",
    medium: "border-yellow-500",
    low: "border-gray-300",
  }

  const borderColor = severityBorder[flag.severity] || severityBorder.medium

  return (
      <Card className={`border-l-4 ${borderColor} bg-white shadow-sm`}>
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-gray-500" />
            <CardTitle className="text-lg font-medium text-gray-800">{flag.title}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onDismiss} className="h-8 w-8">
            <X className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 text-sm text-gray-700">
          <p>{flag.description}</p>

          {/* ✅ Source Info */}
          <div className="p-3 rounded bg-gray-100 text-xs">
            <p><span className="font-medium">📄 Source:</span> {flag.documentSource || 'N/A'}</p>
            <p><span className="font-medium">✉️ Email:</span> {flag.emailOrigen || 'N/A'}</p>
          </div>

          {/* ✅ Proposed Solution */}
          {flag.proposedSolution && (
              <div className="p-3 rounded bg-gray-50 border text-xs">
                <p className="font-medium text-gray-600">✅ Proposed Solution:</p>
                <p className="mt-1 text-gray-700">{flag.proposedSolution}</p>
              </div>
          )}

          {/* ✅ Timestamp and Severity */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{new Date(flag.timestamp).toLocaleString()}</span>
            <span className="capitalize font-medium">{flag.severity} Severity</span>
          </div>
        </CardContent>
      </Card>
  )
}
