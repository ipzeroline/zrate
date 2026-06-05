import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import { NativeBannerAd, ResponsiveBannerAd } from '../components/AdsterraAds'
import { PairTopBar } from './PairTopBar'
import styles from './page.module.css'

type CurrencyCode = 'USD' | 'EUR' | 'USDT' | 'THB' | 'LAK' | 'MMK' | 'KHR' | 'JPY' | 'CNY' | 'SGD' | 'KRW'
type LanguageCode = 'th' | 'en' | 'lo' | 'my' | 'km'

const SITE_URL = 'https://zrate.io'
const LANGUAGE_COOKIE = 'zrate-language'
const LOCALE_BY_LANGUAGE: Record<LanguageCode, string> = {
  th: 'th-TH',
  en: 'en-US',
  lo: 'lo-LA',
  my: 'my-MM',
  km: 'km-KH',
}

const LANGUAGE_ALIASES: Record<string, LanguageCode> = {
  th: 'th',
  en: 'en',
  la: 'lo',
  lo: 'lo',
  my: 'my',
  kh: 'km',
  km: 'km',
}

const PAIRS = [
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

const CURRENCY_NAMES: Record<CurrencyCode, Record<LanguageCode, string>> = {
  USD: { th: 'ดอลลาร์สหรัฐ', en: 'US dollar', lo: 'ໂດລາສະຫະລັດ', my: 'အမေရိကန်ဒေါ်လာ', km: 'ដុល្លារអាមេរិក' },
  EUR: { th: 'ยูโร', en: 'euro', lo: 'ເອີໂຣ', my: 'ယူရို', km: 'អឺរ៉ូ' },
  USDT: { th: 'USDT', en: 'USDT', lo: 'USDT', my: 'USDT', km: 'USDT' },
  THB: { th: 'บาทไทย', en: 'Thai baht', lo: 'ບາດໄທ', my: 'ထိုင်းဘတ်', km: 'ប្រាក់បាតថៃ' },
  LAK: { th: 'กีบลาว', en: 'Lao kip', lo: 'ກີບລາວ', my: 'လာအိုကျပ်', km: 'គីបឡាវ' },
  MMK: { th: 'จ๊าตเมียนมา', en: 'Myanmar kyat', lo: 'ຈາດມຽນມາ', my: 'မြန်မာကျပ်', km: 'គ្យាតមីយ៉ាន់ម៉ា' },
  KHR: { th: 'เรียลกัมพูชา', en: 'Cambodian riel', lo: 'ຣຽວກຳປູເຈຍ', my: 'ကမ္ဘောဒီးယားရီယယ်', km: 'រៀលកម្ពុជា' },
  JPY: { th: 'เยนญี่ปุ่น', en: 'Japanese yen', lo: 'ເຢນຍີ່ປຸ່ນ', my: 'ဂျပန်ယန်း', km: 'យ៉េនជប៉ុន' },
  CNY: { th: 'หยวนจีน', en: 'Chinese yuan', lo: 'ຢວນຈີນ', my: 'တရုတ်ယွမ်', km: 'យន់ចិន' },
  SGD: { th: 'ดอลลาร์สิงคโปร์', en: 'Singapore dollar', lo: 'ໂດລາສິງກະໂປ', my: 'စင်ကာပူဒေါ်လာ', km: 'ដុល្លារសិង្ហបុរី' },
  KRW: { th: 'วอนเกาหลี', en: 'Korean won', lo: 'ວອນເກົາຫຼີ', my: 'ကိုရီးယားဝမ်', km: 'វ៉ុនកូរ៉េ' },
}

const SPECIAL_THAI_TITLES: Record<string, string> = {
  'usd-thb': 'อัตราแลกเปลี่ยน USD ต่อบาทวันนี้',
  'eur-thb': 'ยูโรเท่ากับกี่บาทวันนี้',
  'usdt-thb': 'USDT เท่ากับกี่บาทวันนี้',
}

const PAGE_TEXT: Record<LanguageCode, {
  pairMenuLabel: string
  pairMenuAria: string
  eyebrow: string
  rateDate: (date: string) => string
  rateHelp: (base: CurrencyCode, quote: CurrencyCode) => string
  examplesLabel: string
  summaryAria: string
  pairLabel: string
  fromLabel: string
  toLabel: string
  relatedHeading: string
  languageSuffix: string
}> = {
  th: {
    pairMenuLabel: 'คู่เงินยอดนิยม',
    pairMenuAria: 'เมนูคู่สกุลเงินยอดนิยม',
    eyebrow: 'อัตราแลกเปลี่ยนวันนี้',
    rateDate: date => `เรทอ้างอิง ณ วันที่ ${date}`,
    rateHelp: (base, quote) => `ตัวอย่างนี้ช่วยให้เห็นภาพการแปลงค่าเงิน ${base} เป็น ${quote} ในหน้าเดียว ก่อนกดกลับไปใช้ตัวแปลงค่าเงินจริงบน zrate.io`,
    examplesLabel: 'ตัวอย่างการแปลงค่าเงิน',
    summaryAria: 'สรุปคู่สกุลเงิน',
    pairLabel: 'คู่สกุลเงิน',
    fromLabel: 'จากสกุลเงิน',
    toLabel: 'เป็นสกุลเงิน',
    relatedHeading: 'คู่สกุลเงินยอดนิยมอื่นๆ ใน sitemap',
    languageSuffix: 'ภาษาไทย',
  },
  en: {
    pairMenuLabel: 'Popular pairs',
    pairMenuAria: 'Popular currency-pair menu',
    eyebrow: 'Today’s exchange rate',
    rateDate: date => `Reference rate on ${date}`,
    rateHelp: (base, quote) => `This example shows a quick ${base} to ${quote} conversion before using the live currency converter on zrate.io.`,
    examplesLabel: 'Currency conversion examples',
    summaryAria: 'Currency pair summary',
    pairLabel: 'Currency pair',
    fromLabel: 'From currency',
    toLabel: 'To currency',
    relatedHeading: 'Other popular currency pairs in the sitemap',
    languageSuffix: 'English',
  },
  lo: {
    pairMenuLabel: 'ຄູ່ເງິນຍອດນິຍົມ',
    pairMenuAria: 'ເມນູຄູ່ເງິນຍອດນິຍົມ',
    eyebrow: 'ອັດຕາແລກປ່ຽນມື້ນີ້',
    rateDate: date => `ອັດຕາອ້າງອີງ ວັນທີ ${date}`,
    rateHelp: (base, quote) => `ຕົວຢ່າງນີ້ຊ່ວຍໃຫ້ເຫັນການແປງ ${base} ເປັນ ${quote} ກ່ອນກັບໄປໃຊ້ເຄື່ອງມືແປງເງິນສົດໃນ zrate.io.`,
    examplesLabel: 'ຕົວຢ່າງການແປງເງິນ',
    summaryAria: 'ສະຫຼຸບຄູ່ເງິນ',
    pairLabel: 'ຄູ່ເງິນ',
    fromLabel: 'ຈາກສະກຸນ',
    toLabel: 'ເປັນສະກຸນ',
    relatedHeading: 'ຄູ່ເງິນຍອດນິຍົມອື່ນໃນ sitemap',
    languageSuffix: 'ພາສາລາວ',
  },
  my: {
    pairMenuLabel: 'လူကြိုက်များသော ငွေကြေးအတွဲများ',
    pairMenuAria: 'လူကြိုက်များသော ငွေကြေးအတွဲ menu',
    eyebrow: 'ယနေ့ ငွေလဲနှုန်း',
    rateDate: date => `ကိုးကားနှုန်း ${date}`,
    rateHelp: (base, quote) => `ဤဥပမာသည် zrate.io ပေါ်ရှိ live converter ကိုမသုံးမီ ${base} မှ ${quote} သို့ ပြောင်းလဲတွက်ချက်မှုကို အမြန်မြင်နိုင်စေသည်။`,
    examplesLabel: 'ငွေကြေးပြောင်းလဲမှုဥပမာများ',
    summaryAria: 'ငွေကြေးအတွဲ အကျဉ်းချုပ်',
    pairLabel: 'ငွေကြေးအတွဲ',
    fromLabel: 'မူရင်းငွေကြေး',
    toLabel: 'ပြောင်းမည့်ငွေကြေး',
    relatedHeading: 'sitemap ထဲရှိ အခြားလူကြိုက်များသော ငွေကြေးအတွဲများ',
    languageSuffix: 'မြန်မာ',
  },
  km: {
    pairMenuLabel: 'គូរូបិយប័ណ្ណពេញនិយម',
    pairMenuAria: 'ម៉ឺនុយគូរូបិយប័ណ្ណពេញនិយម',
    eyebrow: 'អត្រាប្តូរប្រាក់ថ្ងៃនេះ',
    rateDate: date => `អត្រាយោង ថ្ងៃទី ${date}`,
    rateHelp: (base, quote) => `ឧទាហរណ៍នេះបង្ហាញការបម្លែង ${base} ទៅ ${quote} មុនពេលត្រឡប់ទៅប្រើ live converter នៅ zrate.io។`,
    examplesLabel: 'ឧទាហរណ៍ការបម្លែងរូបិយប័ណ្ណ',
    summaryAria: 'សង្ខេបគូរូបិយប័ណ្ណ',
    pairLabel: 'គូរូបិយប័ណ្ណ',
    fromLabel: 'ពីរូបិយប័ណ្ណ',
    toLabel: 'ទៅរូបិយប័ណ្ណ',
    relatedHeading: 'គូរូបិយប័ណ្ណពេញនិយមផ្សេងទៀតក្នុង sitemap',
    languageSuffix: 'ភាសាខ្មែរ',
  },
}

const META_KEYWORDS: Record<LanguageCode, string[]> = {
  th: ['อัตราแลกเปลี่ยนวันนี้', 'แปลงค่าเงิน', 'ค่าเงินวันนี้'],
  en: ['exchange rate today', 'currency converter', 'live exchange rate'],
  lo: ['ອັດຕາແລກປ່ຽນມື້ນີ້', 'ແປງສະກຸນເງິນ', 'ຄ່າເງິນມື້ນີ້'],
  my: ['ယနေ့ငွေလဲနှုန်း', 'ငွေကြေးပြောင်း', 'တိုက်ရိုက်ငွေလဲနှုန်း'],
  km: ['អត្រាប្តូរប្រាក់ថ្ងៃនេះ', 'បម្លែងរូបិយប័ណ្ណ', 'អត្រាប្តូរប្រាក់ផ្ទាល់'],
}

const USD_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  USDT: 1,
  THB: 35.2,
  LAK: 21000,
  MMK: 2100,
  KHR: 4100,
  JPY: 149.5,
  CNY: 7.24,
  SGD: 1.34,
  KRW: 1325,
}

