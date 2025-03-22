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
  const severityColors = {
    high: "bg-red-100 border-red-400 text-red-800",
    medium: "bg-yellow-100 border-yellow-400 text-yellow-800",
    low: "bg-blue-100 border-blue-400 text-blue-800",
  }

  const severityColor = severityColors[flag.severity] || severityColors.medium

  return (
      <Card className={`border-l-4 ${severityColor} shadow-sm`}>
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-lg font-semibold">{flag.title}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onDismiss} className="h-8 w-8">
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          <p className="text-gray-700">{flag.description}</p>

          {/* ✅ Source Info */}
          <div className="bg-gray-50 p-3 rounded border">
            <p className="text-xs text-gray-500">📄 <span className="font-medium">Source Document:</span> {flag.documentSource || 'N/A'}</p>
            <p className="text-xs text-gray-500">✉️ <span className="font-medium">Email Origin:</span> {flag.emailOrigen || 'N/A'}</p>
          </div>

          {/* ✅ Proposed Solution */}
          {flag.proposedSolution && (
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="text-xs text-green-700 font-medium">✅ Proposed Solution:</p>
                <p className="text-xs text-green-800 mt-1">{flag.proposedSolution}</p>
              </div>
          )}

          {/* ✅ Timestamp and Severity */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{new Date(flag.timestamp).toLocaleString()}</span>
            <span className="font-medium capitalize">{flag.severity} Severity</span>
          </div>
        </CardContent>
      </Card>

  )
}

