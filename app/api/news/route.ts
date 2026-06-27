import { NextResponse } from 'next/server'
import { fetchCurrencyNews } from '../../../lib/ratesService'

export const revalidate = 3600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const base = searchParams.get('base') || 'USD'
  const quote = searchParams.get('quote') || 'THB'

  try {
    const data = await fetchCurrencyNews(base, quote)
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('API news fetch failed:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}
