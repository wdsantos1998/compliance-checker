"use client"

import React, { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import ComplianceFlag from "@/components/compliance-flag"
import { useComplianceContext } from "@/context/compliance-context"
import { setupWebSocket } from "@/lib/websocket"
import { Button } from "@/components/ui/button";

export default function ComplianceDashboard() {
  const { flags, dismissFlag, addFlag } = useComplianceContext()
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Setup WebSocket connection for real-time flags
    const cleanup = setupWebSocket({
      onConnect: () => {
        setIsConnected(true)
        toast({
          title: "Connected",
          description: "Real-time compliance monitoring is active",
        })
      },
      onDisconnect: () => {
        setIsConnected(false)
        toast({
          title: "Disconnected",
          description: "Real-time monitoring connection lost",
          variant: "destructive",
        })
      },
      onError: (error) => {
        console.error("WebSocket error:", error)
        toast({
          title: "Connection Error",
          description: "Failed to establish real-time monitoring",
          variant: "destructive",
        })
      },
      // Pass the addFlag function from context to the WebSocket handler
      onFlag: (flag) => {
        addFlag(flag)
      },
    })

    return cleanup
  }, [toast, addFlag])

  return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Active Compliance Issues</h2>

        {flags.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No compliance issues detected</div>
        ) : (
            <div className="space-y-4">
              {flags.map((flag) => (
                  <ComplianceFlag key={flag.id} flag={flag} onDismiss={() => dismissFlag(flag.id)}/>
              ))}
            </div>
        )}

        {/* ✅ Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
              variant="destructive"
              onClick={async () => {
                await fetch("/api/db", {method: "DELETE"})
                toast({
                  title: "All Issues Cleared",
                  description: "The compliance issue list has been cleared.",
                })
              }}
          >
            Clear All Issues
          </Button>

          <Button
              variant="secondary"
              onClick={async () => {
                const res = await fetch("/api/db")
                const data = await res.json()
                console.log("Fetched issues:", data)
                toast({
                  title: "Issues Updated",
                  description: `Fetched ${data.length} compliance issue(s) from the database.`,
                })
              }}
          >
              Update Issues
          </Button>
        </div>
      </div>

  )
}

