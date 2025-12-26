'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import UserMenu from './UserMenu';

export default function Navbar() {
    const pathname = usePathname();
    const { user } = useAuth();

    return (
        <nav className="bg-[#0a0a0a] border-b border-neutral-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center border border-neutral-700/50 group-hover:border-neutral-600 transition-colors">
                                <svg className="w-6 h-6 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-semibold text-neutral-100">
                                    Experiment Tracker
                                </span>
                                <a
                                    href="https://www.linkedin.com/in/rahul-adhini-satheesh-babu-4b3aa3285/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[10px] tracking-widest text-neutral-500 hover:text-neutral-300 transition-colors"
                                >
                                    AUTHORED BY RAHUL ADHINI
                                </a>
                            </div>
                        </Link>

                        {user && (
                            <div className="hidden md:flex items-center gap-1">
                                <Link
                                    href="/"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === '/'
                                        ? 'bg-neutral-800 text-neutral-100'
                                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <UserMenu />
                        ) : (
                            <Link
                                href="/auth"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-900 font-medium text-sm hover:bg-white transition-all hover:-translate-y-0.5"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
