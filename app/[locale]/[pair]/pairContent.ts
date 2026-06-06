export interface PairContent {
  h2: string
  p1: string
  p2: string
  points: string[]
  faqs: Array<{ question: string; answer: string }>
}

type LanguageCode = 'th' | 'en' | 'lo' | 'my' | 'km'

const CURRENCY_NAMES: Record<string, Record<LanguageCode, string>> = {
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

const SPECIFIC_FACTORS: Record<string, Record<LanguageCode, string>> = {
  USD: {
    th: 'นโยบายอัตราดอกเบี้ยของธนาคารกลางสหรัฐฯ (Fed) สภาพคล่องทางเศรษฐกิจโลก และการลงทุนในสินทรัพย์ปลอดภัย',
    en: 'Monetary policy decisions by the Federal Reserve (Fed), global economic sentiment, and safe-haven investment flows.',
    lo: 'ນະໂຍບາຍອັດຕາດອກເບ້ຍຂອງທະນາຄານກາງສະຫະລັດ (Fed), ສະພາບຄ່ອງທາງເສດຖະກິດໂລກ ແລະການລົງທຶນ.',
    my: 'အမေရိကန်ဗဟိုဘဏ် (Fed) ၏ အတိုးနှုန်းမူဝါဒများ၊ ကမ္ဘာ့စီးပွားရေး အခြေအနေနှင့် ရင်းနှီးမြှုပ်နှံမှုစီးဆင်းမှုများ။',
    km: 'ការសម្រេចចិត្តលើគោលនយោបាយរូបិយវត្ថុរបស់ធនាគារកណ្តាលអាមេរិក (Fed) និងលំហូរវិនិយោគទ្រព្យសកម្មសុវត្ថិភាព។',
  },
  THB: {
    th: 'ภาคการท่องเที่ยวของไทย การส่งออกสินค้าเกษตรและอุตสาหกรรม และนโยบายดอกเบี้ยของธนาคารแห่งประเทศไทย (ธปท.)',
    en: 'Thailand\'s tourism sector, export volumes of agricultural and industrial goods, and interest rate policies of the Bank of Thailand.',
    lo: 'ພາກການທ່ອງທ່ຽວຂອງໄທ, ການສົ່ງອອກສິນຄ້າ ແລະນະໂຍບາຍດອກເບ້ຍຂອງທະນາຄານແຫ່ງປະເທດໄທ.',
    my: 'ထိုင်းနိုင်ငံ၏ ခရီးသွားလုပ်ငန်း၊ စိုက်ပျိုးရေးနှင့် စက်မှုထုတ်ကုန် တင်ပို့မှုနှင့် ထိုင်းဗဟိုဘဏ်၏ မူဝါဒများ။',
    km: 'វិស័យទេសចរណ៍របស់ប្រទេសថៃ បរិមាណនាំចេញកសិផលនិងឧស្សាហកម្ម និងគោលនយោបាយអត្រាការប្រាក់របស់ធនាគារកណ្តាលថៃ។',
  },
  USDT: {
    th: 'อุปสงค์ในตลาดคริปโตเคอเรนซี การตรึงมูลค่า 1:1 กับเงินดอลลาร์ และกฎระเบียบของสินทรัพย์ดิจิทัล',
    en: 'Global cryptocurrency market demand, maintenance of its 1:1 USD peg, and regulatory developments in digital assets.',
    lo: 'ຄວາມຕ້ອງການໃນຕະຫຼາດຄຣິບໂຕ, ການຄ້ຳປະກັນມູນຄ່າ 1:1 ກັບເງິນໂດລາ ແລະກົດໝາຍສິນຊັບດິຈິຕອນ.',
    my: 'ခရစ်ပတိုဈေးကွက်ဝယ်လိုအား၊ အမေရိကန်ဒေါ်လာနှင့် ၁:၁ တန်ဖိုးထိန်းသိမ်းမှုနှင့် ဒစ်ဂျစ်တယ်ပိုင်ဆိုင်မှု စည်းမျဉ်းများ။',
    km: 'តម្រូវការទីផ្សារគ្រីបតូទូទាំងពិភពលោក ការរក្សាតម្លៃស្មើនឹងដុល្លារ ១:១ និងបទប្បញ្ញត្តិទ្រព្យសកម្មឌីជីថល។',
  },
  LAK: {
    th: 'อัตราเงินเฟ้อภายใน สปป.ลาว หนี้สินต่างประเทศ และความสมดุลของเงินตราต่างประเทศสำรองในธนาคารกลาง',
    en: 'Domestic inflation rates in Laos, external public debt levels, and the foreign currency reserves of the Bank of the Lao PDR.',
    lo: 'ອັດຕາເງິນເຟີ້ພາຍໃນປະເທດ, ໜີ້ສິນຕ່າງປະເທດ ແລະຄັງສຳຮອງເງິນຕາຕ່າງປະເທດຂອງທະນາຄານແຫ່ງ ສປປ ລາວ.',
    my: 'လာအိုနိုင်ငံတွင်း ငွေဖောင်းပွမှုနှုန်း၊ နိုင်ငံခြားကြွေးမြီနှင့် လာအိုဗဟိုဘဏ်၏ နိုင်ငံခြားသုံးငွေသီးသန့်အရန်ငွေ။',
    km: 'អត្រាអតិផរណាក្នុងស្រុកឡាវ កម្រិតបំណុលសាធារណៈក្រៅប្រទេស និងទុនបំរុងរូបិយប័ណ្ណបរទេសរបស់ធនាគារកណ្តាលឡាវ។',
  },
  MMK: {
    th: 'สถานการณ์การเมืองและการปกครองภายในประเทศ นโยบายจำกัดเงินตราต่างประเทศ และการค้าตามแนวชายแดนไทย-เมียนมา',
    en: 'Domestic political situation, foreign exchange restrictions by the central bank, and border trade volumes between Thailand and Myanmar.',
    lo: 'ສະຖານະການພາຍໃນປະເທດ, ມາດຕະການຄວບຄຸມເງິນຕາຕ່າງປະເທດ ແລະການຄ້າຊາຍແດນ ໄທ-ມຽນມາ.',
    my: 'ပြည်တွင်းနိုင်ငံရေးအခြေအနေ၊ ဗဟိုဘဏ်၏ နိုင်ငံခြားသုံးငွေ ကန့်သတ်ချက်များနှင့် ထိုင်း-မြန်မာ နယ်စပ်ကုန်သွယ်ရေး။',
    km: 'ស្ថានភាពនយោបាយក្នុងស្រុក ការរឹតបន្តឹងរូបិយប័ណ្ណបរទេសដោយធនាគារកណ្តាល និងពាណិជ្ជកម្មព្រំដែនថៃ-មីយ៉ាន់ម៉ា។',
  },
  KHR: {
    th: 'การใช้จ่ายคู่เงินดอลลาร์ในประเทศ (Dollarization) ปริมาณการท่องเที่ยว และการค้าระหว่างประเทศเพื่อนบ้าน',
    en: 'The level of dollarization in Cambodia, tourism recovery, and trade activities with neighboring countries.',
    lo: 'ການໃຊ້ເງິນໂດລາໃນປະເທດ (Dollarization), ພາກການທ່ອງທ່ຽວ ແລະການຄ້າກັບປະເທດໃກ້ຄຽງ.',
    my: 'ကမ္ဘောဒီးယားနိုင်ငံအတွင်း အမေရိကန်ဒေါ်လာသုံးစွဲမှုအဆင့်၊ ခရီးသွားလုပ်ငန်း ပြန်လည်ဦးမော့လာမှုနှင့် အိမ်နီးချင်းကုန်သွယ်ရေး။',
    km: 'កម្រិតនៃការប្រើប្រាស់ប្រាក់ដុល្លារក្នុងប្រទេស (Dollarization) វិស័យទេសចរណ៍ និងពាណិជ្ជកម្មជាមួយប្រទេសជិតខាង។',
  },
  EUR: {
    th: 'ดัชนีชี้วัดเศรษฐกิจของกลุ่มยูโรโซน และแนวทางอัตราดอกเบี้ยของธนาคารกลางยุโรป (ECB)',
    en: 'Economic indicators of the Eurozone block and the monetary policy stance of the European Central Bank (ECB).',
    lo: 'ຕົວຊີ້ວັດເສດຖະກິດຂອງກຸ່ມຢູໂຣໂຊນ ແລະນະໂຍບາຍດອກເບ້ຍຂອງທະນາຄານກາງຢູໂຣບ (ECB).',
    my: 'ယူရိုဇုန်စီးပွားရေးညွှန်းကိန်းများနှင့် ဥရောပဗဟိုဘဏ် (ECB) ၏ အတိုးနှုန်းမူဝါဒများ။',
    km: 'សូចនាករសេដ្ឋកិច្ចនៃតំបន់អឺរ៉ូ និងគោលនយោបាយរូបិយវត្ថុរបស់ធនាគារកណ្តាលអឺរ៉ុប (ECB)។',
  },
  JPY: {
    th: 'การควบคุมเส้นอัตราผลตอบแทน (YCC) ของธนาคารกลางญี่ปุ่น (BOJ) และบทบาทสกุลเงินปลอดภัยในระดับสากล',
    en: 'Yield Curve Control (YCC) policies by the Bank of Japan (BOJ) and JPY\'s status as a global safe-haven asset.',
    lo: 'ນະໂຍບາຍອັດຕາດອກເບ້ຍຂອງທະນາຄານກາງຍີ່ປຸ່ນ (BOJ) ແລະສະຖານະເງິນເຢນທີ່ເປັນສິນຊັບປອດໄພ.',
    my: 'ဂျပန်ဗဟိုဘဏ် (BOJ) ၏ မူဝါဒများနှင့် ဂျပန်ယန်း၏ ကမ္ဘာ့ဘေးကင်းသော ရင်းနှီးမြှုပ်နှံမှုအဖြစ် ရပ်တည်ချက်။',
    km: 'គោលនយោបាយគ្រប់គ្រងអត្រាផលตอบแทนរបស់ធនាគារកណ្តាលជប៉ុន (BOJ) និងឋានៈជាទ្រព្យសកម្មសុវត្ថិភាពសកល។',
  },
}

export function getPairContent(pair: string, lang: string, rate: number, dateStr: string): PairContent {
  const code = (lang === 'la' ? 'lo' : lang === 'kh' ? 'km' : lang) as LanguageCode
  const parts = pair.toUpperCase().split('-')
  const base = parts[0] || 'USD'
  const quote = parts[1] || 'THB'
  
  const baseName = CURRENCY_NAMES[base]?.[code] || base
  const quoteName = CURRENCY_NAMES[quote]?.[code] || quote
  
  const formattedRate = rate.toLocaleString(code === 'th' ? 'th-TH' : code === 'en' ? 'en-US' : code === 'lo' ? 'lo-LA' : code === 'my' ? 'my-MM' : 'km-KH', {
    maximumFractionDigits: rate >= 100 ? 2 : 4
  })

  // Hand-crafted overrides for the main popular pairs
  if (pair === 'usd-thb') {
    return {
      h2: code === 'th' ? 'อัตราแลกเปลี่ยนดอลลาร์สหรัฐ เป็น บาทไทยวันนี้ (USD/THB)' :
          code === 'en' ? 'US Dollar to Thai Baht Exchange Rate (USD/THB)' :
          code === 'lo' ? 'ອັດຕາແລກປ່ຽນ ໂດລາສະຫະລັດ ເປັນ ບາດໄທ (USD/THB)' :
          code === 'my' ? 'အမေရိကန်ဒေါ်လာမှ ထိုင်းဘတ် ငွေလဲနှုန်း (USD/THB)' :
          'អត្រាប្តូរប្រាក់ ដុល្លារអាមេរិក ទៅ ប្រាក់បាតថៃ (USD/THB)',
      p1: code === 'th' ? `คู่เงิน USD/THB เป็นคู่สกุลเงินที่มีการซื้อขายสูงสุดในประเทศไทย ใช้เป็นเกณฑ์อ้างอิงสำหรับการค้าระหว่างประเทศ การส่งออกนำเข้า และการท่องเที่ยว โดยราคาล่าสุดในระบบอยู่ที่ 1 USD = ${formattedRate} THB ซึ่งบันทึกข้อมูลเมื่อ ${dateStr}` :
          code === 'en' ? `The USD/THB currency pair is the primary exchange rate for business transactions, international trade, and tourism in Thailand. The current rate is 1 USD = ${formattedRate} THB as of ${dateStr}.` :
          code === 'lo' ? `ຄູ່ເງິນ USD/THB ແມ່ນຄູ່ອັດຕາແລກປ່ຽນຫຼັກສຳລັບການຄ້າ, ການທ່ອງທ່ຽວ ແລະການເຮັດທຸລະກຳລະຫວ່າງປະເທດ ໂດຍເລດລ່າສຸດແມ່ນ 1 USD = ${formattedRate} THB ວັນທີ ${dateStr}.` :
          code === 'my' ? `USD/THB အတွဲသည် ထိုင်းနိုင်ငံ၏ နိုင်ငံတကာကုန်သွယ်မှုနှင့် ခရီးသွားလုပ်ငန်းအတွက် အဓိကငွေလဲနှုန်းဖြစ်သည်။ လက်ရှိနှုန်းမှာ ၁ ဒေါ်လာ = ${formattedRate} ဘတ် ဖြစ်ပြီး ${dateStr} တွင် အပ်ဒိတ်လုပ်ထားသည်။` :
          `គូរូបិយប័ណ្ណ USD/THB គឺជាអត្រាប្តូរប្រាក់ចម្បងសម្រាប់ពាណិជ្ជកម្ម និងទេសចរណ៍នៅក្នុងប្រទេសថៃ។ អត្រាបច្ចុប្បន្នគឺ 1 USD = ${formattedRate} THB គិតត្រឹមថ្ងៃទី ${dateStr}។`,
      p2: code === 'th' ? `ปัจจัยทางเศรษฐกิจที่มีผลต่อคู่นี้อย่างมากคือ ส่วนต่างของอัตราดอกเบี้ยนโยบายระหว่างธนาคารกลางสหรัฐฯ (Fed) และธนาคารแห่งประเทศไทย รวมถึงดุลบัญชีเดินสะพัดและจำนวนนักท่องเที่ยวชาวต่างชาติที่เดินทางเข้ามายังประเทศไทย` :
          code === 'en' ? `Key drivers include interest rate differentials set by the Federal Reserve and the Bank of Thailand, regional capital flows, and Thailand's current account balance, which is heavily influenced by tourism revenue.` :
          code === 'lo' ? `ປັດໄຈທີ່ສົ່ງຜົນກະທົບແມ່ນສ່ວນຕ່າງດອກເບ້ຍຂອງ Fed ແລະ ທະນາຄານແຫ່ງປະເທດໄທ, ລວມເຖິງດຸນການຄ້າ ແລະຈຳນວນນັກທ່ອງທ່ຽວທີ່ເຂົ້າມາໄທ.` :
          code === 'my' ? `အဓိကသက်ရောက်မှုများမှာ အမေရိကန်ဗဟိုဘဏ်နှင့် ထိုင်းဗဟိုဘဏ်တို့၏ အတိုးနှုန်းကွာခြားချက်များ၊ ဒေသတွင်း ရင်းနှီးမြှုပ်နှံမှု စီးဆင်းမှုများနှင့် ခရီးသွားလုပ်ငန်းမှ ရရှိသော ဝင်ငွေများ ဖြစ်သည်။` :
          `កត្តាជំរុញសំខាន់ៗរួមមាន ភាពខុសគ្នានៃអត្រាការប្រាក់រវាង Fed និងធនាគារកណ្តាលថៃ លំហូរទុនក្នុងតំបន់ និងជញ្ជីងទូទាត់ចរន្តរបស់ថៃ ដែលរងឥទ្ធិពលខ្លាំងពីទេសចរណ៍។`,
      points: code === 'th' ? [
        `ตรวจสอบแนวโน้มราคา USD/THB เพื่อวางแผนธุรกรรมนำเข้าและส่งออก`,
        `เปรียบเทียบอัตราแลกเปลี่ยนตลาดเงินสดกับตารางตัวแปลงค่าเงินในหน้าหลัก`,
        `เรทนี้คำนวณจากตลาดแลกเปลี่ยนเงินตราบทแพลตฟอร์มพันธมิตร`
      ] : [
        `Monitor USD/THB trends for import-export billing planning.`,
        `Compare with our homepage currency converter for instant conversions.`,
        `Rates are sourced from public institutional financial feeds.`
      ],
      faqs: code === 'th' ? [
        { question: 'ค่าเงินบาทแข็งค่าหรืออ่อนค่าเทียบกับดอลลาร์สหรัฐ ดูจากอะไร?', answer: 'หากตัวเลขลดลง (เช่น จาก 35 เหลือ 34) หมายความว่าเงินบาทแข็งค่าขึ้น เพราะใช้เงินบาทน้อยลงในการแลก 1 ดอลลาร์ ในทางกลับกันหากตัวเลขเพิ่มขึ้น หมายถึงเงินบาทอ่อนค่าลง' },
        { question: 'อัตราแลกเปลี่ยนนี้รวมค่าธรรมเนียมของธนาคารหรือยัง?', answer: 'อัตรานี้เป็นเรทกลางตลาด (Mid-Market Rate) สำหรับการอ้างอิงเบื้องต้น เรทจริงที่ธนาคารหรือร้านแลกเงินจะมีการบวกสเปรดและค่าธรรมเนียมเพิ่มเติมตามธุรกรรม' }
      ] : [
        { question: 'What causes the USD/THB rate to change?', answer: 'It changes based on interest rates set by the Fed and the Bank of Thailand, US inflation indicators, and Thailand\'s international trade balance and tourist numbers.' },
        { question: 'Is this the exact rate I will get at a Thai bank?', answer: 'No, this is a mid-market reference rate. Commercial banks and booths at airports apply retail spreads and transaction fees.' }
      ]
    }
  }

  if (pair === 'usdt-thb') {
    return {
      h2: code === 'th' ? 'อัตราแลกเปลี่ยน USDT เป็น บาทไทยวันนี้ (USDT/THB)' :
          code === 'en' ? 'USDT to Thai Baht Exchange Rate (USDT/THB)' :
          code === 'lo' ? 'ອັດຕາແລກປ່ຽນ USDT ເປັນ ບາດໄທ (USDT/THB)' :
          code === 'my' ? 'USDT မှ ထိုင်းဘတ် ငွေလဲနှုန်း (USDT/THB)' :
          'អត្រាប្តូរប្រាក់ USDT ទៅ ប្រាក់បាតថៃ (USDT/THB)',
      p1: code === 'th' ? `USDT เป็นเหรียญ Stablecoin ยอดนิยมที่ตรึงราคาแบบ 1:1 กับดอลลาร์สหรัฐ อัตราแลกเปลี่ยน USDT/THB ล่าสุดเทียบเงินบาทในปัจจุบันมีค่าเท่ากับ 1 USDT = ${formattedRate} THB บันทึกเมื่อเวลา ${dateStr}` :
          code === 'en' ? `USDT is a popular stablecoin pegged 1:1 with the US Dollar. The current conversion rate for USDT to THB is 1 USDT = ${formattedRate} THB as of ${dateStr}.` :
          code === 'lo' ? `USDT ແມ່ນສະກຸນເງິນຄຣິບໂຕ Stablecoin ທີ່ຄ້ຳມູນຄ່າ 1:1 ກັບໂດລາສະຫະລັດ ເລດລ່າສຸດແມ່ນ 1 USDT = ${formattedRate} THB ວັນທີ ${dateStr}.` :
          code === 'my' ? `USDT သည် အမေရိကန်ဒေါ်လာနှင့် ၁:၁ တန်ဖိုးတူညီအောင် ပြုလုပ်ထားသော Stablecoin ဖြစ်သည်။ လက်ရှိနှုန်းမှာ ၁ USDT = ${formattedRate} ဘတ် ဖြစ်ပြီး ${dateStr} တွင် ရရှိထားသည်။` :
          `USDT គឺជា stablecoin ដ៏ពេញនិយមដែលរក្សាតម្លៃស្មើនឹងដុល្លារ ១:១។ អត្រាប្តូរប្រាក់បច្ចុប្បន្នគឺ 1 USDT = ${formattedRate} THB គិតត្រឹមថ្ងៃទី ${dateStr}។`,
      p2: code === 'th' ? `แม้ราคาของ USDT จะอ้างอิงกับ USD แต่ราคา USDT/THB บนกระดานแลกเปลี่ยนสินทรัพย์ดิจิทัลไทยอาจมีความแตกต่างจากเรทดอลลาร์ปกติเล็กน้อยตามกลไกอุปสงค์อุปทานของนักเทรดและสภาพคล่องของตลาดคริปโตในเวลานั้นๆ` :
          code === 'en' ? `Although USDT tracks the US Dollar, the local price of USDT in Baht can diverge from traditional USD bank rates due to domestic demand for digital assets, local exchange liquidity, and crypto trading volumes.` :
          code === 'lo' ? `ເຖິງແມ່ນວ່າ USDT ຈະອີງໃສ່ມູນຄ່າ USD ແຕ່ລາຄາ USDT/THB ໃນກະດານເທຣດອາດຕ່າງຈາກໂດລາປົກກະຕິເລັກນ້ອຍ ຕາມຄວາມຕ້ອງການຂອງຕະຫຼາດຄຣິບໂຕ.` :
          code === 'my' ? `USDT သည် ဒေါ်လာတန်ဖိုးကို ခြေရာခံသော်လည်း ပြည်တွင်း crypto ဝယ်လိုအားနှင့် ငွေဖြစ်လွယ်မှုအပေါ် မူတည်၍ ရိုးရိုး USD ဘဏ်နှုန်းများနှင့် USDT/THB နှုန်း အနည်းငယ် ကွာခြားနိုင်ပါသည်။` :
          `ទោះបីជា USDT តាមដានតម្លៃដុល្លារក៏ដោយ តម្លៃក្នុងស្រុកនៃ USDT គិតជាបាតអាចខុសគ្នាពីអត្រាធនាគារធម្មតា ដោយសារតម្រូវការទ្រព្យសកម្មឌីជីថល និងលំហូរទីផ្សារគ្រីបតូ។`,
      points: code === 'th' ? [
        `เช็กส่วนต่างราคา (Premium/Discount) ระหว่างดอลลาร์จริงและดอลลาร์คริปโต`,
        `ใช้เป็นเกณฑ์ราคาอ้างอิงสำหรับการซื้อขายคริปโตแบบ P2P ในไทย`,
        `อัปเดตอ้างอิงทิศทางตลาดสินทรัพย์ดิจิทัลทั่วโลก`
      ] : [
        `Monitor price premiums or discounts between fiat USD and crypto USDT.`,
        `Use as a reference for peer-to-peer (P2P) crypto trading in Thailand.`,
        `Updated reference rates based on global and regional digital asset activities.`
      ],
      faqs: code === 'th' ? [
        { question: 'ทำไมราคา USDT/THB ถึงสูงกว่า USD/THB ในบางเวลา?', answer: 'เนื่องจากเกิดภาวะ Premium ในตลาดคริปโตไทย เมื่อมีความต้องการซื้อเหรียญ USDT เพื่อไปลงทุนในสินทรัพย์ดิจิทัลอื่นสูงกว่าความต้องการขาย ทำให้ราคาพุ่งสูงกว่าอัตราแลกเปลี่ยนของธนาคารปกติ' },
        { question: ' zrate.io ดึงเรท USDT มาจากที่ไหน?', answer: 'เรานำเรท USD มาปรับค่าตามน้ำหนักสถิติตลาดสินทรัพย์ดิจิทัลเพื่อให้ได้เรทอ้างอิง USDT/THB ที่สอดคล้องกับตลาดจริงมากที่สุด' }
      ] : [
        { question: 'Why does USDT/THB differ from USD/THB?', answer: 'This difference is caused by market premiums or discounts on digital exchanges when crypto buying pressure exceeds sell orders, or vice versa.' },
        { question: 'Can I redeem USDT for physical cash directly?', answer: 'No, USDT must be sold on a licensed digital asset exchange or P2P platform in exchange for Thai Baht deposited into your bank account.' }
      ]
    }
  }

  if (pair === 'thb-lak') {
    return {
      h2: code === 'th' ? 'อัตราแลกเปลี่ยนบาทไทย เป็น กีบลาววันนี้ (THB/LAK)' :
          code === 'en' ? 'Thai Baht to Lao Kip Exchange Rate (THB/LAK)' :
          code === 'lo' ? 'ອັດຕາແລກປ່ຽນ ບາດໄທ ເປັນ ກີບລາວ (THB/LAK)' :
          code === 'my' ? 'ထိုင်းဘတ်မှ လာအိုကျပ် ငွေလဲနှုန်း (THB/LAK)' :
          'អត្រាប្តូរប្រាក់ ប្រាក់បាតថៃ ទៅ គីបឡាវ (THB/LAK)',
      p1: code === 'th' ? `คู่เงิน THB/LAK มีความสำคัญสูงมากสำหรับการค้าชายแดนและการท่องเที่ยวระหว่างประเทศไทยและ สปป.ลาว ปัจจุบันเรทอัตราแลกเปลี่ยนอยู่ที่ 1 THB = ${formattedRate} LAK บันทึกเมื่อ ${dateStr}` :
          code === 'en' ? `The THB/LAK exchange rate is vital for border trade and regional tourism between Thailand and Laos. Currently, 1 THB equals ${formattedRate} LAK as of ${dateStr}.` :
          code === 'lo' ? `ຄູ່ເງິນ THB/LAK ມີຄວາມສຳຄັນຫຼາຍສຳລັບການຄ້າຊາຍແດນ ແລະການທ່ອງທ່ຽວລະຫວ່າງ ໄທ ແລະ ລາວ. ປະຈຸບັນອັດຕາແລກປ່ຽນແມ່ນ 1 THB = ${formattedRate} LAK ວັນທີ ${dateStr}.` :
          code === 'my' ? `THB/LAK လဲနှုန်းသည် ထိုင်းနှင့် လာအိုအကြား နယ်စပ်ကုန်သွယ်ရေးနှင့် ခရီးသွားလုပ်ငန်းအတွက် အလွန်အရေးကြီးသည်။ လက်ရှိတွင် ၁ ဘတ် = ${formattedRate} ကီပ့် ဖြစ်ပြီး ${dateStr} တွင် ရရှိသည်။` :
          `អត្រាប្តូរប្រាក់ THB/LAK មានសារៈសំខាន់ណាស់សម្រាប់ពាណិជ្ជកម្មព្រំដែន និងទេសចរណ៍រវាងថៃ និងឡាវ។ បច្ចុប្បន្ន 1 THB ស្មើនឹង ${formattedRate} LAK គិតត្រឹមថ្ងៃទី ${dateStr}។`,
      p2: code === 'th' ? `เงินกีบลาว (LAK) ประสบปัญหาความผันผวนจากเงินเฟ้อและการขาดแคลนเงินทุนสำรองระหว่างประเทศ ทำให้เรทเงินบาทต่อกีบปรับตัวสูงขึ้นอย่างต่อเนื่องในช่วงเวลาที่ผ่านมา ผู้ประกอบการจึงจำเป็นต้องตรวจสอบเรทตลาดอย่างสม่ำเสมอ` :
          code === 'en' ? `In recent years, the Lao Kip has experienced significant volatility and high domestic inflation, leading to a depreciation trend against the Thai Baht. Merchants and travelers are advised to check the market rate frequently.` :
          code === 'lo' ? `ໃນຊຸມປີຜ່ານມາ, ເງິນກີບມີຄວາມຜັນຜວນສູງຈາກອັດຕາເງິນເຟີ້ ແລະການຂາດແຄນເງິນຕາຕ່າງປະເທດ ເຮັດໃຫ້ຄ່າເງິນບາດທຽບກີບສູງຂຶ້ນຢ່າງຕໍ່ເນື່ອງ.` :
          code === 'my' ? `မကြာသေးမီနှစ်များအတွင်း လာအိုကီပ့်သည် ငွေဖောင်းပွမှုနှင့် နိုင်ငံခြားသုံးငွေပြတ်လပ်မှုကြောင့် သိသိသာသာ တန်ဖိုးကျဆင်းခဲ့ပြီး ဘတ်ငွေနှင့်လဲလှယ်နှုန်း မြင့်တက်လာခဲ့သည်။` :
          `ក្នុងរយៈពេលប៉ុន្មានឆ្នាំចុងក្រោយនេះ គីបឡាវបានជួបប្រទះនឹងការប្រែប្រួលយ៉ាងខ្លាំង និងអតិផរណាខ្ពស់ ដែលនាំឱ្យមាននិន្នាការធ្លាក់ថ្លៃធៀបនឹងបាតថៃ។`,
      points: code === 'th' ? [
        `ใช้ประเมินราคาสินค้านำเข้าและส่งออกบริเวณด่านชายแดนไทย-ลาว`,
        `คำนวณค่าเดินทาง ท่องเที่ยวในเวียงจันทน์ หลวงพระบาง และวังเวียง`,
        `อัปเดตเรทอัตโนมัติเพื่อสะท้อนความผันผวนของเงินกีบลาว`
      ] : [
        `Evaluate goods pricing at the Thailand-Laos border checkpoints.`,
        `Calculate travel expenses for Vientiane, Luang Prabang, and Vang Vieng.`,
        `Get automated rate refreshes reflecting LAK market conditions.`
      ],
      faqs: code === 'th' ? [
        { question: 'ทำไมเรทเงินบาทเทียบกีบลาวในระบบถึงสูงกว่าเรททางการธนาคารลาว?', answer: 'เนื่องจากสถานการณ์ขาดแคลนเงินตราในลาว ทำให้เกิดความแตกต่างระหว่างอัตราแลกเปลี่ยนทางการ (Official Rate) และอัตราแลกเปลี่ยนในตลาดจริง (Parallel/Market Rate) ซึ่งร้านค้าทั่วไปมักอ้างอิงเรทตลาดจริงเป็นหลัก' },
        { question: 'สามารถใช้เงินบาทในประเทศลาวได้เลยหรือไม่?', answer: 'สามารถใช้เงินบาทในแหล่งท่องเที่ยวและร้านค้าชายแดนส่วนใหญ่ของลาวได้อย่างสะดวก อย่างไรก็ตาม การคำนวณเรทบาทต่อกีบก่อนชำระเงินจะช่วยให้คุณประหยัดเงินได้มากขึ้น' }
      ] : [
        { question: 'Why is there a big difference between official and parallel LAK rates?', answer: 'Due to foreign currency shortages in Laos, a parallel market rate exists alongside the official central bank rate. Most local businesses use the market rate for practical purposes.' },
        { question: 'Can I use Thai Baht directly in Laos?', answer: 'Yes, Thai Baht is widely accepted in tourist cities like Vientiane and Luang Prabang. However, converting it to Kip is often cheaper for small local transactions.' }
      ]
    }
  }

  // Dynamic assembler for all other pairs
  const baseFactor = SPECIFIC_FACTORS[base]?.[code] || `${baseName} is influenced by its country's economic indices.`
  const quoteFactor = SPECIFIC_FACTORS[quote]?.[code] || `${quoteName} is driven by local monetary and trade figures.`

  return {
    h2: code === 'th' ? `อัตราแลกเปลี่ยน ${base} เป็น ${quote} วันนี้ (${base}/${quote})` :
        code === 'en' ? `${base} to ${quote} Exchange Rate Today (${base}/${quote})` :
        code === 'lo' ? `ອັດຕາແລກປ່ຽນ ${base} ເປັນ ${quote} ມື້ນີ້ (${base}/${quote})` :
        code === 'my' ? `${base} မှ ${quote} ငွေလဲနှုန်း (${base}/${quote})` :
        `អត្រាប្តូរប្រាក់ ${base} ទៅ ${quote} ថ្ងៃនេះ (${base}/${quote})`,
    p1: code === 'th' ? `หน้านี้แสดงข้อมูลอัตราแลกเปลี่ยนสำหรับคู่เงิน ${base}/${quote} โดยมีราคาเปรียบเทียบในปัจจุบันคือ 1 ${base} = ${formattedRate} ${quote} ซึ่งประมวลผลระบบแบบเรียลไทม์ ณ วันที่ ${dateStr} เพื่อความสะดวกในการใช้งาน` :
        code === 'en' ? `This page provides live exchange updates for the ${base}/${quote} currency pair. As of ${dateStr}, the reference rate is 1 ${base} = ${formattedRate} ${quote}.` :
        code === 'lo' ? `ໜ້ານີ້ສະແດງອັດຕາແລກປ່ຽນສຳລັບຄູ່ເງິນ ${base}/${quote}. ເລດຫຼ້າສຸດແມ່ນ 1 ${base} = ${formattedRate} ${quote} ວັນທີ ${dateStr}.` :
        code === 'my' ? `ဤစာမျက်နှာသည် ${base}/${quote} အတွဲအတွက် တိုက်ရိုက်လဲလှယ်နှုန်းကို ပြသသည်။ ${dateStr} တွင် ၁ ${base} = ${formattedRate} ${quote} ဖြစ်သည်။` :
        `ទំព័រនេះផ្តល់នូវព័ត៌មានអត្រាប្តូរប្រាក់សម្រាប់គូរូបិយប័ណ្ណ ${base}/${quote}។ គិតត្រឹមថ្ងៃទី ${dateStr} អត្រាយោងគឺ 1 ${base} = ${formattedRate} ${quote}។`,
    p2: code === 'th' ? `ความเคลื่อนไหวของราคาคู่นี้ถูกกำหนดโดยปัจจัยทางเศรษฐกิจที่หลากหลาย โดยฝั่งของ ${baseName} ได้รับอิทธิพลจาก ${baseFactor} ขณะที่ฝั่งของ ${quoteName} จะผันผวนตาม ${quoteFactor}` :
        code === 'en' ? `The performance of this pair is driven by global macroeconomics. For ${baseName}, key factors include ${baseFactor} On the other side, ${quoteName} responds to ${quoteFactor}` :
        code === 'lo' ? `ຄວາມເຄື່ອນໄຫວຂອງເລດນີ້ຖືກກຳນົດໂດຍປັດໄຈຕ່າງໆ. ຝັ່ງ ${baseName} ແມ່ນ ${baseFactor} ແລະຝັ່ງ ${quoteName} ແມ່ນ ${quoteFactor}` :
        code === 'my' ? `ဤအတွဲ၏ တန်ဖိုးပြောင်းလဲမှုများသည် စီးပွားရေးဆိုင်ရာ အခြေအနေများအပေါ် မူတည်သည်။ ${baseName} အတွက် ${baseFactor} ဖြစ်ပြီး ${quoteName} အတွက် ${quoteFactor} ဖြစ်သည်။` :
        `ការប្រែប្រួលតម្លៃនៃគូនេះត្រូវបានកំណត់ដោយកត្តាសេដ្ឋកិច្ចផ្សេងៗ។ សម្រាប់ ${baseName} រួមមាន ${baseFactor} ចំណែកឯ ${quoteName} វិញ រួមមាន ${quoteFactor}`,
    points: code === 'th' ? [
      `วิเคราะห์เปรียบเทียบการแปลงค่าเงินระหว่าง ${baseName} และ ${quoteName}`,
      `เข้าถึงอัตราอ้างอิงล่าสุดจากสถาบันการเงินที่เชื่อถือได้`,
      `ดูสรุปข้อมูลรายละเอียดและคำนวณเงินย้อนกลับได้ทันที`
    ] : [
      `Analyze exchange values between ${baseName} and ${quoteName}.`,
      `Access the latest reference rates from reliable institutional channels.`,
      `Review key currency statistics and quickly convert inverse pairs.`
    ],
    faqs: code === 'th' ? [
      { question: `อัตราแลกเปลี่ยน ${base}/${quote} อัปเดตบ่อยแค่ไหน?`, answer: `เรทคู่เงินบนเว็บไซต์ zrate.io ได้รับการดึงข้อมูลสดผ่าน API และคำนวณข้อมูลล่าสุดโดยอัตโนมัติภายในระบบ เพื่อส่งต่อเรทอ้างอิงที่ใกล้เคียงเวลาจริงที่สุด` },
      { question: `ต้องการแปลงค่าเงิน ${base} เป็น ${quote} จำนวนมาก ทำอย่างไร?`, answer: `คุณสามารถป้อนจำนวนเงินที่ต้องการคำนวณลงในตัวแปลงค่าเงินอเนกประสงค์ที่อยู่ในหน้าแรกของเว็บไซต์เพื่อดูยอดรวมสุทธิได้ทันที` }
    ] : [
      { question: `How often does the ${base}/${quote} rate update?`, answer: `Rates on zrate.io are updated automatically using active market API connections to provide the most accurate reference values available.` },
      { question: `How can I calculate other amounts for this pair?`, answer: `You can type the exact amount you wish to convert into the currency converter located on the zrate.io homepage.` }
    ]
  }
}
