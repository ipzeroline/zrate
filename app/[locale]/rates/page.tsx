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
  PAIRS,
  PAIR_LABELS,
  SITE_URL,
  localizePath
} from '../../../lib/siteNavigation'
import styles from './rates.module.css'

const PAGE_KEY = 'rates'
const PATH = '/rates'

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
          url: `${SITE_URL}/rates-illustration.png`,
          width: 1024,
          height: 1024,
          alt: text.title,
        },
      ],
    },
  }
}

export default async function RatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const lang = resolvedParams.locale as LanguageCode
  if (!((LOCALES as string[]).includes(lang))) notFound()
  
  const text = HUB_TEXT[PAGE_KEY][lang]
  const prefix = lang === 'th' ? '' : `/${lang}`

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}${prefix}/rates#webpage`,
        'url': `${SITE_URL}${prefix}/rates`,
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

      <SeoNav lang={lang} active="rates" />

      <section className={styles.contentSection}>
        <div className={styles.gridMain}>
          {/* LEFT COLUMN: Hero content, live rates grid, and guidelines */}
          <div className={styles.leftColumn}>
            {/* Hero text */}
            <div className={styles.heroSection}>
              <span className={styles.eyebrow}>{text.eyebrow}</span>
              <h1 className={styles.title}>{text.heading}</h1>
              <p className={styles.description}>{text.body}</p>
            </div>

            {/* Featured Rates grid */}
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

            {/* Explanatory content section */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{text.contentHeading}</h2>
              <div className={styles.paragraphs}>
                {text.paragraphs.map(paragraph => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar with illustration and the complete pairs directory */}
          <div className={styles.rightColumn}>
            {/* Visual illustration */}
            <div className={styles.imageWrapper}>
              <Image
                src="/rates-illustration.png"
                alt="zrate.io global exchange rates & market analysis illustration"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 380px"
              />
            </div>

            {/* Complete pairs list directory */}
            <div className={styles.card}>
              <h2 className={styles.sidebarHeading}>{text.linksHeading}</h2>
              <div className={styles.linkChips}>
                {PAIRS.map(pair => (
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
