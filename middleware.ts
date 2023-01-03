import { NextRequest, NextFetchEvent, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session/edge';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|favicon.ico).*)',
  ],
};

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (
    !req.nextUrl.pathname.startsWith('/log-in') &&
    !req.nextUrl.pathname.startsWith('/create-account')
  ) {
    const res = NextResponse.next();
    const session = await getIronSession(req, res, {
      cookieName: 'twitortwit_session',
      password:
        'unsafe-password-just-for-testing-in-code-sandbox-need-to-be-replaced-with-env-variable-complex-password-at-least-32-char-long',
      cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
      },
    });
    const { user } = session;
    if (!user?.id) {
      req.nextUrl.pathname = '/log-in';
      return NextResponse.redirect(req.nextUrl);
    }
  }

  return NextResponse.next();
}
