'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Project, Experiment } from '@/types/database';
import ExperimentCard from '@/components/ExperimentCard';

interface ProjectPageProps {
    params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
    const { id } = use(params);
    const [project, setProject] = useState<Project | null>(null);
    const [experiments, setExperiments] = useState<Experiment[]>([]);
    const [runCounts, setRunCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: projectData, error: projectError } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (projectError) throw projectError;
                setProject(projectData);

                const { data: experimentsData, error: experimentsError } = await supabase
                    .from('experiments')
                    .select('*')
                    .eq('project_id', id)
                    .order('created_at', { ascending: false });

                if (experimentsError) throw experimentsError;
                setExperiments(experimentsData || []);

                if (experimentsData && experimentsData.length > 0) {
                    const counts: Record<string, number> = {};
                    for (const exp of experimentsData) {
                        const { count } = await supabase
                            .from('runs')
                            .select('*', { count: 'exact', head: true })
                            .eq('experiment_id', exp.id);
                        counts[exp.id] = count || 0;
                    }
                    setRunCounts(counts);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-neutral-400 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error || 'Project not found'}</p>
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
                    <span className="text-neutral-300">{project.name}</span>
                </div>

                {/* Project Header */}
                <div className="bg-[#111111] rounded-2xl border border-neutral-800/50 p-8 mb-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-neutral-800/50 flex items-center justify-center border border-neutral-700/30">
                                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-neutral-100 mb-2">{project.name}</h1>
                                <p className="text-neutral-500 max-w-2xl">
                                    {project.description || 'No description provided'}
                                </p>
                                <div className="flex items-center gap-4 mt-4 text-sm text-neutral-600">
                                    <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                                    <span className="w-1 h-1 rounded-full bg-neutral-700"></span>
                                    <span>{experiments.length} experiments</span>
                                </div>
                            </div>
                        </div>

                        <Link
                            href={`/projects/${id}/experiments/new`}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-100 text-neutral-900 font-medium hover:bg-white transition-all whitespace-nowrap"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Experiment
                        </Link>
                    </div>
                </div>

                {/* Experiments Grid */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-neutral-100 mb-6">Experiments</h2>

                    {experiments.length === 0 ? (
                        <div className="text-center py-16 bg-[#111111] rounded-2xl border border-neutral-800/50">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-800/50 flex items-center justify-center">
                                <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <p className="text-neutral-500 mb-4">No experiments yet</p>
                            <Link
                                href={`/projects/${id}/experiments/new`}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create your first experiment
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {experiments.map((experiment) => (
                                <ExperimentCard
                                    key={experiment.id}
                                    experiment={experiment}
                                    runCount={runCounts[experiment.id] || 0}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
