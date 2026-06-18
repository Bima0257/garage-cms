import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { userUpdateSchema } from '@/lib/validations/user'
import { comparePassword, hashPassword } from '@/lib/validations/user'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const userId = parseInt(id)

    // Only allow users to update their own profile
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'You can only update your own profile' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = userUpdateSchema.parse(body)

    const adminClient = createAdminClient()

    // If trying to update password, verify current password
    if (validatedData.currentPassword && validatedData.newPassword) {
      const { data: currentUser, error: userError } = await adminClient
        .from('users')
        .select('password')
        .eq('id', userId)
        .single()

      if (userError || !currentUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const isValidPassword = await comparePassword(
        validatedData.currentPassword,
        (currentUser as { password: string }).password
      )

      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        )
      }

      // Hash new password
      validatedData.newPassword = await hashPassword(validatedData.newPassword)
    }

    // Build update object with password if provided
    const updates: {
      name?: string
      username?: string
      email?: string | null
      password?: string
      updated_at: string
    } = {
      updated_at: new Date().toISOString(),
    }

    if (validatedData.name) {
      updates.name = validatedData.name
    }
    if (validatedData.username) {
      updates.username = validatedData.username
    }
    if (validatedData.email !== undefined) {
      updates.email = validatedData.email
    }

    if (validatedData.newPassword) {
      updates.password = validatedData.newPassword
    }

    const { error } = await adminClient
      .from('users')
      .update(updates as never)
      .eq('id', userId)

    if (error) {
      console.error('Error updating user:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Error in PUT /api/users/[id]:', error)
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const userId = parseInt(id)

    // Only allow users to view their own profile
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'You can only view your own profile' },
        { status: 403 }
      )
    }

    const adminClient = createAdminClient()

    const { data: user, error } = await adminClient
      .from('users')
      .select('id, name, username, email, photo')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error in GET /api/users/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

