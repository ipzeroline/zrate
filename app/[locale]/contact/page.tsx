import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Footer } from '../../components/Footer'
import { SeoNav } from '../../components/SeoNav'
import { Header } from '../../components/Header'
import { AdSection } from '../../components/AdsterraAds'
import {
  LanguageCode,
  LOCALES,
  SITE_URL,
  localizePath,
} from '../../../lib/siteNavigation'
import styles from './contact.module.css'

interface ContactContentBlock {
  title: string
  metaDesc: string
  eyebrow: string
  heading: string
  subheading: string
  intro: string
  emailLabel: string
  emailValue: string
  responseLabel: string
  responseValue: string
  channelsHeading: string
  channelsText: string
  guidelinesHeading: string
  guidelines: string[]
  categories: Array<{ title: string; desc: string }>
  linksHeading: string
  links: Array<{ label: string; path: string }>
  homeLink: string
  aboutLink: string
}

const CONTACT_CONTENT: Record<LanguageCode, ContactContentBlock> = {
  th: {
    title: 'ติดต่อเรา | zrate.io',
    metaDesc: 'ติดต่อทีมงานผู้พัฒนา zrate.io สอบถามข้อมูล รายงานข้อผิดพลาด หรือเสนอแนะการใช้งานระบบแปลงค่าเงินอาเซียน',
    eyebrow: 'ช่องทางการติดต่อ',
    heading: 'ติดต่อทีมผู้พัฒนา zrate.io',
    subheading: 'หากคุณมีข้อสงสัย พบปัญหาการใช้งาน หรือต้องการเสนอแนะบริการ ยินดีรับฟังเสมอ',
    intro: 'zrate.io ดำเนินการโดยอิสระเพื่อนำเสนอข้อมูลที่เป็นประโยชน์และมีความโปร่งใสทางการเงิน คุณสามารถติดต่อเราได้โดยตรงผ่านช่องทางต่อไปนี้',
    emailLabel: 'อีเมลหลักสำหรับการติดต่อ:',
    emailValue: 'funmask101@gmail.com',
    responseLabel: 'เวลาการตอบกลับเฉลี่ย:',
    responseValue: 'ภายใน 24-48 ชั่วโมง (วันทำการ)',
    channelsHeading: 'การติดต่อสนับสนุนตามเรื่อง',
    channelsText: 'โปรดเลือกช่องทางหรือระบุรายละเอียดให้สอดคล้องกับหัวข้อเรื่อง เพื่อความรวดเร็วในการประสานงานของทีมงานผู้พัฒนา',
    guidelinesHeading: 'คำแนะนำเพื่อให้ตอบกลับได้เร็วที่สุด',
    guidelines: [
      'ระบุหัวข้ออีเมลให้ชัดเจน (เช่น พบข้อผิดพลาดในการคำนวณคู่เงิน THB/LAK)',
      'แนบภาพถ่ายหน้าจอ (Screenshot) ของจุดที่พบปัญหาเพื่อความเข้าใจที่ตรงกัน',
      'ระบุวันและเวลาที่ท่านพบปัญหาเรทหรือค่าเงินคลาดเคลื่อน',
      'แจ้งประเภทอุปกรณ์และเว็บเบราว์เซอร์ที่ใช้ (เช่น iPhone Safari, Chrome บนคอมพิวเตอร์)'
    ],
    categories: [
      { title: 'ติดต่อสอบถามทั่วไป / เสนอแนะ', desc: 'เสนอความคิดเห็น คำแนะนำการพัฒนาฟีเจอร์ใหม่ๆ หรือสอบถามข้อมูลทั่วไปเกี่ยวกับเว็บไซต์และวิธีคำนวณ' },
      { title: 'แจ้งข้อผิดพลาดทางเทคนิค (Bug)', desc: 'รายงานปัญหาการแสดงผล เรทคำนวณไม่ถูกต้อง หน้าเว็บโหลดช้า หรือปัญหาการใช้งานบนมือถือ' },
      { title: 'ความร่วมมือและพันธมิตร', desc: 'สำหรับโอกาสทางธุรกิจ โฆษณา การเชื่อมต่อ API ข้อมูล หรือการจับคู่ธุรกิจระดับภูมิภาคในไทย ลาว เมียนมา และกัมพูชา' }
    ],
    linksHeading: 'ลิงก์ข้อมูลที่เป็นประโยชน์',
    links: [
      { label: 'เกี่ยวกับ zrate.io', path: '/about' },
      { label: 'นโยบายความเป็นส่วนตัว', path: '/privacy' },
      { label: 'อัตราแลกเปลี่ยนเงินวันนี้', path: '/rates' }
    ],
    homeLink: 'กลับหน้าแรก',
    aboutLink: 'เกี่ยวกับเรา',
  },
  en: {
    title: 'Contact Us | zrate.io',
    metaDesc: 'Contact the development team at zrate.io for support, feedback, or reporting bugs with our currency tools.',
    eyebrow: 'SUPPORT & CHANNELS',
    heading: 'Contact the zrate.io Team',
    subheading: 'Have a question, feedback, or found a bug? We are here to help.',
    intro: 'zrate.io operates independently to deliver transparent and reliable financial reference tools. You can reach out directly via our main communication channels below.',
    emailLabel: 'Direct Support Email:',
    emailValue: 'funmask101@gmail.com',
    responseLabel: 'Average Response Time:',
    responseValue: '24-48 hours (during business days)',
    channelsHeading: 'Support Segmentation',
    channelsText: 'To help us route your request to the correct developer or specialist, please categorize your subject line appropriately.',
    guidelinesHeading: 'Guidelines for Faster Resolution',
    guidelines: [
      'Be specific in the email subject (e.g., "Error in THB/LAK rate table calculation")',
      'Provide screenshots of the bug or data discrepancy if possible',
      'Specify the exact date and time you observed the rates',
      'Include your device and browser details (e.g., iPhone Safari, Windows Chrome)'
    ],
    categories: [
      { title: 'General Inquiries & Feedback', desc: 'Questions about our data coverage, methodology, features, or suggestions on how to improve the tool.' },
      { title: 'Technical Bug Reports', desc: 'Report calculation errors, page loading issues, UI rendering problems, or layout offsets.' },
      { title: 'Partnerships & Collab', desc: 'For advertising rates, regional API integrations, or border-trade financial collaboration in ASEAN.' }
    ],
    linksHeading: 'Quick Resources',
    links: [
      { label: 'About zrate.io', path: '/about' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Exchange Rates Today', path: '/rates' }
    ],
    homeLink: 'Go to Homepage',
    aboutLink: 'About Us',
  },
  lo: {
    title: 'ຕິດຕໍ່ພວກເຮົາ | zrate.io',
    metaDesc: 'ຕິດຕໍ່ທີມງານ zrate.io ສອບຖາມຂໍ້ມູ້ນ ລາຍງານຂໍ້ຜິດພາດ ຫຼືສະແດງຄວາມຄິດເຫັນກ່ຽວກັບການໃຊ້ງານ.',
    eyebrow: 'ຊ່ອງທາງການຕິດຕໍ່',
    heading: 'ຕິດຕໍ່ທີມງານຜູ້ພັດທະນາ zrate.io',
    subheading: 'ຫາກທ່ານມີຂໍ້ສົງໄສ, ພົບຂໍ້ຜິດພາດ ຫຼື ຕ້ອງການສະເໜີແນະລະບົບ ພວກເຮົາຍິນດີຮັບຟັງສະໝີ',
    intro: 'zrate.io ດຳເນີນງານໂດຍອິດສະຫຼະເພື່ອສະເໜີຂໍ້ມູນອັດຕາແລກປ່ຽນທີ່ໂປ່ງໃສ. ທ່ານສາມາດຕິດຕໍ່ຫາພວກເຮົາໄດ້ໂດຍກົງຕາມລາຍລະອຽດລຸ່ມນີ້.',
    emailLabel: 'ອີເມວຕິດຕໍ່ຫຼັກ:',
    emailValue: 'funmask101@gmail.com',
    responseLabel: 'ເວລາຕອບກັບສະເລ່ຍ:',
    responseValue: 'ພາຍໃນ 24-48 ຊົ່ວໂມງ (ວັນທຳການ)',
    channelsHeading: 'Consolidated Channels',
    channelsText: 'ກະລຸນາເລືອກປະເພດ ຫຼື ລະບຸຫົວຂໍ້ໃຫ້ຊັດເຈນ ເພື່ອໃຫ້ທີມງານສົ່ງເລື່ອງໄປຫາຜູ້ຮັບຜິດຊອບໄດ້ໄວທີ່ສຸດ.',
    guidelinesHeading: 'ຄຳແນະນຳເພື່ອການຕອບກັບທີ່ໄວຂຶ້ນ',
    guidelines: [
      'ລະບຸຫົວຂໍ້ອີເມວໃຫ້ຊັດເຈນ (ຕົວຢ່າງ: ພົບຂໍ້ຜິດພາດໃນການແປງເງິນ THB/LAK)',
      'ແນບຮູບພາບໜ້າຈໍ (Screenshot) ຂອງບັນຫາທີ່ພົບເພື່ອຄວາມເຂົ້າໃຈທີ່ງ່າຍຂຶ້ນ',
      'ລະບຸວັນ ແລະ ເວລາທີ່ພົບເຣດ ຫຼື ຂໍ້ມູນຄາດເຄື່ອນ',
      'ແຈ້ງປະເພດອຸປະກອນ ແລະ ເວັບບຣາວເຊີທີ່ໃຊ້ (ເຊັ່ນ iPhone Safari, PC Chrome)'
    ],
    categories: [
      { title: 'ສອບຖາມທົ່ວໄປ ແລະ ຄຳແນະນຳ', desc: 'ສະເໜີຄຳຄິດເຫັນ, ແນະນຳຟີເຈີໃໝ່ ຫຼື ຖາມຂໍ້ມູນທົ່ວໄປກ່ຽວກັບເວັບໄຊ.' },
      { title: 'ລាយງານບັນຫາເຕັກນິກ (Bug)', desc: 'ແຈ້ງບັນຫາການສະແດງຜົນ, ລະບົບຄຳນວນຜິດພາດ, ເວັບໄຊໂຫຼດຊ້າ ຫຼື ສະແດງຜົນຜິດປົກກະຕິ.' },
      { title: 'ການຮ່ວມມື ແລະ ຄູ່ຮ່ວມທຸລະກິດ', desc: 'ຕິດຕໍ່ເພື່ອລົງໂຄສະນາ, ຂໍເຊື່ອມຕໍ່ API ຂໍ້ມູນ ຫຼື ຮ່ວມມືທາງທຸລະກິດການເງິນໃນພາກພື້ນອາຊຽນ.' }
    ],
    linksHeading: 'ແຫຼ່ງຂໍ້ມູນທີ່ເປັນປະໂຫຍດ',
    links: [
      { label: 'ກ່ຽວກັບ zrate.io', path: '/about' },
      { label: 'ນະໂຍບາຍຄວາມລັບ', path: '/privacy' },
      { label: 'ອັດຕາແລກປ່ຽນມື້ນີ້', path: '/rates' }
    ],
    homeLink: 'ກັບຄືນໜ້າຫຼັກ',
    aboutLink: 'ກ່ຽວກັບພວກເຮົາ',
  },
  my: {
    title: 'ဆက်သွယ်ရန် | zrate.io',
    metaDesc: 'ငွေလဲနှုန်းစနစ်နှင့်ပတ်သက်ပြီး zrate.io ထံသို့ ဆက်သွယ်မေးမြန်းရန်၊ ချို့ယွင်းချက်များအစီရင်ခံရန် သို့မဟုတ် အကြံပြုချက်များပေးပို့ရန်။',
    eyebrow: 'ဆက်သွယ်ရန် လမ်းကြောင်းများ',
    heading: 'zrate.io ဆော့ဖ်ဝဲရေးသားသူများအဖွဲ့ထံ ဆက်သွယ်ရန်',
    subheading: 'မေးမြန်းလိုသည်များ၊ စနစ်ချို့ယွင်းချက်များ သို့မဟုတ် အကြံပြုချက်များရှိပါက ဆက်သွယ်နိုင်ပါသည်။',
    intro: 'zrate.io သည် ပွင့်လင်းမြင်သာသော ဘဏ္ဍာရေးကိုးကားချက်များကို လွတ်လပ်စွာဖော်ပြပေးနေသည့် စနစ်ဖြစ်ပြီး အောက်ပါလမ်းကြောင်းများမှ တိုက်ရိုက်ဆက်သွယ်နိုင်ပါသည်။',
    emailLabel: 'အဓိက ဆက်သွယ်ရန် အီးမေးလ်:',
    emailValue: 'funmask101@gmail.com',
    responseLabel: 'ပျမ်းမျှ တုံ့ပြန်ချိန်:',
    responseValue: '၂၄ နာရီမှ ၄၈ နာရီအတွင်း (ရုံးဖွင့်ရက်များ)',
    channelsHeading: 'ပံ့ပိုးမှုအမျိုးအစားများ',
    channelsText: 'သင့်တောင်းဆိုချက်ကို သက်ဆိုင်ရာ ဆော့ဖ်ဝဲအင်ဂျင်နီယာထံ မြန်ဆန်စွာ လွှဲပြောင်းပေးနိုင်ရန် အီးမေးလ်ခေါင်းစဉ်ကို သေချာစွာဖော်ပြပေးပါ။',
    guidelinesHeading: 'မြန်ဆန်စွာ တုံ့ပြန်မှုရရှိရန် လမ်းညွှန်ချက်များ',
    guidelines: [
      'အီးမေးလ်ခေါင်းစဉ်ကို တိကျစွာရေးပါ (ဥပမာ - THB/MMK တွက်ချက်မှု မှားယွင်းနေခြင်း)',
      'စနစ်ချို့ယွင်းမှု သို့မဟုတ် ဒေတာအမှားအယွင်းများကို Screenshot ရိုက်၍ ပူးတွဲပေးပို့ပါ',
      'အမှားအယွင်းတွေ့ရှိသည့် နေ့ရက်နှင့် အချိန်ကို တိကျစွာဖော်ပြပါ',
      'အသုံးပြုသည့် ဖုန်း/ကွန်ပျူတာ အမျိုးအစားနှင့် Browser ကို ဖော်ပြပါ (ဥပမာ - iPhone Safari, PC Chrome)'
    ],
    categories: [
      { title: 'အထွေထွေမေးမြန်းမှုနှင့် အကြံပြုချက်များ', desc: 'စနစ်တိုးတက်စေရန် အကြံပြုချက်များ သို့မဟုတ် ဝဘ်ဆိုက်နှင့်ပတ်သက်ပြီး အထွေထွေသိရှိလိုသည်များကို မေးမြန်းရန်။' },
      { title: 'စနစ်ချို့ယွင်းမှု (Bug) အစီရင်ခံစာ', desc: 'တွက်ချက်မှုလွဲချော်ခြင်း၊ စာမျက်နှာမပွင့်ခြင်း သို့မဟုတ် ဖုန်းများတွင် visual ပုံပျက်နေခြင်းများကို အကြောင်းကြားရန်။' },
      { title: 'ပူးပေါင်းဆောင်ရွက်မှုနှင့် မိတ်ဖက်များ', desc: 'ကြော်ငြာဝန်ဆောင်မှု၊ API ချိတ်ဆက်မှု သို့မဟုတ် အာဆီယံဒေသတွင်း ဘဏ္ဍာရေးဆိုင်ရာ ပူးပေါင်းဆောင်ရွက်မှုများအတွက်။' }
    ],
    linksHeading: 'အသုံးဝင်သော လင့်ခ်များ',
    links: [
      { label: 'zrate.io အကြောင်း', path: '/about' },
      { label: 'ကိုယ်ရေးလုံခြုံရေးမူဝါဒ', path: '/privacy' },
      { label: 'ယနေ့ငွေလဲနှုန်းများ', path: '/rates' }
    ],
    homeLink: 'ပင်မစာမျက်နှာသို့',
    aboutLink: 'ကျွန်ုပ်တို့အကြောင်း',
  },
  km: {
    title: 'ទំនាក់ទំនង | zrate.io',
    metaDesc: 'ទាក់ទងក្រុមការងារ zrate.io សម្រាប់ជំនួយ មតិយោបល់ ឬរាយការណ៍កំហុសទិន្នន័យអត្រាប្តូរប្រាក់អាស៊ាន។',
    eyebrow: 'បណ្តាញទំនាក់ទំនង',
    heading: 'ទាក់ទងមកកាន់ក្រុមការងារ zrate.io',
    subheading: 'ប្រសិនបើលោកអ្នកមានសំណួរ ជួបបញ្ហា ឬចង់ផ្តល់មតិកែលម្អ យើងរីករាយនឹងទទួលស្តាប់ជានិច្ច',
    intro: 'zrate.io ដំណើរការដោយឯករាជ្យដើម្បីផ្តល់ព័ត៌មានអត្រាប្តូរប្រាក់ប្រកបដោយតម្លាភាព។ លោកអ្នកអាចទាក់ទងមកកាន់យើងផ្ទាល់តាមរយៈព័ត៌មានខាងក្រោម។',
    emailLabel: 'អ៊ីមែលទំនាក់ទំនងចម្បង៖',
    emailValue: 'funmask101@gmail.com',
    responseLabel: 'រយៈពេលឆ្លើយតបជាមធ្យម៖',
    responseValue: 'ក្នុងរយៈពេល 24-48 ម៉ោង (ថ្ងៃធ្វើការ)',
    channelsHeading: 'ផ្នែកគាំទ្រតាមប្រធានបទ',
    channelsText: 'សូមជ្រើសរើសប្រធានបទ ឬបញ្ជាក់ព័ត៌មានឱ្យបានច្បាស់លាស់ ដើម្បីងាយស្រួលដល់ក្រុមការងារបញ្ជូនទៅផ្នែកពាក់ព័ន្ធ។',
    guidelinesHeading: 'ការណែនាំដើម្បីទទួលបានការឆ្លើយតបលឿនបំផុត',
    guidelines: [
      'បញ្ជាក់ប្រធានបទអ៊ីមែលឱ្យច្បាស់លាស់ (ឧទាហរណ៍៖ ជួបបញ្ហាក្នុងការគណនាគូប្រាក់ THB/KHR)',
      'ភ្ជាប់រូបភាពថតអេក្រង់ (Screenshot) នៃចំណុចដែលជួបបញ្ហា ដើម្បីភាពងាយស្រួលយល់',
      'បញ្ជាក់កាលបរិច្ឆេទ និងពេលវេលាដែលលោកអ្នកបានជួបប្រទះទិន្នន័យខុសឆ្គង',
      'បញ្ជាក់ពីប្រភេទឧបករណ៍ និងកម្មវិធីរុករកដែលប្រើប្រាស់ (ឧទាហរណ៍៖ iPhone Safari, PC Chrome)'
    ],
    categories: [
      { title: 'ការសាកសួរទូទៅ និងមតិយោបល់', desc: 'ផ្តល់មតិយោបល់សម្រាប់ការអភិវឌ្ឍមុខងារថ្មីៗ ឬសាកសួរព័ត៌មានទូទៅអំពីគេហទំព័រ។' },
      { title: 'រាយការណ៍បញ្ហាបច្ចេកទេស (Bug)', desc: 'រាយការណ៍បញ្ហាបង្ហាញរូបភាព ការគណនាខុសឆ្គង គេហទំព័រដើរយឺត ឬការបង្ហាញខុសប្រក្រតីលើទូរស័ព្ទ។' },
      { title: 'កិច្ចសហការ និងដៃគូអាជីវកម្ម', desc: 'សម្រាប់ទំនាក់ទំនងផ្សាយពាណិជ្ជកម្ម การភ្ជាប់ទិន្នន័យ API ឬកិច្ចសហការហិរញ្ញវត្ថុក្នុងតំបន់អាស៊ាន។' }
    ],
    linksHeading: 'តំណភ្ជាប់មានប្រយោជន៍',
    links: [
      { label: 'អំពី zrate.io', path: '/about' },
      { label: 'គោលការណ៍ឯកជនភាព', path: '/privacy' },
      { label: 'អត្រាប្តូរប្រាក់ថ្ងៃនេះ', path: '/rates' }
    ],
    homeLink: 'ទៅទំព័រដើម',
    aboutLink: 'អំពីយើង',
  },
}

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const lang = ((LOCALES as string[]).includes(resolvedParams.locale) ? resolvedParams.locale : 'th') as LanguageCode
  const content = CONTACT_CONTENT[lang]
  const prefix = lang === 'th' ? '' : `/${lang}`
  
  return {
    title: content.title,
    description: content.metaDesc,
    alternates: {
      canonical: `${SITE_URL}${prefix}/contact`,
      languages: {
        th: `${SITE_URL}/contact`,
        en: `${SITE_URL}/en/contact`,
        lo: `${SITE_URL}/lo/contact`,
        my: `${SITE_URL}/my/contact`,
        km: `${SITE_URL}/km/contact`,
        'x-default': `${SITE_URL}/contact`,
      },
    },
    openGraph: {
      title: content.title,
      description: content.metaDesc,
      url: `${SITE_URL}${prefix}/contact`,
      siteName: 'zrate.io',
      type: 'website',
      locale: lang === 'th' ? 'th_TH' : lang === 'en' ? 'en_US' : lang === 'lo' ? 'lo_LA' : lang === 'my' ? 'my_MM' : 'km_KH',
      images: [
        {
          url: `${SITE_URL}/contact-illustration.png`,
          width: 1024,
          height: 1024,
          alt: content.title,
        },
      ],
    },
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const lang = ((LOCALES as string[]).includes(resolvedParams.locale) ? resolvedParams.locale : 'th') as LanguageCode
  const content = CONTACT_CONTENT[lang]
  const prefix = lang === 'th' ? '' : `/${lang}`

  const contactPageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${SITE_URL}${prefix}/contact#webpage`,
        'url': `${SITE_URL}${prefix}/contact`,
        'name': content.title,
        'description': content.metaDesc,
        'inLanguage': lang,
        'isPartOf': {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          'url': SITE_URL,
          'name': 'zrate.io',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        'name': 'zrate.io',
        'url': SITE_URL,
        'logo': `${SITE_URL}/zrate.png`,
        'description': 'Real-time ASEAN currency exchange desk and remittance guide platform.',
        'sameAs': [SITE_URL],
        'contactPoint': [
          {
            '@type': 'ContactPoint',
            'email': 'funmask101@gmail.com',
            'contactType': 'customer support',
            'availableLanguage': ['TH', 'EN', 'LO', 'MY', 'KM']
          }
        ]
      }
    ]
  }

  return (
    <main className={styles.container} lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />

      <Header lang={lang} subtitle={content.subheading} />

      <SeoNav lang={lang} active="contact" />

      <AdSection />

      <section className={styles.contentSection}>
        <div className={styles.gridMain}>
          {/* LEFT COLUMN: Main contact fields and sub-channels */}
          <div className={styles.leftColumn}>
            {/* Hero text */}
            <div className={styles.heroSection}>
              <span className={styles.eyebrow}>{content.eyebrow}</span>
              <h1 className={styles.title}>{content.heading}</h1>
              <p className={styles.subheading}>{content.subheading}</p>
              <p className={styles.intro}>{content.intro}</p>
            </div>

            {/* Direct Email Card */}
            <div className={styles.card}>
              <div className={styles.emailCard}>
                <span className={styles.emailLabel}>{content.emailLabel}</span>
                <a href={`mailto:${content.emailValue}`} className={styles.emailLink}>
                  {content.emailValue}
                </a>
                <div className={styles.responseTime}>
                  <span className={styles.responseIndicator}></span>
                  <span>
                    <strong>{content.responseLabel}</strong> {content.responseValue}
                  </span>
                </div>
              </div>
            </div>

            {/* Segmented Support Explanation */}
            <div className={styles.card}>
              <h2 className={styles.sidebarHeading} style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '8px' }}>
                {content.channelsHeading}
              </h2>
              <p className={styles.intro} style={{ margin: 0 }}>
                {content.channelsText}
              </p>
            </div>

            {/* Category Cards Grid */}
            <div className={styles.categoriesGrid}>
              {content.categories.map((cat, idx) => (
                <div key={idx} className={styles.categoryCard}>
                  <h3 className={styles.categoryTitle}>{cat.title}</h3>
                  <p className={styles.categoryDesc}>{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar with illustration, guidelines, quick links */}
          <div className={styles.rightColumn}>
            {/* Support illustration */}
            <div className={styles.imageWrapper}>
              <Image
                src="/contact-illustration.png"
                alt="zrate.io support command center illustration"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 380px"
              />
            </div>

            {/* Resolution guidelines */}
            <div className={styles.card}>
              <h2 className={styles.sidebarHeading}>{content.guidelinesHeading}</h2>
              <div className={styles.guidelinesList}>
                {content.guidelines.map((item, idx) => (
                  <div key={idx} className={styles.guidelineItem}>
                    <svg className={styles.guidelineIcon} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l5-5z" clipRule="evenodd"/>
                    </svg>
                    <span className={styles.guidelineText}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick resources */}
            <div className={styles.card}>
              <h2 className={styles.sidebarHeading}>{content.linksHeading}</h2>
              <div className={styles.linksList}>
                {content.links.map((link, idx) => (
                  <Link key={idx} href={localizePath(lang, link.path)} className={styles.linkItem}>
                    <span className={styles.linkText}>{link.label}</span>
                    <svg className={styles.linkIcon} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className={styles.navRow}>
          <Link className={styles.btnSecondary} href={localizePath(lang, '/')}>
            {content.homeLink}
          </Link>
          <Link className={styles.btnPrimary} href={localizePath(lang, '/about')}>
            {content.aboutLink}
          </Link>
        </div>
      </section>

      <AdSection />

      <Footer lang={lang} />
    </main>
  )
}
