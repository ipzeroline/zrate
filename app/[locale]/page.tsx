import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import HomeClient from './HomeClient'

type LanguageCode = 'th' | 'en' | 'lo' | 'my' | 'km'

const LOCALES = ['th', 'en', 'lo', 'my', 'km']

const DEFAULT_CURRENCY: Record<LanguageCode, string> = {
  th: 'THB',
  en: 'USD',
  lo: 'LAK',
  my: 'MMK',
  km: 'KHR',
}

const UI_TEXT = {
  th: {
    heroTitle: 'อัตราแลกเปลี่ยนเงินวันนี้ แปลงค่าเงิน USD THB USDT | zrate.io',
    heroDescription: 'เช็กค่าเงินและแปลงสกุลเงินแบบเรียลไทม์สำหรับเงินบาท ดอลลาร์ USDT และสกุลเงินยอดนิยมทั่วโลก อัปเดตทุก 60 วินาที',
  },
  en: {
    heroTitle: 'Live Exchange Rates Today | Currency Converter | zrate.io',
    heroDescription: 'Check today\'s live exchange rates and convert Thai baht, US dollars, USDT, euros, yen, Lao kip, Myanmar kyat, Cambodian riel and 40+ currencies.',
  },
  lo: {
    heroTitle: 'ອັດຕາການດປ່ຽນເງິນມື້ນີ້ | ແປງເງິນບາດ ໂດລາ | zrate.io',
    heroDescription: 'ກວດເບິ່ງອັດຕາແລກປ່ຽນເງິນແບບສົດ ແປງເງິນບາດ ໂດລາ ເອີໂຣ USDT ແລະຫຼາຍກວ່າ 40 ສະກຸນ ອັບເດດທຸກ 60 ວິນາທີ',
  },
  my: {
    heroTitle: 'ယနေ့ တိုက်ရိုက်ငွေလဲနှုန်းများ | ငွေကြေးပြောင်းစက် | zrate.io',
    heroDescription: 'ယနေ့ ငွေလဲနှုန်းများကို အချိန်နှင့်တပြေးညီ စစ်ဆေးပြီး ဘတ်၊ ဒေါ်လာ၊ ယူရို၊ USDT နှင့် ငွေကြေး 40 ကျော်ကို 60 စက္ကန့်တိုင်း အပ်ဒိတ်ဖြင့် ပြောင်းလဲတွက်ချက်ပါ။',
  },
  km: {
    heroTitle: 'អត្រាប្តូរប្រាក់ថ្ងៃនេះ | ឧបករណ៍បម្លែររូបិយប័ណ្ណ | zrate.io',
    heroDescription: 'ពិនិត្យអត្រាប្តូរប្រាក់ថ្ងៃនេះតាមពេលវេលាពិត បម្លែងប្រាក់បាត ដុល្លារ អឺរ៉ូ USDT និងរូបិយប័ណ្ណជាង 40 អាប់ដេតរៀងរាល់ 60 វិនាទី',
  },
}

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const lang = (LOCALES.includes(resolvedParams.locale) ? resolvedParams.locale : 'th') as LanguageCode
  const text = UI_TEXT[lang] || UI_TEXT.th
  
  const prefix = lang === 'th' ? '' : `/${lang}`
  
  const langAlternates: Record<string, string> = {}
  LOCALES.forEach(loc => {
    langAlternates[loc] = loc === 'th' ? '/' : `/${loc}`
  })
  langAlternates['x-default'] = '/'

  return {
    title: text.heroTitle,
    description: text.heroDescription,
    alternates: {
      canonical: `${prefix}/`,
      languages: langAlternates,
    },
    openGraph: {
      title: text.heroTitle,
      description: text.heroDescription,
      url: `${prefix}/`,
      siteName: 'zrate.io',
      type: 'website',
      locale: lang === 'th' ? 'th_TH' : lang === 'en' ? 'en_US' : lang === 'lo' ? 'lo_LA' : lang === 'my' ? 'my_MM' : 'km_KH',
      alternateLocale: LOCALES.filter(l => l !== lang).map(l => 
        l === 'th' ? 'th_TH' : l === 'en' ? 'en_US' : l === 'lo' ? 'lo_LA' : l === 'my' ? 'my_MM' : 'km_KH'
      ),
      images: [{ url: '/og-image.png', width: 1024, height: 1024, alt: text.heroTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: text.heroTitle,
      description: text.heroDescription,
      images: ['/og-image.png'],
    },
  }
}

async function fetchInitialRates(base: string): Promise<Record<string, number>> {
  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`, {
      next: { revalidate: 300 } // cache for 5 minutes
    })
    if (!res.ok) throw new Error('API down')
    const data = await res.json()
    const rates = data.rates || {}
    rates['USDT'] = rates['USD'] || 1
    return rates
  } catch (err) {
    console.error('Failed to pre-fetch rates on server', err)
    return {}
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const lang = (LOCALES.includes(resolvedParams.locale) ? resolvedParams.locale : 'th') as LanguageCode
  const baseCurrency = DEFAULT_CURRENCY[lang] || 'THB'
  
  const initialRates = await fetchInitialRates(baseCurrency)

  return (
    <HomeClient
      locale={lang}
      initialBase={baseCurrency}
      initialRates={initialRates}
    />
  )
}
