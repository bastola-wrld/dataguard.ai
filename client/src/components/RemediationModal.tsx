'use client';

import { Loader2, Code, Check } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    plan: any;
    onApply: () => void;
    isApplying: boolean;
}

export function RemediationModal({ isOpen, onClose, plan, onApply, isApplying }: Props) {
    if (!isOpen || !plan) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-lg shadow-xl dark:bg-zinc-900 dark:border-zinc-800">
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">AI Remediation Plan</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Review the generated Terraform code before applying.
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="p-4 bg-zinc-50 rounded-md dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-zinc-500 uppercase tracking-wider">
                            <Code className="w-4 h-4" />
                            Generated Terraform
                        </div>
                        <pre className="overflow-x-auto text-sm font-mono text-zinc-800 dark:text-zinc-300">
                            {plan.generatedCode}
                        </pre>
                    </div>

                    <div className="p-4 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-sm">
                        <strong>Explanation:</strong> {plan.explanation}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-200 dark:border-zinc-800">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-md hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onApply}
                        disabled={isApplying}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                        {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Apply Fix
                    </button>
                </div>
            </div>
        </div>
    );
}
