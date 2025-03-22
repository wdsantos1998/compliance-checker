"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import ComplianceFlag from "@/components/compliance-flag"
import { useComplianceContext } from "@/context/compliance-context"
import { setupWebSocket } from "@/lib/websocket"

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? "Connected to real-time monitoring" : "Disconnected from real-time monitoring"}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Active Compliance Issues</h2>

        {flags.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No compliance issues detected</div>
        ) : (
          <div className="space-y-4">
            {flags.map((flag) => (
              <ComplianceFlag key={flag.id} flag={flag} onDismiss={() => dismissFlag(flag.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

