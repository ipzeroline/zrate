import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '../../../components/Footer'
import { SeoNav } from '../../../components/SeoNav'
import { Header } from '../../../components/Header'
import { AdSection } from '../../../components/AdsterraAds'
import { BLOG_ARTICLES } from '../../../../lib/blogArticles'
import { getAbsoluteBlogImageUrl, getBlogImagePath } from '../../../../lib/blogImage'
import { BlogViewCounter } from './BlogViewCounter'
import styles from '../blog.module.css'

type LanguageCode = 'th' | 'en' | 'lo' | 'my' | 'km'
const LOCALES = ['th', 'en', 'lo', 'my', 'km']
const SITE_URL = 'https://zrate.io'

interface PageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

// ── Simple Markdown → HTML (no external deps) ──────────────────────────
function parseMarkdownToHtml(md: string): string {
  let html = md;

  // 1. Tables
  const tableRegex = /\|([^\n]*)\|[ \t]*\n\|[ \t]*([:-|-| :]*)\|[ \t]*\n((?:\|[^\n]*\|[ \t]*(?:\n|$))+)/g;
  html = html.replace(tableRegex, (_match, headerRow, _sep, bodyRows) => {
    const headers = headerRow.split('|').map((h: string) => h.trim()).filter((h: string) => h !== '');
    const bodyLines = bodyRows.trim().split('\n').map((line: string) =>
      line.split('|').map(c => c.trim()).filter((_c, i, arr) => i > 0 && i < arr.length - 1)
    );
    const thead = `<thead><tr>${headers.map((h: string) => `<th>${h}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${bodyLines.map((row: string[]) => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`;
    return `<table>${thead}${tbody}</table>`;
  });

  // 2. Headings
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // 3. Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote><p>$1</p></blockquote>');

  // 4. Horizontal Rules
  html = html.replace(/^\-\-\-/gim, '<hr />');

  // 5. Unordered Lists
  html = html.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/gim, '');

  // 6. Bold
  html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');

  // 7. Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;height:auto;border-radius:10px;margin:20px 0;box-shadow:var(--shadow-md);display:block;border:1px solid var(--border);" />');

  // 8. Inline Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // 9. Paragraphs
  const paragraphs = html.split(/\n\s*\n/);
  html = paragraphs.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<table') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol') || trimmed.startsWith('<hr') || trimmed.startsWith('<li') || trimmed.startsWith('<img')) {
      return trimmed;
    }
    return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
  }).join('\n');

  return html;
}

// ── Static Params ──────────────────────────────────────────────────────
export function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = []
  for (const locale of LOCALES) {
    for (const article of BLOG_ARTICLES) {
      params.push({ locale, slug: article.slug })
    }
  }
  return params
}

// ── Metadata ───────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = (LOCALES.includes(resolvedParams.locale) ? resolvedParams.locale : 'th') as LanguageCode
  const article = BLOG_ARTICLES.find(a => a.slug === resolvedParams.slug)
  if (!article) return {}

  const trans = article.translations[lang] || article.translations['en'] || article.translations['th']
  if (!trans) return {}

  const prefix = lang === 'th' ? '' : `/${lang}`
  const imageUrl = getAbsoluteBlogImageUrl(article, lang, SITE_URL)

  const langAlternates: Record<string, string> = {}
  LOCALES.forEach(loc => {
    langAlternates[loc] = loc === 'th'
      ? `/blog/${resolvedParams.slug}`
      : `/${loc}/blog/${resolvedParams.slug}`
  })
  langAlternates['x-default'] = `/en/blog/${resolvedParams.slug}`

  return {
    title: trans.title,
    description: trans.metaDescription,
    keywords: trans.metaKeywords,
    alternates: {
      canonical: `${prefix}/blog/${resolvedParams.slug}`,
      languages: langAlternates,
    },
    openGraph: {
      title: trans.ogTitle,
      description: trans.ogDescription,
      url: `${prefix}/blog/${resolvedParams.slug}`,
      siteName: 'zrate.io',
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.modifiedAt,
      authors: [article.author],
      locale: lang === 'th' ? 'th_TH' : lang === 'en' ? 'en_US' : lang === 'lo' ? 'lo_LA' : lang === 'my' ? 'my_MM' : 'km_KH',
      alternateLocale: LOCALES.filter(l => l !== lang).map(l =>
        l === 'th' ? 'th_TH' : l === 'en' ? 'en_US' : l === 'lo' ? 'lo_LA' : l === 'my' ? 'my_MM' : 'km_KH'
      ),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: trans.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: trans.ogTitle,
      description: trans.ogDescription,
      images: [imageUrl],
    },
    category: 'finance',
  }
}

/** Format date for the given locale */
function formatDate(dateStr: string, locale: string): string {
  const localeMap: Record<string, string> = {
    th: 'th-TH', en: 'en-US', lo: 'lo-LA', my: 'my-MM', km: 'km-KH'
  }
  return new Date(dateStr).toLocaleDateString(localeMap[locale] || 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

// ── Page Component ─────────────────────────────────────────────────────
export default async function BlogDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const lang = (LOCALES.includes(resolvedParams.locale) ? resolvedParams.locale : 'th') as LanguageCode
  const article = BLOG_ARTICLES.find(a => a.slug === resolvedParams.slug)

  if (!article) notFound()

  let trans = article.translations[lang]
  let isFallback = false
  let fallbackLang = lang

  if (!trans) {
    if (article.translations['en']) {
      trans = article.translations['en']
      isFallback = true
      fallbackLang = 'en'
    } else if (article.translations['th']) {
      trans = article.translations['th']
      isFallback = true
      fallbackLang = 'th'
    }
  }

  if (!trans) notFound()

  const prefix = lang === 'th' ? '' : `/${lang}`
  const articleHtml = parseMarkdownToHtml(trans.content)
  const imagePath = getBlogImagePath(article, lang)
  const imageUrl = getAbsoluteBlogImageUrl(article, lang, SITE_URL)

  // Structured Data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem', 'position': 1,
        'name': lang === 'th' ? 'หน้าแรก' : lang === 'lo' ? 'ໜ້າຫຼັກ' : lang === 'my' ? 'ပင်မစာမျက်နှာ' : lang === 'km' ? 'ទំព័រដើម' : 'Home',
        'item': `${SITE_URL}${prefix}/`
      },
      {
        '@type': 'ListItem', 'position': 2,
        'name': lang === 'th' ? 'บทความ' : lang === 'lo' ? 'ບົດຄວາມ' : lang === 'my' ? 'ဆောင်းပါးများ' : lang === 'km' ? 'អត្ថបទ' : 'Blog',
        'item': `${SITE_URL}${prefix}/blog`
      },
      {
        '@type': 'ListItem', 'position': 3,
        'name': trans.title,
        'item': `${SITE_URL}${prefix}/blog/${resolvedParams.slug}`
      }
    ]
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'mainEntityOfPage': { '@type': 'WebPage', '@id': `${SITE_URL}${prefix}/blog/${resolvedParams.slug}` },
    'headline': trans.title,
    'description': trans.metaDescription,
    'image': imageUrl,
    'datePublished': article.publishedAt,
    'dateModified': article.modifiedAt,
    'author': { '@type': 'Organization', 'name': article.author, 'url': SITE_URL },
    'publisher': {
      '@type': 'Organization', 'name': 'zrate.io',
      'logo': { '@type': 'ImageObject', 'url': `${SITE_URL}/zrate.png` }
    }
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': trans.faqs.map(faq => ({
      '@type': 'Question', 'name': faq.question,
      'acceptedAnswer': { '@type': 'Answer', 'text': faq.answer }
    }))
  }

  return (
    <main className={styles.container} lang={lang}>
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Header lang={lang} />

      <SeoNav lang={lang} active="blog" />

      <AdSection />

      <div className={styles.articleWrapper}>
        {/* Back Button */}
        <div className={styles.backRow}>
          <Link href={`${prefix}/blog`} className={styles.backBtn}>
            ← {lang === 'th' ? 'กลับไปหน้ารวมบทความ' : lang === 'lo' ? 'ກັບໄປໜ້າບົດຄວາມ' : lang === 'my' ? 'ဆောင်းပါးများသို့ပြန်သွားရန်' : lang === 'km' ? 'ត្រឡប់ទៅអត្ថបទ' : 'Back to Articles'}
          </Link>
        </div>

        {/* Article Card */}
        <article className={styles.detailCard}>
          {/* Header */}
          <header className={styles.detailHeader}>
            <span className={styles.categoryTag}>{article.category}</span>
            <h1>{trans.title}</h1>
            <div className={styles.metaRow}>
              <span className={styles.author}>{article.author}</span>
              <span className={styles.metaDot}>•</span>
              <span>{formatDate(article.publishedAt, lang)}</span>
              <span className={styles.metaDot}>•</span>
              <BlogViewCounter slug={resolvedParams.slug} lang={lang} />
              {article.modifiedAt !== article.publishedAt && (
                <>
                  <span className={styles.metaDot}>•</span>
                  <span>
                    {lang === 'th' ? 'อัปเดต: ' : lang === 'my' ? 'အပ်ဒိတ်: ' : 'Updated: '}
                    {formatDate(article.modifiedAt, lang)}
                  </span>
                </>
              )}
            </div>
          </header>

          {/* Cover Image */}
          <div className={styles.articleCover}>
            <img
              src={imagePath}
              alt={trans.title}
              width={800}
              height={420}
              className={styles.coverImage}
            />
          </div>

          {/* Fallback Notice */}
          {isFallback && (
            <div className={styles.fallbackNotice}>
              {lang === 'th'
                ? `⚠️ ขออภัย: บทความนี้ยังไม่มีเวอร์ชันภาษาไทย เรากำลังแสดงเวอร์ชัน ${fallbackLang.toUpperCase()} แทน`
                : lang === 'my'
                  ? `⚠️ ဤဆောင်းပါးကို သင့်ဘာသာစကားသို့ မပြန်ဆိုရသေးပါ။ ${fallbackLang.toUpperCase()} ဗားရှင်းကို ပြသထားပါသည်။`
                  : lang === 'lo'
                    ? `⚠️ ຂໍອະໄພ: ບົດຄວາມນີ້ຍັງບໍ່ມີເວີຊັນພາສາລາວ ພວກເຮົາກຳລັງສະແດງເວີຊັນ ${fallbackLang.toUpperCase()}`
                    : lang === 'km'
                      ? `⚠️ សូមអភ័យទោស៖ អត្ថបទនេះមិនទាន់មានជាភាសាខ្មែរទេ។ យើងកំពុងបង្ហាញកំណែ ${fallbackLang.toUpperCase()}`
                      : `⚠️ This article isn't available in your language yet. Showing the ${fallbackLang.toUpperCase()} version.`}
            </div>
          )}

          {/* Article Body */}
          <section
            className={styles.markdownContent}
            dangerouslySetInnerHTML={{ __html: articleHtml }}
          />

          {/* FAQ Section */}
          {trans.faqs && trans.faqs.length > 0 && (
            <section className={styles.faqSection}>
              <h2>
                {lang === 'th' ? 'คำถามที่พบบ่อย (FAQs)'
                  : lang === 'my' ? 'မေးလေ့ရှိသော မေးခွန်းများ (FAQs)'
                  : lang === 'lo' ? 'ຄຳຖາມທີ່ພົບເລື້ອຍ (FAQs)'
                  : lang === 'km' ? 'សំណួរដែលសួរញឹកញាប់ (FAQs)'
                  : 'Frequently Asked Questions (FAQs)'}
              </h2>
              <div className={styles.faqList}>
                {trans.faqs.map((faq, index) => (
                  <details className={styles.faqItem} key={index} open={index === 0}>
                    <summary className={styles.faqQuestion}>{faq.question}</summary>
                    <div className={styles.faqAnswer}>
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Related Rates */}
        <section className={styles.relatedSection}>
          <h2>
            {lang === 'th' ? '📊 ดูเรทคู่เงินที่เกี่ยวข้อง'
              : lang === 'my' ? '📊 ဆက်စပ်ငွေလဲနှုန်းများ'
              : lang === 'lo' ? '📊 ອັດຕາແລກປ່ຽນທີ່ກ່ຽວຂ້ອງ'
              : lang === 'km' ? '📊 អត្រាប្តូរប្រាក់ពាក់ព័ន្ធ'
              : '📊 Related Exchange Rates'}
          </h2>
          <div className={styles.relatedLinks}>
            <Link href={`${prefix}/thb-mmk`}>THB → MMK</Link>
            <Link href={`${prefix}/usd-mmk`}>USD → MMK</Link>
            <Link href={`${prefix}/thb-usd`}>THB → USD</Link>
            <Link href={`${prefix}/thb-lak`}>THB → LAK</Link>
            <Link href={`${prefix}/usd-thb`}>USD → THB</Link>
          </div>
        </section>
      </div>

      <AdSection />

      <div style={{ marginTop: '48px' }}>
        <Footer lang={lang} />
      </div>
    </main>
  )
}
