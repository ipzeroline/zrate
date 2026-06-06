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
  aed: { flag: '🇦🇪', name: { th: 'ดีแรฮมสหรัฐอาหรับเอมิเรตส์', en: 'UAE Dirham', lo: 'ສະຫະລັດອາຣັບເອມิເຣດດີແຣມ', my: 'ယူအေအီးဒီရဟမ်', km: 'ឌីរហាមអេមីរ៉ាតអារ៉ាប់រួម' } },
  aud: { flag: '🇦🇺', name: { th: 'ดอลลาร์ออสเตรเลีย', en: 'Australian Dollar', lo: 'ໂດລາອົດສະຕຣາລີ', my: 'ဩစតြေးလျဒေါ်လာ', km: 'ដុល្លារអូស្ត្រាលី' } },
  brl: { flag: '🇧🇷', name: { th: 'เรียลบราซิล', en: 'Brazilian Real', lo: 'ບຣາຊິນຣຽວ', my: 'ဘရာဇီးရီးယယ်', km: 'រៀលប្រេស៊ីល' } },
  cad: { flag: '🇨🇦', name: { th: 'ดอลลาร์แคนาดา', en: 'Canadian Dollar', lo: 'ໂດລາແຄนນາດາ', my: 'ကနေဒါဒေါ်လာ', km: 'ដុល្លារកាណាដា' } },
  chf: { flag: '🇨🇭', name: { th: 'ฟรังก์สวิส', en: 'Swiss Franc', lo: 'ຟຣັງສະວິດ', my: 'ဆွတ်ဇាលັນဖရန့်', km: 'ហ្វ្រង់ស្វីស' } },
  cny: { flag: '🇨🇳', name: { th: 'หยวนจีน', en: 'Chinese Yuan', lo: 'ຢວນຈີນ', my: 'တရုတ်ယွမ်', km: 'យន់ចិន' } },
  czk: { flag: '🇨🇿', name: { th: 'โครูนาสาธารณรัฐเช็ก', en: 'Czech Koruna', lo: 'ສາທາລະນະລັດເຊັກໂຄຣູນາ', my: 'ချက်ကိုရူနာ', km: 'កូរូណាឆែក' } },
  dkk: { flag: '🇩🇰', name: { th: 'โครนเดนมาร์ก', en: 'Danish Krone', lo: 'ເດນມາກໂຄຣນ', my: 'ဒိန်းမတ်ခရိုနီ', km: 'ក្រូនដាណឺម៉ាក' } },
  egp: { flag: '🇪🇬', name: { th: 'ปอนด์อียิปต์', en: 'Egyptian Pound', lo: 'ອີຢິບປອນ', my: 'အီဂျစ်ပေါင်', km: 'ផោនអេស៊ីប' } },
  eur: { flag: '🇪🇺', name: { th: 'ยูโร', en: 'Euro', lo: 'ເອີໂຣ', my: 'ယူရို', km: 'អឺរ៉ូ' } },
  gbp: { flag: '🇬🇧', name: { th: 'ปอนด์สเตอร์ลิง', en: 'British Pound', lo: 'ປອນສະເຕີລິງ', my: 'ဗြိတိသျှပေါင်', km: 'ផោនស្ទឺលីង' } },
  hkd: { flag: '🇭🇰', name: { th: 'ดอลลาร์ฮ่องกง', en: 'Hong Kong Dollar', lo: 'ໂດລາຮົງກົງ', my: 'ဟောင်កောင်ဒေါ်လာ', km: 'ដុល្លារហុងកុង' } },
  huf: { flag: '🇭🇺', name: { th: 'ฟอรินต์ฮังการี', en: 'Hungarian Forint', lo: 'ຮັງກາຣີຟໍຣິນ', my: 'ဟန်ဂေရီဖိုးရင့်', km: 'ហ្វូរីនហុងគ្រី' } },
  idr: { flag: '🇮🇩', name: { th: 'รูเปียห์อินโดนีเซีย', en: 'Indonesian Rupiah', lo: 'ຣູເປຍອინໂດເນເຊຍ', my: 'အင်ဒိုនီးရှားရူပီးယား', km: 'រូព្យ៉ាឥណ្ឌូនេស៊ី' } },
  ils: { flag: '🇮🇱', name: { th: 'เชเกลอิสราเอล', en: 'Israeli Shekel', lo: 'ອິດສະຣາແອນເຊເກລ', my: 'အစ္စရေးရှီကယ်', km: 'ស៊ីគែលអ៊ីស្រាអែល' } },
  inr: { flag: '🇮🇳', name: { th: 'รูปีอินเดีย', en: 'Indian Rupee', lo: 'ຣູປີອີນເດຍ', my: 'အိန္ဒိယရူပီး', km: 'រូពីឥណ្ឌា' } },
  jpy: { flag: '🇯🇵', name: { th: 'เยนญี่ปุ่น', en: 'Japanese Yen', lo: 'ເຢນຍີ່ປຸ່ນ', my: 'ဂျပန်ယန်း', km: 'យ៉េនជប៉ុន' } },
  khr: { flag: '🇰🇭', name: { th: 'เรียลกัมพูชา', en: 'Cambodian Riel', lo: 'ຣຽວກຳປູເຈຍ', my: 'ကမ္ဘောဒီးយားရីယယ်', km: 'រៀលកម្ពុជា' } },
  krw: { flag: '🇰🇷', name: { th: 'วอนเกาหลีใต้', en: 'South Korean Won', lo: 'ວອນເກົາຫຼີໃຕ້', my: 'တောင်ကိုရီးယားဝမ်', km: 'វ៉ុនកូរ៉េខាងត្បូង' } },
  lak: { flag: '🇱🇦', name: { th: 'กีบลาว', en: 'Lao Kip', lo: 'ກີບລາວ', my: 'လာအိုကျပ်', km: 'គីបឡាវ' } },
  mmk: { flag: '🇲🇲', name: { th: 'จ๊าตเมียนมา', en: 'Myanmar Kyat', lo: 'ຈາດມຽนມາ', my: 'မြန်မာကျပ်', km: 'គ្យាតមីយ៉ាន់ម៉ា' } },
  mxn: { flag: '🇲🇽', name: { th: 'เปโซเม็กซิโก', en: 'Mexican Peso', lo: 'ເມັກຊິໂກເປໂຊ', my: 'မက္ကဆီကိုပီဆို', km: 'ប៉េសូម៉ិកស៊ិក' } },
  myr: { flag: '🇲🇾', name: { th: 'ริงกิตมาเลเซีย', en: 'Malaysian Ringgit', lo: 'ຣิงກິດມາເລເຊຍ', my: 'မလေးရှားရင်းဂစ်', km: 'រីងហ្គីតម៉ាឡេស៊ី' } },
  ngn: { flag: '🇳🇬', name: { th: 'ไนราไนจีเรีย', en: 'Nigerian Naira', lo: 'ໄນຈີເລຍໄນຣา', my: 'နိုင်ဂျီးရီးယားနိုင်ရာ', km: 'ណៃរ៉ានីហ្សេរីយ៉ា' } },
  nok: { flag: '🇳🇴', name: { th: 'โครนนอร์เวย์', en: 'Norwegian Krone', lo: 'ນໍເວໂຄຣນ', my: 'နော်ဝေခရိုနီ', km: 'ក្រូនន័រវែស' } },
  nzd: { flag: '🇳🇿', name: { th: 'ดอลลาร์นิวซีแลนด์', en: 'New Zealand Dollar', lo: 'ໂດລານิวຊີແລນ', my: 'နယူးဇီလန်ဒေါ်လာ', km: 'ដុល្លារនូវែលសេឡង់' } },
  php: { flag: '🇵🇭', name: { th: 'เปโซฟิลิปปินส์', en: 'Philippine Peso', lo: 'ເປໂซຟີລິບປິນ', my: 'ဖိလစ်ပိုင်ပီဆို', km: 'ប៉េសូហ្វីលីពីន' } },
  pkr: { flag: '🇵🇰', name: { th: 'รูปีปากีสถาน', en: 'Pakistani Rupee', lo: 'ປາກີສະຖານຣູປີ', my: 'ပါကစ္စတန်ရူပီး', km: 'រូពីប៉ាគីស្ថាន' } },
  pln: { flag: '🇵🇱', name: { th: 'สลอตีโปแลนด์', en: 'Polish Zloty', lo: 'ໂποແລນຊະລໍຕີ', my: 'ပိုလန်ဇလော့တီ', km: 'ហ្ស្លូទីប៉ូឡូញ' } },
  rub: { flag: '🇷🇺', name: { th: 'รูเบิลรัสเซีย', en: 'Russian Ruble', lo: 'ຣັດເຊຍຣູເບິລ', my: 'ရုရှားရူဘယ်', km: 'រូបរុស្ស៊ី' } },
  sar: { flag: '🇸🇦', name: { th: 'ริยัลซาอุดีอาระเบีย', en: 'Saudi Riyal', lo: 'ຊາອຸດີຣິຢັນ', my: 'ဆော်ဒီရီယယ်', km: 'រីយ៉ាល់អារ៉ាប៊ីសាអូឌីត' } },
  sek: { flag: '🇸🇪', name: { th: 'โครนาสวีเดน', en: 'Swedish Krona', lo: 'ສະວີເດັນໂຄຣນາ', my: 'ဆွီဒင်ခရိုနာ', km: 'ក្រូនស៊ុយអែត' } },
  sgd: { flag: '🇸🇬', name: { th: 'ดอลลาร์สิงคโปร์', en: 'Singapore Dollar', lo: 'ໂດລາສิงກະໂປ', my: 'စင်ကာပူဒေါ်လာ', km: 'ដុល្លារសិង្ហបុរី' } },
  thb: { flag: '🇹🇭', name: { th: 'บาทไทย', en: 'Thai Baht', lo: 'ບາດໄທ', my: 'ထိုင်းဘတ်', km: 'ប្រាក់បាតថៃ' } },
  try: { flag: '🇹🇷', name: { th: 'ลีราตุรกี', en: 'Turkish Lira', lo: 'ຕວກກີລີຣາ', my: 'တူရကီလီရာ', km: 'លីរ៉ាទួកគី' } },
  twd: { flag: '🇹🇼', name: { th: 'ดอลลาร์ไต้หวันใหม่', en: 'New Taiwan Dollar', lo: 'ໄຕ້ຫວັນໂດລາ', my: 'တိုင်ဝမ်ဒေါ်လာအသစ်', km: 'ដុល្លារតៃវ៉ាន់ថ្មី' } },
  usd: { flag: '🇺🇸', name: { th: 'ดอลลาร์สหรัฐ', en: 'US Dollar', lo: 'ໂດລາສະຫະລັດ', my: 'အမေရိကန်ဒေါ်လာ', km: 'ដុល្លារអាមេរិក' } },
  usdt: { flag: '🪙', name: { th: 'เทเธอร์ (USDT)', en: 'Tether (USDT)', lo: 'Tether (USDT)', my: 'USDT (Tether)', km: 'Tether (USDT)' } },
  vnd: { flag: '🇻🇳', name: { th: 'ดงเวียดนาม', en: 'Vietnamese Dong', lo: 'ດົງຫວຽດນາມ', my: 'ဗီယက်နမ်ဒေါင်', km: 'ដុងវៀតណាម' } },
  zar: { flag: '🇿🇦', name: { th: 'แรนด์แอฟริกาใต้', en: 'South African Rand', lo: 'ອາຟຣິກາໃຕ້ແຣນ', my: 'တောင်အာဖရိကရန်း', km: 'រ៉ង់អាហ្វ្រិកខាងត្បូង' } },
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
