import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '../../components/Footer'
import { SeoNav } from '../../components/SeoNav'
import { Header } from '../../components/Header'
import { HUB_TEXT } from '../../../lib/hubContent'
import {
  LanguageCode,
  LOCALES,
  REGIONAL_PAIRS,
  PAIR_LABELS,
  SITE_URL,
  localizePath
} from '../../../lib/siteNavigation'
import styles from './money-transfer.module.css'
import { RemittanceTool } from './RemittanceTool'

const PAGE_KEY = 'transfer'
const PATH = '/money-transfer'

const FORMULA_TEXTS: Record<LanguageCode, { title: string; equation: string; note: string }> = {
  th: {
    title: 'สูตรคำนวณต้นทุนการโอนเงินจริง',
    equation: 'ค่าใช้จ่ายรวม = ค่าธรรมเนียม + (ยอดโอน × ส่วนต่างเรทแลกเปลี่ยน)',
    note: 'หมายเหตุ: ส่วนต่างเรทแลกเปลี่ยน (Rate Margin) คืออัตราที่ผู้ให้บริการบวกเพิ่มจากราคาตลาดกลางที่แสดงบน zrate.io',
  },
  en: {
    title: 'TOTAL REMITTANCE COST FORMULA',
    equation: 'Total Cost = Transfer Fee + (Amount × Exchange Rate Margin)',
    note: 'Note: The Exchange Rate Margin is the markup added by providers over the mid-market rate displayed on zrate.io.',
  },
  lo: {
    title: 'ສູດຄຳນວນຕົ້ນທຶນການໂອນເງິນ',
    equation: 'ຕົ້ນທຶນທັງໝົດ = ຄ່າທຳນຽມ + (ຍອດໂອນ × ສ່ວນຕ່າງອັດຕາແລກປ່ຽນ)',
    note: 'ໝາຍເຫດ: ສ່ວນຕ່າງອັດຕາແລກປ່ຽນແມ່ນຄ່າທຳນຽມແຝງທີ່ຜູ້ໃຫ້ບໍລິການບວກເພີ່ມຈາກເຣດຕະຫຼາດກາງ.',
  },
  my: {
    title: 'ငွေလွှဲစရိတ် စုစုပေါင်း တွက်ချက်ပုံ',
    equation: 'စုစုပေါင်းကုန်ကျစရိတ် = ဝန်ဆောင်ခ + (လွှဲငွေပမာဏ × ငွေလဲနှုန်းကွာဟချက်)',
    note: 'မှတ်ချက် - ငွေလဲနှုန်းကွာဟချက် (Rate Margin) ဆိုသည်မှာ zrate.io တွင်ပြသထားသော စျေးကွက်ပျမ်းမျှနှုန်းအပေါ် ဝန်ဆောင်မှုပေးသူများက ထပ်ဆောင်းကောက်ခံသည့် ပမာဏဖြစ်သည်။',
  },
  km: {
    title: 'រូបមន្តគណនាថ្លៃដើមផ្ទេរប្រាក់សរុប',
    equation: 'ថ្លៃដើមសរុប = ថ្លៃសេវាផ្ទេរ + (ចំនួនប្រាក់ផ្ទេរ × ចន្លោះអត្រាប្តូរប្រាក់)',
    note: 'ចំណាំ៖ ចន្លោះអត្រាប្តូរប្រាក់ (Exchange Rate Margin) គឺជាតម្លៃបន្ថែមដែលអ្នកផ្តល់សេវាគិតលើសពីអត្រាទីផ្សារកណ្តាលដែលបង្ហាញនៅលើ zrate.io ។',
  },
}

const BREADCRUMBS: Record<LanguageCode, { home: string; current: string }> = {
  th: { home: 'หน้าแรก', current: 'โอนเงินต่างประเทศ' },
  en: { home: 'Home', current: 'Money Transfer' },
  lo: { home: 'ໜ້າຫຼັກ', current: 'ໂອນເງິນຕ່າງປະເທດ' },
  my: { home: 'ပင်မစာမျက်နှာ', current: 'ငွေလွှဲခြင်း' },
  km: { home: 'ទំព័រដើម', current: 'ផ្ទេរប្រាក់ទៅបរទេស' },
}

const COMPARE_TABLE_HEADERS: Record<LanguageCode, string[]> = {
  th: ['ผู้ให้บริการ', 'ค่าธรรมเนียมการโอน', 'ส่วนต่างอัตราแลกเปลี่ยน (Margin)', 'ระยะเวลาทำรายการ', 'ประเทศปลายทางหลัก', 'ลิงก์ตรวจสอบ'],
  en: ['Provider', 'Transfer Fee', 'Exchange Rate Margin', 'Transfer Speed', 'Primary Destinations', 'Link'],
  lo: ['ຜູ້ໃຫ້ບໍລິການ', 'ຄ່າທຳນຽມ', 'ສ່ວນຕ່າງອັດຕາແລກປ່ຽນ', 'ເວລາໃນການໂອນ', 'ປາຍທາງຫຼັກ', 'ລິ້ງ'],
  my: ['ဝန်ဆောင်မှုပေးသူ', 'ငွေလွှဲခ', 'ငွေလဲနှုန်းကွာဟချက်', 'ကြာမြင့်ချိန်', 'အဓိကလွှဲနိုင်သောနိုင်ငံ', 'လင့်ခ်'],
  km: ['អ្នកផ្តល់សេវា', 'ថ្លៃសេវាផ្ទេរ', 'ចន្លោះអត្រាប្តូរប្រាក់', 'រយៈពេលផ្ទេរ', 'គោលដៅចម្បង', 'តំណភ្ជាប់'],
}

interface ProviderRow {
  name: string
  fee: string
  margin: 'low' | 'med' | 'high'
  marginText: string
  speed: string
  dests: string
  url: string
  sponsor?: boolean
}

