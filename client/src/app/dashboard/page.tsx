'use client';

import { AppShell } from '@/components/layout/AppShell';
import { InfraGraph } from '@/components/dashboard/InfraGraph';
import { VulnerabilityFeed } from '@/components/dashboard/VulnerabilityFeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function Dashboard() {
    const { data: assets, mutate: mutateAssets } = useSWR('/assets', fetcher);
    const { mutate: mutateVulns } = useSWR('/vulnerabilities', fetcher);
    const [scanning, setScanning] = useState(false);

    const handleScan = async () => {
        setScanning(true);
        try {
            // Trigger scan
            await api.post('/assets/scan');
            // Then generate mock findings for demo
            await api.post('/vulnerabilities/generate-mock');

            await mutateAssets();
            await mutateVulns();
        } finally {
            setScanning(false);
        }
    };

    return (
        <AppShell>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <button
                    onClick={handleScan}
                    disabled={scanning}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors disabled:opacity-50"
                >
                    {scanning ? 'Scanning...' : 'Trigger Cloud Scan'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Graph Area */}
                <Card className="lg:col-span-2 min-h-[500px]">
                    <CardHeader>
                        <CardTitle>Infrastructure Map</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[450px]">
                        <InfraGraph assets={assets || []} />
                    </CardContent>
                </Card>

                {/* Vulnerability Feed */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Live Risks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <VulnerabilityFeed />
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
