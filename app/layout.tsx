import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ComplianceProvider } from "@/context/compliance-context";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";

// ✅ Forces Next.js to re-run this layout on every request (get fresh cookies)
export const dynamic = 'force-dynamic';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "TrustLayer",
    description: "Monitor real-time conversations for compliance issues",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {

    return (
        <html lang="en">
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
            <ComplianceProvider>
                {/* ✅ Pass isAuthenticated to the AuthProvider */}
                    <div className="flex flex-col min-h-screen">
                        {/* ✅ Pass isAuthenticated to Navbar */}
                        <Navbar/>
                        <div className="flex-1">{children}</div>
                    </div>
            </ComplianceProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