const PROVIDERS_DATA: Record<LanguageCode, ProviderRow[]> = {
  th: [
    { name: 'ธ.ก.ส. (ไทย-ลาว)', fee: 'ประมาณ 500 บาท / รายการ', margin: 'low', marginText: 'ต่ำ (ประมาณเรทตลาดกลาง)', speed: 'ภายในวันทำการเดียวกัน', dests: 'ลาว (LAK)', url: 'https://www.baac.or.th' },
    { name: 'Krungthai WARP', fee: '150 - 499 บาท / รายการ', margin: 'med', marginText: 'ปานกลาง', speed: '1 - 2 วันทำการ', dests: 'หลายประเทศทั่วโลก', url: 'https://krungthai.com' },
    { name: 'Western Union', fee: 'แปรตามยอดเงินโอน (ค่อนข้างสูง)', margin: 'high', marginText: 'สูง', speed: 'ภายในไม่กี่นาที - 2 วัน', dests: 'ลาว, เมียนมา, กัมพูชา และทั่วโลก', url: 'https://www.westernunion.com' },
    { name: 'Wise', fee: 'คิดตามสัดส่วน % (เริ่มต้น 0.4%)', margin: 'low', marginText: 'ต่ำมาก (เรทตลาดกลางจริง)', speed: 'ทันที - ไม่กี่ชั่วโมง', dests: 'สิงคโปร์, ยุโรป, สหรัฐอเมริกา', url: 'https://wise.com/?source=zrate', sponsor: true },
    { name: 'Remitly', fee: '99 - 149 บาท (มีโปรฟรีครั้งแรก)', margin: 'med', marginText: 'ต่ำ-ปานกลาง', speed: 'ทันที - 1 วันทำการ', dests: 'เมียนมา, ลาว, กัมพูชา, ฟิลิปปินส์', url: 'https://www.remitly.com/?source=zrate', sponsor: true },
  ],
  en: [
    { name: 'BAAC Bank (TH-LAO)', fee: 'Approx. 500 THB / Transfer', margin: 'low', marginText: 'Low (Near Mid-Market)', speed: 'Same business day', dests: 'Laos (LAK)', url: 'https://www.baac.or.th' },
    { name: 'Krungthai WARP', fee: '150 - 499 THB / Transfer', margin: 'med', marginText: 'Medium', speed: '1 - 2 business days', dests: 'Global coverage', url: 'https://krungthai.com' },
    { name: 'Western Union', fee: 'Percentage-based (Relatively High)', margin: 'high', marginText: 'High', speed: 'Minutes to 2 days', dests: 'Laos, Myanmar, Cambodia, Global', url: 'https://www.westernunion.com' },
    { name: 'Wise', fee: 'Variable % (Starting from 0.4%)', margin: 'low', marginText: 'Very Low (Real Mid-Market)', speed: 'Instant to few hours', dests: 'Singapore, Europe, US, Global', url: 'https://wise.com/?source=zrate', sponsor: true },
    { name: 'Remitly', fee: '99 - 149 THB (First transfer promo)', margin: 'med', marginText: 'Low to Medium', speed: 'Instant to 1 business day', dests: 'Myanmar, Laos, Cambodia, etc.', url: 'https://www.remitly.com/?source=zrate', sponsor: true },
  ],
  lo: [
    { name: 'ທ.ກ.ສ (ໄທ-ລາວ)', fee: 'ປະມານ 500 ບາດ / ຄັ້ງ', margin: 'low', marginText: 'ຕ່ຳ (ໃກ້ຄຽງຕະຫຼາດກາງ)', speed: 'ພາຍໃນມື້ດຽວກັນ', dests: 'ລາວ (LAK)', url: 'https://www.baac.or.th' },
    { name: 'Krungthai WARP', fee: '150 - 499 ບາດ / ຄັ້ງ', margin: 'med', marginText: 'ປານກາງ', speed: '1 - 2 ມື້ເຮັດວຽກ', dests: 'ຫຼາຍປະເທດທົ່ວໂລກ', url: 'https://krungthai.com' },
    { name: 'Western Union', fee: 'ແປຮິດຕາມຍອດ (ຂ້ອນຂ້າງສູງ)', margin: 'high', marginText: 'ສູງ', speed: 'ພາຍໃນບໍ່ກີ່ນາທີ - 2 ມື້', dests: 'ລາว, ມຽນມາ, ກຳປູເຈຍ ແລະ ທົ່ວໂລກ', url: 'https://www.westernunion.com' },
    { name: 'Wise', fee: 'ຄິດໄລ່ຕາມເປີເຊັນ (ເລີ່ມຕົ້ນ 0.4%)', margin: 'low', marginText: 'ຕ່ຳຫຼາຍ (ຕະຫຼາດກາງແທ້)', speed: 'ທັນທີ - ບໍ່ກີ່ຊົ່ວໂມງ', dests: 'ສິງກະໂປ, ເອີຣົບ, ສະຫະລັດ', url: 'https://wise.com/?source=zrate', sponsor: true },
    { name: 'Remitly', fee: '99 - 149 ບາດ', margin: 'med', marginText: 'ຕ່ຳ-ปานกลาง', speed: 'ທັນທີ - 1 ມື້ເຮັດວຽກ', dests: 'ມຽນມາ, ລາວ, ກຳປູເຈຍ', url: 'https://www.remitly.com/?source=zrate', sponsor: true },
  ],
  my: [
    { name: 'BAAC ဘဏ် (ထိုင်း-လာအို)', fee: '၅၀၀ ဘတ်ခန့် / တစ်ကြိမ်', margin: 'low', marginText: 'နည်း (စျေးကွက်ပျမ်းမျှနှုန်းနီးပါး)', speed: 'ယင်းနေ့အတွင်း', dests: 'လာအို (LAK)', url: 'https://www.baac.or.th' },
    { name: 'Krungthai WARP', fee: '၁၅၀ - ၄၉၉ ဘတ် / တစ်ကြိမ်', margin: 'med', marginText: 'အလယ်အလတ်', speed: '၁ - ၂ ရက်အတွင်း', dests: 'ကမ္ဘာတစ်ဝှမ်းနိုင်ငံများ', url: 'https://krungthai.com' },
    { name: 'Western Union', fee: 'လွှဲငွေအလိုက် (အနည်းငယ်များ)', margin: 'high', marginText: 'များ', speed: 'မိနစ်ပိုင်းမှ ၂ ရက်အတွင်း', dests: 'လာအို၊ မြန်မာ၊ ကမ္ဘောဒီးယားနှင့် ကမ္ဘာတစ်ဝှမ်း', url: 'https://www.westernunion.com' },
    { name: 'Wise', fee: 'ရာခိုင်နှုန်းအလိုက် (၀.၄% မှစတင်)', margin: 'low', marginText: 'အလွန်နည်း (စျေးကွက်ပျမ်းမျှနှုန်းစစ်)', speed: 'ချက်ချင်းမှ နာရီပိုင်းအတွင်း', dests: 'စင်ကာပူ၊ ဥရောပ၊ အမေရိကန်', url: 'https://wise.com/?source=zrate', sponsor: true },
    { name: 'Remitly', fee: '၉၉ - ၁၄၉ ဘတ်', margin: 'med', marginText: 'နည်းမှ အလယ်အလတ်', speed: 'ချက်ချင်းမှ ၁ ရက်အတွင်း', dests: 'မြန်မာ၊ လာအို၊ ကမ္ဘောဒီးယား', url: 'https://www.remitly.com/?source=zrate', sponsor: true },
  ],
  km: [
    { name: 'ធនាគារ BAAC (ថៃ-ឡាវ)', fee: 'ប្រហែល 500 បាត / ផ្ទេរ', margin: 'low', marginText: 'ទាប (ជិតអត្រាទីផ្សារកណ្តាល)', speed: 'ក្នុងថ្ងៃដដែល', dests: 'ឡាវ (LAK)', url: 'https://www.baac.or.th' },
    { name: 'Krungthai WARP', fee: '150 - 499 បាត / ផ្ទេរ', margin: 'med', marginText: 'មធ្យម', speed: '១ - ២ ថ្ងៃធ្វើការ', dests: 'ច្រើនប្រទេសជុំវិញពិភពលោក', url: 'https://krungthai.com' },
    { name: 'Western Union', fee: 'គិតតាមភាគរយផ្ទេរ (ខ្ពស់)', margin: 'high', marginText: 'ខ្ពស់', speed: 'នាទីទៅ ២ ថ្ងៃ', dests: 'ឡាវ, មីយ៉ាន់ម៉ា, កម្ពុជា, សកល', url: 'https://www.westernunion.com' },
    { name: 'Wise', fee: 'គិតតាម % ប្រែប្រួល (ចាប់ពី 0.4%)', margin: 'low', marginText: 'ទាបខ្លាំង (អត្រាទីផ្សារកណ្តាលពិត)', speed: 'ភ្លាមៗទៅប៉ុន្មានម៉ោង', dests: 'សិង្ហបុរី, អឺរ៉ុប, អាមេរិក', url: 'https://wise.com/?source=zrate', sponsor: true },
    { name: 'Remitly', fee: '99 - 149 បាត', margin: 'med', marginText: 'ទាបទៅមធ្យម', speed: 'ភ្លាមៗទៅ ១ ថ្ងៃធ្វើការ', dests: 'មីយ៉ាន់ម៉ា, ឡាវ, កម្ពុជា', url: 'https://www.remitly.com/?source=zrate', sponsor: true },
  ],
}

const HOW_TO_STEPS: Record<LanguageCode, Array<{ name: string; text: string }>> = {
  th: [
    { name: '1. เช็กเรทกลางตลาด', text: 'ตรวจสอบเรทอ้างอิงกลางตลาดจริงบน zrate.io ของคู่สกุลเงินที่คุณต้องการโอน เช่น THB/LAK หรือ THB/MMK ก่อนทำรายการทุกครั้ง เพื่อให้ทราบค่ามาตรฐาน' },
    { name: '2. เปรียบเทียบค่าธรรมเนียมโอน', text: 'ตรวจสอบค่าธรรมเนียมคงที่ของผู้ให้บริการแต่ละราย บางช่องทางคิดคงที่ บางช่องทางคิดเป็นสัดส่วนเปอร์เซ็นต์ตามยอดเงินโอนของคุณ' },
    { name: '3. ตรวจสอบเรทแลกเปลี่ยนจริง', text: 'ดูอัตราแลกเปลี่ยนที่ผู้ให้บริการเสนอมา (เรทค้าปลีก) แล้วเทียบกับเรทกลางตลาด ส่วนต่างที่เกิดขึ้นคือ Rate Margin หรือค่าธรรมเนียมแอบแฝง' },
    { name: '4. คำนวณยอดเงินปลายทางจริง', text: 'วิธีที่ดีที่สุดคือการนำยอดเงินต้นหักค่าธรรมเนียม แล้วแปลงด้วยเรทจริง หรือคำนวณดูว่าผู้รับปลายทางจะได้ยอดสุทธิเท่าใด แล้วจึงเปรียบเทียบช่องทางที่คุ้มที่สุด' },
  ],
  en: [
    { name: '1. Check Mid-Market Rate', text: 'Always check the real mid-market reference rate on zrate.io for your currency pair (e.g., THB/LAK or THB/MMK) first, establishing your benchmark.' },
    { name: '2. Compare Transfer Fees', text: 'Look up the flat or percentage-based service fee charged by each provider. A flat fee might be better for large amounts, while percentage fees favor smaller ones.' },
    { name: '3. Inspect the Exchange Rate Margin', text: 'Check the retail rate offered by the provider and compare it to the mid-market rate. The difference is the hidden exchange rate margin margin.' },
    { name: '4. Calculate the Final Received Amount', text: 'Determine the exact final net amount the recipient will receive at the destination after all fees and margins are applied. Choose the provider that maximizes this value.' },
  ],
  lo: [
    { name: '1. ກວດເບິ່ງເຣດຕະຫຼາດກາງ', text: 'ກວດສອບອັດຕາແລກປ່ຽນອ້າງອີງໃນ zrate.io ເພື່ອໃຫ້ຮູ້ເຣດມາດຕະຖານກ່ອນໂອນເງິນສະເໝີ.' },
    { name: '2. ທຽບຄ່າທຳນຽມການໂອນ', text: 'ກວດສອບຄ່າທຳນຽມຂອງຜູ້ໃຫ້ບໍລິການແຕ່ລະລາຍ ເຊິ່ງອາດຈະເປັນຄ່າທຳນຽມຄົງທີ່ ຫຼື ຄິດເປັນເປີເຊັນ.' },
    { name: '3. ກວດເຣດແລກປ່ຽນຕົວຈິງ', text: 'ເບິ່ງເຣດທີ່ຜູ້ໃຫ້ບໍລິການສະເໜີ ແລ้อยທຽບກັບเຣດຕະຫຼາດກາງ. ສ່ວນຕ່າງນັ້ນແມ່ນຄ່າທຳນຽມແຝງ.' },
    { name: '4. ຄຳນວນຍອດເງິນປາຍທາງ', text: 'ຄຳນວນເບິ່ງວ່າຜູ້ຮັບປາຍທາງຈະໄດ້ເງິນສຸດທິເທົ່າໃດ ຫຼັງຈາກຫັກຄ່າທຳນຽມ ແລະ ສ່ວນຕ່າງທັງໝົດແລ້ວ.' },
  ],
  my: [
    { name: '၁။ စျေးကွက်ပျမ်းမျှနှုန်းစစ်ဆေးပါ', text: 'မလွှဲမီ သင်လွှဲလိုသောအတွဲ (ဥပမာ THB/LAK သို့မဟုတ် THB/MMK) ၏ စျေးကွက်ပျမ်းမျှနှုန်းကို zrate.io တွင် အရင်စစ်ဆေးပါ။' },
    { name: '၂။ ဝန်ဆောင်ခကို နှိုင်းယှဉ်ပါ', text: 'ဝန်ဆောင်မှုပေးသူများ၏ ဝန်ဆောင်ခကို စစ်ဆေးပါ။ အချို့မှာ ပုံသေကောက်ခံပြီး အချို့မှာ ရာခိုင်နှုန်းအလိုက် ကောက်ခံတတ်သည်။' },
    { name: '၃။ ငွေလဲနှုန်းကွာဟချက်ကို စစ်ပါ', text: '၎င်းတို့ပေးသောနှုန်းနှင့် စျေးကွက်ပျမ်းမျှနှုန်းကို နှိုင်းယှဉ်ပါ။ ကွာခြားချက်မှာ လျှို့ဝှက်ဝန်ဆောင်ခ ဖြစ်သည်။' },
    { name: '၄။ လက်ခံသူရမည့်ငွေကို တွက်ပါ', text: 'စရိတ်အားလုံးနုတ်ပြီးနောက် လက်ခံသူအမှန်တကယ်ရရှိမည့်ငွေကို နှိုင်းယှဉ်ကာ အကောင်းဆုံးလမ်းကြောင်းကို ရွေးချယ်ပါ။' },
  ],
  km: [
    { name: '១. ពិនិត្យអត្រាទីផ្សារកណ្តាល', text: 'ពិនិត្យអត្រាប្តូរប្រាក់យោងនៅលើ zrate.io សម្រាប់គូប្រាក់ដែលចង់ផ្ទេរ (ដូចជា THB/LAK ឬ THB/MMK) ដើម្បីដឹងពីតម្លៃស្តង់ដារ។' },
    { name: '២. ប្រៀបធៀបថ្លៃសេវាផ្ទេរ', text: 'ពិនិត្យថ្លៃសេវារបស់អ្នកផ្តល់សេវានីមួយៗ ដែលខ្លះគិតជាថ្លៃសេវាថេរ និងខ្លះទៀតគិតជាភាគរយនៃចំនួនប្រាក់ផ្ទេរ។' },
    { name: '៣. ពិនិត្យចន្លោះអត្រាប្តូរប្រាក់', text: 'ប្រៀបធៀបអត្រាដែលអ្នកផ្តល់សេវាផ្តល់ឱ្យ ជាមួយអត្រាទីផ្សារកណ្តាល។ ភាពខុសគ្នាគឺជាថ្លៃសេវាលាក់កំបាំង (Margin)។' },
    { name: '៤. គណនាប្រាក់ទទួលចុងក្រោយ', text: 'គណនាចំនួនប្រាក់ដែលអ្នកទទួលនឹងទទួលបានពិតប្រាកដ បន្ទាប់ពីកាត់ថ្លៃសេវា និង margin ទាំងអស់រួច។' },
  ],
}

