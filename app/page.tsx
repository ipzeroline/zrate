'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { NativeBannerAd, ResponsiveBannerAd } from './components/AdsterraAds'
import styles from './page.module.css'

const CURRENCY_INFO: Record<string, { flag: string; name: string; symbol: string }> = {
  USD: { flag: '🇺🇸', name: 'US Dollar', symbol: '$' },
  EUR: { flag: '🇪🇺', name: 'Euro', symbol: '€' },
  GBP: { flag: '🇬🇧', name: 'British Pound', symbol: '£' },
  JPY: { flag: '🇯🇵', name: 'Japanese Yen', symbol: '¥' },
  THB: { flag: '🇹🇭', name: 'Thai Baht', symbol: '฿' },
  LAK: { flag: '🇱🇦', name: 'Lao Kip', symbol: '₭' },
  MMK: { flag: '🇲🇲', name: 'Myanmar Kyat', symbol: 'K' },
  KHR: { flag: '🇰🇭', name: 'Cambodian Riel', symbol: '៛' },
  CNY: { flag: '🇨🇳', name: 'Chinese Yuan', symbol: '¥' },
  KRW: { flag: '🇰🇷', name: 'Korean Won', symbol: '₩' },
  SGD: { flag: '🇸🇬', name: 'Singapore Dollar', symbol: 'S$' },
  HKD: { flag: '🇭🇰', name: 'Hong Kong Dollar', symbol: 'HK$' },
  AUD: { flag: '🇦🇺', name: 'Australian Dollar', symbol: 'A$' },
  CAD: { flag: '🇨🇦', name: 'Canadian Dollar', symbol: 'C$' },
  CHF: { flag: '🇨🇭', name: 'Swiss Franc', symbol: 'Fr' },
  NZD: { flag: '🇳🇿', name: 'NZ Dollar', symbol: 'NZ$' },
  SEK: { flag: '🇸🇪', name: 'Swedish Krona', symbol: 'kr' },
  NOK: { flag: '🇳🇴', name: 'Norwegian Krone', symbol: 'kr' },
  DKK: { flag: '🇩🇰', name: 'Danish Krone', symbol: 'kr' },
  INR: { flag: '🇮🇳', name: 'Indian Rupee', symbol: '₹' },
  IDR: { flag: '🇮🇩', name: 'Indonesian Rupiah', symbol: 'Rp' },
  MYR: { flag: '🇲🇾', name: 'Malaysian Ringgit', symbol: 'RM' },
  PHP: { flag: '🇵🇭', name: 'Philippine Peso', symbol: '₱' },
  VND: { flag: '🇻🇳', name: 'Vietnamese Dong', symbol: '₫' },
  TWD: { flag: '🇹🇼', name: 'Taiwan Dollar', symbol: 'NT$' },
  BRL: { flag: '🇧🇷', name: 'Brazilian Real', symbol: 'R$' },
  MXN: { flag: '🇲🇽', name: 'Mexican Peso', symbol: '$' },
  ZAR: { flag: '🇿🇦', name: 'South African Rand', symbol: 'R' },
  RUB: { flag: '🇷🇺', name: 'Russian Ruble', symbol: '₽' },
  TRY: { flag: '🇹🇷', name: 'Turkish Lira', symbol: '₺' },
  SAR: { flag: '🇸🇦', name: 'Saudi Riyal', symbol: '﷼' },
  AED: { flag: '🇦🇪', name: 'UAE Dirham', symbol: 'د.إ' },
  PLN: { flag: '🇵🇱', name: 'Polish Zloty', symbol: 'zł' },
  CZK: { flag: '🇨🇿', name: 'Czech Koruna', symbol: 'Kč' },
  HUF: { flag: '🇭🇺', name: 'Hungarian Forint', symbol: 'Ft' },
  ILS: { flag: '🇮🇱', name: 'Israeli Shekel', symbol: '₪' },
  PKR: { flag: '🇵🇰', name: 'Pakistani Rupee', symbol: '₨' },
  EGP: { flag: '🇪🇬', name: 'Egyptian Pound', symbol: 'E£' },
  NGN: { flag: '🇳🇬', name: 'Nigerian Naira', symbol: '₦' },
  USDT: { flag: '₮', name: 'Tether USD', symbol: '₮' },
}

type Rates = Record<string, number>
type LanguageCode = 'th' | 'en' | 'la' | 'my' | 'kh'

