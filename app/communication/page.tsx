'use client';

import useSWR from 'swr';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {postToPolicyChecker} from "@/lib/postToPolicyChecker";
import {useEffect} from "react";

const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' }).then((res) => res.json());

export default function EmailFetcher() {
    //To triggered refresh
    const { data, error, isLoading, mutate } = useSWR('/api/emails', fetcher);
    //To auto-refresh refresh
    // const { data, error, isLoading, mutate } = useSWR('/api/emails', fetcher,{refreshInterval: 10000});
    //To analyze emails with the policy checker
    postToPolicyChecker( process.env.LOCAL_URL??'http://localhost:3000', data?.emails);

    if (isLoading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        );
    }

    if (error) {
        return <div className="p-6 text-red-500">❌ Failed to load emails</div>;
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex flex-row justify-between items-center">
            <h1 className="text-3xl font-bold mb-6">Recent Emails</h1>
            <div className="flex justify-end mb-6">
                <Button variant="secondary" onClick={() => mutate()}>Refresh Now</Button>
            </div>
            </div>
            {!data?.emails || data?.emails?.length === 0 ? (
                <div className="text-gray-500">Oops. No emails found.</div>
            ) : (
                <div className="space-y-6">
                    {data?.emails && data.emails?.map((email: any) => (
                        <Card key={email.id} className="rounded-2xl shadow-lg border border-gray-200">
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-start p-10">
                                    <div>
                                        <p className="text-lg font-semibold">Subject: {email.subject || '(No Subject)'}</p>
                                        <p className="text-sm text-gray-500">
                                            📅 {new Date(email.date).toLocaleString()}
                                        </p>
                                    </div>
                                    <Badge variant="outline">Attachments: {email.attachments}</Badge>
                                </div>

                                <div className="text-sm text-gray-700">
                                    <span className="font-semibold">Email ID:</span> {email.emailId}
                                </div>

                                <div className="text-sm text-gray-700">
                                    <span className="font-semibold">From:</span> {email.from || 'Unknown Sender'}
                                </div>

                                <div className="text-sm text-gray-700">
                                    <span className="font-semibold">To:</span> {email.to || 'Unknown Recipient'}
                                </div>

                                <div className="bg-gray-100 p-4 rounded-lg text-gray-800 text-sm leading-relaxed">
                                    <p className="whitespace-pre-wrap flex-wrap">{email.text || '(No content)'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
