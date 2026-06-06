'use client'

import styles from './page.module.css'

export interface NewsItem {
  date: string
  title: string
  url: string
  source: string
  sentiment: string
}

interface NewsFeedProps {
  news: NewsItem[]
  lang: string
  baseSymbol: string
  quoteSymbol: string
}

const NEWS_TEXTS: Record<string, {
  title: string
  subtitle: string
  sourceLabel: string
  sentimentLabel: string
  positive: string
  neutral: string
  negative: string
}> = {
  th: {
    title: 'ข่าวเศรษฐกิจและการเงินล่าสุด',
    subtitle: 'ดึงข้อมูลข่าวสารความเคลื่อนไหวและบทวิเคราะห์เกี่ยวกับค่าเงินคู่ชำระเงินโดยตรง',
    sourceLabel: 'แหล่งข่าว',
    sentimentLabel: 'ประเมินความรู้สึกตลาด',
    positive: 'บวก (Positive)',
    neutral: 'ปกติ (Neutral)',
    negative: 'ลบ (Negative)'
  },
  en: {
    title: 'Live Economic & Financial News',
    subtitle: 'Recent trade updates, policy news and market analyses related to this currency pair.',
    sourceLabel: 'Source',
    sentimentLabel: 'Market Sentiment',
    positive: 'Positive',
    neutral: 'Neutral',
    negative: 'Negative'
  },
  lo: {
    title: 'ຂ່າວເສດຖະກິດ ແລະ ການເງິນຫຼ້າສຸດ',
    subtitle: 'ດຶງຂໍ້ມູນຂ່າວສານຄວາມເຄື່ອນໄຫວ ແລະ ບົດວິເຄາະກ່ຽວກັບຄູ່ເງິນໂດຍກົງ',
    sourceLabel: 'ແຫຼ່ງຂ່າວ',
    sentimentLabel: 'ປະເມີນຄວາມຮູ້ສຶກຕະຫຼາດ',
    positive: 'ບວກ (Positive)',
    neutral: 'ປົກກະຕິ (Neutral)',
    negative: 'ລົບ (Negative)'
  },
  my: {
    title: 'နောက်ဆုံးရ စီးပွားရေးနှင့် ဘဏ္ဍာရေး သတင်းများ',
    subtitle: 'ဤငွေကြေးအတွဲနှင့် ပတ်သက်သည့် စျေးကွက်သုံးသပ်ချက်များနှင့် စီးပွားရေးသတင်းများ',
    sourceLabel: 'သတင်းရင်းမြစ်',
    sentimentLabel: 'စျေးကွက်စိတ်ခံစားမှု',
    positive: 'အကောင်းမြင် (Positive)',
    neutral: 'ပုံမှန် (Neutral)',
    negative: 'အဆိုးမြင် (Negative)'
  },
  km: {
    title: 'ព័ត៌មានសេដ្ឋកិច្ច និងហិរញ្ញវត្ថុចុងក្រោយបង្អស់',
    subtitle: 'ប្រមូលផ្តុំព័ត៌មានចុងក្រោយ ការវិភាគទីផ្សារ និងការអភិវឌ្ឍន៍ពាណិជ្ជកម្មពាក់ព័ន្ធនឹងគូរូបិយប័ណ្ណនេះ',
    sourceLabel: 'ប្រភព',
    sentimentLabel: 'សតិអារម្មណ៍ទីផ្សារ',
    positive: 'វិជ្ជមាន (Positive)',
    neutral: 'ធម្មតា (Neutral)',
    negative: 'អវិជ្ជមាន (Negative)'
  }
}

const LOCALES: Record<string, string> = {
  th: 'th-TH',
  en: 'en-US',
  lo: 'lo-LA',
  my: 'my-MM',
  km: 'km-KH',
}

export function NewsFeed({ news, lang, baseSymbol, quoteSymbol }: NewsFeedProps) {
  const t = NEWS_TEXTS[lang] || NEWS_TEXTS.th

  const getSentimentStyle = (sentiment: string) => {
    const s = sentiment.toLowerCase()
    if (s.includes('pos')) return { bg: '#d1fae5', text: '#065f46', label: t.positive }
    if (s.includes('neg')) return { bg: '#fee2e2', text: '#991b1b', label: t.negative }
    return { bg: '#f1f5f9', text: '#334155', label: t.neutral }
  }

  return (
    <section 
      style={{
        margin: '24px 0',
        border: '1px solid var(--border, rgba(148, 163, 184, 0.15))',
        background: 'var(--bg-surface, #f8fafc)',
        borderRadius: '12px',
        padding: '24px'
      }}
      aria-labelledby="news-feed-heading"
    >
      <div style={{ marginBottom: '20px' }}>
        <h2 id="news-feed-heading" style={{ fontSize: '1.32rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--ink)' }}>
          {t.title} ({baseSymbol}/{quoteSymbol})
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)', margin: 0 }}>
          {t.subtitle}
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {news.map((item, index) => {
          const sent = getSentimentStyle(item.sentiment)
          const dateFormatted = new Date(item.date).toLocaleDateString(LOCALES[lang] || 'th-TH', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })

          return (
            <article 
              key={index}
              style={{
                background: 'var(--bg-elevated, #ffffff)',
                border: '1px solid var(--border, rgba(148, 163, 184, 0.12))',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: 'transform 0.15s ease, border-color 0.15s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.01)'
              }}
              className={styles.newsCardHover}
            >
              {/* Top info row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                fontSize: '0.75rem'
              }}>
                <span style={{ color: 'var(--ink-dim, #94a3b8)', fontWeight: 600 }}>
                  {item.source} · {dateFormatted}
                </span>
                <span style={{
                  background: sent.bg,
                  color: sent.text,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.7rem'
                }}>
                  {sent.label}
                </span>
              </div>

              {/* Title / Link */}
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, lineHeight: 1.4 }}>
                <a 
                  href={item.url} 
                  target={item.url === '#' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--ink, #0f172a)',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-text, #2563eb)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ink)'}
                >
                  {item.title}
                </a>
              </h3>
            </article>
          )
        })}
      </div>
    </section>
  )
}
