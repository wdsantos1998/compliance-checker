// lib/gmail.ts
import { google } from 'googleapis';

export async function getGmailEmails(accessToken: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth });

    // Fetch the list of messages
    const res = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 5, // adjust number of emails
    });

    if (!res.data.messages) return [];

    // Fetch email details for each message
    const emails = await Promise.all(
        res.data.messages.map(async (msg) => {
            const email = await gmail.users.messages.get({
                userId: 'me',
                id: msg.id!,
            });
            return {
                id: email.data.id,
                snippet: email.data.snippet,
            };
        })
    );

    return emails;
}