const EXAMPLE_AMOUNTS = [1, 10, 100, 1000]

function parsePair(pair: string) {
  const [base, quote] = pair.toUpperCase().split('-') as [CurrencyCode, CurrencyCode]
  if (!base || !quote || !CURRENCY_NAMES[base] || !CURRENCY_NAMES[quote]) return null
  return { base, quote }
}

function getThaiTitle(pair: string) {
  const parsed = parsePair(pair)
  if (!parsed) return ''
  return SPECIAL_THAI_TITLES[pair] ?? `อัตราแลกเปลี่ยน ${parsed.base} เป็น ${parsed.quote} วันนี้`
}

function getDescription(pair: string) {
  const parsed = parsePair(pair)
  if (!parsed) return ''
  const baseName = CURRENCY_NAMES[parsed.base].th
  const quoteName = CURRENCY_NAMES[parsed.quote].th
  return `เช็ก${getThaiTitle(pair)} แปลงค่า ${parsed.base} เป็น ${parsed.quote} พร้อมคำอธิบาย${baseName}เทียบ${quoteName} สำหรับติดตามอัตราแลกเปลี่ยนวันนี้แบบเรียลไทม์`
}

function getIndicativeRate(base: CurrencyCode, quote: CurrencyCode) {
  return USD_RATES[quote] / USD_RATES[base]
}

