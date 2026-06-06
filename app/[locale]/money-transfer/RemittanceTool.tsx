'use client'

import React, { useState, useEffect } from 'react'
import styles from './money-transfer.module.css'
import pairStyles from '../[pair]/page.module.css'
import { InteractiveChart } from '../[pair]/InteractiveChart'

interface HistoricalPoint {
  date: string
  rate: number
}

interface ProviderInfo {
  id: string
  name: string
  logoText: string
  logoColor: string
  feeType: 'flat' | 'percentage'
  feeVal: number // THB flat fee, or multiplier (e.g. 0.005 for 0.5%)
  margin: number // markup rate over mid-market
  speed: Record<string, string> // speed by language
  url: string
  sponsor: boolean
  supportedCorridors: string[] // ['USD', 'LAK', 'MMK', 'KHR', ...]
}

const GLOBAL_CORRIDORS = ['USD', 'AUD', 'JPY', 'KRW', 'SGD', 'MYR', 'CNY', 'EUR', 'GBP', 'LAK', 'MMK', 'KHR', 'PHP', 'IDR', 'VND']

const PROVIDERS: ProviderInfo[] = [
  {
    id: 'baac',
    name: 'ธ.ก.ส. (ไทย-ลาว)',
    logoText: 'BAAC',
    logoColor: '#22c55e',
    feeType: 'flat',
    feeVal: 500,
    margin: 0.003,
    speed: {
      th: 'ภายในวันทำการเดียวกัน',
      en: 'Same business day',
      lo: 'ພາຍໃນມື້ດຽວກັນ',
      my: 'ယင်းနေ့အတွင်း',
      km: 'ក្នុងថ្ងៃដដែល'
    },
    url: 'https://www.baac.or.th',
    sponsor: false,
    supportedCorridors: ['LAK']
  },
  {
    id: 'ktb',
    name: 'Krungthai WARP',
    logoText: 'KTB',
    logoColor: '#0ea5e9',
    feeType: 'flat',
    feeVal: 299,
    margin: 0.009,
    speed: {
      th: '1 - 2 วันทำการ',
      en: '1 - 2 business days',
      lo: '1 - 2 ມື້ເຮັດວຽກ',
      my: '၁ - ၂ ရက်အတွင်း',
      km: '១ - ២ ថ្ងៃធ្វើការ'
    },
    url: 'https://krungthai.com',
    sponsor: false,
    supportedCorridors: GLOBAL_CORRIDORS
  },
  {
    id: 'wu',
    name: 'Western Union',
    logoText: 'WU',
    logoColor: '#eab308',
    feeType: 'flat',
    feeVal: 150,
    margin: 0.022,
    speed: {
      th: 'ภายในไม่กี่นาที - 1 วัน',
      en: 'Minutes to 1 business day',
      lo: 'ບໍ່ກີ່ນາທີ - 1 ມື້',
      my: 'မိနစ်ပိုင်းမှ ၁ ရက်အတွင်း',
      km: 'នាទីទៅ ១ ថ្ងៃ'
    },
    url: 'https://www.westernunion.com',
    sponsor: false,
    supportedCorridors: GLOBAL_CORRIDORS
  },
  {
    id: 'wise',
    name: 'Wise',
    logoText: 'Wise',
    logoColor: '#10b981',
    feeType: 'percentage',
    feeVal: 0.005, // 0.5% variable fee
    margin: 0.0015, // tight 0.15% margin
    speed: {
      th: 'ทันที - ไม่กี่ชั่วโมง',
      en: 'Instant to few hours',
      lo: 'ທັນທີ - ບໍ່ກີ່ຊົ່ວໂມງ',
      my: 'ချက်ချင်းမှ နာရီပိုင်းအတွင်း',
      km: 'ភ្លាមៗទៅប៉ុន្មានម៉ោង'
    },
    url: 'https://wise.com/?source=zrate',
    sponsor: true,
    supportedCorridors: GLOBAL_CORRIDORS
  },
  {
    id: 'remitly',
    name: 'Remitly',
    logoText: 'R',
    logoColor: '#6366f1',
    feeType: 'flat',
    feeVal: 99,
    margin: 0.0075, // 0.75% margin
    speed: {
      th: 'ทันที - 1 วันทำการ',
      en: 'Instant to 1 business day',
      lo: 'ທັນທີ - 1 ມື້ເຮັດວຽກ',
      my: 'ချက်ချင်းမှ ၁ ရက်အတွင်း',
      km: 'ភ្លាមៗទៅ ១ ថ្ងៃធ្វើការ'
    },
    url: 'https://www.remitly.com/?source=zrate',
    sponsor: true,
    supportedCorridors: GLOBAL_CORRIDORS
  }
]

