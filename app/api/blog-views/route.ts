import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const DATA_FILE = path.join(process.cwd(), '.next', 'server-data', 'blog-views.json')

async function readCounts(): Promise<Record<string, number>> {
  try {
    const raw = await readFile(DATA_FILE, 'utf8')
    return JSON.parse(raw) as Record<string, number>
  } catch {
    return {}
  }
}

export async function GET(request: NextRequest) {
  const slugs = (request.nextUrl.searchParams.get('slugs') || '')
    .split(',')
    .map((slug) => slug.trim())
    .filter(Boolean)

  const counts = await readCounts()
  const views = Object.fromEntries(slugs.map((slug) => [slug, counts[slug] || 0]))

  return NextResponse.json({ views })
}
