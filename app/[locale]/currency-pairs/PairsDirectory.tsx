'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { LanguageCode, localizePath } from '../../../lib/siteNavigation'
import styles from './currency-pairs.module.css'

interface PairsDirectoryProps {
  lang: LanguageCode
  pairs: string[]
  regionalPairs: string[]
  pairLabels: Record<string, string>
  columnTitles: string[]
}

const CURRENCY_DETAILS: Record<string, { flag: string; name: Record<LanguageCode, string> }> = {
  thb: { flag: '🇹🇭', name: { th: 'บาทไทย', en: 'Thai Baht', lo: 'ກີບໄທ', my: 'ထိုင်းဘတ်', km: 'បាតថៃ' } },
  usd: { flag: '🇺🇸', name: { th: 'ดอลลาร์สหรัฐ', en: 'US Dollar', lo: 'ໂດລາສະຫະລັດ', my: 'အမေရိကန်ဒေါ်လာ', km: 'ដុល្លារអាមេរិក' } },
  lak: { flag: '🇱🇦', name: { th: 'กีบลาว', en: 'Lao Kip', lo: 'ກີບລາວ', my: 'လာအိုကစ်', km: 'គីបឡាវ' } },
  mmk: { flag: '🇲🇲', name: { th: 'จ๊าดเมียนมา', en: 'Myanmar Kyat', lo: 'ຈາດມຽນມາ', my: 'မြန်မာကျပ်', km: 'គ្យាតមីយ៉ាន់ម៉ា' } },
  khr: { flag: '🇰🇭', name: { th: 'เรียลกัมพูชา', en: 'Cambodian Riel', lo: 'ຣຽວກຳປູເຈຍ', my: 'ကမ္ဘောဒီးយားရီရယ်', km: 'រៀលកម្ពុជា' } },
  eur: { flag: '🇪🇺', name: { th: 'ยูโร', en: 'Euro', lo: 'ຢູໂຣ', my: 'ယူရို', km: 'អឺរ៉ូ' } },
  jpy: { flag: '🇯🇵', name: { th: 'เยนญี่ปุ่น', en: 'Japanese Yen', lo: 'ເຢນຍີ່ປຸ່ນ', my: 'ဂျပန်ယန်း', km: 'យ៉េនជប៉ុន' } },
  cny: { flag: '🇨🇳', name: { th: 'หยวนจีน', en: 'Chinese Yuan', lo: 'ຢວນຈີນ', my: 'တရုတ်ယွမ်', km: 'យន់ចិន' } },
  sgd: { flag: '🇸🇬', name: { th: 'ดอลลาร์สิงคโปร์', en: 'Singapore Dollar', lo: 'ໂດລາສິງກະໂປ', my: 'စင်ကာပူဒေါ်လာ', km: 'ដុល្លារសិង្ហបុរី' } },
  krw: { flag: '🇰🇷', name: { th: 'วอนเกาหลีใต้', en: 'South Korean Won', lo: 'ວອນເກົາຫຼີໃຕ້', my: 'တောင်ကိုရီးယားဝမ်', km: 'វ៉ុនកូរ៉េខាងត្បូង' } },
  usdt: { flag: '🪙', name: { th: 'Tether (USDT)', en: 'Tether (USDT)', lo: 'Tether (USDT)', my: 'Tether (USDT)', km: 'Tether (USDT)' } },
}

const SEARCH_PLACEHOLDERS: Record<LanguageCode, string> = {
  th: 'ค้นหาคู่เงิน... (เช่น usd, lak, บาท, กีบ)',
  en: 'Search currency pairs... (e.g., usd, lak, baht, kip)',
  lo: 'ຄົ້ນຫາຄູ່ເງິນ... (ເຊັ່ນ usd, lak, ບາດ)',
  my: 'ငွေကြေးအတွဲ ရှာဖွေရန်... (ဥပမာ - usd, lak, ဘတ်)',
  km: 'ស្វែងរកគូរូបិយប័ណ្ណ... (ឧទាហរណ៍៖ usd, lak, បាត)',
}

