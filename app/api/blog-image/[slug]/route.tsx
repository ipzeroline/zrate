import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { BLOG_ARTICLES } from '../../../../lib/blogArticles'
import { getBlogArticleSymbol } from '../../../../lib/blogImage'

export const runtime = 'edge'

const ZRATE_COLORS = {
  ink: '#202226',
  muted: '#68707a',
  line: '#d7d9dd',
  canvas: '#f7f7f6',
  surface: '#ffffff',
  mist: '#eef1f3',
  charcoal: '#20242a',
  copper: '#c8791c',
  copperDeep: '#9f5d12',
  copperSoft: '#f4e3cc',
  green: '#2f9b62',
  red: '#c14b3f',
  amber: '#d89a22',
}

const LANG_LABELS: Record<string, string> = {
  th: 'Thai edition',
  en: 'English edition',
  lo: 'Lao edition',
  my: 'Myanmar edition',
  km: 'Khmer edition',
}

type VisualKind = 'corridor' | 'regional' | 'compare' | 'qr' | 'fees' | 'docs' | 'rates'

function getVisualKind(slug: string): VisualKind {
  if (slug.includes('vietnam') || slug.includes('philippines') || slug.includes('indonesia')) return 'regional'
  if (slug.includes('compare')) return 'compare'
  if (slug.includes('qr') || slug.includes('promptpay')) return 'qr'
  if (slug.includes('hidden-fees') || slug.includes('markup')) return 'fees'
  if (slug.includes('documents') || slug.includes('regulations')) return 'docs'
  if (slug.includes('transfer-money')) return 'corridor'
  return 'rates'
}

function trimText(value: string | null | undefined, fallback: string, max = 86) {
  const text = (value || fallback).replace(/\s+/g, ' ').trim()
  return text.length > max ? `${text.slice(0, max - 1)}...` : text
}