const LANGUAGE_OPTIONS: Array<{ code: LanguageCode; label: string; native: string; flag: string; currency: string; locale: string }> = [
  { code: 'th', label: 'ไทย', native: 'ไทย', flag: '🇹🇭', currency: 'THB', locale: 'th-TH' },
  { code: 'en', label: 'English', native: 'English', flag: '🇺🇸', currency: 'USD', locale: 'en-US' },
  { code: 'la', label: 'ລາວ', native: 'ລາວ', flag: '🇱🇦', currency: 'LAK', locale: 'lo-LA' },
  { code: 'my', label: 'မြန်မာ', native: 'မြန်မာ', flag: '🇲🇲', currency: 'MMK', locale: 'my-MM' },
  { code: 'kh', label: 'ខ្មែរ', native: 'ខ្មែរ', flag: '🇰🇭', currency: 'KHR', locale: 'km-KH' },
]

const UI_TEXT: Record<LanguageCode, {
  heroTitle: string
  heroDescription: string
  subtitle: string
  baseCurrency: string
  amount: string
  from: string
  language: string
  searchPlaceholder: string
  currencies: string
  syncing: string
  offline: string
  live: string
  crypto: string
  active: string
  setBase: string
  addFavorite: string
  removeFavorite: string
  loading: string
  footerData: string
  footerSync: string
  error: string
  seoHeading: string
  seoIntro: string
  seoCards: Array<{ title: string; body: string }>
}> = {
  th: { heroTitle: 'อัตราแลกเปลี่ยนวันนี้ | zrate.io', heroDescription: 'เช็กค่าเงินและแปลงสกุลเงินแบบเรียลไทม์สำหรับเงินบาท ดอลลาร์ USDT และสกุลเงินยอดนิยมทั่วโลก', subtitle: 'เมทริกซ์อัตราแลกเปลี่ยนแบบเรียลไทม์', baseCurrency: 'สกุลเงินหลัก', amount: 'จำนวนเงิน', from: 'จากสกุลเงิน', language: 'ภาษา', searchPlaceholder: 'ค้นหาสกุลเงิน / รหัส...', currencies: 'สกุลเงิน', syncing: 'กำลังซิงก์...', offline: 'โหมดออฟไลน์', live: 'ข้อมูลสด', crypto: 'คริปโต', active: 'ใช้งานอยู่', setBase: 'ตั้งเป็นสกุลหลัก', addFavorite: 'เพิ่มรายการโปรด', removeFavorite: 'ลบจากรายการโปรด', loading: 'กำลังเชื่อมต่อข้อมูลอัตราแลกเปลี่ยน...', footerData: 'ข้อมูล: EXCHANGERATE-API', footerSync: 'ซิงก์อัตโนมัติ: 60 วินาที', error: 'สัญญาณขาดหาย — ใช้ข้อมูลสำรอง', seoHeading: 'เครื่องมือแปลงค่าเงินออนไลน์สำหรับทุกวัน', seoIntro: 'zrate.io ช่วยให้ดูอัตราแลกเปลี่ยนล่าสุด เปรียบเทียบหลายสกุลเงิน และคำนวณยอดเงินได้รวดเร็วในหน้าเดียว', seoCards: [{ title: 'อัตราแลกเปลี่ยนสด', body: 'อัปเดตค่าเงินจากแหล่งข้อมูลออนไลน์ พร้อมข้อมูลสำรองเมื่อสัญญาณขาดหาย' }, { title: 'รองรับหลายสกุลเงิน', body: 'เช็ก THB, USD, EUR, JPY, LAK, MMK, KHR, CNY และ USDT ได้สะดวก' }, { title: 'ใช้งานง่ายทุกภาษา', body: 'รองรับภาษาไทย อังกฤษ ลาว เมียนมา และกัมพูชา เพื่อการใช้งานในภูมิภาค' }] },
  en: { heroTitle: 'Live exchange rates today | zrate.io', heroDescription: 'Check exchange rates and convert THB, USD, USDT and major world currencies in real time.', subtitle: 'Real-time currency exchange matrix', baseCurrency: 'Base currency', amount: 'Amount', from: 'From', language: 'Language', searchPlaceholder: 'Search currency / code...', currencies: 'currencies', syncing: 'Syncing...', offline: 'Offline mode', live: 'Live feed', crypto: 'Crypto', active: 'Active', setBase: 'Set base', addFavorite: 'Add to favorites', removeFavorite: 'Remove from favorites', loading: 'Connecting to exchange nodes...', footerData: 'Data: EXCHANGERATE-API', footerSync: 'Auto-sync: 60s', error: 'Signal lost — using cached data', seoHeading: 'Fast online currency converter', seoIntro: 'zrate.io makes it easy to compare exchange rates, calculate conversions, and track popular currencies from one clean page.', seoCards: [{ title: 'Live exchange rates', body: 'Rates refresh from online data with cached fallback when the connection is unavailable.' }, { title: 'Major currencies and USDT', body: 'Follow THB, USD, EUR, JPY, LAK, MMK, KHR, CNY, USDT and more.' }, { title: 'Regional language support', body: 'Use the converter in Thai, English, Lao, Myanmar and Khmer for everyday exchange needs.' }] },
  la: { heroTitle: 'ອັດຕາແລກປ່ຽນເງິນມື້ນີ້ | zrate.io', heroDescription: 'ກວດເບິ່ງຄ່າເງິນ ແລະ ແປງສະກຸນເງິນ THB, USD, USDT ແລະສະກຸນຫຼັກແບບສົດ.', subtitle: 'ຕາຕະລາງອັດຕາແລກປ່ຽນແບບສົດ', baseCurrency: 'ສະກຸນເງິນຫຼັກ', amount: 'ຈຳນວນເງິນ', from: 'ຈາກສະກຸນເງິນ', language: 'ພາສາ', searchPlaceholder: 'ຄົ້ນຫາສະກຸນເງິນ / ລະຫັດ...', currencies: 'ສະກຸນເງິນ', syncing: 'ກຳລັງຊິງກ໌...', offline: 'ໂໝດອອບລາຍ', live: 'ຂໍ້ມູນສົດ', crypto: 'ຄຣິບໂຕ', active: 'ກຳລັງໃຊ້', setBase: 'ຕັ້ງເປັນສະກຸນຫຼັກ', addFavorite: 'ເພີ່ມລາຍການມັກ', removeFavorite: 'ລຶບອອກຈາກລາຍການມັກ', loading: 'ກຳລັງເຊື່ອມຕໍ່ຂໍ້ມູນແລກປ່ຽນ...', footerData: 'ຂໍ້ມູນ: EXCHANGERATE-API', footerSync: 'ຊິງກ໌ອັດຕະໂນມັດ: 60 ວິນາທີ', error: 'ສັນຍານຂາດ — ໃຊ້ຂໍ້ມູນສຳຮອງ', seoHeading: 'ເຄື່ອງມືແປງຄ່າເງິນອອນລາຍ', seoIntro: 'zrate.io ຊ່ວຍໃຫ້ເບິ່ງອັດຕາລ່າສຸດ ປຽບທຽບຫຼາຍສະກຸນ ແລະຄຳນວນໄດ້ໄວ.', seoCards: [{ title: 'ອັດຕາແບບສົດ', body: 'ອັບເດດຄ່າເງິນຈາກຂໍ້ມູນອອນລາຍ ພ້ອມຂໍ້ມູນສຳຮອງ.' }, { title: 'ຮອງຮັບຫຼາຍສະກຸນ', body: 'ເບິ່ງ THB, USD, EUR, JPY, LAK, MMK, KHR, CNY ແລະ USDT.' }, { title: 'ພາສາໃນພາກພື້ນ', body: 'ໃຊ້ໄດ້ທັງພາສາລາວ ໄທ ອັງກິດ ມຽນມາ ແລະຂະແມ.' }] },
  my: { heroTitle: 'ယနေ့ ငွေလဲနှုန်းများ | zrate.io', heroDescription: 'THB, USD, USDT နှင့် နာမည်ကြီး ငွေကြေးများကို အချိန်နှင့်တပြေးညီ စစ်ဆေးပြီး ပြောင်းလဲတွက်ချက်ပါ။', subtitle: 'အချိန်နှင့်တပြေးညီ ငွေလဲနှုန်းမက်ထရစ်', baseCurrency: 'အခြေခံငွေကြေး', amount: 'ပမာဏ', from: 'မှ', language: 'ဘာသာစကား', searchPlaceholder: 'ငွေကြေး / ကုဒ် ရှာရန်...', currencies: 'ငွေကြေးများ', syncing: 'စင့်ခ်လုပ်နေသည်...', offline: 'အော့ဖ်လိုင်းမုဒ်', live: 'တိုက်ရိုက်ဒေတာ', crypto: 'ခရစ်ပတို', active: 'အသုံးပြုနေသည်', setBase: 'အခြေခံငွေကြေးထားရန်', addFavorite: 'စိတ်ကြိုက်ထဲထည့်ရန်', removeFavorite: 'စိတ်ကြိုက်မှဖယ်ရန်', loading: 'ငွေလဲဒေတာ ချိတ်ဆက်နေသည်...', footerData: 'ဒေတာ: EXCHANGERATE-API', footerSync: 'အလိုအလျောက်စင့်ခ်: 60 စက္ကန့်', error: 'ချိတ်ဆက်မှုပြတ်တောက် — သိမ်းထားသောဒေတာသုံးနေသည်', seoHeading: 'လွယ်ကူသော အွန်လိုင်း ငွေကြေးပြောင်းစက်', seoIntro: 'zrate.io ဖြင့် ငွေလဲနှုန်းများကို နှိုင်းယှဉ်ကြည့်ရှုပြီး တစ်နေရာတည်းတွင် မြန်မြန်တွက်ချက်နိုင်ပါသည်။', seoCards: [{ title: 'တိုက်ရိုက် ငွေလဲနှုန်း', body: 'အွန်လိုင်းဒေတာမှ အချိန်နှင့်တပြေးညီ အပ်ဒိတ်လုပ်ပြီး ချိတ်ဆက်မှုပြတ်လျှင် သိမ်းထားသောဒေတာကိုသုံးသည်။' }, { title: 'ငွေကြေးများစွာ', body: 'THB, USD, EUR, JPY, LAK, MMK, KHR, CNY နှင့် USDT ကို စစ်ဆေးနိုင်သည်။' }, { title: 'ဒေသသုံး ဘာသာစကား', body: 'မြန်မာ၊ ထိုင်း၊ အင်္ဂလိပ်၊ လာအို နှင့် ခမာ ဘာသာများကို အသုံးပြုနိုင်သည်။' }] },
  kh: { heroTitle: 'អត្រាប្តូរប្រាក់ថ្ងៃនេះ | zrate.io', heroDescription: 'ពិនិត្យ និងបម្លែង THB, USD, USDT និងរូបិយប័ណ្ណពេញនិយមជាច្រើនតាមពេលវេលាពិត។', subtitle: 'ម៉ាទ្រីសអត្រាប្តូរប្រាក់ពេលវេលាពិត', baseCurrency: 'រូបិយប័ណ្ណគោល', amount: 'ចំនួនប្រាក់', from: 'ពីរូបិយប័ណ្ណ', language: 'ភាសា', searchPlaceholder: 'ស្វែងរករូបិយប័ណ្ណ / កូដ...', currencies: 'រូបិយប័ណ្ណ', syncing: 'កំពុងធ្វើសមកាលកម្ម...', offline: 'របៀបក្រៅបណ្ដាញ', live: 'ទិន្នន័យផ្ទាល់', crypto: 'គ្រីបតូ', active: 'កំពុងប្រើ', setBase: 'កំណត់ជាគោល', addFavorite: 'បន្ថែមទៅចំណូលចិត្ត', removeFavorite: 'ដកចេញពីចំណូលចិត្ត', loading: 'កំពុងភ្ជាប់ទិន្នន័យអត្រាប្តូរ...', footerData: 'ទិន្នន័យ: EXCHANGERATE-API', footerSync: 'សមកាលកម្មស្វ័យប្រវត្តិ: 60 វិនាទី', error: 'បាត់សញ្ញា — ប្រើទិន្នន័យបម្រុង', seoHeading: 'ឧបករណ៍បម្លែងរូបិយប័ណ្ណអនឡាញ', seoIntro: 'zrate.io ជួយប្រៀបធៀបអត្រាប្តូរប្រាក់ គណនាចំនួនប្រាក់ និងតាមដានរូបិយប័ណ្ណសំខាន់ៗក្នុងទំព័រតែមួយ។', seoCards: [{ title: 'អត្រាប្តូរប្រាក់ផ្ទាល់', body: 'ធ្វើបច្ចុប្បន្នភាពពីទិន្នន័យអនឡាញ និងមានទិន្នន័យបម្រុងពេលបាត់ការតភ្ជាប់។' }, { title: 'គាំទ្ររូបិយប័ណ្ណច្រើន', body: 'ពិនិត្យ THB, USD, EUR, JPY, LAK, MMK, KHR, CNY និង USDT បានងាយស្រួល។' }, { title: 'ភាសាក្នុងតំបន់', body: 'ប្រើបានជាភាសាខ្មែរ ថៃ អង់គ្លេស ឡាវ និងមីយ៉ាន់ម៉ា។' }] },
}

