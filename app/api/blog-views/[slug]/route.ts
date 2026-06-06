import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const DATA_DIR = path.join(process.cwd(), '.next', 'server-data')
const DATA_FILE = path.join(DATA_DIR, 'blog-views.json')
const ONE_YEAR = 60 * 60 * 24 * 365

function cookieName(slug: string) {
  return `zrate_blog_view_${slug.replace(/[^a-z0-9_-]/gi, '_').slice(0, 80)}`
}

async function readCounts(): Promise<Record<string, number>> {
  try {
    const raw = await readFile(DATA_FILE, 'utf8')
    return JSON.parse(raw) as Record<string, number>
  } catch {
    return {}
  }
}

async function writeCounts(counts: Record<string, number>) {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(counts, null, 2), 'utf8')
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params
  const counts = await readCounts()

  return NextResponse.json({ slug, views: counts[slug] || 0 })
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params
  const viewedCookie = cookieName(slug)
  const hasViewed = request.cookies.has(viewedCookie)
  const counts = await readCounts()

  if (!hasViewed) {
    counts[slug] = (counts[slug] || 0) + 1
    await writeCounts(counts)
  }

  const response = NextResponse.json({
    slug,
    views: counts[slug] || 0,
    counted: !hasViewed,
  })

  if (!hasViewed) {
    response.cookies.set(viewedCookie, '1', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: ONE_YEAR,
      path: '/',
    })
  }

  return response
}
