'use client';

import { useUser } from '@/hooks/useUser';
import { Permission } from '@/utils/auth/permissions';
import Button from './components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading, role, isAdmin, hasPermission } = useUser();
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
            Welcome to the App
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Please log in to continue
          </p>
          <Button onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black px-4">
      <main className="w-full max-w-3xl py-16">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h1 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
            Dashboard
          </h1>

          {/* User Info */}
          <div className="mb-8 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <h2 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
              User Information
            </h2>
            <div className="space-y-1 text-sm">
              <p className="text-zinc-600 dark:text-zinc-400">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">
                <span className="font-medium">Role:</span>{' '}
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {role}
                </span>
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">
                <span className="font-medium">User ID:</span> {user.id}
              </p>
            </div>
          </div>

          {/* Permissions Display */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
              Your Permissions
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(Permission).map((permission) => {
                const has = hasPermission(permission);
                return (
                  <div
                    key={permission}
                    className={`p-3 rounded-lg border ${
                      has
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {has ? (
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className={`text-sm font-medium ${
                        has
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-zinc-500 dark:text-zinc-500'
                      }`}>
                        {permission}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <div className="mb-8 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <h2 className="text-lg font-semibold mb-2 text-purple-900 dark:text-purple-100">
                🔑 Admin Access
              </h2>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                You have administrator privileges and can access all features.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleLogout} variant="secondary">
              Logout
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
