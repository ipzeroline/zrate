import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '../../components/Footer'
import { SeoNav } from '../../components/SeoNav'
import { Header } from '../../components/Header'
import { HUB_TEXT } from '../../../lib/hubContent'
import {
  LanguageCode,
  LOCALES,
  REGIONAL_PAIRS,
  PAIR_LABELS,
  SITE_URL,
  localizePath
} from '../../../lib/siteNavigation'
import styles from './money-transfer.module.css'

const PAGE_KEY = 'transfer'
const PATH = '/money-transfer'

const FORMULA_TEXTS: Record<LanguageCode, { title: string; equation: string; note: string }> = {
  th: {
    title: 'สูตรคำนวณต้นทุนการโอนเงินจริง',
    equation: 'ค่าใช้จ่ายรวม = ค่าธรรมเนียม + (ยอดโอน × ส่วนต่างเรทแลกเปลี่ยน)',
    note: 'หมายเหตุ: ส่วนต่างเรทแลกเปลี่ยน (Rate Margin) คืออัตราที่ผู้ให้บริการบวกเพิ่มจากราคาตลาดกลางที่แสดงบน zrate.io',
  },
  en: {
    title: 'TOTAL REMITTANCE COST FORMULA',
    equation: 'Total Cost = Transfer Fee + (Amount × Exchange Rate Margin)',
    note: 'Note: The Exchange Rate Margin is the markup added by providers over the mid-market rate displayed on zrate.io.',
  },
  lo: {
    title: 'ສູດຄຳນວນຕົ້ນທຶນການໂອນເງິນ',
    equation: 'ຕົ້ນທຶນທັງໝົດ = ຄ່າທຳນຽມ + (ຍອດໂອນ × ສ່ວນຕ່າງອັດຕາແລກປ່ຽນ)',
    note: 'ໝາຍເຫດ: ສ່ວນຕ່າງອັດຕາແລກປ່ຽນແມ່ນຄ່າທຳນຽມແຝງທີ່ຜູ້ໃຫ້ບໍລິການບວກເພີ່ມຈາກເຣດຕະຫຼາດກາງ.',
  },
  my: {
    title: 'ငွေလွှဲစရိတ် စုစုပေါင်း တွက်ချက်ပုံ',
    equation: 'စုစုပေါင်းကုန်ကျစရိတ် = ဝန်ဆောင်ခ + (လွှဲငွေပမာဏ × ငွေလဲနှုန်းကွာဟချက်)',
    note: 'မှတ်ချက် - ငွေလဲနှုန်းကွာဟချက် (Rate Margin) ဆိုသည်မှာ zrate.io တွင်ပြသထားသော စျေးကွက်ပျမ်းမျှနှုန်းအပေါ် ဝန်ဆောင်မှုပေးသူများက ထပ်ဆောင်းကောက်ခံသည့် ပမာဏဖြစ်သည်။',
  },
  km: {
    title: 'រូបមន្តគណនាថ្លៃដើមផ្ទេរប្រាក់សរុប',
    equation: 'ថ្លៃដើមសរុប = ថ្លៃសេវាផ្ទេរ + (ចំនួនប្រាក់ផ្ទេរ × ចន្លោះអត្រាប្តូរប្រាក់)',
    note: 'ចំណាំ៖ ចន្លោះអត្រាប្តូរប្រាក់ (Exchange Rate Margin) គឺជាតម្លៃបន្ថែមដែលអ្នកផ្តល់សេវាគិតលើសពីអត្រាទីផ្សារកណ្តាលដែលបង្ហាញនៅលើ zrate.io ។',
  },
}

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const lang = resolvedParams.locale as LanguageCode
  if (!((LOCALES as string[]).includes(lang))) return {}
  const text = HUB_TEXT[PAGE_KEY][lang]
  const prefix = lang === 'th' ? '' : `/${lang}`
  
  const languages: Record<string, string> = {}
  LOCALES.forEach(locale => {
    languages[locale] = `${SITE_URL}${localizePath(locale, PATH)}`
  })
  languages['x-default'] = `${SITE_URL}${PATH}`

  return {
    title: text.title,
    description: text.description,
    alternates: {
      canonical: `${SITE_URL}${prefix}${PATH}`,
      languages,
    },
    openGraph: {
      title: text.title,
      description: text.description,
      url: `${SITE_URL}${prefix}${PATH}`,
      siteName: 'zrate.io',
      type: 'website',
      locale: lang === 'th' ? 'th_TH' : lang === 'en' ? 'en_US' : lang === 'lo' ? 'lo_LA' : lang === 'my' ? 'my_MM' : 'km_KH',
      images: [
        {
          url: `${SITE_URL}/money-transfer-illustration.png`,
          width: 1024,
          height: 1024,
          alt: text.title,
        },
      ],
    },
  }
}