const CURRENCY_PRIORITY: Record<LanguageCode, string[]> = {
  th: ['THB', 'USD', 'USDT', 'EUR', 'JPY', 'LAK', 'MMK', 'KHR'],
  en: ['USD', 'USDT', 'EUR', 'GBP', 'JPY', 'THB', 'SGD', 'AUD'],
  la: ['LAK', 'THB', 'USD', 'USDT', 'CNY', 'VND', 'KHR', 'MMK'],
  my: ['MMK', 'THB', 'USD', 'USDT', 'SGD', 'CNY', 'INR', 'KHR'],
  kh: ['KHR', 'THB', 'USD', 'USDT', 'CNY', 'VND', 'LAK', 'MMK'],
}

const SEO_PAIR_LINKS = [
  { href: '/usd-thb', label: 'USD/THB' },
  { href: '/usd-lak', label: 'USD/LAK' },
  { href: '/usd-mmk', label: 'USD/MMK' },
  { href: '/usd-khr', label: 'USD/KHR' },
  { href: '/eur-thb', label: 'EUR/THB' },
  { href: '/eur-usd', label: 'EUR/USD' },
  { href: '/thb-usd', label: 'THB/USD' },
  { href: '/thb-lak', label: 'THB/LAK' },
  { href: '/thb-mmk', label: 'THB/MMK' },
  { href: '/thb-khr', label: 'THB/KHR' },
  { href: '/thb-jpy', label: 'THB/JPY' },
  { href: '/thb-cny', label: 'THB/CNY' },
  { href: '/usdt-thb', label: 'USDT/THB' },
  { href: '/usdt-usd', label: 'USDT/USD' },
  { href: '/jpy-thb', label: 'JPY/THB' },
  { href: '/cny-thb', label: 'CNY/THB' },
  { href: '/sgd-thb', label: 'SGD/THB' },
  { href: '/krw-thb', label: 'KRW/THB' },
]

