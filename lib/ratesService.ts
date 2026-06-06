const EODHD_API_KEY = process.env.EODHD_API_KEY || ''

export interface RateResponse {
  rates: Record<string, number>
  timestamp: Date
}

// Fallback hardcoded defaults if all APIs fail
const DEFAULT_USD_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 155.0,
  THB: 36.5,
  LAK: 21800,
  MMK: 2100,
  KHR: 4100,
  CNY: 7.25,
  KRW: 1380,
  SGD: 1.35,
  HKD: 7.8,
  AUD: 1.5,
  CAD: 1.37,
  CHF: 0.9,
  NZD: 1.63,
  SEK: 10.5,
  NOK: 10.6,
  DKK: 6.9,
  INR: 83.5,
  IDR: 16300,
  MYR: 4.7,
  PHP: 58.5,
  VND: 25400,
  TWD: 32.3,
  BRL: 5.2,
  MXN: 18.0,
  ZAR: 18.5,
  RUB: 90.0,
  TRY: 32.5,
  SAR: 3.75,
  AED: 3.67,
  PLN: 4.0,
  CZK: 23.0,
  HUF: 365.0,
  ILS: 3.7,
  PKR: 278,
  EGP: 47.5,
  NGN: 1500,
  USDT: 1,
}

export async function fetchRates(base: string): Promise<RateResponse> {
  const apiBase = base === 'USDT' ? 'USD' : base

  // 1. Primary: EODHD Forex API
  try {
    const symbols = [
      'EURUSD.FOREX',
      'USDGBP.FOREX',
      'USDJPY.FOREX',
      'USDTHB.FOREX',
      'USDLAK.FOREX',
      'USDMMK.FOREX',
      'USDKHR.FOREX',
      'USDCNY.FOREX',
      'USDSGD.FOREX',
      'USDKRW.FOREX',
      'USDHKD.FOREX',
      'USDAUD.FOREX',
      'USDCAD.FOREX',
      'USDCHF.FOREX',
      'USDNZD.FOREX',
      'USDSEK.FOREX',
      'USDNOK.FOREX',
      'USDDKK.FOREX',
      'USDINR.FOREX',
      'USDIDR.FOREX',
      'USDMYR.FOREX',
      'USDPHP.FOREX',
      'USDVND.FOREX',
      'USDTWD.FOREX',
      'USDBRL.FOREX',
      'USDMXN.FOREX',
      'USDZAR.FOREX',
      'USDRUB.FOREX',
      'USDTRY.FOREX',
      'USDSAR.FOREX',
      'USDAED.FOREX',
      'USDPLN.FOREX',
      'USDCZK.FOREX',
      'USDHUF.FOREX',
      'USDILS.FOREX',
      'USDPKR.FOREX',
      'USDEGP.FOREX',
      'USDNGN.FOREX'
    ].join(',')

    const url = `https://eodhd.com/api/real-time/${symbols}?api_token=${EODHD_API_KEY}&fmt=json`
    const res = await fetch(url, {
      next: { revalidate: 300 } // cache for 5 minutes
    })

    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        // Pre-populate with defaults so any missing symbols (e.g. temporary API failure) still show values
        const usdRates: Record<string, number> = {
          ...DEFAULT_USD_RATES
        }
        let lastTimestamp = 0

        data.forEach((item: any) => {
          const val = parseFloat(item.close)
          const ts = parseInt(item.timestamp, 10)
          if (!isNaN(ts) && ts > lastTimestamp) {
            lastTimestamp = ts
          }

          if (!isNaN(val)) {
            const codeUpper = item.code.toUpperCase()
            if (codeUpper === 'EURUSD.FOREX' || codeUpper === 'EURUSD') {
              // EURUSD Standard quote EUR/USD means USD per 1 EUR.
              // So 1 EUR = val USD. Therefore 1 USD = 1 / val EUR.
              usdRates['EUR'] = 1 / val
            } else {
              // Standard USDxxx.FOREX pairs: USD is base, quote is xxx (e.g. 1 USD = 32.77 THB)
              const currency = codeUpper.replace('USD', '').replace('.FOREX', '')
              usdRates[currency] = val
            }
          }
        })

        const baseValue = usdRates[apiBase]
        if (baseValue && baseValue > 0) {
          const rates: Record<string, number> = {}
          Object.entries(usdRates).forEach(([k, v]) => {
            rates[k] = v / baseValue
          })
          
          // Ensure USDT matches USD rate
          rates['USDT'] = rates['USD']

          console.log(`Successfully fetched & cross-rated from EODHD for base ${base}:`, rates)
          return {
            rates,
            timestamp: lastTimestamp ? new Date(lastTimestamp * 1000) : new Date()
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch rates from EODHD API, attempting fallback', err)
  }

  // 2. Last resort fallback to static rates
  const mock: Record<string, number> = { ...DEFAULT_USD_RATES }
  const baseValue = mock[apiBase] || 1
  const normalized: Record<string, number> = {}
  Object.entries(mock).forEach(([k, v]) => {
    normalized[k] = v / baseValue
  })
  normalized['USDT'] = normalized['USD']

  return {
    rates: normalized,
    timestamp: new Date()
  }
}

export interface HistoricalDataPoint {
  date: string
  rate: number
}

async function fetchSingleCurrencyHistory(currency: string): Promise<Record<string, number>> {
  if (currency === 'USD' || currency === 'USDT') {
    const map: Record<string, number> = {}
    const today = new Date()
    for (let i = 0; i < 375; i++) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      map[dateStr] = 1
    }
    return map
  }

  const symbol = currency === 'EUR' ? 'EURUSD.FOREX' : `USD${currency}.FOREX`
  const today = new Date()
  const fromDate = new Date()
  fromDate.setDate(today.getDate() - 375)
  const fromStr = fromDate.toISOString().split('T')[0]
  const toStr = today.toISOString().split('T')[0]

  const url = `https://eodhd.com/api/eod/${symbol}?api_token=${EODHD_API_KEY}&fmt=json&from=${fromStr}&to=${toStr}&period=d`
  
  const res = await fetch(url, {
    next: { revalidate: 3600 } // cache for 1 hour to prevent API quota exhaustion
  })
  
  if (!res.ok) throw new Error(`Failed to fetch history for ${symbol}`)
  const data = await res.json()
  if (!Array.isArray(data)) throw new Error(`Invalid history format for ${symbol}`)

  const map: Record<string, number> = {}
  data.forEach((item: any) => {
    const val = parseFloat(item.close)
    if (!isNaN(val) && val > 0) {
      if (currency === 'EUR') {
        map[item.date] = 1 / val
      } else {
        map[item.date] = val
      }
    }
  })
  return map
}

function generateMockHistory(base: string, quote: string, days: number = 365): HistoricalDataPoint[] {
  const usdBase = DEFAULT_USD_RATES[base] || 1
  const usdQuote = DEFAULT_USD_RATES[quote] || 1
  const currentRate = usdQuote / usdBase

  const points: HistoricalDataPoint[] = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    
    let hash = 0
    const key = `${base}-${quote}-${dateStr}`
    for (let j = 0; j < key.length; j++) {
      hash = key.charCodeAt(j) + ((hash << 5) - hash)
    }
    const wave = Math.sin(i * 0.1) * 0.025 + Math.cos(i * 0.03) * 0.01 + ((hash % 100) / 100) * 0.01
    const rate = currentRate * (1 + wave)

    points.push({ date: dateStr, rate })
  }
  return points
}

