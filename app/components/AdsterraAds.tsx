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

type BannerSize = 'mobile' | 'desktop'

const NATIVE_KEY = '55839f2c5b4e3fb35184faac274e5138'
const MOBILE_BANNER_KEY = '8698763d9b806ab84826aebdd09784e7'
const DESKTOP_BANNER_KEY = '109f0016d0d3b1b39fd92ba8ea69e764'

function createScript(src: string) {
  const script = document.createElement('script')
  script.src = src
  script.async = true
  return script
}

function BannerAd({ size }: { size: BannerSize }) {
  const slotRef = useRef<HTMLDivElement>(null)
  const instanceId = useId()
  const isDesktop = size === 'desktop'
  const width = isDesktop ? 728 : 320
  const height = isDesktop ? 90 : 50
  const key = isDesktop ? DESKTOP_BANNER_KEY : MOBILE_BANNER_KEY

  useEffect(() => {
    const slot = slotRef.current
    if (!slot) return

    slot.innerHTML = ''
    window.atOptions = {
      key,
      format: 'iframe',
      height,
      width,
      params: {},
    }

    const script = createScript(`https://www.highperformanceformat.com/${key}/invoke.js`)
    slot.appendChild(script)

    return () => {
      slot.innerHTML = ''
    }
  }, [height, key, width])

  return (
    <div
      className={`${styles.adShell} ${isDesktop ? styles.desktopBanner : styles.mobileBanner}`}
      aria-label="Advertisement"
    >
      <div
        ref={slotRef}
        id={`adsterra-banner-${size}-${instanceId.replace(/:/g, '')}`}
        className={styles.bannerSlot}
        style={{ width, minHeight: height }}
      />
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

  if (!size) return <div className={`${styles.adShell} ${styles.pendingBanner}`} aria-hidden="true" />

  return <BannerAd key={size} size={size} />
}

export function NativeBannerAd() {
  const shellRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
  }, [])

  return (
    <div ref={shellRef} className={`${styles.adShell} ${styles.nativeShell}`} aria-label="Advertisement">
      <div id={`container-${NATIVE_KEY}`} className={styles.nativeSlot} />
    </div>
  )
}