export default async function MoneyTransferPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const lang = resolvedParams.locale as LanguageCode
  if (!((LOCALES as string[]).includes(lang))) notFound()
  
  const text = HUB_TEXT[PAGE_KEY][lang]
  const formula = FORMULA_TEXTS[lang]
  const prefix = lang === 'th' ? '' : `/${lang}`

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}${prefix}/money-transfer#webpage`,
        'url': `${SITE_URL}${prefix}/money-transfer`,
        'name': text.title,
        'description': text.description,
        'inLanguage': lang,
        'isPartOf': {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          'url': SITE_URL,
          'name': 'zrate.io',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        'name': 'zrate.io',
        'url': SITE_URL,
        'logo': `${SITE_URL}/zrate.png`,
        'description': 'Real-time ASEAN currency exchange desk and remittance guide platform.',
        'sameAs': [SITE_URL],
      }
    ]
  }

  return (
    <main className={styles.container} lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      <Header lang={lang} subtitle={text.description} />

      <SeoNav lang={lang} active="transfer" />

      <section className={styles.contentSection}>
        <div className={styles.gridMain}>
          {/* LEFT COLUMN: Main content, currency cards, and formula */}
          <div className={styles.leftColumn}>
            {/* Hero Section */}
            <div className={styles.heroSection}>
              <span className={styles.eyebrow}>{text.eyebrow}</span>
              <h1 className={styles.title}>{text.heading}</h1>
              <p className={styles.description}>{text.body}</p>
            </div>

            {/* Currency cards grid */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{text.cardsHeading}</h2>
              <div className={styles.pairsGrid}>
                {text.cards.map(card => (
                  <Link
                    className={styles.pairCard}
                    href={localizePath(lang, card.href || PATH)}
                    key={card.title}
                  >
                    <h3 className={styles.pairTitle}>{card.title}</h3>
                    <p className={styles.pairDesc}>{card.body}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Cost estimation formula */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{text.contentHeading}</h2>
              <div className={styles.paragraphs}>
                {text.paragraphs.map(paragraph => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              
              <div className={styles.formulaBox}>
                <span className={styles.formulaTitle}>{formula.title}</span>
                <p className={styles.formulaEquation}>{formula.equation}</p>
                <p className={styles.formulaExplanation}>{formula.note}</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar with illustration, quick links, and blog guides */}
          <div className={styles.rightColumn}>
            {/* Visual illustration */}
            <div className={styles.imageWrapper}>
              <Image
                src="/money-transfer-illustration.png"
                alt="zrate.io international money transfer & remittance illustration"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 380px"
              />
            </div>

            {/* Remittance guides */}
            <div className={styles.card}>
              <h2 className={styles.sidebarHeading}>
                {lang === 'th' ? 'คู่มือและบทความแนะนำ' : lang === 'en' ? 'Featured Guides' : lang === 'lo' ? 'ຄູ່ມືແນະນຳ' : lang === 'my' ? 'အထူးပြုလမ်းညွှန်များ' : 'មគ្គុទ្ទេសក៍ណែនាំ'}
              </h2>
              <div className={styles.guidesList}>
                <Link
                  href={localizePath(lang, '/blog/transfer-money-thailand-myanmar')}
                  className={styles.guideItem}
                >
                  <span className={styles.guideText}>
                    {lang === 'th'
                      ? 'คู่มือการโอนเงินจากไทยไปเมียนมา'
                      : lang === 'en'
                      ? 'Transfer Money from Thailand to Myanmar Guide'
                      : lang === 'lo'
                      ? 'ຄູ່ມືໂອນເງິນ ໄທ-ມຽນມາ'
                      : lang === 'my'
                      ? 'ထိုင်းနိုင်ငံမှ မြန်မာနိုင်ငံသို့ ငွေလွှဲခြင်းလမ်းညွှန်'
                      : 'មគ្គុទ្ទេសក៍ផ្ទេរប្រាក់ពីថៃទៅមីយ៉ាន់ម៉ា'}
                  </span>
                  <svg className={styles.guideIcon} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Regional currency pairs links */}
            <div className={styles.card}>
              <h2 className={styles.sidebarHeading}>{text.linksHeading}</h2>
              <div className={styles.linkChips}>
                {REGIONAL_PAIRS.map(pair => (
                  <Link
                    href={localizePath(lang, `/${pair}`)}
                    key={pair}
                    className={styles.chipLink}
                  >
                    {PAIR_LABELS[pair]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </main>
  )
}
