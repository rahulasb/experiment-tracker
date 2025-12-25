// Database types for Research Experiment Tracker

export interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Experiment {
  id: string;
  project_id: string;
  name: string;
  hypothesis: string;
  expected_metrics: Record<string, number | string>;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Run {
  id: string;
  experiment_id: string;
  run_number: number;
  parameters: Record<string, unknown>;
  metrics: Record<string, number>;
  notes: string | null;
  created_at: string;
}

// Types for creating new records (without auto-generated fields)
export interface CreateProject {
  name: string;
  description?: string;
}

export interface CreateExperiment {
  project_id: string;
  name: string;
  hypothesis: string;
  expected_metrics: Record<string, number | string>;
}

export interface CreateRun {
  experiment_id: string;
  parameters: Record<string, unknown>;
  metrics: Record<string, number>;
  notes?: string;
}

// Comparison result type
export interface MetricComparison {
  metric: string;
  runAValue: number;
  runBValue: number;
  percentageDiff: number;
  winner: 'A' | 'B' | 'tie';
}

export interface ComparisonResult {
  runA: Run;
  runB: Run;
  comparisons: MetricComparison[];
}
