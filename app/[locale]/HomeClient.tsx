'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { NativeBannerAd, ResponsiveBannerAd } from '../components/AdsterraAds'
import { Footer } from '../components/Footer'
import { SeoNav } from '../components/SeoNav'
import styles from '../page.module.css'
import pairStyles from './[pair]/page.module.css'
import { InteractiveChart } from './[pair]/InteractiveChart'
import { AseanDashboard } from './[pair]/AseanDashboard'
import { NewsFeed } from './[pair]/NewsFeed'

interface HistoricalPoint {
  date: string
  rate: number
}

interface NewsItem {
  date: string
  title: string
  url: string
  source: string
  sentiment: string
}

const CURRENCY_INFO: Record<string, { flag: string; name: string; symbol: string }> = {
  USD: { flag: '\u{1F1FA}\u{1F1F8}', name: 'US Dollar', symbol: '$' },
  EUR: { flag: '\u{1F1EA}\u{1F1FA}', name: 'Euro', symbol: '€' },
  GBP: { flag: '\u{1F1EC}\u{1F1E7}', name: 'British Pound', symbol: '£' },
  JPY: { flag: '\u{1F1EF}\u{1F1F5}', name: 'Japanese Yen', symbol: '¥' },
  THB: { flag: '\u{1F1F9}\u{1F1ED}', name: 'Thai Baht', symbol: '฿' },
  LAK: { flag: '\u{1F1F1}\u{1F1E6}', name: 'Lao Kip', symbol: '₭' },
  MMK: { flag: '\u{1F1F2}\u{1F1F2}', name: 'Myanmar Kyat', symbol: 'K' },
  KHR: { flag: '\u{1F100}\u{1F1ED}', name: 'Cambodian Riel', symbol: '៛' }, // Standard flag format: \u{1F1F0}\u{1F1ED}
  CNY: { flag: '\u{1F1E8}\u{1F1F3}', name: 'Chinese Yuan', symbol: '¥' },
  KRW: { flag: '\u{1F1F0}\u{1F1F7}', name: 'Korean Won', symbol: '₩' },
  SGD: { flag: '\u{1F1F8}\u{1F1EC}', name: 'Singapore Dollar', symbol: 'S$' },
  HKD: { flag: '\u{1F1ED}\u{1F1F0}', name: 'Hong Kong Dollar', symbol: 'HK$' },
  AUD: { flag: '\u{1F1E6}\u{1F1FA}', name: 'Australian Dollar', symbol: 'A$' },
  CAD: { flag: '\u{1F1E8}\u{1F1E6}', name: 'Canadian Dollar', symbol: 'C$' },
  CHF: { flag: '\u{1F1E8}\u{1F1ED}', name: 'Swiss Franc', symbol: 'Fr' },
  NZD: { flag: '\u{1F1F3}\u{1F1FF}', name: 'NZ Dollar', symbol: 'NZ$' },
  SEK: { flag: '\u{1F1F8}\u{1F1EA}', name: 'Swedish Krona', symbol: 'kr' },
  NOK: { flag: '\u{1F1F3}\u{1F1F4}', name: 'Norwegian Krone', symbol: 'kr' },
  DKK: { flag: '\u{1F1E9}\u{1F1F0}', name: 'Danish Krone', symbol: 'kr' },
  INR: { flag: '\u{1F1EE}\u{1F1F3}', name: 'Indian Rupee', symbol: '₹' },
  IDR: { flag: '\u{1F1EE}\u{1F1E9}', name: 'Indonesian Rupiah', symbol: 'Rp' },
  MYR: { flag: '\u{1F1F2}\u{1F1FE}', name: 'Malaysian Ringgit', symbol: 'RM' },
  PHP: { flag: '\u{1F1F5}\u{1F1ED}', name: 'Philippine Peso', symbol: '₱' },
  VND: { flag: '\u{1F1FB}\u{1F1F3}', name: 'Vietnamese Dong', symbol: '₫' },
  TWD: { flag: '\u{1F1F9}\u{1F1FC}', name: 'Taiwan Dollar', symbol: 'NT$' },
  BRL: { flag: '\u{1F1E7}\u{1F1F7}', name: 'Brazilian Real', symbol: 'R$' },
  MXN: { flag: '\u{1F1F2}\u{1F1FD}', name: 'Mexican Peso', symbol: '$' },
  ZAR: { flag: '\u{1F1FF}\u{1F1E6}', name: 'South African Rand', symbol: 'R' },
  RUB: { flag: '\u{1F1F7}\u{1F1FA}', name: 'Russian Ruble', symbol: '₽' },
  TRY: { flag: '\u{1F1F9}\u{1F1F7}', name: 'Turkish Lira', symbol: '₺' },
  SAR: { flag: '\u{1F1F8}\u{1F1E6}', name: 'Saudi Riyal', symbol: '﷼' },
  AED: { flag: '\u{1F1E6}\u{1F1EA}', name: 'UAE Dirham', symbol: 'د.إ' },
  PLN: { flag: '\u{1F1F5}\u{1F1F1}', name: 'Polish Zloty', symbol: 'zł' },
  CZK: { flag: '\u{1F1E8}\u{1F1FF}', name: 'Czech Koruna', symbol: 'Kč' },
  HUF: { flag: '\u{1F1ED}\u{1F1FA}', name: 'Hungarian Forint', symbol: 'Ft' },
  ILS: { flag: '\u{1F1EE}\u{1F1F1}', name: 'Israeli Shekel', symbol: '₪' },
  PKR: { flag: '\u{1F1F5}\u{1F1F0}', name: 'Pakistani Rupee', symbol: '₨' },
  EGP: { flag: '\u{1F1EA}\u{1F1EC}', name: 'Egyptian Pound', symbol: 'E£' },
  NGN: { flag: '\u{1F1F3}\u{1F1EC}', name: 'Nigerian Naira', symbol: '₦' },
  USDT: { flag: '₮', name: 'Tether USD', symbol: '₮' },
}

// Fix KHR flag representation
CURRENCY_INFO.KHR = { flag: '\u{1F1F0}\u{1F1ED}', name: 'Cambodian Riel', symbol: '៛' }

type Rates = Record<string, number>
type LanguageCode = 'th' | 'en' | 'lo' | 'my' | 'km'
const LANGUAGE_STORAGE_KEY = 'zrate-language'

interface LocalizedContent {
  usdtName: string
  heroEyebrow: string
  heroHeading: string
  heroBody: string
  recommendedPairsLabel: string
  featuredRatesLabel: string
  pairMenuLabel: string
  converterTitle: string
  marketKicker: string
  marketHeading: (base: string) => string
  oneUnit: string
  to: string
  refreshRates: string
  clearSearch: string
  switchToDark: string
  switchToLight: string
  currencyGuide: string
  articleHeading: string
  articleBody: string
  whyHeading: string
  whyBody: string
  howHeading: string
  howSteps: string[]
  popularPairsHeading: string
  popularPairsCta: string
  regionHeading: string
  regionBody: string
  keywordLinksLabel: string
  faqHeading: string
  schemaItemListName: string
  popularPairs: Array<{ href: string; label: string; title: string; description: string }>
  useCases: Array<{ title: string; body: string }>
  faqs: Array<{ question: string; answer: string }>
}

