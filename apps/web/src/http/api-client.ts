import { env } from '@saas/env'
import { getCookie } from 'cookies-next'
import ky from 'ky'

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        let token: string | undefined

        if (typeof window === 'undefined') {
          const { cookies: getServerCookies } = await import('next/headers')
          const cookieStore = await getServerCookies()
          token = cookieStore.get('token')?.value
        } else {
          token = getCookie('token') as string | undefined
        }

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }

        // Only set Content-Type for requests with a body
        if (request.body && !request.headers.has('Content-Type')) {
          request.headers.set('Content-Type', 'application/json')
        }
      },
    ],
  },
})
