'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { LanguageCode, localizePath } from '../../../lib/siteNavigation'
import styles from './money-transfer.module.css'

interface CountryGuideItem {
  country: string
  flag: string
  pair: string
  text: string
  channels: string
}

interface RemittanceGuidesProps {
  lang: LanguageCode
  initialGuides: CountryGuideItem[]
}

interface AdditionalCountryMeta {
  code: string
  flag: string
  names: Record<LanguageCode, string>
  channels: Record<LanguageCode, string>
}

const ADDITIONAL_COUNTRIES: AdditionalCountryMeta[] = [
  { code: 'KRW', flag: '🇰🇷', names: { th: 'เกาหลีใต้', en: 'South Korea', lo: 'ເກົາຫຼີໃຕ້', my: 'တောင်ကိုရီးယား', km: 'កូរ៉េខាងត្បូង' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'HKD', flag: '🇭🇰', names: { th: 'ฮ่องกง', en: 'Hong Kong', lo: 'ຮົງກົງ', my: 'ဟောင်ကောင်', km: 'ហុងកុង' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'CAD', flag: '🇨🇦', names: { th: 'แคนาดา', en: 'Canada', lo: 'ແຄນາດา', my: 'ကနေဒါ', km: 'កាណាដា' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'CHF', flag: '🇨🇭', names: { th: 'สวิตเซอร์แลนด์', en: 'Switzerland', lo: 'ສະວິດເຊີແລນ', my: 'ဆွစ်ဇာလန်', km: 'ស្វីស' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'NZD', flag: '🇳🇿', names: { th: 'นิวซีแลนด์', en: 'New Zealand', lo: 'ນິວຊີແລນ', my: 'နယူးဇီလန်', km: 'នូវែលសេឡង់' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'SEK', flag: '🇸🇪', names: { th: 'สวีเดน', en: 'Sweden', lo: 'ສະວີເດນ', my: 'ဆွီဒင်', km: 'ស៊ុយអែត' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'NOK', flag: '🇳🇴', names: { th: 'นอร์เวย์', en: 'Norway', lo: 'ນໍເວ', my: 'နော်ဝေ', km: 'ន័រវែស' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'DKK', flag: '🇩🇰', names: { th: 'เดนมาร์ก', en: 'Denmark', lo: 'ເດນມາກ', my: 'ဒိန်းမတ်', km: 'ដាណឺម៉ាក' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'INR', flag: '🇮🇳', names: { th: 'อินเดีย', en: 'India', lo: 'ອິນເດຍ', my: 'အိန္ဒိယ', km: 'ឥណ្ឌា' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'IDR', flag: '🇮🇩', names: { th: 'อินโดนีเซีย', en: 'Indonesia', lo: 'ອິນໂດເນເຊຍ', my: 'အင်ဒိုနီးရှား', km: 'ឥណ្ឌូនេស៊ី' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'MYR', flag: '🇲🇾', names: { th: 'มาเลเซีย', en: 'Malaysia', lo: 'ມາເລເຊຍ', my: 'မလေးရှား', km: 'ម៉ាឡេស៊ី' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'PHP', flag: '🇵🇭', names: { th: 'ฟิลิปปินส์', en: 'Philippines', lo: 'ຟີລິບປິນ', my: 'ဖိလစ်ပိုင်', km: 'ហ្វីលីពីន' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'VND', flag: '🇻🇳', names: { th: 'เวียดนาม', en: 'Vietnam', lo: 'ຫວຽດນາມ', my: 'ဗီယက်နမ်', km: 'វៀតណាម' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'TWD', flag: '🇹🇼', names: { th: 'ไต้หวัน', en: 'Taiwan', lo: 'ໄຕ້ຫວັນ', my: 'ထိုင်ဝမ်', km: 'តៃវ៉ាន់' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'BRL', flag: '🇧🇷', names: { th: 'บราซิล', en: 'Brazil', lo: 'ບຣາຊິນ', my: 'ဘရာဇီး', km: 'ប្រេស៊ីល' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'MXN', flag: '🇲🇽', names: { th: 'เม็กซิโก', en: 'Mexico', lo: 'ເມັກຊິໂກ', my: 'မက္ကဆီကို', km: 'ម៉ិកស៊ិក' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'ZAR', flag: '🇿🇦', names: { th: 'แอฟริกาใต้', en: 'South Africa', lo: 'ອາຟຣິກາໃຕ້', my: 'တောင်အာဖရိက', km: 'អាហ្វ្រិកខាងត្បូង' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'RUB', flag: '🇷🇺', names: { th: 'รัสเซีย', en: 'Russia', lo: 'ລັດເຊຍ', my: 'ရုရှား', km: 'រុស្ស៊ី' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'TRY', flag: '🇹🇷', names: { th: 'ตุรกี', en: 'Turkey', lo: 'ຕວກກີ', my: 'တူရကီ', km: 'តួកគី' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'SAR', flag: '🇸🇦', names: { th: 'ซาอุดีอาระเบีย', en: 'Saudi Arabia', lo: 'ຊາອຸດີອາຣາບີ', my: 'ဆော်ဒီအာရေဗျ', km: 'អារ៉ាប៊ីសាអូឌីត' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'AED', flag: '🇦🇪', names: { th: 'สหรัฐอาหรับเอมิเรตส์', en: 'United Arab Emirates', lo: 'ສະຫະລັດອາຣັບເອມິເຣດ', my: 'ယူအေအီး', km: 'អេមីរ៉ាតអារ៉ាប់រួម' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'PLN', flag: '🇵🇱', names: { th: 'โปแลนด์', en: 'Poland', lo: 'ໂປແລນ', my: 'ပိုလန်', km: 'ប៉ូឡូញ' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'CZK', flag: '🇨🇿', names: { th: 'สาธารณรัฐเช็ก', en: 'Czech Republic', lo: 'ສາທາລະນະລັດເຊັກ', my: 'ချက်သမ္မတနိုင်ငံ', km: 'សាធារណរដ្ឋឆែក' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'HUF', flag: '🇭🇺', names: { th: 'ฮังการี', en: 'Hungary', lo: 'ຮັງກາຣີ', my: 'ဟန်ဂေရီ', km: 'ហុងគ្រី' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'ILS', flag: '🇮🇱', names: { th: 'อิสราเอล', en: 'Israel', lo: 'ອິດສະຣາແອນ', my: 'အစ္စရေး', km: 'អ៊ីស្រាអែល' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'PKR', flag: '🇵🇰', names: { th: 'ปากีสถาน', en: 'Pakistan', lo: 'ປາກີສະຖານ', my: 'ပါကစ္စတန်', km: 'ប៉ាគីស្ថាន' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'EGP', flag: '🇪🇬', names: { th: 'อียิปต์', en: 'Egypt', lo: 'ອີຢິບ', my: 'အီဂျစ်', km: 'អេស៊ីប' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
  { code: 'NGN', flag: '🇳🇬', names: { th: 'ไนจีเรีย', en: 'Nigeria', lo: 'ໄນຈີເລຍ', my: 'နိုင်ဂျီးရီးယား', km: 'នីហ្សេរីយ៉ា' }, channels: { th: 'Wise, SWIFT, Western Union', en: 'Wise, SWIFT, Western Union', lo: 'Wise, SWIFT, Western Union', my: 'Wise, SWIFT, Western Union', km: 'Wise, SWIFT, Western Union' } },
]

function getGeneratedText(lang: LanguageCode, countryName: string, code: string): string {
  switch (lang) {
    case 'th':
      return `การส่งเงินจากไทยไปยัง ${countryName} (${code}) สามารถโอนออนไลน์ได้อย่างสะดวกและคุ้มค่าด้วยช่องทางดิจิทัล เช่น Wise หรือระบบโอนเงินต่างประเทศ (Outward Remittance) ของธนาคารพาณิชย์หลัก สำหรับยอดเงินโอนขนาดเล็กและขนาดกลาง บริการทางการเงินออนไลน์จะช่วยประหยัดค่าธรรมเนียมและให้เรทแลกเปลี่ยนที่ดีกว่า`
    case 'en':
      return `Sending money from Thailand to ${countryName} (${code}) is highly efficient and secure via digital remittance services like Wise or traditional outbound bank wires (SWIFT). For personal or standard remittances, choosing an online provider helps you avoid high exchange rate margins.`
    case 'lo':
      return `ການໂອນເງິນຈາກໄທໄປ ${countryName} (${code}) ແມ່ນມີຄວາມສະດວກ ແລະ ປອດໄພ ຜ່ານຊ່ອງທາງອອນລາຍ ເຊັ່ນ Wise ຫຼື ບໍລິການໂອນເງິນຕ່າງປະເທດຂອງທະນາຄານພານິດ, ເຊິ່ງໃຫ້ເຣດແລກປ່ຽນທີ່ດີກວ່າ.`
    case 'my':
      return `ထိုင်းနိုင်ငံမှ ${countryName} (${code}) သို့ ငွေလွှဲရာတွင် Wise ကဲ့သို့သော အွန်လိုင်းစနစ်များ သို့မဟုတ် ဘဏ်များမှတစ်ဆင့် လွယ်ကူစွာ လွှဲနိုင်ပြီး၊ အွန်လိုင်းစနစ်များသည် ဝန်ဆောင်ခပိုမိုသက်သာကာ ငွေလဲနှုန်းပိုမိုကောင်းမွန်စေပါသည်။`
    case 'km':
      return `ការផ្ទេរប្រាក់ពីថៃទៅ ${countryName} (${code}) មានភាពងាយស្រួល និងសុវត្ថិភាពខ្ពស់តាមរយៈកម្មវិធីផ្ទេរប្រាក់ឌីជីថលដូចជា Wise ឬការផ្ទេរតាមធនាគារពាណិជ្ជ។ ការផ្ទេរតាមអនឡាញជួយសន្សំសំចៃថ្លៃសេវា និងទទួលបានអត្រាល្អ។`
    default:
      return `Sending money from Thailand to ${countryName} (${code}) is best done via online digital channels to get optimal exchange rates.`
  }
}

const BUTTON_LABELS = {
  th: { more: 'ดูประเทศอื่นๆ ทั่วโลก (ดูทั้งหมด)', less: 'แสดงน้อยลง' },
  en: { more: 'See More Global Destinations', less: 'Show Less' },
  lo: { more: 'ເບິ່ງປະເທດອື່ນໆທົ່ວໂລກ (ທັງໝົດ)', less: 'ສະແດງໜ້ອຍລົງ' },
  my: { more: 'အခြားကမ္ဘာ့နိုင်ငံများကိုကြည့်ရန် (အားလုံး)', less: 'လျှော့ပြရန်' },
  km: { more: 'មើលប្រទេសផ្សេងទៀតជុំវិញពិភពលោក (ទាំងអស់)', less: 'បង្ហាញតិចជាងមុន' },
}

export function RemittanceGuides({ lang, initialGuides }: RemittanceGuidesProps) {
  const [showAll, setShowAll] = useState(false)

  // Map the additional currencies dynamically into the guide structure
  const additionalGuides: CountryGuideItem[] = ADDITIONAL_COUNTRIES.map(meta => {
    const countryName = meta.names[lang] || meta.names.en
    
    let pairCode = `THB/${meta.code}`
    if (meta.code === 'EUR' || meta.code === 'GBP' || meta.code === 'AUD') {
      pairCode = `${meta.code}/THB`
    }
    
    return {
      country: `${countryName} (Thailand to ${meta.names.en})`,
      flag: meta.flag,
      pair: pairCode,
      text: getGeneratedText(lang, countryName, meta.code),
      channels: `${lang === 'th' ? 'ช่องทางหลัก' : 'Primary Channels'}: ${meta.channels[lang] || meta.channels.en}`
    }
  })

  const displayedGuides = showAll ? [...initialGuides, ...additionalGuides] : initialGuides
  const labels = BUTTON_LABELS[lang] || BUTTON_LABELS.th

  return (
    <div>
      <div className={styles.guidesContainer}>
        {displayedGuides.map((guide, idx) => {
          const slug = guide.pair.toLowerCase().replace('/', '-')
          return (
            <div key={idx} className={styles.guideDetailCard}>
              <div className={styles.guideDetailHeader}>
                <h3 className={styles.guideDetailTitle}>
                  <span>{guide.flag}</span>
                  <span>{guide.country}</span>
                </h3>
                <Link href={localizePath(lang, `/${slug}`)} className={styles.liveRateLink}>
                  {lang === 'th' ? `ดูเรท ${guide.pair} ล่าสุด` : `Check Live ${guide.pair} Rate`} ➔
                </Link>
              </div>
              <p className={styles.guideDetailText}>{guide.text}</p>
              <div className={styles.guideDetailChannels}>
                {guide.channels}
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => setShowAll(!showAll)}
        className={styles.seeMoreBtn}
      >
        {showAll ? labels.less : labels.more}
      </button>
    </div>
  )
}
