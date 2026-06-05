'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Header } from '../../components/Header'
import { SeoNav } from '../../components/SeoNav'
import styles from './page.module.css'

type HeaderLanguage = 'th' | 'en' | 'lo' | 'my' | 'km'

const LANGUAGE_STORAGE_KEY = 'zrate-language'

const LANGUAGE_OPTIONS: Array<{ code: string; label: string; native: string; flag: string }> = [
  { code: 'th', label: 'Thai', native: 'ไทย', flag: '\u{1F1F9}\u{1F1ED}' },
  { code: 'en', label: 'English', native: 'English', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'lo', label: 'Lao', native: 'ລາວ', flag: '\u{1F1F1}\u{1F1E6}' },
  { code: 'my', label: 'Myanmar', native: 'မြန်မာ', flag: '\u{1F1F2}\u{1F1F2}' },
  { code: 'km', label: 'Khmer', native: 'ខ្មែរ', flag: '\u{1F1F0}\u{1F1ED}' },
]

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
  // Shared Header encapsulates theme and language switching.

  return (
    <>
      <Header lang={lang} subtitle={description} />

      <SeoNav lang={lang} active="pairs" />
    </>
  )
}