const FILTER_LABELS: Record<LanguageCode, { all: string; baht: string; asean: string; global: string }> = {
  th: { all: 'ทั้งหมด', baht: 'คู่เงินบาท', asean: 'คู่เงินอาเซียน', global: 'คู่เงินหลัก' },
  en: { all: 'All', baht: 'Baht Pairs', asean: 'ASEAN Pairs', global: 'Global & Major' },
  lo: { all: 'ທັງໝົດ', baht: 'ຄູ່ເງິນບາດ', asean: 'ຄູ່ເງິນອາຊຽນ', global: 'ຄູ່ເງິນຫຼັກ' },
  my: { all: 'အားလုံး', baht: 'ဘတ်အတွဲများ', asean: 'အာဆီယံအတွဲများ', global: 'အဓိကအတွဲများ' },
  km: { all: 'ទាំងអស់', baht: 'គូប្រាក់បាត', asean: 'គូអាស៊ាន', global: 'គូសកល' },
}

export function PairsDirectory({
  lang,
  pairs,
  regionalPairs,
  pairLabels,
  columnTitles
}: PairsDirectoryProps) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'baht' | 'asean' | 'global'>('all')

  const placeholder = SEARCH_PLACEHOLDERS[lang] || SEARCH_PLACEHOLDERS.th
  const labels = FILTER_LABELS[lang] || FILTER_LABELS.th

  // Programmatic pairs grouping
  const neighborPairs = useMemo(() => pairs.filter(p => regionalPairs.includes(p)), [pairs, regionalPairs])
  const bahtPairs = useMemo(() => pairs.filter(p => p.includes('thb') && !regionalPairs.includes(p)), [pairs, regionalPairs])
  const globalPairs = useMemo(() => pairs.filter(p => !p.includes('thb') && !regionalPairs.includes(p)), [pairs, regionalPairs])

  // Get full currency info helper
  const getPairDetails = (pairSlug: string) => {
    const [base, target] = pairSlug.split('-')
    const baseDetails = CURRENCY_DETAILS[base] || { flag: '🌐', name: { [lang]: base.toUpperCase() } }
    const targetDetails = CURRENCY_DETAILS[target] || { flag: '🌐', name: { [lang]: target.toUpperCase() } }
    
    return {
      baseFlag: baseDetails.flag,
      baseName: baseDetails.name[lang] || baseDetails.name.en,
      targetFlag: targetDetails.flag,
      targetName: targetDetails.name[lang] || targetDetails.name.en,
      label: pairLabels[pairSlug] || pairSlug.toUpperCase().replace('-', '/')
    }
  }

  // Filter pairs based on search & filter category selection
  const filteredPairs = useMemo(() => {
    let list = pairs
    
    if (filter === 'baht') {
      list = bahtPairs
    } else if (filter === 'asean') {
      list = neighborPairs
    } else if (filter === 'global') {
      list = globalPairs
    }

    if (!search.trim()) return list

    const query = search.toLowerCase().trim()
    return list.filter(slug => {
      const details = getPairDetails(slug)
      const labelMatch = details.label.toLowerCase().includes(query)
      const slugMatch = slug.includes(query)
      const baseMatch = details.baseName.toLowerCase().includes(query)
      const targetMatch = details.targetName.toLowerCase().includes(query)
      return labelMatch || slugMatch || baseMatch || targetMatch
    })
  }, [search, filter, pairs, bahtPairs, neighborPairs, globalPairs])

  // Determine which layout mode to show: search/filtered grid vs grouped columns
  const isSearchingOrFiltering = search.trim().length > 0 || filter !== 'all'

  return (
    <div className={styles.section}>
      {/* SEARCH AND FILTERS */}
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={placeholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filterRow}>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter('all')}
          >
            {labels.all}
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'baht' ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter('baht')}
          >
            {labels.baht}
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'asean' ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter('asean')}
          >
            {labels.asean}
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'global' ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter('global')}
          >
            {labels.global}
          </button>
        </div>
      </div>

      {/* PAIR DIRECTORY LIST */}
      {isSearchingOrFiltering ? (
        <div className={styles.directoryGrid} style={{ gridTemplateColumns: '1fr' }}>
          <div className={styles.directoryColumn} style={{ width: '100%' }}>
            <h3 className={styles.columnTitle}>
              {lang === 'th' ? `พบ ${filteredPairs.length} คู่เงิน` : `Found ${filteredPairs.length} pairs`}
            </h3>
            <div className={styles.pairsList} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
              {filteredPairs.map(slug => {
                const details = getPairDetails(slug)
                return (
                  <Link
                    href={localizePath(lang, `/${slug}`)}
                    key={slug}
                    className={styles.pairItemLink}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div className={styles.flagRow}>
                        <span className={styles.flagEmoji}>{details.baseFlag}</span>
                        <span className={styles.arrowSeparator}>➔</span>
                        <span className={styles.flagEmoji}>{details.targetFlag}</span>
                        <span className={styles.pairItemText} style={{ marginLeft: '4px' }}>
                          {details.label}
                        </span>
                      </div>
                      <span className={styles.pairItemName}>
                        {details.baseName} ➔ {details.targetName}
                      </span>
                    </div>
                    <svg className={styles.pairItemArrow} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.directoryGrid}>
          {/* COLUMN 1: Baht Pairs */}
          <div className={styles.directoryColumn}>
            <h3 className={styles.columnTitle}>{columnTitles[0]}</h3>
            <div className={styles.pairsList}>
              {bahtPairs.map(slug => {
                const details = getPairDetails(slug)
                return (
                  <Link
                    href={localizePath(lang, `/${slug}`)}
                    key={slug}
                    className={styles.pairItemLink}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div className={styles.flagRow}>
                        <span className={styles.flagEmoji}>{details.baseFlag}</span>
                        <span className={styles.arrowSeparator}>➔</span>
                        <span className={styles.flagEmoji}>{details.targetFlag}</span>
                        <span className={styles.pairItemText} style={{ marginLeft: '4px' }}>
                          {details.label}
                        </span>
                      </div>
                      <span className={styles.pairItemName}>
                        {details.baseName} ➔ {details.targetName}
                      </span>
                    </div>
                    <svg className={styles.pairItemArrow} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* COLUMN 2: ASEAN Pairs */}
          <div className={styles.directoryColumn}>
            <h3 className={styles.columnTitle}>{columnTitles[1]}</h3>
            <div className={styles.pairsList}>
              {neighborPairs.map(slug => {
                const details = getPairDetails(slug)
                return (
                  <Link
                    href={localizePath(lang, `/${slug}`)}
                    key={slug}
                    className={styles.pairItemLink}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div className={styles.flagRow}>
                        <span className={styles.flagEmoji}>{details.baseFlag}</span>
                        <span className={styles.arrowSeparator}>➔</span>
                        <span className={styles.flagEmoji}>{details.targetFlag}</span>
                        <span className={styles.pairItemText} style={{ marginLeft: '4px' }}>
                          {details.label}
                        </span>
                      </div>
                      <span className={styles.pairItemName}>
                        {details.baseName} ➔ {details.targetName}
                      </span>
                    </div>
                    <svg className={styles.pairItemArrow} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* COLUMN 3: Global / Other Pairs */}
          <div className={styles.directoryColumn}>
            <h3 className={styles.columnTitle}>{columnTitles[2]}</h3>
            <div className={styles.pairsList}>
              {globalPairs.map(slug => {
                const details = getPairDetails(slug)
                return (
                  <Link
                    href={localizePath(lang, `/${slug}`)}
                    key={slug}
                    className={styles.pairItemLink}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div className={styles.flagRow}>
                        <span className={styles.flagEmoji}>{details.baseFlag}</span>
                        <span className={styles.arrowSeparator}>➔</span>
                        <span className={styles.flagEmoji}>{details.targetFlag}</span>
                        <span className={styles.pairItemText} style={{ marginLeft: '4px' }}>
                          {details.label}
                        </span>
                      </div>
                      <span className={styles.pairItemName}>
                        {details.baseName} ➔ {details.targetName}
                      </span>
                    </div>
                    <svg className={styles.pairItemArrow} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
