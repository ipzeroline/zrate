import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'zrate.io | อัตราแลกเปลี่ยนเงินวันนี้ | Live Exchange Rates',
    short_name: 'zrate.io',
    description: 'เช็กอัตราแลกเปลี่ยนเงินวันนี้และแปลงค่าเงินแบบเรียลไทม์ | Check live currency exchange rates today.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a', // slate-900 / dark background color
    theme_color: '#020617', // slate-950 header color
    icons: [
      {
        src: '/zrate.png',
        sizes: '192x192 512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
