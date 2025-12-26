'use client';

import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/40 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,120,120,0.1),transparent_50%)]"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800/50 border border-neutral-700/50 mb-8">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-sm text-neutral-400">Your Research Command Center</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-100 mb-6 tracking-tight">
                            Track Your
                            <span className="block bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-200 bg-clip-text text-transparent">
                                Research Experiments
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-4 leading-relaxed">
                            The all-in-one platform for researchers to organize projects,
                            log experiments, track metrics, and visualize progress — all in one elegant dashboard.
                        </p>

                        {/* Author Tag */}
                        <a
                            href="https://www.linkedin.com/in/rahul-adhini-satheesh-babu-4b3aa3285/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-xs tracking-widest text-neutral-500 hover:text-neutral-300 transition-colors mb-12"
                        >
                            AUTHORED BY RAHUL ADHINI
                        </a>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/auth"
                                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-neutral-100 text-neutral-900 font-semibold text-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg shadow-neutral-100/10"
                            >
                                Get Started
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link
                                href="/auth"
                                className="flex items-center gap-2 px-6 py-4 rounded-2xl text-neutral-300 font-medium hover:text-white hover:bg-neutral-800/50 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-[#0d0d0d] border-t border-neutral-800/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-100 mb-4">
                            Everything You Need for Research
                        </h2>
                        <p className="text-neutral-500 max-w-xl mx-auto">
                            A complete toolkit designed to streamline your research workflow
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group bg-[#111111] rounded-2xl border border-neutral-800/50 p-8 hover:border-neutral-700/50 transition-all hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center mb-6 group-hover:bg-neutral-700 transition-colors">
                                <svg className="w-7 h-7 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-100 mb-3">Organize Projects</h3>
                            <p className="text-neutral-500 leading-relaxed">
                                Create and manage multiple research projects. Keep everything organized with descriptions, status tracking, and easy navigation.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group bg-[#111111] rounded-2xl border border-neutral-800/50 p-8 hover:border-neutral-700/50 transition-all hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center mb-6 group-hover:bg-neutral-700 transition-colors">
                                <svg className="w-7 h-7 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-100 mb-3">Log Experiments</h3>
                            <p className="text-neutral-500 leading-relaxed">
                                Document every experiment with detailed notes, parameters, and outcomes. Never lose track of what you&apos;ve tried.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group bg-[#111111] rounded-2xl border border-neutral-800/50 p-8 hover:border-neutral-700/50 transition-all hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center mb-6 group-hover:bg-neutral-700 transition-colors">
                                <svg className="w-7 h-7 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-100 mb-3">Track Metrics</h3>
                            <p className="text-neutral-500 leading-relaxed">
                                Visualize your progress with metric tracking. See trends, compare runs, and make data-driven decisions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA Section */}
            <div className="bg-[#0a0a0a] border-t border-neutral-800/30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-100 mb-4">
                        Ready to Streamline Your Research?
                    </h2>
                    <p className="text-neutral-500 mb-8 max-w-xl mx-auto">
                        Join researchers who are already organizing their experiments more efficiently.
                    </p>
                    <Link
                        href="/auth"
                        className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-neutral-100 text-neutral-900 font-semibold text-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg shadow-neutral-100/10"
                    >
                        Start Tracking Now
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
