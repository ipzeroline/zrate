import Link from 'next/link'
import { fetchRates, fetchHistoricalRates, fetchCurrencyNews } from '../../../lib/ratesService'
import { InteractiveChart } from './InteractiveChart'
import { AseanDashboard } from './AseanDashboard'
import { NewsFeed } from './NewsFeed'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { NativeBannerAd, ResponsiveBannerAd } from '../../components/AdsterraAds'
import { Footer } from '../../components/Footer'
import { PairTopBar } from './PairTopBar'
import { getPairContent } from './pairContent'
import styles from './page.module.css'

type CurrencyCode = 'USD' | 'EUR' | 'USDT' | 'THB' | 'LAK' | 'MMK' | 'KHR' | 'JPY' | 'CNY' | 'SGD' | 'KRW' | 'GBP' | 'AUD' | 'CAD' | 'CHF' | 'HKD' | 'MYR' | 'VND' | 'IDR' | 'PHP' | 'INR' | 'NZD' | 'SEK' | 'NOK' | 'DKK' | 'BRL' | 'MXN' | 'ZAR' | 'RUB' | 'TRY' | 'SAR' | 'AED' | 'PLN' | 'CZK' | 'HUF' | 'ILS' | 'PKR' | 'EGP' | 'NGN' | 'TWD'
type LanguageCode = 'th' | 'en' | 'lo' | 'my' | 'km'

const SITE_URL = 'https://zrate.io'
const LOCALES = ['th', 'en', 'lo', 'my', 'km']

const LOCALE_BY_LANGUAGE: Record<LanguageCode, string> = {
  th: 'th-TH',
  en: 'en-US',
  lo: 'lo-LA',
  my: 'my-MM',
  km: 'km-KH',
}

const PAIRS = [
  'aed-thb',
  'aed-usd',
  'aud-thb',
  'aud-usd',
  'brl-thb',
  'brl-usd',
  'cad-thb',
  'cad-usd',
  'chf-thb',
  'chf-usd',
  'cny-thb',
  'cny-usd',
  'czk-thb',
  'czk-usd',
  'dkk-thb',
  'dkk-usd',
  'egp-thb',
  'egp-usd',
  'eur-gbp',
  'eur-jpy',
  'eur-thb',
  'eur-usd',
  'gbp-thb',
  'gbp-usd',
  'hkd-thb',
  'hkd-usd',
  'huf-thb',
  'huf-usd',
  'idr-thb',
  'idr-usd',
  'ils-thb',
  'ils-usd',
  'inr-thb',
  'inr-usd',
  'jpy-thb',
  'jpy-usd',
  'khr-thb',
  'khr-usd',
  'krw-thb',
  'krw-usd',
  'lak-thb',
  'lak-usd',
  'mmk-thb',
  'mmk-usd',
  'mxn-thb',
  'mxn-usd',
  'myr-lak',
  'myr-mmk',
  'myr-thb',
  'myr-usd',
  'ngn-thb',
  'ngn-usd',
  'nok-thb',
  'nok-usd',
  'nzd-thb',
  'nzd-usd',
  'php-thb',
  'php-usd',
  'pkr-thb',
  'pkr-usd',
  'pln-thb',
  'pln-usd',
  'rub-thb',
  'rub-usd',
  'sar-thb',
  'sar-usd',
  'sek-thb',
  'sek-usd',
  'sgd-myr',
  'sgd-thb',
  'sgd-usd',
  'thb-aed',
  'thb-aud',
  'thb-brl',
  'thb-cad',
  'thb-chf',
  'thb-cny',
  'thb-czk',
  'thb-dkk',
  'thb-egp',
  'thb-eur',
  'thb-gbp',
  'thb-hkd',
  'thb-huf',
  'thb-idr',
  'thb-ils',
  'thb-inr',
  'thb-jpy',
  'thb-khr',
  'thb-krw',
  'thb-lak',
  'thb-mmk',
  'thb-mxn',
  'thb-myr',
  'thb-ngn',
  'thb-nok',
  'thb-nzd',
  'thb-php',
  'thb-pkr',
  'thb-pln',
  'thb-rub',
  'thb-sar',
  'thb-sek',
  'thb-sgd',
  'thb-try',
  'thb-twd',
  'thb-usd',
  'thb-usdt',
  'thb-vnd',
  'thb-zar',
  'try-thb',
  'try-usd',
  'twd-thb',
  'twd-usd',
  'usd-aed',
  'usd-aud',
  'usd-brl',
  'usd-cad',
  'usd-chf',
  'usd-cny',
  'usd-czk',
  'usd-dkk',
  'usd-egp',
  'usd-eur',
  'usd-gbp',
  'usd-hkd',
  'usd-huf',
  'usd-idr',
  'usd-ils',
  'usd-inr',
  'usd-jpy',
  'usd-khr',
  'usd-krw',
  'usd-lak',
  'usd-mmk',
  'usd-mxn',
  'usd-myr',
  'usd-ngn',
  'usd-nok',
  'usd-nzd',
  'usd-php',
  'usd-pkr',
  'usd-pln',
  'usd-rub',
  'usd-sar',
  'usd-sek',
  'usd-sgd',
  'usd-thb',
  'usd-try',
  'usd-twd',
  'usd-vnd',
  'usd-zar',
  'usdt-thb',
  'usdt-usd',
  'vnd-thb',
  'vnd-usd',
  'zar-thb',
  'zar-usd'
] as const

