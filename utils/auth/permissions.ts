import { User } from '@supabase/supabase-js';

// Define your app's roles
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

// Define your app's permissions
export enum Permission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  MANAGE_USERS = 'manage_users',
}

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.READ,
    Permission.WRITE,
    Permission.DELETE,
    Permission.MANAGE_USERS,
  ],
  [UserRole.USER]: [
    Permission.READ,
    Permission.WRITE,
  ],
  [UserRole.GUEST]: [
    Permission.READ,
  ],
};

/**
 * Get user role from Supabase user object
 */
export function getUserRole(user: User | null): UserRole {
  if (!user) return UserRole.GUEST;

  // Check user metadata for role
  const role = user.user_metadata?.role as UserRole;

  // Default to USER if no role is set
  return role || UserRole.USER;
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: User | null, permission: Permission): boolean {
  const role = getUserRole(user);
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, requiredRole: UserRole): boolean {
  const userRole = getUserRole(user);

  // Admin has all roles
  if (userRole === UserRole.ADMIN) return true;

  return userRole === requiredRole;
}

/**
 * Require authentication (throw if not authenticated)
 */
export function requireAuth(user: User | null): User {
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

/**
 * Require specific permission (throw if not authorized)
 */
export function requirePermission(user: User | null, permission: Permission): void {
  requireAuth(user);

  if (!hasPermission(user, permission)) {
    throw new Error(`Permission denied: ${permission} required`);
  }
}

/**
 * Require specific role (throw if not authorized)
 */
export function requireRole(user: User | null, role: UserRole): void {
  requireAuth(user);

  if (!hasRole(user, role)) {
    throw new Error(`Role ${role} required`);
  }
}
