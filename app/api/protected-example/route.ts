import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { requirePermission, Permission } from '@/utils/auth/permissions'

// Example protected API route
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has permission
    requirePermission(user, Permission.READ)

    // Return protected data
    return NextResponse.json({
      message: 'This is protected data',
      user: {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'user',
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Permission denied')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Example: Only admins can POST
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has delete permission (admin only)
    requirePermission(user, Permission.DELETE)

    const body = await request.json()

    // Process admin-only action
    return NextResponse.json({
      success: true,
      message: 'Admin action completed',
      data: body,
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Permission denied')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
