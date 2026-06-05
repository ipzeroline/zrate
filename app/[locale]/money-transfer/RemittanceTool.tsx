'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import styles from './money-transfer.module.css'

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
  supportedCorridors: string[] // ['LAK', 'MMK', 'KHR']
}

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
    supportedCorridors: ['LAK', 'MMK', 'KHR']
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
    supportedCorridors: ['LAK', 'MMK', 'KHR']
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
    supportedCorridors: ['LAK', 'MMK', 'KHR']
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
    supportedCorridors: ['LAK', 'MMK', 'KHR']
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
    destLabel: 'ประเทศปลายทาง',
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
    destLabel: 'Destination Country',
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
    destLabel: 'ປະເທດປາຍທາງ',
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
    destLabel: 'လက်ခံမည့်နိုင်ငံ',
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
    destLabel: 'ប្រទេសគោលដៅ',
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
  LAK: { th: 'กีบลาว (LAK) 🇱🇦', en: 'Lao Kip (LAK) 🇱🇦', lo: 'ກີບລາວ (LAK) 🇱🇦', my: 'လာအိုကစ် (LAK) 🇱🇦', km: 'គីបឡាវ (LAK) 🇱🇦' },
  MMK: { th: 'จ๊าดเมียนมา (MMK) 🇲🇲', en: 'Myanmar Kyat (MMK) 🇲🇲', lo: 'ຈາດມຽນມາ (MMK) 🇲🇲', my: 'မြန်မာကျပ် (MMK) 🇲🇲', km: 'គ្យատមីយ៉ាន់ម៉ា (MMK) 🇲🇲' },
  KHR: { th: 'เรียลกัมพูชา (KHR) 🇰🇭', en: 'Cambodian Riel (KHR) 🇰🇭', lo: 'ຣຽວກຳປູເຈຍ (KHR) 🇰🇭', my: 'ကမ္ဘောဒီးယားရီရယ် (KHR) 🇰🇭', km: 'រៀលកម្ពុជា (KHR) 🇰🇭' }
}

const CURRENCY_SHORTS: Record<string, string> = {
  LAK: '🇱🇦 LAK',
  MMK: '🇲🇲 MMK',
  KHR: '🇰🇭 KHR'
}

interface RemittanceToolProps {
  lang: string
  rates: Record<string, number>
}

export function RemittanceTool({ lang, rates }: RemittanceToolProps) {
  const [amount, setAmount] = useState<number>(10000)
  const [corridor, setCorridor] = useState<string>('LAK')

  const labels = LABELS[lang] || LABELS.en
  const midMarketRate = rates[corridor] || (corridor === 'LAK' ? 640 : corridor === 'MMK' ? 98 : 115)

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
            {['LAK', 'MMK', 'KHR'].map(curr => (
              <button
                key={curr}
                type="button"
                onClick={() => setCorridor(curr)}
                className={`${styles.tabBtn} ${corridor === curr ? styles.tabBtnActive : ''}`}
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
                      {row.fee.toLocaleString(lang === 'th' ? 'th-TH' : 'en-US', { maximumFractionDigits: 2 })} THB
                    </span>
                  </td>

                  <td className={styles.td}>
                    <span className={styles.numCell}>
                      1 THB = {row.retailRate.toLocaleString(lang === 'th' ? 'th-TH' : 'en-US', { maximumFractionDigits: 4 })} {corridor}
                    </span>
                  </td>

                  <td className={styles.td}>
                    <span className={isBest ? styles.bestReceivedVal : styles.numCell}>
                      {row.receivedAmount.toLocaleString(lang === 'th' ? 'th-TH' : 'en-US', {
                        maximumFractionDigits: 0
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
        * {labels.noteText} (Mid-market: 1 THB = {midMarketRate.toFixed(2)} {corridor})
      </p>
    </div>
  )
}
