'use client';

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { supabase } from '@/lib/supabase';
import { Run } from '@/types/database';

interface CSVUploadProps {
    experimentId: string;
    currentRunCount: number;
    onSuccess: (runs: Run[]) => void;
}

interface ParsedRow {
    parameters: Record<string, unknown>;
    metrics: Record<string, number>;
    notes?: string;
}

export default function CSVUpload({ experimentId, currentRunCount, onSuccess }: CSVUploadProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<ParsedRow[] | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setError(null);
        setPreview(null);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    const parsedRows: ParsedRow[] = results.data.map((row: unknown) => {
                        const typedRow = row as Record<string, string>;

                        let parameters: Record<string, unknown> = {};
                        if (typedRow.parameters) {
                            try {
                                parameters = JSON.parse(typedRow.parameters);
                            } catch {
                                parameters = { raw: typedRow.parameters };
                            }
                        }

                        let metrics: Record<string, number> = {};
                        if (typedRow.metrics) {
                            try {
                                metrics = JSON.parse(typedRow.metrics);
                            } catch {
                                metrics = { value: parseFloat(typedRow.metrics) || 0 };
                            }
                        }

                        Object.keys(typedRow).forEach((key) => {
                            if (!['parameters', 'metrics', 'notes'].includes(key.toLowerCase())) {
                                const value = parseFloat(typedRow[key]);
                                if (!isNaN(value)) {
                                    metrics[key] = value;
                                } else if (typedRow[key]) {
                                    parameters[key] = typedRow[key];
                                }
                            }
                        });

                        return {
                            parameters,
                            metrics,
                            notes: typedRow.notes || undefined,
                        };
                    });

                    setPreview(parsedRows);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to parse CSV');
                }
            },
            error: (err) => {
                setError(err.message);
            },
        });
    };

    const handleUpload = async () => {
        if (!preview || preview.length === 0) return;

        setLoading(true);
        setError(null);

        try {
            const runsToInsert = preview.map((row, index) => ({
                experiment_id: experimentId,
                run_number: currentRunCount + index + 1,
                parameters: row.parameters,
                metrics: row.metrics,
                notes: row.notes,
            }));

            const { data, error: supabaseError } = await supabase
                .from('runs')
                .insert(runsToInsert)
                .select();

            if (supabaseError) throw supabaseError;

            onSuccess(data);
            setPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload runs');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-[#111111] rounded-xl border border-neutral-800/50 p-5">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-800/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>
                <div>
                    <h4 className="text-base font-semibold text-neutral-100">Upload CSV</h4>
                    <p className="text-xs text-neutral-500">Bulk import runs from a CSV file</p>
                </div>
            </div>

            {!preview ? (
                <div>
                    <label className="block">
                        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors cursor-pointer bg-[#0a0a0a]">
                            <div className="text-center">
                                <svg className="w-8 h-8 mx-auto mb-2 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-sm text-neutral-500">Click to upload CSV</p>
                                <p className="text-xs text-neutral-600 mt-1">Columns: parameters, metrics, notes</p>
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>
            ) : (
                <div>
                    <div className="mb-4 p-3 rounded-lg bg-[#0a0a0a] border border-neutral-800">
                        <p className="text-sm text-neutral-300 mb-2">
                            <span className="font-medium text-neutral-100">{preview.length}</span> rows ready to import
                        </p>
                        <div className="max-h-40 overflow-y-auto text-xs font-mono text-neutral-500 space-y-1">
                            {preview.slice(0, 5).map((row, i) => (
                                <div key={i} className="truncate">
                                    Run {currentRunCount + i + 1}: {Object.keys(row.metrics).join(', ')}
                                </div>
                            ))}
                            {preview.length > 5 && (
                                <div className="text-neutral-600">...and {preview.length - 5} more</div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-3 py-2 rounded-lg border border-neutral-800 text-neutral-400 hover:bg-neutral-800/50 transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={loading}
                            className="flex-1 px-3 py-2 rounded-lg bg-neutral-100 text-neutral-900 text-sm font-medium hover:bg-white disabled:opacity-50 transition-all"
                        >
                            {loading ? 'Uploading...' : 'Import Runs'}
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-3 p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-sm">
                    {error}
                </div>
            )}
        </div>
    );
}
