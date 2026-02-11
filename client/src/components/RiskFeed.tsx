'use client';

import { useEffect, useState, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { socket } from '../lib/socket';

interface Log {
    timestamp: string;
    message: string;
}

export function RiskFeed() {
    const [logs, setLogs] = useState<Log[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.on('log', (log: Log) => {
            setLogs((prev) => [...prev, log].slice(-50)); // Keep last 50
        });

        return () => {
            socket.off('log');
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="flex flex-col h-full bg-black rounded-lg border border-zinc-800 overflow-hidden">
            <div className="flex items-center gap-2 p-3 bg-zinc-900 border-b border-zinc-800">
                <Terminal className="w-4 h-4 text-green-500" />
                <span className="text-xs font-mono text-zinc-400">Real-time Risk Feed</span>
            </div>
            <div
                ref={scrollRef}
                className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 bg-black/90"
            >
                {logs.length === 0 && (
                    <div className="text-zinc-600 italic">Waiting for event stream...</div>
                )}
                {logs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                        <span className="text-zinc-500 shrink-0">
                            [{new Date(log.timestamp).toLocaleTimeString()}]
                        </span>
                        <span className="text-green-400">{log.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
