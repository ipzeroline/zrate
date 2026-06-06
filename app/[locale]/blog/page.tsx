import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Footer } from '../../components/Footer'
import { SeoNav } from '../../components/SeoNav'
import { AdSection } from '../../components/AdsterraAds'
import { BLOG_ARTICLES } from '../../../lib/blogArticles'
import styles from './blog.module.css'
import { BlogIndexClient } from './BlogIndexClient'

type LanguageCode = 'th' | 'en' | 'lo' | 'my' | 'km'
const LOCALES = ['th', 'en', 'lo', 'my', 'km']
const SITE_URL = 'https://zrate.io'

const BLOG_INDEX_TEXT: Record<LanguageCode, {
  title: string
  description: string
  heading: string
  headingHighlight: string
  subheading: string
  readMore: string
  published: string
  by: string
  noArticles: string
  minRead: string
  ctaTitle: string
  ctaDescription: string
  ctaButton: string
}> = {
  th: {
    title: 'บทความทางการเงินและข่าวสารอัตราแลกเปลี่ยน | zrate.io',
    description: 'อ่านบทความ สาระน่ารู้เกี่ยวกับการเงิน การโอนเงินต่างประเทศ อัตราแลกเปลี่ยน และเคล็ดลับการแปลงค่าเงินให้คุ้มที่สุด',
    heading: 'บทความการเงิน &',
    headingHighlight: 'เคล็ดลับการโอนเงิน',
    subheading: 'ความรู้และข้อมูลอ้างอิงเพื่อช่วยให้คุณจัดการการแลกเปลี่ยนและโอนเงินในอาเซียนได้อย่างคุ้มค่าที่สุด พร้อมเทคนิคและข่าวสารอัปเดตทุกสัปดาห์',
    readMore: 'อ่านบทความ',
    published: 'เผยแพร่',
    by: 'โดย',
    noArticles: 'ยังไม่มีบทความในภาษานี้',
    minRead: 'นาทีอ่าน',
    ctaTitle: 'ติดตามเรทสดทุกวัน ฟรี!',
    ctaDescription: 'เช็กอัตราแลกเปลี่ยนล่าสุด USD, THB, USDT, EUR, JPY และอีกกว่า 40 สกุลเงิน อัปเดตทุก 60 วินาที ไม่มีค่าใช้จ่าย',
    ctaButton: 'ดูเรทสดเลย →',
  },
  en: {
    title: 'Financial Articles & Remittance Insights | zrate.io',
    description: 'Read insightful articles about international remittance, exchange rates, currency conversion tips, and financial guides.',
    heading: 'Financial Guides &',
    headingHighlight: 'Remittance Insights',
    subheading: 'Expert advice and reference guides to help you optimize exchange rates and money transfers in Southeast Asia. New tips and updates every week.',
    readMore: 'Read Article',
    published: 'Published',
    by: 'By',
    noArticles: 'No articles available in this language yet.',
    minRead: 'min read',
    ctaTitle: 'Check Live Exchange Rates — Free!',
    ctaDescription: 'Track live rates for USD, THB, USDT, EUR, JPY and 40+ currencies. Updated every 60 seconds, no sign-up required.',
    ctaButton: 'View Live Rates →',
  },
  lo: {
    title: 'ບົດຄວາມການເງິນ ແລະຂ່າວສານອັດຕາແລກປ່ຽນ | zrate.io',
    description: 'ອ່ານບົດຄວາມກ່ຽວກັບການເງິນ ການໂອນເງິນຕ່າງປະເທດ ແລະເຄັດລັບການແປງເງິນໃຫ້ຄຸ້ມຄ່າທີ່ສຸດ',
    heading: 'ບົດຄວາມການເງິນ &',
    headingHighlight: 'ເຄັດລັບ',
    subheading: 'ຄວາມຮູ້ ແລະຂໍ້ມູ້ນເພື່ອຊ່ວຍໃຫ້ທ່ານຈັດການການແລກປ່ຽນ ແລະໂອນເງິນໃນອາຊຽນ.',
    readMore: 'ອ່ານບົດຄວາມ',
    published: 'ເຜີຍແຜ່',
    by: 'ໂດຍ',
    noArticles: 'ຍັງບໍ່ມີບົດຄວາມໃນພາສານີ້.',
    minRead: 'ນາທີ',
    ctaTitle: 'ກວດເບິ່ງອັດຕາແລກປ່ຽນສົດ — ຟຣີ!',
    ctaDescription: 'ຕິດຕາມອັດຕາແລກປ່ຽນຫຼ້າສຸດສຳລັບ USD, THB, USDT ແລະຫຼາຍກວ່າ 40 ສະກຸນເງິນ. ອັບເດດທຸກ 60 ວິນາທີ.',
    ctaButton: 'ເບິ່ງອັດຕາສົດ →',
  },
  my: {
    title: 'ငွေကြေးဆိုင်ရာ ဆောင်းပါးများနှင့် ငွေလဲနှုန်းသတင်းများ | zrate.io',
    description: 'နိုင်ငံတကာငွေလွှဲခြင်း၊ ငွေလဲနှုန်းဆိုင်ရာ သိကောင်းစရာများနှင့် ငွေလဲလှယ်ရာတွင် အကျိုးရှိစေမည့် အကြံပြုချက်များကို ဖတ်ရှုပါ။',
    heading: 'ငွေကြေးလမ်းညွှန်များ &',
    headingHighlight: 'ဆောင်းပါးများ',
    subheading: 'အာဆီယံဒေသတွင်း ငွေလဲလှယ်ခြင်းနှင့် ငွေလွှဲခြင်းများကို အကျိုးအရှိဆုံးဖြစ်စေရန် အကြံပြုချက်များနှင့် လမ်းညွှန်များ။',
    readMore: 'ဖတ်ရှုရန်',
    published: 'ထုတ်ဝေသည့်ရက်',
    by: 'ရေးသားသူ',
    noArticles: 'ဤဘာသာစကားဖြင့် ဆောင်းပါးများ မရှိသေးပါ။',
    minRead: 'မိနစ်',
    ctaTitle: 'တိုက်ရိုက်ငွေလဲနှုန်းများ ကြည့်ရှုပါ — အခမဲ့!',
    ctaDescription: 'USD, THB, USDT နှင့် ငွေကြေး 40+ အတွက် နောက်ဆုံးငွေလဲနှုန်းများကို စောင့်ကြည့်ပါ။ 60 စက္ကန့်တိုင်း အပ်ဒိတ်လုပ်ပါသည်။',
    ctaButton: 'တိုက်ရိုက်နှုန်းများ ကြည့်ရန် →',
  },
  km: {
    title: 'អត្ថបទហិរញ្ញវត្ថុ និងព័ត៌មានអត្រាប្តូរប្រាក់ | zrate.io',
    description: 'អានអត្ថបទ និងគន្លឹះស្តីពីការផ្ទេរប្រាក់ ការផ្ញើប្រាក់ទៅក្រៅប្រទេស និងរបៀបបម្លែងប្រាក់ឱ្យចំណេញបំផុត',
    heading: 'អត្ថបទហិរញ្ញវត្ថុ &',
    headingHighlight: 'គន្លឹះណែនាំ',
    subheading: 'ចំណេះដឹង និងទិន្នន័យដើម្បីជួយលោកអ្នកផ្ទេរប្រាក់ និងប្តូរប្រាក់នៅអាស៊ានឱ្យមានប្រសិទ្ធភាពបំផុត។',
    readMore: 'អានអត្ថបទ',
    published: 'កាលបរិច្ឆេទផ្សាយ',
    by: 'ដោយ',
    noArticles: 'មិនទាន់មានអត្ថបទជាភាសានេះនៅឡើយទេ។',
    minRead: 'នាទី',
    ctaTitle: 'ពិនិត្យអត្រាប្តូរប្រាក់ផ្សាយផ្ទាល់ — ឥតគិតថ្លៃ!',
    ctaDescription: 'តាមដានអត្រាប្តូរប្រាក់ចុងក្រោយសម្រាប់ USD, THB, USDT និងរូបិយប័ណ្ណជាង 40។ អាប់ដេតរៀងរាល់ 60 វិនាទី។',
    ctaButton: 'មើលអត្រាផ្សាយផ្ទាល់ →',
  }
}

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const lang = (LOCALES.includes(resolvedParams.locale) ? resolvedParams.locale : 'th') as LanguageCode
  const text = BLOG_INDEX_TEXT[lang]
  const prefix = lang === 'th' ? '' : `/${lang}`

  const langAlternates: Record<string, string> = {}
  LOCALES.forEach(loc => {
    langAlternates[loc] = loc === 'th' ? '/blog' : `/${loc}/blog`
  })
  langAlternates['x-default'] = '/en/blog'

  return {
    title: text.title,
    description: text.description,
    alternates: {
      canonical: `${prefix}/blog`,
      languages: langAlternates,
    },
    openGraph: {
      title: text.title,
      description: text.description,
      url: `${prefix}/blog`,
      siteName: 'zrate.io',
      type: 'website',
      locale: lang === 'th' ? 'th_TH' : lang === 'en' ? 'en_US' : lang === 'lo' ? 'lo_LA' : lang === 'my' ? 'my_MM' : 'km_KH',
    }
  }
}

