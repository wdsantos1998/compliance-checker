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
    <Card className={`border-l-4 ${severityColor}`}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <CardTitle className="text-lg font-semibold">{flag.title}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onDismiss} className="h-8 w-8">
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{flag.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">{new Date(flag.timestamp).toLocaleString()}</span>
          <span className="text-xs font-medium capitalize">{flag.severity} severity</span>
        </div>
      </CardContent>
    </Card>
  )
}

