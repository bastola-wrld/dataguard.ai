'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your account...');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setStatus('error');
            setMessage('No verification token provided.');
            return;
        }

        const verifyToken = async () => {
            try {
                const res = await fetch('http://localhost:4000/auth/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (res.ok) {
                    setStatus('success');
                    setMessage(data.message || 'Verification successful!');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Verification failed.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('An error occurred during verification.');
            }
        };

        verifyToken();
    }, [searchParams]);

    return (
        <div className="text-center space-y-6">
            <div className="flex justify-center">
                {status === 'loading' && <Loader2 className="w-16 h-16 animate-spin text-zinc-400" />}
                {status === 'success' && <CheckCircle className="w-16 h-16 text-green-500" />}
                {status === 'error' && <XCircle className="w-16 h-16 text-red-500" />}
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
                {status === 'loading' ? 'Verifying...' : status === 'success' ? 'Verified!' : 'Verification Failed'}
            </h1>

            <p className="text-zinc-400 text-lg max-w-sm mx-auto">
                {message}
            </p>

            {status !== 'loading' && (
                <div className="pt-8">
                    <Link href="/" className="inline-flex items-center justify-center py-3 px-8 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-all">
                        {status === 'success' ? 'Go to Login' : 'Try Again'}
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function VerifyPage() {
    return (
        <div className="flex min-h-screen bg-black items-center justify-center p-8">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#333,transparent)]" />
            </div>

            <Suspense fallback={<Loader2 className="w-16 h-16 animate-spin text-zinc-400" />}>
                <VerifyContent />
            </Suspense>
        </div>
    );
}