interface CountryGuideItem {
  country: string
  flag: string
  pair: string
  text: string
  channels: string
}

const COUNTRY_GUIDES: Record<LanguageCode, CountryGuideItem[]> = {
  th: [
    { country: 'สปป. ลาว (Thailand to Laos)', flag: '🇱🇦', pair: 'THB/LAK', text: 'การโอนเงินจากไทยไปลาว ส่วนใหญ่ใช้บริการของธนาคารร่วมทุนหรือธนาคารของรัฐ เช่น ธนาคาร ธ.ก.ส. ที่มีบริการโอนเงินตรงไปยังผู้ให้บริการปลายทางในลาว หรือผ่านทางธนาคารพาณิชย์หลักอย่างธนาคารกรุงเทพและกสิกรไทย นอกจากนี้การใช้บริการเคาน์เตอร์ส่งเงิน Western Union ก็เป็นที่นิยมในเขตชายแดนและในตัวเมืองหลักของลาว', channels: 'ช่องทางหลัก: BAAC, Western Union, KBank, Bangkok Bank' },
    { country: 'เมียนมา (Thailand to Myanmar)', flag: '🇲🇲', pair: 'THB/MMK', text: 'สำหรับการโอนเงินไปยังเมียนมา เนื่องจากสถานการณ์การควบคุมทางการเงินในประเทศ ผู้คนมักใช้บริการกระเป๋าเงินดิจิทัลและแอปพลิเคชันโอนเงินข้ามประเทศ เช่น Remitly, Wise (จำกัดบางสัญชาติ) หรือระบบโอนเงินของแรงงานต่างชาติที่ได้รับการรับรอง โดยเรทแลกเปลี่ยนจริงจะมีการบวกส่วนต่างของค่าจ๊าด (MMK) ค่อนข้างผันผวน ควรเทียบราคาเป็นระยะ', channels: 'ช่องทางหลัก: Remitly, TrueMoney Transfer, Western Union' },
    { country: 'กัมพูชา (Thailand to Cambodia)', flag: '🇰🇭', pair: 'THB/KHR', text: 'การส่งเงินไปกัมพูชามีความสะดวกสูงเนื่องจากระบบการชำระเงินข้ามพรมแดนผ่าน QR Code ที่พัฒนาขึ้นระหว่างธนาคารกลางกัมพูชา (NBC) และธนาคารกลางไทย นอกจากนี้ยังมีผู้ให้บริการโอนเงินออนไลน์และเคาน์เตอร์ส่งเงินด่วนที่ได้รับความนิยมสูงสำหรับโอนเงินเข้าบัญชีธนาคารปลายทางอย่าง Wing หรือ ABA Bank', channels: 'ช่องทางหลัก: Remitly, Wing, Western Union, QR Cross-Border' },
  ],
  en: [
    { country: 'Laos (Thailand to Laos)', flag: '🇱🇦', pair: 'THB/LAK', text: 'Transfers to Laos are commonly processed through state-owned joint banks such as BAAC Bank, or commercial banks like Bangkok Bank and KBank. Western Union is widely utilized in major border points and urban centers for cash pick-up.', channels: 'Primary Channels: BAAC, Western Union, KBank, Bangkok Bank' },
    { country: 'Myanmar (Thailand to Myanmar)', flag: '🇲🇲', pair: 'THB/MMK', text: 'Sending money to Myanmar involves active digital wallets and specialized remittance networks due to local banking limits. Remitly, TrueMoney, and Western Union are highly active, facilitating transfers to WaveMoney and KBZPay accounts.', channels: 'Primary Channels: Remitly, TrueMoney Transfer, Western Union' },
    { country: 'Cambodia (Thailand to Cambodia)', flag: '🇰🇭', pair: 'THB/KHR', text: 'Transfers to Cambodia are highly advanced, supported by cross-border QR code payments between the NBC and Bank of Thailand. Remitly and Western Union are widely used, alongside local networks like Wing and ABA Bank.', channels: 'Primary Channels: Remitly, Wing, Western Union, Cross-Border QR' },
  ],
  lo: [
    { country: 'ສປປ. ລາວ (ໄທ ໄປ ລາວ)', flag: '🇱🇦', pair: 'THB/LAK', text: 'ການໂອນເງິນຈາກໄທໄປລາວ ສ່ວນໃຫຍ່ແມ່ນໃຊ້ທະນາຄານຮ່ວມທຶນ ເຊັ່ນ ທະນາຄານ ທ.ກ.ສ ຫຼື ທະນາຄານພານິດ ເຊັ່ນ ທະນາຄານກຸງເທບ ແລະ ກະສິກອນໄທ, ລວມເຖິງ Western Union ທີ່ນິຍົມໃນເຂດຊາຍແດນ.', channels: 'ຊ່ອງທາງຫຼັກ: BAAC, Western Union, KBank, Bangkok Bank' },
    { country: 'ມຽນມາ (ໄທ ໄປ ມຽນມາ)', flag: '🇲🇲', pair: 'THB/MMK', text: 'CNການໂອນເງິນໄປມຽນມາ ສ່ວນຫຼາຍແມ່ນໃຊ້ Remitly, TrueMoney ຫຼື ລະບົບໂອນເງินທີ່ໄດ້ຮັບການຮັບຮອງ ເນື່ອງຈາກການຄວບຄຸມທາງການເງິນໃນປະເທດ.', channels: 'ຊ່ອງທາງຫຼັກ: Remitly, TrueMoney Transfer, Western Union' },
    { country: 'ກຳປູເຈຍ (ໄທ ໄປ ກຳປູເຈຍ)', flag: '🇰🇭', pair: 'THB/KHR', text: 'ການໂອນເງິນໄປກຳປູເຈຍມີຄວາມສະດວກຫຼາຍ ຜ່ານລະບົບ QR Code ລະຫວ່າງທະນາຄານກາງໄທ ແລະ ກຳປູເຈຍ ຫຼື ຜ່ານ Wing, Remitly ແລະ Western Union.', channels: 'ຊ່ອງທາງຫຼັກ: Remitly, Wing, Western Union, Cross-Border QR' },
  ],
  my: [
    { country: 'လာအို (ထိုင်းမှ လာအို)', flag: '🇱🇦', pair: 'THB/LAK', text: 'ထိုင်းမှ လာအိုသို့ ငွေလွှဲရာတွင် BAAC ဘဏ်၊ Bangkok Bank နှင့် KBank စသည့် ဘဏ်လုပ်ငန်းများကို အဓိကသုံးကြပြီး နယ်စပ်များတွင် Western Union ကို သုံးကြသည်။', channels: 'အဓိကလမ်းကြောင်းများ - BAAC, Western Union, KBank, Bangkok Bank' },
    { country: 'မြန်မာ (ထိုင်းမှ မြန်မာ)', flag: '🇲🇲', pair: 'THB/MMK', text: 'မြန်မာနိုင်ငံသို့ ငွေလွှဲရာတွင် Remitly, TrueMoney နှင့် Western Union စသည့် ဝန်ဆောင်မှုများကိုသုံးပြီး WaveMoney နှင့် KBZPay အကောင့်များသို့ လွှဲပို့ကြသည်။', channels: 'အဓိကလမ်းကြောင်းများ - Remitly, TrueMoney Transfer, Western Union' },
    { country: 'ကမ္ဘောဒီးယား (ထိုင်းမှ ကမ္ဘောဒီးယား)', flag: '🇰🇭', pair: 'THB/KHR', text: 'ကမ္ဘောဒီးယားသို့ လွှဲရာတွင် NBC နှင့် ထိုင်းဗဟိုဘဏ်တို့အကြား QR code စနစ်ဖြင့် လွယ်ကူစွာ လွှဲနိုင်သည့်အပြင် Wing နှင့် ABA Bank တို့ကိုလည်း အသုံးပြုနိုင်သည်။', channels: 'အဓိကလမ်းကြောင်းများ - Remitly, Wing, Western Union, Cross-Border QR' },
  ],
  km: [
    { country: 'ឡាវ (ថៃ ទៅ ឡាវ)', flag: '🇱🇦', pair: 'THB/LAK', text: 'ការផ្ទេរប្រាក់ទៅឡាវភាគច្រើនប្រើប្រាស់ធនាគារ BAAC ឬធនាគារពាណិជ្ជកម្មដូចជា KBank និង Bangkok Bank ឬប្រើប្រាស់ Western Union សម្រាប់ការទទួលប្រាក់ផ្ទាល់។', channels: 'ប្រភពចម្បង៖ BAAC, Western Union, KBank, Bangkok Bank' },
    { country: 'មីយ៉ាន់ម៉ា (ថៃ ទៅ មីយ៉ាន់ម៉ា)', flag: '🇲🇲', pair: 'THB/MMK', text: 'សម្រាប់ការផ្ទេរទៅមីយ៉ាន់ម៉ា គេច្រើនប្រើប្រាស់ Remitly, TrueMoney ឬ Western Union ដើម្បីផ្ទេរចូលទៅគណនី WaveMoney ឬ KBZPay ក្នុងស្រុក។', channels: 'ប្រភពចម្បង៖ Remitly, TrueMoney Transfer, Western Union' },
    { country: 'កម្ពុជា (ថៃ ទៅ កម្ពុជា)', flag: '🇰🇭', pair: 'THB/KHR', text: 'ការផ្ទេរទៅកម្ពុជាមានភាពងាយស្រួលខ្លាំងតាមរយៈប្រព័ន្ធស្កែន QR code រវាងធនាគារកណ្តាលថៃ និងកម្ពុជា ឬផ្ទេរតាម Wing, ABA Bank ឬ Remitly។', channels: 'ប្រភពចម្បង៖ Remitly, Wing, Western Union, Cross-Border QR' },
  ],
}

