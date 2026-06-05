import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LOCALES = ['th', 'en', 'lo', 'my', 'km']
const ALIASES: Record<string, string> = {
  la: 'lo',
  kh: 'km',
}

const PAIRS = [
  'usd-thb',
  'usd-lak',
  'usd-mmk',
  'usd-khr',
  'eur-thb',
  'eur-usd',
  'thb-usd',
  'thb-lak',
  'thb-mmk',
  'thb-khr',
  'thb-jpy',
  'thb-cny',
  'usdt-thb',
  'usdt-usd',
  'jpy-thb',
  'cny-thb',
  'sgd-thb',
  'krw-thb',
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/zrate.png' ||
    pathname === '/og-image.png' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next()
  }

  const parts = pathname.split('/').filter(Boolean)
  const cookieLang = request.cookies.get('zrate-language')?.value

  let preferredLocale = 'th'
  if (cookieLang) {
    if (cookieLang === 'en') preferredLocale = 'en'
    else if (cookieLang === 'la' || cookieLang === 'lo') preferredLocale = 'lo'
    else if (cookieLang === 'my') preferredLocale = 'my'
    else if (cookieLang === 'kh' || cookieLang === 'km') preferredLocale = 'km'
  }

  if (parts.length === 0) {
    if (preferredLocale !== 'th') {
      return NextResponse.redirect(new URL(`/${preferredLocale}`, request.url))
    }
    return NextResponse.rewrite(new URL('/th', request.url))
  }

  const firstSegment = parts[0]

  if (ALIASES[firstSegment]) {
    const targetLocale = ALIASES[firstSegment]
    const remainingPath = parts.slice(1).join('/')
    const redirectUrl = remainingPath ? `/${targetLocale}/${remainingPath}` : `/${targetLocale}`
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  if (LOCALES.includes(firstSegment)) {
    return NextResponse.next()
  }

  if (PAIRS.includes(firstSegment)) {
    return NextResponse.rewrite(new URL(`/th/${firstSegment}`, request.url))
  }

  if (
    firstSegment === 'about' ||
    firstSegment === 'contact' ||
    firstSegment === 'rates' ||
    firstSegment === 'currency-pairs' ||
    firstSegment === 'money-transfer' ||
    firstSegment === 'privacy'
  ) {
    return NextResponse.rewrite(new URL(`/th/${firstSegment}`, request.url))
  }
  if (firstSegment === 'blog') {
    return NextResponse.rewrite(new URL(`/th${pathname}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|zrate.png|og-image.png|sitemap.xml|robots.txt|sw.js).*)',
  ],
}
