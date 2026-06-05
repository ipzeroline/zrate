export type LanguageCode = 'th' | 'en' | 'lo' | 'my' | 'km'

export const SITE_URL = 'https://zrate.io'

export const LOCALES: LanguageCode[] = ['th', 'en', 'lo', 'my', 'km']

export const PAIRS = [
  'usd-thb',
  'usd-lak',
  'usd-mmk',
  'usd-khr',
  'eur-thb',
  'eur-usd',
  'thb-usd',
  'thb-lak',
  'thb-mmk',
  'thb-khr',
  'thb-jpy',
  'thb-cny',
  'usdt-thb',
  'usdt-usd',
  'jpy-thb',
  'cny-thb',
  'sgd-thb',
  'krw-thb',
] as const

export type PairSlug = typeof PAIRS[number]

export const FEATURED_PAIRS: PairSlug[] = [
  'usd-thb',
  'usdt-thb',
  'thb-lak',
  'thb-mmk',
  'thb-khr',
  'eur-thb',
]

export const REGIONAL_PAIRS: PairSlug[] = [
  'thb-lak',
  'thb-mmk',
  'thb-khr',
  'usd-lak',
  'usd-mmk',
  'usd-khr',
]

export const STATIC_ROUTES = [
  '',
  '/rates',
  '/currency-pairs',
  '/money-transfer',
  '/blog',
  '/about',
  '/contact',
  '/privacy',
] as const

export const NAV_TEXT: Record<LanguageCode, {
  home: string
  rates: string
  pairs: string
  transfer: string
  blog: string
  about: string
  contact: string
  privacy: string
  disclaimer: string
  mainMenu: string
  popularPairs: string
  allPairs: string
  regionalPairs: string
  resources: string
  company: string
  legal: string
  liveRates: string
}> = {
  th: {
    home: 'แปลงค่าเงิน',
    rates: 'อัตราแลกเปลี่ยน',
    pairs: 'คู่เงิน',
    transfer: 'โอนเงิน',
    blog: 'บทความ',
    about: 'เกี่ยวกับเรา',
    contact: 'ติดต่อทีมงาน',
    privacy: 'นโยบายความเป็นส่วนตัว',
    disclaimer: 'ข้อจำกัดความรับผิดชอบ',
    mainMenu: 'เมนูหลัก',
    popularPairs: 'คู่เงินยอดนิยม',
    allPairs: 'คู่เงินทั้งหมด',
    regionalPairs: 'คู่เงินอาเซียน',
    resources: 'คู่มือและบทความ',
    company: 'เว็บไซต์',
    legal: 'ข้อมูลสำคัญ',
    liveRates: 'เรทสด',
  },
  en: {
    home: 'Converter',
    rates: 'Exchange Rates',
    pairs: 'Currency Pairs',
    transfer: 'Money Transfer',
    blog: 'Blog',
    about: 'About',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    disclaimer: 'Disclaimer',
    mainMenu: 'Main menu',
    popularPairs: 'Popular pairs',
    allPairs: 'All currency pairs',
    regionalPairs: 'ASEAN pairs',
    resources: 'Guides and articles',
    company: 'Website',
    legal: 'Important information',
    liveRates: 'Live rates',
  },
  lo: {
    home: 'ແປງເງິນ',
    rates: 'ອັດຕາແລກປ່ຽນ',
    pairs: 'ຄູ່ເງິນ',
    transfer: 'ໂອນເງິນ',
    blog: 'ບົດຄວາມ',
    about: 'ກ່ຽວກັບເຮົາ',
    contact: 'ຕິດຕໍ່',
    privacy: 'ນະໂຍບາຍຄວາມລັບ',
    disclaimer: 'ຂໍ້ຈຳກັດຄວາມຮັບຜິດຊອບ',
    mainMenu: 'ເມນູຫຼັກ',
    popularPairs: 'ຄູ່ເງິນຍອດນິຍົມ',
    allPairs: 'ຄູ່ເງິນທັງໝົດ',
    regionalPairs: 'ຄູ່ເງິນອາຊຽນ',
    resources: 'ຄູ່ມືແລະບົດຄວາມ',
    company: 'ເວັບໄຊ',
    legal: 'ຂໍ້ມູນສຳຄັນ',
    liveRates: 'ເຣດສົດ',
  },
  my: {
    home: 'ငွေကြေးပြောင်းစက်',
    rates: 'ငွေလဲနှုန်းများ',
    pairs: 'ငွေကြေးအတွဲများ',
    transfer: 'ငွေလွှဲ',
    blog: 'ဆောင်းပါးများ',
    about: 'ကျွန်ုပ်တို့အကြောင်း',
    contact: 'ဆက်သွယ်ရန်',
    privacy: 'ကိုယ်ရေးလုံခြုံရေးမူဝါဒ',
    disclaimer: 'ငြင်းဆိုချက်',
    mainMenu: 'အဓိက menu',
    popularPairs: 'လူကြိုက်များသော အတွဲများ',
    allPairs: 'ငွေကြေးအတွဲအားလုံး',
    regionalPairs: 'အာဆီယံအတွဲများ',
    resources: 'လမ်းညွှန်နှင့် ဆောင်းပါးများ',
    company: 'ဝဘ်ဆိုက်',
    legal: 'အရေးကြီးသော အချက်အလက်များ',
    liveRates: 'တိုက်ရိုက်နှုန်းများ',
  },
  km: {
    home: 'បម្លែងប្រាក់',
    rates: 'អត្រាប្តូរប្រាក់',
    pairs: 'គូរូបិយប័ណ្ណ',
    transfer: 'ផ្ទេរប្រាក់',
    blog: 'អត្ថបទ',
    about: 'អំពីយើង',
    contact: 'ទំនាក់ទំនង',
    privacy: 'គោលការណ៍ឯកជនភាព',
    disclaimer: 'ការបដិសេធ',
    mainMenu: 'ម៉ឺនុយសំខាន់',
    popularPairs: 'គូរូបិយប័ណ្ណពេញនិយម',
    allPairs: 'គូរូបិយប័ណ្ណទាំងអស់',
    regionalPairs: 'គូអាស៊ាន',
    resources: 'មគ្គុទ្ទេសក៍ និងអត្ថបទ',
    company: 'គេហទំព័រ',
    legal: 'ព័ត៌មានសំខាន់',
    liveRates: 'អត្រាផ្ទាល់',
  },
}

export const PAIR_LABELS: Record<PairSlug, string> = Object.fromEntries(
  PAIRS.map(pair => [pair, pair.toUpperCase().replace('-', '/')])
) as Record<PairSlug, string>

export function getLocalePrefix(lang: LanguageCode) {
  return lang === 'th' ? '' : `/${lang}`
}

export function localizePath(lang: LanguageCode, path: string) {
  const prefix = getLocalePrefix(lang)
  if (!path || path === '/') return prefix || '/'
  return `${prefix}${path}`
}
