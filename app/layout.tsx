import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'zrate.io | อัตราแลกเปลี่ยนเงินวันนี้ เช็กค่าเงินสดแบบเรียลไทม์',
  description: 'zrate.io เว็บไซต์เช็กอัตราแลกเปลี่ยนเงินต่างประเทศแบบเรียลไทม์ รองรับ THB, USD, USDT, EUR, JPY, LAK, MMK, KHR และสกุลเงินยอดนิยมทั่วโลก',
  keywords: [
    'zrate',
    'zrate.io',
    'อัตราแลกเปลี่ยน',
    'อัตราแลกเปลี่ยนเงินวันนี้',
    'ค่าเงินวันนี้',
    'แปลงค่าเงิน',
    'exchange rate',
    'currency converter',
    'real time exchange rate',
    'THB USD',
    'USDT rate',
    'LAK THB',
    'MMK THB',
    'KHR THB',
  ],
  openGraph: {
    title: 'zrate.io | อัตราแลกเปลี่ยนเงินวันนี้',
    description: 'เช็กและแปลงค่าเงินหลายสกุลแบบเรียลไทม์ ใช้งานง่าย รองรับเงินสดและ USDT',
    url: 'https://zrate.io',
    siteName: 'zrate.io',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
