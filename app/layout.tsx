import { cookies } from "next/headers";
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ComplianceProvider } from "@/context/compliance-context"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"

import { AuthProvider } from "@/components/auth-provider";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Compliance Checker",
  description: "Monitor real-time conversations for compliance issues",
}

export default async function RootLayout({
                                           children,
                                         }: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('google_access_token')?.value;
  const isAuthenticated = !!token; // Adjust with token validation if needed

  return (
      <html lang="en">
      <body className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <ComplianceProvider>
          <AuthProvider isAuthenticated={isAuthenticated}>
            <div className="flex flex-col min-h-screen">
              {isAuthenticated && <Navbar />}
              <div className="flex-1">{children}</div>
            </div>
          </AuthProvider>
        </ComplianceProvider>
      </ThemeProvider>
      </body>
      </html>
  )
}