function seedFor(value: string) {
  return Array.from(value).reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

function splitSymbol(symbol: string) {
  const parts = symbol.split(/[/-]/).filter(Boolean)
  return {
    base: parts[0] || symbol.slice(0, 3) || 'THB',
    quote: parts[1] || parts[0] || 'FX',
  }
}

function displayPairFor(kind: VisualKind, symbol: string) {
  const pair = splitSymbol(symbol)
  if (pair.base !== pair.quote) return pair

  if (kind === 'compare') return { base: 'RATE', quote: 'FEE' }
  if (kind === 'qr') return { base: 'PAY', quote: 'QR' }
  if (kind === 'fees') return { base: 'MID', quote: 'COST' }
  if (kind === 'docs') return { base: 'KYC', quote: 'LIMIT' }
  if (kind === 'regional') return { base: 'THB', quote: 'ASEAN' }

  return pair
}

function headingLabelFor(kind: VisualKind) {
  return {
    corridor: 'LIVE RATE REFERENCE',
    regional: 'MULTI-COUNTRY GUIDE',
    compare: 'PROVIDER COST CHECK',
    qr: 'PAYMENT VS REMITTANCE',
    fees: 'MID-MARKET MARKUP',
    docs: 'COMPLIANCE CHECKLIST',
    rates: 'EXCHANGE RATE GUIDE',
  }[kind]
}

function iconFor(kind: VisualKind) {
  return {
    corridor: 'FX',
    regional: 'SEA',
    compare: 'VS',
    qr: 'QR',
    fees: '%',
    docs: 'ID',
    rates: 'FX',
  }[kind]
}

function labelFor(kind: VisualKind) {
  return {
    corridor: 'Currency corridor',
    regional: 'ASEAN remittance',
    compare: 'Provider comparison',
    qr: 'Cross-border QR',
    fees: 'Fee transparency',
    docs: 'Transfer requirements',
    rates: 'Exchange guide',
  }[kind]
}

function metricSet(kind: VisualKind, seed: number) {
  if (kind === 'compare') {
    return [
      { label: 'Providers', value: '5+', tone: ZRATE_COLORS.copper },
      { label: 'Speed range', value: `${1 + (seed % 3)}h`, tone: ZRATE_COLORS.ink },
      { label: 'Fee gap', value: `${9 + (seed % 18)}%`, tone: ZRATE_COLORS.red },
    ]
  }
  if (kind === 'qr') {
    return [
      { label: 'Use case', value: 'Pay', tone: ZRATE_COLORS.copper },
      { label: 'Remit', value: 'No', tone: ZRATE_COLORS.red },
      { label: 'Region', value: 'SEA', tone: ZRATE_COLORS.ink },
    ]
  }
  if (kind === 'fees') {
    return [
      { label: 'Shown fee', value: '0-3%', tone: ZRATE_COLORS.ink },
      { label: 'Markup', value: `${2 + (seed % 5)}%`, tone: ZRATE_COLORS.copper },
      { label: 'True cost', value: 'Check', tone: ZRATE_COLORS.green },
    ]
  }
  if (kind === 'docs') {
    return [
      { label: 'ID', value: 'Req.', tone: ZRATE_COLORS.ink },
      { label: 'Limit', value: 'Varies', tone: ZRATE_COLORS.copper },
      { label: 'Channel', value: 'Licensed', tone: ZRATE_COLORS.green },
    ]
  }
  return [
    { label: 'Rate check', value: `${82 + (seed % 15)}/100`, tone: ZRATE_COLORS.copper },
    { label: 'Cost gap', value: `${6 + (seed % 16)}%`, tone: ZRATE_COLORS.red },
    { label: 'Payout', value: `${88 + (seed % 11)}%`, tone: ZRATE_COLORS.green },
  ]
}

function miniTableRows(kind: VisualKind, seed: number) {
  if (kind === 'compare') {
    return [
      ['Wise', `${1 + (seed % 3)}h`, 'Mid rate'],
      ['Bank', '1-3d', 'Higher fee'],
      ['MTO', 'Fast', 'Cash pickup'],
    ]
  }
  if (kind === 'fees') {
    return [
      ['Mid-market', '100.00', 'Reference'],
      ['Provider', '96.80', 'Offer'],
      ['Hidden gap', '3.20', 'Cost'],
    ]
  }
  if (kind === 'docs') {
    return [
      ['Passport / ID', 'Required', 'KYC'],
      ['Recipient info', 'Required', 'Payout'],
      ['Receipt', 'Keep', 'Proof'],
    ]
  }
  return [
    ['Mid rate', `${34 + (seed % 20)}.${seed % 90}`, 'Live'],
    ['Provider', `${33 + (seed % 18)}.${seed % 70}`, 'Compare'],
    ['Recipient', `${88 + (seed % 11)}%`, 'Payout'],
  ]
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params
  const searchParams = request.nextUrl.searchParams
  const lang = searchParams.get('lang') || 'th'
  const article = BLOG_ARTICLES.find((item) => item.slug === slug)
  const translation = article?.translations[lang] || article?.translations.th || article?.translations.en
  const fallbackSymbol = article ? getBlogArticleSymbol(article) : (slug.split('-')[0] || 'FX')
  const symbol = trimText(searchParams.get('symbol'), fallbackSymbol, 18).toUpperCase()
  const category = trimText(searchParams.get('category'), article?.category || 'Finance', 28).toUpperCase()
  const kind = getVisualKind(slug)
  const seed = seedFor(`${slug}${symbol}${kind}`)
  const { base, quote } = displayPairFor(kind, symbol)
  const metrics = metricSet(kind, seed)
  const rows = miniTableRows(kind, seed)
  const title = trimText(translation?.ogTitle || translation?.title, 'Exchange rate and remittance guide', 84)
  const qrCells = Array.from({ length: 49 }, (_, index) => ((index * 7 + seed) % 5 === 0 || index % 8 === 0))
  const bars = [42, 68, 54, 92, 80, 124, 102, 146, 118, 170]
  const regionalCurrencies = ['VND', 'PHP', 'IDR', 'LAK', 'MMK', 'KHR']

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: ZRATE_COLORS.canvas,
          color: ZRATE_COLORS.ink,
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(rgba(32,34,38,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(32,34,38,0.035) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -150,
            top: -90,
            width: 560,
            height: 360,
            borderRadius: 999,
            background: 'radial-gradient(circle, rgba(200,121,28,0.22) 0%, transparent 68%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -160,
            bottom: -130,
            width: 540,
            height: 360,
            borderRadius: 999,
            background: 'radial-gradient(circle, rgba(47,155,98,0.12) 0%, transparent 70%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            padding: 44,
            gap: 24,
          }}
        >
          <div
            style={{
              width: 300,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRadius: 26,
              padding: 28,
              background: ZRATE_COLORS.charcoal,
              color: '#fff',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: ZRATE_COLORS.copper,
                    color: '#fff',
                    fontSize: 25,
                    fontWeight: 900,
                  }}
                >
                  zR
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 30, fontWeight: 900 }}>zrate.io</div>
                  <div style={{ color: '#cbd0d5', fontSize: 14, fontWeight: 700 }}>{LANG_LABELS[lang] || 'Local edition'}</div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  width: 124,
                  height: 124,
                  borderRadius: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: ZRATE_COLORS.surface,
                  color: ZRATE_COLORS.copperDeep,
                  border: `1px solid ${ZRATE_COLORS.copperSoft}`,
                  fontSize: iconFor(kind).length > 2 ? 34 : 46,
                  fontWeight: 900,
                }}
              >
                {iconFor(kind)}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', color: '#dfe3e6', fontSize: 18, fontWeight: 800 }}>{labelFor(kind)}</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'flex',
                    padding: '10px 13px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    color: '#f8f8f7',
                    fontSize: 13,
                    fontWeight: 900,
                  }}
                >
                  {category}
                </span>
                <span
                  style={{
                    display: 'flex',
                    padding: '10px 13px',
                    borderRadius: 999,
                    background: ZRATE_COLORS.copper,
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 900,
                  }}
                >
                  {symbol}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', width: 788, flexDirection: 'column', gap: 22, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                width: 788,
                minHeight: 0,
                borderRadius: 26,
                background: ZRATE_COLORS.surface,
                border: `1px solid ${ZRATE_COLORS.line}`,
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: 506,
                  minWidth: 0,
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '32px 32px',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 92,
                        height: 92,
                        borderRadius: 18,
                        background: ZRATE_COLORS.copperSoft,
                        color: ZRATE_COLORS.copperDeep,
                        border: `1px solid ${ZRATE_COLORS.line}`,
                        fontSize: symbol.length > 6 ? 25 : 34,
                        fontWeight: 900,
                      }}
                    >
                      {symbol.slice(0, 7)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', color: ZRATE_COLORS.muted, fontSize: 15, fontWeight: 800 }}>
                        {headingLabelFor(kind)}
                      </div>
                      <div style={{ display: 'flex', fontSize: 50, lineHeight: 1, fontWeight: 900, color: ZRATE_COLORS.ink }}>
                        {base}
                        <span style={{ color: ZRATE_COLORS.copper, margin: '0 10px' }}>/</span>
                        {quote}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      width: 440,
                      color: ZRATE_COLORS.ink,
                      fontSize: title.length > 58 ? 28 : 32,
                      lineHeight: 1.18,
                      fontWeight: 900,
                    }}
                  >
                    {title}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  {metrics.map((metric) => (
                    <div
                      key={metric.label}
                      style={{
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'column',
                        padding: '14px 16px',
                        borderRadius: 14,
                        background: ZRATE_COLORS.mist,
                        border: `1px solid ${ZRATE_COLORS.line}`,
                      }}
                    >
                      <span style={{ color: ZRATE_COLORS.muted, fontSize: 12, fontWeight: 800 }}>{metric.label}</span>
                      <span style={{ color: metric.tone, fontSize: 26, fontWeight: 900 }}>{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  width: 282,
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 26,
                  background: ZRATE_COLORS.mist,
                  borderLeft: `1px solid ${ZRATE_COLORS.line}`,
                  boxSizing: 'border-box',
                }}
              >
                {kind === 'corridor' && (
                  <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {[base, quote].map((code) => (
                        <div
                          key={code}
                          style={{
                            width: 84,
                            height: 84,
                            borderRadius: 999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: code === base ? ZRATE_COLORS.charcoal : ZRATE_COLORS.surface,
                            color: code === base ? '#fff' : ZRATE_COLORS.ink,
                            border: `1px solid ${ZRATE_COLORS.line}`,
                            fontSize: 24,
                            fontWeight: 900,
                          }}
                        >
                          {code}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', height: 7, borderRadius: 999, background: ZRATE_COLORS.line }}>
                      <div style={{ display: 'flex', width: '68%', borderRadius: 999, background: ZRATE_COLORS.copper }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: ZRATE_COLORS.muted, fontSize: 14, fontWeight: 800 }}>
                      <span>Send</span>
                      <span>Compare</span>
                      <span>Receive</span>
                    </div>
                  </div>
                )}

                {kind === 'regional' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {regionalCurrencies.map((code, index) => (
                      <div
                        key={code}
                        style={{
                          display: 'flex',
                          width: 78,
                          height: 78,
                          borderRadius: 16,
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: index % 2 === 0 ? ZRATE_COLORS.surface : ZRATE_COLORS.copperSoft,
                          color: index % 2 === 0 ? ZRATE_COLORS.ink : ZRATE_COLORS.copperDeep,
                          border: `1px solid ${ZRATE_COLORS.line}`,
                          fontSize: 22,
                          fontWeight: 900,
                        }}
                      >
                        {code}
                      </div>
                    ))}
                  </div>
                )}

                {kind === 'qr' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        width: 210,
                        height: 210,
                        flexWrap: 'wrap',
                        gap: 6,
                        padding: 14,
                        borderRadius: 20,
                        background: ZRATE_COLORS.surface,
                        border: `1px solid ${ZRATE_COLORS.line}`,
                      }}
                    >
                      {qrCells.map((active, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            width: 20,
                            height: 20,
                            borderRadius: active ? 4 : 999,
                            background: active ? ZRATE_COLORS.charcoal : ZRATE_COLORS.copperSoft,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {(kind === 'compare' || kind === 'fees' || kind === 'docs' || kind === 'rates') && (
                  <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', gap: 11 }}>
                    {rows.map((row, index) => (
                      <div
                        key={row.join('-')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 10,
                          padding: '13px 14px',
                          borderRadius: 13,
                          background: index === 0 ? ZRATE_COLORS.charcoal : ZRATE_COLORS.surface,
                          color: index === 0 ? '#fff' : ZRATE_COLORS.ink,
                          border: `1px solid ${ZRATE_COLORS.line}`,
                        }}
                      >
                        <span style={{ display: 'flex', width: 94, fontSize: 13, fontWeight: 900 }}>{row[0]}</span>
                        <span style={{ display: 'flex', fontSize: 18, fontWeight: 900, color: index === 0 ? ZRATE_COLORS.copperSoft : ZRATE_COLORS.copperDeep }}>
                          {row[1]}
                        </span>
                        <span style={{ display: 'flex', width: 68, justifyContent: 'flex-end', color: index === 0 ? '#d8dde1' : ZRATE_COLORS.muted, fontSize: 12, fontWeight: 800 }}>
                          {row[2]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {kind !== 'qr' && kind !== 'regional' && kind !== 'corridor' && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 74 }}>
                    {bars.map((height, index) => (
                      <div
                        key={index}
                        style={{
                          width: 18,
                          height: Math.round((height + (seed % 20)) * 0.28),
                          borderRadius: 999,
                          background: index > 6 ? ZRATE_COLORS.copper : ZRATE_COLORS.line,
                        }}
                      />
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 900, color: ZRATE_COLORS.muted }}>
                  <span>zrate.io</span>
                  <span style={{ color: ZRATE_COLORS.copperDeep }}>60s rates</span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 20,
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.72)',
                border: `1px solid ${ZRATE_COLORS.line}`,
              }}
            >
              <div style={{ display: 'flex', color: ZRATE_COLORS.muted, fontSize: 15, fontWeight: 800 }}>
                Check the mid-market rate before sending money.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Live rates', 'Fee check', 'ASEAN'].map((label) => (
                  <span
                    key={label}
                    style={{
                      display: 'flex',
                      padding: '9px 12px',
                      borderRadius: 999,
                      background: label === 'Live rates' ? ZRATE_COLORS.copperSoft : ZRATE_COLORS.surface,
                      color: label === 'Live rates' ? ZRATE_COLORS.copperDeep : ZRATE_COLORS.muted,
                      border: `1px solid ${ZRATE_COLORS.line}`,
                      fontSize: 12,
                      fontWeight: 900,
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
