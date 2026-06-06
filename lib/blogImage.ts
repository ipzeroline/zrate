import type { BlogArticle } from './blogArticles'

export type BlogLanguage = 'th' | 'en' | 'lo' | 'my' | 'km'

const SYMBOL_BY_SLUG: Record<string, string> = {
  'transfer-money-thailand-myanmar': 'THB/MMK',
  'transfer-money-thailand-laos': 'THB/LAK',
  'transfer-money-thailand-vietnam-philippines-indonesia': 'ASEAN',
  'compare-money-transfer-providers-thailand': 'FX',
  'promptpay-qr-cross-border-remittance': 'QR',
  'hidden-fees-exchange-rate-markup': 'FEE',
  'money-transfer-documents-regulations-thailand': 'KYC',
}

export function getBlogArticleSymbol(article: Pick<BlogArticle, 'slug' | 'category'>) {
  return SYMBOL_BY_SLUG[article.slug] || article.category.slice(0, 6).toUpperCase()
}

export function getBlogImagePath(article: Pick<BlogArticle, 'slug' | 'category'>, lang: BlogLanguage) {
  const params = new URLSearchParams({
    lang,
    category: article.category,
    symbol: getBlogArticleSymbol(article),
    v: '6',
  })

  return `/api/blog-image/${encodeURIComponent(article.slug)}?${params.toString()}`
}

export function getAbsoluteBlogImageUrl(
  article: Pick<BlogArticle, 'slug' | 'category'>,
  lang: BlogLanguage,
  siteUrl = 'https://zrate.io',
) {
  return `${siteUrl}${getBlogImagePath(article, lang)}`
}
