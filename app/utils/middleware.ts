import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('google_access_token');
    const pathname = request.nextUrl.pathname;

    // ✅ Allow the landing page for everyone
    if (pathname === '/') {
        return NextResponse.next();
    }

    // ✅ Protect everything under /dashboard (or any route you define)
    if (!token && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/', request.url)); // Send back to landing
    }

    return NextResponse.next();
}