export default function Home() {
  const [rates, setRates] = useState<Rates>({})
  const [language, setLanguage] = useState<LanguageCode>('th')
  const [baseCurrency, setBaseCurrency] = useState('THB')
  const [amount, setAmount] = useState('1')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [glitchActive, setGlitchActive] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(CURRENCY_PRIORITY.th)

  const fetchRates = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
      )
      if (!res.ok) throw new Error('Network error')
      const data = await res.json()
      const combined: Rates = { ...data.rates, USDT: data.rates['USD'] || 1 }
      setRates(combined)
      setLastUpdated(new Date())
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 600)
    } catch {
      setError(UI_TEXT[language].error)
      // fallback mock rates
      const mock: Rates = {
        USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, THB: 35.2, LAK: 21000, MMK: 2100, KHR: 4100, CNY: 7.24,
        KRW: 1325, SGD: 1.34, HKD: 7.82, AUD: 1.53, CAD: 1.36, CHF: 0.89,
        NZD: 1.63, SEK: 10.42, NOK: 10.55, DKK: 6.89, INR: 83.1, IDR: 15680,
        MYR: 4.47, PHP: 56.2, VND: 24380, TWD: 31.8, BRL: 4.97, MXN: 17.15,
        ZAR: 18.63, RUB: 90.5, TRY: 32.1, SAR: 3.75, AED: 3.67, PLN: 3.98,
        CZK: 22.9, HUF: 356, ILS: 3.62, PKR: 278, EGP: 47.5, NGN: 1580, USDT: 1
      }
      const converted: Rates = {}
      const base = mock[baseCurrency] || 1
      Object.entries(mock).forEach(([k, v]) => { converted[k] = v / base })
      setRates(converted)
    } finally {
      setLoading(false)
    }
  }, [baseCurrency, language])

  useEffect(() => {
    fetchRates()
    const interval = setInterval(fetchRates, 60000)
    return () => clearInterval(interval)
  }, [fetchRates])

  const t = UI_TEXT[language]
  const selectedLanguage = LANGUAGE_OPTIONS.find(item => item.code === language) ?? LANGUAGE_OPTIONS[0]
  const isCompactTitle = language === 'la' || language === 'my' || language === 'kh'
  const amountNum = parseFloat(amount) || 0
  const currencies = Object.keys(CURRENCY_INFO)
  const filtered = currencies.filter(c =>
    c.toLowerCase().includes(search.toLowerCase()) ||
    CURRENCY_INFO[c].name.toLowerCase().includes(search.toLowerCase())
  )

  const sortedCurrencies = useMemo(() => {
    const preferred = CURRENCY_PRIORITY[language]
    return [...filtered].sort((a, b) => {
      const favoriteDiff = Number(favorites.includes(b)) - Number(favorites.includes(a))
      if (favoriteDiff !== 0) return favoriteDiff
      const aPriority = preferred.indexOf(a)
      const bPriority = preferred.indexOf(b)
      if (aPriority !== -1 || bPriority !== -1) {
        return (aPriority === -1 ? 999 : aPriority) - (bPriority === -1 ? 999 : bPriority)
      }
      return a.localeCompare(b)
    })
  }, [favorites, filtered, language])

  const changeLanguage = (nextLanguage: LanguageCode) => {
    const nextCurrency = LANGUAGE_OPTIONS.find(item => item.code === nextLanguage)?.currency ?? 'USD'
    setLanguage(nextLanguage)
    setBaseCurrency(nextCurrency)
    setFavorites(CURRENCY_PRIORITY[nextLanguage])
    setSearch('')
  }

  const toggleFavorite = (c: string) => {
    setFavorites(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    )
  }

  const formatRate = (rate: number, currency: string) => {
    if (!rate) return '—'
    const val = amountNum * rate
    if (val === 0) return '0'
    if (val >= 1000000) return val.toLocaleString(selectedLanguage.locale, { maximumFractionDigits: 0 })
    if (val >= 1000) return val.toLocaleString(selectedLanguage.locale, { maximumFractionDigits: 2 })
    if (val >= 1) return val.toLocaleString(selectedLanguage.locale, { maximumFractionDigits: 4 })
    return val.toFixed(6)
  }

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>
            <Image
              src="/zrate.png"
              alt="zrate.io"
              width={96}
              height={96}
              priority
            />
          </div>
          <div className={styles.brandCopy}>
            <h1
              className={`${styles.logoText} ${isCompactTitle ? styles.compactTitle : ''} ${glitchActive ? styles.glitch : ''}`}
              data-text={t.heroTitle}
            >
              {t.heroTitle}
            </h1>
            <p className={styles.logoSub}>{t.heroDescription}</p>
          </div>
        </div>
        <div className={styles.holoCore} aria-hidden="true">
          <div className={styles.holoRing}></div>
          <div className={styles.holoOrbit}></div>
          <div className={styles.holoChip}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className={styles.statusBar}>
          <span className={`${styles.statusDot} ${loading ? styles.loading : styles.live}`}></span>
          <span className={styles.statusText}>
            {loading ? t.syncing : error ? t.offline : t.live}
          </span>
          {lastUpdated && (
            <span className={styles.updateTime}>
              {lastUpdated.toLocaleTimeString(selectedLanguage.locale)}
            </span>
          )}
          <button className={styles.refreshBtn} onClick={fetchRates} disabled={loading}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
          <label className={styles.languageSelectWrap}>
            <span className={styles.visuallyHidden}>{t.language}</span>
            <select
              className={styles.languageSelect}
              value={language}
              onChange={e => changeLanguage(e.target.value as LanguageCode)}
              aria-label={t.language}
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

      {/* Error Banner */}
      {error && (
        <div className={styles.errorBanner}>
          <span>⚠ {error}</span>
        </div>
      )}

      <nav className={styles.pairMenu} aria-label="คู่สกุลเงินยอดนิยม">
        <span className={styles.pairMenuLabel}>คู่เงินยอดนิยม</span>
        <div className={styles.pairTickerViewport}>
          <div className={styles.pairMenuLinks}>
            {[...SEO_PAIR_LINKS, ...SEO_PAIR_LINKS].map((item, index) => (
              <Link href={item.href} key={`${item.href}-${index}`}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <ResponsiveBannerAd />

      {/* Converter Section */}
      <section className={styles.converterSection}>
        <div className={styles.converterPanel}>
          <div className={styles.panelLabel}>{t.baseCurrency}</div>
          <div className={styles.converterRow}>
            <div className={styles.inputGroup}>
              <span className={styles.inputLabel}>{t.amount}</span>
              <input
                type="number"
                className={styles.amountInput}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="0"
                step="any"
                placeholder="0.00"
              />
            </div>
            <div className={styles.inputGroup}>
              <span className={styles.inputLabel}>{t.from}</span>
              <select
                className={styles.currencySelect}
                value={baseCurrency}
                onChange={e => setBaseCurrency(e.target.value)}
              >
                {currencies.map(c => (
                  <option key={c} value={c}>
                    {CURRENCY_INFO[c]?.flag} {c} — {CURRENCY_INFO[c]?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.scanLine}></div>
        </div>
      </section>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>
          )}
        </div>
        <div className={styles.resultCount}>
          {sortedCurrencies.length} {t.currencies}
        </div>
      </div>

      {/* Grid */}
      <section className={styles.gridSection}>
        {loading && rates && Object.keys(rates).length === 0 ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>{t.loading}</p>
          </div>
        ) : (
          <div className={styles.currencyGrid}>
            {sortedCurrencies.map((currency, idx) => {
              const info = CURRENCY_INFO[currency]
              const rate = rates[currency]
              const converted = rate ? amountNum * rate : null
              const isFav = favorites.includes(currency)
              const isUsdt = currency === 'USDT'
              const isBase = currency === baseCurrency

              return (
                <div
                  key={currency}
                  className={`${styles.currencyCard} ${isFav ? styles.favCard : ''} ${isUsdt ? styles.usdtCard : ''} ${isBase ? styles.baseCard : ''}`}
                  style={{ animationDelay: `${(idx % 20) * 0.03}s` }}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.flagCode}>
                      <span className={styles.flag}>{info?.flag}</span>
                      <div>
                        <span className={styles.code}>{currency}</span>
                        {isUsdt && <span className={styles.usdtBadge}>{t.crypto}</span>}
                      </div>
                    </div>
                    <button
                      className={`${styles.favBtn} ${isFav ? styles.favActive : ''}`}
                      onClick={() => toggleFavorite(currency)}
                      title={isFav ? t.removeFavorite : t.addFavorite}
                    >
                      ★
                    </button>
                  </div>
                  <div className={styles.currencyName}>{info?.name}</div>
                  <div className={styles.rateValue}>
                    {isBase ? (
                      <span className={styles.baseLabel}>{t.active}</span>
                    ) : converted !== null ? (
                      <>
                        <span className={styles.symbol}>{info?.symbol}</span>
                        <span className={styles.value}>{formatRate(rate, currency)}</span>
                      </>
                    ) : '—'}
                  </div>
                  {!isBase && rate && (
                    <div className={styles.unitRate}>
                      1 {baseCurrency} = {info?.symbol}{rate >= 1000 ? rate.toLocaleString(selectedLanguage.locale, { maximumFractionDigits: 2 }) : rate.toFixed(4)}
                    </div>
                  )}
                  <button
                    className={styles.setBaseBtn}
                    onClick={() => { setBaseCurrency(currency); setAmount('1') }}
                    disabled={isBase}
                  >
                    {isBase ? `◈ ${t.active}` : `◇ ${t.setBase}`}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <NativeBannerAd />

      <section className={styles.seoSection} aria-labelledby="exchange-info-heading">
        <div className={styles.seoIntro}>
          <h2 id="exchange-info-heading">{t.seoHeading}</h2>
          <p>{t.seoIntro}</p>
        </div>
        <div className={styles.seoGrid}>
          {t.seoCards.map((item, idx) => (
            <article className={styles.seoCard} key={item.title}>
              <div className={styles.seoIcon} aria-hidden="true">
                {idx === 0 ? (
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 14.5 8.5 10l3 3L20 4.5" />
                    <path d="M5 19h14" />
                  </svg>
                ) : idx === 1 ? (
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M4 12h16M12 4c2 2.2 3 4.8 3 8s-1 5.8-3 8M12 4c-2 2.2-3 4.8-3 8s1 5.8 3 8" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 3v18M5 7l14 10M19 7 5 17" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerText}>
          <span>zrate.io MATRIX</span>
          <span className={styles.footerDivider}>|</span>
          <span>{t.footerData}</span>
          <span className={styles.footerDivider}>|</span>
          <span>{t.footerSync}</span>
        </div>
      </footer>
    </main>
  )
}
