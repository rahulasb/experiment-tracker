'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types/database';
import { useAuth } from '@/components/AuthProvider';
import LandingPage from '@/components/LandingPage';
import ProjectCard from '@/components/ProjectCard';
import CreateProjectModal from '@/components/CreateProjectModal';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [experimentCounts, setExperimentCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = async () => {
    if (!user) return;

    try {
      const { data, error: supabaseError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      setProjects(data || []);

      if (data && data.length > 0) {
        const counts: Record<string, number> = {};
        for (const project of data) {
          const { count } = await supabase
            .from('experiments')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', project.id);
          counts[project.id] = count || 0;
        }
        setExperimentCounts(counts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    setExperimentCounts((prev) => ({ ...prev, [newProject.id]: 0 }));
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-neutral-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section - Pure Black */}
      <div className="relative overflow-hidden border-b border-neutral-800/30">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/20 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-100">
              Research Dashboard
            </h1>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
              Track your research projects, log experiments, and visualize metric trends all in one place.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
            <div className="bg-[#111111] rounded-2xl border border-neutral-800/50 p-6 text-center">
              <div className="text-3xl font-bold text-neutral-200 mb-1">{projects.length}</div>
              <div className="text-sm text-neutral-500">Projects</div>
            </div>
            <div className="bg-[#111111] rounded-2xl border border-neutral-800/50 p-6 text-center">
              <div className="text-3xl font-bold text-neutral-200 mb-1">
                {Object.values(experimentCounts).reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-sm text-neutral-500">Experiments</div>
            </div>
            <div className="bg-[#111111] rounded-2xl border border-neutral-800/50 p-6 text-center">
              <div className="text-3xl font-bold text-neutral-200 mb-1">∞</div>
              <div className="text-sm text-neutral-500">Possibilities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section - Slightly Lighter Black Variant */}
      <div className="bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-neutral-100">Your Projects</h2>
              <p className="text-neutral-500 mt-1">Manage and track your research initiatives</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-100 text-neutral-900 font-medium hover:bg-white transition-all hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Project
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#141414] rounded-2xl border border-neutral-800/50 p-6 animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-neutral-800"></div>
                    <div className="w-16 h-6 rounded-full bg-neutral-800"></div>
                  </div>
                  <div className="h-6 bg-neutral-800 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-neutral-800 rounded w-full mb-4"></div>
                  <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-800/50 flex items-center justify-center">
                <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-neutral-400 mb-2">{error}</p>
              <p className="text-neutral-600 text-sm">Make sure Supabase is configured correctly.</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-neutral-800/50 flex items-center justify-center border border-neutral-700/30">
                <svg className="w-10 h-10 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-200 mb-2">No projects yet</h3>
              <p className="text-neutral-500 mb-6">Create your first project to start tracking experiments</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-100 text-neutral-900 font-medium hover:bg-white transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  experimentCount={experimentCounts[project.id] || 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProjectCreated}
        userId={user.id}
      />
    </div>
  );
}
