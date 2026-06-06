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

    // --- Redirect Blocker Logic ---
    let isUserNavigating = false
    const handleNavigationClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement
      if (target && (target.closest('a') || target.closest('button') || target.closest('form') || target.closest('[role="button"]'))) {
        isUserNavigating = true
        // Allow navigation within 1.5s of click/tap
        setTimeout(() => { isUserNavigating = false }, 1500)
      }
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isUserNavigating) {
        // Prevent top-level redirect by malicious scripts
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    window.addEventListener('click', handleNavigationClick, true)
    window.addEventListener('touchend', handleNavigationClick, true)
    window.addEventListener('beforeunload', handleBeforeUnload)

    // --- Existing Scroll Restorer Logic ---
    const isMobileDevice = !window.matchMedia('(min-width: 900px)').matches
    if (!isMobileDevice) {
      return () => {
        window.removeEventListener('click', handleNavigationClick, true)
        window.removeEventListener('touchend', handleNavigationClick, true)
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
    }

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
      window.removeEventListener('click', handleNavigationClick, true)
      window.removeEventListener('touchend', handleNavigationClick, true)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      observer.disconnect()
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])
}

function BannerAd({ size }: { size: BannerSize }) {
  const [isClosed, setIsClosed] = useState(false)
  const slotRef = useRef<HTMLDivElement>(null)
  const instanceId = useId()
  const banner = BANNER_SIZES[size]
  const { ref: loaderRef, inView } = useInView<HTMLDivElement>()

  useEffect(() => {
    if (isClosed) return
    if (!inView) return

    const slot = slotRef.current
    if (!slot) return

    // Prevent double-loading: if elements are already appended, do nothing
    if (slot.firstChild) return

    const atOptions = {
      key: banner.key,
      format: 'iframe',
      height: banner.height,
      width: banner.width,
      params: {},
    }

    const confScript = document.createElement('script')
    confScript.type = 'text/javascript'
    confScript.innerHTML = `atOptions = ${JSON.stringify(atOptions)};`

    const invokeScript = document.createElement('script')
    invokeScript.type = 'text/javascript'
    invokeScript.src = `https://www.highperformanceformat.com/${banner.key}/invoke.js`
    invokeScript.async = true

    slot.appendChild(confScript)
    slot.appendChild(invokeScript)
  }, [banner.height, banner.key, banner.width, inView, isClosed])

  if (isClosed) return null

  return (
    <div ref={loaderRef} className={styles.adContainer}>
      <div className={styles.adHeader}>
        <span className={styles.adLabel}>โฆษณา / Advertisement</span>
        <button className={styles.closeButton} onClick={() => setIsClosed(true)} aria-label="Close advertisement">
          ปิด ×
        </button>
      </div>
      <div className={`${styles.adShell} ${size === 'desktop' ? styles.desktopBanner : styles.mobileRectangleBanner}`} style={{ minHeight: banner.height }} aria-label="Advertisement">
        <div
          ref={slotRef}
          id={`adsterra-banner-${banner.width}x${banner.height}-${instanceId.replace(/:/g, '')}`}
          className={styles.bannerSlot}
          style={{ width: banner.width, minHeight: banner.height }}
        />
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
  const shellRef = useRef<HTMLDivElement>(null)
  const { ref: loaderRef, inView } = useInView<HTMLDivElement>()

  useEffect(() => {
    const media = window.matchMedia('(min-width: 900px)')
    const syncSize = () => setIsDesktop(media.matches)

    syncSize()
    media.addEventListener('change', syncSize)
    return () => media.removeEventListener('change', syncSize)
  }, [])

  useEffect(() => {
    if (isDesktop !== true) return
    if (isClosed) return
    if (!inView) return

    const shell = shellRef.current
    if (!shell) return

    // Prevent double injection
    if (shell.querySelector('script')) return

    const script = createScript(`https://pl29644580.effectivecpmnetwork.com/${NATIVE_KEY}/invoke.js`)
    script.dataset.cfasync = 'false'
    shell.insertBefore(script, shell.firstChild)
  }, [inView, isClosed, isDesktop])

  if (isDesktop === null) {
    return (
      <div className={`${styles.adContainer} ${styles.desktopOnly}`}>
        <div className={styles.adHeader}>
          <span className={styles.adLabel}>โฆณา / Advertisement</span>
        </div>
        <div className={`${styles.adShell} ${styles.nativeShell} ${styles.pendingBanner}`} aria-hidden="true" />
      </div>
    )
  }

  if (!isDesktop) return null
  if (isClosed) return null

  return (
    <div ref={loaderRef} className={`${styles.adContainer} ${styles.desktopOnly}`}>
      <div className={styles.adHeader}>
        <span className={styles.adLabel}>โฆณา / Advertisement</span>
        <button className={styles.closeButton} onClick={() => setIsClosed(true)} aria-label="Close advertisement">
          ปิด ×
        </button>
      </div>
      <div className={`${styles.adShell} ${styles.nativeShell}`} style={{ minHeight: 140 }} aria-label="Advertisement">
        <div ref={shellRef}>
          <div id={`container-${NATIVE_KEY}`} className={styles.nativeSlot} />
        </div>
      </div>
    </div>
  )
}
