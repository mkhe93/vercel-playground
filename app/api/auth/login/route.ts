import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import * as v from 'valibot';
import {
  LoginRequestSchema,
  UserSchema,
  type User,
  type PublicUser,
  type Session
} from '../schemas';

// Simple file-based user storage
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Get users from file
function getUsers(): User[] {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    // Create default users
    const defaultUsers: User[] = [
      { id: '1', email: 'admin@example.com', password: 'admin123', name: 'Admin User' }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
    return defaultUsers;
  }
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  const users = JSON.parse(data);
  // Validate users array
  return v.parse(v.array(UserSchema), users);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Valibot
    const validationResult = v.safeParse(LoginRequestSchema, body);

    if (!validationResult.success) {
      const firstError = validationResult.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Invalid request data' },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.output;

    // Get users from file
    const users = getUsers();

    // Find user
    const user = users.find(
      (u: User) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session data
    const sessionData: Session = {
      userId: user.id,
      email: user.email,
      name: user.name
    };

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Return public user data (without password)
    const publicUser: PublicUser = {
      id: user.id,
      email: user.email,
      name: user.name
    };

    return NextResponse.json({
      success: true,
      user: publicUser
    });
  } catch (error) {
    console.error('Login error:', error);

    // Handle Valibot validation errors
    if (error instanceof v.ValiError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
