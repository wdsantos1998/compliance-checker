import re
import time
import json
import os
from openai import OpenAI
from dotenv import load_dotenv

# Get the absolute path to the .env.local file
dotenv_path = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    ".env.local"
)

# Load the env file
load_dotenv(dotenv_path)

# Use the key
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# === Load policy documents from same folder as this file ===
def load_policy_documents():
    current_dir = os.path.dirname(__file__)
    policy_files = [os.path.join(current_dir, "structured_compliance_rules.json")]
    documents = []

    for filename in policy_files:
        try:
            with open(filename, "r") as f:
                content = json.load(f)
                documents.append({
                    "filename": os.path.basename(filename),
                    "content": content
                })
        except Exception as e:
            print(f"Error loading {filename}: {e}")

    return documents

# === Chunk the policy content ===
def chunk_policy_content(content, chunk_size=90000):
    content_str = json.dumps(content, indent=2)
    return [content_str[i:i + chunk_size] for i in range(0, len(content_str), chunk_size)]

# === Analyze a single email against all policy chunks ===
def analyze_email(email_json_str):
    try:
        email_data = json.loads(email_json_str)
        title = email_data["title"]
        body = email_data["content"]
    except Exception as e:
        return {"error": f"Invalid email input: {e}"}

    policy_documents = load_policy_documents()

    email_prompt = f"Email Title: {title}\nEmail Body: {body[:2000]}"  # Truncate long emails
    system_prompt = (
        "You are a strict but fair compliance assistant. Analyze the email below against the policy documents provided. "
        "Only flag violations that are clearly and unambiguously in violation of the stated policies. "
        "Do not flag borderline or potentially non-compliant language — only definite violations.\n\n"
        "For each confirmed violation, return a JSON object with the following keys:\n"
        "- violation_id (auto-generated if not provided)\n"
        "- source_document (filename)\n"
        "- policy_name (if available)\n"
        "- email_title\n"
        "- non_compliant_text (quote the phrase or section)\n"
        "- description (brief explanation of the issue)\n"
        "- proposed_solution (how to fix it)\n\n"
        "Return a JSON array of confirmed violation objects. If there are no violations, return an empty list.\n"
        "Do not format the output with markdown or backticks."
    )

    all_violations = []

    for doc in policy_documents:
        chunks = chunk_policy_content(doc["content"])
        for i, chunk in enumerate(chunks):
            print(f"→ Analyzing chunk {i+1} of {len(chunks)} from '{doc['filename']}'...")

            chunk_prompt = f"Document: {doc['filename']} (Part {i + 1})\n{chunk}"

            try:
                response = client.chat.completions.create(
                    model="gpt-4o",
                    temperature=0,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": chunk_prompt + "\n\n" + email_prompt}
                    ]
                )

                ai_output = response.choices[0].message.content.strip()
                cleaned_output = re.sub(r"^```(?:json)?|```$", "", ai_output.strip(), flags=re.MULTILINE).strip()
                violations = json.loads(cleaned_output)

                if isinstance(violations, list):
                    all_violations.extend(violations)

                # Wait 3 seconds to avoid hitting token-per-minute (TPM) limits
                time.sleep(3)

            except Exception as e:
                print(f"⚠️ Failed to process chunk {i + 1}: {e}")
                all_violations.append({
                    "violation_id": "error",
                    "source_document": doc["filename"],
                    "policy_name": "N/A",
                    "email_title": title,
                    "non_compliant_text": "N/A",
                    "description": f"Error analyzing chunk: {str(e)}",
                    "proposed_solution": "Retry this chunk manually"
                })

    return all_violations


if __name__ == "__main__":
    test_email = {
        "title": "Urgent Investment Offer",
        "content": "We guarantee 25% returns with no risk at all. Just send the money today!"
    }

    result = analyze_email(json.dumps(test_email))
    print(json.dumps(result, indent=2))


