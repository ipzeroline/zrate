import { MetadataRoute } from 'next'
import { BLOG_ARTICLES } from '../lib/blogArticles'
import { LOCALES, PAIRS, SITE_URL, STATIC_ROUTES } from '../lib/siteNavigation'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const result: MetadataRoute.Sitemap = []

  // Helper to generate hreflang languages
  const getAlternates = (path: string) => {
    const languages: Record<string, string> = {}
    LOCALES.forEach(locale => {
      languages[locale] = locale === 'th'
        ? `${SITE_URL}${path || '/'}`
        : `${SITE_URL}/${locale}${path}`
    })
    // Add x-default pointing to the default (Thai) version
    languages['x-default'] = `${SITE_URL}${path || '/'}`
    return { languages }
  }

  // 1. Static hub pages
  STATIC_ROUTES.forEach(path => {
    const priority = path === '' ? 1.0
      : path === '/rates' || path === '/currency-pairs' ? 0.85
      : path === '/money-transfer' ? 0.75
      : path === '/blog' ? 0.6
      : 0.5

    result.push({
      url: `${SITE_URL}${path || '/'}`,
      lastModified,
      changeFrequency: path === '' || path === '/rates' || path === '/currency-pairs' ? 'daily' : 'monthly',
      priority,
      alternates: getAlternates(path),
    })
  })

  // 2. Currency pairs sitemap entries
  PAIRS.forEach(pair => {
    // Check priority logic based on pair importances
    let priority = 0.8
    if (['usd-thb', 'usdt-thb', 'thb-usd'].includes(pair)) {
      priority = 0.9
    } else if (['thb-jpy', 'thb-cny', 'eur-usd'].includes(pair)) {
      priority = 0.7
    }

    result.push({
      url: `${SITE_URL}/${pair}`,
      lastModified,
      changeFrequency: 'daily',
      priority,
      alternates: getAlternates(`/${pair}`),
    })
  })

  // 3. Individual blog articles sitemap entries
  BLOG_ARTICLES.forEach(article => {
    result.push({
      url: `${SITE_URL}/blog/${article.slug}`,
      lastModified: new Date(article.modifiedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: getAlternates(`/blog/${article.slug}`),
    })
  })

  return result
}