interface LocalizedLabels {
  amountLabel: string
  destLabel: string
  providerCol: string
  feeCol: string
  rateCol: string
  receivedCol: string
  speedCol: string
  linkCol: string
  bestValueTag: string
  noteText: string
  sponsoredTag: string
}

const LABELS: Record<string, LocalizedLabels> = {
  th: {
    amountLabel: 'จำนวนเงินที่ต้องการโอน (THB)',
    destLabel: 'สกุลเงินปลายทาง',
    providerCol: 'ผู้ให้บริการ',
    feeCol: 'ค่าธรรมเนียมโอน',
    rateCol: 'เรทโอนเงินจริง',
    receivedCol: 'ผู้รับปลายทางได้รับสุทธิ',
    speedCol: 'เวลาโอน',
    linkCol: 'ตรวจสอบเรท',
    bestValueTag: 'คุ้มค่าที่สุด',
    noteText: 'คำนวณจากจำนวนเงินต้น หักด้วยค่าธรรมเนียมและแปลงอัตราแลกเปลี่ยนจริงที่รวมค่า Margin แล้ว',
    sponsoredTag: 'แนะนำ'
  },
  en: {
    amountLabel: 'Amount to Transfer (THB)',
    destLabel: 'Destination currency',
    providerCol: 'Provider',
    feeCol: 'Transfer Fee',
    rateCol: 'Retail Rate',
    receivedCol: 'Recipient Receives',
    speedCol: 'Transfer Speed',
    linkCol: 'Official Rate',
    bestValueTag: 'Best Value',
    noteText: 'Calculated from the principal amount minus transfer fees, converted using the retail exchange rate including margins.',
    sponsoredTag: 'Sponsored'
  },
  lo: {
    amountLabel: 'ຍອດເງິນທີ່ຕ້ອງການໂອນ (THB)',
    destLabel: 'ສະກຸນເງິນປາຍທາງ',
    providerCol: 'ຜູ້ໃຫ້ບໍລິການ',
    feeCol: 'ຄ່າທຳນຽມການໂອນ',
    rateCol: 'ເຣດຕົວຈິງ',
    receivedCol: 'ຍອດເງິນປາຍທາງຈະໄດ້ຮັບ',
    speedCol: 'ເວລາໃນການໂອນ',
    linkCol: 'ລິ້ງທາງການ',
    bestValueTag: 'ຄຸ້ມຄ່າທີ່ສຸດ',
    noteText: 'ຄຳນວນຈາກຍອດຫຼັງຫັກຄ່າທຳນຽມ ແລະ ຄູນດ້ວຍເຣດຕົວຈິງທີ່ລວມສ່ວນຕ່າງແລ້ວ',
    sponsoredTag: 'ແນະນຳ'
  },
  my: {
    amountLabel: 'လွှဲပို့လိုသောငွေပမာဏ (THB)',
    destLabel: 'လက်ခံမည့်ငွေကြေး',
    providerCol: 'ဝန်ဆောင်မှုပေးသူ',
    feeCol: 'ဝန်ဆောင်ခ',
    rateCol: 'ငွေလဲနှုန်း',
    receivedCol: 'လက်ခံသူရရှိမည့်ငွေ',
    speedCol: 'ကြာမြင့်ချိန်',
    linkCol: 'တရားဝင်လင့်ခ်',
    bestValueTag: 'အသက်သာဆုံး',
    noteText: 'စုစုပေါင်းငွေမှ ဝန်ဆောင်ခနုတ်ပြီး နှုန်းကွာဟချက်အပါအဝင် တွက်ချက်ထားခြင်း ဖြစ်သည်။',
    sponsoredTag: 'ညွှန်းဆို'
  },
  km: {
    amountLabel: 'ចំនួនប្រាក់ដែលត្រូវផ្ទេរ (THB)',
    destLabel: 'រូបិយប័ណ្ណគោលដៅ',
    providerCol: 'អ្នកផ្តល់សេវា',
    feeCol: 'ថ្លៃសេវាផ្ទេរ',
    rateCol: 'អត្រាពិតប្រាកដ',
    receivedCol: 'ប្រាក់អ្នកទទួលទទួលបាន',
    speedCol: 'រយៈពេលផ្ទេរ',
    linkCol: 'តំណភ្ជាប់ផ្លូវការ',
    bestValueTag: 'ល្អបំផុត',
    noteText: 'គណនាពីប្រាក់ដើមដកថ្លៃសេវា រួចបម្លែងតាមអត្រាប្តូរប្រាក់ជាក់ស្តែងដែលរួមបញ្ចូល margin។',
    sponsoredTag: 'ណែនាំ'
  }
}

