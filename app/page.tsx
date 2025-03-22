import { Suspense } from "react"
import ComplianceDashboard from "@/components/compliance-dashboard"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Toaster />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Compliance Checker Dashboard</h1>
        <Suspense fallback={<div>Loading dashboard...</div>}>
          <ComplianceDashboard />
        </Suspense>
      </div>
    </main>
  )
}

