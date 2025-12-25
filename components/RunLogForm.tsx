'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CreateRun, Run } from '@/types/database';

interface RunLogFormProps {
    experimentId: string;
    currentRunCount: number;
    onSuccess: (run: Run) => void;
    onCancel: () => void;
}

export default function RunLogForm({ experimentId, currentRunCount, onSuccess, onCancel }: RunLogFormProps) {
    const [parameters, setParameters] = useState('{\n  "learning_rate": 0.001,\n  "epochs": 100\n}');
    const [metrics, setMetrics] = useState('{\n  "accuracy": 0.0,\n  "loss": 0.0\n}');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateJson = (str: string): { valid: boolean; parsed?: unknown; error?: string } => {
        try {
            const parsed = JSON.parse(str);
            return { valid: true, parsed };
        } catch (e) {
            return { valid: false, error: e instanceof Error ? e.message : 'Invalid JSON' };
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const paramsValidation = validateJson(parameters);
        const metricsValidation = validateJson(metrics);

        if (!paramsValidation.valid) {
            setError(`Parameters: ${paramsValidation.error}`);
            return;
        }
        if (!metricsValidation.valid) {
            setError(`Metrics: ${metricsValidation.error}`);
            return;
        }

        setLoading(true);

        try {
            const runData: CreateRun = {
                experiment_id: experimentId,
                parameters: paramsValidation.parsed as Record<string, unknown>,
                metrics: metricsValidation.parsed as Record<string, number>,
                notes: notes.trim() || undefined,
            };

            const runNumber = currentRunCount + 1;

            const { data, error: supabaseError } = await supabase
                .from('runs')
                .insert([{ ...runData, run_number: runNumber }])
                .select()
                .single();

            if (supabaseError) throw supabaseError;

            onSuccess(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to log run');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#111111] rounded-2xl border border-neutral-800/50 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-800/50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-neutral-100">Log New Run</h3>
                        <p className="text-sm text-neutral-500">Run #{currentRunCount + 1}</p>
                    </div>
                </div>
                <button
                    onClick={onCancel}
                    className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                        Parameters (JSON) *
                    </label>
                    <textarea
                        value={parameters}
                        onChange={(e) => setParameters(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-xl font-mono text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-all resize-none"
                        placeholder='{"learning_rate": 0.001}'
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                        Metrics (JSON) *
                    </label>
                    <textarea
                        value={metrics}
                        onChange={(e) => setMetrics(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-xl font-mono text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-all resize-none"
                        placeholder='{"accuracy": 0.95}'
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                        Notes (optional)
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-xl text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-all resize-none"
                        placeholder="Any observations or notes about this run..."
                    />
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-sm font-mono">
                        {error}
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 rounded-xl border border-neutral-800 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-300 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-3 rounded-xl bg-neutral-100 text-neutral-900 font-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? 'Logging...' : 'Log Run'}
                    </button>
                </div>
            </form>
        </div>
    );
}