const CURRENCY_NAMES: Record<string, Record<string, string>> = {
  USD: { th: 'ดอลลาร์สหรัฐ (USD) 🇺🇸', en: 'US Dollar (USD) 🇺🇸', lo: 'ໂດລາສະຫະລັດ (USD) 🇺🇸', my: 'အမေရိကန်ဒေါ်လာ (USD) 🇺🇸', km: 'ដុល្លារអាមេរិក (USD) 🇺🇸' },
  EUR: { th: 'ยูโร (EUR) 🇪🇺', en: 'Euro (EUR) 🇪🇺', lo: 'ເອີໂຣ (EUR) 🇪🇺', my: 'ယူရို (EUR) 🇪🇺', km: 'អឺរ៉ូ (EUR) 🇪🇺' },
  GBP: { th: 'ปอนด์สเตอร์ลิง (GBP) 🇬🇧', en: 'British Pound (GBP) 🇬🇧', lo: 'ປອນສະเตີລິງ (GBP) 🇬🇧', my: 'ဗြိတိသျှပေါင် (GBP) 🇬🇧', km: 'ផោនស្ទឺលីង (GBP) 🇬🇧' },
  AUD: { th: 'ดอลลาร์ออสเตรเลีย (AUD) 🇦🇺', en: 'Australian Dollar (AUD) 🇦🇺', lo: 'ໂດລາອົດສະຕຣາລີ (AUD) 🇦🇺', my: 'ဩစတြေးလျဒေါ်လာ (AUD) 🇦🇺', km: 'ដុល្លារអូស្ត្រាលី (AUD) 🇦🇺' },
  JPY: { th: 'เยนญี่ปุ่น (JPY) 🇯🇵', en: 'Japanese Yen (JPY) 🇯🇵', lo: 'ເຢນຍີ່ປຸ່ນ (JPY) 🇯🇵', my: 'ဂျပန်ယန်း (JPY) 🇯🇵', km: 'យ៉េนជប៉ុន (JPY) 🇯🇵' },
  KRW: { th: 'วอนเกาหลีใต้ (KRW) 🇰🇷', en: 'South Korean Won (KRW) 🇰🇷', lo: 'ວອນເກົາຫຼີໃຕ້ (KRW) 🇰🇷', my: 'တောင်ကိုရီးယားဝမ် (KRW) 🇰🇷', km: 'វ៉ុនកូរ៉េខាងត្បូង (KRW) 🇰🇷' },
  SGD: { th: 'ดอลลาร์สิงคโปร์ (SGD) 🇸🇬', en: 'Singapore Dollar (SGD) 🇸🇬', lo: 'ໂດລາສິງກະໂປ (SGD) 🇸🇬', my: 'စင်ကာပူဒေါ်လာ (SGD) 🇸🇬', km: 'ដុល្លារសិង្ហបុរី (SGD) 🇸🇬' },
  MYR: { th: 'ริงกิตมาเลเซีย (MYR) 🇲🇾', en: 'Malaysian Ringgit (MYR) 🇲🇾', lo: 'ຣິງກິດມາເລເຊຍ (MYR) 🇲🇾', my: 'မလေးရှားရင်းဂစ် (MYR) 🇲🇾', km: 'រីងហ្គីតម៉ាឡេស៊ី (MYR) 🇲🇾' },
  CNY: { th: 'หยวนจีน (CNY) 🇨🇳', en: 'Chinese Yuan (CNY) 🇨🇳', lo: 'ຢວນຈີນ (CNY) 🇨🇳', my: 'တရုတ်ယွမ် (CNY) 🇨🇳', km: 'យន់ចិន (CNY) 🇨🇳' },
  LAK: { th: 'กีบลาว (LAK) 🇱🇦', en: 'Lao Kip (LAK) 🇱🇦', lo: 'ກີບລາວ (LAK) 🇱🇦', my: 'လာအိုကစ် (LAK) 🇱🇦', km: 'គីបឡាវ (LAK) 🇱🇦' },
  MMK: { th: 'จ๊าดเมียนมา (MMK) 🇲🇲', en: 'Myanmar Kyat (MMK) 🇲🇲', lo: 'ຈາດມຽນມາ (MMK) 🇲🇲', my: 'မြန်မာကျပ် (MMK) 🇲🇲', km: 'គ្យատមីយ៉ាន់ម៉า (MMK) 🇲🇲' },
  KHR: { th: 'เรียลกัมพูชา (KHR) 🇰🇭', en: 'Cambodian Riel (KHR) 🇰🇭', lo: 'ຣຽວກຳປູເຈຍ (KHR) 🇰🇭', my: 'ကမ္ဘောဒီးယားရီရယ် (KHR) 🇰🇭', km: 'រៀលកម្ពុជា (KHR) 🇰🇭' },
  PHP: { th: 'เปโซฟิลิปปินส์ (PHP) 🇵🇭', en: 'Philippine Peso (PHP) 🇵🇭', lo: 'ເປໂຊຟິລິບປິນ (PHP) 🇵🇭', my: 'ဖိလစ်ပိုင်ပီဆို (PHP) 🇵🇭', km: 'ប៉េសូហ្វីលីពីន (PHP) 🇵🇭' },
  IDR: { th: 'รูเปียห์อินโดนีเซีย (IDR) 🇮🇩', en: 'Indonesian Rupiah (IDR) 🇮🇩', lo: 'ຣູເປຍອິນໂດເນເຊຍ (IDR) 🇮🇩', my: 'အင်ဒိုနီးရှားရူပီးယား (IDR) 🇮🇩', km: 'រូពៀឥណ្ឌូនេស៊ី (IDR) 🇮🇩' },
  VND: { th: 'ดองเวียดนาม (VND) 🇻🇳', en: 'Vietnamese Dong (VND) 🇻🇳', lo: 'ດົງຫວຽດນາມ (VND) 🇻🇳', my: 'ဗီယက်နမ်ဒေါင် (VND) 🇻🇳', km: 'ដុងវៀតណាម (VND) 🇻🇳' }
}

