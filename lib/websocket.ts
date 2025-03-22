import type { ComplianceFlag } from "@/types/compliance"

interface WebSocketOptions {
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Event) => void
  onFlag?: (flag: ComplianceFlag) => void
}

// Setup WebSocket connection for real-time compliance flags
export function setupWebSocket(options: WebSocketOptions = {}) {
  // Using the specified WebSocket endpoint
  const WS_ENDPOINT = "ws://localhost:3000"

  let socket: WebSocket | null = null
  let reconnectAttempts = 0
  const MAX_RECONNECT_ATTEMPTS = 5
  const RECONNECT_DELAY = 3000 // 3 seconds

  function connect() {
    try {
      socket = new WebSocket(WS_ENDPOINT)

      socket.onopen = () => {
        console.log("WebSocket connection established")
        reconnectAttempts = 0
        options.onConnect?.()
      }

      socket.onclose = (event) => {
        console.log("WebSocket connection closed:", event)
        options.onDisconnect?.()

        // Attempt to reconnect
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++
          setTimeout(connect, RECONNECT_DELAY)
        }
      }

      socket.onerror = (error) => {
        console.error("WebSocket error:", error)
        options.onError?.(error)
      }

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          // Handle different message types
          if (data.type === "compliance_flag" && options.onFlag) {
            options.onFlag(data.payload)
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error)
        }
      }
    } catch (error) {
      console.error("Failed to establish WebSocket connection:", error)
      options.onError?.(error as Event)
    }
  }

  // Initial connection
  connect()

  // Return cleanup function
  return () => {
    if (socket) {
      socket.close()
    }
  }
}

