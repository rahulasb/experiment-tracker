import { Run, MetricComparison, ComparisonResult } from '@/types/database';

// Re-export types for convenience
export type { ComparisonResult, MetricComparison };

/**
 * Compare two experiment runs and calculate percentage differences for all metrics.
 * Returns comparison results with winner highlighting.
 */
export function compareRuns(runA: Run, runB: Run): ComparisonResult {
    const allMetricKeys = new Set([
        ...Object.keys(runA.metrics),
        ...Object.keys(runB.metrics),
    ]);

    const comparisons: MetricComparison[] = [];

    allMetricKeys.forEach((metric) => {
        const valueA = runA.metrics[metric] ?? 0;
        const valueB = runB.metrics[metric] ?? 0;

        // Calculate percentage difference: ((B - A) / A) * 100
        // If A is 0, use absolute difference
        let percentageDiff: number;
        if (valueA === 0 && valueB === 0) {
            percentageDiff = 0;
        } else if (valueA === 0) {
            percentageDiff = valueB > 0 ? 100 : -100;
        } else {
            percentageDiff = ((valueB - valueA) / Math.abs(valueA)) * 100;
        }

        // Determine winner (higher is better for most metrics)
        // For metrics like 'loss' or 'error', lower is better - handle convention-based naming
        const isLowerBetter = metric.toLowerCase().includes('loss') ||
            metric.toLowerCase().includes('error') ||
            metric.toLowerCase().includes('latency') ||
            metric.toLowerCase().includes('time');

        let winner: 'A' | 'B' | 'tie';
        if (valueA === valueB) {
            winner = 'tie';
        } else if (isLowerBetter) {
            winner = valueA < valueB ? 'A' : 'B';
        } else {
            winner = valueA > valueB ? 'A' : 'B';
        }

        comparisons.push({
            metric,
            runAValue: valueA,
            runBValue: valueB,
            percentageDiff,
            winner,
        });
    });

    return {
        runA,
        runB,
        comparisons,
    };
}

/**
 * Format percentage with sign and decimals
 */
export function formatPercentage(value: number): string {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
}
