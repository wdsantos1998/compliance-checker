
# 📧 Communication Compliance AI Checker

## 💼 Project Purpose

This project leverages OpenAI's language models to analyze corporate emails and communications for potential compliance violations.

By proactively identifying risky or non-compliant language, companies can:
✅ Prevent regulatory fines  
✅ Avoid lawsuits  
✅ Protect their reputation

💰 **Saving millions of dollars** by managing communication compliance effectively.

## 🛠 Technologies Used
- Frontend:
   - **Next.js** with **React**
   - **Tailwind CSS**
- Backend:
   - OpenAI API (for embeddings and policy matching)
   - FastAPI or Next.js API routes
- File Storage:
  - AWS S3 or Supabase Storage (for PDFs, communications)
- Database:
  - PostgreSQL with pgvector extension (for storing semantic vectors)
-Auth:
  - Supabase Auth or custom JWT-based auth with Role-Based Access Control (RBAC)

## 🚀 How to Run the Project

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <your-project-folder>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**

   Create a `.env.local` file in the project root and add the following:
   ```
   CLIENT_ID=your_client_id
   CLIENT_SECRET=your_client_secret
   REDIRECT_URI=your_redirect_uri
   OPENAI_API_KEY=your_openai_api_key
   LOCAL_URL=http://localhost:3000
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

---


---

## 👨‍💻 Developers
- **Wesley dos Santos**

##UX Example
![Screenshot 2025-05-30 at 23 51 09](https://github.com/user-attachments/assets/e134adca-0203-4cd4-990c-6711aae29c0b)
