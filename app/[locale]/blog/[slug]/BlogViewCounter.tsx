'use client'

import { useEffect, useState } from 'react'
import styles from '../blog.module.css'

type LanguageCode = 'th' | 'en' | 'lo' | 'my' | 'km'

const LABELS: Record<LanguageCode, { loading: string; suffix: string }> = {
  th: { loading: 'กำลังนับคนอ่าน', suffix: 'คนอ่าน' },
  en: { loading: 'Counting readers', suffix: 'reads' },
  lo: { loading: 'ກຳລັງນັບຜູ້ອ່ານ', suffix: 'ຄົນອ່ານ' },
  my: { loading: 'ဖတ်ရှုသူများကို ရေတွက်နေသည်', suffix: 'ဖတ်ရှုသူ' },
  km: { loading: 'កំពុងរាប់អ្នកអាន', suffix: 'អ្នកអាន' },
}

function formatViews(value: number, lang: LanguageCode) {
  return new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang === 'th' ? 'th-TH' : 'en-US').format(value)
}

export function BlogViewCounter({ slug, lang }: { slug: string; lang: LanguageCode }) {
  const [views, setViews] = useState<number | null>(null)
  const label = LABELS[lang] || LABELS.en

  useEffect(() => {
    let cancelled = false

    fetch(`/api/blog-views/${encodeURIComponent(slug)}`, {
      method: 'POST',
      cache: 'no-store',
    })
      .then((response) => response.json())
      .then((data: { views?: number }) => {
        if (!cancelled) setViews(typeof data.views === 'number' ? data.views : 0)
      })
      .catch(() => {
        if (!cancelled) setViews(0)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return (
    <span className={styles.viewCounter}>
      {views === null ? label.loading : `${formatViews(views, lang)} ${label.suffix}`}
    </span>
  )
}
