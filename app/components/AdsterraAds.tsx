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

    slot.innerHTML = ''
    window.atOptions = {
      key: banner.key,
      format: 'iframe',
      height: banner.height,
      width: banner.width,
      params: {},
    }

    const script = createScript(`https://www.highperformanceformat.com/${banner.key}/invoke.js`)
    slot.appendChild(script)

    return () => {
      slot.innerHTML = ''
    }
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
      <div className={`${styles.adShell} ${size === 'desktop' ? styles.desktopBanner : styles.mobileRectangleBanner}`} aria-label="Advertisement">
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
  const [isClosed, setIsClosed] = useState(false)
  const shellRef = useRef<HTMLDivElement>(null)
  const { ref: loaderRef, inView } = useInView<HTMLDivElement>()

  useEffect(() => {
    if (isClosed) return
    if (!inView) return

    const shell = shellRef.current
    if (!shell) return

    const existingScript = shell.querySelector('script')
    if (existingScript) existingScript.remove()

    const script = createScript(`https://pl29644580.effectivecpmnetwork.com/${NATIVE_KEY}/invoke.js`)
    script.dataset.cfasync = 'false'
    shell.insertBefore(script, shell.firstChild)

    return () => {
      script.remove()
    }
  }, [inView, isClosed])

  if (isClosed) return null

  return (
    <div ref={loaderRef} className={styles.adContainer}>
      <div className={styles.adHeader}>
        <span className={styles.adLabel}>โฆษณา / Advertisement</span>
        <button className={styles.closeButton} onClick={() => setIsClosed(true)} aria-label="Close advertisement">
          ปิด ×
        </button>
      </div>
      <div className={`${styles.adShell} ${styles.nativeShell}`} aria-label="Advertisement">
        <div ref={shellRef}>
          <div id={`container-${NATIVE_KEY}`} className={styles.nativeSlot} />
        </div>
      </div>
    </div>
  )
}