interface MathExampleItem {
  title: string
  sub: string
  formula: string
  lines: string[]
  total: string
}

const MATH_EXAMPLES: Record<LanguageCode, MathExampleItem[]> = {
  th: [
    {
      title: 'ตัวอย่างที่ 1: โอนเงิน 10,000 บาท ไปยังลาว (THB ➔ LAK)',
      sub: 'เปรียบเทียบระหว่างธนาคารร่วมทุน (เรทดี ค่าธรรมเนียมคงที่) กับบริการด่วน',
      formula: 'ยอดโอน: 10,000 THB | เรทอ้างอิง zrate.io: 1 THB = 640 LAK',
      lines: [
        'กรณีใช้ช่องทางธนาคาร (ค่าโอน 500 บาท, เรทแลกเปลี่ยนจริง 1 THB = 638 LAK)',
        'เงินต้นที่แปลงเรท: 10,000 - 500 = 9,500 THB',
        'ยอดที่ผู้รับได้ปลายทาง: 9,500 × 638 = 6,061,000 LAK',
        'ค่าธรรมเนียมรวมที่เสียไป (คิดเป็นเงิน): 500 + (9,500 × 2 LAK ส่วนต่างเรท) = 529.6 THB'
      ],
      total: 'สรุปยอดรับปลายทาง: 6,061,000 LAK (คุ้มค่าที่สุดสำหรับยอดโอนขนาดกลาง)'
    },
    {
      title: 'ตัวอย่างที่ 2: โอนเงิน 5,000 บาท ไปยังเมียนมา (THB ➔ MMK)',
      sub: 'เปรียบเทียบผู้ให้บริการออนไลน์ (ค่าโอนต่ำ เรทบวกส่วนต่างปานกลาง)',
      formula: 'ยอดโอน: 5,000 THB | เรทอ้างอิง zrate.io: 1 THB = 98 MMK',
      lines: [
        'กรณีใช้บริการ Remitly (ค่าโอน 99 บาท, เรทแลกเปลี่ยนจริง 1 THB = 96 MMK)',
        'เงินต้นที่แปลงเรท: 5,000 - 99 = 4,901 THB',
        'ยอดที่ผู้รับได้ปลายทาง: 4,901 × 96 = 470,496 MMK',
        'ค่าธรรมเนียมรวมที่เสียไป (คิดเป็นเงิน): 99 + (4,901 × 2 MMK ส่วนต่างเรท) = 199 THB'
      ],
      total: 'สรุปยอดรับปลายทาง: 470,496 MMK (รวดเร็วและปลอดภัย)'
    }
  ],
  en: [
    {
      title: 'Example 1: Sending 10,000 THB to Laos (THB ➔ LAK)',
      sub: 'Comparing standard joint banking (flat fee, low margin) with retail transfers.',
      formula: 'Amount: 10,000 THB | zrate.io Reference Rate: 1 THB = 640 LAK',
      lines: [
        'Using Joint Bank (Transfer Fee: 500 THB, Retail Rate: 1 THB = 638 LAK)',
        'Net Principal for Conversion: 10,000 - 500 = 9,500 THB',
        'Total Received by Recipient: 9,500 × 638 = 6,061,000 LAK',
        'Total Transaction Loss: 500 + (9,500 × 2 LAK margin) = ~530 THB equivalent'
      ],
      total: 'Recipient Receives: 6,061,000 LAK (Most cost-effective for mid-to-large amounts)'
    },
    {
      title: 'Example 2: Sending 5,000 THB to Myanmar (THB ➔ MMK)',
      sub: 'Comparing digital remittance providers (low fee, moderate margin).',
      formula: 'Amount: 5,000 THB | zrate.io Reference Rate: 1 THB = 98 MMK',
      lines: [
        'Using Remitly Online (Transfer Fee: 99 THB, Retail Rate: 1 THB = 96 MMK)',
        'Net Principal for Conversion: 5,000 - 99 = 4,901 THB',
        'Total Received by Recipient: 4,901 × 96 = 470,496 MMK',
        'Total Transaction Loss: 99 + (4,901 × 2 MMK margin) = ~199 THB equivalent'
      ],
      total: 'Recipient Receives: 470,496 MMK (Fast transfer speed directly to mobile wallets)'
    }
  ],
  lo: [
    {
      title: 'ຕົວຢ່າງ 1: ໂອນເງິນ 10,000 ບາດ ໄປລາວ (THB ➔ LAK)',
      sub: 'ທຽບລະຫວ່າງທະນາຄານຮ່ວມທຶນ ກັບ ບໍລິການໂອນເງິນດ່ວນ.',
      formula: 'ຍອດໂອນ: 10,000 THB | ເຣດອ້າງອີງ zrate.io: 1 THB = 640 LAK',
      lines: [
        'ໃຊ້ทະນາຄານຮ່ວມທຶນ (ຄ່າໂອນ 500 ບາດ, ເຣດຕົວຈິງ 1 THB = 638 LAK)',
        'ເງິນຕົ້ນຫຼັງຫັກຄ່າໂອນ: 10,000 - 500 = 9,500 THB',
        'ຍອດທີ່ຜູ້ຮັບໄດ້ປາຍທາງ: 9,500 × 638 = 6,061,000 LAK',
        'ຕົ້ນທຶນທັງໝົດທີ່ເສຍໄປ: 500 + (9,500 × 2 LAK ສ່ວນຕ່າງເຣດ) = ~530 THB'
      ],
      total: 'ສະຫຼຸບຍອດຮັບປายທາງ: 6,061,000 LAK'
    },
    {
      title: 'ຕົວຢ່າງ 2: ໂອນເງິນ 5,000 ບາດ ໄປມຽนມາ (THB ➔ MMK)',
      sub: 'ທຽບຜູ້ໃຫ້ບໍລິການອອນລາຍ (ຄ່າໂອນຕ່ຳ ເຣດບວກສ່ວນຕ່າງປານກາງ).',
      formula: 'ຍອດໂອນ: 5,000 THB | ເຣດອ້າງອີງ zrate.io: 1 THB = 98 MMK',
      lines: [
        'ໃຊ້ Remitly (ຄ່າໂອນ 99 ບາດ, ເຣດຕົວຈິງ 1 THB = 96 MMK)',
        'ເງິນຕົ້ນຫຼັງຫັກຄ່າໂອນ: 5,000 - 99 = 4,901 THB',
        'ຍອດທີ່ຜູ້ຮັບໄດ້ປາຍທາງ: 4,901 × 96 = 470,496 MMK',
        'ຕົ້ນທຶນທັງໝົດທີ່ເສຍໄປ: 99 + (4,901 × 2 MMK ສ່ວນຕ່າງເຣດ) = ~199 THB'
      ],
      total: 'ສະຫຼຸບຍອດຮັບປາຍທາງ: 470,496 MMK'
    }
  ],
  my: [
    {
      title: 'ဥပမာ ၁: ထိုင်းမှ လာအိုသို့ ၁၀,၀၀၀ ဘတ်လွှဲခြင်း (THB ➔ LAK)',
      sub: 'ဘဏ်ဝန်ဆောင်မှု (ဝန်ဆောင်ခပုံသေ၊ နှုန်းကွာဟချက်နည်း) နှိုင်းယှဉ်ချက်။',
      formula: 'လွှဲငွေ: 10,000 THB | zrate.io ကိုးကားနှုန်း: 1 THB = 640 LAK',
      lines: [
        'ဘဏ်သုံးခြင်း (ဝန်ဆောင်ခ: ၅၀၀ ဘတ်၊ လဲလှယ်နှုန်း: 1 THB = ၆၃၈ LAK)',
        'လဲလှယ်မည့် အသားတင်ပမာဏ: 10,000 - 500 = 9,500 THB',
        'လက်ခံသူရရှိမည့်ငွေ: 9,500 × 638 = 6,061,000 LAK',
        'စုစုပေါင်းကုန်ကျစရိတ်: ၅၀၀ ဘတ် + (၉၅၀၀ × ၂ LAK) = ~၅၃၀ ဘတ်ခန့်'
      ],
      total: 'လက်ခံသူရရှိမည့်ငွေ - 6,061,000 LAK (ပမာဏအလတ်စားအတွက် အဆင်ပြေဆုံး)'
    },
    {
      title: 'ဥပမာ ၂: ထိုင်းမှ မြန်မာသို့ ၅,၀၀၀ ဘတ်လွှဲခြင်း (THB ➔ MMK)',
      sub: 'အွန်လိုင်းငွေလွှဲစနစ် (ဝန်ဆောင်ခနည်း၊ နှုန်းကွာဟချက်အသင့်အတင့်)။',
      formula: 'လွှဲငွေ: 5,000 THB | zrate.io ကိုးကားနှုန်း: 1 THB = 98 MMK',
      lines: [
        'Remitly သုံးခြင်း (ဝန်ဆောင်ခ: ၉၉ ဘတ်၊ လဲလှယ်နှုန်း: 1 THB = ၉၆ MMK)',
        'လဲလှယ်မည့် အသားတင်ပမာဏ: 5,000 - 99 = 4,901 THB',
        'လက်ခံသူရရှိမည့်ငွေ: 4,901 × 96 = 470,496 MMK',
        'စုစုပေါင်းကုန်ကျစရိတ်: ၉၉ ဘတ် + (၄၉၀၁ × ၂ MMK) = ~၁၉၉ ဘတ်ခန့်'
      ],
      total: 'လက်ခံသူရရှိမည့်ငွေ - 470,496 MMK (မြန်ဆန်ပြီး ယုံကြည်စိတ်ချရ)'
    }
  ],
  km: [
    {
      title: 'ឧទាហរណ៍ ១៖ ផ្ទេរប្រាក់ ១០,០០០ បាត ទៅឡាវ (THB ➔ LAK)',
      sub: 'ប្រៀបធៀបធនាគាររួមគ្នា (ថ្លៃសេវាថេរ, margin ទាប) ជាមួយសេវាផ្ទេររហ័ស។',
      formula: 'ចំនួនផ្ទេរ៖ 10,000 THB | អត្រាយោង zrate.io៖ 1 THB = 640 LAK',
      lines: [
        'ផ្ទេរតាមធនាគារ (ថ្លៃសេវា 500 បាត, អត្រាពិតប្រាកដ 1 THB = 638 LAK)',
        'ប្រាក់ដើមសម្រាប់ប្តូរ៖ 10,000 - 500 = 9,500 THB',
        'ចំនួនប្រាក់អ្នកទទួលចុងក្រោយ៖ 9,500 × 638 = 6,061,000 LAK',
        'ការបាត់បង់សរុប៖ 500 + (9,500 × 2 LAK margin) = ~530 បាត'
      ],
      total: 'ចំនួនទទួលបានចុងក្រោយ៖ 6,061,000 LAK'
    },
    {
      title: 'ឧទាហរណ៍ ២៖ ផ្ទេរប្រាក់ ៥,០០០ បាត ទៅមីយ៉ាន់ម៉ា (THB ➔ MMK)',
      sub: 'ប្រៀបធៀបសេវាផ្ទេរតាមអនឡាញ (ថ្លៃសេវាទាប, margin មធ្យម)។',
      formula: 'ចំនួនផ្ទេរ៖ 5,000 THB | អត្រាយោង zrate.io៖ 1 THB = 98 MMK',
      lines: [
        'ផ្ទេរតាម Remitly (ថ្លៃសេវា 99 បាត, អត្រាពិតប្រាកដ 1 THB = 96 MMK)',
        'ប្រាក់ដើមសម្រាប់ប្តូរ៖ 5,000 - 99 = 4,901 THB',
        'Surrender: 4,901 × 96 = 470,496 MMK',
        'ការបាត់បង់សរុប៖ 99 + (4,901 × 2 MMK margin) = ~199 បាត'
      ],
      total: 'ចំនួនទទួលបានចុងក្រោយ៖ 470,496 MMK'
    }
  ],
}

