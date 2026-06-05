import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { BLOG_ARTICLES } from '../../../../lib/blogArticles'

export const runtime = 'edge'

const THEMES = [
  { accent: '#0ea5e9', accent2: '#6366f1', label: 'REMITTANCE GUIDE' },
  { accent: '#10b981', accent2: '#0ea5e9', label: 'EXCHANGE INSIGHT' },
  { accent: '#f59e0b', accent2: '#10b981', label: 'FINANCE TIPS' },
  { accent: '#8b5cf6', accent2: '#ec4899', label: 'STABLECOIN GUIDE' },
]

function themeFor(slug: string) {
  const hash = Array.from(slug).reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return THEMES[hash % THEMES.length]
}

function trimText(text: string, max = 80) {
  return text.length > max ? `${text.slice(0, max - 1)}...` : text
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await context.params
  const slug = resolvedParams.slug
  const searchParams = request.nextUrl.searchParams
  const lang = (searchParams.get('lang') || 'th') as 'th' | 'en' | 'lo' | 'my' | 'km'

  const article = BLOG_ARTICLES.find((a) => a.slug === slug)
  const translation = article?.translations[lang] || article?.translations['th'] || article?.translations['en']

  const title = trimText(translation?.title || 'Financial Article | zrate.io', 65)
  const category = (article?.category || 'finance').toUpperCase()
  const theme = themeFor(slug)

  // Generate dynamic metrics for preview
  const charSum = Array.from(slug).reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const speed = charSum % 2 === 0 ? 'Instant' : '1-3 Hours'
  const safety = 90 + (charSum % 11)
  const costIndex = 1 + (charSum % 4)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: '#0a0f1d',
          color: '#f8fafc',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Glow backgrounds */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${theme.accent}24, ${theme.accent2}18 50%, rgba(10,15,29,0.99))`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -100,
            top: 50,
            width: 450,
            height: 450,
            borderRadius: 999,
            background: `radial-gradient(circle, ${theme.accent}3a 0%, ${theme.accent2}1a 45%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -120,
            bottom: -120,
            width: 500,
            height: 400,
            borderRadius: 999,
            background: `radial-gradient(circle, ${theme.accent2}22 0%, transparent 70%)`,
          }}
        />

        {/* Outer content container */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: 48,
            justifyContent: 'space-between',
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
                  color: '#0a0f1d',
                  fontSize: 26,
                  fontWeight: 900,
                }}
              >
                zR
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: -0.5 }}>zrate.io</div>
                <div style={{ color: '#cbd5e1', fontSize: 15, fontWeight: 700, letterSpacing: 0.5 }}>
                  {theme.label}
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                padding: '8px 16px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: theme.accent,
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              Remittance Intelligence
            </div>
          </div>

          {/* Main content grid */}
          <div style={{ display: 'flex', gap: 24, flex: 1, marginTop: 28, minHeight: 0 }}>
            {/* Left large card */}
            <div
              style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 36,
                borderRadius: 28,
                background: 'rgba(10,15,29,0.76)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span
                    style={{
                      padding: '5px 12px',
                      borderRadius: 8,
                      background: `${theme.accent}1f`,
                      border: `1px solid ${theme.accent}3f`,
                      color: theme.accent,
                      fontSize: 12,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                    }}
                  >
                    {category}
                  </span>
                  <span
                    style={{
                      padding: '5px 12px',
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#cbd5e1',
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {lang.toUpperCase()}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: title.length > 50 ? 32 : 36,
                    lineHeight: 1.25,
                    fontWeight: 900,
                    color: '#ffffff',
                    marginTop: 8,
                  }}
                >
                  {title}
                </div>
              </div>

              {/* Dynamic widgets */}
              <div style={{ display: 'flex', gap: 14, marginTop: 16 }}>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    padding: '12px 16px',
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700 }}>SPEED</span>
                  <span style={{ color: '#ffffff', fontSize: 20, fontWeight: 900, marginTop: 4 }}>
                    {speed}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    padding: '12px 16px',
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700 }}>SAFETY SCORE</span>
                  <span style={{ color: theme.accent, fontSize: 20, fontWeight: 900, marginTop: 4 }}>
                    {safety}/100
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    padding: '12px 16px',
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700 }}>COST TIER</span>
                  <span style={{ color: theme.accent2, fontSize: 20, fontWeight: 900, marginTop: 4 }}>
                    {'$'.repeat(costIndex)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right widget card */}
            <div
              style={{
                width: 260,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 24,
                borderRadius: 28,
                background: 'rgba(10,15,29,0.85)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 700 }}>ASEAN REMITTANCE</span>
                <span style={{ fontSize: 22, fontWeight: 900, marginTop: 4, color: theme.accent }}>
                  Rate Analytics
                </span>
              </div>

              {/* Small graphic (bars like valustock) */}
              <div
                style={{
                  height: 120,
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 6,
                  borderBottom: '1px solid rgba(255,255,255,0.12)',
                  paddingBottom: 8,
                }}
              >
                {[45, 68, 55, 84, 76, 95, 88, 110, 96, 120].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: h * 0.8,
                      borderRadius: 4,
                      background: `linear-gradient(to top, ${theme.accent}33, ${
                        i > 6 ? theme.accent : theme.accent2
                      })`,
                    }}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: 12, fontWeight: 800 }}>
                  <span style={{ color: '#94a3b8' }}>Live Rates</span>
                  <span style={{ color: '#10b981', marginLeft: 'auto' }}>Active</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    padding: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#cbd5e1',
                    marginTop: 6,
                  }}
                >
                  zrate.io • 60s Updates
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
