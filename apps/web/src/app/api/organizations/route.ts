import { env } from '@saas/env'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      )
    }

    // Make direct API call to your backend
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/organizations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch organizations')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {}
}
