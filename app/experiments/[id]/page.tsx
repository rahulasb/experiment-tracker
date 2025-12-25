'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Experiment, Run } from '@/types/database';
import MetricsChart from '@/components/MetricsChart';
import RunLogForm from '@/components/RunLogForm';
import CSVUpload from '@/components/CSVUpload';
import RunComparison from '@/components/RunComparison';

interface ExperimentPageProps {
    params: Promise<{ id: string }>;
}

const statusColors = {
    active: 'bg-emerald-950/50 border-emerald-900/50 text-emerald-400',
    completed: 'bg-blue-950/50 border-blue-900/50 text-blue-400',
    archived: 'bg-neutral-800/50 border-neutral-700/50 text-neutral-400',
};

export default function ExperimentPage({ params }: ExperimentPageProps) {
    const { id } = use(params);
    const [experiment, setExperiment] = useState<Experiment | null>(null);
    const [runs, setRuns] = useState<Run[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showRunForm, setShowRunForm] = useState(false);
    const [activeTab, setActiveTab] = useState<'runs' | 'chart' | 'compare'>('runs');

    const fetchData = async () => {
        try {
            const { data: experimentData, error: experimentError } = await supabase
                .from('experiments')
                .select('*')
                .eq('id', id)
                .single();

            if (experimentError) throw experimentError;
            setExperiment(experimentData);

            const { data: runsData, error: runsError } = await supabase
                .from('runs')
                .select('*')
                .eq('experiment_id', id)
                .order('run_number', { ascending: true });

            if (runsError) throw runsError;
            setRuns(runsData || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleRunSuccess = (newRun: Run) => {
        setRuns((prev) => [...prev, newRun].sort((a, b) => a.run_number - b.run_number));
        setShowRunForm(false);
    };

    const handleCSVSuccess = (newRuns: Run[]) => {
        setRuns((prev) => [...prev, ...newRuns].sort((a, b) => a.run_number - b.run_number));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-neutral-400 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error || !experiment) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error || 'Experiment not found'}</p>
                    <Link href="/" className="text-neutral-400 hover:text-neutral-200">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
                    <Link href="/" className="hover:text-neutral-300 transition-colors">
                        Dashboard
                    </Link>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <Link href={`/projects/${experiment.project_id}`} className="hover:text-neutral-300 transition-colors">
                        Project
                    </Link>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-neutral-300">{experiment.name}</span>
                </div>

                {/* Experiment Header */}
                <div className="bg-[#111111] rounded-2xl border border-neutral-800/50 p-8 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-neutral-800/50 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-neutral-100">{experiment.name}</h1>
                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[experiment.status]}`}>
                                        {experiment.status}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-neutral-500 mb-2">Hypothesis</h3>
                                <p className="text-neutral-300 bg-[#0a0a0a] rounded-xl p-4 border border-neutral-800">
                                    {experiment.hypothesis}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-neutral-500 mb-2">Expected Metrics</h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(experiment.expected_metrics).map(([key, value]) => (
                                        <span key={key} className="px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-neutral-800 text-sm">
                                            <span className="text-neutral-500">{key}:</span>{' '}
                                            <span className="text-neutral-200 font-medium">{String(value)}</span>
                                        </span>
                                    ))}
                                    {Object.keys(experiment.expected_metrics).length === 0 && (
                                        <span className="text-neutral-600 text-sm">No expected metrics defined</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => setShowRunForm(true)}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-100 text-neutral-900 font-medium hover:bg-white transition-all whitespace-nowrap"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Log Run
                            </button>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800/30 border border-neutral-800">
                                <span className="text-neutral-500 text-sm">Runs:</span>
                                <span className="text-neutral-200 font-semibold">{runs.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Run Form */}
                {showRunForm && (
                    <div className="mb-8">
                        <RunLogForm
                            experimentId={id}
                            currentRunCount={runs.length}
                            onSuccess={handleRunSuccess}
                            onCancel={() => setShowRunForm(false)}
                        />
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {[
                        { key: 'runs', label: 'Runs', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                        { key: 'chart', label: 'Chart', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
                        { key: 'compare', label: 'Compare', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as typeof activeTab)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.key
                                    ? 'bg-neutral-800 text-neutral-100'
                                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                            </svg>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {activeTab === 'runs' && (
                            <div className="space-y-4">
                                {runs.length === 0 ? (
                                    <div className="text-center py-16 bg-[#111111] rounded-2xl border border-neutral-800/50">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-800/50 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <p className="text-neutral-500 mb-4">No runs logged yet</p>
                                        <button
                                            onClick={() => setShowRunForm(true)}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
                                        >
                                            Log your first run
                                        </button>
                                    </div>
                                ) : (
                                    runs.map((run) => (
                                        <div
                                            key={run.id}
                                            className="bg-[#111111] rounded-xl border border-neutral-800/50 p-5"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-neutral-800/50 flex items-center justify-center">
                                                        <span className="text-sm font-bold text-neutral-300">#{run.run_number}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-neutral-100">Run {run.run_number}</h4>
                                                        <p className="text-xs text-neutral-600">
                                                            {new Date(run.created_at).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h5 className="text-xs font-medium text-neutral-500 mb-2 uppercase tracking-wider">Parameters</h5>
                                                    <div className="bg-[#0a0a0a] rounded-lg p-3 font-mono text-xs text-neutral-400 overflow-x-auto border border-neutral-800">
                                                        <pre>{JSON.stringify(run.parameters, null, 2)}</pre>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h5 className="text-xs font-medium text-neutral-500 mb-2 uppercase tracking-wider">Metrics</h5>
                                                    <div className="bg-[#0a0a0a] rounded-lg p-3 border border-neutral-800">
                                                        <div className="flex flex-wrap gap-2">
                                                            {Object.entries(run.metrics).map(([key, value]) => (
                                                                <span key={key} className="px-2 py-1 rounded bg-neutral-800/50 border border-neutral-700/50 text-xs">
                                                                    <span className="text-neutral-500">{key}:</span>{' '}
                                                                    <span className="text-neutral-200 font-medium">{typeof value === 'number' ? value.toFixed(4) : value}</span>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {run.notes && (
                                                <div className="mt-4 pt-4 border-t border-neutral-800">
                                                    <p className="text-sm text-neutral-500">{run.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'chart' && <MetricsChart runs={runs} />}

                        {activeTab === 'compare' && <RunComparison runs={runs} />}
                    </div>

                    {/* Sidebar Tools */}
                    <div className="space-y-6">
                        <CSVUpload
                            experimentId={id}
                            currentRunCount={runs.length}
                            onSuccess={handleCSVSuccess}
                        />

                        {/* Quick Stats */}
                        <div className="bg-[#111111] rounded-xl border border-neutral-800/50 p-5">
                            <h4 className="text-base font-semibold text-neutral-100 mb-4">Quick Stats</h4>
                            {runs.length > 0 ? (
                                <div className="space-y-3">
                                    {Object.keys(runs[0].metrics).slice(0, 4).map((metric) => {
                                        const values = runs.map((r) => r.metrics[metric] || 0);
                                        const latest = values[values.length - 1];
                                        const best = Math.max(...values);
                                        const avg = values.reduce((a, b) => a + b, 0) / values.length;

                                        return (
                                            <div key={metric} className="p-3 rounded-lg bg-[#0a0a0a] border border-neutral-800">
                                                <div className="text-sm font-medium text-neutral-300 mb-2">{metric}</div>
                                                <div className="grid grid-cols-3 gap-2 text-xs">
                                                    <div>
                                                        <span className="text-neutral-600">Latest</span>
                                                        <div className="text-neutral-300 font-medium">{latest.toFixed(3)}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-neutral-600">Best</span>
                                                        <div className="text-emerald-400 font-medium">{best.toFixed(3)}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-neutral-600">Avg</span>
                                                        <div className="text-neutral-400 font-medium">{avg.toFixed(3)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-neutral-600 text-sm">No data available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