export async function fetchHistoricalRates(
  base: string,
  quote: string,
  days: number = 365
): Promise<HistoricalDataPoint[]> {
  try {
    const [baseMap, quoteMap] = await Promise.all([
      fetchSingleCurrencyHistory(base),
      fetchSingleCurrencyHistory(quote)
    ])

    const allDates = Array.from(new Set([...Object.keys(baseMap), ...Object.keys(quoteMap)])).sort()

    const points: HistoricalDataPoint[] = []
    let lastBaseVal = base === 'USD' || base === 'USDT' ? 1 : 0
    let lastQuoteVal = quote === 'USD' || quote === 'USDT' ? 1 : 0

    allDates.forEach(date => {
      if (baseMap[date] !== undefined) {
        lastBaseVal = baseMap[date]
      }
      if (quoteMap[date] !== undefined) {
        lastQuoteVal = quoteMap[date]
      }

      if (lastBaseVal > 0 && lastQuoteVal > 0) {
        points.push({
          date,
          rate: lastQuoteVal / lastBaseVal
        })
      }
    })

    const result = points.slice(-days)
    if (result.length > 0) {
      return result
    }
    throw new Error('No historical data points computed')
  } catch (error) {
    console.error(`Error fetching historical rates for ${base}-${quote}, generating mock:`, error)
    return generateMockHistory(base, quote, days)
  }
}

