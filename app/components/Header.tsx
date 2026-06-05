'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import pageStyles from '../page.module.css'

type LanguageCode = 'th' | 'en' | 'lo' | 'my' | 'km'

const LANGUAGE_OPTIONS = [
  { code: 'th', label: 'ไทย', native: 'ไทย', flag: '\u{1F1F9}\u{1F1ED}', locale: 'th-TH' },
  { code: 'en', label: 'English', native: 'English', flag: '\u{1F1FA}\u{1F1F8}', locale: 'en-US' },
  { code: 'lo', label: 'ລາວ', native: 'ລາວ', flag: '\u{1F1F1}\u{1F1E6}', locale: 'lo-LA' },
  { code: 'my', label: 'မြန်မာ', native: 'မြန်မာ', flag: '\u{1F1F2}\u{1F1F2}', locale: 'my-MM' },
  { code: 'km', label: 'ខ្មែរ', native: 'ខ្មែរ', flag: '\u{1F1F0}\u{1F1ED}', locale: 'km-KH' },
]

const HEADER_TEXTS: Record<LanguageCode, {
  live: string
  syncing: string
  refresh: string
  switchToDark: string
  switchToLight: string
  logoSub: string
}> = {
  th: {
    live: 'ข้อมูลสด',
    syncing: 'กำลังซิงก์...',
    refresh: 'อัปเดตเรทอัตราแลกเปลี่ยน',
    switchToDark: 'เปลี่ยนเป็นโหมดมืด',
    switchToLight: 'เปลี่ยนเป็นโหมดสว่าง',
    logoSub: 'อัตราแลกเปลี่ยนเงินและเคล็ดลับการโอนเงิน',
  },
  en: {
    live: 'Live feed',
    syncing: 'Syncing...',
    refresh: 'Refresh rates',
    switchToDark: 'Switch to dark theme',
    switchToLight: 'Switch to light theme',
    logoSub: 'Currency Rates & Remittance Insights',
  },
  lo: {
    live: 'ຂໍ້ມູ້ນສົດ',
    syncing: 'ກຳລັງຊິງກ໌...',
    refresh: 'ອັບເດດຂໍ້ມູ້ນ',
    switchToDark: 'ປ່ຽນເປັນໂຫມດມຶດ',
    switchToLight: 'ປ່ຽນເປັນໂຫມດແສງ',
    logoSub: 'ອັດຕາການດປ່ຽນເງິນ ແລະເຄັດລັບການໂອນເງິນ',
  },
  my: {
    live: 'တိုက်ရိုက်ဒေတာ',
    syncing: 'စင့်ခ်လုပ်နေသည်...',
    refresh: 'နှုန်းထားများ အပ်ဒိတ်လုပ်ရန်',
    switchToDark: 'မှောင်သောမုဒ်သို့ ပြောင်းရန်',
    switchToLight: 'လင်းသောမုဒ်သို့ ပြောင်းရန်',
    logoSub: 'ငွေလဲနှုန်းများနှင့် ငွေလွှဲဆိုင်ရာ အကြံပြုချက်များ',
  },
  km: {
    live: 'ទិន្នន័យផ្ទាល់',
    syncing: 'កំពុងធ្វើសមកាលកម្ម...',
    refresh: 'ធ្វើបច្ចុប្បន្នភាពអត្រា',
    switchToDark: 'ប្តូរទៅរបៀបងងឹត',
    switchToLight: 'ប្តូរទៅរបៀបភ្លឺ',
    logoSub: 'អត្រាប្តូរប្រាក់ និងគន្លឹះផ្ទេរប្រាក់',
  },
}

interface HeaderProps {
  lang: LanguageCode
  subtitle?: string
}

export function Header({ lang, subtitle }: HeaderProps) {
  const pathname = usePathname()
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [syncing, setSyncing] = useState(false)

  const hText = HEADER_TEXTS[lang] || HEADER_TEXTS.th
  const selectedLangOption = LANGUAGE_OPTIONS.find(o => o.code === lang) || LANGUAGE_OPTIONS[0]

  useEffect(() => {
    const htmlTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null
    if (htmlTheme) {
      setTheme(htmlTheme)
    } else {
      setTheme('dark')
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem('zrate-theme')
      if (!stored) {
        document.documentElement.setAttribute('data-theme', 'dark')
        setTheme('dark')
      }
    }
    mq.addEventListener('change', onChange)
    setLastUpdated(new Date())
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggleTheme = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('zrate-theme', next)
    setTheme(next)
  }, [theme])

  const changeLanguage = (nextLocale: string) => {
    localStorage.setItem('zrate-language', nextLocale)
    document.cookie = `zrate-language=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`

    // Robust path rewriter for the target locale
    const segments = pathname.split('/').filter(Boolean)
    const otherLocales = ['en', 'lo', 'my', 'km']
    const hasLocalePrefix = otherLocales.includes(segments[0])
    const cleanSegments = hasLocalePrefix ? segments.slice(1) : segments

    let targetPath = ''
    if (nextLocale === 'th') {
      targetPath = '/' + cleanSegments.join('/')
    } else {
      targetPath = `/${nextLocale}` + (cleanSegments.length > 0 ? '/' + cleanSegments.join('/') : '')
    }

    window.location.href = targetPath
  }

  const handleRefresh = () => {
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      setLastUpdated(new Date())
    }, 500)
  }

  return (
    <header className={pageStyles.header}>
      <Link className={pageStyles.logoArea} href={lang === 'th' ? '/' : `/${lang}`}>
        <div className={pageStyles.logoIcon}>
          <Image
            src="/zrate.png"
            alt="zrate.io"
            width={96}
            height={96}
            priority
          />
        </div>
        <div className={pageStyles.brandCopy}>
          <span className={pageStyles.logoText}>zrate.io</span>
          <span className={pageStyles.logoSub}>{subtitle || hText.logoSub}</span>
        </div>
      </Link>

      <div className={pageStyles.headerActions}>
        <div className={pageStyles.statusBar}>
          <span className={`${pageStyles.statusDot} ${syncing ? pageStyles.loading : pageStyles.live}`}></span>
          <span className={pageStyles.statusText}>
            {syncing ? hText.syncing : hText.live}
          </span>
          {lastUpdated && (
            <span className={pageStyles.updateTime} suppressHydrationWarning>
              {lastUpdated.toLocaleTimeString(selectedLangOption.locale)}
            </span>
          )}
        </div>

        <button
          className={pageStyles.iconBtn}
          onClick={handleRefresh}
          disabled={syncing}
          title={hText.refresh}
          aria-label={hText.refresh}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        </button>

        <button
          className={pageStyles.themeToggle}
          onClick={toggleTheme}
          title={theme === 'light' ? hText.switchToDark : hText.switchToLight}
          aria-label={theme === 'light' ? hText.switchToDark : hText.switchToLight}
        >
          {theme === 'light' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          )}
        </button>

        <label className={pageStyles.languageSelectWrap}>
          <span className={pageStyles.visuallyHidden}>Language</span>
          <select
            className={pageStyles.languageSelect}
            value={lang}
            onChange={e => changeLanguage(e.target.value)}
            aria-label="Language"
          >
            {LANGUAGE_OPTIONS.map(item => (
              <option key={item.code} value={item.code}>
                {item.flag} {item.native}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  )
}
