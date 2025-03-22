import { NextRequest, NextResponse } from "next/server";
import oauth2Client from "@/app/utils/google-auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.json({ error }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: "Missing required code parameter" }, { status: 400 });
  }

  try {
    // Exchange authorization code for access and ID tokens
    console.log("Using redirect_uri:", process.env.REDIRECT_URI);

    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: process.env.REDIRECT_URI,
    });
    oauth2Client.setCredentials(tokens); // Important if you plan to use oauth2Client later

    // Optional: Verify the ID token (if you need user profile info from ID token)
    let userInfo;
    if (tokens.id_token) {
      const ticket = await oauth2Client.verifyIdToken({
        idToken: tokens.id_token,
      });
      userInfo = ticket.getPayload();
    }

    // Create a response object and set the cookie
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set({
      name: "google_access_token",
      value: tokens.access_token || "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only set secure in production
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (err) {
    console.error("Google OAuth token exchange error:", err);
    return NextResponse.json(
        { error: "Google OAuth Error: Failed to exchange code" },
        { status: 500 }
    );
  }
}