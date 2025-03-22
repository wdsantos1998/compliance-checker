import { Suspense } from "react"
import PDFUploadForm from "@/components/pdf-upload-form"
import { Toaster } from "@/components/ui/toaster"

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Toaster />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Management</h1>
        <Suspense fallback={<div>Loading management interface...</div>}>
          <PDFUploadForm />
        </Suspense>
      </div>
    </main>
  )
}

