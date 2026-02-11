'use client';
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, CheckCircle, AlertTriangle, Code, Terminal } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface RemediationModalProps {
    isOpen: boolean;
    onClose: () => void;
    vulnerabilityId: string;
    onSuccess: () => void;
}

export default function RemediationModal({ isOpen, onClose, vulnerabilityId, onSuccess }: RemediationModalProps) {
    const [step, setStep] = useState<'ANALYZING' | 'REVIEW' | 'APPLYING' | 'SUCCESS'>('ANALYZING');
    const [plan, setPlan] = useState<any>(null);

    // Auto start when open
    useState(() => {
        if (isOpen) {
            setStep('ANALYZING');
            api.post(`/remediation/plan/${vulnerabilityId}`)
                .then(res => {
                    setPlan(res.data);
                    setStep('REVIEW');
                })
                .catch(() => onClose());
        }
    });

    const handleApply = async () => {
        setStep('APPLYING');
        try {
            await api.post(`/remediation/apply/${vulnerabilityId}`);
            setStep('SUCCESS');
            toast.success('Vulnerability resolved successfully!');
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (e) {
            setStep('REVIEW'); // Simple error handling
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Code className="text-indigo-600" />
                        AI Remediation Engine
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 'ANALYZING' && (
                        <div className="text-center py-10 space-y-4">
                            <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-gray-600 dark:text-gray-300">Analyzing detected vulnerability...</p>
                            <p className="text-sm text-gray-400">Contextualizing with asset configuration</p>
                        </div>
                    )}

                    {step === 'REVIEW' && plan && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                                <p className="text-sm text-blue-800 dark:text-blue-300">{plan.explanation}</p>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-25"></div>
                                <div className="relative bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto border border-gray-700">
                                    <pre>{plan.generatedCode}</pre>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'APPLYING' && (
                        <div className="text-center py-10 space-y-4">
                            <div className="animate-pulse flex justify-center">
                                <Terminal className="w-12 h-12 text-green-500" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">Applying changes via Terraform...</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 max-w-xs mx-auto overflow-hidden">
                                <div className="bg-green-600 h-2.5 rounded-full animate-progress-indeterminate"></div>
                            </div>
                        </div>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="text-center py-10">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Remediation Successful</h4>
                            <p className="text-gray-500 mt-2">Vulnerability has been marked as resolved.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step === 'REVIEW' && (
                    <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-sm flex items-center gap-2"
                        >
                            <CheckCircle size={16} />
                            Approve & Apply
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
