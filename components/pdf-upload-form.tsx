"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Check, AlertCircle, File, Calendar, User } from "lucide-react"
import { uploadPDF, fetchProcessedFiles } from "@/lib/api"

interface ProcessedFile {
  id: string
  name: string
  originalFilename: string
  uploadDate: string
  status: "processed" | "pending" | "failed"
  uploadedBy?: string
  fileSize: number
}

export default function PDFUploadForm() {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch the list of processed files when the component mounts
    const loadProcessedFiles = async () => {
      try {
        const files = await fetchProcessedFiles()
        setProcessedFiles(files)
      } catch (error) {
        console.error("Failed to fetch processed files:", error)
        toast({
          title: "Error",
          description: "Failed to load processed files",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProcessedFiles()
  }, [toast])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
      setUploadStatus("idle")

      // Set a default file name based on the original filename (without extension)
      const defaultName = selectedFile.name.replace(/\.pdf$/i, "")
      setFileName(defaultName)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      })
      return
    }

    if (!fileName.trim()) {
      toast({
        title: "Missing file name",
        description: "Please provide a name for this file",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const result = await uploadPDF(file, fileName)
      setUploadStatus("success")
      toast({
        title: "Upload successful",
        description: "The PDF has been uploaded successfully",
      })

      // Add the newly uploaded file to the list
      if (result.id) {
        setProcessedFiles((prev) => [
          {
            id: result.id,
            name: fileName,
            originalFilename: file.name,
            uploadDate: new Date().toISOString(),
            status: "pending",
            fileSize: file.size,
          },
          ...prev,
        ])
      }

      setFile(null)
      setFileName("")
      // Reset the file input
      const fileInput = document.getElementById("pdf-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus("error")
      toast({
        title: "Upload failed",
        description: "There was an error uploading the PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Compliance Documents</CardTitle>
          <CardDescription>Upload PDF documents for compliance review. Only PDF files are accepted.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="file-name">Document Name</Label>
              <Input
                id="file-name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter a name for this document"
                disabled={isUploading || !file}
                className="mb-4"
              />

              <Label htmlFor="pdf-upload" className="sr-only">
                Upload PDF
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Click to upload or drag and drop</span>
                  <span className="text-xs text-gray-500 mt-1">PDF (up to 10MB)</span>
                </label>
              </div>
            </div>

            {file && (
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <FileText className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium truncate flex-1">{file.name}</span>
                <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="flex items-center p-3 bg-green-50 text-green-700 rounded-md">
                <Check className="h-5 w-5 mr-2" />
                <span className="text-sm">PDF uploaded successfully</span>
              </div>
            )}

            {uploadStatus === "error" && (
              <div className="flex items-center p-3 bg-red-50 text-red-700 rounded-md">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">Upload failed. Please try again.</span>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={!file || isUploading || !fileName.trim()}>
                {isUploading ? "Uploading..." : "Upload PDF"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processed Documents</CardTitle>
          <CardDescription>List of all uploaded documents and their processing status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-sm text-gray-500">Loading processed files...</p>
            </div>
          ) : processedFiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No documents have been processed yet</div>
          ) : (
            <div className="space-y-4">
              {processedFiles.map((processedFile) => (
                <div
                  key={processedFile.id}
                  className="flex items-start p-4 border rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="mr-4">
                    <div
                      className={`p-2 rounded-md ${
                        processedFile.status === "processed"
                          ? "bg-green-100 text-green-700"
                          : processedFile.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      <File className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium">{processedFile.name}</h4>
                    <p className="text-xs text-gray-500 truncate">{processedFile.originalFilename}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(processedFile.uploadDate).toLocaleString()}</span>
                      <span className="mx-2">•</span>
                      <span>{formatFileSize(processedFile.fileSize)}</span>
                      {processedFile.uploadedBy && (
                        <>
                          <span className="mx-2">•</span>
                          <User className="h-3 w-3 mr-1" />
                          <span>{processedFile.uploadedBy}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        processedFile.status === "processed"
                          ? "bg-green-100 text-green-800"
                          : processedFile.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {processedFile.status === "processed"
                        ? "Processed"
                        : processedFile.status === "pending"
                          ? "Pending"
                          : "Failed"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

