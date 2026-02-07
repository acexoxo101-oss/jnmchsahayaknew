import { updateSession } from '@/lib/supabase/proxy'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 🔓 Allow auth pages to render freely
  if (
    pathname.startsWith('/auth') ||
    pathname === '/' ||
    pathname === '/login'
  ) {
    return NextResponse.next()
  }

  // 🔐 Protect everything else
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
