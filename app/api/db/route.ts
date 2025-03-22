import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Adjust the path to your local-db.json
const DB_PATH = path.join(process.cwd(), 'app', 'local-db', 'local-db.json');
const RANDOM_SEVERITY = ['low', 'medium', 'high'];

export async function GET() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        const issues = JSON.parse(data);
        return NextResponse.json(issues);
    } catch (error) {
        console.error('Error reading DB:', error);
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const newIssue = await req.json();
        if (!newIssue.title || !newIssue.description) {
            return NextResponse.json({ error: 'Missing required fields: title and description are required' }, { status: 400 });
        }

        // Read existing data
        const data = await fs.readFile(DB_PATH, 'utf-8');
        const issues = JSON.parse(data);

        // Append new issue
        issues.push(
            Object.assign(newIssue, {
                id: issues.length + 1,
                title: newIssue.title,
                description: newIssue.description,
                severity: RANDOM_SEVERITY[Math.floor(Math.random() * RANDOM_SEVERITY.length)],
                proposedSolution: newIssue.proposedSolution || '',
                timestamp: new Date().toISOString(),
                emailOrigen: newIssue.emailOrigen || '',
                documentSource: newIssue.documentSource || '',
            })
        );

        // Write back updated issues array
        await fs.writeFile(DB_PATH, JSON.stringify(issues, null, 2));

        return NextResponse.json({ message: 'Issue saved successfully' });
    } catch (error) {
        console.error('Error saving issue:', error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
    // ✅ Clear the local DB (reset the file to an empty array)
}
export async function DELETE() {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify([], null, 2));
        return NextResponse.json({ message: 'Database cleared successfully' });
    } catch (error) {
        console.error('Error clearing DB:', error);
        return NextResponse.json({ error: 'Failed to clear data' }, { status: 500 });
    }
}
