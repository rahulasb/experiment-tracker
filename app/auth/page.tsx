'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import AuthForm from '@/components/AuthForm';

export default function AuthPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (user && !loading) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-neutral-400 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (user) {
        return null; // Will redirect
    }

    return <AuthForm />;
}