const CURRENCY_NAMES: Record<CurrencyCode, Record<LanguageCode, string>> = {
  USD: { th: 'ดอลลาร์สหรัฐ', en: 'US Dollar', lo: 'ໂດລາສະຫະລັດ', my: 'အမေရိကန်ဒေါ်လာ', km: 'ដុល្លារអាមេរិក' },
  EUR: { th: 'ยูโร', en: 'Euro', lo: 'ເອີໂຣ', my: 'ယူရို', km: 'អឺរ៉ូ' },
  GBP: { th: 'ปอนด์สเตอร์ลิง', en: 'British Pound', lo: 'ປອນສະເຕີລິງ', my: 'ဗြိတိသျှပေါင်', km: 'ផោនស្ទឺលីង' },
  AUD: { th: 'ดอลลาร์ออสเตรเลีย', en: 'Australian Dollar', lo: 'ໂດລາອົດສະຕຣາລີ', my: 'ဩစតြေးလျဒေါ်လာ', km: 'ដុល្លារអូស្ត្រាលី' },
  JPY: { th: 'เยนญี่ปุ่น', en: 'Japanese Yen', lo: 'ເຢນຍີ່ປຸ່ນ', my: 'ဂျပန်ယန်း', km: 'យ៉េនជប៉ុន' },
  CNY: { th: 'หยวนจีน', en: 'Chinese Yuan', lo: 'ຢວນຈີນ', my: 'တရုတ်ယွမ်', km: 'យន់ចិន' },
  SGD: { th: 'ดอลลาร์สิงคโปร์', en: 'Singapore Dollar', lo: 'ໂດລາສิงກະໂປ', my: 'စင်ကာပူဒေါ်လာ', km: 'ដុល្លារសិង្ហបុរី' },
  LAK: { th: 'กีบลาว', en: 'Lao Kip', lo: 'ກີບລາວ', my: 'လာအိုကျပ်', km: 'គីបឡាវ' },
  MMK: { th: 'จ๊าตเมียนมา', en: 'Myanmar Kyat', lo: 'ຈາດມຽนມາ', my: 'မြန်မာကျပ်', km: 'គ្យាតមីយ៉ាន់ម៉ា' },
  KHR: { th: 'เรียลกัมพูชา', en: 'Cambodian Riel', lo: 'ຣຽວກຳປູເຈຍ', my: 'ကမ္ဘောဒီးយားရីယယ်', km: 'រៀលកម្ពុជា' },
  KRW: { th: 'วอนเกาหลีใต้', en: 'South Korean Won', lo: 'ວອນເກົາຫຼີໃຕ້', my: 'တောင်ကိုရီးယားဝမ်', km: 'វ៉ុនកូរ៉េខាងត្បូង' },
  HKD: { th: 'ดอลลาร์ฮ่องกง', en: 'Hong Kong Dollar', lo: 'ໂດລາຮົງກົງ', my: 'ဟောင်កောင်ဒေါ်လာ', km: 'ដុល្លារហុងកុង' },
  CAD: { th: 'ดอลลาร์แคนาดา', en: 'Canadian Dollar', lo: 'ໂດລາແຄนນາດາ', my: 'ကနေဒါဒေါ်လာ', km: 'ដុល្លារកាណាដា' },
  CHF: { th: 'ฟรังก์สวิส', en: 'Swiss Franc', lo: 'ຟຣັງສະວິດ', my: 'ဆွတ်ဇាលັນဖရန့်', km: 'ហ្វ្រង់ស្វីស' },
  NZD: { th: 'ดอลลาร์นิวซีแลนด์', en: 'New Zealand Dollar', lo: 'ໂດລານิวຊີແລນ', my: 'နယူးဇီလန်ဒေါ်လာ', km: 'ដុល្លារនូវែលសេឡង់' },
  SEK: { th: 'โครนาสวีเดน', en: 'Swedish Krona', lo: 'ສະວີເດັນໂຄຣນາ', my: 'ဆွီဒင်ခရိုနာ', km: 'ក្រូនស៊ុយអែត' },
  NOK: { th: 'โครนนอร์เวย์', en: 'Norwegian Krone', lo: 'ນໍເວໂຄຣນ', my: 'နော်ဝေခရိုနီ', km: 'ក្រូនន័រវែស' },
  DKK: { th: 'โครนเดนมาร์ก', en: 'Danish Krone', lo: 'ເດນມາກໂຄຣນ', my: 'ဒိန်းမတ်ခရိုနီ', km: 'ក្រូនដាណឺម៉ាក' },
  INR: { th: 'รูปีอินเดีย', en: 'Indian Rupee', lo: 'ຣູປີອີນເດຍ', my: 'အိန္ဒိယရူပီး', km: 'រូពីឥណ្ឌា' },
  IDR: { th: 'รูเปียห์อินโดนีเซีย', en: 'Indonesian Rupiah', lo: 'ຣູເປຍອინໂດເນເຊຍ', my: 'အင်ဒိုនီးရှားရူပီးယား', km: 'រូព្យ៉ាឥណ្ឌូនេស៊ី' },
  MYR: { th: 'ริงกิตมาเลเซีย', en: 'Malaysian Ringgit', lo: 'ຣิงກິດມາເລເຊຍ', my: 'မလေးရှားရင်းဂစ်', km: 'រីងហ្គីតម៉ាឡេស៊ី' },
  PHP: { th: 'เปโซฟิลิปปินส์', en: 'Philippine Peso', lo: 'ເປໂซຟີລິບປິນ', my: 'ဖိလစ်ပိုင်ပီဆို', km: 'ប៉េសូហ្វីលីពីន' },
  VND: { th: 'ดงเวียดนาม', en: 'Vietnamese Dong', lo: 'ດົງຫວຽດນາມ', my: 'ဗီယက်နမ်ဒေါင်', km: 'ដុងវៀតណាម' },
  TWD: { th: 'ดอลลาร์ไต้หวันใหม่', en: 'New Taiwan Dollar', lo: 'ໄຕ້ຫວັນໂດລາ', my: 'တိုင်ဝမ်ဒေါ်လာအသစ်', km: 'ដុល្លារតៃវ៉ាន់ថ្មី' },
  BRL: { th: 'เรียลบราซิล', en: 'Brazilian Real', lo: 'ບຣາຊິນຣຽວ', my: 'ဘရာဇီးရီးယယ်', km: 'រៀលប្រេស៊ីល' },
  MXN: { th: 'เปโซเม็กซิโก', en: 'Mexican Peso', lo: 'ເມັກຊິໂກເປໂຊ', my: 'မက္ကဆီကိုပီဆို', km: 'ប៉េសូម៉ិកស៊ិក' },
  ZAR: { th: 'แรนด์แอฟริกาใต้', en: 'South African Rand', lo: 'ອາຟຣິກາໃຕ້ແຣນ', my: 'တောင်အာဖရိကရန်း', km: 'រ៉ង់អាហ្វ្រិកខាងត្បូង' },
  RUB: { th: 'รูเบิลรัสเซีย', en: 'Russian Ruble', lo: 'ຣັດເຊຍຣູເບິລ', my: 'ရုရှားရူဘယ်', km: 'រូបរុស្ស៊ី' },
  TRY: { th: 'ลีราตุรกี', en: 'Turkish Lira', lo: 'ຕວກກີລີຣາ', my: 'တူရကီလီရာ', km: 'លីរ៉ាទួកគី' },
  SAR: { th: 'ริยัลซาอุดีอาระเบีย', en: 'Saudi Riyal', lo: 'ຊາອຸດີຣິຢັນ', my: 'ဆော်ဒီရီယယ်', km: 'រីយ៉ាល់អារ៉ាប៊ីសាអូឌីត' },
  AED: { th: 'ดีแรฮมสหรัฐอาหรับเอมิเรตส์', en: 'UAE Dirham', lo: 'ສະຫະລັດອາຣັບເອມิເຣດດີແຣມ', my: 'ယူအေအီးဒီရဟမ်', km: 'ឌីរហាមអេមីរ៉ាតអារ៉ាប់រួម' },
  PLN: { th: 'สลอตีโปแลนด์', en: 'Polish Zloty', lo: 'ໂποແລນຊະລໍຕີ', my: 'ပိုလန်ဇလော့တီ', km: 'ហ្ស្លូទីប៉ូឡូញ' },
  CZK: { th: 'โครูนาสาธารณรัฐเช็ก', en: 'Czech Koruna', lo: 'ສາທາລະນະລັດເຊັກໂຄຣູນາ', my: 'ချက်ကိုရူနာ', km: 'កូរូណាឆែក' },
  HUF: { th: 'ฟอรินต์ฮังการี', en: 'Hungarian Forint', lo: 'ຮັງກາຣີຟໍຣິນ', my: 'ဟန်ဂေရီဖိုးရင့်', km: 'ហ្វូរីនហុងគ្រី' },
  ILS: { th: 'เชเกลอิสราเอล', en: 'Israeli Shekel', lo: 'ອິດສະຣາແອນເຊເກລ', my: 'အစ္စရေးရှီကယ်', km: 'ស៊ីគែលអ៊ីស្រាអែល' },
  PKR: { th: 'รูปีปากีสถาน', en: 'Pakistani Rupee', lo: 'ປາກີສະຖານຣູປີ', my: 'ပါကစ္စတန်ရူပီး', km: 'រូពីប៉ាគីស្ថាន' },
  EGP: { th: 'ปอนด์อียิปต์', en: 'Egyptian Pound', lo: 'ອີຢິບປອນ', my: 'အီဂျစ်ပေါင်', km: 'ផោនអេស៊ីប' },
  NGN: { th: 'ไนราไนจีเรีย', en: 'Nigerian Naira', lo: 'ໄນຈີເລຍໄນຣา', my: 'နိုင်ဂျီးရီးယားနိုင်ရာ', km: 'ណៃរ៉ានីហ្សេរីយ៉ា' },
  USDT: { th: 'เทเธอร์ (USDT)', en: 'Tether (USDT)', lo: 'Tether (USDT)', my: 'USDT (Tether)', km: 'Tether (USDT)' },
  THB: { th: 'บาทไทย', en: 'Thai Baht', lo: 'ບາດໄທ', my: 'ထိုင်းဘတ်', km: 'ប្រាក់បាតថៃ' },

}