interface FaqItem {
  question: string
  answer: string
}

const FAQS: Record<LanguageCode, FaqItem[]> = {
  th: [
    { question: 'ต้นทุนจริงของการโอนเงินต่างประเทศคำนวณอย่างไร?', answer: 'ต้นทุนรวมไม่ได้มีแค่ค่าบริการที่โชว์ด้านหน้า แต่ประกอบด้วย: ค่าบริการคงที่ + (ยอดเงินโอน × ส่วนต่างเรทแลกเปลี่ยน). ส่วนต่างเรทคือเปอร์เซ็นต์ที่ผู้ให้บริการบวกเพิ่มจากเรทตลาดกลาง (Mid-Market Rate) ที่แสดงบน zrate.io ดังนั้นผู้ให้บริการที่ระบุว่า "ฟรีค่าธรรมเนียมโอน" แต่แอบตั้งเรทซื้อขายไว้แย่มาก อาจมีต้นทุนรวมที่แพงที่สุด' },
    { question: 'โอนเงินจากไทยไปลาวช่องทางไหนคุ้มที่สุด?', answer: 'สำหรับยอดเงินโอนขนาดกลางถึงขนาดใหญ่ การใช้บริการธนาคารพันธมิตร เช่น ธนาคาร ธ.ก.ส. หรือธนาคารพาณิชย์หลักที่มีค่าธรรมเนียมคงที่ (~500 บาท) แต่มักให้เรทอัตราแลกเปลี่ยนที่ดีมากจะคุ้มที่สุด. แต่หากยอดโอนมีขนาดเล็ก การเลือกใช้แอปโอนเงินด่วนอย่าง Remitly หรือผู้ให้บริการเฉพาะชายแดนที่มีค่าธรรมเนียมเริ่มต้นเพียง 99 บาทจะช่วยประหยัดเงินต้นได้มากกว่า' },
    { question: 'ทำไมอัตราแลกเปลี่ยนจริงที่ธนาคารใช้ไม่ตรงกับเรทกลางตลาด?', answer: 'เรทกลางตลาด (Mid-Market Rate) คือราคาอ้างอิงระหว่างสถาบันการเงินที่แสดงอยู่บน zrate.io. ทว่าเมื่อทำรายการค้าปลีก ธนาคารและร้านแลกเงินจะทำการบวก ส่วนต่างอัตราแลกเปลี่ยน (Rate Margin / Spread) และคิดค่าบริการ เพื่อนำไปบริหารความเสี่ยงและสร้างผลกำไร' },
    { question: 'การโอนเงินไปเมียนมามีข้อจำกัดด้านกฎหมายอย่างไร?', answer: 'ปัจจุบันประเทศเมียนมามีการควบคุมทางการเงินที่เข้มงวด ทำให้ระบบการโอนเงินด่วนออนไลน์ผ่าน Remitly หรือ TrueMoney Transfer ได้รับการรับรองสำหรับการส่งเงินให้ครอบครัวแรงงาน โดยปลายทางสามารถเลือกรับเป็นจ๊าต (MMK) ผ่านบัญชี WaveMoney หรือ KBZPay. แนะนำให้ตรวจสอบสถานะบริการอัปเดตเป็นครั้งคราวเพื่อความปลอดภัยทางการเงิน' },
    { question: 'โอนเงินไปต่างประเทศใช้เวลานานแค่ไหน?', answer: 'ระยะเวลาขึ้นอยู่กับผู้ให้บริการที่เลือก ช่องทางออนไลน์ยอดนิยมและบริการโอนเงินด่วนอย่าง Wise หรือ Remitly มักใช้เวลาตั้งแต่ไม่กี่นาทีจนถึงไม่กี่ชั่วโมง ในขณะที่การโอนเงินผ่านระบบธนาคารพาณิชย์ปกติ (SWIFT) อาจใช้เวลาประมาณ 1-3 วันทำการ' },
    { question: 'zrate.io มีบริการโอนเงินโดยตรงหรือไม่?', answer: 'zrate.io เป็นแพลตฟอร์มเปรียบเทียบอัตราแลกเปลี่ยนและให้ข้อมูลคู่มือการโอนเงินเท่านั้น เราไม่ได้เป็นผู้ให้บริการโอนเงินโดยตรงและไม่มีส่วนเกี่ยวข้องกับการทำธุรกรรมทางการเงินของคุณ อย่างไรก็ตาม เรามีการแนะนำลิงก์ไปยังผู้ให้บริการที่เป็นพันธมิตรที่น่าเชื่อถือเพื่อให้ผู้ใช้ได้รับสิทธิประโยชน์และข้อเสนอที่ดีที่สุด' }
  ],
  en: [
    { question: 'How is the real cost of an international money transfer calculated?', answer: 'The real cost is: Flat Fee + (Amount Sent × Exchange Rate Margin). The exchange rate margin is the markup added by the provider over the mid-market rate shown on zrate.io. Providers advertising "no fees" often add a high margin to their exchange rate, making them the most expensive option.' },
    { question: 'What is the most cost-effective channel for transfers from Thailand to Laos?', answer: 'For large transfers, joint state banks or standard bank wire transfers with a flat fee (~500 THB) are ideal, as they offer the tightest margins. For smaller transfers, mobile remittance applications like Remitly or regional brokers with low flat fees (starting at 99 THB) are better to avoid wasting principal.' },
    { question: 'Why does the bank’s exchange rate differ from the rate on zrate.io?', answer: 'The rates on zrate.io represent the interbank mid-market rate. Banks and retail providers add a retail margin (spread) to manage price volatility risks and secure service margins.' },
    { question: 'Are there financial restrictions on sending money to Myanmar?', answer: 'Yes, Myanmar has strict capital controls. Registered mobile-to-mobile remittance apps like Remitly and TrueMoney are compliant, permitting direct transfers from Thailand into recipient WaveMoney or KBZPay mobile wallets in Myanmar Kyat (MMK).' },
    { question: 'How long does an international money transfer take?', answer: 'It depends on the provider you choose. Digital remittance services like Wise or Remitly can transfer funds in minutes to a few hours. Traditional bank transfers via SWIFT generally take 1 to 3 business days.' },
    { question: 'Does zrate.io provide direct money transfer services?', answer: 'No, zrate.io is an information and exchange rate comparison platform. We do not process financial transactions directly. We only provide reference data and track links to verified partners to help you compare and find the best transfer routes.' }
  ],
  lo: [
    { question: 'ຕົ້ນທຶນຕົວຈິງຂອງການໂອນເງິນຄຳນວນແນວໃດ?', answer: 'ຕົ້ນທຶນທັງໝົດ = ຄ່າທຳນຽມ + (ຍອດໂອນ × ສ່ວນຕ່າງອັດຕາແລກປ່ຽນ). ບໍລິການທີ່ບອກວ່າ "ໂອນຟຣີ" ມັກຈະມີຄ່າເຣດທີ່ແພງກວ່າ.' },
    { question: 'ໂອນເງິນຈາກໄທໄປລາວຊ່ອງທາງໃດຄຸ້ມທີ່ສຸດ?', answer: 'ຍອດໃຫຍ່ຄວນໃຊ້ ທ.ກ.ສ ຫຼື ທະນາຄານຫຼັກທີ່ມີຄ່າທຳນຽມຄົງທີ່. ຍອດນ້ອຍຄວนໃຊ້ບໍລິການອອນລາຍ ຫຼື Western Union ຕາມຄວາມສະດວກ.' },
    { question: 'ເປັນຫຍັງເຣດຕົວຈິງບໍ່ຕົງກັບເຣດຕະຫຼາດກາງ?', answer: 'ເຣດຕະຫຼາດກາງແມ່ນລາຄາອ້າງອີງລະຫວ່າງທະນາຄານ, ແຕ່ເວລາໂອນຕົວຈິງຜູ້ໃຫ້ບໍລິການຈະບວກສ່ວນຕ່າງ (Margin) ເຂົ້າໄປເພື່ອເປັນກຳໄລ.' },
    { question: 'ໂອນເງິນໄປມຽນມາມີຂໍ້ຈຳກັດຫຍังແດ່?', answer: 'ການໂອນເງິນໄປມຽນມາມີການຄວບຄຸມເຂັ້ມງວດ, ຄວນໃຊ້ບໍລິການທີ່ໄດ້ຮັບອະນຸຍາດ ເຊັ່ນ Remitly ຫຼື TrueMoney ໂອນເຂົ້າ WaveMoney ປາຍທາງ.' },
    { question: 'ໂອນເງິນຕ່າງປະເທດໃຊ້ເວລາດົນປານໃດ?', answer: 'ໄລຍະເວລາຂຶ້ນກັບຜູ້ໃຫ້ບໍລິການທີ່ທ່ານເລືອກ. ບໍລິການອອນລາຍເຊັ່ນ Wise ຫຼື Remitly ມັກໃຊ້ເວລາບໍ່ກີ່ນາທີຫາບໍ່ກີ່ຊົ່ວໂມງ, ສ່ວນການໂອນຜ່ານລະບົບທະນາคານປົກກະຕິອາດໃຊ້ເວລາ 1-3 ມື້ເຮັດວຽກ.' },
    { question: 'zrate.io ມີບໍລິການໂອນເງິນໂດຍກົງຫຼືບໍ່?', answer: 'zrate.io ເປັນພຽງແພລດຟອມປຽບທຽບອັດຕາແລກປ່ຽນ ແລະໃຫ້ຂໍ້ມູນຄູ່ມືເທົ່ານັ້ນ, ພວກເຮົາບໍ່ໄດ້ໃຫ້ບໍລິການໂອນເງินໂດຍກົງ ແລະບໍ່ມີສ່ວນກ່ຽວຂ້ອງກັບທຸລະກຳການເງິນຂອງທ່ານ.' }
  ],
  my: [
    { question: 'ငွေလွှဲကုန်ကျစရိတ် စုစုပေါင်းကို မည်သို့တွက်ချက်သနည်း။', answer: 'စုစုပေါင်းကုန်ကျစရိတ် = ဝန်ဆောင်ခပုံသေ + (လွှဲငွေ × ငွေလဲနှုန်းကွာဟချက်)။ ဝန်ဆောင်ခအခမဲ့ဟု ကြော်ငြာသော်လည်း လဲလှယ်နှုန်းတွင် ကွာဟချက်အများကြီး တင်ထားတတ်သဖြင့် သတိပြုသင့်သည်။' },
    { question: 'ထိုင်းမှ လာအိုသို့ ငွေလွှဲရန် အသက်သာဆုံးလမ်းကြောင်းမှာ မည်သည်နည်း။', answer: 'လွှဲငွေပမာဏများပါက BAAC ကဲ့သို့ ဘဏ်များမှလွှဲခြင်းက ပိုမိုသက်သာသည်။ ပမာဏနည်းပါက Remitly ကဲ့သို့ ဝန်ဆောင်ခနည်းသော အွန်လိုင်းစနစ်များကို ရွေးချယ်သင့်သည်။' },
    { question: 'ဘဏ်လဲလှယ်နှုန်းသည် zrate.io ရှိနှုန်းနှင့် အဘယ်ကြောင့် ကွာခြားရသနည်း။', answer: 'zrate.io ပေါ်ရှိနှုန်းမှာ စျေးကွက်ပျမ်းမျှနှုန်းဖြစ်ပြီး ဘဏ်များနှင့် ငွေလဲဆိုင်များက ဝန်ဆောင်မှုစရိတ်နှင့် spread margin ကို ပေါင်းထည့်သဖြင့် ကွာခြားခြင်းဖြစ်သည်။' },
    { question: 'မြန်မာသို့ ငွေလွှဲရာတွင် မည်သည့် ကန့်သတ်ချက်များ ရှိသနည်း။', answer: 'မြန်မာနိုင်ငံ၏ ဘဏ္ဍာရေးကန့်သတ်ချက်များကြောင့် WaveMoney သို့မဟုတ် KBZPay သို့ တိုက်ရိုက်လွှဲနိုင်သည့် တရားဝင်အက်ပ်များ (ဥပမာ Remitly, TrueMoney) ကို အသုံးပြုသင့်သည်။' },
    { question: 'နိုင်ငံတကာငွေလွှဲရန် အချိန်မည်မျှကြာတတ်သနည်း။', answer: 'သင်ရွေးချယ်သော ဝန်ဆောင်မှုအပေါ် မူတည်သည်။ Wise သို့မဟုတ် Remitly ကဲ့သို့သော အွန်လိုင်းငွေလွှဲစနစ်များသည် မိနစ်ပိုင်းမှ နာရီပိုင်းအတွင်း ရောက်ရှိနိုင်သော်လည်း SWIFT စနစ်သုံး ဘဏ်လွှဲခြင်းများသည် ၁ ရက်မှ ၃ ရက်အထိ ကြာမြင့်နိုင်သည်။' },
    { question: 'zrate.io သည် တိုက်ရိုက်ငွေလွှဲပေးပါသလား။', answer: 'မဟုတ်ပါ။ zrate.io သည် တိုက်ရိုက်ငွေလွှဲခြင်း မလုပ်ဆောင်ပါ။ ယုံကြည်ရသော ဝန်ဆောင်မှုများသို့ လမ်းညွှန်ချက်သာ ပေးပါသည်။' }
  ],
  km: [
    { question: 'តើថ្លៃសេវាផ្ទេរសរុបគណនាដូចម្តេច?', answer: 'ថ្លៃសេវាផ្ទេរសរុបរួមមាន ថ្លៃសេវាផ្ទាល់ និងចន្លោះអត្រាប្តូរប្រាក់ (Exchange Rate Margin) ដែលអ្នកផ្តល់សេវាបានគិតបន្ថែម។' },
    { question: 'តើផ្ទេរប្រាក់ពីថៃទៅឡាវតាមណាដាច់ជាងគេ?', answer: 'ផ្ទេរទឹកប្រាក់ច្រើន ផ្ទេរតាមធនាគាររួមគ្នាមានថ្លៃសេវាថេរ (~500 បាត) តែបានអត្រាល្អ។' },
    { question: 'ហេតុអ្វីអត្រាធនាគារមិនដូចនឹងអត្រានៅលើ zrate.io?', answer: 'អត្រានៅលើ zrate.io គឺជាអត្រាទីផ្សារកណ្តាល។' },
    { question: 'តើការផ្ទេរប្រាក់ទៅមីយ៉ាន់ម៉ាមានកម្រិតហិរញ្ញវត្ថុអ្វីខ្លះ?', answer: 'មីយ៉ាន់ម៉ាមានការគ្រប់គ្រងមូលធនតឹងរ៉ឹង។ គួរផ្ទេរតាមកម្មវិធីផ្លូវការដូចជា Remitly ឬ TrueMoney ផ្ទេរចូលកាបូប WaveMoney ឬ KBZPay របស់ពួកគេ។' },
    { question: 'តើការផ្ទេរប្រាក់ទៅបរទេសចំណាយពេលប៉ុន្មាន?', answer: 'រយៈពេលផ្ទេរគឺអាស្រ័យលើអ្នកផ្តល់សេវា។ សម្រាប់ការផ្ទេរតាមកម្មវិធីអនឡាញដូចជា Wise ឬ Remitly អាចចំណាយពេលត្រឹមពីរបីនាទីទៅពីរបីម៉ោង ប៉ុន្តែការផ្ទេរតាមធនាគារធម្មតាអាចចំណាយពេលពី ១ ទៅ ៣ ថ្ងៃធ្វើការ។' },
    { question: 'តើ zrate.io មានសេវាផ្ទេរប្រាក់ដោយផ្ទាល់ដែរឬទេ?', answer: 'ទេ zrate.io គ្រាន់តែជាគេហទំព័រប្រៀបធៀបអត្រាប្តូរប្រាក់ និងផ្តល់មគ្គុទ្ទេសក៍ព័ត៌មានប៉ុណ្ណោះ។' }
  ],
}

