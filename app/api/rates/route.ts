import { NextResponse } from 'next/server'
import { fetchRates } from '../../../lib/ratesService'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const base = searchParams.get('base') || 'USD'

  try {
    const data = await fetchRates(base)
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=120, s-maxage=120, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    console.error('API route rates fetch failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rates' },
      { status: 500 }
    )
  }
}
