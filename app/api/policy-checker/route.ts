import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables (adjust path if needed)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// OpenAI API Key (Ensure it's set in .env.local)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY not found. Check your .env.local file.");
}

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// === Load Policy Documents ===
const loadPolicyDocuments = (): { filename: string; content: any }[] => {
    const policyPath = path.resolve(process.cwd(), "public", "resources", "sanitized_compliance_rules.json")
    try {
        const fileContent = fs.readFileSync(policyPath, "utf-8")
        return [{ filename: "sanitized_compliance_rules.json", content: JSON.parse(fileContent) }];
    } catch (error) {
        console.error("Error loading policy file:", error);
        return [];
    }
};

// === Chunk Policy Content ===
const chunkPolicyContent = (content: any, chunkSize: number = 300000): string[] => {
    const contentStr = JSON.stringify(content, null, 2);
    return contentStr.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];
};

export interface ParsedEmail {
    emailId: string | number;    // Adjust to 'string' or 'number' based on your email.data.id type
    date: string;                // ISO date string or Date if you prefer
    from: string;
    to: string;
    subject: string;
    text: string;
    attachments: number;
}

// === Analyze Email ===
const analyzeEmail = async (emailJson: ParsedEmail) => {
    try {
        const { subject, text, from } = emailJson;
        if (!subject || !text) {
            return { error: "Invalid email input: Missing title or content" };
        }

        console.log(`📧 Analyzing email with subject: ${subject} from: ${from}`);

        const policyDocuments = loadPolicyDocuments();
        const emailPrompt = `Email Title: ${subject}\nEmail Body: ${text.slice(0, 2000)}`; // Truncate to avoid exceeding token limit

        const systemPrompt = `
      You are a strict but fair compliance assistant. Analyze the email below against the policy documents provided.
      Only flag violations that are clearly and unambiguously in violation of the stated policies.
      Do not flag borderline or potentially non-compliant language — only definite violations.
      
      For each confirmed violation, return a JSON object with the following keys:
      - id (auto-generated integer or leave as null if unknown)
      - title (brief summary of the compliance issue)
      - description (short explanation of the issue)
      - severity (low, medium, or high — based on how serious the violation is)
      - proposedSolution (how to fix it)
      - timestamp (UTC ISO 8601 string of current time)
      - emailOrigen (email sender or origin address)
      - documentSource (the name of the policy file, e.g., sanitized_compliance_rules.json)
      
      Return a JSON array of confirmed violation objects using this exact schema.
      
      If there are no violations, return an empty list.
    `;

        for (const doc of policyDocuments) {
            const chunks = chunkPolicyContent(doc.content);

            for (let i = 0; i < 4; i++) {
                let randomNumber = Math.floor(Math.random() * chunks.length);
                const chunkPrompt = `Document: ${doc.filename} (Part ${randomNumber + 1})\n${chunks[randomNumber]}`;

                try {
                    console.log(`→ Analyzing chunk ${randomNumber + 1} of ${chunks.length} from '${doc.filename}'...`);

                    const response = await openai.chat.completions.create({
                        model: "gpt-4o",
                        temperature: 0,
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: chunkPrompt + "\n\n" + emailPrompt },
                        ],
                    });

                    // ✅ Sanitize AI output before JSON.parse
                    const aiOutputRaw = response.choices[0].message.content?.trim() || "[]";

                    const aiOutputClean = aiOutputRaw
                        .replace(/^```(?:json)?\n?/, '')
                        .replace(/\n?```$/, '')
                        .trim();

                    const violations = JSON.parse(aiOutputClean);

                    if (Array.isArray(violations) && violations.length > 0) {
                        console.log("🚨 Violation found. Stopping analysis.");
                        return violations; // ✅ Return immediately on the first violation
                    }

                    // Wait 3 seconds to avoid hitting token-per-minute (TPM) limits
                    await new Promise((resolve) => setTimeout(resolve, 3000));

                } catch (error) {
                    console.error(`⚠️ Failed to process chunk ${randomNumber + 1}:`, error);
                    return [{
                        id: randomNumber + 1,
                        title: "Analysis Error",
                        description: `Error analyzing chunk: ${error}`,
                        severity: "high",
                        proposedSolution: "Retry this chunk manually",
                        timestamp: new Date().toISOString(),
                        emailOrigen: from,
                        documentSource: doc.filename,
                    }];
                }
            }
        }

        // ✅ If no violations found, return empty array
        return [];
    } catch (error) {
        console.error("Unexpected error during analysis:", error);
        return { error: "Internal error processing policy check", details: error };
    }
};


// === Next.js API Route Handler ===
export async function POST(req: NextRequest) {
    try {
        const emailJson = await req.json();
        console.log("📧 Received email for analysis:", emailJson);

        const result = await analyzeEmail(emailJson);

        return NextResponse.json({ result, message: "Email successfully analyzed" }, { status: 200 });
    } catch (error) {
        console.error("Policy check error:", error);
        return NextResponse.json({ error: "Internal error processing policy check", details: error }, { status: 500 });
    }
}
