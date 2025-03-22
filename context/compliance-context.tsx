"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { ComplianceFlag } from "@/types/compliance"
import { fetchComplianceFlags } from "@/lib/api"

interface ComplianceContextType {
  flags: ComplianceFlag[]
  addFlag: (flag: ComplianceFlag) => void
  dismissFlag: (id: string) => void
  clearFlags: () => void
  setFlags: (flags: ComplianceFlag[]) => void
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(undefined)

export function ComplianceProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<ComplianceFlag[]>([])

  useEffect(() => {
    // Fetch initial flags on mount
    const loadInitialFlags = async () => {
      try {
        const initialFlags = await fetchComplianceFlags()
        setFlags(initialFlags)
      } catch (error) {
        console.error("Failed to fetch initial compliance flags:", error)
      }
    }

    loadInitialFlags()
  }, [])

  const addFlag = (flag: ComplianceFlag) => {
    setFlags((prevFlags) => [flag, ...prevFlags])
  }

  const dismissFlag = (id: string) => {
    setFlags((prevFlags) => prevFlags.filter((flag) => flag.id !== id))
  }

  const clearFlags = () => {
    setFlags([])
  }

  return (
    <ComplianceContext.Provider value={{ flags, addFlag, dismissFlag, clearFlags, setFlags }}>
      {children}
    </ComplianceContext.Provider>
  )
}

export function useComplianceContext() {
  const context = useContext(ComplianceContext)
  if (context === undefined) {
    throw new Error("useComplianceContext must be used within a ComplianceProvider")
  }
  return context
}