const PAGE_TEXT: Record<LanguageCode, {
  pairMenuLabel: string
  pairMenuAria: string
  eyebrow: string
  rateDate: (date: string) => string
  rateHelp: (base: CurrencyCode, quote: CurrencyCode) => string
  examplesLabel: string
  summaryAria: string
  pairLabel: string
  fromLabel: string
  toLabel: string
  relatedHeading: string
  languageSuffix: string
}> = {
  th: {
    pairMenuLabel: 'คู่เงินยอดนิยม',
    pairMenuAria: 'เมนูคู่สกุลเงินยอดนิยม',
    eyebrow: 'อัตราแลกเปลี่ยนวันนี้',
    rateDate: date => `เรทอ้างอิง ณ วันที่ ${date}`,
    rateHelp: (base, quote) => `ตัวอย่างการแปลงค่าเงิน ${base} เป็น ${quote} ตามอัตราแลกเปลี่ยนปัจจุบันบน zrate.io`,
    examplesLabel: 'ตัวอย่างการแปลงค่าเงิน',
    summaryAria: 'สรุปคู่สกุลเงิน',
    pairLabel: 'คู่สกุลเงิน',
    fromLabel: 'จากสกุลเงิน',
    toLabel: 'เป็นสกุลเงิน',
    relatedHeading: 'คู่สกุลเงินยอดนิยมอื่นๆ ในระบบ',
    languageSuffix: 'ภาษาไทย',
  },
  en: {
    pairMenuLabel: 'Popular pairs',
    pairMenuAria: 'Popular currency-pair menu',
    eyebrow: 'Today’s exchange rate',
    rateDate: date => `Reference rate on ${date}`,
    rateHelp: (base, quote) => `Currency conversion examples for ${base} to ${quote} based on current reference rates on zrate.io.`,
    examplesLabel: 'Currency conversion examples',
    summaryAria: 'Currency pair summary',
    pairLabel: 'Currency pair',
    fromLabel: 'From currency',
    toLabel: 'To currency',
    relatedHeading: 'Other popular currency pairs',
    languageSuffix: 'English',
  },
  lo: {
    pairMenuLabel: 'ຄູ່ເງິນຍອດນິຍົມ',
    pairMenuAria: 'ເມນູຄູ່ເງິນຍອດນິຍົມ',
    eyebrow: 'ອັດຕາແລກປ່ຽນມື້ນີ້',
    rateDate: date => `ອັດຕາອ້າງອີງ ວັນທີ ${date}`,
    rateHelp: (base, quote) => `ຕົວຢ່າງການແປງ ${base} ເປັນ ${quote} ຕາມອັດຕາແລກປ່ຽນສົດໃນ zrate.io.`,
    examplesLabel: 'ຕົວຢ່າງການແປງເງິນ',
    summaryAria: 'ສະຫຼຸບຄູ່ເງິນ',
    pairLabel: 'ຄູ່ເງິນ',
    fromLabel: 'ຈາກສະກຸນ',
    toLabel: 'ເປັນສະກຸນ',
    relatedHeading: 'ຄູ່ເງິນຍອດນິຍົມອື່ນໃນລະບົບ',
    languageSuffix: 'ພາສາລາວ',
  },
  my: {
    pairMenuLabel: 'လူကြိုက်များသော ငွေကြေးအတွဲများ',
    pairMenuAria: 'လူကြိုက်များသော ငွေကြေးအတွဲ menu',
    eyebrow: 'ယနေ့ ငွေလဲနှုန်း',
    rateDate: date => `ကိုးကားနှုန်း ${date}`,
    rateHelp: (base, quote) => `zrate.io ပေါ်ရှိ လက်ရှိကိုးကားနှုန်းထားများပေါ် မူတည်၍ ${base} မှ ${quote} သို့ ပြောင်းလဲမှု နမူနာများ။`,
    examplesLabel: 'ငွေကြေးပြောင်းလဲမှုဥပမာများ',
    summaryAria: 'ငွေကြေးအတွဲ အကျဉ်းချုပ်',
    pairLabel: 'ငွေကြေးအတွဲ',
    fromLabel: 'မူရင်းငွေကြေး',
    toLabel: 'ပြောင်းမည့်ငွေကြေး',
    relatedHeading: 'အခြားလူကြိုက်များသော ငွေကြေးအတွဲများ',
    languageSuffix: 'မြန်မာ',
  },
  km: {
    pairMenuLabel: 'គូរូបិយប័ណ្ណពេញនិយម',
    pairMenuAria: 'ម៉ឺនុយគូរូបិយប័ណ្ណពេញនិយម',
    eyebrow: 'អត្រាប្តូរប្រាក់ថ្ងៃនេះ',
    rateDate: date => `អត្រាយោង ថ្ងៃទី ${date}`,
    rateHelp: (base, quote) => `ឧទាហរណ៍នៃការបម្លែងរូបិយប័ណ្ណពី ${base} ទៅ ${quote} ផ្អែកលើអត្រាប្តូរប្រាក់បច្ចុប្បន្ននៅ zrate.io។`,
    examplesLabel: 'ឧទាហរណ៍ការបម្លែងរូបិយប័ណ្ណ',
    summaryAria: 'សង្ខេបគូរូបិយប័ណ្ណ',
    pairLabel: 'គូរូបិយប័ណ្ណ',
    fromLabel: 'ពីរូបិយប័ណ្ណ',
    toLabel: 'ទៅរូបិយប័ណ្ណ',
    relatedHeading: 'គូរូបិយប័ណ្ណពេញនិយមផ្សេងទៀត',
    languageSuffix: 'ភាសាខ្មែរ',
  },
}

