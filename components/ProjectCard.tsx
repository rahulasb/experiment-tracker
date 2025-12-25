'use client';

import Link from 'next/link';
import { Project } from '@/types/database';

interface ProjectCardProps {
    project: Project;
    experimentCount?: number;
}

export default function ProjectCard({ project, experimentCount = 0 }: ProjectCardProps) {
    return (
        <Link href={`/projects/${project.id}`}>
            <div className="group relative bg-[#111111] rounded-2xl border border-neutral-800/50 p-6 hover:border-neutral-700 transition-all duration-300 hover:bg-[#141414] cursor-pointer">
                <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-neutral-800/50 flex items-center justify-center border border-neutral-700/30 group-hover:border-neutral-600/50 transition-colors">
                            <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/50 border border-neutral-700/30">
                            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            <span className="text-sm font-medium text-neutral-300">{experimentCount}</span>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-neutral-100 mb-2 group-hover:text-white transition-colors">
                        {project.name}
                    </h3>

                    <p className="text-sm text-neutral-500 line-clamp-2 mb-4">
                        {project.description || 'No description provided'}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-800/50">
                        <span className="text-xs text-neutral-600">
                            Created {new Date(project.created_at).toLocaleDateString()}
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
