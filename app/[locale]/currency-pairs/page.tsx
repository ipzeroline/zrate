import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '../../components/Footer'
import { SeoNav } from '../../components/SeoNav'
import { Header } from '../../components/Header'
import { AdSection } from '../../components/AdsterraAds'
import { HUB_TEXT } from '../../../lib/hubContent'
import {
  LanguageCode,
  LOCALES,
  PAIRS,
  PAIR_LABELS,
  SITE_URL,
  localizePath,
  REGIONAL_PAIRS
} from '../../../lib/siteNavigation'
import { PairsDirectory } from './PairsDirectory'
import styles from './currency-pairs.module.css'

const PAGE_KEY = 'pairs'
const PATH = '/currency-pairs'

const BREADCRUMBS: Record<LanguageCode, { home: string; current: string }> = {
  th: { home: 'หน้าแรก', current: 'คู่เงินทั้งหมด' },
  en: { home: 'Home', current: 'All Currency Pairs' },
  lo: { home: 'ໜ້າຫຼັກ', current: 'ຄູ່ເງິນທັງໝົດ' },
  my: { home: 'ပင်မစာမျက်နှာ', current: 'ငွေကြေးအတွဲအားလုံး' },
  km: { home: 'ទំព័រដើម', current: 'គូរូបិយប័ណ្ណទាំងអស់' },
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

interface CurrencyInfoItem {
  code: string
  flag: string
  name: string
  country: string
  type: string
  classType: 'major' | 'regional' | 'stablecoin'
}

interface SeoCard {
  title: string
  body: string
}

interface FaqItem {
  question: string
  answer: string
}

interface PageSeoContent {
  stats: Array<{ label: string; value: string }>
  popularHeading: string
  popularIntro: string
  popularPairs: string[]
  guideHeading: string
  guideIntro: string
  guideCards: SeoCard[]
  trustHeading: string
  trustItems: SeoCard[]
  faqHeading: string
  faqs: FaqItem[]
}

const CURRENCY_INFO_LIST: Record<LanguageCode, CurrencyInfoItem[]> = {
  th: [
    { code: 'USD', flag: '🇺🇸', name: 'ดอลลาร์สหรัฐ', country: 'สหรัฐอเมริกา', type: 'สกุลเงินหลักสากล (Major)', classType: 'major' },
    { code: 'THB', flag: '🇹🇭', name: 'บาทไทย', country: 'ประเทศไทย', type: 'สกุลเงินอ้างอิงภูมิภาค (Regional)', classType: 'regional' },
    { code: 'LAK', flag: '🇱🇦', name: 'กีบลาว', country: 'ประเทศลาว', type: 'สกุลเงินภูมิภาคอาเซียน', classType: 'regional' },
    { code: 'MMK', flag: '🇲🇲', name: 'จ๊าดเมียนมา', country: 'ประเทศเมียนมา', type: 'สกุลเงินภูมิภาคอาเซียน', classType: 'regional' },
    { code: 'KHR', flag: '🇰🇭', name: 'เรียลกัมพูชา', country: 'ประเทศกัมพูชา', type: 'สกุลเงินภูมิภาคอาเซียน', classType: 'regional' },
    { code: 'EUR', flag: '🇪🇺', name: 'ยูโร', country: 'สหภาพยุโรป', type: 'สกุลเงินหลักสากล (Major)', classType: 'major' },
    { code: 'JPY', flag: '🇯🇵', name: 'เยนญี่ปุ่น', country: 'ประเทศญี่ปุ่น', type: 'สกุลเงินหลักสากล (Major)', classType: 'major' },
    { code: 'CNY', flag: '🇨🇳', name: 'หยวนจีน', country: 'ประเทศจีน', type: 'สกุลเงินหลักสากล (Major)', classType: 'major' },
    { code: 'SGD', flag: '🇸🇬', name: 'ดอลลาร์สิงคโปร์', country: 'ประเทศสิงคโปร์', type: 'สกุลเงินหลักสากล (Major)', classType: 'major' },
    { code: 'KRW', flag: '🇰🇷', name: 'วอนเกาหลีใต้', country: 'ประเทศเกาหลีใต้', type: 'สกุลเงินหลักสากล (Major)', classType: 'major' },
    { code: 'GBP', flag: '🇬🇧', name: 'ปอนด์สเตอร์ลิง', country: 'สหราชอาณาจักร', type: 'สกุลเงินหลักสากล (Major)', classType: 'major' },
    { code: 'AUD', flag: '🇦🇺', name: 'ดอลลาร์ออสเตรเลีย', country: 'ประเทศออสเตรเลีย', type: 'สกุลเงินหลักสากล (Major)', classType: 'major' },
    { code: 'CAD', flag: '🇨🇦', name: 'ดอลลาร์แคนาดา', country: 'ประเทศแคนาดา', type: 'สกุลเงินหลักสากล (Major)', classType: 'major' },
    { code: 'CHF', flag: '🇨🇭', name: 'ฟรังก์สวิส', country: 'ประเทศสวิตเซอร์แลนด์', type: 'สกุลเงินหลักสากล (Major)', classType: 'major' },
    { code: 'HKD', flag: '🇭🇰', name: 'ดอลลาร์ฮ่องกง', country: 'ฮ่องกง', type: 'สกุลเงินหลักสากล (Major)', classType: 'major' },
    { code: 'MYR', flag: '🇲🇾', name: 'ริงกิตมาเลเซีย', country: 'ประเทศมาเลเซีย', type: 'สกุลเงินภูมิภาคอาเซียน', classType: 'regional' },
    { code: 'VND', flag: '🇻🇳', name: 'ดงเวียดนาม', country: 'ประเทศเวียดนาม', type: 'สกุลเงินภูมิภาคอาเซียน', classType: 'regional' },
    { code: 'IDR', flag: '🇮🇩', name: 'รูเปียห์อินโดนีเซีย', country: 'ประเทศอินโดนีเซีย', type: 'สกุลเงินภูมิภาคอาเซียน', classType: 'regional' },
    { code: 'PHP', flag: '🇵🇭', name: 'เปโซฟิลิปปินส์', country: 'ประเทศฟิลิปปินส์', type: 'สกุลเงินภูมิภาคอาเซียน', classType: 'regional' },
    { code: 'INR', flag: '🇮🇳', name: 'รูปีอินเดีย', country: 'ประเทศอินเดีย', type: 'สกุลเงินหลักสากล (Major)', classType: 'major' },
    { code: 'USDT', flag: '🪙', name: 'Tether', country: 'สินทรัพย์ดิจิทัล', type: 'สเตเบิลคอยน์ (Stablecoin)', classType: 'stablecoin' },
  ],
  en: [
    { code: 'USD', flag: '🇺🇸', name: 'US Dollar', country: 'United States', type: 'Major Currency', classType: 'major' },
    { code: 'THB', flag: '🇹🇭', name: 'Thai Baht', country: 'Thailand', type: 'Regional Core Currency', classType: 'regional' },
    { code: 'LAK', flag: '🇱🇦', name: 'Lao Kip', country: 'Laos', type: 'ASEAN Regional Currency', classType: 'regional' },
    { code: 'MMK', flag: '🇲🇲', name: 'Myanmar Kyat', country: 'Myanmar', type: 'ASEAN Regional Currency', classType: 'regional' },
    { code: 'KHR', flag: '🇰🇭', name: 'Cambodian Riel', country: 'Cambodia', type: 'ASEAN Regional Currency', classType: 'regional' },
    { code: 'EUR', flag: '🇪🇺', name: 'Euro', country: 'Eurozone', type: 'Major Currency', classType: 'major' },
    { code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen', country: 'Japan', type: 'Major Currency', classType: 'major' },
    { code: 'CNY', flag: '🇨🇳', name: 'Chinese Yuan', country: 'China', type: 'Major Currency', classType: 'major' },
    { code: 'SGD', flag: '🇸🇬', name: 'Singapore Dollar', country: 'Singapore', type: 'Major Currency', classType: 'major' },
    { code: 'KRW', flag: '🇰🇷', name: 'South Korean Won', country: 'South Korea', type: 'Major Currency', classType: 'major' },
    { code: 'GBP', flag: '🇬🇧', name: 'British Pound', country: 'United Kingdom', type: 'Major Currency', classType: 'major' },
    { code: 'AUD', flag: '🇦🇺', name: 'Australian Dollar', country: 'Australia', type: 'Major Currency', classType: 'major' },
    { code: 'CAD', flag: '🇨🇦', name: 'Canadian Dollar', country: 'Canada', type: 'Major Currency', classType: 'major' },
    { code: 'CHF', flag: '🇨🇭', name: 'Swiss Franc', country: 'Switzerland', type: 'Major Currency', classType: 'major' },
    { code: 'HKD', flag: '🇭🇰', name: 'Hong Kong Dollar', country: 'Hong Kong', type: 'Major Currency', classType: 'major' },
    { code: 'MYR', flag: '🇲🇾', name: 'Malaysian Ringgit', country: 'Malaysia', type: 'ASEAN Regional Currency', classType: 'regional' },
    { code: 'VND', flag: '🇻🇳', name: 'Vietnamese Dong', country: 'Vietnam', type: 'ASEAN Regional Currency', classType: 'regional' },
    { code: 'IDR', flag: '🇮🇩', name: 'Indonesian Rupiah', country: 'Indonesia', type: 'ASEAN Regional Currency', classType: 'regional' },
    { code: 'PHP', flag: '🇵🇭', name: 'Philippine Peso', country: 'Philippines', type: 'ASEAN Regional Currency', classType: 'regional' },
    { code: 'INR', flag: '🇮🇳', name: 'Indian Rupee', country: 'India', type: 'Major Currency', classType: 'major' },
    { code: 'USDT', flag: '🪙', name: 'Tether', country: 'Digital Asset', type: 'Crypto Stablecoin', classType: 'stablecoin' },
  ],
  lo: [
    { code: 'USD', flag: '🇺🇸', name: 'ໂດລາສະຫະລັດ', country: 'ສະຫະລັດອາເມລິກາ', type: 'ສະກຸນເງິນຫຼັກສາກົນ', classType: 'major' },
    { code: 'THB', flag: '🇹🇭', name: 'ບາດໄທ', country: 'ປະເທດໄທ', type: 'ສະກຸນເງິນພາກພື້ນ', classType: 'regional' },
    { code: 'LAK', flag: '🇱🇦', name: 'ກີບລາວ', country: 'ປະເທດລາວ', type: 'ສະກຸນເງິນພາກພື້ນອາຊຽນ', classType: 'regional' },
    { code: 'MMK', flag: '🇲🇲', name: 'ຈາດມຽນມາ', country: 'ປະເທດມຽນມາ', type: 'ສະກຸນເງິນພາກພື້ນອາຊຽນ', classType: 'regional' },
    { code: 'KHR', flag: '🇰🇭', name: 'ຣຽວກຳປູເຈຍ', country: 'ປະເທດກຳປູເຈຍ', type: 'ສະກຸນເງິນພາກພື້ນອາຊຽນ', classType: 'regional' },
    { code: 'EUR', flag: '🇪🇺', name: 'ຢູໂຣ', country: 'ສະຫະພາບເອີຣົບ', type: 'ສະກຸນເງິນຫຼັກສາກົນ', classType: 'major' },
    { code: 'JPY', flag: '🇯🇵', name: 'ເຢນຍີປຸ່ນ', country: 'ປະເທດຍີ່ປ่ຸน', type: 'ສະກຸນເງິນຫຼັກສາກົນ', classType: 'major' },
    { code: 'CNY', flag: '🇨🇳', name: 'ຢວນຈີນ', country: 'ປະເທດຈີນ', type: 'ສະກຸນເງິນຫຼັກສາກົນ', classType: 'major' },
    { code: 'SGD', flag: '🇸🇬', name: 'ໂດລາສິງກະໂປ', country: 'ປະເທດສິງກະໂປ', type: 'ສະກຸນເງິນຫຼັກສາກົນ', classType: 'major' },
    { code: 'KRW', flag: '🇰🇷', name: 'ວອນເກົາຫຼີໃຕ້', country: 'ປະເທດເກົາຫຼີໃຕ້', type: 'ສະກຸນເງິນຫຼັກສາກົນ', classType: 'major' },
    { code: 'GBP', flag: '🇬🇧', name: 'ປອນສະເຕີລິງ', country: 'ສະຫະລາດຊະອານາຈັກ', type: 'ສະກຸນເງິນຫຼັກສາກົນ', classType: 'major' },
    { code: 'AUD', flag: '🇦🇺', name: 'ໂດລາອົດສະຕຣາລີ', country: 'ອົດສະຕຣາລີ', type: 'ສະກຸນເງິນຫຼັກສາກົນ', classType: 'major' },
    { code: 'CAD', flag: '🇨🇦', name: 'ໂດລາແຄນນາດາ', country: 'ແຄນນາດາ', type: 'ສະກຸນເງິນຫຼັກສາກົນ', classType: 'major' },
    { code: 'CHF', flag: '🇨🇭', name: 'ຟຣັງສະວິດ', country: 'ສະວິດເຊີແລນ', type: 'ສະກຸນເງິນຫຼັກສາກົນ', classType: 'major' },
    { code: 'HKD', flag: '🇭🇰', name: 'ໂດລາຮົງກົງ', country: 'ຮົງກົງ', type: 'ສະກຸນເງິນຫຼັກສາກົນ', classType: 'major' },
    { code: 'MYR', flag: '🇲🇾', name: 'ຣิงກິດມາເລເຊຍ', country: 'ມາເລເຊຍ', type: 'ສະກຸນເງິນພາກພື້ນອາຊຽນ', classType: 'regional' },
    { code: 'VND', flag: '🇻🇳', name: 'ດົງຫວຽດນາມ', country: 'ຫວຽดນາມ', type: 'ສະກຸນເງິນພາກພື້ນອາຊຽນ', classType: 'regional' },
    { code: 'IDR', flag: '🇮🇩', name: 'ຣູເປຍອިންໂດເນເຊຍ', country: 'ອິນໂດເນເຊຍ', type: 'ສະກຸນເງິນພາກພື້ນອາຊຽນ', classType: 'regional' },
    { code: 'PHP', flag: '🇵🇭', name: 'ເປໂຊຟີລິບປິນ', country: 'ຟີລິບປິນ', type: 'ສະກຸນເງິນພາກພື້ນອາຊຽນ', classType: 'regional' },
    { code: 'INR', flag: '🇮🇳', name: 'ຣູປີອިންເດຍ', country: 'ອິນເດຍ', type: 'ສະກຸນເງິນຫຼັກສາກົນ', classType: 'major' },
    { code: 'USDT', flag: '🪙', name: 'Tether', country: 'ສິນຊັບດິຈິຕອນ', type: 'ສະເຕເບີລຄອຍນ໌', classType: 'stablecoin' },
  ],
  my: [
    { code: 'USD', flag: '🇺🇸', name: 'အမေရိကန်ဒေါ်လာ', country: 'အမေရိကန်ပြည်ထောင်စု', type: 'အဓိက ကမ္ဘာ့ငွေကြေး', classType: 'major' },
    { code: 'THB', flag: '🇹🇭', name: 'ထိုင်းဘတ်', country: 'ထိုင်းနိုင်ငံ', type: 'ဒေသတွင်း အဓိကငွေကြေး', classType: 'regional' },
    { code: 'LAK', flag: '🇱🇦', name: 'လာအိုကစ်', country: 'လာအိုနိုင်ငံ', type: 'အာဆီယံ ဒေသတွင်းငွေကြေး', classType: 'regional' },
    { code: 'MMK', flag: '🇲🇲', name: 'မြန်မာကျပ်', country: 'မြန်မာနိုင်ငံ', type: 'အာဆီယံ ဒေသတွင်းငွေကြေး', classType: 'regional' },
    { code: 'KHR', flag: '🇰🇭', name: 'ကမ္ဘောဒီးယားရီရယ်', country: 'ကမ္ဘောဒီးယားနိုင်ငံ', type: 'အာဆီယံ ဒေသတွင်းငွေကြေး', classType: 'regional' },
    { code: 'EUR', flag: '🇪🇺', name: 'ယူရို', country: 'ဥရောပသမဂ္ဂ', type: 'အဓိက ကမ္ဘာ့ငွေကြေး', classType: 'major' },
    { code: 'JPY', flag: '🇯🇵', name: 'ဂျပန်ယန်း', country: 'ဂျပန်နိုင်ငံ', type: 'အဓိက ကမ္ဘာ့ငွေကြေး', classType: 'major' },
    { code: 'CNY', flag: '🇨🇳', name: 'တရုတ်ယွမ်', country: 'တရုတ်နိုင်ငံ', type: 'အဓိက ကမ္ဘာ့ငွေကြေး', classType: 'major' },
    { code: 'SGD', flag: '🇸🇬', name: 'စင်ကာပူဒေါ်လာ', country: 'စင်ကာပူနိုင်ငံ', type: 'အဓိက ကမ္ဘာ့ငွေကြေး', classType: 'major' },
    { code: 'KRW', flag: '🇰🇷', name: 'တောင်ကိုရီးယားဝမ်', country: 'တောင်ကိုရီးယားနိုင်ငံ', type: 'အဓိက ကမ္ဘာ့ငွေကြေး', classType: 'major' },
    { code: 'GBP', flag: '🇬🇧', name: 'ဗြိတိသျှပေါင်', country: 'ယူနိုက်တက်ကင်းဒမ်း', type: 'အဓိက ကမ္ဘာ့ငွေကြေး', classType: 'major' },
    { code: 'AUD', flag: '🇦🇺', name: 'ဩစတြေးလျဒေါ်လာ', country: 'ဩစတြေးလျ', type: 'အဓိက ကမ္ဘာ့ငွေကြေး', classType: 'major' },
    { code: 'CAD', flag: '🇨🇦', name: 'ကနေဒါဒေါ်လာ', country: 'ကနေဒါ', type: 'အဓိက ကမ္ဘာ့ငွေကြေး', classType: 'major' },
    { code: 'CHF', flag: '🇨🇭', name: 'ဆွတ်ဇာလန်ဖရန့်', country: 'ဆွတ်ဇာလန်', type: 'အဓိက ကမ္ဘာ့ငွေကြေး', classType: 'major' },
    { code: 'HKD', flag: '🇭🇰', name: 'ဟောင်ကောင်ဒေါ်လာ', country: 'ဟောင်ကောင်', type: 'အဓိက ကမ္ဘာ့ငွေကြေး', classType: 'major' },
    { code: 'MYR', flag: '🇲🇾', name: 'မလေးရှားရင်းဂစ်', country: 'မလေးရှား', type: 'အာဆီယံ ဒေသတွင်းငွေကြေး', classType: 'regional' },
    { code: 'VND', flag: '🇻🇳', name: 'ဗီယက်နမ်ဒေါင်', country: 'ဗီယက်နမ်', type: 'အာဆီယံ ဒေသတွင်းငွေကြေး', classType: 'regional' },
    { code: 'IDR', flag: '🇮🇩', name: 'အင်ဒိုနီးရှားရူပီးယား', country: 'အင်ဒိုနီးရှား', type: 'အာဆီယံ ဒေသတွင်းငွေကြေး', classType: 'regional' },
    { code: 'PHP', flag: '🇵🇭', name: 'ဖိလစ်ပိုင်ပီဆို', country: 'ဖိလစ်ပိုင်', type: 'အာဆီယံ ဒေသတွင်းငွေကြေး', classType: 'regional' },
    { code: 'INR', flag: '🇮🇳', name: 'အိန္ဒိယရူပီး', country: 'အိန္ဒိယ', type: 'အဓိက ကမ္ဘာ့ငွေကြေး', classType: 'major' },
    { code: 'USDT', flag: '🪙', name: 'Tether', country: 'ဒစ်ဂျစ်တယ်ပိုင်ဆိုင်မှု', type: 'Stablecoin', classType: 'stablecoin' },
  ],
  km: [
    { code: 'USD', flag: '🇺🇸', name: 'ដុល្លារអាមេរិក', country: 'សហរដ្ឋអាមេរិក', type: 'រូបិយប័ណ្ណសកលចម្បង', classType: 'major' },
    { code: 'THB', flag: '🇹🇭', name: 'បាតថៃ', country: 'ប្រទេសថៃ', type: 'រូបិយប័ណ្ណស្នូលតំបន់', classType: 'regional' },
    { code: 'LAK', flag: '🇱🇦', name: 'គីបឡាវ', country: 'ប្រទេសឡាវ', type: 'រូបិយប័ណ្ណតំបន់អាស៊ាន', classType: 'regional' },
    { code: 'MMK', flag: '🇲🇲', name: 'គ្យាតមីយ៉ាន់ម៉ា', country: 'ប្រទេសមីយ៉ាន់ម៉ា', type: 'រូបិយប័ណ្ណតំបន់អាស៊ាន', classType: 'regional' },
    { code: 'KHR', flag: '🇰🇭', name: 'រៀលកម្ពុជា', country: 'ប្រទេសកម្ពុជា', type: 'រូបិយប័ណ្ណតំបន់អាស៊ាន', classType: 'regional' },
    { code: 'EUR', flag: '🇪🇺', name: 'អឺរ៉ូ', country: 'សហភាពអឺរ៉ុប', type: 'រូបិយប័ណ្ណសកលចម្បង', classType: 'major' },
    { code: 'JPY', flag: '🇯🇵', name: 'យ៉េនជប៉ុន', country: 'ប្រទេសជប៉ុន', type: 'រូបិយប័ណ្ណសកលចម្បង', classType: 'major' },
    { code: 'CNY', flag: '🇨🇳', name: 'យន់ចិន', country: 'ប្រទេសចិន', type: 'រូបិយប័ណ្ណសកលចម្បង', classType: 'major' },
    { code: 'SGD', flag: '🇸🇬', name: 'ដុល្លារសិង្ហបុរី', country: 'ប្រទេសសិង្ហបុរី', type: 'រូបិយប័ណ្ណសកលចម្បង', classType: 'major' },
    { code: 'KRW', flag: '🇰🇷', name: 'វ៉ុនកូរេខាងត្បូង', country: 'ប្រទេសកូរ៉េខាងត្បូង', type: 'រូបិយប័ណ្ណសកលចម្បង', classType: 'major' },
    { code: 'GBP', flag: '🇬🇧', name: 'ផោនស្ទឺលីង', country: 'ចក្រភពអង់គ្លេស', type: 'រូបិយប័ណ្ណសកលចម្បង', classType: 'major' },
    { code: 'AUD', flag: '🇦🇺', name: 'ដុល្លារអូស្ត្រាលី', country: 'អូស្ត្រាលី', type: 'រូបិយប័ណ្ណសកលចម្បង', classType: 'major' },
    { code: 'CAD', flag: '🇨🇦', name: 'ដុល្លារកាណាដា', country: 'កាណាដា', type: 'រូបិយប័ណ្ណសកលចម្បង', classType: 'major' },
    { code: 'CHF', flag: '🇨🇭', name: 'ហ្វ្រង់ស្វីស', country: 'ស្វីស', type: 'រូបិយប័ណ្ណសកលចម្បង', classType: 'major' },
    { code: 'HKD', flag: '🇭🇰', name: 'ដុល្លារហុងកុង', country: 'ហុងកុង', type: 'រូបិយប័ណ្ណសកលចម្បង', classType: 'major' },
    { code: 'MYR', flag: '🇲🇾', name: 'រីងហ្គីតម៉ាឡេស៊ី', country: 'ម៉ាឡេស៊ី', type: 'រូបិយប័ណ្ណតំបន់អាស៊ាន', classType: 'regional' },
    { code: 'VND', flag: '🇻🇳', name: 'ដុងវៀតណាម', country: 'វៀតណាម', type: 'រូបិយប័ណ្ណតំបន់អាស៊ាន', classType: 'regional' },
    { code: 'IDR', flag: '🇮🇩', name: 'រូព្យ៉ាឥណ្ឌូនេស៊ី', country: 'ឥណ្ឌូនេស៊ី', type: 'រូបិយប័ណ្ណតំបន់អាស៊ាន', classType: 'regional' },
    { code: 'PHP', flag: '🇵🇭', name: 'ប៉េសូហ្វីលីពីន', country: 'ហ្វីលីភីន', type: 'រូបិយប័ណ្ណតំបន់អាស៊ាន', classType: 'regional' },
    { code: 'INR', flag: '🇮🇳', name: 'រូពីឥណ្ឌា', country: 'ឥណ្ឌា', type: 'រូបិយប័ណ្ណសកលចម្បង', classType: 'major' },
    { code: 'USDT', flag: '🪙', name: 'Tether', country: 'ទ្រព្យសកម្មឌីជីថល', type: 'Stablecoin គ្រីបតូ', classType: 'stablecoin' },
  ],
}

const TABLE_HEADERS: Record<LanguageCode, string[]> = {
  th: ['รหัส (ISO)', 'ชื่อสกุลเงิน', 'ประเทศ / แหล่งออก', 'ประเภท', 'เรทอ้างอิง'],
  en: ['Code (ISO)', 'Currency Name', 'Country / Issuer', 'Type', 'Live Rate'],
  lo: ['ລະຫັດ (ISO)', 'ຊື່ສະກຸນເງິນ', 'ປະເທດ / ແຫຼ່ງອອກ', 'ປະເພດ', 'ລິ້ງເບິ່ງເຣດ'],
  my: ['ကုဒ် (ISO)', 'ငွေကြေးအမည်', 'နိုင်ငံ / ထုတ်ဝေသူ', 'အမျိုးအစား', 'လဲလှယ်နှုန်းလင့်ခ်'],
  km: ['កូដ (ISO)', 'ឈ្មោះរូបិយប័ណ្ណ', 'ប្រទេស / អ្នកបោះផ្សាយ', 'ប្រភេទ', 'តំណភ្ជាប់អត្រា'],
}

const RELATED_PAIRS_MAP: Record<string, string> = {
  USD: 'usd-thb',
  THB: 'usd-thb',
  LAK: 'thb-lak',
  MMK: 'thb-mmk',
  KHR: 'thb-khr',
  EUR: 'eur-thb',
  JPY: 'thb-jpy',
  CNY: 'thb-cny',
  SGD: 'sgd-thb',
  KRW: 'krw-thb',
  USDT: 'usdt-thb',
  GBP: 'gbp-thb',
  AUD: 'aud-thb',
  CAD: 'cad-thb',
  CHF: 'chf-thb',
  HKD: 'hkd-thb',
  MYR: 'myr-thb',
  VND: 'thb-vnd',
  IDR: 'thb-idr',
  PHP: 'thb-php',
  INR: 'inr-thb',
}

const PAGE_SEO_CONTENT: Record<LanguageCode, PageSeoContent> = {
  th: {
    stats: [
      { label: 'คู่เงินในไดเรกทอรี', value: `${PAIRS.length}+` },
      { label: 'โฟกัสภูมิภาค', value: 'ไทย ลาว เมียนมา กัมพูชา' },
      { label: 'ข้อมูลอ้างอิง', value: 'เรทตลาดกลาง' },
    ],
    popularHeading: 'คู่เงินยอดนิยมที่คนค้นหาบ่อย',
    popularIntro: 'ทางลัดไปยังหน้าคู่เงินที่ใช้บ่อยสำหรับแลกเงินสด ท่องเที่ยว ค้าชายแดน โอนเงิน และเทียบราคา USDT กับเงินบาท',
    popularPairs: ['usd-thb', 'usdt-thb', 'thb-lak', 'thb-mmk', 'thb-khr', 'eur-thb'],
    guideHeading: 'คู่มือเลือกหน้าคู่เงินให้ตรงกับการใช้งาน',
    guideIntro: 'เลือกคู่เงินจากสกุลเงินต้นทางและปลายทางที่ตรงกับธุรกรรมจริง ตัวอย่างเช่น ใช้ USD/THB เมื่อต้องการดูดอลลาร์เป็นบาท หรือ THB/LAK เมื่อต้องการประเมินยอดเงินบาทเป็นกีบลาว',
    guideCards: [
      { title: 'ดูเรทก่อนแลกเงิน', body: 'ใช้เรทอ้างอิงกลางตลาดเพื่อประเมินว่าร้านแลกเงินหรือธนาคารบวกส่วนต่างมากน้อยแค่ไหนก่อนทำธุรกรรมจริง' },
      { title: 'วางแผนโอนเงินข้ามประเทศ', body: 'คู่เงินไทย-ลาว ไทย-เมียนมา และไทย-กัมพูชาช่วยประเมินยอดปลายทางเบื้องต้นสำหรับครอบครัว แรงงาน และธุรกิจชายแดน' },
      { title: 'เทียบสกุลเงินหลักกับเงินบาท', body: 'ติดตาม USD, EUR, JPY, CNY, SGD และ USDT เทียบ THB เพื่อดูต้นทุนสินค้า เดินทาง หรือสินทรัพย์ดิจิทัล' },
    ],
    trustHeading: 'วิธีอ่านข้อมูลคู่เงินบน zrate.io',
    trustItems: [
      { title: 'รูปแบบคู่เงิน', body: 'รหัสหน้าเช่น USD/THB หมายถึง 1 หน่วยของสกุลเงินแรกเทียบกับสกุลเงินที่สอง' },
      { title: 'เรทอ้างอิงไม่ใช่เรทหน้าร้าน', body: 'ผู้ให้บริการจริงอาจมี spread ค่าธรรมเนียม และเงื่อนไขเวลาทำรายการ จึงควรใช้เพื่อเปรียบเทียบก่อนยืนยันธุรกรรม' },
      { title: 'Internal linking สำหรับการค้นหา', body: 'ทุกคู่เงินเชื่อมไปหน้ารายละเอียดเฉพาะ ช่วยให้ผู้ใช้และเครื่องมือค้นหาเข้าใจบริบทของแต่ละสกุลเงินได้ชัดเจน' },
    ],
    faqHeading: 'คำถามที่พบบ่อยเกี่ยวกับคู่เงิน',
    faqs: [
      { question: 'คู่เงิน USD/THB กับ THB/USD ต่างกันอย่างไร?', answer: 'USD/THB แสดงมูลค่า 1 ดอลลาร์สหรัฐเป็นเงินบาท ส่วน THB/USD แสดงมูลค่า 1 บาทเป็นดอลลาร์ ทิศทางของคู่เงินจึงเปลี่ยนความหมายของตัวเลขทันที' },
      { question: 'ควรใช้คู่เงินไหนสำหรับโอนเงินจากไทยไปลาว?', answer: 'โดยทั่วไปให้ดู THB/LAK เพื่อประเมินเงินบาทเป็นกีบลาว และอาจเทียบ USD/LAK เพิ่มหากผู้ให้บริการใช้ดอลลาร์เป็นสกุลกลาง' },
      { question: 'เรทในหน้านี้ใช้ทำธุรกรรมจริงได้เลยไหม?', answer: 'ตัวเลขบน zrate.io เป็นข้อมูลอ้างอิงเพื่อเปรียบเทียบ ก่อนแลกเงินหรือโอนเงินจริงควรตรวจสอบเรทสุดท้ายกับธนาคาร ร้านแลกเงิน หรือผู้ให้บริการอีกครั้ง' },
    ],
  },
  en: {
    stats: [
      { label: 'Directory pairs', value: `${PAIRS.length}+` },
      { label: 'Regional focus', value: 'Thailand Laos Myanmar Cambodia' },
      { label: 'Reference data', value: 'Mid-market rates' },
    ],
    popularHeading: 'Most searched currency pairs',
    popularIntro: 'Fast access to common pair pages for cash exchange, travel, border trade, remittances, and USDT to Thai baht comparison.',
    popularPairs: ['usd-thb', 'usdt-thb', 'thb-lak', 'thb-mmk', 'thb-khr', 'eur-thb'],
    guideHeading: 'How to choose the right pair page',
    guideIntro: 'Select the pair that matches your source and destination currencies. Use USD/THB for US dollar to Thai baht, or THB/LAK when estimating Thai baht to Lao kip.',
    guideCards: [
      { title: 'Check before exchanging cash', body: 'Use the mid-market reference rate to estimate how much spread a bank or exchange counter may be adding.' },
      { title: 'Plan cross-border transfers', body: 'Thailand-Laos, Thailand-Myanmar, and Thailand-Cambodia pairs help estimate recipient amounts for families, workers, and border businesses.' },
      { title: 'Compare major currencies to THB', body: 'Track USD, EUR, JPY, CNY, SGD, and USDT against Thai baht for travel, imports, and digital-asset pricing.' },
    ],
    trustHeading: 'How to read pair data on zrate.io',
    trustItems: [
      { title: 'Pair format', body: 'A page such as USD/THB means one unit of the first currency measured in the second currency.' },
      { title: 'Reference rate, not retail quote', body: 'Providers can add spread, fees, and timing rules, so use zrate.io as a comparison point before confirming a transaction.' },
      { title: 'Search-friendly internal links', body: 'Every pair links to a dedicated detail page, helping users and search engines understand each currency context clearly.' },
    ],
    faqHeading: 'Currency pair FAQ',
    faqs: [
      { question: 'What is the difference between USD/THB and THB/USD?', answer: 'USD/THB shows the value of 1 US dollar in Thai baht. THB/USD shows the value of 1 Thai baht in US dollars, so the direction changes the meaning of the number.' },
      { question: 'Which pair should I use for sending money from Thailand to Laos?', answer: 'THB/LAK is usually the right starting point for Thai baht to Lao kip. You can also compare USD/LAK if your provider uses USD as an intermediate currency.' },
      { question: 'Can I transact directly at the rate shown here?', answer: 'zrate.io rates are reference values for comparison. Always confirm the final rate with your bank, exchange shop, or remittance provider before sending or exchanging money.' },
    ],
  },
  lo: {
    stats: [
      { label: 'ຄູ່ເງິນໃນລາຍຊື່', value: `${PAIRS.length}+` },
      { label: 'ພາກພື້ນຫຼັກ', value: 'ໄທ ລາວ ມຽນມາ ກຳປູເຈຍ' },
      { label: 'ຂໍ້ມູນອ້າງອີງ', value: 'ເຣດຕະຫຼາດກາງ' },
    ],
    popularHeading: 'ຄູ່ເງິນທີ່ຄົນຄົ້ນຫາຫຼາຍ',
    popularIntro: 'ລິ້ງດ່ວນໄປຫາຄູ່ເງິນສຳຄັນສຳລັບແລກເງິນ ທ່ອງທ່ຽວ ການຄ້າຊາຍແດນ ແລະ USDT/THB.',
    popularPairs: ['usd-thb', 'usdt-thb', 'thb-lak', 'usd-lak', 'thb-mmk', 'thb-khr'],
    guideHeading: 'ວິທີເລືອກໜ້າຄູ່ເງິນ',
    guideIntro: 'ເລືອກຄູ່ເງິນຕາມສະກຸນເງິນຕົ້ນທາງ ແລະ ປາຍທາງຂອງທ່ານ ເຊັ່ນ USD/THB ຫຼື THB/LAK.',
    guideCards: [
      { title: 'ກວດເຣດກ່ອນແລກເງິນ', body: 'ໃຊ້ເຣດອ້າງອີງຕະຫຼາດກາງເພື່ອປຽບທຽບກັບທະນາຄານ ຫຼື ຮ້ານແລກເງິນ.' },
      { title: 'ວາງແຜນໂອນເງິນ', body: 'ຄູ່ເງິນໄທ-ລາວ ແລະ ໄທ-ມຽນມາ ຊ່ວຍປະເມີນເງິນປາຍທາງ.' },
      { title: 'ປຽບທຽບສະກຸນເງິນຫຼັກ', body: 'ຕິດຕາມ USD, EUR, JPY, CNY, SGD ແລະ USDT ທຽບກັບບາດໄທ.' },
    ],
    trustHeading: 'ວິທີອ່ານຂໍ້ມູນຄູ່ເງິນ',
    trustItems: [
      { title: 'ຮູບແບບຄູ່ເງິນ', body: 'USD/THB ໝາຍເຖິງ 1 USD ມີມູນຄ່າເທົ່າໃດໃນ THB.' },
      { title: 'ເຣດອ້າງອີງ', body: 'ເຣດຈາກຜູ້ໃຫ້ບໍລິການຈິງອາດມີ spread ແລະ ຄ່າທຳນຽມ.' },
      { title: 'ລິ້ງພາຍໃນ', body: 'ທຸກຄູ່ເງິນມີໜ້າລາຍລະອຽດເພື່ອຊ່ວຍການຄົ້ນຫາ.' },
    ],
    faqHeading: 'ຄຳຖາມພົບເລື້ອຍ',
    faqs: [
      { question: 'USD/THB ແຕກຕ່າງຈາກ THB/USD ແນວໃດ?', answer: 'USD/THB ແມ່ນ 1 ໂດລາເປັນບາດ ສ່ວນ THB/USD ແມ່ນ 1 ບາດເປັນໂດລາ.' },
      { question: 'ໂອນເງິນຈາກໄທໄປລາວຄວນເບິ່ງຄູ່ໃດ?', answer: 'ໂດຍທົ່ວໄປເບິ່ງ THB/LAK ແລະອາດປຽບທຽບ USD/LAK ເພີ່ມ.' },
      { question: 'ເຣດນີ້ໃຊ້ເຮັດທຸລະກຳໄດ້ທັນທີບໍ?', answer: 'ເຣດໃນ zrate.io ເປັນຂໍ້ມູນອ້າງອີງ ຄວນຢືນຢັນກັບຜູ້ໃຫ້ບໍລິການກ່ອນ.' },
    ],
  },
  my: {
    stats: [
      { label: 'Directory pairs', value: `${PAIRS.length}+` },
      { label: 'Regional focus', value: 'Thailand Laos Myanmar Cambodia' },
      { label: 'Reference data', value: 'Mid-market rates' },
    ],
    popularHeading: 'လူရှာဖွေမှုများသော ငွေကြေးအတွဲများ',
    popularIntro: 'ငွေလဲခြင်း၊ ခရီးသွားခြင်း၊ နယ်စပ်ကုန်သွယ်ရေး၊ ငွေလွှဲခြင်းနှင့် USDT/THB နှိုင်းယှဉ်ရန် အမြန်လင့်ခ်များ။',
    popularPairs: ['usd-thb', 'usdt-thb', 'thb-mmk', 'usd-mmk', 'thb-lak', 'thb-khr'],
    guideHeading: 'သင့်လျော်သော ငွေကြေးအတွဲကို ရွေးချယ်နည်း',
    guideIntro: 'မူလငွေကြေးနှင့် လက်ခံငွေကြေးအတိုင်း ရွေးချယ်ပါ။ ဥပမာ USD/THB သို့မဟုတ် THB/MMK ကို အသုံးပြုနိုင်သည်။',
    guideCards: [
      { title: 'ငွေလဲမတိုင်မီ စစ်ဆေးပါ', body: 'Mid-market reference rate ဖြင့် ဘဏ် သို့မဟုတ် ငွေလဲကောင်တာ၏ spread ကို နှိုင်းယှဉ်နိုင်သည်။' },
      { title: 'နိုင်ငံခြားငွေလွှဲမှုကို စီစဉ်ပါ', body: 'ထိုင်း-မြန်မာနှင့် ထိုင်း-လာအို ငွေကြေးအတွဲများက လက်ခံသူရမည့်ငွေကို အကြမ်းဖျင်းခန့်မှန်းရန် ကူညီသည်။' },
      { title: 'အဓိကငွေကြေးများကို THB နှင့် နှိုင်းယှဉ်ပါ', body: 'USD, EUR, JPY, CNY, SGD နှင့် USDT ကို ထိုင်းဘတ်နှင့် တွဲကြည့်နိုင်သည်။' },
    ],
    trustHeading: 'zrate.io တွင် pair data ကို ဖတ်နည်း',
    trustItems: [
      { title: 'Pair format', body: 'USD/THB ဆိုသည်မှာ 1 USD ကို THB ဖြင့် တိုင်းတာသောတန်ဖိုးဖြစ်သည်။' },
      { title: 'Reference rate', body: 'လက်တွေ့ provider များတွင် spread, fees နှင့် timing rules ရှိနိုင်သည်။' },
      { title: 'Internal links', body: 'ငွေကြေးအတွဲတိုင်းတွင် dedicated detail page ရှိသည်။' },
    ],
    faqHeading: 'ငွေကြေးအတွဲ FAQ',
    faqs: [
      { question: 'USD/THB နှင့် THB/USD ကွာခြားချက်?', answer: 'USD/THB သည် 1 US dollar ကို Thai baht ဖြင့်ပြသည်။ THB/USD သည် 1 Thai baht ကို US dollars ဖြင့်ပြသည်။' },
      { question: 'Thailand မှ Myanmar သို့ ငွေလွှဲရန် မည်သည့် pair ကိုကြည့်ရမလဲ?', answer: 'THB/MMK သည် စတင်ကြည့်ရန် သင့်တော်ပြီး provider က USD ကို intermediary အဖြစ်သုံးပါက USD/MMK ကိုလည်းနှိုင်းယှဉ်နိုင်သည်။' },
      { question: 'ဒီ rate နဲ့ လက်တွေ့ငွေလဲနိုင်ပါသလား?', answer: 'zrate.io rate သည် reference အတွက်ဖြစ်သည်။ ငွေလဲ သို့မဟုတ် ငွေလွှဲမတိုင်မီ provider ထံ final rate ကို စစ်ဆေးပါ။' },
    ],
  },
  km: {
    stats: [
      { label: 'គូក្នុងបញ្ជី', value: `${PAIRS.length}+` },
      { label: 'តំបន់ផ្តោត', value: 'ថៃ ឡាវ មីយ៉ាន់ម៉ា កម្ពុជា' },
      { label: 'ទិន្នន័យយោង', value: 'Mid-market rates' },
    ],
    popularHeading: 'គូរូបិយប័ណ្ណដែលស្វែងរកច្រើន',
    popularIntro: 'តំណភ្ជាប់រហ័សសម្រាប់ប្តូរប្រាក់ ធ្វើដំណើរ ពាណិជ្ជកម្មព្រំដែន ផ្ញើប្រាក់ និងប្រៀបធៀប USDT/THB។',
    popularPairs: ['usd-thb', 'usdt-thb', 'thb-khr', 'usd-khr', 'thb-lak', 'thb-mmk'],
    guideHeading: 'របៀបជ្រើសរើសទំព័រគូរូបិយប័ណ្ណ',
    guideIntro: 'ជ្រើសគូដែលត្រូវនឹងរូបិយប័ណ្ណដើម និងរូបិយប័ណ្ណគោលដៅរបស់អ្នក ដូចជា USD/THB ឬ THB/KHR។',
    guideCards: [
      { title: 'ពិនិត្យមុនប្តូរប្រាក់', body: 'ប្រើអត្រាយោង mid-market ដើម្បីប្រៀបធៀប spread របស់ធនាគារ ឬហាងប្តូរប្រាក់។' },
      { title: 'រៀបចំការផ្ញើប្រាក់ឆ្លងប្រទេស', body: 'គូថៃ-កម្ពុជា ថៃ-ឡាវ និងថៃ-មីយ៉ាន់ម៉ា ជួយប៉ាន់ស្មានចំនួនទឹកប្រាក់អ្នកទទួល។' },
      { title: 'ប្រៀបធៀបរូបិយប័ណ្ណសំខាន់ជាមួយ THB', body: 'តាមដាន USD, EUR, JPY, CNY, SGD និង USDT ទល់នឹងបាតថៃ។' },
    ],
    trustHeading: 'របៀបអានទិន្នន័យគូរូបិយប័ណ្ណ',
    trustItems: [
      { title: 'ទម្រង់គូ', body: 'USD/THB មានន័យថា 1 USD វាស់តម្លៃជាបាតថៃ។' },
      { title: 'អត្រាយោង', body: 'អ្នកផ្តល់សេវាពិតអាចបន្ថែម spread, fees និងលក្ខខណ្ឌពេលវេលា។' },
      { title: 'តំណភ្ជាប់ផ្ទៃក្នុង', body: 'គូរូបិយប័ណ្ណនីមួយៗភ្ជាប់ទៅទំព័រលម្អិតផ្ទាល់ខ្លួន។' },
    ],
    faqHeading: 'សំណួរគេសួរញឹកញាប់',
    faqs: [
      { question: 'USD/THB ខុសពី THB/USD ដូចម្តេច?', answer: 'USD/THB បង្ហាញតម្លៃ 1 ដុល្លារជាបាត។ THB/USD បង្ហាញតម្លៃ 1 បាតជាដុល្លារ។' },
      { question: 'ផ្ញើប្រាក់ពីថៃទៅកម្ពុជាគួរមើលគូណា?', answer: 'THB/KHR ជាចំណុចចាប់ផ្តើមល្អ ហើយអាចប្រៀបធៀប USD/KHR បន្ថែម ប្រសិនបើសេវាប្រើ USD ជារូបិយប័ណ្ណកណ្តាល។' },
      { question: 'អាចប្រើអត្រានេះធ្វើប្រតិបត្តិការភ្លាមៗបានទេ?', answer: 'អត្រា zrate.io គឺសម្រាប់យោង។ សូមបញ្ជាក់អត្រាចុងក្រោយជាមួយធនាគារ ហាងប្តូរប្រាក់ ឬសេវាផ្ញើប្រាក់ជាមុន។' },
    ],
  },
}

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const lang = resolvedParams.locale as LanguageCode
  if (!((LOCALES as string[]).includes(lang))) return {}
  const text = HUB_TEXT[PAGE_KEY][lang]
  const prefix = lang === 'th' ? '' : `/${lang}`

  const languages: Record<string, string> = {}
  LOCALES.forEach(locale => {
    languages[locale] = `${SITE_URL}${localizePath(locale, PATH)}`
  })
  languages['x-default'] = `${SITE_URL}${PATH}`

  return {
    title: text.title,
    description: text.description,
    alternates: {
      canonical: `${SITE_URL}${prefix}${PATH}`,
      languages,
    },
    openGraph: {
      title: text.title,
      description: text.description,
      url: `${SITE_URL}${prefix}${PATH}`,
      siteName: 'zrate.io',
      type: 'website',
      locale: lang === 'th' ? 'th_TH' : lang === 'en' ? 'en_US' : lang === 'lo' ? 'lo_LA' : lang === 'my' ? 'my_MM' : 'km_KH',
      images: [
        {
          url: `${SITE_URL}/currency-pairs-illustration.png`,
          width: 1024,
          height: 1024,
          alt: text.title,
        },
      ],
    },
  }
}

export default async function CurrencyPairsPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const lang = resolvedParams.locale as LanguageCode
  if (!((LOCALES as string[]).includes(lang))) notFound()
  
  const text = HUB_TEXT[PAGE_KEY][lang]
  const prefix = lang === 'th' ? '' : `/${lang}`

  const columnTitles = [
    text.cards[0]?.title || 'Baht Pairs',
    text.cards[1]?.title || 'ASEAN Regional Pairs',
    text.cards[2]?.title || 'Global & Other Pairs'
  ]

  const breadcrumbs = BREADCRUMBS[lang] || BREADCRUMBS.th

  // Dynamic ItemList elements for schema optimization
  const itemListElement = PAIRS.map((pairSlug, index) => {
    const [base, target] = pairSlug.split('-')
    const baseDetails = CURRENCY_DETAILS[base] || { name: { [lang]: base.toUpperCase() } }
    const targetDetails = CURRENCY_DETAILS[target] || { name: { [lang]: target.toUpperCase() } }
    const baseName = baseDetails.name[lang] || baseDetails.name.en
    const targetName = targetDetails.name[lang] || targetDetails.name.en
    
    const pairLabel = pairSlug.toUpperCase().replace('-', '/')
    const nameText = lang === 'th'
      ? `${pairLabel} (${baseName} เป็น ${targetName})`
      : lang === 'en'
      ? `${pairLabel} (${baseName} to ${targetName})`
      : lang === 'lo'
      ? `${pairLabel} (${baseName} ເປັນ ${targetName})`
      : lang === 'my'
      ? `${pairLabel} (${baseName} မှ ${targetName})`
      : `${pairLabel} (${baseName} ទៅ ${targetName})`

    return {
      '@type': 'ListItem',
      'position': index + 1,
      'name': nameText,
      'url': `${SITE_URL}${prefix}/${pairSlug}`
    }
  })

  const pageJsonLd: { '@context': string; '@graph': Array<Record<string, unknown>> } = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}${prefix}/currency-pairs#webpage`,
        'url': `${SITE_URL}${prefix}/currency-pairs`,
        'name': text.title,
        'description': text.description,
        'inLanguage': lang,
        'isPartOf': {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          'url': SITE_URL,
          'name': 'zrate.io',
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}${prefix}/currency-pairs#itemlist`,
        'name': text.heading,
        'description': text.description,
        'itemListElement': itemListElement
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}${prefix}/currency-pairs#breadcrumb`,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': breadcrumbs.home,
            'item': `${SITE_URL}${lang === 'th' ? '/' : `/${lang}`}`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': breadcrumbs.current,
            'item': `${SITE_URL}${prefix}/currency-pairs`
          }
        ]
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        'name': 'zrate.io',
        'url': SITE_URL,
        'logo': `${SITE_URL}/zrate.png`,
        'description': 'Real-time ASEAN currency exchange desk and remittance guide platform.',
        'sameAs': [SITE_URL],
      }
    ]
  }

  const infoList = CURRENCY_INFO_LIST[lang] || CURRENCY_INFO_LIST.th
  const tableHeaders = TABLE_HEADERS[lang] || TABLE_HEADERS.th
  const seoContent = PAGE_SEO_CONTENT[lang] || PAGE_SEO_CONTENT.th
  const popularPairs = seoContent.popularPairs.filter(pair => PAIRS.includes(pair as (typeof PAIRS)[number]))

  pageJsonLd['@graph'].push({
    '@type': 'FAQPage',
    '@id': `${SITE_URL}${prefix}/currency-pairs#faq`,
    'mainEntity': seoContent.faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  })

  return (
    <main className={styles.container} lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      <Header lang={lang} subtitle={text.description} />

      <SeoNav lang={lang} active="pairs" />

      <AdSection />

      {/* BREADCRUMB UI NAVIGATION */}
      <div className={styles.breadcrumb}>
        <Link href={localizePath(lang, '/')}>{breadcrumbs.home}</Link>
        <span className={styles.breadcrumbSeparator}>➔</span>
        <span>{breadcrumbs.current}</span>
      </div>

      <section className={styles.contentSection}>
        {/* SPLIT HERO SECTION: Header left, illustration right */}
        <div className={styles.heroLayout}>
          <div className={styles.heroLeft}>
            <span className={styles.eyebrow}>{text.eyebrow}</span>
            <h1 className={styles.title}>{text.heading}</h1>
            <p className={styles.description}>{text.body}</p>
            <div className={styles.heroStats} aria-label={lang === 'th' ? 'สรุปข้อมูลหน้า' : 'Page summary'}>
              {seoContent.stats.map(stat => (
                <div className={styles.heroStat} key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroPanel}>
              <div className={styles.imageCard}>
              <Image
                src="/currency-pairs-illustration.png"
                alt="zrate.io global currency connection network illustration"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 320px"
              />
              </div>
              <div className={styles.popularMini}>
                <span>{seoContent.popularHeading}</span>
                <div>
                  {popularPairs.slice(0, 4).map(pair => (
                    <Link key={pair} href={localizePath(lang, `/${pair}`)}>
                      {PAIR_LABELS[pair] || pair.toUpperCase().replace('-', '/')}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className={styles.popularSection} aria-labelledby="popular-pairs-heading">
          <div className={styles.sectionIntro}>
            <h2 id="popular-pairs-heading" className={styles.sectionHeading}>{seoContent.popularHeading}</h2>
            <p>{seoContent.popularIntro}</p>
          </div>
          <div className={styles.popularGrid}>
            {popularPairs.map(pair => {
              const [base, target] = pair.split('-')
              const baseDetails = CURRENCY_DETAILS[base]
              const targetDetails = CURRENCY_DETAILS[target]
              const baseName = baseDetails?.name[lang] || baseDetails?.name.en || base.toUpperCase()
              const targetName = targetDetails?.name[lang] || targetDetails?.name.en || target.toUpperCase()

              return (
                <Link key={pair} href={localizePath(lang, `/${pair}`)} className={styles.popularCard}>
                  <span className={styles.popularCode}>{PAIR_LABELS[pair] || pair.toUpperCase().replace('-', '/')}</span>
                  <span className={styles.popularName}>{baseName} / {targetName}</span>
                  <span className={styles.popularAction}>
                    {lang === 'th' ? 'ดูเรทสด' : lang === 'lo' ? 'ເບິ່ງເຣດ' : lang === 'my' ? 'နှုန်းကြည့်ရန်' : lang === 'km' ? 'មើលអត្រា' : 'View rate'}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* INTERACTIVE COMPONENT: Client-side Search and Filters */}
        <PairsDirectory
          lang={lang}
          pairs={PAIRS as unknown as string[]}
          regionalPairs={REGIONAL_PAIRS as unknown as string[]}
          pairLabels={PAIR_LABELS}
          columnTitles={columnTitles}
        />

        {/* METHODOLOGY INFO CARD & UNIQUE SUMMARY DATA TABLE */}
        <div className={styles.introCard}>
          <h2 className={styles.sectionHeading} style={{ marginBottom: '20px' }}>
            {text.contentHeading}
          </h2>

          {/* Visual Explanation Grid */}
          <div className={styles.infoLayout}>
            {/* Left Block: ISO 4217 Codes */}
            <div className={styles.infoBlockMain}>
              <div className={styles.infoBlockIcon}>🌐</div>
              <h3 className={styles.infoBlockTitle}>
                {lang === 'th' ? 'มาตรฐานรหัสสกุลเงินสากล (ISO 4217)'
                 : lang === 'en' ? 'International Currency Codes (ISO 4217)'
                 : lang === 'lo' ? 'ມາດຕະຖານລະຫັດສະກຸນເງິນສາກົນ (ISO 4217)'
                 : lang === 'my' ? 'နိုင်ငံတကာ ငွေကြေးကုဒ်စံနှုန်း (ISO 4217)'
                 : 'ស្តង់ដារកូដរូបិយប័ណ្ណអន្តរជាតិ (ISO 4217)'}
              </h3>
              <p className={styles.infoBlockDesc}>
                {text.paragraphs[0]}
              </p>
            </div>

            {/* Right Block: 3 Categories Grid */}
            <div className={styles.infoBlockCategories}>
              <div className={styles.categoryCard}>
                <span className={styles.categoryBadge} style={{ background: 'rgba(34, 197, 94, 0.08)', color: 'rgb(34, 197, 94)', border: '1px solid rgba(34, 197, 94, 0.15)' }}>1</span>
                <div>
                  <h4>
                    {lang === 'th' ? 'คู่เงินหลักสากล (Major Pairs)'
                     : lang === 'en' ? 'Major Pairs'
                     : lang === 'lo' ? 'ຄູ່ເງິນຫຼັກສາກົນ'
                     : lang === 'my' ? 'အဓိကအတွဲများ'
                     : 'គូសកលចម្បង'}
                  </h4>
                  <p>
                    {lang === 'th' ? 'เช่น EUR/USD, USD/JPY ที่มีปริมาณการซื้อขายและสภาพคล่องสูงเป็นอันดับต้นๆ ของโลก'
                     : lang === 'en' ? 'e.g., EUR/USD, USD/JPY with the highest trading volume and liquidity globally.'
                     : lang === 'lo' ? 'ເຊັ່ນ EUR/USD, USD/JPY ທີ່ມີປະລິມານການຊື້ຂາຍ ແລະ ສະພາບຄ່ອງສູງທີ່ສຸດໃນໂລກ'
                     : lang === 'my' ? 'ဥပမာ EUR/USD, USD/JPY ကဲ့သို့ ကမ္ဘာပေါ်တွင် အရောင်းအဝယ်အများဆုံးအတွဲများ။'
                     : 'ដូចជា EUR/USD, USD/JPY ដែលមានទំហំពាណិជ្ជកម្ម និងសាច់ប្រាក់ងាយស្រួលខ្ពស់បំផុតលើលោក។'}
                  </p>
                </div>
              </div>

              <div className={styles.categoryCard}>
                <span className={styles.categoryBadge} style={{ background: 'rgba(14, 165, 233, 0.08)', color: 'var(--accent-text)', border: '1px solid rgba(14, 165, 233, 0.15)' }}>2</span>
                <div>
                  <h4>
                    {lang === 'th' ? 'คู่เงินภูมิภาคอาเซียน (Regional Pairs)'
                     : lang === 'en' ? 'Regional Pairs'
                     : lang === 'lo' ? 'ຄູ່ເງິນພາກພື້ນອາຊຽນ'
                     : lang === 'my' ? 'ဒေသတွင်းအတွဲများ'
                     : 'គូរូបិយប័ណ្ណតំបន់'}
                  </h4>
                  <p>
                    {lang === 'th' ? 'เช่น THB/LAK หรือ THB/MMK เน้นสำหรับการค้าชายแดนและการโอนเงินของแรงงานข้ามแดน'
                     : lang === 'en' ? 'e.g., THB/LAK or THB/MMK mainly used for cross-border trade and migrant remittances.'
                     : lang === 'lo' ? 'ເຊັ່ນ THB/LAK ຫຼື THB/MMK ທີ່ໃຊ້ໃນການຄ້າຊາຍແດນ ແລະ ໂອນເงິນແຮງງານ.'
                     : lang === 'my' ? 'ဥပမာ THB/LAK သို့မဟုတ် THB/MMK ကဲ့သို့ နယ်စပ်ကုန်သွယ်ရေးနှင့် ငွေလွှဲလုပ်ငန်းများ။'
                     : 'ដូចជា THB/LAK ឬ THB/MMK សម្រាប់ពាណិជ្ជកម្មព្រំដែន និងការផ្ញើប្រាក់របស់ពលករ។'}
                  </p>
                </div>
              </div>

              <div className={styles.categoryCard}>
                <span className={styles.categoryBadge} style={{ background: 'rgba(139, 92, 246, 0.08)', color: 'rgb(139, 92, 246)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>3</span>
                <div>
                  <h4>
                    {lang === 'th' ? 'คู่เงินคริปโต / Stablecoin'
                     : lang === 'en' ? 'Crypto Stablecoin Pairs'
                     : lang === 'lo' ? 'ຄູ່ເງິນຄຣິບໂຕ'
                     : lang === 'my' ? 'Stablecoin အတွဲများ'
                     : 'គូ Stablecoin គ្រីបតូ'}
                  </h4>
                  <p>
                    {lang === 'th' ? 'เช่น USDT/THB ที่ผูกมูลค่าไว้กับดอลลาร์สหรัฐเพื่อใช้ทำธุรกรรมบนระบบบล็อกเชน'
                     : lang === 'en' ? 'e.g., USDT/THB pegged to USD for digital assets and blockchain transactions.'
                     : lang === 'lo' ? 'ເຊັ່ນ USDT/THB ທີ່ຜູກມູນຄ່າກັບໂດລາສະຫະລັດເພື່ອໃຊ້ໃນລະບົບບລັอกເຊນ.'
                     : lang === 'my' ? 'ဥပမာ USDT/THB ကဲ့သို့ blockchain စနစ်ပေါ်တွင် သုံးရန် ဒေါ်လာနှင့်ချိတ်ဆက်ထားသော အတွဲများ။'
                     : 'ដូចជា USDT/THB ដែលភ្ជាប់តម្លៃទៅនឹងប្រាក់ដុល្លារអាមេរិកសម្រាប់ប្រតិបត្តិការប្លុកឆេន។'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* UNIQUE SEO CURRENCY REFERENCE TABLE */}
          <div className={styles.tableWrapper}>
            <table className={styles.directoryTable}>
              <thead>
                <tr>
                  <th className={styles.th}>{tableHeaders[0]}</th>
                  <th className={styles.th}>{tableHeaders[1]}</th>
                  <th className={styles.th}>{tableHeaders[2]}</th>
                  <th className={styles.th}>{tableHeaders[3]}</th>
                  <th className={styles.th}>{tableHeaders[4]}</th>
                </tr>
              </thead>
              <tbody>
                {infoList.map(item => {
                  const pairSlug = RELATED_PAIRS_MAP[item.code]
                  const label = pairSlug ? pairSlug.toUpperCase().replace('-', '/') : ''
                  const linkText = lang === 'th'
                    ? `ดูเรท ${label}`
                    : lang === 'en'
                    ? `View ${label}`
                    : lang === 'lo'
                    ? `ເບິ່ງເຣດ ${label}`
                    : lang === 'my'
                    ? `${label} နှုန်းကြည့်ရန်`
                    : `មើលអត្រា ${label}`

                  return (
                    <tr key={item.code} className={styles.tr}>
                      <td className={styles.td}>
                        <div className={styles.currencyBadge}>
                          <span className={styles.flagIcon}>{item.flag}</span>
                          <span className={styles.currencyCodeText}>{item.code}</span>
                        </div>
                      </td>
                      <td className={styles.td} style={{ fontWeight: 700 }}>
                        {item.name}
                      </td>
                      <td className={styles.td}>
                        {item.country}
                      </td>
                      <td className={styles.td}>
                        <span className={
                          item.classType === 'major' ? styles.badgeTypeMajor :
                          item.classType === 'stablecoin' ? styles.badgeTypeStablecoin :
                          styles.badgeTypeRegional
                        }>
                          {item.type}
                        </span>
                      </td>
                      <td className={styles.td} style={{ textAlign: 'right' }}>
                        {pairSlug && (
                          <Link href={localizePath(lang, `/${pairSlug}`)} className={styles.tblLink}>
                            {linkText} ➔
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <section className={styles.seoGuide} aria-labelledby="pair-guide-heading">
          <div className={styles.sectionIntro}>
            <h2 id="pair-guide-heading" className={styles.sectionHeading}>{seoContent.guideHeading}</h2>
            <p>{seoContent.guideIntro}</p>
          </div>
          <div className={styles.guideGrid}>
            {seoContent.guideCards.map(card => (
              <article className={styles.guideCard} key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.trustSection} aria-labelledby="trust-heading">
          <h2 id="trust-heading" className={styles.sectionHeading}>{seoContent.trustHeading}</h2>
          <div className={styles.trustGrid}>
            {seoContent.trustItems.map(item => (
              <article className={styles.trustItem} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.faqSection} aria-labelledby="currency-pair-faq-heading">
          <h2 id="currency-pair-faq-heading" className={styles.sectionHeading}>{seoContent.faqHeading}</h2>
          <div className={styles.faqList}>
            {seoContent.faqs.map(faq => (
              <details className={styles.faqItem} key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </section>

      <AdSection />

      <Footer lang={lang} />
    </main>
  )
}
