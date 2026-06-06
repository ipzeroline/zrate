'use client'

import { useState, useMemo, useRef } from 'react'

interface HistoricalPoint {
  date: string
  rate: number
}

interface InteractiveChartProps {
  history: HistoricalPoint[]
  lang: string
  baseSymbol: string
  quoteSymbol: string
}

const TIMEFRAME_LABELS: Record<string, Record<string, string>> = {
  th: { '7d': '7 วัน', '30d': '30 วัน', '1y': '1 ปี' },
  en: { '7d': '7D', '30d': '30D', '1y': '1Y' },
  lo: { '7d': '7 ວັນ', '30d': '30 ວัน', '1y': '1 ປີ' },
  my: { '7d': '၇ ရက်', '30d': '၃၀ ရက်', '1y': '၁ နှစ်' },
  km: { '7d': '៧ ថ្ងៃ', '30d': '៣០ ថ្ងៃ', '1y': '១ ឆ្នាំ' },
}

const LOCALES: Record<string, string> = {
  th: 'th-TH',
  en: 'en-US',
  lo: 'lo-LA',
  my: 'my-MM',
  km: 'km-KH',
}

export function InteractiveChart({ history, lang, baseSymbol, quoteSymbol }: InteractiveChartProps) {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '1y'>('30d')
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; rate: number; x: number; y: number } | null>(null)
  
  const svgRef = useRef<SVGSVGElement>(null)

  const activeData = useMemo(() => {
    if (timeframe === '7d') {
      return history.slice(-7)
    }
    if (timeframe === '30d') {
      return history.slice(-30)
    }
    return history // 1y (up to 365 calendar/260 trading days)
  }, [history, timeframe])

  // Chart layout config
  const width = 800
  const height = 260
  const paddingX = 40
  const paddingY = 30
  const graphWidth = width - paddingX * 2
  const graphHeight = height - paddingY * 2

  const { minVal, maxVal, valRange, coords, pointsPath, areaPath, gridLines } = useMemo(() => {
    if (activeData.length === 0) {
      return { minVal: 0, maxVal: 0, valRange: 1, coords: [], pointsPath: '', areaPath: '', gridLines: [] }
    }

    const rates = activeData.map(p => p.rate)
    const min = Math.min(...rates)
    const max = Math.max(...rates)
    const range = max - min || 1

    // Add extra padding to range
    const rangePadding = range * 0.05
    const adjustedMin = Math.max(0, min - rangePadding)
    const adjustedMax = max + rangePadding
    const adjustedRange = adjustedMax - adjustedMin

    const calculatedCoords = activeData.map((p, i) => {
      const x = paddingX + (i / (activeData.length - 1)) * graphWidth
      const y = paddingY + graphHeight - ((p.rate - adjustedMin) / adjustedRange) * graphHeight
      return { x, y, date: p.date, rate: p.rate }
    })

    const path = calculatedCoords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ')
    const first = calculatedCoords[0]
    const last = calculatedCoords[calculatedCoords.length - 1]
    const fillPath = `${path} L ${last.x.toFixed(1)} ${(paddingY + graphHeight).toFixed(1)} L ${first.x.toFixed(1)} ${(paddingY + graphHeight).toFixed(1)} Z`

    const steps = 3
    const grid: Array<{ y: number; val: number }> = []
    for (let i = 0; i <= steps; i++) {
      const val = adjustedMin + (adjustedRange * i) / steps
      const y = paddingY + graphHeight - (i / steps) * graphHeight
      grid.push({ y, val })
    }

    return {
      minVal: adjustedMin,
      maxVal: adjustedMax,
      valRange: adjustedRange,
      coords: calculatedCoords,
      pointsPath: path,
      areaPath: fillPath,
      gridLines: grid
    }
  }, [activeData, graphWidth, graphHeight, paddingX, paddingY])

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!svgRef.current || coords.length === 0) return

    const rect = svgRef.current.getBoundingClientRect()
    // Calculate cursor X relative to SVG width
    const clientX = e.clientX - rect.left
    const svgX = (clientX / rect.width) * width

    // Find the closest coordinate based on X
    let closest = coords[0]
    let minDistance = Math.abs(coords[0].x - svgX)

    for (let i = 1; i < coords.length; i++) {
      const dist = Math.abs(coords[i].x - svgX)
      if (dist < minDistance) {
        minDistance = dist
        closest = coords[i]
      }
    }

    setHoveredPoint(closest)
  }

  const formatValue = (val: number) => {
    if (val >= 1000) return val.toLocaleString(LOCALES[lang] || 'th-TH', { maximumFractionDigits: 2 })
    if (val >= 1) return val.toLocaleString(LOCALES[lang] || 'th-TH', { maximumFractionDigits: 4 })
    return val.toFixed(6)
  }

  const localeText = TIMEFRAME_LABELS[lang] || TIMEFRAME_LABELS.th

  return (
    <div style={{ position: 'relative' }}>
      {/* Timeframe Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{
          display: 'flex',
          background: 'var(--control-bg, rgba(148, 163, 184, 0.08))',
          padding: '4px',
          borderRadius: '8px',
          border: '1px solid var(--border, rgba(148, 163, 184, 0.15))'
        }}>
          {(['7d', '30d', '1y'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => { setTimeframe(tf); setHoveredPoint(null) }}
              style={{
                border: 'none',
                background: timeframe === tf ? 'var(--bg-elevated, #ffffff)' : 'transparent',
                color: timeframe === tf ? 'var(--ink, #000000)' : 'var(--ink-secondary, #64748b)',
                padding: '6px 16px',
                fontSize: '0.85rem',
                fontWeight: 700,
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: timeframe === tf ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {localeText[tf]}
            </button>
          ))}
        </div>

        {/* Hover info label */}
        {hoveredPoint && (
          <div style={{
            fontSize: '0.88rem',
            fontWeight: 600,
            color: 'var(--ink-secondary)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <span>{new Date(hoveredPoint.date).toLocaleDateString(LOCALES[lang] || 'th-TH', { month: 'short', day: 'numeric', year: 'numeric' })}:</span>
            <strong style={{ color: 'var(--accent-text, #2563eb)' }}>
              1 {baseSymbol} = {formatValue(hoveredPoint.rate)} {quoteSymbol}
            </strong>
          </div>
        )}
      </div>

      {/* SVG Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        background: 'var(--bg-elevated, #ffffff)',
        border: '1px solid var(--border, rgba(148, 163, 184, 0.12))',
        borderRadius: '12px',
        padding: '12px'
      }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id={`grad-${baseSymbol}-${quoteSymbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLines.map((line, i) => (
            <g key={i}>
              <line
                x1={paddingX}
                y1={line.y}
                x2={width - paddingX}
                y2={line.y}
                stroke="var(--border, rgba(148, 163, 184, 0.08))"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={width - paddingX + 6}
                y={line.y + 3}
                fill="var(--ink-dim, #94a3b8)"
                fontSize="10px"
                fontWeight="500"
                textAnchor="start"
              >
                {formatValue(line.val)}
              </text>
            </g>
          ))}

          {/* Gradient Fill Area */}
          {areaPath && (
            <path d={areaPath} fill={`url(#grad-${baseSymbol}-${quoteSymbol})`} />
          )}

          {/* Sparkline Path */}
          {pointsPath && (
            <path
              d={pointsPath}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Hover Crosshair & Dot */}
          {hoveredPoint && (
            <>
              {/* Vertical line */}
              <line
                x1={hoveredPoint.x}
                y1={paddingY}
                x2={hoveredPoint.x}
                y2={paddingY + graphHeight}
                stroke="rgba(37, 99, 235, 0.4)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              {/* Highlight dot on path */}
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="6"
                fill="#2563eb"
                stroke="var(--bg-elevated, #ffffff)"
                strokeWidth="2.5"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
              />
            </>
          )}

          {/* Start and End Anchor points (default if not hovered) */}
          {!hoveredPoint && coords.length > 0 && (
            <>
              <circle
                cx={coords[0].x}
                cy={coords[0].y}
                r="4"
                fill="#2563eb"
                stroke="var(--bg-elevated, #ffffff)"
                strokeWidth="1.5"
              />
              <circle
                cx={coords[coords.length - 1].x}
                cy={coords[coords.length - 1].y}
                r="5"
                fill="#2563eb"
                stroke="var(--bg-elevated, #ffffff)"
                strokeWidth="2"
              />
            </>
          )}
        </svg>
      </div>

      {/* Timeline labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '8px',
        padding: '0 24px',
        fontSize: '0.78rem',
        color: 'var(--ink-dim, #94a3b8)',
        fontWeight: 600
      }}>
        <span>{new Date(activeData[0]?.date).toLocaleDateString(LOCALES[lang] || 'th-TH', { month: 'short', day: 'numeric' })}</span>
        <span>{new Date(activeData[Math.floor(activeData.length / 2)]?.date).toLocaleDateString(LOCALES[lang] || 'th-TH', { month: 'short', day: 'numeric' })}</span>
        <span>{new Date(activeData[activeData.length - 1]?.date).toLocaleDateString(LOCALES[lang] || 'th-TH', { month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  )
}