function normalizeLanguage(value?: string | null): LanguageCode {
  return LANGUAGE_ALIASES[value ?? ''] ?? 'th'
}

function getSelectedLanguage(): LanguageCode {
  return normalizeLanguage(cookies().get(LANGUAGE_COOKIE)?.value)
}

function getPairTitle(pair: string, lang: LanguageCode) {
  const content = getContent(pair, lang)
  if (!content) return getThaiTitle(pair)
  return lang === 'th' ? getThaiTitle(pair) : content.h2
}

function getPairDescription(pair: string, lang: LanguageCode) {
  const content = getContent(pair, lang)
  if (!content) return getDescription(pair)
  return lang === 'th' ? getDescription(pair) : content.p1
}

function formatMoney(value: number, currency: CurrencyCode, lang: LanguageCode) {
  const locale = LOCALE_BY_LANGUAGE[lang]
  if (value >= 1000000) return value.toLocaleString(locale, { maximumFractionDigits: 0 })
  if (value >= 1000) return value.toLocaleString(locale, { maximumFractionDigits: 2 })
  if (value >= 1) return value.toLocaleString(locale, { maximumFractionDigits: 4 })
  return value.toFixed(6)
}

function formatDate(lang: LanguageCode) {
  return new Date().toLocaleDateString(LOCALE_BY_LANGUAGE[lang], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getContent(pair: string, lang: LanguageCode) {
  const parsed = parsePair(pair)
  if (!parsed) return null

  const base = parsed.base
  const quote = parsed.quote
  const baseName = CURRENCY_NAMES[base][lang]
  const quoteName = CURRENCY_NAMES[quote][lang]

  const copy: Record<LanguageCode, { h2: string; p1: string; p2: string; points: string[] }> = {
    th: {
      h2: `${base} เป็น ${quote}: ${baseName} เท่ากับกี่ ${quoteName}`,
      p1: `หน้านี้จัดทำสำหรับคนที่ค้นหา ${base} ${quote}, ${baseName}เป็น${quoteName}, และอัตราแลกเปลี่ยน${base}วันนี้ โดยเนื้อหาถูกเขียนเป็น HTML แบบ static เพื่อให้ Google อ่านและจัดอันดับได้ง่ายกว่าเนื้อหาในแอปหน้าเดียว`,
      p2: `คุณสามารถใช้ข้อมูลนี้เพื่อดูทิศทางค่าเงิน วางแผนแลกเงินสด โอนเงิน หรือประเมินราคาเมื่อซื้อขายสินค้าและบริการที่อ้างอิงสกุลเงิน ${base} และ ${quote}`,
      points: [
        `ดูอัตราแลกเปลี่ยน ${base}/${quote} วันนี้`,
        `ใช้คู่เงินนี้ร่วมกับตัวแปลงค่าเงินบนหน้าแรกของ zrate.io`,
        `เหมาะสำหรับคำค้นหา ${base} เท่ากับกี่ ${quote} และ ${baseName}เท่ากับกี่${quoteName}`,
      ],
    },
    en: {
      h2: `${base} to ${quote} exchange rate today`,
      p1: `This static SEO page helps users looking for ${base} to ${quote}, ${baseName} to ${quoteName}, and today's ${base}/${quote} exchange rate. The content is available in plain HTML so search engines can understand the page clearly.`,
      p2: `Use this page as a quick reference before exchanging cash, sending money, checking travel budgets, or comparing prices quoted in ${base} and ${quote}.`,
      points: [
        `Track the ${base}/${quote} exchange rate keyword`,
        `Convert the pair with the live converter on the zrate.io homepage`,
        `Useful for searches like how much is ${base} in ${quote}`,
      ],
    },
    lo: {
      h2: `${base} ເປັນ ${quote}: ${baseName} ເທົ່າກັບ ${quoteName} ເທົ່າໃດ`,
      p1: `ໜ້ານີ້ສຳລັບຜູ້ຄົ້ນຫາ ${base} ${quote}, ${baseName} ເປັນ ${quoteName}, ແລະອັດຕາແລກປ່ຽນ ${base}/${quote} ມື້ນີ້ ໂດຍຈັດເປັນໜ້າ static HTML ໃຫ້ search engine ອ່ານໄດ້ຊັດເຈນ.`,
      p2: `ໃຊ້ໜ້ານີ້ເພື່ອອ້າງອີງກ່ອນແລກເງິນ ໂອນເງິນ ຫຼືປຽບທຽບລາຄາທີ່ອ້າງອີງ ${base} ແລະ ${quote}.`,
      points: [
        `ຕິດຕາມຄຳຄົ້ນຫາອັດຕາ ${base}/${quote}`,
        `ແປງຄ່າຄູ່ເງິນນີ້ໃນໜ້າຫຼັກ zrate.io`,
        `ເໝາະສຳລັບຄຳຖາມ ${base} ເທົ່າກັບ ${quote} ເທົ່າໃດ`,
      ],
    },
    my: {
      h2: `${base} မှ ${quote}: ${baseName} သည် ${quoteName} ဘယ်လောက်လဲ`,
      p1: `ဤ static SEO စာမျက်နှာသည် ${base} ${quote}, ${baseName} မှ ${quoteName}, နှင့် ယနေ့ ${base}/${quote} ငွေလဲနှုန်းကို ရှာဖွေသူများအတွက် ပြုလုပ်ထားခြင်းဖြစ်ပြီး Google က HTML အဖြစ် တိုက်ရိုက်ဖတ်နိုင်သည်။`,
      p2: `ငွေလဲရန်၊ ငွေလွှဲရန်၊ ခရီးစရိတ်တွက်ရန် သို့မဟုတ် ${base} နှင့် ${quote} ဖြင့် ဖော်ပြထားသောဈေးနှုန်းများကို နှိုင်းယှဉ်ရန် အညွှန်းအဖြစ် အသုံးပြုနိုင်သည်။`,
      points: [
        `${base}/${quote} ငွေလဲနှုန်း keyword ကို ထောက်ပံ့သည်`,
        `zrate.io ပင်မစာမျက်နှာတွင် live converter ဖြင့် တွက်ချက်နိုင်သည်`,
        `${base} သည် ${quote} ဘယ်လောက်လဲ ဆိုသော ရှာဖွေမှုများအတွက် သင့်တော်သည်`,
      ],
    },
    km: {
      h2: `${base} ទៅ ${quote}: ${baseName} ស្មើប៉ុន្មាន ${quoteName}`,
      p1: `ទំព័រ SEO static នេះសម្រាប់អ្នកស្វែងរក ${base} ${quote}, ${baseName} ទៅ ${quoteName}, និងអត្រាប្តូរប្រាក់ ${base}/${quote} ថ្ងៃនេះ។ មាតិកាត្រូវបានបង្ហាញជា HTML ដើម្បីឱ្យ search engine អានបានងាយ។`,
      p2: `ប្រើទំព័រនេះជាឯកសារយោងមុនពេលប្តូរប្រាក់ ផ្ទេរប្រាក់ រៀបចំថវិកាធ្វើដំណើរ ឬប្រៀបធៀបតម្លៃដែលប្រើ ${base} និង ${quote}។`,
      points: [
        `គាំទ្រ keyword អត្រាប្តូរ ${base}/${quote}`,
        `បម្លែងគូរូបិយប័ណ្ណនេះតាម live converter នៅ zrate.io`,
        `សមស្របសម្រាប់ការស្វែងរក ${base} ស្មើប៉ុន្មាន ${quote}`,
      ],
    },
  }

  return copy[lang]
}

export const dynamic = 'force-dynamic'
export const dynamicParams = false

export function generateStaticParams() {
  return PAIRS.map(pair => ({ pair }))
}

export function generateMetadata({ params }: { params: { pair: string } }): Metadata {
  if (!PAIRS.includes(params.pair as typeof PAIRS[number])) return {}

  const lang = getSelectedLanguage()
  const title = getPairTitle(params.pair, lang)
  const description = getPairDescription(params.pair, lang)

  return {
    title,
    description,
    keywords: [
      title,
      params.pair,
      params.pair.toUpperCase(),
      ...META_KEYWORDS[lang],
    ],
    alternates: {
      canonical: `/${params.pair}`,
    },
    openGraph: {
      title,
      description,
      url: `/${params.pair}`,
      siteName: 'zrate.io',
      type: 'article',
      images: [{ url: '/og-image.png', width: 1024, height: 1024, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
  }
}

export default function PairPage({ params }: { params: { pair: string } }) {
  if (!PAIRS.includes(params.pair as typeof PAIRS[number])) notFound()

  const parsed = parsePair(params.pair)
  if (!parsed) notFound()

  const lang = getSelectedLanguage()
  const pageText = PAGE_TEXT[lang]
  const content = getContent(params.pair, lang)
  if (!content) notFound()

  const pairTitle = getPairTitle(params.pair, lang)
  const pairDescription = getPairDescription(params.pair, lang)
  const related = PAIRS.filter(pair => pair !== params.pair)
  const indicativeRate = getIndicativeRate(parsed.base, parsed.quote)
  const updatedDate = formatDate(lang)

  return (
    <main className={styles.page} lang={lang}>
      <PairTopBar
        lang={lang}
        title={pairTitle}
        description={pairDescription}
      />

      <nav className={styles.pairMenu} aria-label={pageText.pairMenuAria}>
        <span className={styles.pairMenuLabel}>{pageText.pairMenuLabel}</span>
        <div className={styles.pairTickerViewport}>
          <div className={styles.relatedLinks}>
            {[...PAIRS, ...PAIRS].map((pair, index) => (
              <Link
                href={`/${pair}`}
                key={`${pair}-${index}`}
                className={pair === params.pair && index === 0 ? styles.activePair : ''}
                aria-current={pair === params.pair && index === 0 ? 'page' : undefined}
              >
                {pair.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <ResponsiveBannerAd />

      <section className={styles.hero}>
        <p className={styles.eyebrow}>{pageText.eyebrow} · {params.pair.toUpperCase()}</p>
        <h1>{pairTitle}</h1>
        <p className={styles.lead}>{pairDescription}</p>
      </section>

      <section className={styles.ratePanel} aria-labelledby="today-rate-heading">
        <div>
          <p className={styles.rateDate}>{pageText.rateDate(updatedDate)}</p>
          <h2 id="today-rate-heading">
            1 {parsed.base} = {formatMoney(indicativeRate, parsed.quote, lang)} {parsed.quote}
          </h2>
          <p>{pageText.rateHelp(parsed.base, parsed.quote)}</p>
        </div>
        <div className={styles.exampleGrid} aria-label={pageText.examplesLabel}>
          {EXAMPLE_AMOUNTS.map(amount => (
            <div className={styles.exampleCard} key={amount}>
              <span className={styles.exampleFrom}>
                {amount.toLocaleString(LOCALE_BY_LANGUAGE[lang])} {parsed.base}
              </span>
              <span className={styles.exampleEquals}>=</span>
              <strong>
                {formatMoney(amount * indicativeRate, parsed.quote, lang)} {parsed.quote}
              </strong>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.summaryGrid} aria-label={pageText.summaryAria}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>{pageText.pairLabel}</span>
          <span className={styles.summaryValue}>{parsed.base}/{parsed.quote}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>{pageText.fromLabel}</span>
          <span className={styles.summaryValue}>{CURRENCY_NAMES[parsed.base][lang]}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>{pageText.toLabel}</span>
          <span className={styles.summaryValue}>{CURRENCY_NAMES[parsed.quote][lang]}</span>
        </div>
      </section>

      <NativeBannerAd />

      <section className={styles.langGrid} aria-label={`${pageText.languageSuffix} ${parsed.base}/${parsed.quote}`}>
        <article className={styles.contentCard} lang={lang}>
          <h2>{content.h2}</h2>
          <p>{content.p1}</p>
          <p>{content.p2}</p>
          <ul>
            {content.points.map(point => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p>{pageText.languageSuffix} · {parsed.base}/{parsed.quote}</p>
        </article>
      </section>

      <section className={styles.related}>
        <h2>{pageText.relatedHeading}</h2>
        <div className={styles.relatedLinks}>
          {related.map(pair => (
            <Link href={`/${pair}`} key={pair}>
              {pair.toUpperCase()}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
