import { google } from 'googleapis';

export async function getGmailEmails(accessToken: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth });

    const res = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 5, // Adjust as needed
    });

    if (!res.data.messages) return [];

    const emails = await Promise.all(
        res.data.messages.map(async (msg) => {
            const email = await gmail.users.messages.get({
                userId: 'me',
                id: msg.id!,
                format: 'full',
            });

            const payload = email.data.payload;
            const headers = payload?.headers || [];

            const getHeader = (name: string) =>
                headers.find((header) => header.name?.toLowerCase() === name.toLowerCase())?.value || '';

            const from = getHeader('From');
            const to = getHeader('To');
            const subject = getHeader('Subject');
            const date = getHeader('Date');

            // Function to extract the plain text part of the email
            const extractPlainText = (part: any): string => {
                if (part?.mimeType === 'text/plain' && part.body?.data) {
                    return Buffer.from(part.body.data, 'base64').toString('utf-8');
                }

                if (part?.parts?.length) {
                    return part.parts.map(extractPlainText).join('\n');
                }

                return '';
            };

            const textContent = extractPlainText(payload).trim();

            // Count attachments (excluding inline images)
            const countAttachments = (part: any): number => {
                let count = 0;
                if (part?.filename && part.body?.attachmentId) {
                    count += 1;
                }
                if (part?.parts?.length) {
                    count += part.parts.reduce((acc: number, p: any) => acc + countAttachments(p), 0);
                }
                return count;
            };

            const attachmentCount = countAttachments(payload);

            return {
                emailId: email.data.id,
                date,
                from,
                to,
                subject,
                text: textContent,
                attachments: attachmentCount,
            };
        })
    );

    return emails;
}
