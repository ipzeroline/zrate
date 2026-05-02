import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const siteUrl = 'https://zrate.io'
const siteDescriptionTh = 'เช็กอัตราแลกเปลี่ยนเงินวันนี้แบบเรียลไทม์ แปลงค่าเงินบาท ดอลลาร์ ยูโร USDT กว่า 40 สกุลเงิน อัปเดตทุก 60 วินาที'
const siteDescriptionEn = 'Check live currency exchange rates and convert Thai baht, US dollars, euros, USDT and 40+ currencies, updated every 60 seconds.'
const siteDescriptionLo = 'ກວດເບິ່ງອັດຕາແລກປ່ຽນເງິນແບບສົດ ແປງເງິນບາດ ໂດລາ ເອີໂຣ USDT ແລະຫຼາຍກວ່າ 40 ສະກຸນ ອັບເດດທຸກ 60 ວິນາທີ'
const siteDescriptionMy = 'ယနေ့ ငွေလဲနှုန်းများကို အချိန်နှင့်တပြေးညီ စစ်ဆေးပြီး ဘတ်၊ ဒေါ်လာ၊ ယူရို၊ USDT နှင့် ငွေကြေး 40 ကျော်ကို 60 စက္ကန့်တိုင်း အပ်ဒိတ်ဖြင့် ပြောင်းလဲတွက်ချက်ပါ။'
const siteDescriptionKm = 'ពិនិត្យអត្រាប្តូរប្រាក់ថ្ងៃនេះតាមពេលវេលាពិត បម្លែងប្រាក់បាត ដុល្លារ អឺរ៉ូ USDT និងរូបិយប័ណ្ណជាង 40 អាប់ដេតរៀងរាល់ 60 វិនាទី'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'zrate.io — อัตราแลกเปลี่ยนเงินวันนี้',
    template: '%s | zrate.io',
  },
  description: siteDescriptionTh,
  keywords: [
    'zrate',
    'zrate.io',
    'อัตราแลกเปลี่ยนเงิน',
    'อัตราแลกเปลี่ยนวันนี้',
    'อัตราแลกเปลี่ยนเงินวันนี้',
    'เงินบาทวันนี้',
    'ค่าเงินวันนี้',
    'แปลงค่าเงิน',
    'แปลงสกุลเงิน',
    'USD THB',
    'exchange rate',
    'live exchange rates',
    'currency converter',
    'real time exchange rate',
    'THB USD',
    'USDT rate',
    'ອັດຕາແລກປ່ຽນ',
    'ແປງສະກຸນເງິນ',
    'LAK THB',
    'ငွေလဲနှုန်း',
    'ငွေကြေးပြောင်း',
    'MMK THB',
    'អត្រាប្តូរប្រាក់',
    'បម្លែងរូបិយប័ណ្ណ',
    'KHR THB',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'zrate.io — อัตราแลกเปลี่ยนเงินวันนี้',
    description: siteDescriptionTh,
    url: '/',
    siteName: 'zrate.io',
    type: 'website',
    locale: 'th_TH',
    alternateLocale: ['en_US', 'lo_LA', 'my_MM', 'km_KH'],
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
    title: 'zrate.io — อัตราแลกเปลี่ยนเงินวันนี้',
    description: siteDescriptionTh,
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/zrate.png',
    apple: '/zrate.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'description:th': siteDescriptionTh,
    'description:en': siteDescriptionEn,
    'description:lo': siteDescriptionLo,
    'description:my': siteDescriptionMy,
    'description:km': siteDescriptionKm,
    'keywords:th': 'อัตราแลกเปลี่ยนเงิน, อัตราแลกเปลี่ยนวันนี้, แปลงค่าเงิน, เงินบาทวันนี้, USD THB, แปลงสกุลเงิน',
    'keywords:en': 'exchange rate, live exchange rates, currency converter, Thai baht exchange rate, USD THB, USDT rate',
    'keywords:lo': 'ອັດຕາແລກປ່ຽນ, ອັດຕາແລກປ່ຽນມື້ນີ້, ແປງສະກຸນເງິນ, ບາດໄທ, USD THB, USDT',
    'keywords:my': 'ငွေလဲနှုန်း, ယနေ့ငွေလဲနှုန်း, ငွေကြေးပြောင်း, ထိုင်းဘတ်, USD THB, USDT',
    'keywords:km': 'អត្រាប្តូរប្រាក់, អត្រាប្តូរប្រាក់ថ្ងៃនេះ, បម្លែងរូបិយប័ណ្ណ, ប្រាក់បាត, USD THB, USDT',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
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
      </body>
    </html>
  )
}