const CURRENCY_SHORTS: Record<string, string> = {
  USD: '🇺🇸 USD',
  EUR: '🇪🇺 EUR',
  GBP: '🇬🇧 GBP',
  AUD: '🇦🇺 AUD',
  JPY: '🇯🇵 JPY',
  KRW: '🇰🇷 KRW',
  SGD: '🇸🇬 SGD',
  MYR: '🇲🇾 MYR',
  CNY: '🇨🇳 CNY',
  LAK: '🇱🇦 LAK',
  MMK: '🇲🇲 MMK',
  KHR: '🇰🇭 KHR',
  PHP: '🇵🇭 PHP',
  IDR: '🇮🇩 IDR',
  VND: '🇻🇳 VND'
}

interface RemittanceToolProps {
  lang: string
  rates: Record<string, number>
  initialHistory: HistoricalPoint[]
  initialCorridor: string
}

export function RemittanceTool({ lang, rates, initialHistory, initialCorridor }: RemittanceToolProps) {
  const [amount, setAmount] = useState<number>(10000)
  const [corridor, setCorridor] = useState<string>(initialCorridor)
  const [chartHistory, setChartHistory] = useState<HistoricalPoint[]>(initialHistory)
  const [chartLoading, setChartLoading] = useState(false)

  const labels = LABELS[lang] || LABELS.en
  const midMarketRate = rates[corridor] || 1
  const locale = lang === 'th' ? 'th-TH' : 'en-US'
  const isDecimalCurrency = ['USD', 'EUR', 'GBP', 'AUD', 'SGD', 'MYR'].includes(corridor)
  const rateFractionDigits = midMarketRate >= 100 ? 2 : midMarketRate >= 1 ? 4 : 6

  // useEffect to fetch history dynamically when corridor changes
  useEffect(() => {
    let active = true
    const fetchHistory = async () => {
      setChartLoading(true)
      try {
        const res = await fetch(`/api/history?base=THB&quote=${corridor}&days=365`)
        if (res.ok) {
          const data = await res.json()
          if (active) {
            setChartHistory(data)
          }
        }
      } catch (err) {
        console.error('Failed to fetch remittance history:', err)
      } finally {
        if (active) {
          setChartLoading(false)
        }
      }
    }

    if (corridor !== initialCorridor) {
      fetchHistory()
    } else {
      setChartHistory(initialHistory)
    }

    return () => {
      active = false
    }
  }, [corridor, initialCorridor, initialHistory])

  // Filter and calculate for supported providers
  const results = PROVIDERS.filter(p => p.supportedCorridors.includes(corridor)).map(p => {
    const fee = p.feeType === 'flat' ? p.feeVal : amount * p.feeVal
    const retailRate = midMarketRate * (1 - p.margin)
    const netTHB = Math.max(0, amount - fee)
    const receivedAmount = netTHB * retailRate

    return {
      ...p,
      fee,
      retailRate,
      receivedAmount
    }
  })

  let maxReceivedId = ''
  let maxReceivedAmount = -1
  results.forEach(r => {
    if (r.receivedAmount > maxReceivedAmount && r.receivedAmount > 0) {
      maxReceivedAmount = r.receivedAmount
      maxReceivedId = r.id
    }
  })

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    if (!isNaN(val)) {
      setAmount(val)
    } else {
      setAmount(0)
    }
  }

  return (
    <div className={styles.toolContainer}>
      <div className={styles.toolControlGrid}>
        <div className={styles.toolField}>
          <label className={styles.toolLabel}>{labels.amountLabel}</label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputPrefix}>฿</span>
            <input
              type="number"
              value={amount === 0 ? '' : amount}
              onChange={handleAmountChange}
              className={styles.toolInput}
              min="100"
              placeholder="10000"
            />
          </div>
        </div>

        <div className={styles.toolField}>
          <label className={styles.toolLabel}>{labels.destLabel}</label>
          <div className={styles.tabGrid}>
            {Object.keys(CURRENCY_SHORTS).map(curr => (
              <button
                key={curr}
                type="button"
                onClick={() => setCorridor(curr)}
                className={`${styles.tabBtn} ${corridor === curr ? styles.tabBtnActive : ''}`}
                title={CURRENCY_NAMES[curr]?.[lang] || curr}
                aria-label={CURRENCY_NAMES[curr]?.[lang] || curr}
              >
                {CURRENCY_SHORTS[curr]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.comparisonTable}>
          <thead>
            <tr>
              <th className={styles.th}>{labels.providerCol}</th>
              <th className={styles.th}>{labels.feeCol}</th>
              <th className={styles.th}>{labels.rateCol}</th>
              <th className={styles.th}>{labels.receivedCol}</th>
              <th className={styles.th}>{labels.speedCol}</th>
              <th className={styles.th}>{labels.linkCol}</th>
            </tr>
          </thead>
          <tbody>
            {results.map(row => {
              const isBest = row.id === maxReceivedId && amount > 0
              return (
                <tr
                  key={row.id}
                  className={`${styles.tr} ${isBest ? styles.bestValueRow : ''}`}
                >
                  <td className={styles.td}>
                    <div className={styles.providerInfoWrapper}>
                      <div
                        className={styles.providerAvatar}
                        style={{ backgroundColor: row.logoColor }}
                      >
                        {row.logoText}
                      </div>
                      <div className={styles.providerNameContainer}>
                        <div className={styles.providerNameRow}>
                          <span className={styles.providerName}>{row.name}</span>
                          {row.sponsor && (
                            <span className={styles.sponsoredBadge}>{labels.sponsoredTag}</span>
                          )}
                        </div>
                        {isBest && (
                          <span className={styles.bestValueBadge}>{labels.bestValueTag}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className={styles.td}>
                    <span className={styles.numCell}>
                      {row.fee.toLocaleString(locale, { maximumFractionDigits: 2 })} THB
                    </span>
                  </td>

                  <td className={styles.td}>
                    <span className={styles.numCell}>
                      1 THB = {row.retailRate.toLocaleString(locale, { maximumFractionDigits: rateFractionDigits })} {corridor}
                    </span>
                  </td>

                  <td className={styles.td}>
                    <span className={isBest ? styles.bestReceivedVal : styles.numCell}>
                      {row.receivedAmount.toLocaleString(locale, {
                        maximumFractionDigits: isDecimalCurrency ? 2 : 0
                      })}{' '}
                      {corridor}
                    </span>
                  </td>

                  <td className={styles.td}>{row.speed[lang] || row.speed.en}</td>

                  <td className={styles.td}>
                    <a
                      href={row.url}
                      target="_blank"
                      rel={row.sponsor ? 'sponsored noopener noreferrer' : 'nofollow noopener noreferrer'}
                      className={styles.tblLink}
                    >
                      {lang === 'th' ? 'โอนเงิน' : 'Send'} ➔
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className={styles.toolNote}>
        * {labels.noteText} (Mid-market: 1 THB = {midMarketRate.toLocaleString(locale, { maximumFractionDigits: rateFractionDigits })} {corridor})
      </p>

      {/* Historical Trend Chart for the Corridor */}
      {chartHistory && chartHistory.length > 0 && (
        <div style={{ marginTop: '32px', position: 'relative' }}>
          {chartLoading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(248, 250, 252, 0.4)',
              backdropFilter: 'blur(1px)',
              borderRadius: '8px',
              zIndex: 10
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-elevated, #ffffff)',
                border: '1px solid var(--border, rgba(148, 163, 184, 0.2))',
                padding: '8px 16px',
                borderRadius: '30px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                fontWeight: 600,
                fontSize: '0.88rem',
                color: 'var(--ink)'
              }}>
                <div className={styles.loadingSpinner} style={{ width: '14px', height: '14px', margin: 0 }}></div>
                <span>{lang === 'th' ? 'กำลังดึงข้อมูล...' : 'Loading...'}</span>
              </div>
            </div>
          )}
          <div className={pairStyles.chartHeader} style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.24rem', fontWeight: 700, color: 'var(--ink)' }}>
              {lang === 'th' ? `กราฟประวัติอัตราแลกเปลี่ยน THB/${corridor} ย้อนหลัง`
               : lang === 'en' ? `THB/${corridor} Exchange Rate Trend`
               : lang === 'lo' ? `ແນວໂນ້ມອັດຕາແລກປ່ຽນ THB/${corridor}`
               : lang === 'my' ? `THB/${corridor} ငွေလဲနှုန်းပြောင်းလဲမှုဇယား`
               : `គំនូសតាងអត្រាប្តូរប្រាក់ THB/${corridor}`}
            </h3>
            <div className={pairStyles.chartSub}>
              {lang === 'th' ? `ข้อมูลการเคลื่อนไหวของเงินบาท (THB) เทียบกับ ${corridor} เพื่อการประเมินเวลาโอนเงินที่ดีที่สุด`
               : lang === 'en' ? `Value fluctuations of THB against ${corridor} to determine the best transfer timing.`
               : lang === 'lo' ? `ການເຫນັງຕີງຂອງເງິນບາດ (THB) ທຽບກັບ ${corridor} ເພື່ອຫາເວລາໂອນເງິນທີ່ດີທີ່ສຸດ`
               : lang === 'my' ? `ငွေလွှဲရန် အကောင်းဆုံးအချိန်ကို ရွေးချယ်နိုင်ရန် THB နှင့် ${corridor} ပြသချက်`
               : `ការប្រែប្រួលតម្លៃប្រាក់បាត (THB) ធៀបនឹង ${corridor} ដើម្បីវายតម្លៃពេលវេលាផ្ទេរប្រាក់ល្អបំផុត`}
            </div>
          </div>
          <InteractiveChart history={chartHistory} lang={lang} baseSymbol="THB" quoteSymbol={corridor} />
        </div>
      )}
    </div>
  )
}
