import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import oauth2Client from "@/app/utils/google-auth";
import Link from "next/link";

export default function Page() {
    const SCOPE = [
        "https://www.googleapis.com/auth/gmail.readonly",
    ];

    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPE,
        prompt: "consent",
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
                Contract Compliance Checker
            </h1>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
                Automatically analyze your email attachments for contract compliance. Connect your Gmail account securely and let AI handle the heavy lifting.
            </p>

            <Link
                href={authorizationUrl}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all"
            >
                Connect with Google
            </Link>

            <Toaster />
        </div>
    );
}
