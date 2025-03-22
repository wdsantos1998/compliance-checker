// components/EmailFetcher.tsx
'use client';

import useSWR from 'swr';
import {useEffect} from "react";
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' }).then((res) => res.json());

export default function EmailFetcher() {
    const { data, error, isLoading } = useSWR('/api/emails', fetcher, { refreshInterval: 5000 });

    useEffect(() => {
        console.log('Data:', data);
    }, [data]);

    if (isLoading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    if (error) {
        return <div className="p-6 text-red-500">Failed to load emails</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6">📧 Recent Emails (auto-refresh every 5s)</h1>
            {data?.emails?.length === 0 ? (
                <div>No emails found.</div>
            ) : (
                <div className="space-y-4">
                    {data?.emails?.map((email: any) => (
                        <Card key={email.id} className="shadow-md rounded-2xl p-4">
                            <CardContent className="space-y-2">
                                <div className="text-sm text-gray-500">
                                    From: <span className="font-medium">{email.from || 'Unknown Sender'}</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Subject: <span className="font-medium">{email.subject || '(No Subject)'}</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Date: <span className="font-medium">{new Date(email.date).toLocaleString()}</span>
                                </div>
                                <p className="text-gray-700">{email.snippet}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            <div className="mt-6">
                <Button onClick={() => window.location.reload()}>Refresh Now</Button>
            </div>
        </div>
    );
}
