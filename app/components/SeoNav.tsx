import Link from 'next/link'
import { LanguageCode, NAV_TEXT, localizePath } from '../../lib/siteNavigation'
import styles from './SeoNav.module.css'

type NavKey = 'home' | 'rates' | 'pairs' | 'transfer' | 'blog' | 'about' | 'contact'

const NAV_ITEMS: Array<{ key: NavKey; path: string }> = [
  { key: 'home', path: '/' },
  { key: 'rates', path: '/rates' },
  { key: 'pairs', path: '/currency-pairs' },
  { key: 'transfer', path: '/money-transfer' },
  { key: 'blog', path: '/blog' },
  { key: 'about', path: '/about' },
  { key: 'contact', path: '/contact' },
]

export function SeoNav({ lang, active }: { lang: LanguageCode; active?: NavKey }) {
  const text = NAV_TEXT[lang] || NAV_TEXT.th

  return (
    <nav className={styles.nav} aria-label={text.mainMenu}>
      {NAV_ITEMS.map(item => (
        <Link
          key={item.key}
          href={localizePath(lang, item.path)}
          aria-current={active === item.key ? 'page' : undefined}
        >
          {text[item.key]}
        </Link>
      ))}
    </nav>
  )
}