const META_KEYWORDS: Record<LanguageCode, string[]> = {
  th: ['อัตราแลกเปลี่ยนวันนี้', 'แปลงค่าเงิน', 'ค่าเงินวันนี้'],
  en: ['exchange rate today', 'currency converter', 'live exchange rate'],
  lo: ['ອັດຕาແລກປ່ຽນມື້ນີ້', 'ແປງສະກຸນເງິນ', 'ຄ່າເງິນມື້ນີ້'],
  my: ['ယနေ့ငွေလဲနှုန်း', 'ငွေကြေးပြောင်း', 'တိုက်ရိုက်ငွေလဲနှုန်း'],
  km: ['អត្រាប្តូរប្រាក់ថ្ងៃនេះ', 'បម្លែងរូបិយប័ណ្ណ', 'អត្រាប្តូរប្រាក់ផ្ទាល់'],
}

const USD_RATES: Record<CurrencyCode, number> = {
  AED: 3.67,
  AUD: 1.5,
  BRL: 5.2,
  CAD: 1.37,
  CHF: 0.9,
  CNY: 7.24,
  CZK: 23.0,
  DKK: 6.9,
  EGP: 47.5,
  EUR: 0.92,
  GBP: 0.79,
  HKD: 7.82,
  HUF: 365.0,
  IDR: 16300.0,
  ILS: 3.7,
  INR: 83.5,
  JPY: 149.5,
  KHR: 4100.0,
  KRW: 1325.0,
  LAK: 21000.0,
  MMK: 2100.0,
  MXN: 18.0,
  MYR: 4.71,
  NGN: 1500.0,
  NOK: 10.6,
  NZD: 1.63,
  PHP: 58.5,
  PKR: 278.0,
  PLN: 4.0,
  RUB: 90.0,
  SAR: 3.75,
  SEK: 10.5,
  SGD: 1.34,
  THB: 35.2,
  TRY: 32.5,
  TWD: 32.3,
  USD: 1.0,
  USDT: 1.0,
  VND: 25400.0,
  ZAR: 18.5,
}

