import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getGmailEmails } from '@/lib/gmail';

export const dynamic = 'force-dynamic'; // Ensure this runs fresh on every fetch

export async function GET(req: NextRequest) {
    console.log('Fetching Gmail emails...');

    // ✅ Await the cookies() function to get the cookieStore
    const cookieStore = await cookies(); // Fix: Add await here
    const accessToken = cookieStore.get('google_access_token')?.value;
    console.log('Access token:', accessToken);

    // Optional: Still good to double-check in case of client-side fetch after session expires
    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized - Session expired' }, { status: 401 });
    }

    try {
        const emails = await getGmailEmails(accessToken);
        return NextResponse.json({ emails }, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch Gmail emails:', error);
        return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
    }
}