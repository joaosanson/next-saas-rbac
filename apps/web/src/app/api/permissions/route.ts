import { env } from '@saas/env'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orgSlug = searchParams.get('orgSlug')

    if (!orgSlug) {
      return NextResponse.json(
        { error: 'Organization slug is required' },
        { status: 400 },
      )
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      )
    }

    // Get membership to determine permissions
    const response = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/organizations/${orgSlug}/membership`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch membership')
    }

    const data = await response.json()

    // Simple permission check - you can expand this based on your RBAC logic
    const canViewProjects =
      data.membership?.role &&
      ['ADMIN', 'MEMBER', 'BILLING'].some((role) =>
        data.membership.role.includes(role),
      )

    return NextResponse.json({
      canViewProjects,
      membership: data.membership,
    })
  } catch (error) {
    console.error('Failed to fetch permissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 },
    )
  }
}
