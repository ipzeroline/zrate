'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import styles from './blog.module.css'
import { SeoNav } from '../../components/SeoNav'
import { Header } from '../../components/Header'

export interface ArticleItem {
  slug: string
  publishedAt: string
  modifiedAt: string
  author: string
  category: string
  image: string
  translation: {
    title: string
    metaDescription: string
    metaKeywords: string[]
    content: string
  }
  isFallback: boolean
  fallbackLang: string
}

interface BlogIndexClientProps {
  articles: ArticleItem[]
  lang: 'th' | 'en' | 'lo' | 'my' | 'km'
  prefix: string
  text: {
    readMore: string
    published: string
    by: string
    noArticles: string
    minRead: string
    heading: string
    headingHighlight: string
    subheading: string
  }
}

const PAGE_SIZE = 12

const LANGUAGE_OPTIONS = [
  { code: 'th', label: 'ไทย', native: 'ไทย', flag: '\u{1F1F9}\u{1F1ED}', locale: 'th-TH' },
  { code: 'en', label: 'English', native: 'English', flag: '\u{1F1FA}\u{1F1F8}', locale: 'en-US' },
  { code: 'lo', label: 'ລາວ', native: 'ລາວ', flag: '\u{1F1F1}\u{1F1E6}', locale: 'lo-LA' },
  { code: 'my', label: 'မြန်မာ', native: 'မြန်မာ', flag: '\u{1F1F2}\u{1F1F2}', locale: 'my-MM' },
  { code: 'km', label: 'ខ្មែរ', native: 'ខ្មែរ', flag: '\u{1F1F0}\u{1F1ED}', locale: 'km-KH' },
]

const HEADER_TEXTS: Record<string, {
  live: string
  syncing: string
  refresh: string
  switchToDark: string
  switchToLight: string
  logoSub: string
}> = {
  th: {
    live: 'ข้อมูลสด',
    syncing: 'กำลังซิงก์...',
    refresh: 'อัปเดตเรทอัตราแลกเปลี่ยน',
    switchToDark: 'เปลี่ยนเป็นโหมดมืด',
    switchToLight: 'เปลี่ยนเป็นโหมดสว่าง',
    logoSub: 'อัตราแลกเปลี่ยนเงินและเคล็ดลับการโอนเงิน',
  },
  en: {
    live: 'Live feed',
    syncing: 'Syncing...',
    refresh: 'Refresh rates',
    switchToDark: 'Switch to dark theme',
    switchToLight: 'Switch to light theme',
    logoSub: 'Currency Rates & Remittance Insights',
  },
  lo: {
    live: 'ຂໍ້ມູ້ນສົດ',
    syncing: 'ກຳລັງຊິງກ໌...',
    refresh: 'ອັບເດດຂໍ້ມູ້ນ',
    switchToDark: 'ປ່ຽນເປັນໂຫມດມຶດ',
    switchToLight: 'ປ່ຽນເປັນໂຫມດແສງ',
    logoSub: 'ອັດຕາການດປ່ຽນເງິນ ແລະເຄັດລັບການໂອນເງິນ',
  },
  my: {
    live: 'တိုက်ရိုက်ဒေတာ',
    syncing: 'စင့်ခ်လုပ်နေသည်...',
    refresh: 'နှုန်းထားများ အပ်ဒိတ်လုပ်ရန်',
    switchToDark: 'မှောင်သောမုဒ်သို့ ပြောင်းရန်',
    switchToLight: 'လင်းသောမုဒ်သို့ ပြောင်းရန်',
    logoSub: 'ငွေလဲနှုန်းများနှင့် ငွေလွှဲဆိုင်ရာ အကြံပြုချက်များ',
  },
  km: {
    live: 'ទិន្នន័យផ្ទាល់',
    syncing: 'កំពុងធ្វើសមកាលកម្ម...',
    refresh: 'ធ្វើបច្ចុប្បន្នភាពអត្រា',
    switchToDark: 'ប្តូរទៅរបៀបងងឹត',
    switchToLight: 'ប្តូរទៅរបៀបភ្លឺ',
    logoSub: 'អត្រាប្តូរប្រាក់ និងគន្លឹះផ្ទេរប្រាក់',
  },
}

