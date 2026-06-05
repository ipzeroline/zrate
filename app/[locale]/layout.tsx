import type { Metadata } from 'next'
import Script from 'next/script'

const SITE_URL = 'https://zrate.io'
const LOCALES = ['th', 'en', 'lo', 'my', 'km']

const SITE_TITLES = {
  th: 'อัตราแลกเปลี่ยนเงินวันนี้ แปลงค่าเงิน USD THB USDT | zrate.io',
  en: 'Live Exchange Rates Today | Currency Converter | zrate.io',
  lo: 'ອັດຕາການດປ່ຽນເງິນມື້ນີ້ | ແປງເງິນບາດ ໂດລາ | zrate.io',
  my: 'ယနေ့ တိုက်ရိုက်ငွေလဲနှုန်းများ | ငွေကြေးပြောင်းစက် | zrate.io',
  km: 'អត្រាប្តូរប្រាក់ថ្ងៃនេះ | ឧបករណ៍បម្លែររូបិយប័ណ្ណ | zrate.io',
}

const siteDescriptionTh = 'เช็กอัตราแลกเปลี่ยนเงินวันนี้และแปลงค่าเงินออนไลน์แบบเรียลไทม์ ดู USD/THB, USDT/THB, EUR, JPY, LAK, MMK, KHR และกว่า 40 สกุลเงิน อัปเดตทุก 60 วินาที'
const siteDescriptionEn = 'Check today\'s live exchange rates and convert Thai baht, US dollars, USDT, euros, yen, Lao kip, Myanmar kyat, Cambodian riel and 40+ currencies.'
const siteDescriptionLo = 'ກວດເບິ່ງອັດຕາແລກປ່ຽນເງິນແບບສົດ ແປງເງິນບາດ ໂດລາ ເອີໂຣ USDT ແລະຫຼາຍກວ່າ 40 ສະກຸນ ອັບເດດທຸກ 60 ວິນາທີ'
const siteDescriptionMy = 'ယနေ့ ငွေလဲနှုန်းများကို အချိန်နှင့်တပြေးညီ စစ်ဆေးပြီး ဘတ်၊ ဒေါ်လာ၊ ယူရို၊ USDT နှင့် ငွေကြေး 40 ကျော်ကို 60 စက္ကန့်တိုင်း အပ်ဒိတ်ဖြင့် ပြောင်းလဲတွက်ချက်ပါ။'
const siteDescriptionKm = 'ពិនិត្យអត្រាប្តូរប្រាក់ថ្ងៃនេះតាមពេលវេលាពិត បម្លែងប្រាក់បាត ដុល្លារ អឺរ៉ូ USDT និងរូបិយប័ណ្ណជាង 40 អាប់ដេតរៀងរាល់ 60 វិនាទី'

const SITE_DESCRIPTIONS = {
  th: siteDescriptionTh,
  en: siteDescriptionEn,
  lo: siteDescriptionLo,
  my: siteDescriptionMy,
  km: siteDescriptionKm,
}

const KEYWORDS = {
  th: ['zrate', 'zrate.io', 'อัตราแลกเปลี่ยนเงิน', 'อัตราแลกเปลี่ยนวันนี้', 'แปลงค่าเงิน', 'เงินบาทวันนี้', 'USD THB'],
  en: ['zrate', 'zrate.io', 'exchange rate', 'live exchange rates', 'currency converter', 'USD THB', 'USDT rate'],
  lo: ['zrate', 'zrate.io', 'ອັດຕາແລກປ່ຽນ', 'ແປງສະກຸນເງິນ', 'LAK THB', 'USDT'],
  my: ['zrate', 'zrate.io', 'ငွေလဲနှုန်း', 'ငွေကြေးပြောင်း', 'MMK THB', 'USDT'],
  km: ['zrate', 'zrate.io', 'អត្រាប្តូរប្រាក់', 'បម្លែងរូបិយប័ណ្ណ', 'KHR THB', 'USDT'],
}

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const lang = (LOCALES.includes(resolvedParams.locale) ? resolvedParams.locale : 'th') as keyof typeof SITE_TITLES
  const title = SITE_TITLES[lang] || SITE_TITLES.th
  const description = SITE_DESCRIPTIONS[lang] || SITE_DESCRIPTIONS.th
  const prefix = lang === 'th' ? '' : `/${lang}`
  
  const langAlternates: Record<string, string> = {}
  LOCALES.forEach(loc => {
    langAlternates[loc] = loc === 'th' ? '/' : `/${loc}`
  })
  langAlternates['x-default'] = '/'

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: '%s | zrate.io',
    },
    description,
    keywords: KEYWORDS[lang] || KEYWORDS.th,
    alternates: {
      canonical: prefix || '/',
      languages: langAlternates,
    },
    verification: {
      google: 'google4243f4ab0f6102a8',
    },
    openGraph: {
      title,
      description,
      url: prefix || '/',
      siteName: 'zrate.io',
      type: 'website',
      locale: lang === 'th' ? 'th_TH' : lang === 'en' ? 'en_US' : lang === 'lo' ? 'lo_LA' : lang === 'my' ? 'my_MM' : 'km_KH',
      alternateLocale: LOCALES.filter(l => l !== lang).map(l => 
        l === 'th' ? 'th_TH' : l === 'en' ? 'en_US' : l === 'lo' ? 'lo_LA' : l === 'my' ? 'my_MM' : 'km_KH'
      ),
      images: [
        {
          url: '/og-image.png',
          width: 1024,
          height: 1024,
          alt: 'zrate.io currency exchange rates',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
    icons: {
      icon: '/zrate.png',
      apple: '/zrate.png',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    category: 'finance',
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const resolvedParams = await params
  const lang = LOCALES.includes(resolvedParams.locale) ? resolvedParams.locale : 'th'
  const textTitle = SITE_TITLES[lang as keyof typeof SITE_TITLES] || SITE_TITLES.th
  const textDesc = SITE_DESCRIPTIONS[lang as keyof typeof SITE_DESCRIPTIONS] || SITE_DESCRIPTIONS.th

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'zrate.io',
        url: SITE_URL,
        logo: `${SITE_URL}/zrate.png`,
        sameAs: [SITE_URL],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'zrate.io',
        alternateName: ['Zrate', 'อัตราแลกเปลี่ยนเงินวันนี้', 'Live exchange rates'],
        description: textDesc,
        inLanguage: ['th', 'en', 'lo', 'my', 'km'],
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'WebApplication',
        '@id': `${SITE_URL}/#currency-converter`,
        name: 'zrate.io currency converter',
        url: SITE_URL,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        isAccessibleForFree: true,
        description: textDesc,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'Live exchange rates',
          'Thai baht exchange rate',
          'US dollar to Thai baht converter',
          'USDT to THB converter',
          'Regional currencies for Thailand, Laos, Myanmar and Cambodia',
        ],
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XSDY5FQZQ0"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-XSDY5FQZQ0');
        `}
      </Script>
      {children}
    </>
  )
}
