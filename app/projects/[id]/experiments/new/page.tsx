'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface NewExperimentPageProps {
    params: Promise<{ id: string }>;
}

export default function NewExperimentPage({ params }: NewExperimentPageProps) {
    const { id: projectId } = use(params);
    const router = useRouter();
    const [name, setName] = useState('');
    const [hypothesis, setHypothesis] = useState('');
    const [metricsInput, setMetricsInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddMetric = () => {
        setMetricsInput((prev) => {
            const lines = prev.trim().split('\n').filter(Boolean);
            lines.push('metric_name: target_value');
            return lines.join('\n');
        });
    };

    const parseMetrics = (input: string): Record<string, number | string> => {
        const metrics: Record<string, number | string> = {};
        const lines = input.trim().split('\n').filter(Boolean);

        for (const line of lines) {
            const [key, ...valueParts] = line.split(':');
            const trimmedKey = key?.trim();
            const value = valueParts.join(':').trim();

            if (trimmedKey && value) {
                const numValue = parseFloat(value);
                metrics[trimmedKey] = isNaN(numValue) ? value : numValue;
            }
        }

        return metrics;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const expectedMetrics = parseMetrics(metricsInput);

            const { error: supabaseError } = await supabase
                .from('experiments')
                .insert([{
                    project_id: projectId,
                    name: name.trim(),
                    hypothesis: hypothesis.trim(),
                    expected_metrics: expectedMetrics,
                    status: 'active',
                }]);

            if (supabaseError) throw supabaseError;

            router.push(`/projects/${projectId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create experiment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
                    <Link href="/" className="hover:text-neutral-300 transition-colors">
                        Dashboard
                    </Link>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <Link href={`/projects/${projectId}`} className="hover:text-neutral-300 transition-colors">
                        Project
                    </Link>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-neutral-300">New Experiment</span>
                </div>

                {/* Form Card */}
                <div className="bg-[#111111] rounded-2xl border border-neutral-800/50 p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-neutral-800/50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-100">Create New Experiment</h1>
                            <p className="text-neutral-500">Define your hypothesis and expected metrics</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-neutral-400 mb-2">
                                Experiment Name *
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Learning Rate Optimization v2"
                                className="w-full px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-xl text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="hypothesis" className="block text-sm font-medium text-neutral-400 mb-2">
                                Hypothesis *
                            </label>
                            <textarea
                                id="hypothesis"
                                value={hypothesis}
                                onChange={(e) => setHypothesis(e.target.value)}
                                placeholder="Describe what you expect to happen and why. For example: 'Reducing the learning rate from 0.01 to 0.001 should reduce overfitting and improve validation accuracy by 5-10%.'"
                                rows={4}
                                className="w-full px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-xl text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-all resize-none"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="metrics" className="block text-sm font-medium text-neutral-400">
                                    Expected Metrics
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddMetric}
                                    className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
                                >
                                    + Add Metric
                                </button>
                            </div>
                            <textarea
                                id="metrics"
                                value={metricsInput}
                                onChange={(e) => setMetricsInput(e.target.value)}
                                placeholder="Define expected metrics (one per line):
accuracy: 0.95
loss: 0.05
f1_score: 0.90"
                                rows={4}
                                className="w-full px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-xl font-mono text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-all resize-none"
                            />
                            <p className="mt-2 text-xs text-neutral-600">
                                Format: metric_name: target_value (one per line)
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <Link
                                href={`/projects/${projectId}`}
                                className="flex-1 px-4 py-3 rounded-xl border border-neutral-800 text-neutral-400 text-center hover:bg-neutral-800/50 hover:text-neutral-300 transition-colors font-medium"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading || !name.trim() || !hypothesis.trim()}
                                className="flex-1 px-4 py-3 rounded-xl bg-neutral-100 text-neutral-900 font-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? 'Creating...' : 'Create Experiment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
