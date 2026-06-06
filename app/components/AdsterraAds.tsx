'use client'

import { useEffect, useId, useRef, useState } from 'react'
import styles from './AdsterraAds.module.css'

declare global {
  interface Window {
    atOptions?: {
      key: string
      format: string
      height: number
      width: number
      params: Record<string, unknown>
    }
  }
}

const NATIVE_KEY = '55839f2c5b4e3fb35184faac274e5138'
const DESKTOP_BANNER_KEY = '109f0016d0d3b1b39fd92ba8ea69e764'
const MOBILE_RECTANGLE_BANNER_KEY = '109f0016d0d3b1b39fd92ba8ea69e764'

const BANNER_SIZES = {
  desktop: { width: 728, height: 90, key: DESKTOP_BANNER_KEY },
  mobile: { width: 300, height: 250, key: MOBILE_RECTANGLE_BANNER_KEY },
} as const

type BannerSize = keyof typeof BANNER_SIZES

function createScript(src: string) {
  const script = document.createElement('script')
  script.src = src
  script.async = true
  return script
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || inView) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [inView])

  return { ref, inView }
}

function useAdScrollRestorer() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const isMobileDevice = !window.matchMedia('(min-width: 900px)').matches
    if (!isMobileDevice) return

    const handleBodyMutations = () => {
      // 1. Prevent scripts from locking overflow/position on html & body
      if (document.body.style.overflow === 'hidden' || document.body.style.position === 'fixed') {
        document.body.style.setProperty('overflow', 'auto', 'important')
        document.body.style.setProperty('position', 'static', 'important')
      }
      if (document.documentElement.style.overflow === 'hidden') {
        document.documentElement.style.setProperty('overflow', 'auto', 'important')
      }

      // 2. Scan and disable transparent click-intercepting overlays injected by ad networks
      const elements = document.body.children
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i] as HTMLElement
        if (!el || el.tagName === 'SCRIPT' || el.tagName === 'STYLE') continue

        // Skip main application layout wrapper
        if (el.className && typeof el.className === 'string' && el.className.includes('main')) continue

        const style = window.getComputedStyle(el)
        const isFixed = style.position === 'fixed' || style.position === 'absolute'
        
        const isFullScreen = 
          (parseFloat(style.width) >= window.innerWidth * 0.9 || style.width.includes('100%')) &&
          (parseFloat(style.height) >= window.innerHeight * 0.9 || style.height.includes('100%'))
        
        if (isFixed && isFullScreen) {
          const zIndex = parseInt(style.zIndex, 10)
          if (zIndex > 100) {
            // Neutralize if it is textless, covers screen, and is high z-index (invisible popup banner overlay)
            if (!el.innerText.trim() && el.querySelector('iframe') === null) {
              el.style.setProperty('pointer-events', 'none', 'important')
              el.style.setProperty('display', 'none', 'important')
            }
          }
        }
      }
    }

    handleBodyMutations()

    const observer = new MutationObserver(handleBodyMutations)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] })

    const handleTouchMove = () => {
      if (document.body.style.overflow === 'hidden') {
        document.body.style.setProperty('overflow', 'auto', 'important')
      }
    }
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])
}

