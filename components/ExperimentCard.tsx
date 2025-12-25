'use client';

import Link from 'next/link';
import { Experiment } from '@/types/database';

interface ExperimentCardProps {
    experiment: Experiment;
    runCount?: number;
}

const statusColors = {
    active: 'bg-emerald-950/50 border-emerald-900/50 text-emerald-400',
    completed: 'bg-blue-950/50 border-blue-900/50 text-blue-400',
    archived: 'bg-neutral-800/50 border-neutral-700/50 text-neutral-400',
};

export default function ExperimentCard({ experiment, runCount = 0 }: ExperimentCardProps) {
    return (
        <Link href={`/experiments/${experiment.id}`}>
            <div className="group relative bg-[#111111] rounded-xl border border-neutral-800/50 p-5 hover:border-neutral-700 transition-all duration-300 hover:bg-[#141414] cursor-pointer">
                <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-neutral-800/50 flex items-center justify-center">
                                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[experiment.status]}`}>
                                {experiment.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-800/30 border border-neutral-700/30">
                            <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-xs font-medium text-neutral-400">{runCount} runs</span>
                        </div>
                    </div>

                    <h4 className="text-base font-semibold text-neutral-100 mb-2 group-hover:text-white transition-colors">
                        {experiment.name}
                    </h4>

                    <p className="text-sm text-neutral-500 line-clamp-2 mb-3">
                        <span className="text-neutral-600">Hypothesis:</span> {experiment.hypothesis}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                        {Object.entries(experiment.expected_metrics).slice(0, 3).map(([key, value]) => (
                            <span key={key} className="px-2 py-1 rounded-md bg-neutral-800/30 border border-neutral-700/30 text-xs text-neutral-400">
                                {key}: <span className="text-neutral-300">{String(value)}</span>
                            </span>
                        ))}
                        {Object.keys(experiment.expected_metrics).length > 3 && (
                            <span className="px-2 py-1 rounded-md bg-neutral-800/30 border border-neutral-700/30 text-xs text-neutral-600">
                                +{Object.keys(experiment.expected_metrics).length - 3} more
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-800/30">
                        <span className="text-xs text-neutral-600">
                            {new Date(experiment.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-1 text-neutral-400 text-sm font-medium group-hover:text-neutral-300 transition-colors">
                            View
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
