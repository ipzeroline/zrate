import { NextResponse } from 'next/server'
import { fetchHistoricalRates } from '../../../lib/ratesService'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const base = searchParams.get('base') || 'USD'
  const quote = searchParams.get('quote') || 'THB'
  const days = parseInt(searchParams.get('days') || '365', 10)

  try {
    const data = await fetchHistoricalRates(base, quote, days)
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('API history fetch failed:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}
