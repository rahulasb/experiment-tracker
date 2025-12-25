'use client';

export default function Footer() {
    return (
        <footer className="bg-[#0a0a0a] border-t border-neutral-800/30 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center">
                    <p className="text-sm text-neutral-500">
                        © 2025{' '}
                        <a
                            href="https://www.linkedin.com/in/rahul-adhini-satheesh-babu-4b3aa3285/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-300 hover:text-white underline underline-offset-2 transition-colors"
                        >
                            Rahul Adhini
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
