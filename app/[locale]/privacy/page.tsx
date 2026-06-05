import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '../../components/Footer'
import { SeoNav } from '../../components/SeoNav'
import { HUB_TEXT } from '../../../lib/hubContent'
import { LanguageCode, LOCALES, SITE_URL, localizePath } from '../../../lib/siteNavigation'
import styles from '../hub.module.css'
import { Header } from '../../components/Header'

const PAGE_KEY = 'privacy'
const PATH = '/privacy'

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const lang = resolvedParams.locale as LanguageCode
  if (!LOCALES.includes(lang)) return {}
  const text = HUB_TEXT[PAGE_KEY][lang]
  const languages: Record<string, string> = {}
  LOCALES.forEach(locale => {
    languages[locale] = `${SITE_URL}${localizePath(locale, PATH)}`
  })
  languages['x-default'] = `${SITE_URL}${PATH}`

  return {
    title: text.title,
    description: text.description,
    alternates: {
      canonical: localizePath(lang, PATH),
      languages,
    },
    openGraph: {
      title: text.title,
      description: text.description,
      url: localizePath(lang, PATH),
      siteName: 'zrate.io',
      type: 'website',
    },
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const lang = resolvedParams.locale as LanguageCode
  if (!LOCALES.includes(lang)) notFound()
  const text = HUB_TEXT[PAGE_KEY][lang]

  return (
    <main className={styles.page} lang={lang}>
      <Header lang={lang} subtitle={text.description} />

      <SeoNav lang={lang} />

      <section className={styles.hero}>
        <span className={styles.eyebrow}>{text.eyebrow}</span>
        <h1>{text.heading}</h1>
        <p>{text.body}</p>
      </section>

      <section className={styles.section}>
        <h2>{text.cardsHeading}</h2>
        <div className={styles.grid}>
          {text.cards.map(card => (
            <article className={styles.card} key={card.title}>
              <strong>{card.title}</strong>
              <span>{card.body}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>{text.linksHeading}</h2>
        <div className={styles.linkList}>
          <Link href={localizePath(lang, '/about')}>About</Link>
          <Link href={localizePath(lang, '/contact')}>Contact</Link>
          <Link href={localizePath(lang, '/rates')}>Exchange rates</Link>
        </div>
      </section>

      <section className={styles.section}>
        <h2>{text.contentHeading}</h2>
        <div className={styles.content}>
          {text.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <Footer lang={lang} />
    </main>
  )
}
