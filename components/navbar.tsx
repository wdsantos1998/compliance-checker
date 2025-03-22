"use client"

import Link from "next/link"
import {redirect, usePathname} from "next/navigation"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useComplianceContext } from "@/context/compliance-context"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

export default function Navbar() {
  const pathname = usePathname()
  const { flags } = useComplianceContext()

  const activeFlagCount = flags.length

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="font-bold text-xl">
            Compliance Checker
          </Link>
          <nav className="ml-8 hidden md:flex space-x-4">
            <Link
              href="/dashboard"
              className={`text-sm ${pathname === "/" ? "text-primary font-medium" : "text-gray-600 hover:text-gray-900"}`}
            >
              Dashboard
            </Link>
            <Link
              href="/upload"
              className={`text-sm ${pathname === "/upload" ? "text-primary font-medium" : "text-gray-600 hover:text-gray-900"}`}
            >
              Management
            </Link>
            <Link
              href="/communication"
              className={`text-sm ${pathname === "/communication" ? "text-primary font-medium" : "text-gray-600 hover:text-gray-900"}`}
            >
              Communication
            </Link>
          </nav>
        </div>
        <div className="flex items-center" onClick={() => redirect("/dashboard")}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {activeFlagCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {activeFlagCount}
          </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                  side="bottom"
                  align="center"
                  sideOffset={8}
                  avoidCollisions>
                You have {activeFlagCount} active compliance {activeFlagCount === 1 ? 'flag' : 'flags'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  )
}

