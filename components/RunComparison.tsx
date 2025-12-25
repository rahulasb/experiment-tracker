'use client';

import { useState } from 'react';
import { Run } from '@/types/database';
import { compareRuns, formatPercentage, ComparisonResult } from '@/lib/compareRuns';

interface RunComparisonProps {
    runs: Run[];
}

export default function RunComparison({ runs }: RunComparisonProps) {
    const [runAId, setRunAId] = useState<string>('');
    const [runBId, setRunBId] = useState<string>('');
    const [comparison, setComparison] = useState<ComparisonResult | null>(null);

    const handleCompare = () => {
        const runA = runs.find((r) => r.id === runAId);
        const runB = runs.find((r) => r.id === runBId);

        if (runA && runB) {
            setComparison(compareRuns(runA, runB));
        }
    };

    if (runs.length < 2) {
        return (
            <div className="bg-[#111111] rounded-xl border border-neutral-800/50 p-5 text-center">
                <p className="text-neutral-500 text-sm">Need at least 2 runs to compare</p>
            </div>
        );
    }

    return (
        <div className="bg-[#111111] rounded-xl border border-neutral-800/50 p-5">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-800/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <div>
                    <h4 className="text-base font-semibold text-neutral-100">Compare Runs</h4>
                    <p className="text-xs text-neutral-500">Analyze performance differences</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1.5">Run A</label>
                    <select
                        value={runAId}
                        onChange={(e) => setRunAId(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0a0a0a] border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-neutral-600"
                    >
                        <option value="">Select run...</option>
                        {runs.map((run) => (
                            <option key={run.id} value={run.id} disabled={run.id === runBId}>
                                Run #{run.run_number}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1.5">Run B</label>
                    <select
                        value={runBId}
                        onChange={(e) => setRunBId(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0a0a0a] border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-neutral-600"
                    >
                        <option value="">Select run...</option>
                        {runs.map((run) => (
                            <option key={run.id} value={run.id} disabled={run.id === runAId}>
                                Run #{run.run_number}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                onClick={handleCompare}
                disabled={!runAId || !runBId}
                className="w-full px-4 py-2 rounded-lg bg-neutral-100 text-neutral-900 text-sm font-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                Compare Runs
            </button>

            {comparison && (
                <div className="mt-4 space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-xs font-medium text-neutral-500 px-2">
                        <span>Metric</span>
                        <span className="text-center">Run A → Run B</span>
                        <span className="text-right">Winner</span>
                    </div>
                    {comparison.comparisons.map((c) => (
                        <div
                            key={c.metric}
                            className="grid grid-cols-3 gap-2 items-center p-3 rounded-lg bg-[#0a0a0a] border border-neutral-800"
                        >
                            <span className="text-sm font-medium text-neutral-300 truncate">{c.metric}</span>
                            <div className="text-center">
                                <span className="text-neutral-500">{c.runAValue.toFixed(3)}</span>
                                <span className="text-neutral-600 mx-2">→</span>
                                <span className="text-neutral-300">{c.runBValue.toFixed(3)}</span>
                                <span
                                    className={`ml-2 text-xs font-medium ${c.percentageDiff > 0 ? 'text-emerald-400' : c.percentageDiff < 0 ? 'text-red-400' : 'text-neutral-500'
                                        }`}
                                >
                                    ({formatPercentage(c.percentageDiff)})
                                </span>
                            </div>
                            <div className="text-right">
                                {c.winner === 'tie' ? (
                                    <span className="px-2 py-1 rounded-full bg-neutral-800 text-neutral-500 text-xs">Tie</span>
                                ) : (
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${c.winner === 'A'
                                                ? 'bg-neutral-700/50 text-neutral-300'
                                                : 'bg-emerald-950/50 text-emerald-400'
                                            }`}
                                    >
                                        Run {c.winner} ✓
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
