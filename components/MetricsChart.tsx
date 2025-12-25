'use client';

import { Run } from '@/types/database';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface MetricsChartProps {
    runs: Run[];
}

// Monochromatic color palette with subtle variations
const COLORS = [
    '#a3a3a3', // neutral-400
    '#737373', // neutral-500
    '#e5e5e5', // neutral-200
    '#525252', // neutral-600
    '#d4d4d4', // neutral-300
    '#404040', // neutral-700
    '#fafafa', // neutral-50
    '#262626', // neutral-800
];

export default function MetricsChart({ runs }: MetricsChartProps) {
    if (runs.length === 0) {
        return (
            <div className="bg-[#111111] rounded-2xl border border-neutral-800/50 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-800/50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                </div>
                <p className="text-neutral-500">No runs logged yet. Log your first run to see metric trends!</p>
            </div>
        );
    }

    const allMetricKeys = [...new Set(runs.flatMap((run) => Object.keys(run.metrics)))];

    const chartData = runs
        .sort((a, b) => a.run_number - b.run_number)
        .map((run) => ({
            runNumber: `Run ${run.run_number}`,
            ...run.metrics,
        }));

    return (
        <div className="bg-[#111111] rounded-2xl border border-neutral-800/50 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-neutral-800/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-neutral-100">Metric Trends</h3>
                    <p className="text-sm text-neutral-500">{runs.length} runs tracked</p>
                </div>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                        <XAxis
                            dataKey="runNumber"
                            stroke="#404040"
                            tick={{ fill: '#737373', fontSize: 12 }}
                        />
                        <YAxis
                            stroke="#404040"
                            tick={{ fill: '#737373', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#141414',
                                border: '1px solid #262626',
                                borderRadius: '12px',
                                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
                            }}
                            labelStyle={{ color: '#e5e5e5', fontWeight: 600, marginBottom: 8 }}
                            itemStyle={{ color: '#a3a3a3' }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: 20 }}
                            formatter={(value) => <span style={{ color: '#a3a3a3' }}>{value}</span>}
                        />
                        {allMetricKeys.map((metric, index) => (
                            <Line
                                key={metric}
                                type="monotone"
                                dataKey={metric}
                                stroke={COLORS[index % COLORS.length]}
                                strokeWidth={2}
                                dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 0, r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 2, stroke: '#0a0a0a' }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
