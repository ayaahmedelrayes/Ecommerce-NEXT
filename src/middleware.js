import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // صفحات الأدمن محمية — التحقق الحقيقي يحصل في الـ layout
  if (pathname.startsWith('/admin')) {
    // نتحقق من وجود توكن في localStorage (client-side فقط)
    // الحماية الفعلية عبر requireAdmin في كل API route
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
