'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { getUserRole, hasPermission, hasRole, UserRole, Permission } from '@/utils/auth/permissions';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return {
    user,
    loading,
    role: getUserRole(user),
    isAdmin: hasRole(user, UserRole.ADMIN),
    isAuthenticated: !!user,
    hasPermission: (permission: Permission) => hasPermission(user, permission),
    hasRole: (role: UserRole) => hasRole(user, role),
  };
}