// Help search queries in different languages
const POPULAR_QUERIES: Record<string, string[]> = {
  th: ['โอนเงิน', 'จ๊าด', 'เมียนมา', 'บาท', 'USDT', 'ค่าธรรมเนียม', 'ถูกที่สุด'],
  en: ['remittance', 'Myanmar', 'Kyat', 'Baht', 'USDT', 'fees', 'cheapest'],
  lo: ['ໂອນເງິນ', 'ກີບ', 'ໂດລາ', 'USDT'],
  my: ['ငွေလွှဲခြင်း', 'ကျပ်ငွေ', 'ဘတ်ငွေ', 'USDT'],
  km: ['ផ្ទេរប្រាក់', 'រៀល', 'ដុល្លារ', 'USDT'],
}

// 3 guide cards like valustock clusters
const GUIDE_CLUSTERS: Record<string, Array<{ title: string; desc: string; icon: 'send' | 'rate' | 'crypto' }>> = {
  th: [
    {
      title: 'โอนเงินต่างประเทศ',
      desc: 'วิธีส่งเงินกลับพม่า ลาว กัมพูชา ผ่านช่องทางที่เป็นทางการ เรทดี ปลอดภัย 100%',
      icon: 'send',
    },
    {
      title: 'เปรียบเทียบเรทเงิน',
      desc: 'เทคนิคการคำนวณและเช็กอัตราแลกเปลี่ยนตลาดกลาง เพื่อให้ได้เรทเงินที่คุ้มค่าที่สุด',
      icon: 'rate',
    },
    {
      title: 'USDT & การเงินดิจิทัล',
      desc: 'ศึกษาการใช้งาน Stablecoin เช่น USDT และระบบโอนเงินข้ามประเทศแบบสมัยใหม่',
      icon: 'crypto',
    },
  ],
  en: [
    {
      title: 'International Remittance',
      desc: 'Best ways to send money to Myanmar, Laos, and Cambodia safely with the best rates.',
      icon: 'send',
    },
    {
      title: 'Exchange Rate Tips',
      desc: 'Learn how to monitor mid-market rates and compare conversion margins to save money.',
      icon: 'rate',
    },
    {
      title: 'USDT & Digital Finance',
      desc: 'Understand stablecoin utility, cryptocurrency rates, and modern borderless finance.',
      icon: 'crypto',
    },
  ],
  lo: [
    {
      title: 'ໂອນເງິນຕ່າງປະເທດ',
      desc: 'ວິທີສົ່ງເງິນກັບບ້ານຢ່າງປອດໄພ ດ້ວຍອັດຕາແລກປ່ຽນທີ່ດີທີ່ສຸດ.',
      icon: 'send',
    },
    {
      title: 'ປຽບທຽບອັດຕາແລກປ່ຽນ',
      desc: 'ວິທີການກວດສອບອັດຕາຕະຫຼາດກາງ ແລະ ຄຳນວນສ່ວນຕ່າງຢ່າງລະອຽด.',
      icon: 'rate',
    },
    {
      title: 'USDT & ການເງິນດິຈິຕອນ',
      desc: 'ຄວາມຮູ້ກ່ຽວກັບການໃຊ້ Stablecoin ແລະ ລະບົບການໂອນເງິນຍຸກໃໝ່.',
      icon: 'crypto',
    },
  ],
  my: [
    {
      title: 'နိုင်ငံတကာငွေလွှဲခြင်း',
      desc: 'မြန်မာ၊ လာအို၊ ကမ္ဘောဒီးယားနိုင်ငံများသို့ တရားဝင်လမ်းကြောင်းမှ စိတ်ချစွာ ငွေလွှဲနည်းများ။',
      icon: 'send',
    },
    {
      title: 'ငွေလဲလှယ်နှုန်း နှိုင်းယှဉ်ချက်',
      desc: 'အကျိုးအရှိဆုံးလဲလှယ်နှုန်းရရှိရန် အလယ်အလတ်ပေါက်ဈေးတွက်ချက်စစ်ဆေးနည်းများ။',
      icon: 'rate',
    },
    {
      title: 'USDT နှင့် ဒစ်ဂျစ်တယ်ငွေကြေး',
      desc: 'Stablecoin နှင့် ခေတ်မီငွေလွှဲစနစ်များအကြောင်း သိကောင်းစရာများ။',
      icon: 'crypto',
    },
  ],
  km: [
    {
      title: 'ការផ្ទេរប្រាក់អន្តរជាតិ',
      desc: 'វិធីផ្ញើប្រាក់ទៅប្រទេសមីយ៉ាន់ម៉ា ឡាវ និងកម្ពុជាដោយសុវត្ថិភាព និងចំណេញច្រើន។',
      icon: 'send',
    },
    {
      title: 'គន្លឹះប្រៀបធៀបអត្រាប្តូរប្រាក់',
      desc: 'រៀនពីរបៀបគណនា និងពិនិត្យមើលអត្រាទីផ្សារកណ្តាលដើម្បីកាត់បន្ថយការចំណាយ។',
      icon: 'rate',
    },
    {
      title: 'USDT និងហិរញ្ញវត្ថុឌីជីថល',
      desc: 'ស្វែងយល់ពីរបៀបប្រើប្រាស់ Stablecoin និងប្រព័ន្ធផ្ទេរប្រាក់ទំនើបៗ។',
      icon: 'crypto',
    },
  ],
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

export function BlogIndexClient({ articles, lang, prefix, text }: BlogIndexClientProps) {
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const isTh = lang === 'th'

  const normalizedQuery = query.trim().toLowerCase()
  const isSearching = normalizedQuery.length > 0

  const hText = HEADER_TEXTS[lang] || HEADER_TEXTS.th

  const filteredArticles = useMemo(() => {
    if (!normalizedQuery) return articles
    return articles.filter((article) => {
      const searchPool = [
        article.category,
        article.translation.title,
        article.translation.metaDescription,
        ...article.translation.metaKeywords,
      ]
        .join(' ')
        .toLowerCase()
      return searchPool.includes(normalizedQuery)
    })
  }, [articles, normalizedQuery])

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE))
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredArticles.slice(start, start + PAGE_SIZE)
  }, [filteredArticles, currentPage])

  const activeQueries = POPULAR_QUERIES[lang] || POPULAR_QUERIES.th
  const activeClusters = GUIDE_CLUSTERS[lang] || GUIDE_CLUSTERS.th

  return (
    <>
      {/* Premium Header */}
      <Header lang={lang} subtitle={hText.logoSub} />

      {/* Navigation Sub-menu */}
      <SeoNav lang={lang} active="blog" />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <span className={styles.heroEyebrow}>
          {lang === 'th' ? '📚 บทความความรู้' : lang === 'my' ? '📚 ဆောင်းပါးများ' : lang === 'lo' ? '📚 ບົດຄວາມ' : lang === 'km' ? '📚 អត្ថបទ' : '📚 Knowledge Hub'}
        </span>
        <h1>
          {text.heading}{' '}
          <span className={styles.highlight}>{text.headingHighlight}</span>
        </h1>
        <p className={styles.heroSubtitle}>{text.subheading}</p>
      </section>

      {/* Search Section (Valustock style) */}
      <section className={styles.searchSection}>
        <div className={styles.searchSectionHeader}>
          <svg className={styles.searchSectionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>{isTh ? 'ค้นหาบทความ' : lang === 'my' ? 'ဆောင်းပါးများ ရှာဖွေရန်' : 'Search Articles'}</span>
        </div>
        <div className={styles.searchBarWrapper}>
          <div className={styles.searchInputContainer}>
            <svg className={styles.inputSearchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder={
                isTh
                  ? 'ค้นหาเรทเงิน, วิธีโอนเงิน, หัวข้อ เช่น โอนเงิน, พม่า, จ๊าด, USDT'
                  : 'Search remittance guide, Kyats, Baht, USDT, etc.'
              }
              className={styles.searchInput}
            />
          </div>
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setCurrentPage(1)
              }}
              className={styles.clearSearchBtn}
            >
              {isTh ? 'ล้างคำค้น' : 'Clear'}
            </button>
          )}
        </div>
        <div className={styles.popularQueries}>
          {activeQueries.map((item) => (
            <button
              key={item}
              onClick={() => {
                setQuery(item)
                setCurrentPage(1)
              }}
              className={styles.queryTag}
            >
              {item}
            </button>
          ))}
        </div>
        <p className={styles.searchCountText}>
          {isSearching
            ? isTh
              ? `พบ ${filteredArticles.length} บทความสำหรับ "${query}"`
              : `Found ${filteredArticles.length} articles for "${query}"`
            : isTh
            ? `ค้นหาความรู้การโอนเงินและเรทแลกเปลี่ยนจากบทความทั้งหมด`
            : `Search remittance knowledge & live rates across all articles`}
        </p>
      </section>

      {/* Browse By Goal Section (Valustock style clusters) */}
      <section className={styles.goalsSection}>
        <div className={styles.goalsHeader}>
          <svg className={styles.goalsHeaderIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>
            {isTh ? 'กลุ่มบทความโอนเงิน & แลกเปลี่ยน' : 'Remittance & Exchange Guides'}
          </span>
        </div>
        <h2>
          {isTh ? 'อ่านตามเป้าหมายการเงินของคุณ' : 'Browse By Your Financial Goal'}
        </h2>
        <p className={styles.goalsDescription}>
          {isTh
            ? 'คัดสรรความรู้เรื่องการแปลงค่าเงินและวิธีส่งเงินข้ามประเทศ จัดหมวดหมู่เป็นกลุ่มเพื่อช่วยให้คุณหาข้อมูลได้เร็วที่สุด'
            : 'Remittance, stablecoins, and currency exchange guides organized around your immediate needs.'}
        </p>
        <div className={styles.goalsGrid}>
          {activeClusters.map((cluster) => (
            <div key={cluster.title} className={styles.goalCard}>
              <div className={styles.goalCardIconContainer}>
                {cluster.icon === 'send' && (
                  <svg className={styles.goalCardIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
                {cluster.icon === 'rate' && (
                  <svg className={styles.goalCardIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                  </svg>
                )}
                {cluster.icon === 'crypto' && (
                  <svg className={styles.goalCardIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h3>{cluster.title}</h3>
              <p>{cluster.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Articles Grid */}
      <section className={styles.articlesSection}>
        <div className={styles.sectionLabel}>
          <span>
            {isTh ? 'บทความทั้งหมด' : 'All Articles'}
          </span>
        </div>

        {paginatedArticles.length === 0 ? (
          <div className={styles.noArticles}>
            <div className={styles.noArticlesIcon}>📝</div>
            <p>{text.noArticles}</p>
          </div>
        ) : (
          <div className={styles.articlesGrid}>
            {paginatedArticles.map((article) => {
              const readTime = estimateReadTime(article.translation.content)
              // Dynamically load our new high-quality OpenGraph graphic
              const imageSrc = `/api/blog-image/${article.slug}?lang=${lang}`

              return (
                <article className={styles.articleCard} key={article.slug}>
                  <Link href={`${prefix}/blog/${article.slug}`} className={styles.cardImageWrap}>
                    <img
                      src={imageSrc}
                      alt={article.translation.title}
                      loading="lazy"
                      className={styles.cardImage}
                    />
                    <div className={styles.cardImageOverlay} />
                    <span className={styles.categoryTag}>{article.category}</span>
                  </Link>

                  <div className={styles.articleCardContent}>
                    {/* Header info tags */}
                    <div className={styles.cardHeaderInfo}>
                      <span className={styles.infoBadge}>
                        <svg className={styles.infoBadgeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {article.category}
                      </span>
                      <span className={styles.infoBadge}>
                        <svg className={styles.infoBadgeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {readTime} {text.minRead}
                      </span>
                    </div>

                    <h2 className={styles.cardTitle}>
                      <Link href={`${prefix}/blog/${article.slug}`}>
                        {article.translation.title}
                      </Link>
                    </h2>
                    <p className={styles.cardDesc}>{article.translation.metaDescription}</p>

                    {article.isFallback && (
                      <div className={styles.fallbackBadge}>
                        {lang === 'th'
                          ? `* แปลจาก ${article.fallbackLang.toUpperCase()}`
                          : `* Available in ${article.fallbackLang.toUpperCase()}`}
                      </div>
                    )}

                    {/* SEO / Research Focus Keywords Container */}
                    <div className={styles.seoFocusContainer}>
                      <div className={styles.seoFocusTitle}>
                        <svg className={styles.seoFocusTitleIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span>{isTh ? 'SEO focus' : 'Focus keywords'}</span>
                      </div>
                      <div className={styles.seoFocusTags}>
                        {article.translation.metaKeywords.slice(0, 4).map((keyword) => (
                          <span key={keyword} className={styles.seoFocusTag}>
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={styles.articleMeta}>
                      <div className={styles.metaLeft}>
                        <span className={styles.authorName}>{article.author}</span>
                      </div>
                      <div className={styles.metaRight}>
                        <span>{formatDate(article.publishedAt, lang)}</span>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Client-side Pagination */}
      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`${styles.pageBtn} ${currentPage === 1 ? styles.disabledBtn : ''}`}
          >
            {isTh ? 'ก่อนหน้า' : 'Prev'}
          </button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNum = index + 1
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`${styles.pageBtn} ${pageNum === currentPage ? styles.activePageBtn : ''}`}
              >
                {pageNum}
              </button>
            )
          })}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`${styles.pageBtn} ${currentPage === totalPages ? styles.disabledBtn : ''}`}
          >
            {isTh ? 'ถัดไป' : 'Next'}
          </button>
        </nav>
      )}
    </>
  )
}