const EXAMPLE_AMOUNTS = [1, 10, 100, 1000]

function parsePair(pair: string) {
  const [base, quote] = pair.toUpperCase().split('-') as [CurrencyCode, CurrencyCode]
  if (!base || !quote || !CURRENCY_NAMES[base] || !CURRENCY_NAMES[quote]) return null
  return { base, quote }
}

function getPairTitle(pair: string, lang: LanguageCode, rate: number, dateStr: string) {
  const parsed = parsePair(pair)
  if (!parsed) return ''
  const content = getPairContent(pair, lang, rate, dateStr)
  return content.h2
}

const CONVERSION_AMOUNTS_BASE = [1, 5, 10, 25, 50, 100, 500, 1000, 5000, 10000]
const CONVERSION_AMOUNTS_QUOTE = [1, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000]

const STATS_TEXT: Record<LanguageCode, {
  statsTitle: string
  high30d: string
  low30d: string
  avg30d: string
  volatility: string
  volatilityLow: string
  volatilityMed: string
  volatilityHigh: string
  tableBaseToQuoteTitle: (base: string, quote: string) => string
  tableQuoteToBaseTitle: (quote: string, base: string) => string
  faqTitle: string
}> = {
  th: {
    statsTitle: 'สถิติอัตราแลกเปลี่ยนย้อนหลัง 30 วัน',
    high30d: 'ราคาสูงสุด (30 วัน)',
    low30d: 'ราคาต่ำสุด (30 วัน)',
    avg30d: 'ค่าเฉลี่ย (30 วัน)',
    volatility: 'ความผันผวน',
    volatilityLow: 'ต่ำ',
    volatilityMed: 'ปานกลาง',
    volatilityHigh: 'สูง',
    tableBaseToQuoteTitle: (base, quote) => `ตารางคำนวณเงิน ${base} เป็น ${quote}`,
    tableQuoteToBaseTitle: (quote, base) => `ตารางคำนวณเงิน ${quote} เป็น ${base}`,
    faqTitle: 'คำถามที่พบบ่อย (FAQs)',
  },
  en: {
    statsTitle: '30-Day Historical Exchange Statistics',
    high30d: '30-Day High',
    low30d: '30-Day Low',
    avg30d: '30-Day Average',
    volatility: 'Volatility',
    volatilityLow: 'Low',
    volatilityMed: 'Medium',
    volatilityHigh: 'High',
    tableBaseToQuoteTitle: (base, quote) => `${base} to ${quote} Conversion Table`,
    tableQuoteToBaseTitle: (quote, base) => `${quote} to ${base} Conversion Table`,
    faqTitle: 'Frequently Asked Questions (FAQs)',
  },
  lo: {
    statsTitle: 'ສະຖິຕິອັດຕາແລກປ່ຽນຍ້ອນຫຼັງ 30 ວັນ',
    high30d: 'ລາຄາສູງສຸດ (30 ວັນ)',
    low30d: 'ລາຄາຕ່ຳສຸດ (30 ວັນ)',
    avg30d: 'ຄ່າສະເລ່ຍ (30 ວັນ)',
    volatility: 'ຄວາມຜັນຜວນ',
    volatilityLow: 'ຕ່ຳ',
    volatilityMed: 'ປານກາງ',
    volatilityHigh: 'ສູງ',
    tableBaseToQuoteTitle: (base, quote) => `ຕາຕະລາງການແປງເງິນ ${base} ເປັນ ${quote}`,
    tableQuoteToBaseTitle: (quote, base) => `ຕາຕະລາງການແປງເງິນ ${quote} ເປັນ ${base}`,
    faqTitle: 'ຄໍາຖາມທີ່ພົບເລື້ອຍ (FAQs)',
  },
  my: {
    statsTitle: '၃၀ ရက်အတွင်း ငွေလဲနှုန်းဆိုင်ရာ စာရင်းအင်းများ',
    high30d: '၃၀ ရက်အတွင်း အမြင့်ဆုံးနှုန်း',
    low30d: '၃၀ ရက်အတွင်း အနိမ့်ဆုံးနှုန်း',
    avg30d: '၃၀ ရက်အတွင်း ပျမ်းမျှနှုန်း',
    volatility: 'ပြောင်းလဲမှုနှုန်း',
    volatilityLow: 'နည်းသည်',
    volatilityMed: 'အလယ်အလတ်',
    volatilityHigh: 'များသည်',
    tableBaseToQuoteTitle: (base, quote) => `${base} မှ ${quote} သို့ ပြောင်းလဲခြင်းဇယား`,
    tableQuoteToBaseTitle: (quote, base) => `${quote} မှ ${base} သို့ ပြောင်းလဲခြင်းဇယား`,
    faqTitle: 'မေးလေ့ရှိသော မေးခွန်းများ (FAQs)',
  },
  km: {
    statsTitle: 'ស្ថិតិអត្រាប្តូរប្រាក់យោង ៣០ ថ្ងៃ',
    high30d: 'តម្លៃខ្ពស់បំផុត (៣០ ថ្ងៃ)',
    low30d: 'តម្លៃទាបបំផុត (៣០ ថ្ងៃ)',
    avg30d: 'តម្លៃមធ្យម (៣០ ថ្ងៃ)',
    volatility: 'ការប្រែប្រួល',
    volatilityLow: 'ទាប',
    volatilityMed: 'មធ្យម',
    volatilityHigh: 'ខ្ពស់',
    tableBaseToQuoteTitle: (base, quote) => `តារាងបម្លែងប្រាក់ ${base} ទៅ ${quote}`,
    tableQuoteToBaseTitle: (quote, base) => `តារាងបម្លែងប្រាក់ ${quote} ទៅ ${base}`,
    faqTitle: 'សំណួរដែលគេសួរញឹកញាប់ (FAQs)',
  },
}