function BannerAd({ size }: { size: BannerSize }) {
  const [isClosed, setIsClosed] = useState(false)
  const banner = BANNER_SIZES[size]
  const { ref: loaderRef, inView } = useInView<HTMLDivElement>()

  if (isClosed) return null

  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; overflow: hidden; background: transparent; }
        </style>
      </head>
      <body>
        <div id="ad-slot"></div>
        <script type="text/javascript">
          window.atOptions = {
            key: '${banner.key}',
            format: 'iframe',
            height: ${banner.height},
            width: ${banner.width},
            params: {}
          };
          const script = document.createElement('script');
          script.src = 'https://www.highperformanceformat.com/${banner.key}/invoke.js';
          script.async = true;
          document.body.appendChild(script);
        </script>
      </body>
    </html>
  `

  return (
    <div ref={loaderRef} className={styles.adContainer}>
      <div className={styles.adHeader}>
        <span className={styles.adLabel}>โฆษณา / Advertisement</span>
        <button className={styles.closeButton} onClick={() => setIsClosed(true)} aria-label="Close advertisement">
          ปิด ×
        </button>
      </div>
      <div className={`${styles.adShell} ${size === 'desktop' ? styles.desktopBanner : styles.mobileRectangleBanner}`} style={{ minHeight: banner.height }} aria-label="Advertisement">
        {inView ? (
          <iframe
            srcDoc={adHtml}
            width={banner.width}
            height={banner.height}
            style={{ border: 'none', overflow: 'hidden', display: 'block', margin: '0 auto' }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            scrolling="no"
          />
        ) : (
          <div style={{ width: banner.width, height: banner.height }} />
        )}
      </div>
    </div>
  )
}

export function ResponsiveBannerAd() {
  useAdScrollRestorer()
  const [size, setSize] = useState<BannerSize | null>(null)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 900px)')
    const syncSize = () => setSize(media.matches ? 'desktop' : 'mobile')

    syncSize()
    media.addEventListener('change', syncSize)
    return () => media.removeEventListener('change', syncSize)
  }, [])

  if (!size) {
    return (
      <div className={styles.adContainer}>
        <div className={styles.adHeader}>
          <span className={styles.adLabel}>โฆษณา / Advertisement</span>
        </div>
        <div className={`${styles.adShell} ${styles.pendingBanner}`} aria-hidden="true" />
      </div>
    )
  }

  return <BannerAd key={size} size={size} />
}

export function NativeBannerAd() {
  useAdScrollRestorer()
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)
  const [isClosed, setIsClosed] = useState(false)
  const { ref: loaderRef, inView } = useInView<HTMLDivElement>()

  useEffect(() => {
    const media = window.matchMedia('(min-width: 900px)')
    const syncSize = () => setIsDesktop(media.matches)

    syncSize()
    media.addEventListener('change', syncSize)
    return () => media.removeEventListener('change', syncSize)
  }, [])

  if (isDesktop === null) {
    return (
      <div className={`${styles.adContainer} ${styles.desktopOnly}`}>
        <div className={styles.adHeader}>
          <span className={styles.adLabel}>โฆษณา / Advertisement</span>
        </div>
        <div className={`${styles.adShell} ${styles.nativeShell} ${styles.pendingBanner}`} aria-hidden="true" />
      </div>
    )
  }

  if (!isDesktop) return null
  if (isClosed) return null

  const nativeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; overflow: hidden; background: transparent; }
        </style>
      </head>
      <body>
        <div id="container-${NATIVE_KEY}"></div>
        <script type="text/javascript">
          const script = document.createElement('script');
          script.src = 'https://pl29644580.effectivecpmnetwork.com/${NATIVE_KEY}/invoke.js';
          script.async = true;
          script.dataset.cfasync = 'false';
          document.body.appendChild(script);
        </script>
      </body>
    </html>
  `

  return (
    <div ref={loaderRef} className={`${styles.adContainer} ${styles.desktopOnly}`}>
      <div className={styles.adHeader}>
        <span className={styles.adLabel}>โฆษณา / Advertisement</span>
        <button className={styles.closeButton} onClick={() => setIsClosed(true)} aria-label="Close advertisement">
          ปิด ×
        </button>
      </div>
      <div className={`${styles.adShell} ${styles.nativeShell}`} style={{ minHeight: 140 }} aria-label="Advertisement">
        {inView ? (
          <iframe
            srcDoc={nativeHtml}
            width="100%"
            height="140"
            style={{ border: 'none', overflow: 'hidden', display: 'block' }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            scrolling="no"
          />
        ) : (
          <div style={{ height: 140 }} />
        )}
      </div>
    </div>
  )
}
