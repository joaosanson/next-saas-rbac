import { signInWithGithub } from '@/http/sign-in-with-github';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      {
        message: 'Github oauth code not found',
      },
      {
        status: 400,
      }
    );
  }

  const { token } = await signInWithGithub({ code });

  cookieStore.set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = '/';
  redirectUrl.search = '';

  return NextResponse.redirect(redirectUrl);
}
