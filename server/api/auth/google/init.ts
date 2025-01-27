import { google } from "googleapis";

export default defineEventHandler(async (event) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const scopes = ["https://www.googleapis.com/auth/calendar"];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent", // Force to generate new refresh token
  });

  console.log("Auth URL:", authUrl);

  return sendRedirect(event, authUrl);
});