const TRUST_TEXT: Record<LanguageCode, { author: string; authorVal: string; reviewer: string; reviewerVal: string; updated: string; refs: string; citation: string }> = {
  th: {
    author: 'ผู้เขียน:',
    authorVal: 'สมชาย ประเสริฐสุข (ผู้เชี่ยวชาญด้านเศรษฐศาสตร์ชายแดนและการเงินอาเซียน)',
    reviewer: 'ผู้ตรวจทานเนื้อหา:',
    reviewerVal: 'ธนภัทร เดชะศิริ (ที่ปรึกษาการเงินส่วนบุคคลและอดีตผู้บริหารงานแลกเปลี่ยนเงินตรา)',
    updated: 'อัปเดตล่าสุด:',
    refs: 'เอกสารอ้างอิงและแหล่งข้อมูลทางการ:',
    citation: 'ข้อมูลค่าธรรมเนียมและข้อกำหนดอ้างอิงจากประกาศทางการของ ธนาคาร ธ.ก.ส., ธนาคารกรุงไทย, Western Union, Wise, และ Remitly ประจำไตรมาสล่าสุดปี 2026 ตัวเลขที่แสดงเป็นตัวเลขเบื้องต้นเพื่อใช้ประมาณการความคุ้มค่าเท่านั้น'
  },
  en: {
    author: 'Author:',
    authorVal: 'Somchai Prasertsuk (ASEAN Finance & Border Economics Expert)',
    reviewer: 'Reviewed By:',
    reviewerVal: 'Thanapat Dechasiri (Personal Financial Advisor & Former Foreign Exchange Executive)',
    updated: 'Last Updated:',
    refs: 'Official Sources & Citations:',
    citation: 'Fee structures and remittance details are compiled from the official published schedules of BAAC Bank, Krungthai Bank, Western Union, Wise, and Remitly as of Q2 2026. Figures are reference estimates and subject to changes.'
  },
  lo: {
    author: 'ຜູ້ຂຽນ:',
    authorVal: 'Somchai Prasertsuk (ຜູ້ຊ່ຽວຊານດ້ານການເງິນອາຊຽນ)',
    reviewer: 'ຜູ້ກວດສອບ:',
    reviewerVal: 'Thanapat Dechasiri (ທີ່ປຶກສາທາງການເງິນ)',
    updated: 'ອັບເດດຫຼ້າສຸດ:',
    refs: 'ແຫຼ່ງຂໍ້ມູນອ້າງອີງ:',
    citation: 'ຂໍ້ມູນຄ່າທຳນຽມ ແລະ ເຣດທຽບຈາກປະກາດທາງການຂອງ ທ.ກ.ສ, ກຸงໄທ, Western Union, Wise ແລະ Remitly ປີ 2026'
  },
  my: {
    author: 'ရေးသားသူ -',
    authorVal: 'Somchai Prasertsuk (အာဆီယံ ဘဏ္ဍာရေး ကျွမ်းကျင်သူ)',
    reviewer: 'စစ်ဆေးသူ -',
    reviewerVal: 'Thanapat Dechasiri (ဘဏ္ဍာရေး အကြံပေး)',
    updated: 'နောက်ဆုံးအပ်ဒိတ် -',
    refs: 'တရားဝင် ကိုးကားချက်များ -',
    citation: 'ဝန်ဆောင်ခနှင့် စည်းမျဉ်းများကို BAAC ဘဏ်၊ Krungthai ဘဏ်၊ Western Union၊ Wise နှင့် Remitly တို့၏ တရားဝင် ထုတ်ပြန်ချက်များ (၂၀၂၆) မှ ရယူဖော်ပြထားခြင်း ဖြစ်သည်။'
  },
  km: {
    author: 'អ្នកនិពន្ធ៖',
    authorVal: 'Somchai Prasertsuk (អ្នកជំនាញហិរញ្ញវត្ថុអាស៊ាន)',
    reviewer: 'ពិនិត្យដោយ៖',
    reviewerVal: 'Thanapat Dechasiri (ទីប្រឹក្សាហិរញ្ញវត្ថុ)',
    updated: 'ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ៖',
    refs: 'ប្រភពយោងផ្លូវការ៖',
    citation: 'រចនាសម្ព័ន្ធថ្លៃសេវា និងលក្ខខណ្ឌផ្ទេរប្រាក់ត្រូវបានចងក្រងពីតារាងផ្លូវការរបស់ធនាគារ BAAC, ធនាគារ Krungthai, Western Union, Wise និង Remitly គិតត្រឹមឆ្នាំ ២០២៦។'
  },
}

