import Link from 'next/link'
import {
  FEATURED_PAIRS,
  NAV_TEXT,
  PAIR_LABELS,
  REGIONAL_PAIRS,
  getLocalePrefix,
  localizePath,
} from '../../lib/siteNavigation'
import styles from './Footer.module.css'

export type FooterLanguage = 'th' | 'en' | 'lo' | 'my' | 'km'

const FOOTER_TEXT: Record<FooterLanguage, {
  about: string
  contact: string
  disclaimerLink: string
  disclaimerText: string
  dataCredit: string
  syncText: string
}> = {
  th: {
    about: 'เกี่ยวกับเรา',
    contact: 'ติดต่อเรา',
    disclaimerLink: 'ข้อจำกัดความรับผิดชอบ',
    disclaimerText: 'คำเตือน: อัตราแลกเปลี่ยนที่แสดงบนเว็บไซต์นี้มีวัตถุประสงค์เพื่อเป็นข้อมูลอ้างอิงเบื้องต้นเท่านั้น และไม่ถือเป็นคำแนะนำทางการเงิน เราไม่รับประกันความถูกต้องของข้อมูล และไม่รับผิดชอบต่อความสูญเสียใดๆ ที่เกิดจากการตัดสินใจทำธุรกรรมทางการเงินของคุณ',
    dataCredit: 'ข้อมูล: EXCHANGERATE-API',
    syncText: 'ซิงก์อัตโนมัติ: 60 วินาที',
  },
  en: {
    about: 'About Us',
    contact: 'Contact Us',
    disclaimerLink: 'Disclaimer',
    disclaimerText: 'Disclaimer: The exchange rates displayed on this website are for informational reference only and do not constitute financial advice. We do not guarantee data accuracy and are not liable for any financial losses resulting from transactions based on this data.',
    dataCredit: 'Data: EXCHANGERATE-API',
    syncText: 'Auto-sync: 60s',
  },
  lo: {
    about: 'ກ່ຽວກັບພວກເຮົາ',
    contact: 'ຕິດຕໍ່ພວກເຮົາ',
    disclaimerLink: 'ຂໍ້ຈຳກັດຄວາມຮັບຜິດຊອບ',
    disclaimerText: 'ຄຳເຕືອນ: ອັດຕາແລກປ່ຽນທີ່ສະແດງໃນເວັບໄຊທ໌ນີ້ແມ່ນເພື່ອການອ້າງອີງເບື້ອງຕົ້ນເທົ່ານັ້ນ ແລະ ບໍ່ຖືເປັນຄຳແນະນຳທາງການເງິນ. ພວກເຮົາບໍ່ຮັບປະກັນຄວາມຖືກຕ້ອງ ແລະ ບໍ່ຮັບຜິດຊອບຕໍ່ຄວາມເສຍຫາຍໃດໆ ຈາກການເຮັດທຸລະກຳ.',
    dataCredit: 'ຂໍ້ມູ້ນ: EXCHANGERATE-API',
    syncText: 'ຊິງກ໌ອັຕໂນມັດ: 60 ວິນາທີ',
  },
  my: {
    about: 'ကျွန်ုပ်တို့အကြောင်း',
    contact: 'ဆက်သွယ်ရန်',
    disclaimerLink: 'ငြင်းဆိုချက်',
    disclaimerText: 'ငြင်းဆိုချက်- ဤဝဘ်ဆိုက်တွင်ဖော်ပြထားသော ငွေလဲနှုန်းများသည် အညွှန်းသဘောအတွက်သာဖြစ်ပြီး ငွေကြေးဆိုင်ရာ အကြံဉာဏ်မဟုတ်ပါ။ ဒေတာတိကျမှုကို အာမမခံပါ၊ ငွေကြေးဆုံးရှုံးမှုများအတွက် တာဝန်မယူပါ။',
    dataCredit: 'ဒေတာ: EXCHANGERATE-API',
    syncText: 'အလိုအလျောက်စင့်ခ်: ၆၀ စက္ကန့်',
  },
  km: {
    about: 'អំពីយើង',
    contact: 'ទំនាក់ទំនង',
    disclaimerLink: 'ការបដិសេធ',
    disclaimerText: 'ការបដិសេធ៖ អត្រាប្តូរប្រាក់ដែលបង្ហាញនៅលើគេហទំព័រនេះគឺសម្រាប់តែឯកសារយោងប៉ុណ្ោះ ហើយមិនមែនជាការណែនាំផ្នែកហិរញ្ញវត្ថុឡើយ។ យើងមិនធានាភាពត្រឹមត្រូវនៃទិន្នន័យឡើយ ហើយមិនទទួលខុសត្រូវរាល់ការខាតបង់ឡើយ។',
    dataCredit: 'ទិន្នន័យ: EXCHANGERATE-API',
    syncText: 'សមកាលកម្មស្វ័យប្រវត្តិ: 60 វិនាទី',
  },
}

export function Footer({ lang }: { lang: FooterLanguage }) {
  const t = FOOTER_TEXT[lang] || FOOTER_TEXT.th
  const nav = NAV_TEXT[lang] || NAV_TEXT.th
  const prefix = getLocalePrefix(lang)

  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <section className={styles.footerColumn} aria-labelledby="footer-main-menu">
          <h2 id="footer-main-menu">{nav.mainMenu}</h2>
          <Link href={localizePath(lang, '/')}>{nav.home}</Link>
          <Link href={localizePath(lang, '/rates')}>{nav.rates}</Link>
          <Link href={localizePath(lang, '/currency-pairs')}>{nav.pairs}</Link>
          <Link href={localizePath(lang, '/money-transfer')}>{nav.transfer}</Link>
          <Link href={localizePath(lang, '/blog')}>{nav.blog}</Link>
        </section>

        <section className={styles.footerColumn} aria-labelledby="footer-popular-pairs">
          <h2 id="footer-popular-pairs">{nav.popularPairs}</h2>
          {FEATURED_PAIRS.map(pair => (
            <Link key={pair} href={`${prefix}/${pair}`}>
              {PAIR_LABELS[pair]}
            </Link>
          ))}
        </section>

        <section className={styles.footerColumn} aria-labelledby="footer-regional-pairs">
          <h2 id="footer-regional-pairs">{nav.regionalPairs}</h2>
          {REGIONAL_PAIRS.map(pair => (
            <Link key={pair} href={`${prefix}/${pair}`}>
              {PAIR_LABELS[pair]}
            </Link>
          ))}
        </section>

        <section className={styles.footerColumn} aria-labelledby="footer-company">
          <h2 id="footer-company">{nav.company}</h2>
          <Link href={localizePath(lang, '/about')}>{t.about}</Link>
          <Link href={localizePath(lang, '/contact')}>{t.contact}</Link>
          <Link href={localizePath(lang, '/privacy')}>{nav.privacy}</Link>
          <Link href={`${localizePath(lang, '/about')}#disclaimer`}>{t.disclaimerLink}</Link>
        </section>
      </div>

      <div className={styles.footerText}>
        <span>zrate.io</span>
        <span className={styles.footerDivider}>|</span>
        <span>{t.dataCredit}</span>
        <span className={styles.footerDivider}>|</span>
        <span>{t.syncText}</span>
      </div>

      <p className={styles.disclaimer}>{t.disclaimerText}</p>
    </footer>
  )
}