function getPairDescription(pair: string, lang: LanguageCode, rate: number, dateStr: string) {
  const content = getPairContent(pair, lang, rate, dateStr)
  return content.p1
}

function formatMoney(value: number, currency: CurrencyCode, lang: LanguageCode) {
  const locale = LOCALE_BY_LANGUAGE[lang]
  if (value >= 1000000) return value.toLocaleString(locale, { maximumFractionDigits: 0 })
  if (value >= 1000) return value.toLocaleString(locale, { maximumFractionDigits: 2 })
  if (value >= 1) return value.toLocaleString(locale, { maximumFractionDigits: 4 })
  return value.toFixed(6)
}

function formatDate(date: Date, lang: LanguageCode) {
  return date.toLocaleDateString(LOCALE_BY_LANGUAGE[lang], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  })
}

// Server-side rates fetcher with cache revalidation
async function fetchServerRates(base: string): Promise<{ rates: Record<string, number>; timestamp: Date }> {
  const apiBase = base === 'USDT' ? 'USD' : base
  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${apiBase}`, {
      next: { revalidate: 300 } // revalidate every 5 minutes
    })
    if (!res.ok) throw new Error('API failed')
    const data = await res.json()
    const rates = data.rates || {}
    rates['USDT'] = rates['USD'] || 1
    const ts = data.time_last_updated ? new Date(data.time_last_updated * 1000) : new Date()
    return { rates, timestamp: ts }
  } catch (err) {
    console.error('Failed server fetch, fallback to mock rates', err)
    const mock: Record<string, number> = { ...USD_RATES }
    const baseValue = mock[base as CurrencyCode] || 1
    const normalized: Record<string, number> = {}
    Object.entries(mock).forEach(([k, v]) => {
      normalized[k] = v / baseValue
    })
    return { rates: normalized, timestamp: new Date() }
  }
}

export const dynamic = 'force-dynamic'
export const dynamicParams = false

export function generateStaticParams() {
  const params: Array<{ locale: string; pair: string }> = []
  for (const locale of LOCALES) {
    for (const pair of PAIRS) {
      params.push({ locale, pair })
    }
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; pair: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const lang = (LOCALES.includes(resolvedParams.locale) ? resolvedParams.locale : 'th') as LanguageCode
  if (!PAIRS.includes(resolvedParams.pair as typeof PAIRS[number])) return {}

  const parsed = parsePair(resolvedParams.pair)
  if (!parsed) return {}

  const { rates, timestamp } = await fetchServerRates(parsed.base)
  const rate = rates[parsed.quote] || (USD_RATES[parsed.quote] / USD_RATES[parsed.base])
  const dateStr = formatDate(timestamp, lang)

  const title = getPairTitle(resolvedParams.pair, lang, rate, dateStr)
  const description = getPairDescription(resolvedParams.pair, lang, rate, dateStr)
  
  const prefix = lang === 'th' ? '' : `/${lang}`

  const langAlternates: Record<string, string> = {}
  LOCALES.forEach(loc => {
    langAlternates[loc] = loc === 'th' ? `/${resolvedParams.pair}` : `/${loc}/${resolvedParams.pair}`
  })
  langAlternates['x-default'] = `/${resolvedParams.pair}`

  return {
    title,
    description,
    keywords: [
      title,
      resolvedParams.pair,
      resolvedParams.pair.toUpperCase(),
      ...META_KEYWORDS[lang],
    ],
    alternates: {
      canonical: `${prefix}/${resolvedParams.pair}`,
      languages: langAlternates,
    },
    openGraph: {
      title,
      description,
      url: `${prefix}/${resolvedParams.pair}`,
      siteName: 'zrate.io',
      type: 'article',
      locale: lang === 'th' ? 'th_TH' : lang === 'en' ? 'en_US' : lang === 'lo' ? 'lo_LA' : lang === 'my' ? 'my_MM' : 'km_KH',
      alternateLocale: LOCALES.filter(l => l !== lang).map(l => 
        l === 'th' ? 'th_TH' : l === 'en' ? 'en_US' : l === 'lo' ? 'lo_LA' : l === 'my' ? 'my_MM' : 'km_KH'
      ),
      images: [{ url: '/og-image.png', width: 1024, height: 1024, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
  }
}

export default async function PairPage({ params }: { params: Promise<{ locale: string; pair: string }> }) {
  const resolvedParams = await params
  const lang = (LOCALES.includes(resolvedParams.locale) ? resolvedParams.locale : 'th') as LanguageCode
  if (!PAIRS.includes(resolvedParams.pair as typeof PAIRS[number])) notFound()

  const parsed = parsePair(resolvedParams.pair)
  if (!parsed) notFound()

  const { rates, timestamp } = await fetchServerRates(parsed.base)
  const rate = rates[parsed.quote] || (USD_RATES[parsed.quote] / USD_RATES[parsed.base])
  const dateStr = formatDate(timestamp, lang)

  const pageText = PAGE_TEXT[lang] || PAGE_TEXT.th
  const content = getPairContent(resolvedParams.pair, lang, rate, dateStr)
  const pairTitle = content.h2
  const pairDescription = content.p1
  
  const prefix = lang === 'th' ? '' : `/${lang}`
  const related = PAIRS.filter(pair => pair !== resolvedParams.pair)
  const indicativeRate = rate
  const updatedDate = dateStr

  // Fetch historical rates (365 days) and live currency news
  const history = await fetchHistoricalRates(parsed.base, parsed.quote, 365)
  const news = await fetchCurrencyNews(parsed.base, parsed.quote)

  const history30d = history.slice(-30)
  const ratesArray = history30d.map(p => p.rate)

  const statsText = STATS_TEXT[lang] || STATS_TEXT.th
  const high30d = ratesArray.length > 0 ? Math.max(...ratesArray) : rate * 1.025
  const low30d = ratesArray.length > 0 ? Math.min(...ratesArray) : rate * 0.975
  const avg30d = ratesArray.length > 0 ? ratesArray.reduce((sum, r) => sum + r, 0) / ratesArray.length : rate * 1.002
  const getVolatility = () => {
    if (ratesArray.length > 0) {
      const pctRange = ((high30d - low30d) / avg30d) * 100
      if (pctRange > 5) return statsText.volatilityHigh
      if (pctRange > 2) return statsText.volatilityMed
      return statsText.volatilityLow
    }
    if (['usd-thb', 'usdt-thb', 'eur-usd'].includes(resolvedParams.pair)) return statsText.volatilityLow
    if (['thb-lak', 'thb-mmk', 'usd-lak', 'usd-mmk'].includes(resolvedParams.pair)) return statsText.volatilityHigh
    return statsText.volatilityMed
  }

  // Structured Data Schema.org
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': lang === 'th' ? 'หน้าแรก' : lang === 'lo' ? 'ໜ້າຫຼັກ' : lang === 'my' ? 'ပင်မစာမျက်နှာ' : lang === 'km' ? 'ទំព័រដើម' : 'Home',
        'item': `${SITE_URL}${prefix}/`
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': `${parsed.base}/${parsed.quote}`,
        'item': `${SITE_URL}${prefix}/${resolvedParams.pair}`
      }
    ]
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': content.faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  }

  return (
    <main className={styles.page} lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PairTopBar
        lang={lang}
        title={pairTitle}
        description={pairDescription}
      />

      <nav className={styles.pairMenu} aria-label={pageText.pairMenuAria}>
        <span className={styles.pairMenuLabel}>{pageText.pairMenuLabel}</span>
        <div className={styles.pairTickerViewport}>
          <div className={styles.relatedLinks}>
            {[...PAIRS, ...PAIRS].map((pair, index) => (
              <Link
                href={`${prefix}/${pair}`}
                key={`${pair}-${index}`}
                className={pair === resolvedParams.pair && index === 0 ? styles.activePair : ''}
                aria-current={pair === resolvedParams.pair && index === 0 ? 'page' : undefined}
              >
                {pair.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <ResponsiveBannerAd />

      <section className={styles.hero}>
        <p className={styles.eyebrow}>{pageText.eyebrow} · {resolvedParams.pair.toUpperCase()}</p>
        <h1>{pairTitle}</h1>
        <p className={styles.lead}>{pairDescription}</p>
      </section>

      <section className={styles.ratePanel} aria-labelledby="today-rate-heading">
        <div>
          <p className={styles.rateDate}>{pageText.rateDate(updatedDate)}</p>
          <h2 id="today-rate-heading">
            1 {parsed.base} = {formatMoney(indicativeRate, parsed.quote, lang)} {parsed.quote}
          </h2>
          <p>{pageText.rateHelp(parsed.base, parsed.quote)}</p>
        </div>
        <div className={styles.exampleGrid} aria-label={pageText.examplesLabel}>
          {EXAMPLE_AMOUNTS.map(amount => (
            <div className={styles.exampleCard} key={amount}>
              <span className={styles.exampleFrom}>
                {amount.toLocaleString(LOCALE_BY_LANGUAGE[lang])} {parsed.base}
              </span>
              <span className={styles.exampleEquals}>=</span>
              <strong>
                {formatMoney(amount * indicativeRate, parsed.quote, lang)} {parsed.quote}
              </strong>
            </div>
          ))}
        </div>
      </section>

      {history.length > 0 && (
        <section className={styles.chartSection} aria-label="Exchange Rate Chart">
          <div className={styles.chartHeader}>
            <h3>
              {lang === 'th' ? `กราฟประวัติอัตราแลกเปลี่ยน ${parsed.base}/${parsed.quote}`
               : lang === 'en' ? `${parsed.base}/${parsed.quote} Historical Rate Chart`
               : lang === 'lo' ? `ກຣາບປະຫວັດອັດຕາແລກປ່ຽນ ${parsed.base}/${parsed.quote}`
               : lang === 'my' ? `${parsed.base}/${parsed.quote} ငွေလဲနှုန်းပြောင်းလဲမှုဇယား`
               : `គំនូសតាងប្រវត្តិនៃអត្រាប្តូរប្រាក់ ${parsed.base}/${parsed.quote}`}
            </h3>
            <div className={styles.chartSub}>
              {lang === 'th' ? `แสดงความเคลื่อนไหวและมูลค่าของสกุลเงิน ${parsed.base} เทียบกับ ${parsed.quote} ตามช่วงเวลา`
               : lang === 'en' ? `Shows value fluctuations of ${parsed.base} against ${parsed.quote} over selected time periods`
               : lang === 'lo' ? `ສະແດງການເຫນັງຕີງ ແລະມູນຄ່າຂອງສະກຸນເງິນ ${parsed.base} ທຽບກັບ ${parsed.quote} ຕາມໄລຍะເວລາ`
               : lang === 'my' ? `သတ်မှတ်ထားသော ကာလအပိုင်းအခြားအလိုက် ${parsed.base} နှင့် ${parsed.quote} ငွေလဲနှုန်း အပြောင်းအလဲများကို ဖော်ပြချက်`
               : `បង្ហាញការប្រែប្រួលតម្លៃនៃ ${parsed.base} ធៀបនឹង ${parsed.quote} ទៅតាមរយៈពេលកំណត់`}
            </div>
          </div>
          <InteractiveChart history={history} lang={lang} baseSymbol={parsed.base} quoteSymbol={parsed.quote} />
        </section>
      )}

      <section className={styles.summaryGrid} aria-label={pageText.summaryAria}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>{pageText.pairLabel}</span>
          <span className={styles.summaryValue}>{parsed.base}/{parsed.quote}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>{pageText.fromLabel}</span>
          <span className={styles.summaryValue}>{CURRENCY_NAMES[parsed.base][lang]}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>{pageText.toLabel}</span>
          <span className={styles.summaryValue}>{CURRENCY_NAMES[parsed.quote][lang]}</span>
        </div>
      </section>

      <section className={styles.statsSection} aria-labelledby="stats-heading">
        <h2 id="stats-heading">{statsText.statsTitle} ({parsed.base}/{parsed.quote})</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statsCard}>
            <span className={styles.statsLabel}>{statsText.high30d}</span>
            <strong className={styles.statsValue}>{formatMoney(high30d, parsed.quote, lang)} {parsed.quote}</strong>
          </div>
          <div className={styles.statsCard}>
            <span className={styles.statsLabel}>{statsText.low30d}</span>
            <strong className={styles.statsValue}>{formatMoney(low30d, parsed.quote, lang)} {parsed.quote}</strong>
          </div>
          <div className={styles.statsCard}>
            <span className={styles.statsLabel}>{statsText.avg30d}</span>
            <strong className={styles.statsValue}>{formatMoney(avg30d, parsed.quote, lang)} {parsed.quote}</strong>
          </div>
          <div className={styles.statsCard}>
            <span className={styles.statsLabel}>{statsText.volatility}</span>
            <strong className={styles.statsValue}>{getVolatility()}</strong>
          </div>
        </div>
      </section>

      <section className={styles.tablesSection} aria-label="Conversion Tables">
        <div className={styles.tablesGrid}>
          <div className={styles.tableCard}>
            <h3>{statsText.tableBaseToQuoteTitle(parsed.base, parsed.quote)}</h3>
            <table className={styles.conversionTable}>
              <thead>
                <tr>
                  <th>{parsed.base}</th>
                  <th>{parsed.quote}</th>
                </tr>
              </thead>
              <tbody>
                {CONVERSION_AMOUNTS_BASE.map(amt => (
                  <tr key={amt}>
                    <td>{amt.toLocaleString(LOCALE_BY_LANGUAGE[lang])} {parsed.base}</td>
                    <td><strong>{formatMoney(amt * rate, parsed.quote, lang)} {parsed.quote}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.tableCard}>
            <h3>{statsText.tableQuoteToBaseTitle(parsed.quote, parsed.base)}</h3>
            <table className={styles.conversionTable}>
              <thead>
                <tr>
                  <th>{parsed.quote}</th>
                  <th>{parsed.base}</th>
                </tr>
              </thead>
              <tbody>
                {CONVERSION_AMOUNTS_QUOTE.map(amt => (
                  <tr key={amt}>
                    <td>{amt.toLocaleString(LOCALE_BY_LANGUAGE[lang])} {parsed.quote}</td>
                    <td><strong>{formatMoney(amt * (1 / rate), parsed.base, lang)} {parsed.base}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
            </section>

      <AseanDashboard lang={lang} />

      <NewsFeed news={news} lang={lang} baseSymbol={parsed.base} quoteSymbol={parsed.quote} />  <NativeBannerAd />

      <section className={styles.langGrid} aria-label={`${pageText.languageSuffix} ${parsed.base}/${parsed.quote}`}>
        <article className={styles.contentCard} lang={lang}>
          <h2>{content.h2}</h2>
          <p>{content.p1}</p>
          <p>{content.p2}</p>
          <ul>
            {content.points.map(point => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p>{pageText.languageSuffix} · {parsed.base}/{parsed.quote}</p>
        </article>
      </section>

      <section className={styles.faqSection} aria-labelledby="faq-section-heading">
        <h2 id="faq-section-heading">{statsText.faqTitle}</h2>
        <div className={styles.faqList}>
          {content.faqs.map((faq, index) => (
            <details className={styles.faqItem} key={index} open={index === 0}>
              <summary className={styles.faqQuestion}>{faq.question}</summary>
              <div className={styles.faqAnswer}>
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.related}>
        <h2>{pageText.relatedHeading}</h2>
        <div className={styles.relatedLinks}>
          {related.map(pair => (
            <Link href={`${prefix}/${pair}`} key={pair}>
              {pair.toUpperCase()}
            </Link>
          ))}
        </div>
      </section>

      <Footer lang={lang} />
    </main>
  )
}
