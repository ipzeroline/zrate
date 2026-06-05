'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from './page.module.css'

type HeaderLanguage = 'th' | 'en' | 'lo' | 'my' | 'km'

const LANGUAGE_STORAGE_KEY = 'zrate-language'

const LANGUAGE_OPTIONS: Array<{ code: string; label: string; native: string; flag: string }> = [
  { code: 'th', label: 'Thai', native: 'ไทย', flag: '\u{1F1F9}\u{1F1ED}' },
  { code: 'en', label: 'English', native: 'English', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'la', label: 'Lao', native: 'ລາວ', flag: '\u{1F1F1}\u{1F1E6}' },
  { code: 'my', label: 'Myanmar', native: 'မြန်မာ', flag: '\u{1F1F2}\u{1F1F2}' },
  { code: 'kh', label: 'Khmer', native: 'ខ្មែរ', flag: '\u{1F1F0}\u{1F1ED}' },
]

const LANGUAGE_VALUE: Record<HeaderLanguage, string> = {
  th: 'th',
  en: 'en',
  lo: 'la',
  my: 'my',
  km: 'kh',
}

const HEADER_TEXT: Record<HeaderLanguage, {
  language: string
  live: string
  switchToDark: string
  switchToLight: string
}> = {
  th: {
    language: 'ภาษา',
    live: 'ข้อมูลสด',
    switchToDark: 'เปลี่ยนเป็นโหมดมืด',
    switchToLight: 'เปลี่ยนเป็นโหมดสว่าง',
  },
  en: {
    language: 'Language',
    live: 'Live feed',
    switchToDark: 'Switch to dark mode',
    switchToLight: 'Switch to light mode',
  },
  lo: {
    language: 'ພາສາ',
    live: 'ຂໍ້ມູນສົດ',
    switchToDark: 'ປ່ຽນເປັນໂໝດມືດ',
    switchToLight: 'ປ່ຽນເປັນໂໝດສະຫວ່າງ',
  },
  my: {
    language: 'ဘာသာစကား',
    live: 'တိုက်ရိုက်ဒေတာ',
    switchToDark: 'အမှောင်မုဒ်သို့ပြောင်းရန်',
    switchToLight: 'အလင်းမုဒ်သို့ပြောင်းရန်',
  },
  km: {
    language: 'ភាសា',
    live: 'ទិន្នន័យផ្ទាល់',
    switchToDark: 'ប្តូរទៅរបៀបងងឹត',
    switchToLight: 'ប្តូរទៅរបៀបភ្លឺ',
  },
}

export function PairTopBar({
  lang,
  title,
  description,
}: {
  lang: HeaderLanguage
  title: string
  description: string
}) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const text = HEADER_TEXT[lang]

  useEffect(() => {
    const htmlTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null
    if (htmlTheme) setTheme(htmlTheme)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('zrate-theme', next)
    setTheme(next)
  }

  const changeLanguage = (nextLanguage: string) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
    document.cookie = `${LANGUAGE_STORAGE_KEY}=${nextLanguage}; path=/; max-age=31536000; SameSite=Lax`
    window.location.reload()
  }

  return (
    <header className={styles.header}>
      <Link className={styles.logoArea} href="/">
        <span className={styles.logoIcon}>
          <Image src="/zrate.png" alt="zrate.io" width={96} height={96} priority />
        </span>
        <span className={styles.brandCopy}>
          <span className={styles.logoText}>{title}</span>
          <span className={styles.logoSub}>{description}</span>
        </span>
      </Link>

      <div className={styles.headerActions}>
        <div className={styles.statusBar}>
          <span className={`${styles.statusDot} ${styles.live}`}></span>
          <span className={styles.statusText}>{text.live}</span>
        </div>

        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          title={theme === 'light' ? text.switchToDark : text.switchToLight}
          aria-label={theme === 'light' ? text.switchToDark : text.switchToLight}
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

        <label className={styles.languageSelectWrap}>
          <span className={styles.visuallyHidden}>{text.language}</span>
          <select
            className={styles.languageSelect}
            value={LANGUAGE_VALUE[lang]}
            onChange={event => changeLanguage(event.target.value)}
            aria-label={text.language}
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
