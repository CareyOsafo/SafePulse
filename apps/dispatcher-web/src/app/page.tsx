'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function Home() {
  const router = useRouter();
  const { session, loading } = useAuthStore();

  useEffect(() => {
    if (!loading) {
      if (session) {
        router.replace('/dispatcher');
      } else {
        router.replace('/login');
      }
    }
  }, [session, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ops-bg">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading SafePulse...</p>
      </div>
    </div>
  );
}
