import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Footer } from '../../components/Footer'
import { SeoNav } from '../../components/SeoNav'
import { Header } from '../../components/Header'
import { HUB_TEXT } from '../../../lib/hubContent'
import {
  LanguageCode,
  LOCALES,
  PAIRS,
  PAIR_LABELS,
  SITE_URL,
  localizePath,
  REGIONAL_PAIRS
} from '../../../lib/siteNavigation'
import { PairsDirectory } from './PairsDirectory'
import styles from './currency-pairs.module.css'

const PAGE_KEY = 'pairs'
const PATH = '/currency-pairs'

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
          url: `${SITE_URL}/currency-pairs-illustration.png`,
          width: 1024,
          height: 1024,
          alt: text.title,
        },
      ],
    },
  }
}

export default async function CurrencyPairsPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const lang = resolvedParams.locale as LanguageCode
  if (!((LOCALES as string[]).includes(lang))) notFound()
  
  const text = HUB_TEXT[PAGE_KEY][lang]
  const prefix = lang === 'th' ? '' : `/${lang}`

  const columnTitles = [
    text.cards[0]?.title || 'Baht Pairs',
    text.cards[1]?.title || 'ASEAN Regional Pairs',
    text.cards[2]?.title || 'Global & Other Pairs'
  ]

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemPage',
        '@id': `${SITE_URL}${prefix}/currency-pairs#webpage`,
        'url': `${SITE_URL}${prefix}/currency-pairs`,
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

      <SeoNav lang={lang} active="pairs" />

      <section className={styles.contentSection}>
        {/* SPLIT HERO SECTION: Header left, illustration right */}
        <div className={styles.heroLayout}>
          <div className={styles.heroLeft}>
            <span className={styles.eyebrow}>{text.eyebrow}</span>
            <h1 className={styles.title}>{text.heading}</h1>
            <p className={styles.description}>{text.body}</p>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.imageCard}>
              <Image
                src="/currency-pairs-illustration.png"
                alt="zrate.io global currency connection network illustration"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 320px"
              />
            </div>
          </div>
        </div>

        {/* INTERACTIVE COMPONENT: Client-side Search and Filters */}
        <PairsDirectory
          lang={lang}
          pairs={PAIRS as unknown as string[]}
          regionalPairs={REGIONAL_PAIRS as unknown as string[]}
          pairLabels={PAIR_LABELS}
          columnTitles={columnTitles}
        />

        {/* METHODOLOGY INFO CARD */}
        <div className={styles.introCard}>
          <h2 className={styles.sectionHeading} style={{ marginBottom: '16px' }}>
            {text.contentHeading}
          </h2>
          <div className={styles.paragraphs}>
            {text.paragraphs.map(paragraph => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </main>
  )
}