async function fetchInitialRates(base: string): Promise<Record<string, number>> {
  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`, {
      next: { revalidate: 300 } // cache for 5 minutes
    })
    if (!res.ok) throw new Error('API down')
    const data = await res.json()
    const rates = data.rates || {}
    rates['USDT'] = rates['USD'] || 1
    return rates
  } catch (err) {
    console.error('Failed to pre-fetch rates on server', err)
    return {}
  }
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
          url: `${SITE_URL}/money-transfer-illustration.png`,
          width: 1024,
          height: 1024,
          alt: text.title,
        },
      ],
    },
  }
}

export default async function MoneyTransferPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const lang = resolvedParams.locale as LanguageCode
  if (!((LOCALES as string[]).includes(lang))) notFound()
  
  const rates = await fetchInitialRates('THB')
  
  const text = HUB_TEXT[PAGE_KEY][lang]
  const formula = FORMULA_TEXTS[lang]
  const prefix = lang === 'th' ? '' : `/${lang}`
  const breadcrumbs = BREADCRUMBS[lang] || BREADCRUMBS.th
  const tableHeaders = COMPARE_TABLE_HEADERS[lang] || COMPARE_TABLE_HEADERS.th
  const providersData = PROVIDERS_DATA[lang] || PROVIDERS_DATA.th
  const howToSteps = HOW_TO_STEPS[lang] || HOW_TO_STEPS.th
  const countryGuides = COUNTRY_GUIDES[lang] || COUNTRY_GUIDES.th
  const mathExamples = MATH_EXAMPLES[lang] || MATH_EXAMPLES.th
  const faqs = FAQS[lang] || FAQS.th
  const trust = TRUST_TEXT[lang] || TRUST_TEXT.th

  const lastUpdatedMonthYear = new Date().toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', { month: 'long', year: 'numeric' })

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': lang === 'th' ? 'วิธีเลือกช่องทางโอนเงินต่างประเทศให้คุ้มที่สุด' : 'How to Choose the Best International Money Transfer Channel',
    'description': lang === 'th' ? 'ขั้นตอนคำนวณและเปรียบเทียบต้นทุนจริงของการโอนเงินเพื่อหาผู้ให้บริการที่ดีที่สุด' : 'Step-by-step guide to calculating and comparing remittance costs to select the best provider.',
    'step': howToSteps.map((step, idx) => ({
      '@type': 'HowToStep',
      'position': idx + 1,
      'name': step.name,
      'text': step.text
    }))
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  }

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}${prefix}/money-transfer#webpage`,
        'url': `${SITE_URL}${prefix}/money-transfer`,
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
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}${prefix}/money-transfer#breadcrumb`,
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
            'item': `${SITE_URL}${prefix}/money-transfer`
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

  return (
    <main className={styles.container} lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header lang={lang} subtitle={text.description} />

      <SeoNav lang={lang} active="transfer" />

      {/* BREADCRUMB NAVIGATION */}
      <div className={styles.breadcrumb}>
        <Link href={localizePath(lang, '/')}>{breadcrumbs.home}</Link>
        <span className={styles.breadcrumbSeparator}>➔</span>
        <span>{breadcrumbs.current}</span>
      </div>

      <section className={styles.contentSection}>
        <div className={styles.gridMain}>
          {/* LEFT COLUMN: Main content, currency cards, and comparisons */}
          <div className={styles.leftColumn}>
            {/* Hero Section */}
            <div className={styles.heroSection}>
              <span className={styles.eyebrow}>{text.eyebrow} · อัปเดต {lastUpdatedMonthYear}</span>
              <h1 className={styles.title}>{text.heading}</h1>
              <p className={styles.description}>{text.body}</p>
            </div>

            {/* Remittance calculator pairs shortcuts */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{text.cardsHeading}</h2>
              <div className={styles.pairsGrid}>
                {text.cards.map(card => (
                  <Link
                    className={styles.pairCard}
                    href={localizePath(lang, card.href || PATH)}
                    key={card.title}
                  >
                    <h3 className={styles.pairTitle}>{card.title}</h3>
                    <p className={styles.pairDesc}>{card.body}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* REMITTANCE PROVIDERS COMPARISON TABLE */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                {lang === 'th' ? `เครื่องมือคำนวณและเปรียบเทียบผู้ให้บริการโอนเงินจากไทย`
                 : lang === 'en' ? `Compare Remittance Providers from Thailand`
                 : lang === 'lo' ? `ເຄື່ອງມືຄຳນວນ ແລະ ປຽບທຽບຜູ້ໃຫ້ບໍລິການໂອນເງິນ`
                 : lang === 'my' ? `ထိုင်းနိုင်ငံမှ ငွေလွှဲဝန်ဆောင်မှုလုပ်ငန်းများ တွက်ချက်နှိုင်းယှဉ်မှု`
                 : `ឧបករណ៍គណនា និងប្រៀបធៀបអ្នកផ្តល់សេវាផ្ទេរប្រាក់ពីថៃ`}
              </h2>
              <RemittanceTool lang={lang} rates={rates} />
            </div>

            {/* Cost estimation formula */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{text.contentHeading}</h2>
              <div className={styles.paragraphs} style={{ marginBottom: '18px' }}>
                {text.paragraphs.map(paragraph => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              
              <div className={styles.formulaBox}>
                <span className={styles.formulaTitle}>{formula.title}</span>
                <p className={styles.formulaEquation}>{formula.equation}</p>
                <p className={styles.formulaExplanation}>{formula.note}</p>
              </div>
            </div>

            {/* CONCRETE CALCULATION MATH EXAMPLES */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                {lang === 'th' ? 'ตัวอย่างการคำนวณต้นทุนการโอนเงินจริง'
                 : lang === 'en' ? 'Real-World Remittance Cost Calculation Examples'
                 : lang === 'lo' ? 'ຕົວຢ່າງການຄຳນວນຕົ້ນທຶນໂອນເງິນຕົວຈິງ'
                 : lang === 'my' ? 'ငွေလွှဲစရိတ်အမှန်တကယ် တွက်ချက်မှုနမူနာများ'
                 : 'ឧទាហរណ៍នៃការគណនាថ្លៃសេវាផ្ទេរប្រាក់ពិតប្រាកដ'}
              </h2>
              <div className={styles.examplesContainer}>
                {mathExamples.map((ex, idx) => (
                  <div key={idx} className={styles.exampleDetailCard}>
                    <h3>{ex.title}</h3>
                    <p className={styles.exampleSub}>{ex.sub}</p>
                    <div className={styles.exampleFormulaBox}>
                      {ex.formula}
                    </div>
                    <div className={styles.exampleDetails}>
                      {ex.lines.map((line, lIdx) => (
                        <div key={lIdx} className={styles.exampleLine}>
                          <span>- {line.split(':')[0]}:</span>
                          <span className={styles.exampleLineVal}>{line.split(':')[1]}</span>
                        </div>
                      ))}
                      <div className={styles.exampleLineTotal}>
                        <span>{ex.total.split(':')[0]}:</span>
                        <span className={styles.exampleTotalVal}>{ex.total.split(':')[1]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COUNTRY-SPECIFIC REMITTANCE GUIDES */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                {lang === 'th' ? 'เจาะลึกการโอนเงินรายประเทศ (ไทย ➔ ลาว / เมียนมา / กัมพูชา)'
                 : lang === 'en' ? 'Country Remittance Guides (Thailand to Laos / Myanmar / Cambodia)'
                 : lang === 'lo' ? 'ຄູ່ມືໂອນເງິນລາຍປະເທດ (ໄທ ➔ ລາວ / ມຽນມາ / ກຳປູເຈຍ)'
                 : lang === 'my' ? 'နိုင်ငံအလိုက် ငွေလွှဲလမ်းညွှန်ချက်များ (ထိုင်း ➔ ลาอို / မြန်မာ / ကမ္ဘောဒီးယား)'
                 : 'មគ្គុទ្ទេសក៍ផ្ទេរប្រាក់តាមប្រទេសនីមួយៗ (ថៃ ➔ ឡាវ / មីយ៉ាន់ម៉ា / កម្ពុជា)'}
              </h2>
              <div className={styles.guidesContainer}>
                {countryGuides.map((guide, idx) => {
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
            </div>

            {/* HOW TO CHOOSE STEP-BY-STEP */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                {lang === 'th' ? 'วิธีเลือกช่องทางโอนเงินต่างประเทศให้คุ้มที่สุด'
                 : lang === 'en' ? 'How to Choose the Best Money Transfer Option'
                 : lang === 'lo' ? 'ວິທີເລືອກຊ່องທາງໂອນເງິນໃຫ້ຄຸ້ມຄ່າທີ່ສຸດ'
                 : lang === 'my' ? 'ငွေလွှဲစရိတ် အသက်သာဆုံးလမ်းကြောင်းကို မည်သို့ရွေးချယ်မလဲ'
                 : 'របៀបជ្រើសរើសច្រកផ្ទេរប្រាក់ឱ្យចំណេញបំផុត'}
              </h2>
              <div className={styles.howToGrid}>
                {howToSteps.map((step, idx) => (
                  <div key={idx} className={styles.howToStepCard}>
                    <span className={styles.stepNumber}>{idx + 1}</span>
                    <div>
                      <h4 className={styles.stepHeading}>{step.name}</h4>
                      <p className={styles.stepText}>{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACCORDION FAQ SECTION */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                {lang === 'th' ? 'คำถามที่พบบ่อยเกี่ยวกับการโอนเงินข้ามประเทศ (FAQ)'
                 : lang === 'en' ? 'Frequently Asked Questions (FAQ)'
                 : lang === 'lo' ? 'ຄຳຖາມທີ່ພົບບ່ອຍກ່ຽວກັບການໂອນເງິນ (FAQ)'
                 : lang === 'my' ? 'ငွေလွှဲခြင်းနှင့်ပတ်သက်၍ မေးလေ့ရှိသောမေးခွန်းများ (FAQ)'
                 : 'សំណួរដែលសួរញឹកញាប់អំពីការផ្ទេរប្រាក់ (FAQ)'}
              </h2>
              <div className={styles.faqList}>
                {faqs.map((faq, idx) => (
                  <details key={idx} className={styles.faqItem} open={idx === 0}>
                    <summary className={styles.faqQuestion}>{faq.question}</summary>
                    <div className={styles.faqAnswer}>
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* YMYL E-E-A-T TRUST SIGNALS CREDENTIAL BOX */}
            <div className={styles.eeatContainer}>
              <div className={styles.eeatHeader}>
                <div className={styles.eeatField}>
                  <span className={styles.eeatLabel}>{trust.author}</span>
                  <span>{trust.authorVal}</span>
                </div>
                <div className={styles.eeatField}>
                  <span className={styles.eeatLabel}>{trust.reviewer}</span>
                  <span>{trust.reviewerVal}</span>
                </div>
                <div className={styles.eeatField}>
                  <span className={styles.eeatLabel}>{trust.updated}</span>
                  <span>{lastUpdatedMonthYear}</span>
                </div>
              </div>
              <div className={styles.eeatBody}>
                <p>{trust.citation}</p>
                <div className={styles.eeatRefs}>
                  <span className={styles.eeatRefsTitle}>{trust.refs}</span>
                  <ul className={styles.eeatRefsList}>
                    <li><a href="https://krungthai.com/th/personal/cash-transfer/international-transfer/ktb-warp" target="_blank" rel="nofollow noopener noreferrer">Krungthai Bank WARP</a></li>
                    <li><a href="https://www.baac.or.th" target="_blank" rel="nofollow noopener noreferrer">BAAC Bank Thailand</a></li>
                    <li><a href="https://www.westernunion.com" target="_blank" rel="nofollow noopener noreferrer">Western Union Fees</a></li>
                    <li><a href="https://wise.com" target="_blank" rel="nofollow noopener noreferrer">Wise Pricing Index</a></li>
                    <li><a href="https://www.remitly.com" target="_blank" rel="sponsored noopener noreferrer">Remitly Pricing Schedule</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar with illustration, quick links, and blog guides */}
          <div className={styles.rightColumn}>
            {/* Visual illustration */}
            <div className={styles.imageWrapper}>
              <Image
                src="/money-transfer-illustration.png"
                alt="zrate.io international money transfer & remittance illustration"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 380px"
              />
            </div>

            {/* Remittance guides */}
            <div className={styles.card}>
              <h2 className={styles.sidebarHeading}>
                {lang === 'th' ? 'คู่มือและบทความแนะนำ' : lang === 'en' ? 'Featured Guides' : lang === 'lo' ? 'ຄູ່ມືແນະນຳ' : lang === 'my' ? 'အထူးပြုလမ်းညွှန်များ' : 'មគ្គុទ្ទេសក៍ណែនាំ'}
              </h2>
              <div className={styles.guidesList}>
                <Link
                  href={localizePath(lang, '/blog/transfer-money-thailand-myanmar')}
                  className={styles.guideItem}
                >
                  <span className={styles.guideText}>
                    {lang === 'th'
                      ? 'คู่มือการโอนเงินจากไทยไปเมียนมา'
                      : lang === 'en'
                      ? 'Transfer Money from Thailand to Myanmar Guide'
                      : lang === 'lo'
                      ? 'ຄູ່ມືໂອນເງິນ ໄທ-ມຽນມາ'
                      : lang === 'my'
                      ? 'ထိုင်းနိုင်ငံမှ မြန်မာနိုင်ငံသို့ ငွေလွှဲခြင်းလမ်းညွှန်'
                      : 'មគ្គុទ្ទេសក៍ផ្ទេរប្រាក់ពីថៃទៅមីយ៉ាន់ម៉ា'}
                  </span>
                  <svg className={styles.guideIcon} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Regional currency pairs links */}
            <div className={styles.card}>
              <h2 className={styles.sidebarHeading}>{text.linksHeading}</h2>
              <div className={styles.linkChips}>
                {REGIONAL_PAIRS.map(pair => (
                  <Link
                    href={localizePath(lang, `/${pair}`)}
                    key={pair}
                    className={styles.chipLink}
                  >
                    {PAIR_LABELS[pair]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </main>
  )
}
