'use client';

import { useState, useEffect } from 'react';
import { Shield, Search, Zap, CheckCircle2, AlertTriangle, Cloud, Lock, Server, Loader2 } from 'lucide-react';

interface ProbeStep {
    id: number;
    label: string;
    status: 'idle' | 'probing' | 'vulnerable' | 'secure';
    resource: string;
}

export function SecurityProbe({ onComplete }: { onComplete?: () => void }) {
    const [active, setActive] = useState(false);
    const [steps, setSteps] = useState<ProbeStep[]>([
        { id: 1, label: 'S3 Public Access Check', resource: 'prod-data-bucket', status: 'idle' },
        { id: 2, label: 'EC2 Snapshot Encryption', resource: 'app-server-v1', status: 'idle' },
        { id: 3, label: 'IAM Policy Over-privilege', resource: 'service-role-main', status: 'idle' },
        { id: 4, label: 'RDS Public Availability', resource: 'customer-db-primary', status: 'idle' },
        { id: 5, label: 'Ingress Port Audit (22/3389)', resource: 'vpc-main-security-group', status: 'idle' },
    ]);

    const runProbe = async () => {
        setActive(true);
        setSteps(s => s.map(step => ({ ...step, status: 'idle' })));

        for (let i = 0; i < steps.length; i++) {
            setSteps(s => s.map((step, idx) => idx === i ? { ...step, status: 'probing' } : step));
            await new Promise(r => setTimeout(r, 2000 + Math.random() * 1500));

            const isVulnerable = Math.random() > 0.4;
            setSteps(s => s.map((step, idx) => idx === i ? { ...step, status: isVulnerable ? 'vulnerable' : 'secure' } : step));
        }

        setActive(false);
        if (onComplete) onComplete();
    };

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-8 shadow-sm relative overflow-hidden">
            {active && (
                <div className="absolute top-0 left-0 w-full h-1 bg-zinc-100 dark:bg-zinc-800">
                    <div className="h-full bg-blue-500 animate-progress" />
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <Search className="w-6 h-6 text-blue-500" />
                        Vulnerability Probing
                    </h3>
                    <p className="text-zinc-500 text-sm mt-1">Active heuristic analysis of cloud resources.</p>
                </div>
                <button
                    onClick={runProbe}
                    disabled={active}
                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                    {active ? <Zap className="w-4 h-4 animate-pulse" /> : <PlayIcon className="w-4 h-4" />}
                    {active ? 'PROBING...' : 'START PROBE'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`p-4 rounded-2xl border transition-all duration-500 ${step.status === 'probing' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 scale-[1.02]' :
                            step.status === 'vulnerable' ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10' :
                                step.status === 'secure' ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' :
                                    'border-zinc-100 dark:border-zinc-800 text-zinc-400'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
                                {step.id % 2 === 0 ? <Cloud className="w-4 h-4" /> : <Server className="w-4 h-4" />}
                            </div>
                            <div>
                                {step.status === 'probing' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                                {step.status === 'secure' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                {step.status === 'vulnerable' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                {step.status === 'idle' && <Lock className="w-4 h-4" />}
                            </div>
                        </div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">{step.resource}</p>
                        <p className={`font-semibold text-sm ${step.status !== 'idle' ? 'text-zinc-900 dark:text-white' : ''}`}>{step.label}</p>
                    </div>
                ))}
            </div>

            <style jsx>{`
        @keyframes progress {
          from { width: 0; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress 20s linear infinite;
        }
      `}</style>
        </div>
    );
}

function PlayIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
    );
}