const LANGUAGE_OPTIONS: Array<{ code: LanguageCode; label: string; native: string; flag: string; currency: string; locale: string }> = [
  { code: 'th', label: 'ไทย', native: 'ไทย', flag: '\u{1F1F9}\u{1F1ED}', currency: 'THB', locale: 'th-TH' },
  { code: 'en', label: 'English', native: 'English', flag: '\u{1F1FA}\u{1F1F8}', currency: 'USD', locale: 'en-US' },
  { code: 'lo', label: 'ລາວ', native: 'ລາວ', flag: '\u{1F1F1}\u{1F1E6}', currency: 'LAK', locale: 'lo-LA' },
  { code: 'my', label: 'မြန်မာ', native: 'မြန်မာ', flag: '\u{1F1F2}\u{1F1F2}', currency: 'MMK', locale: 'my-MM' },
  { code: 'km', label: 'ខ្មែរ', native: 'ខ្មែរ', flag: '\u{1F1F0}\u{1F1ED}', currency: 'KHR', locale: 'km-KH' },
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
  error: string
  seoHeading: string
  seoIntro: string
  seoCards: Array<{ title: string; body: string }>
}> = {
  th: { heroTitle: 'อัตราแลกเปลี่ยนวันนี้ | zrate.io', heroDescription: 'เช็กค่าเงินและแปลงสกุลเงินแบบเรียลไทม์สำหรับเงินบาท ดอลลาร์ USDT และสกุลเงินยอดนิยมทั่วโลก', subtitle: 'เมทริกซ์อัตราแลกเปลี่ยนแบบเรียลไทม์', baseCurrency: 'สกุลเงินหลัก', amount: 'จำนวนเงิน', from: 'จากสกุลเงิน', language: 'ภาษา', searchPlaceholder: 'ค้นหาสกุลเงิน / รหัส...', currencies: 'สกุลเงิน', syncing: 'กำลังซิงก์...', offline: 'โหมดออฟไลน์', live: 'ข้อมูลสด', crypto: 'คริปโต', active: 'ใช้งานอยู่', setBase: 'ตั้งเป็นสกุลหลัก', addFavorite: 'เพิ่มรายการโปรด', removeFavorite: 'ลบจากรายการโปรด', loading: 'กำลังเชื่อมต่อข้อมูลอัตราแลกเปลี่ยน...', error: 'สัญญาณขาดหาย — ใช้ข้อมูลสำรอง', seoHeading: 'เครื่องมือแปลงค่าเงินออนไลน์สำหรับทุกวัน', seoIntro: 'zrate.io ช่วยให้ดูอัตราแลกเปลี่ยนล่าสุด เปรียบเทียบหลายสกุลเงิน และคำนวณยอดเงินได้รวดเร็วในหน้าเดียว', seoCards: [{ title: 'อัตราแลกเปลี่ยนสด', body: 'อัปเดตค่าเงินจากแหล่งข้อมูลออนไลน์ พร้อมข้อมูลสำรองเมื่อสัญญาณขาดหาย' }, { title: 'รองรับหลายสกุลเงิน', body: 'เช็ก THB, USD, EUR, JPY, LAK, MMK, KHR, CNY และ USDT ได้สะดวก' }, { title: 'ใช้งานง่ายทุกภาษา', body: 'รองรับภาษาไทย อังกฤษ ลาว เมียนมา และกัมพูชา เพื่อการใช้งานในภูมิภาค' }] },
  en: { heroTitle: 'Live exchange rates today | zrate.io', heroDescription: 'Check exchange rates and convert THB, USD, USDT and major world currencies in real time.', subtitle: 'Real-time currency exchange matrix', baseCurrency: 'Base currency', amount: 'Amount', from: 'From', language: 'Language', searchPlaceholder: 'Search currency / code...', currencies: 'currencies', syncing: 'Syncing...', offline: 'Offline mode', live: 'Live feed', crypto: 'Crypto', active: 'Active', setBase: 'Set base', addFavorite: 'Add to favorites', removeFavorite: 'Remove from favorites', loading: 'Connecting to exchange nodes...', error: 'Signal lost — using cached data', seoHeading: 'Fast online currency converter', seoIntro: 'zrate.io makes it easy to compare exchange rates, calculate conversions, and track popular currencies from one clean page.', seoCards: [{ title: 'Live exchange rates', body: 'Rates refresh from online data with cached fallback when the connection is unavailable.' }, { title: 'Major currencies and USDT', body: 'Follow THB, USD, EUR, JPY, LAK, MMK, KHR, CNY, USDT and more.' }, { title: 'Regional language support', body: 'Use the converter in Thai, English, Lao, Myanmar and Khmer for everyday exchange needs.' }] },
  lo: { heroTitle: 'ອັດຕາການດປ່ຽນເງິນມື້ນີ້ | zrate.io', heroDescription: 'ກວດເບິ່ງຄົ່າເງິນ ແລະ ແປງສະກຸນເງິນ THB, USD, USDT ແລະສະກຸນຫຼັກແບບສົດ.', subtitle: 'ຕາຕະລາງອັດຕາແລກປ່ຽນແບບສົດ', baseCurrency: 'ສະກຸນເງິນຫຼັກ', amount: 'ຈຳນວນເງິນ', from: 'ຈາກສະກຸນເງິນ', language: 'ພາສາ', searchPlaceholder: 'ຄົ້ນຫາສະກຸນເງິນ / ລະຫັສ...', currencies: 'ສະກຸນເງິນ', syncing: 'ກຳລັງຊິງກ໌...', offline: 'ໂໄມດອອບລາຍ', live: 'ຂໍ້ມູ້ນສົດ', crypto: 'ຄຣິບໂຕ', active: 'ກຳລັງໃຊ້', setBase: 'ຕັ້ງເປັນສະກຸນຫຼັກ', addFavorite: 'ເພີ່ມລາຍການມັກ', removeFavorite: 'ລຶບອອກຈາກລາຍການມັກ', loading: 'ກຳລັງເຊື່ອມຕໍ່ຂໍ້ມູ້ນແລກປ່ຽນ...', error: 'ສັນຍານຂาด — ໃຊ້ຂໍ້ມູ້ນສຳຮອງ', seoHeading: 'เครื่องมือแปรຄ່າເງິນອອນລາຍ', seoIntro: 'zrate.io ຊ່ວຍໃຫ້ເບິ່ງອັດຕາລ່າສຸດ ປຽບທຽບຫຼາຍສະກຸນ ແລະຄຳນວນໄດ້ໄວ.', seoCards: [{ title: 'ອັດຕາແບບສົດ', body: 'ອັບເດດຄົ່າເງິນຈາກຂໍ້ມູ້ນອອນລາຍ ພ້ອມຂໍ້ມູ້ນສຳຮອງ.' }, { title: 'ຮອງຮັບຫຼາຍສະກຸນ', body: 'ເບິ່ງ THB, USD, EUR, JPY, LAK, MMK, KHR, CNY ແລະ USDT.' }, { title: 'ພາສາໃນພາກພື້ນ', body: 'ໃຊ້ໄດ້ທັ້ງພາສາລາວ ໄທ ອັງກິດ ມຽນມາ ແລະຂະແມ.' }] },
  my: { heroTitle: 'ယနေ့ ငွေလဲနှူန်းများ | zrate.io', heroDescription: 'THB, USD, USDT နှင့် နာမည်ကြီး ငွေကြေးများကို အချိန်နှင့်တပြေးညီး စစ်ဆေးပြီး ပြောင်းလဲတွက်ချက်ပါ', subtitle: 'အချိန်နှင့်တပြေးညီး ငွေလဲနှူန်းမက်ထရစ်', baseCurrency: 'အခြေခံငွေကြေး', amount: 'ပမာဏ', from: 'မှ', language: 'ဘာသာစကား', searchPlaceholder: 'ငွေကြေး / ကုဒ် ရှာရန်...', currencies: 'ငွေကြေးများ', syncing: 'စင့်ခ်လုပ်နေသည်...', offline: 'အော့ဖ်လိုင်းမုဒ်', live: 'တိုက်ရိုက်ဒေတာ', crypto: 'ခရစ်ပတို', active: 'အသုံးပြုနေသည်', setBase: 'အခြေခံငွေကြေးထားရန်', addFavorite: 'စိတ်ကြိုက်ထဲထည့်ရန်', removeFavorite: 'စိတ်ကြိုက်မှဖယ်ရန်', loading: 'ငွေလဲဒေတာ ချိတ်ဆက်နေသည်...', error: 'ချိတ်ဆက်မှုပြတ်တောက် — သိမ်းထားသောဒေတာသုံးနေသည်', seoHeading: 'လွယ်ကူသော အွန်လိုင်း ငွေကြေးပြောင်းစက်', seoIntro: 'zrate.io ဖြင့် ငွေလဲနှူန်းများကို နှိုင်းယှဉ်ကြည့်ရှုပြီး တစ်နေရာတည်းတွင် မြန်မြန်တွက်ချက်နိုင်ပါသည်။', seoCards: [{ title: 'တိုက်ရိုက် ငွေလဲနှူန်း', body: 'အွန်လိုင်းဒေတာမှ အချိန်နှင့်တပြေးညီး အပ်ဒိတ်လုပ်ပြီး ချိတ်ဆက်မှုပြတ်လျှင် သိမ်းထားသောဒေတာကိုသုံးသည်။' }, { title: 'ငွေကြေးများစွာ', body: 'THB, USD, EUR, JPY, LAK, MMK, KHR, CNY နှင့် USDT ကို စစ်ဆေးနိုင်သည်။' }, { title: 'ဒေသသုံး ဘာသာစကား', body: 'မြန်မာ၊ ထိုင်း၊ အင်္ဂလိပ်၊ လာအို နှင့် ခမာ ဘာသာများကို အသုံးပြုနိုင်သည်။' }] },
  km: { heroTitle: 'អត្រាប្តូរប្រាស់ថ្ងៃនេះ | zrate.io', heroDescription: 'ពិនិត្យ និងបម្លែរ THB, USD, USDT និងរូបិយប័ណ្ណពេញនិយមជាច្រើនតាមពេលវេលាពិត។', subtitle: 'ម៉ាទ្រីសអត្រាប្តូរប្រាស់ពេលវេលាពិត', baseCurrency: 'រូបិយប័ណ្ណគោល', amount: 'ចំនួនប្រាក់', from: 'ពីរូបិយប័ណ្ណ', language: 'ភាសា', searchPlaceholder: 'ស្វែងរករូបិយប័ណ្ណ / កូដ...', currencies: 'រូបិយប័ណ្ណ', syncing: 'កំពុងធ្វើសមកាលកម្ម...', offline: 'របៀបក្រៅបណ្ដាញ', live: 'ទិន្នន័យផ្ទាល់', crypto: 'គ្រីបតូ', active: 'កំពុងប្រើ', setBase: 'កំណត់ជាគោល', addFavorite: 'បន្ថែមទៅចំណូលចិត្ត', removeFavorite: 'ដកចេញពីចំណូលចិត្ត', loading: 'កំពុងភ្ជាប់ទិន្នន័យអត្រាប្តូរ...', error: 'បាត់សញ្ញា — ប្រើទិន្នន័យបម្រុង', seoHeading: 'ឧបករណ៍បម្លែររូបិយប័ណ្ណអនឡាញ', seoIntro: 'zrate.io ជួយប្រៀបធៀបអត្រាប្តូរប្រាក់ គណនាចំនួនប្រាក់ និងតាមដានរូបិយប័ណ្ណសំខាន់ៗក្នុងទំព័រតែមួយ។', seoCards: [{ title: 'អត្រាប្តូរប្រាស់ផ្ទាល់', body: 'ធ្វើបច្ចុប្បន្នភាពពីទិន្នន័យអនឡាញ និងមានទិន្នន័យបម្រុងពេលបាត់ការតភ្ជាប់។' }, { title: 'គាំទ្ររូបិយប័ណ្ណច្រើន', body: 'ពិនិត្យ THB, USD, EUR, JPY, LAK, MMK, KHR, CNY និង USDT បានងាយស្រួល។' }, { title: 'ភាសាក្នុងតំបន់', body: 'ប្រើបានជាភាសាខ្មែរ ថៃ អង់គ្លេស ឡាវ និងមីយ៉ាន់ម៉ា។' }] },
}