/** Estimate reading time from markdown content (words per minute) */
function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

/** Format date for the given locale */
function formatDate(dateStr: string, locale: string): string {
  const localeMap: Record<string, string> = {
    th: 'th-TH', en: 'en-US', lo: 'lo-LA', my: 'my-MM', km: 'km-KH'
  }
  return new Date(dateStr).toLocaleDateString(localeMap[locale] || 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const lang = (LOCALES.includes(resolvedParams.locale) ? resolvedParams.locale : 'th') as LanguageCode
  const text = BLOG_INDEX_TEXT[lang]
  const prefix = lang === 'th' ? '' : `/${lang}`

  const articlesList = BLOG_ARTICLES.map(article => {
    let activeTranslation = article.translations[lang]
    let isFallback = false
    let fallbackLang = lang

    if (!activeTranslation) {
      if (article.translations['en']) {
        activeTranslation = article.translations['en']
        isFallback = true
        fallbackLang = 'en'
      } else if (article.translations['th']) {
        activeTranslation = article.translations['th']
        isFallback = true
        fallbackLang = 'th'
      }
    }

    return {
      slug: article.slug,
      publishedAt: article.publishedAt,
      modifiedAt: article.modifiedAt,
      author: article.author,
      category: article.category,
      image: article.image,
      translation: activeTranslation,
      isFallback,
      fallbackLang,
    }
  }).filter(item => item.translation !== undefined)

  return (
    <main className={styles.container} lang={lang}>
      {/* Blog Index Client (Search, Goal Guides, Pagination, and Premium Visuals) */}
      <BlogIndexClient articles={articlesList} lang={lang} prefix={prefix} text={text} />

      {/* CTA Section */}
      <section className={styles.newsletterCta}>
        <h2>{text.ctaTitle}</h2>
        <p>{text.ctaDescription}</p>
        <Link href={lang === 'th' ? '/' : `/${lang}`} className={styles.ctaButton}>
          {text.ctaButton}
        </Link>
      </section>

      <AdSection />

      <div style={{ marginTop: '48px' }}>
        <Footer lang={lang} />
      </div>
    </main>
  )
}