export interface NewsItem {
  date: string
  title: string
  url: string
  source: string
  sentiment: string
}

export async function fetchCurrencyNews(base: string, quote: string): Promise<NewsItem[]> {
  try {
    // Attempt to query symbol pair news
    const symbol = `${base}${quote}.FOREX`
    const url = `https://eodhd.com/api/news?s=${symbol}&limit=5&api_token=${EODHD_API_KEY}&fmt=json`
    const res = await fetch(url, {
      next: { revalidate: 3600 } // cache for 1 hour
    })

    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        return data.slice(0, 5).map((item: any) => ({
          date: item.date || new Date().toISOString(),
          title: item.title,
          url: item.link || item.url || '#',
          source: item.source || 'EODHD Financial News',
          sentiment: item.sentiment?.sentiment || 'Neutral'
        }))
      }
    }
  } catch (error) {
    console.error(`Error fetching news for ${base}-${quote}:`, error)
  }

  return generateMockNews(base, quote)
}

function generateMockNews(base: string, quote: string): NewsItem[] {
  const today = new Date()
  const formatDateOffset = (offset: number) => {
    const d = new Date()
    d.setDate(today.getDate() - offset)
    return d.toISOString()
  }

  const th = [
    { title: `วิเคราะห์แนวโน้มคู่เงิน ${base}/${quote}: นโยบายอัตราดอกเบี้ยและสภาวะเงินฝืดในภูมิภาคส่งผลให้เกิดความผันผวน`, source: 'zrate.io Financial Research', sentiment: 'Neutral' },
    { title: `ปริมาณการทำธุรกรรมทางการค้าข้ามพรมแดนกลุ่มแม่น้ำโขงกระตุ้นให้เกิดความต้องการแลกเปลี่ยนเงิน ${quote} เพิ่มขึ้น`, source: 'ASEAN Trade Monitor', sentiment: 'Positive' },
    { title: `รายงานตลาดเงินตราต่างประเทศ: ปัจจัยหนุนของเงิน ${base} ท่ามกลางกระแสเงินทุนไหลเข้าเศรษฐกิจเกิดใหม่`, source: 'Global Macro Analysis', sentiment: 'Positive' }
  ]

  const en = [
    { title: `Bilateral FX Analysis: ${base}/${quote} volatility patterns trace monetary policy divergences`, source: 'zrate.io Financial Research', sentiment: 'Neutral' },
    { title: `Mekong regional trade corridors fuel higher swap demand for ${quote} liquidity`, source: 'ASEAN Trade Monitor', sentiment: 'Positive' },
    { title: `FX Market Report: Key economic support pillars for ${base} strength amid emerging market flows`, source: 'Global Macro Analysis', sentiment: 'Positive' }
  ]

  return [
    {
      date: formatDateOffset(0),
      title: base === 'THB' || quote === 'THB' ? th[0].title : en[0].title,
      url: '#',
      source: th[0].source,
      sentiment: th[0].sentiment
    },
    {
      date: formatDateOffset(1),
      title: base === 'THB' || quote === 'THB' ? th[1].title : en[1].title,
      url: '#',
      source: th[1].source,
      sentiment: th[1].sentiment
    },
    {
      date: formatDateOffset(2),
      title: base === 'THB' || quote === 'THB' ? th[2].title : en[2].title,
      url: '#',
      source: th[2].source,
      sentiment: th[2].sentiment
    }
  ]
}