const CURRENCY_PRIORITY: Record<LanguageCode, string[]> = {
  th: ['THB', 'USD', 'USDT', 'EUR', 'JPY', 'LAK', 'MMK', 'KHR'],
  en: ['USD', 'USDT', 'EUR', 'GBP', 'JPY', 'THB', 'SGD', 'AUD'],
  lo: ['LAK', 'THB', 'USD', 'USDT', 'CNY', 'VND', 'KHR', 'MMK'],
  my: ['MMK', 'THB', 'USD', 'USDT', 'SGD', 'CNY', 'INR', 'KHR'],
  km: ['KHR', 'THB', 'USD', 'USDT', 'CNY', 'VND', 'LAK', 'MMK'],
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

const SEO_CONTENT = {
  popularPairs: [
    { href: '/usd-thb', label: 'USD/THB', title: 'ดอลลาร์สหรัฐเป็นบาท', description: 'คู่เงินหลักสำหรับเช็กค่าเงินดอลลาร์วันนี้ โอนเงิน ซื้อสินค้า และวางแผนแลกเงินสด' },
    { href: '/usdt-thb', label: 'USDT/THB', title: 'USDT เป็นบาท', description: 'ดูเรทคริปโตสาย stablecoin เทียบเงินบาท สำหรับประเมินมูลค่า USDT และราคาอ้างอิงคริปโต' },
    { href: '/eur-thb', label: 'EUR/THB', title: 'ยูโรเป็นบาท', description: 'ติดตามค่าเงินยูโรเทียบบาทสำหรับท่องเที่ยว ยุโรป การค้า และการชำระเงินต่างประเทศ' },
    { href: '/thb-lak', label: 'THB/LAK', title: 'บาทเป็นกีบลาว', description: 'คู่เงินสำคัญสำหรับผู้เดินทางและค้าขายในไทย-ลาว ใช้ดูแนวโน้มเงินบาทเทียบกีบ' },
    { href: '/thb-mmk', label: 'THB/MMK', title: 'บาทเป็นจ๊าตเมียนมา', description: 'เช็กค่าเงินบาทเทียบจ๊าตเมียนมา สำหรับประเมินค่าโอนเงินและค่าใช้จ่ายรายวัน' },
    { href: '/thb-khr', label: 'THB/KHR', title: 'บาทเป็นเรียลกัมพูชา', description: 'ดูเรทเงินบาทเทียบเรียลกัมพูชา สำหรับการเดินทาง ชายแดน และการค้าระดับภูมิภาค' },
  ],
  useCases: [
    { title: 'เช็กค่าเงินก่อนแลกเงินจริง', body: 'ดูอัตราแลกเปลี่ยนวันนี้เพื่อประเมินยอดเงินบาท ดอลลาร์ ยูโร เยน และสกุลเงินเพื่อนบ้าน ก่อนตัดสินใจแลกเงินหรือโอนเงิน' },
    { title: 'คำนวณราคาออนไลน์และรายรับต่างประเทศ', body: 'ใช้แปลงราคาสินค้า ค่าบริการ รายรับจากต่างประเทศ หรือยอดเงินคริปโตอย่าง USDT ให้เห็นมูลค่าโดยประมาณทันที' },
    { title: 'ติดตามค่าเงินไทยกับประเทศเพื่อนบ้าน', body: 'รองรับ THB, LAK, MMK และ KHR เพื่อดูภาพรวมค่าเงินในไทย ลาว เมียนมา และกัมพูชาได้ในหน้าเดียว' },
  ],
  faqs: [
    { question: 'zrate.io ใช้ทำอะไร?', answer: 'zrate.io เป็นเครื่องมือเช็กอัตราแลกเปลี่ยนเงินวันนี้และแปลงค่าเงินออนไลน์ รองรับเงินบาท ดอลลาร์ USDT ยูโร เยน และสกุลเงินยอดนิยมกว่า 40 สกุล' },
    { question: 'อัตราแลกเปลี่ยนบนหน้าแรกอัปเดตบ่อยแค่ไหน?', answer: 'หน้าแรกดึงข้อมูลใหม่อัตโนมัติทุก 60 วินาที และมีข้อมูลสำรองให้ดูต่อได้เมื่อเครือข่ายหรือแหล่งข้อมูลภายนอกไม่พร้อมใช้งาน' },
    { question: 'ดู USD เป็น THB และ USDT เป็น THB ได้ไหม?', answer: 'ได้ สามารถเลือก USD, USDT และ THB ในตัวแปลงค่าเงินบนหน้าแรก หรือเข้าหน้าเฉพาะคู่เงิน USD/THB และ USDT/THB จากเมนูคู่เงินยอดนิยม' },
    { question: 'ตัวเลขนี้ใช้แทนเรทธนาคารได้หรือไม่?', answer: 'ตัวเลขบน zrate.io เหมาะสำหรับอ้างอิงและคำนวณเบื้องต้น เรทธนาคาร ร้านแลกเงิน หรือผู้ให้บริการโอนเงินอาจมีค่าธรรมเนียมและส่วนต่างราคาเพิ่มเติม' },
  ],
}

const LOCALIZED_CONTENT: Record<LanguageCode, LocalizedContent> = {
  th: {
    usdtName: 'เทเธอร์ดอลลาร์',
    heroEyebrow: 'โต๊ะค่าเงินสด',
    heroHeading: 'แปลงค่าเงินเร็ว ดูเรทสำคัญครบในหน้าเดียว',
    heroBody: 'เปรียบเทียบเงินบาท ดอลลาร์ USDT ยูโร เยน และสกุลเงินเพื่อนบ้านแบบเรียลไทม์ พร้อมตารางเรทที่ค้นหาและตั้งสกุลหลักได้ทันที',
    recommendedPairsLabel: 'คู่เงินแนะนำ',
    featuredRatesLabel: 'อัตราแลกเปลี่ยนเด่น',
    pairMenuLabel: 'คู่เงินยอดนิยม',
    converterTitle: 'ตัวแปลงค่าเงิน',
    marketKicker: 'ตารางตลาด',
    marketHeading: base => `ตารางอัตราแลกเปลี่ยน ${base}`,
    oneUnit: '1',
    to: 'เป็น',
    refreshRates: 'รีเฟรชอัตราแลกเปลี่ยน',
    clearSearch: 'ล้างการค้นหา',
    switchToDark: 'เปลี่ยนเป็นโหมดมืด',
    switchToLight: 'เปลี่ยนเป็นโหมดสว่าง',
    currencyGuide: 'คู่มือค่าเงิน',
    articleHeading: 'อัตราแลกเปลี่ยนเงินวันนี้และเครื่องมือแปลงค่าเงินออนไลน์',
    articleBody: 'zrate.io ออกแบบมาให้ค้นหาอัตราแลกเปลี่ยนวันนี้ได้เร็ว ทั้งเงินบาท ดอลลาร์สหรัฐ ยูโร เยน USDT และสกุลเงินในภูมิภาคอาเซียน เหมาะสำหรับดูค่าเงินก่อนแลกเงิน โอนเงิน ซื้อของต่างประเทศ หรือประเมินราคาแบบคร่าวๆ ในหน้าเดียว',
    whyHeading: 'ทำไมต้องเช็กค่าเงินก่อนแลกหรือโอนเงิน',
    whyBody: 'อัตราแลกเปลี่ยนเปลี่ยนได้ตลอดวัน การดูเรทล่าสุดช่วยให้ประเมินยอดเงินปลายทางได้แม่นขึ้น โดยเฉพาะคู่ยอดนิยมอย่าง USD/THB, USDT/THB, EUR/THB, THB/LAK, THB/MMK และ THB/KHR',
    howHeading: 'วิธีใช้ตัวแปลงค่าเงินบน zrate.io',
    howSteps: ['ใส่จำนวนเงินที่ต้องการแปลง', 'เลือกสกุลเงินต้นทาง เช่น THB, USD, EUR หรือ USDT', 'ดูผลลัพธ์ในตาราง หรือค้นหารหัสสกุลเงินที่ต้องการ'],
    popularPairsHeading: 'คู่เงินยอดนิยมที่คนค้นหาบ่อย',
    popularPairsCta: 'ดู USD/THB',
    regionHeading: 'ค่าเงินไทย ลาว เมียนมา กัมพูชา และ USDT ในหน้าเดียว',
    regionBody: 'สำหรับผู้ใช้ในเอเชียตะวันออกเฉียงใต้ การเทียบค่าเงินบาทกับกีบลาว จ๊าตเมียนมา และเรียลกัมพูชาเป็นคำค้นหาที่เกิดขึ้นทุกวัน zrate.io จึงจัดลำดับสกุลเงินสำคัญของภูมิภาคไว้ให้เข้าถึงง่าย',
    keywordLinksLabel: 'ลิงก์คำค้นหาอัตราแลกเปลี่ยน',
    faqHeading: 'คำถามที่พบบ่อยเกี่ยวกับอัตราแลกเปลี่ยนวันนี้',
    schemaItemListName: 'คู่สกุลเงินยอดนิยมบน zrate.io',
    popularPairs: SEO_CONTENT.popularPairs,
    useCases: SEO_CONTENT.useCases,
    faqs: SEO_CONTENT.faqs,
  },
  en: {
    usdtName: 'Tether USD',
    heroEyebrow: 'Live currency desk',
    heroHeading: 'Convert currencies fast and track key rates in one place',
    heroBody: 'Compare Thai baht, US dollars, USDT, euros, yen and regional currencies in real time with a searchable exchange-rate table.',
    recommendedPairsLabel: 'Recommended pairs',
    featuredRatesLabel: 'Featured exchange rates',
    pairMenuLabel: 'Popular pairs',
    converterTitle: 'Currency converter',
    marketKicker: 'Market matrix',
    marketHeading: base => `${base} exchange table`,
    oneUnit: '1',
    to: 'to',
    refreshRates: 'Refresh rates',
    clearSearch: 'Clear search',
    switchToDark: 'Switch to dark mode',
    switchToLight: 'Switch to light mode',
    currencyGuide: 'Currency guide',
    articleHeading: 'Today’s exchange rates and online currency converter',
    articleBody: 'zrate.io helps you check today’s exchange rates quickly across Thai baht, US dollars, euros, yen, USDT and regional Southeast Asian currencies such as Lao kip, Myanmar kyat and Cambodian riel.',
    whyHeading: 'Why check exchange rates before exchanging or sending money',
    whyBody: 'Exchange rates can move throughout the day. Checking current reference rates helps estimate the receiving amount for popular pairs such as USD/THB, USDT/THB, EUR/THB, THB/LAK, THB/MMK and THB/KHR.',
    howHeading: 'How to use the zrate.io converter',
    howSteps: ['Enter the amount you want to convert.', 'Choose the source currency, such as THB, USD, EUR or USDT.', 'Read the table or search for the currency code you need.'],
    popularPairsHeading: 'Popular currency pairs people search for',
    popularPairsCta: 'View USD/THB',
    regionHeading: 'Thai, Lao, Myanmar, Cambodian and USDT rates in one page',
    regionBody: 'For users in Southeast Asia, comparing Thai baht with Lao kip, Myanmar kyat and Cambodian riel is a daily need. zrate.io keeps the region’s most useful currencies easy to find.',
    keywordLinksLabel: 'Exchange-rate keyword links',
    faqHeading: 'Frequently asked questions about today’s exchange rates',
    schemaItemListName: 'Popular currency pairs on zrate.io',
    popularPairs: [
      { href: '/usd-thb', label: 'USD/THB', title: 'US dollar to Thai baht', description: 'A core pair for checking the dollar rate, transfers, purchases and cash exchange planning.' },
      { href: '/usdt-thb', label: 'USDT/THB', title: 'USDT to Thai baht', description: 'Track stablecoin value against THB for crypto reference pricing and portfolio estimates.' },
      { href: '/eur-thb', label: 'EUR/THB', title: 'Euro to Thai baht', description: 'Follow the euro-baht rate for travel, business and international payments.' },
      { href: '/thb-lak', label: 'THB/LAK', title: 'Thai baht to Lao kip', description: 'Useful for Thailand-Laos travel, border trade and daily currency comparison.' },
      { href: '/thb-mmk', label: 'THB/MMK', title: 'Thai baht to Myanmar kyat', description: 'Estimate transfers, expenses and exchange value between THB and MMK.' },
      { href: '/thb-khr', label: 'THB/KHR', title: 'Thai baht to Cambodian riel', description: 'A regional pair for travel, border commerce and practical price comparison.' },
    ],
    useCases: [
      { title: 'Check before exchanging cash', body: 'Estimate THB, USD, EUR, JPY and regional currency values before exchanging or sending money.' },
      { title: 'Calculate online prices and overseas income', body: 'Convert product prices, service fees, foreign income or USDT balances into an approximate local value.' },
      { title: 'Follow neighboring-country currencies', body: 'Track THB, LAK, MMK and KHR in one view for Thailand, Laos, Myanmar and Cambodia.' },
    ],
    faqs: [
      { question: 'What is zrate.io for?', answer: 'zrate.io is a live exchange-rate and currency converter tool for Thai baht, US dollars, USDT, euros, yen and 40+ popular currencies.' },
      { question: 'How often do rates update?', answer: 'The homepage refreshes rates automatically every 60 seconds and keeps fallback data available when an external source is unavailable.' },
      { question: 'Can I check USD to THB and USDT to THB?', answer: 'Yes. Use the homepage converter or open the dedicated USD/THB and USDT/THB pair pages from the popular-pairs menu.' },
      { question: 'Are these bank rates?', answer: 'Rates on zrate.io are reference values for quick calculation. Banks, exchanges and transfer services may add fees or spreads.' },
    ],
  },
  lo: {
    usdtName: 'Tether USD',
    heroEyebrow: 'ຕາຕະລາງເງິນສົດ',
    heroHeading: 'ແປງຄ່າເງິນໄວ ແລະເບິ່ງອັດຕາສຳຄັນໃນໜ້າດຽວ',
    heroBody: 'ປຽບທຽບບາດໄທ ໂດລາ USDT ເອີໂຣ ເຢນ ແລະສະກຸນເງິນໃນພາກພື້ນແບບສົດ.',
    recommendedPairsLabel: 'ຄູ່ເງິນແນະນຳ',
    featuredRatesLabel: 'ອັດຕາເດັ່ນ',
    pairMenuLabel: 'ຄູ່ເງິນຍອດນິຍົມ',
    converterTitle: 'ເຄື່ອງມືແປງເງິນ',
    marketKicker: 'ຕາຕະລາງຕະຫຼາດ',
    marketHeading: base => `ຕາຕະລາງອັດຕາ ${base}`,
    oneUnit: '1',
    to: 'ເປັນ',
    refreshRates: 'ໂຫຼດອັດຕາໃໝ່',
    clearSearch: 'ລ້າງການຄົ້ນຫາ',
    switchToDark: 'ປ່ຽນເປັນໂໝດມືດ',
    switchToLight: 'ປ່ຽນເປັນໂໝດສະຫວ່າງ',
    currencyGuide: 'ຄູ່ມືຄ່າເງິນ',
    articleHeading: 'ອັດຕາແລກປ່ຽນມື້ນີ້ ແລະເຄື່ອງມືແປງເງິນອອນລាយ',
    articleBody: 'zrate.io ຊ່ວຍໃຫ້ເບິ່ງອັດຕາແລກປ່ຽນມື້ນີ້ໄດ້ໄວ ທັງບາດໄທ ໂດລາ ເອີໂຣ ເຢນ USDT ແລະສະກຸນເງິນໃນພាកພື້ນ.',
    whyHeading: 'ເປັນຫຍັງຄວນເບິ່ງຄ່າເງິນກ່ອນແລກ ຫຼືໂອນເງິນ',
    whyBody: 'ອັດຕາແລກປ່ຽນປ່ຽนໄດ້ຕະຫຼອດມື້ ການເບິ່ງເລດລ່າສຸດຊ່ວຍຄຳນວນຍອດປາຍທາງໄດ້ດີຂຶ້ນ.',
    howHeading: 'ວິທີໃຊ້ zrate.io',
    howSteps: ['ໃສ່ຈຳນວນເງິນທີ່ຈະແປງ', 'ເລືອກສະກຸນເງິນຕົ້ນທາງ', 'ເບິ່ງຜົນໃນຕາຕະລາງ ຫຼືຄົ້ນຫາລະຫັດເງິນ'],
    popularPairsHeading: 'ຄູ່ເງິນທີ່ຄົນຄົ້ນຫາຫຼາຍ',
    popularPairsCta: 'ເບິ່ງ USD/THB',
    regionHeading: 'ຄ່າເງິນໄທ ລາວ ມຽນມາ ກຳປູເຈຍ ແລະ USDT ໃນໜ້າດຽວ',
    regionBody: 'ສຳລັບຜູ້ໃຊ້ໃນອາຊຽນ ການປຽບທຽບບາດໄທກັບກີບ ຈາດມຽນມາ ແລະຣຽວກຳປູເຈຍເປັນສິ່ງທີ່ໃຊ້ທຸກມື້.',
    keywordLinksLabel: 'ລິ້ງຄຳຄົ້ນຫາອັດຕາແລກປ່ຽນ',
    faqHeading: 'ຄຳຖາມພົບເລື້ອຍ',
    schemaItemListName: 'ຄູ່ເງິນຍອດນິຍົມໃນ zrate.io',
    popularPairs: [
      { href: '/usd-thb', label: 'USD/THB', title: 'ໂດລາເປັນບາດ', description: 'ເບິ່ງຄ່າໂດລາ ການໂອນເງິນ ການຊື້ຂາຍ ແລະວາງແຜນແລກເງິນສົດ.' },
      { href: '/usdt-thb', label: 'USDT/THB', title: 'USDT เป็นบາດ', description: 'ປະເມີນມູນຄ່າ USDT ແລະລາຄາອ້າງອີງຄຣິບໂຕເທົ່າກັບບາດ.' },
      { href: '/eur-thb', label: 'EUR/THB', title: 'ເອີໂຣເປັນບາດ', description: 'ຕິດຕາມຄ່າເອີໂຣສຳລັບທ່ອງທ່ຽວ ທຸລະກິດ ແລະການຊຳລະເງິນ.' },
      { href: '/thb-lak', label: 'THB/LAK', title: 'ບາດເປັນກີບ', description: 'ຄູ່ເງິນສຳຄັນສຳລັບໄທ-ລາວ ການເດີນທາງ ແລະການຄ້າຊາຍແດນ.' },
      { href: '/thb-mmk', label: 'THB/MMK', title: 'ບາດເປັນຈາດມຽນມາ', description: 'ປະເມີນການໂອນເງິນ ແລະຄ່າໃຊ້ຈ່າຍປະຈຳວັນ.' },
      { href: '/thb-khr', label: 'THB/KHR', title: 'ບาดເປັນຣຽວກຳປູເຈຍ', description: 'ເໝາະສຳລັບທ່ອງທ່ຽວ ການຄ້າຊາຍແດນ ແລະການປຽບທຽບລາຄາ.' },
    ],
    useCases: [
      { title: 'ເຊັກກ່ອນແລກເງິນສົດ', body: 'ປະເມີນຍອດບາດ ໂດລາ ເອີໂຣ ເຢນ ແລະເງິນເພື່ອນບ້ານກ່ອນແລກ ຫຼືໂອນ.' },
      { title: 'ຄຳນວນລາຄາອອນລາຍ', body: 'ແປງລາຄາສິນຄ້າ ຄ່າບໍລິການ ລາຍຮັບຕ່າງປະເທດ ຫຼື USDT.' },
      { title: 'ຕິດຕາມເງິນພາກພື້ນ', body: 'ເບິ່ງ THB, LAK, MMK ແລະ KHR ໃນໜ້າດຽວ.' },
    ],
    faqs: [
      { question: 'zrate.io ໃຊ້ເຮັດຫຍັງ?', answer: 'zrate.io ແມ່ນເຄື່ອງມືເບິ່ງອັດຕາແລກປ່ຽນ ແລະແປງເງິນອອນລາຍ.' },
      { question: 'ອັດຕາອັບເດດເທົ່າໃດ?', answer: 'ໜ້າຫຼັກດຶງຂໍ້ມູນໃໝ່ທຸກ 60 ວິນາທີ ແລະມີຂໍ້ມູນສຳຮອງ.' },
      { question: 'ເບິ່ງ USD/THB ແລະ USDT/THB ໄດ້ບໍ?', answer: 'ໄດ້ ເລືອກໃນເຄື່ອງມືແປງເງິນ ຫຼືເຂົ້າໜ້າຄູ່ເງິນໂດຍກົງ.' },
      { question: 'ເລດນີ້ເປັນເລດທະນາຄານບໍ?', answer: 'ເປັນຄ່າອ້າງອີງເພື່ອຄຳນວນເບື້ອງຕົ້ນ ທະນາຄານ ຫຼືຮ້านແລກເງິນອາດມີຄ່າທຳນຽມ.' },
    ],
  },
  my: {
    usdtName: 'Tether USD',
    heroEyebrow: 'တိုက်ရိုက်ငွေကြေးစားပွဲ',
    heroHeading: 'ငွေကြေးကိုမြန်မြန်ပြောင်းပြီး အရေးကြီးနှုန်းများကို တစ်နေရာတည်းတွင်ကြည့်ပါ',
    heroBody: 'ထိုင်းဘတ်၊ ဒေါ်လာ၊ USDT၊ ယူရို၊ ယန်းနှင့် ဒေသတွင်းငွေကြေးများကို တိုက်ရိုက်နှိုင်းယှဉ်နိုင်သည်။',
    recommendedPairsLabel: 'အကြံပြုคู่ငွေ',
    featuredRatesLabel: 'ထင်ရှားသောနှုန်းများ',
    pairMenuLabel: 'လူကြိုက်များသောคู่ငွေ',
    converterTitle: 'ငွေကြေးပြောင်းစက်',
    marketKicker: 'ဈေးကွက်ဇယား',
    marketHeading: base => `${base} ငွေလဲဇယား`,
    oneUnit: '1',
    to: 'မှ',
    refreshRates: 'နှုန်းများပြန်တင်ရန်',
    clearSearch: 'ရှာဖွေမှုရှင်းရန်',
    switchToDark: 'အမှောင်မုဒ်သို့ပြောင်းရန်',
    switchToLight: 'အလင်းမုဒ်သို့ပြောင်းရန်',
    currencyGuide: 'ငွေကြေးလမ်းညွှန်',
    articleHeading: 'ယနေ့ငွေလဲနှုန်းများနှင့် အွန်လိုင်းငွေကြေးပြောင်းစက်',
    articleBody: 'zrate.io သည် ထိုင်းဘတ်၊ ဒေါ်လာ၊ ယူရို၊ ယန်း၊ USDT နှင့် ဒေသတွင်းငွေကြေးများ၏ ယနေ့နှုန်းများကို မြန်မြန်စစ်ဆေးရန် ကူညီပေးသည်။',
    whyHeading: 'ငွေလဲခြင်း သို့မဟုတ် ငွေလွှဲခြင်းမပြုမီ ဘာကြောင့်စစ်ဆေးရမလဲ',
    whyBody: 'ငွေလဲနှုန်းများသည် တစ်နေ့အတွင်းပြောင်းလဲနိုင်သည်။ လက်ရှိနှုန်းကိုစစ်ဆေးခြင်းက ရရှိမည့်ပမာဏကိုခန့်မှန်းရာတွင်ကူညီသည်။',
    howHeading: 'zrate.io ကိုအသုံးပြုနည်း',
    howSteps: ['ပြောင်းလိုသောငွေပမာဏကိုထည့်ပါ', 'မူရင်းငွေကြေးကိုရွေးပါ', 'ဇယားတွင်ရလဒ်ကိုကြည့်ပါ သို့မဟုတ် လိုအပ်သောကုဒ်ကိုရှာပါ'],
    popularPairsHeading: 'လူများမကြာခဏရှာသောငွေကြေးคู่များ',
    popularPairsCta: 'USD/THB ကြည့်ရန်',
    regionHeading: 'ထိုင်း၊ လာအို၊ မြန်မာ၊ ကမ္ဘောဒီးယား နှင့် USDT နှုန်းများ',
    regionBody: 'အရှေ့တောင်အာရှအသုံးပြုသူများအတွက် ထိုင်းဘတ်ကို လာအိုကျပ်၊ မြန်မာကျပ်နှင့် ကမ္ဘောဒီးယားရီယယ်နှင့် နှိုင်းယှဉ်ခြင်းသည်နေ့စဉ်လိုအပ်ချက်ဖြစ်သည်။',
    keywordLinksLabel: 'ငွေလဲနှုန်းလင့်များ',
    faqHeading: 'ယနေ့ငွေလဲနှုန်းများအကြောင်း မေးလေ့ရှိသောမေးခွန်းများ',
    schemaItemListName: 'zrate.io ပေါ်ရှိလူကြိုက်များသောငွေကြေးคู่များ',
    popularPairs: [
      { href: '/usd-thb', label: 'USD/THB', title: 'ဒေါ်လာမှထိုင်းဘတ်', description: 'ဒေါ်လာနှုန်း၊ ငွေလွှဲ၊ ဝယ်ယူမှုနှင့် ငွေလဲရန်အစီအစဉ်အတွက်အသုံးဝင်သည်။' },
      { href: '/usdt-thb', label: 'USDT/THB', title: 'USDT မှထိုင်းဘတ်', description: 'USDT တန်ဖိုးနှင့် crypto အညွှန်းဈေးနှုန်းကိုခန့်မှန်းရန်။' },
      { href: '/eur-thb', label: 'EUR/THB', title: 'ယူရိုမှထိုင်းဘတ်', description: 'ခရီးသွားခြင်း၊ စီးပွားရေးနှင့် နိုင်ငံတကာပေးချေမှုများအတွက်။' },
      { href: '/thb-lak', label: 'THB/LAK', title: 'ထိုင်းဘတ်မှလာအိုကျပ်', description: 'ထိုင်း-လာအို ခရီးသွားခြင်းနှင့် နယ်စပ်ကုန်သွယ်မှုအတွက်။' },
      { href: '/thb-mmk', label: 'THB/MMK', title: 'ထိုင်းဘတ်မှမြန်မာကျပ်', description: 'ငွေလွှဲနှင့် နေ့စဉ်ကုန်ကျစရိတ်တွက်ရန်။' },
      { href: '/thb-khr', label: 'THB/KHR', title: 'ထိုင်းဘတ်မှကမ္ဘောဒီးယားရီယယ်', description: 'ခရီးသွား၊ နယ်စပ်ကုန်သွယ်မှုနှင့် ဈေးနှုန်းနှိုင်းယှဉ်ရန်။' },
    ],
    useCases: [
      { title: 'ငွေသားမလဲခင်စစ်ဆေးရန်', body: 'THB, USD, EUR, JPY နှင့် ဒေသတွင်းငွေကြေးများကို ငွေလဲ/ငွေလွှဲမပြုမီခန့်မှန်းပါ။' },
      { title: 'အွန်လိုင်းဈေးနှုန်းတွက်ရန်', body: 'ကုန်ပစ္စည်းဈေး၊ ဝန်ဆောင်ခ၊ နိုင်ငံခြားဝင်ငွေ သို့မဟုတ် USDT ကိုဒေသငွေကြေးတန်ဖိုးအဖြစ်တွက်ပါ။' },
      { title: 'ဒေသတွင်းငွေကြေးများကိုလိုက်ကြည့်ရန်', body: 'THB, LAK, MMK နှင့် KHR ကိုတစ်နေရာတည်းတွင်ကြည့်နိုင်သည်။' },
    ],
    faqs: [
      { question: 'zrate.io ကိုဘာအတွက်အသုံးပြုသလဲ?', answer: 'zrate.io သည် ယနေ့ငွေလဲနှုန်းများနှင့် ငွေကြေးပြောင်းစက်အတွက်အသုံးပြုနိုင်သောအွန်လိုင်းကိရိယာဖြစ်သည်။' },
      { question: 'နှုန်းများကိုမည်မျှကြာတိုင်းအပ်ဒိတ်လုပ်သလဲ?', answer: 'ပင်မစာမျက်နှာသည် 60 စက္ကန့်တိုင်းအလိုအလျောက်အပ်ဒိတ်လုပ်ပြီး fallback data ပါရှိသည်။' },
      { question: 'USD/THB နှင့် USDT/THB ကြည့်နိုင်သလား?', answer: 'ကြည့်နိုင်သည်။ ပင်မ converter မှရွေးချယ်နိုင်ပြီး သီးသန့် pair page များသို့လည်းဝင်နိုင်သည်။' },
      { question: 'ဤနှုန်းများသည်ဘဏ်နှုန်းများလား?', answer: 'ဤနှုန်းများသည် အမြန်တွက်ချက်ရန်အတွက်အညွှန်းတန်ဖိုးများဖြစ်သည်။ ဘဏ်များနှင့်ငွေလဲဆိုင်များတွင် fee/spread ရှိနိုင်သည်။' },
    ],
  },
  km: {
    usdtName: 'Tether USD',
    heroEyebrow: 'តារាងរូបិយប័ណ្ណផ្ទាល់',
    heroHeading: 'បម្លែងរូបិយប័ណ្ណបានលឿន និងមើលអត្រាសំខាន់ៗក្នុងទំព័រតែមួយ',
    heroBody: 'ប្រៀបធៀបប្រាក់បាត ដុល្លារ USDT អឺរ៉ូ យ៉េន និងរូបិយប័ណ្ណក្នុងតំបន់តាមពេលវេលាពិត។',
    recommendedPairsLabel: 'គូរូបិយប័ណ្ណណែនាំ',
    featuredRatesLabel: 'អត្រាសំខាន់ៗ',
    pairMenuLabel: 'គូរូបិយប័ណ្ណពេញនិយម',
    converterTitle: 'ឧបករណ៍បម្លែងរូបិយប័ណ្ណ',
    marketKicker: 'តារាងទីផ្សារ',
    marketHeading: base => `តារាងអត្រា ${base}`,
    oneUnit: '1',
    to: 'ទៅ',
    refreshRates: 'ធ្វើបច្ចុប្បន្នភាពអត្រា',
    clearSearch: 'សម្អាតការស្វែងរក',
    switchToDark: 'ប្តូរទៅរបៀបងងឹត',
    switchToLight: 'ប្តូរទៅរបៀបភ្លឺ',
    currencyGuide: 'មគ្គុទ្ទេសក៍រូបិយប័ណ្ណ',
    articleHeading: 'អត្រាប្តូរប្រាក់ថ្ងៃនេះ និងឧបករណ៍បម្លែងរូបិយប័ណ្ណអនឡាញ',
    articleBody: 'zrate.io ជួយពិនិត្យអត្រាប្តូរប្រាក់ថ្ងៃនេះបានលឿន សម្រាប់ប្រាក់បាត ដុល្លារ អឺរ៉ូ យ៉េន USDT និងរូបិយប័ណ្ណក្នុងតំបន់។',
    whyHeading: 'ហេតុអ្វីគួរពិនិត្យអត្រាមុនប្តូរ ឬផ្ទេរប្រាក់',
    whyBody: 'អត្រាប្តូរប្រាក់អាចផ្លាស់ប្តូរពេញមួយថ្ងៃ។ การពិនិត្យអត្រាចុងក្រោយជួយប៉ាន់ស្មានចំនួនប្រាក់បានច្បាស់ជាងមុន។',
    howHeading: 'របៀបប្រើ zrate.io',
    howSteps: ['បញ្ចូលចំនួនប្រាក់ដែលចង់បម្លែង', 'ជ្រើសរើសរូបិយប័ណ្ណដើម', 'មើលលទ្ធផលក្នុងតារាង ឬស្វែងរកកូដរូបិយប័ណ្ណ'],
    popularPairsHeading: 'គូរូបិយប័ណ្ណដែលគេស្វែងរកញឹកញាប់',
    popularPairsCta: 'មើល USD/THB',
    regionHeading: 'អត្រាប្រាក់ថៃ ឡាវ មីយ៉ាន់ម៉ា កម្ពុជា និង USDT ក្នុងទំព័រតែមួយ',
    regionBody: 'សម្រាប់អ្នកប្រើក្នុងអាស៊ីអាគ្នេយ៍ ការប្រៀបធៀបប្រាក់បាតជាមួយគីបឡាវ គ្យាតមីយ៉ាន់ម៉ា និងរៀលកម្ពុជា ជាតម្រូវការប្រចាំថ្ងៃ។',
    keywordLinksLabel: 'តំណអត្រាប្តូរប្រាក់',
    faqHeading: 'សំណួរដែលគេសួរញឹកញាប់អំពីអត្រាប្តូរប្រាក់ថ្ងៃនេះ',
    schemaItemListName: 'គូរូបិយប័ណ្ណពេញនិយមលើ zrate.io',
    popularPairs: [
      { href: '/usd-thb', label: 'USD/THB', title: 'ដុល្លារទៅប្រាក់បាត', description: 'សម្រាប់ពិនិត្យអត្រាដុល្លារ ផ្ទេរប្រាក់ ទិញទំនិញ និងគ្រោងប្តូរប្រាក់สด។' },
      { href: '/usdt-thb', label: 'USDT/THB', title: 'USDT ទៅប្រាក់បាត', description: 'ប៉ាន់ស្មានតម្លៃ USDT និងតម្លៃយោងគ្រីបតូ។' },
      { href: '/eur-thb', label: 'EUR/THB', title: 'អឺរ៉ូទៅប្រាក់បាត', description: 'តាមដានអត្រាអឺរ៉ូសម្រាប់ដំណើរកម្សាន្ត ពាណិជ្ជកម្ម និងការទូទាត់អន្តរជាតិ។' },
      { href: '/thb-lak', label: 'THB/LAK', title: 'ប្រាក់បាតទៅគីបឡាវ', description: 'សម្រាប់ដំណើរកម្សាន្ត និងពាណិជ្ជកម្មថៃ-ឡាវ។' },
      { href: '/thb-mmk', label: 'THB/MMK', title: 'ប្រាក់បាតទៅគ្យាតមីយ៉ាន់ម៉ា', description: 'ប៉ាន់ស្មានការផ្ទេរប្រាក់ និងចំណាយប្រចាំថ្ងៃ។' },
      { href: '/thb-khr', label: 'THB/KHR', title: 'ប្រាក់បាតទៅរៀលកម្ពុជា', description: 'សម្រាប់ដំណើរកម្សាន្ត ពាណិជ្ជកម្មព្រំដែន និងការប្រៀបធៀបតម្លៃ។' },
    ],
    useCases: [
      { title: 'ពិនិត្យមុនប្តូរប្រាក់สด', body: 'ប៉ាន់ស្មានតម្លៃ THB, USD, EUR, JPY និងរូបិយប័ណ្ណក្នុងតំបន់ មុនប្តូរ ឬផ្ទេរប្រាក់។' },
      { title: 'គណនាតម្លៃអនឡាញ', body: 'បម្លែងតម្លៃទំនិញ សេវាកម្ម ចំណូលបរទេស ឬ USDT ទៅជាតម្លៃក្នុងរូបិយប័ណ្ណក្នុងស្រុក។' },
      { title: 'តាមដានរូបិយប័ណ្ណក្នុងតំបន់', body: 'មើល THB, LAK, MMK និង KHR ក្នុងទំព័រតែមួយ។' },
    ],
    faqs: [
      { question: 'zrate.io ប្រើសម្រាប់អ្វី?', answer: 'zrate.io គឺជាឧបករណ៍អនឡាញសម្រាប់ពិនិត្យអត្រាប្តូរប្រាក់ និងបម្លែងរូបិយប័ណ្ណ។' },
      { question: 'អត្រាធ្វើបច្ចុប្បន្នភាពញឹកញាប់ប៉ុណ្ណា?', answer: 'ទំព័រដើមធ្វើបច្ចុប្បន្នភាពរៀងរាល់ 60 វិនាទី និងមានទិន្នន័យបម្រុង។' },
      { question: 'អាចមើល USD/THB និង USDT/THB បានទេ?', answer: 'បាន។ អាចជ្រើសរើសក្នុង converter ឬបើកទំព័រគូរូបិយប័ណ្ណដោយផ្ទាល់។' },
      { question: 'អត្រានេះជាអត្រាធនាគារឬ?', answer: 'អត្រានេះគឺសម្រាប់យោង និងគណនាបឋម។ ធនាគារ ឬហាងប្តូរប្រាក់អាចមានថ្លៃសេវា និង spread បន្ថែម។' },
    ],
  },
}

const SPOTLIGHT_PAIRS = [
  { base: 'USD', quote: 'THB', label: 'USD/THB' },
  { base: 'USDT', quote: 'THB', label: 'USDT/THB' },
  { base: 'EUR', quote: 'THB', label: 'EUR/THB' },
  { base: 'THB', quote: 'LAK', label: 'THB/LAK' },
]

export default function HomeClient({
  locale,
  initialBase,
  initialRates,
  history,
  news,
  chartBase,
  chartQuote,
}: {
  locale: LanguageCode
  initialBase: string
  initialRates: Record<string, number>
  history: HistoricalPoint[]
  news: NewsItem[]
  chartBase: string
  chartQuote: string
}) {
  const [rates, setRates] = useState<Rates>(initialRates)
  const [language, setLanguage] = useState<LanguageCode>(locale)
  const [baseCurrency, setBaseCurrency] = useState(initialBase)
  const [amount, setAmount] = useState('1')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(Object.keys(initialRates).length === 0)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [favorites, setFavorites] = useState<string[]>(CURRENCY_PRIORITY[locale])
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  const [activeChartBase, setActiveChartBase] = useState(chartBase)
  const [activeChartQuote, setActiveChartQuote] = useState(chartQuote)
  const [chartHistory, setChartHistory] = useState<HistoricalPoint[]>(history)
  const [chartNews, setChartNews] = useState<NewsItem[]>(news)
  const [chartLoading, setChartLoading] = useState(false)

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    const loadChartData = async () => {
      setChartLoading(true)
      try {
        const [histRes, newsRes] = await Promise.all([
          fetch(`/api/history?base=${activeChartBase}&quote=${activeChartQuote}&days=365`, { signal: controller.signal }),
          fetch(`/api/news?base=${activeChartBase}&quote=${activeChartQuote}`, { signal: controller.signal })
        ])
        if (!active) return
        if (histRes.ok) {
          const histData = await histRes.json()
          setChartHistory(histData)
        }
        if (newsRes.ok) {
          const newsData = await newsRes.json()
          setChartNews(newsData)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Failed to load dynamic chart data:', err)
        }
      } finally {
        if (active) setChartLoading(false)
      }
    }

    if (activeChartBase !== chartBase || activeChartQuote !== chartQuote) {
      loadChartData()
    } else {
      setChartHistory(history)
      setChartNews(news)
    }

    return () => {
      active = false
      controller.abort()
    }
  }, [activeChartBase, activeChartQuote, chartBase, chartQuote, history, news])

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
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (Object.keys(initialRates).length > 0 && lastUpdated === null) {
      setLastUpdated(new Date())
    }
  }, [initialRates, lastUpdated])

  const toggleTheme = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('zrate-theme', next)
    setTheme(next)
  }, [theme])

  const fetchRates = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setError('')
    try {
      // Use internal /api/rates with server-side caching + CDN cache
      const res = await fetch(`/api/rates?base=${baseCurrency}`, signal ? { signal } : undefined)
      if (!res.ok) throw new Error('Network error')
      const data = await res.json()
      setRates(data.rates)
      setLastUpdated(new Date(data.timestamp))
    } catch (err) {
      if (signal?.aborted) return
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
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }, [baseCurrency, language])

  const hasRates = Object.keys(rates).length > 0

  // Sync rates while the tab is active. Hidden tabs should not keep waking the server.
  useEffect(() => {
    const controller = new AbortController()

    if (!hasRates) {
      fetchRates(controller.signal)
    }

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchRates(controller.signal)
      }
    }, 120000) // poll every 2 min only while visible

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchRates(controller.signal)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      controller.abort()
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchRates, hasRates])

  const t = UI_TEXT[language] || UI_TEXT.th
  const content = LOCALIZED_CONTENT[language] || LOCALIZED_CONTENT.th
  const selectedLanguage = LANGUAGE_OPTIONS.find(item => item.code === language) ?? LANGUAGE_OPTIONS[0]
  const isCompactTitle = language === 'lo' || language === 'my' || language === 'km'
  const amountNum = parseFloat(amount) || 0
  const currencies = Object.keys(CURRENCY_INFO)
  const currencyDisplayNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([selectedLanguage.locale], { type: 'currency' })
    } catch {
      return null
    }
  }, [selectedLanguage.locale])

  const getCurrencyName = useCallback((currency: string) => {
    if (currency === 'USDT') return content.usdtName
    return currencyDisplayNames?.of(currency) ?? CURRENCY_INFO[currency]?.name ?? currency
  }, [content.usdtName, currencyDisplayNames])

  const filtered = currencies.filter(c =>
    c.toLowerCase().includes(search.toLowerCase()) ||
    getCurrencyName(c).toLowerCase().includes(search.toLowerCase())
  )

  const sortedCurrencies = useMemo(() => {
    const preferred = CURRENCY_PRIORITY[language] || CURRENCY_PRIORITY.th
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
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
    document.cookie = `${LANGUAGE_STORAGE_KEY}=${nextLanguage}; path=/; max-age=31536000; SameSite=Lax`
    
    // Redirect to localized homepage
    const targetPath = nextLanguage === 'th' ? '/' : `/${nextLanguage}`
    window.location.href = targetPath
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

  const getCrossRate = (base: string, quote: string) => {
    if (base === quote) return 1
    const baseRate = base === baseCurrency ? 1 : rates[base]
    const quoteRate = quote === baseCurrency ? 1 : rates[quote]
    if (!baseRate || !quoteRate) return null
    return quoteRate / baseRate
  }

  const formatSpotlightRate = (value: number | null) => {
    if (!value) return t.syncing
    if (value >= 1000) return value.toLocaleString(selectedLanguage.locale, { maximumFractionDigits: 2 })
    if (value >= 1) return value.toLocaleString(selectedLanguage.locale, { maximumFractionDigits: 4 })
    return value.toFixed(6)
  }

  const prefix = language === 'th' ? '' : `/${language}`

  const homepageJsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        '@id': `https://zrate.io${prefix}/#faq`,
        mainEntity: content.faqs.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `https://zrate.io${prefix}/#popular-currency-pairs`,
        name: content.schemaItemListName,
        itemListElement: content.popularPairs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: `${item.label} ${item.title}`,
          url: `https://zrate.io${prefix}${item.href}`,
        })),
      },
    ],
  }), [content, prefix])

  return (
    <main className={styles.main}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
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
            <h1 className={`${styles.logoText} ${isCompactTitle ? styles.compactTitle : ''}`}>
              zrate.io
            </h1>
            <p className={styles.logoSub}>{t.heroDescription}</p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.statusBar}>
            <span className={`${styles.statusDot} ${loading ? styles.loading : styles.live}`}></span>
            <span className={styles.statusText}>
              {loading ? t.syncing : error ? t.offline : t.live}
            </span>
            {lastUpdated && (
              <span className={styles.updateTime} suppressHydrationWarning>
                {lastUpdated.toLocaleTimeString(selectedLanguage.locale)}
              </span>
            )}
          </div>

          <button
            className={styles.iconBtn}
            onClick={() => fetchRates()}
            disabled={loading}
            title={content.refreshRates}
            aria-label={content.refreshRates}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>

          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            title={theme === 'light' ? content.switchToDark : content.switchToLight}
            aria-label={theme === 'light' ? content.switchToDark : content.switchToLight}
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

      <SeoNav lang={language} active="home" />

      {/* Error Banner */}
      {error && (
        <div className={styles.errorBanner}>
          <span>{error}</span>
        </div>
      )}

      <section className={styles.heroShell} aria-labelledby="home-hero-heading">
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}>{content.heroEyebrow}</p>
          <h2 id="home-hero-heading">{content.heroHeading}</h2>
          <p>{content.heroBody}</p>
          <div className={styles.heroLinks} aria-label={content.recommendedPairsLabel}>
            <Link href={`${prefix}/usd-thb`}>USD/THB</Link>
            <Link href={`${prefix}/usdt-thb`}>USDT/THB</Link>
            <Link href={`${prefix}/thb-lak`}>THB/LAK</Link>
            <Link href={`${prefix}/thb-mmk`}>THB/MMK</Link>
          </div>
        </div>

        <div className={styles.heroMetrics} aria-label={content.featuredRatesLabel}>
          {SPOTLIGHT_PAIRS.map(pair => {
            const pairRate = getCrossRate(pair.base, pair.quote)
            return (
              <Link className={styles.metricCard} href={`${prefix}/${pair.base.toLowerCase()}-${pair.quote.toLowerCase()}`} key={pair.label}>
                <span>{pair.label}</span>
                <strong>{formatSpotlightRate(pairRate)}</strong>
                <small>{content.oneUnit} {pair.base} {content.to} {pair.quote}</small>
              </Link>
            )
          })}
        </div>
      </section>

      <nav className={styles.pairMenu} aria-label={content.pairMenuLabel}>
        <span className={styles.pairMenuLabel}>{content.pairMenuLabel}</span>
        <div className={styles.pairTickerViewport}>
          <div className={styles.pairMenuLinks}>
            {[...SEO_PAIR_LINKS, ...SEO_PAIR_LINKS].map((item, index) => (
              <Link href={`${prefix}${item.href}`} key={`${item.href}-${index}`}>
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
          <div className={styles.converterPanelHeader}>
            <div>
              <div className={styles.panelLabel}>{t.baseCurrency}</div>
              <h2>{content.converterTitle}</h2>
            </div>
            <span>{loading ? t.syncing : error ? t.offline : t.live}</span>
          </div>
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
                    {CURRENCY_INFO[c]?.flag} {c} — {getCurrencyName(c)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <div className={styles.marketToolbar}>
        <div>
          <p className={styles.toolbarKicker}>{content.marketKicker}</p>
          <h2>{content.marketHeading(baseCurrency)}</h2>
        </div>
        <div className={styles.searchWrapper}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <button className={styles.clearSearch} onClick={() => setSearch('')} aria-label={content.clearSearch}>×</button>
            )}
          </div>
          <div className={styles.resultCount}>
            {sortedCurrencies.length} {t.currencies}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className={styles.gridSection}>
        {loading && Object.keys(rates).length === 0 ? (
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
                      aria-label={isFav ? t.removeFavorite : t.addFavorite}
                    >
                      {isFav ? '★' : '☆'}
                    </button>
                  </div>
                  <div className={styles.currencyName}>{getCurrencyName(currency)}</div>
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
                    {isBase ? `${t.active}` : t.setBase}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <NativeBannerAd />

      {/* Interactive Chart Section */}
      {chartHistory && chartHistory.length > 0 && (
        <section className={pairStyles.chartSection} aria-label="Exchange Rate Chart">
          <div className={pairStyles.chartHeader}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
              <div>
                <h3>
                  {language === 'th' ? `กราฟประวัติอัตราแลกเปลี่ยน ${activeChartBase}/${activeChartQuote}`
                   : language === 'en' ? `${activeChartBase}/${activeChartQuote} Historical Rate Chart`
                   : language === 'lo' ? `ກຣາບປະຫວັດອັດຕาແລກປ່ຽນ ${activeChartBase}/${activeChartQuote}`
                   : language === 'my' ? `${activeChartBase}/${activeChartQuote} ငွေလဲနှုန်းပြောင်းလဲမှုဇယား`
                   : `គំនូសតាងប្រវត្តិនៃអត្រាប្តូរប្រាក់ ${activeChartBase}/${activeChartQuote}`}
                </h3>
                <div className={pairStyles.chartSub}>
                  {language === 'th' ? `แสดงความเคลื่อนไหวและมูลค่าของสกุลเงิน ${activeChartBase} เทียบกับ ${activeChartQuote} ตามช่วงเวลา`
                   : language === 'en' ? `Shows value fluctuations of ${activeChartBase} against ${activeChartQuote} over selected time periods`
                   : language === 'lo' ? `ສະແດງການເຫນັງຕີງ ແລະມູນຄ່າຂອງສະກຸນເງິນ ${activeChartBase} ທຽບກັບ ${activeChartQuote} ຕາມໄລຍະເວລາ`
                   : language === 'my' ? `သတ်မှတ်ထားသော ကာလအပိုင်းအခြားအလိုက် ${activeChartBase} နှင့် ${activeChartQuote} ငွေလဲနှုန်း အပြောင်းအလဲများကို ဖော်ပြချက်`
                   : `បង្ហាញการប្រែប្រួលតម្លៃនៃ ${activeChartBase} ធៀបនឹង ${activeChartQuote} ទៅតាមរយៈពេលកំណត់`}
                </div>
              </div>

              {/* Dynamic Currency Selectors */}
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                alignItems: 'center', 
                background: 'var(--bg-elevated, #ffffff)', 
                padding: '8px 16px', 
                borderRadius: '12px', 
                border: '1px solid var(--border, rgba(148, 163, 184, 0.2))',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}>
                <select 
                  value={activeChartBase} 
                  onChange={e => setActiveChartBase(e.target.value)}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--ink, #0f172a)', 
                    fontSize: '0.92rem', 
                    fontWeight: 700, 
                    outline: 'none', 
                    cursor: 'pointer',
                    paddingRight: '4px'
                  }}
                  aria-label="Chart base currency"
                >
                  {currencies.map(c => (
                    <option key={`chart-base-${c}`} value={c} style={{ background: 'var(--bg-surface, #f8fafc)', color: 'var(--ink)' }}>
                      {CURRENCY_INFO[c]?.flag} {c}
                    </option>
                  ))}
                </select>
                <span style={{ color: 'var(--ink-dim, #94a3b8)', fontWeight: 600 }}>→</span>
                <select 
                  value={activeChartQuote} 
                  onChange={e => setActiveChartQuote(e.target.value)}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--ink, #0f172a)', 
                    fontSize: '0.92rem', 
                    fontWeight: 700, 
                    outline: 'none', 
                    cursor: 'pointer',
                    paddingLeft: '4px'
                  }}
                  aria-label="Chart target currency"
                >
                  {currencies.map(c => (
                    <option key={`chart-quote-${c}`} value={c} style={{ background: 'var(--bg-surface, #f8fafc)', color: 'var(--ink)' }}>
                      {CURRENCY_INFO[c]?.flag} {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={{ opacity: chartLoading ? 0.6 : 1, transition: 'opacity 0.2s ease', position: 'relative' }}>
            {chartLoading && (
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: 'rgba(248, 250, 252, 0.4)', 
                backdropFilter: 'blur(1px)',
                borderRadius: '8px',
                zIndex: 10 
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--bg-elevated, #ffffff)',
                  border: '1px solid var(--border, rgba(148, 163, 184, 0.2))',
                  padding: '8px 16px',
                  borderRadius: '30px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  color: 'var(--ink)'
                }}>
                  <div className={styles.loadingSpinner} style={{ width: '14px', height: '14px', margin: 0 }}></div>
                  <span>{language === 'th' ? 'กำลังดึงข้อมูล...' : 'Loading...'}</span>
                </div>
              </div>
            )}
            <InteractiveChart history={chartHistory} lang={language} baseSymbol={activeChartBase} quoteSymbol={activeChartQuote} />
          </div>
        </section>
      )}

      {/* ASEAN Dashboard Section */}
      <AseanDashboard lang={language} />

      {/* News Feed Section */}
      {chartNews && chartNews.length > 0 && (
        <div style={{ opacity: chartLoading ? 0.6 : 1, transition: 'opacity 0.2s ease' }}>
          <NewsFeed news={chartNews} lang={language} baseSymbol={activeChartBase} quoteSymbol={activeChartQuote} />
        </div>
      )}

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

      <section className={styles.seoArticle} aria-labelledby="today-exchange-rate-heading">
        <div className={styles.seoArticleHeader}>
          <p className={styles.seoKicker}>{content.currencyGuide}</p>
          <h2 id="today-exchange-rate-heading">{content.articleHeading}</h2>
          <p>{content.articleBody}</p>
        </div>

        <div className={styles.seoTwoColumn}>
          <article>
            <h3>{content.whyHeading}</h3>
            <p>{content.whyBody}</p>
          </article>
          <article>
            <h3>{content.howHeading}</h3>
            <ol>
              {content.howSteps.map(step => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>
        </div>

        <div className={styles.intentGrid}>
          {content.useCases.map(item => (
            <article className={styles.intentCard} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>

        <section className={styles.popularPairsSection} aria-labelledby="popular-pairs-heading">
          <div className={styles.sectionHeadingRow}>
            <h2 id="popular-pairs-heading">{content.popularPairsHeading}</h2>
            <Link href={`${prefix}/usd-thb`}>{content.popularPairsCta}</Link>
          </div>
          <div className={styles.popularPairGrid}>
            {content.popularPairs.map(item => (
              <Link className={styles.popularPairCard} href={`${prefix}${item.href}`} key={item.href}>
                <span>{item.label}</span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.regionSeo} aria-labelledby="region-currency-heading">
          <h2 id="region-currency-heading">{content.regionHeading}</h2>
          <p>{content.regionBody}</p>
          <div className={styles.keywordLinks} aria-label={content.keywordLinksLabel}>
            {SEO_PAIR_LINKS.map(item => (
              <Link href={`${prefix}${item.href}`} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.faqSection} aria-labelledby="faq-heading">
          <h2 id="faq-heading">{content.faqHeading}</h2>
          <div className={styles.faqList}>
            {content.faqs.map(item => (
              <details className={styles.faqItem} key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </section>

      <Footer lang={language} />
    </main>
  )
}
