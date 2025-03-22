// Import modules needed for running a Python subprocess, file handling, and handling Next.js API requests
import { spawn } from "child_process";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";

// Define the path to the local JSON file (your simulated database)
const DB_PATH = path.join(process.cwd(), "app", "local-db", "local-db.json");

// Handle POST requests to /api/policy-checker
export async function POST(req: NextRequest) {
  // Extract values from the incoming JSON request body
  const { title, content, emailOrigen = "" } = await req.json();

  // Validate input: title and content are required
  if (!title || !content) {
    return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
  }

  // Define the Python executable (adjust to "python3" or full path if needed)
  const python = "python";

  // Resolve the path to your Python script that performs the compliance check
  const scriptPath = path.resolve("app/utils/policy-cheker.py");

  // Convert the email data to a JSON string to pass as a command-line argument to Python
  const emailJson = JSON.stringify({ title, content });

  // Run the Python script and return a promise while it completes
  return new Promise((resolve, reject) => {
    // Launch the Python process with the script and the email JSON as arguments
    const subprocess = spawn(python, [scriptPath, emailJson]);

    let output = "";

    // Collect output from the Python script (stdout)
    subprocess.stdout.on("data", (data) => {
      output += data;
    });

    // Log any errors that happen in the Python process (stderr)
    subprocess.stderr.on("data", (err) => {
      console.error("Python error:", err.toString());
    });

    // Once the Python script finishes, parse and save the violations
    subprocess.on("close", async () => {
      try {
        // Try to parse the output from Python as JSON
        const violations = JSON.parse(output);

        // If no violations were found, return an empty response
        if (!Array.isArray(violations) || violations.length === 0) {
          return resolve(NextResponse.json({ message: "✅ No violations found", violations: [] }));
        }

        // Read the current local DB file (local-db.json)
        const dbRaw = await fs.readFile(DB_PATH, "utf-8");
        const existingIssues = JSON.parse(dbRaw);

        // Calculate the next available ID for new violations
        let nextId = existingIssues.length
          ? Math.max(...existingIssues.map((v: any) => v.id || 0)) + 1
          : 1;

        // Format each violation with required fields and default fallbacks
        const newIssues = violations.map((violation: any, i: number) => ({
          id: nextId + i,
          title: violation.title,
          description: violation.description,
          severity: violation.severity || "medium",
          proposedSolution: violation.proposedSolution || "",
          timestamp: new Date().toISOString(),
          emailOrigen: violation.emailOrigen || emailOrigen,
          documentSource: violation.documentSource || "structured_compliance_rules.json",
        }));

        // Combine existing issues with the new ones
        const updated = [...existingIssues, ...newIssues];

        // Save the updated list back to local-db.json
        await fs.writeFile(DB_PATH, JSON.stringify(updated, null, 2), "utf-8");

        // Respond to the client with the saved violations
        return resolve(
          NextResponse.json({
            message: `✅ Saved ${newIssues.length} violation(s) to local-db.json`,
            violations: newIssues,
          })
        );
      } catch (err) {
        // Catch any errors during parsing or writing and respond with an error
        console.error("❌ Failed to parse or save violations:", err);
        reject(
          NextResponse.json({ error: "Internal error processing policy check" }, { status: 500 })
        );
      }
    });
  });
}
