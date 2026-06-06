import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Footer } from '../../components/Footer'
import { SeoNav } from '../../components/SeoNav'
import { Header } from '../../components/Header'
import {
  LanguageCode,
  LOCALES,
  PAIRS,
  PAIR_LABELS,
  SITE_URL,
  localizePath,
  FEATURED_PAIRS,
  REGIONAL_PAIRS,
} from '../../../lib/siteNavigation'
import styles from './about.module.css'

const ABOUT_CONTENT: Record<LanguageCode, {
  title: string
  metaDesc: string
  eyebrow: string
  heading: string
  subheading: string
  intro: string
  badges: string[]
  features: Array<{ title: string; desc: string }>
  helpHeading: string
  helpItems: string[]
  missionHeading: string
  missionText: string
  missionPara2: string
  universeHeading: string
  universeText: string
  universeCols: string[]
  notHeading: string
  notText: string
  faqHeading: string
  faqs: Array<{ q: string; a: string }>
  disclaimerHeading: string
  disclaimerText: string
  homeLink: string
  contactLink: string
}> = {
  th: {
    title: 'รู้จัก zrate.io | เครื่องมือเช็กอัตราแลกเปลี่ยนเงินวันนี้และแปลงสกุลเงินอาเซียน',
    metaDesc: 'zrate.io คือแพลตฟอร์มตรวจสอบอัตราแลกเปลี่ยนเงินวันนี้และแปลงค่าเงินแบบเรียลไทม์ คัดกรองคู่เงินอาเซียน บาท ดอลลาร์ กีบ จ๊าด เรียล และคำนวณต้นทุนการโอนเงินต่างประเทศแบบเป็นกลาง',
    eyebrow: 'เกี่ยวกับ zrate.io',
    heading: 'zrate.io คืออะไร',
    subheading: 'เครื่องมือเช็กอัตราแลกเปลี่ยนและเปรียบเทียบค่าเงินสำหรับภูมิภาคอาเซียน',
    intro: 'zrate.io พัฒนาขึ้นโดยกลุ่มวิศวกรซอฟต์แวร์และผู้เชี่ยวชาญด้านระบบการเงินอิสระในอาเซียน เพื่อเป็นแหล่งอ้างอิงความเร็วสูงในการเช็กอัตราแลกเปลี่ยนเงินตราต่างประเทศแบบเรียลไทม์ เป้าหมายของเราไม่ใช่การชี้นำหรือให้บริการธุรกรรมการเงิน แต่คือการมอบเครื่องมือ ข้อมูลเชิงสถิติ และคู่มือที่ช่วยให้ผู้ใช้งานท่องเที่ยว ทำธุรกิจ และส่งเงินกลับประเทศได้อย่างโปร่งใสที่สุด',
    badges: ['แปลงค่าเงินแบบเรียลไทม์', 'เรทราคาตลาด', 'สถิติคู่เงินสด', 'คู่มือโอนเงิน', 'คู่เงินอาเซียน'],
    features: [
      { title: 'แปลงค่าเงินแบบสด', desc: 'เปรียบเทียบและคำนวณมูลค่าสกุลเงินต่างประเทศมากกว่า 40 สกุลเงินแบบเรียลไทม์อย่างแม่นยำ' },
      { title: 'เรทคู่เงินอาเซียน', desc: 'เน้นการติดตามคู่เงินสำคัญในภูมิภาค เช่น THB/LAK, THB/MMK, THB/KHR และเรท USDT' },
      { title: 'สูตรคำนวณต้นทุน', desc: 'ช่วยเปรียบเทียบค่าธรรมเนียมและเรทแลกเปลี่ยนจริงของแต่ละสถาบันเพื่อประเมินยอดรับปลายทาง' },
      { title: 'สถิติและประวัติค่าเงิน', desc: 'แสดงข้อมูลความผันผวนของค่าเงิน ค่าเฉลี่ย 30 วันที่ผ่านมา และประวัติการเปลี่ยนแปลงเรท' }
    ],
    helpHeading: 'zrate.io ช่วยวิเคราะห์และอำนวยความสะดวกอะไรบ้าง',
    helpItems: [
      'คำนวณแปลงค่าเงินบาท (THB), กีบลาว (LAK), จ๊าดเมียนมา (MMK), เรียลกัมพูชา (KHR) และดอลลาร์ (USD) ทันที',
      'ตรวจสอบราคาอัตราแลกเปลี่ยนอ้างอิงแบบเรียลไทม์ อัปเดตข้อมูลทุก 60 วินาทีเพื่อความสดใหม่',
      'ประเมินและเปรียบเทียบค่าใช้จ่ายในการโอนเงินต่างประเทศข้ามพรมแดนอย่างโปร่งใสตามจริง',
      'เปรียบเทียบค่าเงินหลายๆ สกุลพร้อมกันในตารางอเนกประสงค์เพื่อช่วยตัดสินใจก่อนทำธุรกรรม',
      'คัดกรองเรทแลกเปลี่ยนเงินสดและเรทออนไลน์ตามความต้องการในภูมิภาคอาเซียน'
    ],
    missionHeading: 'พันธกิจของเรา',
    missionText: 'พันธกิจของ zrate.io คือการทำให้การเข้าถึงข้อมูลอัตราแลกเปลี่ยนเงินตราเป็นเรื่องที่ง่าย โปร่งใส และเป็นกลางที่สุดสำหรับประชาชนในภูมิภาคเอเชียตะวันออกเฉียงใต้ โดยเฉพาะกลุ่มแรงงานข้ามชาติ นักท่องเที่ยว และผู้ค้าขายรายย่อยตามแนวชายแดน',
    missionPara2: 'เราเชื่อมั่นว่า ความโปร่งใสทางการเงินคือสิทธิขั้นพื้นฐาน การมีเครื่องมือเปรียบเทียบที่ดีช่วยให้ทุกคนหลีกเลี่ยงส่วนต่างราคาที่แฝงอยู่ และสามารถทำธุรกรรมการโอนเงินได้อย่างคุ้มค่าที่สุด',
    universeHeading: 'ครอบคลุมคู่เงินอาเซียนและสกุลเงินยอดนิยม',
    universeText: 'ระบบของเราสนับสนุนและออกแบบหน้าคู่เงินอ้างอิงสำหรับทุกคู่เงินที่มีการค้นหาบ่อยที่สุด เพื่อเชื่อมโยงโครงสร้างการเปรียบเทียบได้อย่างสะดวก',
    universeCols: ['คู่เงินแนะนำ', 'คู่เงินอาเซียน', 'คู่เงินอื่นๆ ทั้งหมด'],
    notHeading: 'zrate.io ไม่ใช่อะไร',
    notText: 'zrate.io ไม่ใช่ธนาคาร สถาบันการเงิน หรือผู้ให้บริการแลกเปลี่ยน/โอนเงินตราต่างประเทศ (Remittance Operator) เราไม่มีบริการรับฝากเงิน แลกเงิน หรือโอนเงินข้ามประเทศผ่านระบบของเราแต่อย่างใด ข้อมูลทั้งหมดจัดทำขึ้นเพื่อใช้เป็นราคาอ้างอิงเบื้องต้นเท่านั้น ผู้ใช้บริการต้องยืนยันข้อมูลเรทสุดท้ายกับผู้ให้บริการจริงก่อนทำธุรกรรมทุกครั้ง',
    faqHeading: 'คำถามที่พบบ่อยเกี่ยวกับ zrate.io',
    faqs: [
      { q: 'zrate.io ใช้ทำอะไร?', a: 'zrate.io ใช้สำหรับตรวจสอบอัตราแลกเปลี่ยนเงินต่างประเทศ แปลงค่าเงิน ดูแนวโน้มความผันผวน และศึกษาคู่มือการโอนเงินข้ามประเทศ' },
      { q: 'ข้อมูลอัตราแลกเปลี่ยนดึงมาจากไหน?', a: 'ข้อมูลทั้งหมดอ้างอิงแบบเรียลไทม์จากระบบ EODHD ซึ่งประมวลผลจากราคาอ้างอิงในตลาดการเงินและสถาบันการเงินทั่วโลก' },
      { q: 'zrate.io รับโอนเงินหรือแลกเงินจริงไหม?', a: 'เราไม่มีบริการรับโอนเงินหรือแลกเปลี่ยนเงินจริง หน้าเว็บนี้เป็นเพียงแหล่งข้อมูลและเครื่องมืออ้างอิงเชิงวิเคราะห์เพื่อการศึกษาเท่านั้น' },
      { q: 'มือใหม่ใช้งานยากไหม?', a: 'ใช้งานง่ายมาก เพราะตัวคำนวณถูกออกแบบให้ป้อนตัวเลขแล้วสรุปยอดออกมาทันที พร้อมลิงก์ไปยังคู่เงินอ้างอิงและบทความให้ความรู้อย่างครบถ้วน' },
      { q: 'การใช้งาน zrate.io มีค่าใช้จ่ายไหม?', a: 'ให้บริการฟรี 100% สำหรับผู้ใช้งานทุกคน ไม่มีค่าสมัครสมาชิก ไม่มีส่วนได้ส่วนเสีย หรือค่าบริการแอบแฝงรายเดือน' }
    ],
    homeLink: 'กลับหน้าแรก',
    contactLink: 'ติดต่อทีมงาน',
    disclaimerHeading: 'ข้อจำกัดความรับผิดชอบทางกฎหมาย (Financial Disclaimer)',
    disclaimerText: 'ข้อมูลอัตราแลกเปลี่ยนเงินตราบนเว็บไซต์นี้จัดทำขึ้นเพื่อเป็นข้อมูลทั่วไปและข้อมูลการเรียนรู้เท่านั้น ไม่ถือเป็นคำแนะนำทางการเงิน การลงทุน หรือการทำธุรกรรมทางการค้า zrate.io ไม่สามารถรับประกันความถูกต้องแม่นยำ ความสมบูรณ์ หรือความทันเวลาแบบวินาทีต่อวินาทีของข้อมูลได้ทั้งหมด ผู้ใช้บริการควรอ้างอิงข้อมูลนี้เป็นราคาโดยประมาณการเบื้องต้น และต้องตรวจสอบยืนยันอัตราแลกเปลี่ยนจริงกับผู้ให้บริการแลกเงิน หรือธนาคารพาณิชย์ที่ได้รับอนุญาตอย่างเป็นทางการก่อนตัดสินใจดำเนินธุรกรรมทางการเงินใดๆ เสมอ',
  },
  en: {
    title: 'About Us - zrate.io | Live Exchange Rates & Remittance Tools',
    metaDesc: 'zrate.io is a platform for checking live exchange rates today and converting currencies in real-time. Estimate ASEAN rates (THB, LAK, MMK, KHR, USD) and calculate transfer costs.',
    eyebrow: 'About zrate.io',
    heading: 'What is zrate.io?',
    subheading: 'Live currency converter and exchange rate comparison built for ASEAN',
    intro: 'zrate.io was established by a team of independent software developers and fintech enthusiasts in Southeast Asia. Our goal is to provide a high-performance, lightweight, and ad-free reference tool for everyday currency exchange and cost calculations. We focus on absolute accessibility and speed, particularly for cross-border traders and travelers in the region.',
    badges: ['Real-Time Converter', 'Market Rates', 'Cash Rate Stats', 'Transfer Guides', 'ASEAN Pairs'],
    features: [
      { title: 'Live Conversion', desc: 'Compare and calculate values across 40+ global currencies in real-time with absolute precision.' },
      { title: 'ASEAN Focus', desc: 'Track essential regional pairs such as THB/LAK, THB/MMK, THB/KHR, and live USDT rates.' },
      { title: 'Cost Analysis', desc: 'Compare bank/operator fees and exchange rates to see the actual final amount received.' },
      { title: 'Currency History', desc: 'Monitor currency volatility, 30-day average values, and rate change history.' }
    ],
    helpHeading: 'How zrate.io Helps You Analyze and Compare',
    helpItems: [
      'Convert Thai Baht (THB), Lao Kip (LAK), Myanmar Kyat (MMK), Cambodian Riel (KHR), and US Dollars (USD) instantly',
      'Check real-time reference exchange rates updated every 60 seconds',
      'Evaluate and compare international cross-border transfer costs transparently',
      'Compare multiple currencies at once on our homepage matrix to make informed choices',
      'Filter cash rates and online rates tailored to ASEAN regional needs'
    ],
    missionHeading: 'Our Mission',
    missionText: 'Our mission is to promote financial transparency in Southeast Asia by providing clean currency comparison tools, helping migrant workers, travelers, and small border businesses estimate costs fairly without hidden margins.',
    missionPara2: 'We believe financial transparency is a fundamental right. Having the right tools helps users avoid hidden exchange markups and get the best value from their transactions.',
    universeHeading: 'Comprehensive Currency Pair Coverage',
    universeText: 'We support and curate dedicated pages for the most searched currency pairs to link calculations and statistics seamlessly.',
    universeCols: ['Featured Pairs', 'ASEAN Regional Pairs', 'All Other Pairs'],
    notHeading: 'What zrate.io is Not',
    notText: 'zrate.io is not a bank, licensed money changer, or remittance provider. We do not process transactions or handle user funds. The rates displayed are for reference only. Users must verify the final rates with their chosen provider before completing any transactions.',
    faqHeading: 'Frequently Asked Questions about zrate.io',
    faqs: [
      { q: 'What is zrate.io used for?', a: 'zrate.io is used to monitor exchange rates, convert currencies, view volatility history, and read cross-border transfer guides.' },
      { q: 'Where does the exchange rate data come from?', a: 'All data is retrieved in real-time from EODHD APIs, which compiles market data from global financial institutions.' },
      { q: 'Does zrate.io exchange or transfer money?', a: 'No, we do not provide transfer or exchange services. This platform is purely a reference and analysis resource.' },
      { q: 'Is it suitable for beginners?', a: 'Yes, it is designed to be simple: input your amount and see the calculations immediately, with links to guides for further learning.' },
      { q: 'Are there any usage fees?', a: 'No, zrate.io is 100% free for everyone, with no hidden charges, sign-up requirements, or monthly fees.' }
    ],
    homeLink: 'Go to Homepage',
    contactLink: 'Contact Us',
    disclaimerHeading: 'Financial Disclaimer',
    disclaimerText: 'The exchange rates and insights provided on zrate.io are for personal informational and educational purposes only. They do not constitute financial advice. While we strive for high precision, we do not guarantee absolute accuracy or completeness of the data. Users should treat the rates as estimates and verify live quotes with licensed banks or authorized money changers before conducting any financial transactions.',
  },
  lo: {
    title: 'ກ່ຽວກັບພວກເຮົາ - zrate.io | ແຫຼ່ງຂໍ້ມູ້ນອັດຕາແລກປ່ຽນເງິນຕາ ແລະ ຄວາມໂປ່ງໃສ',
    metaDesc: 'ຮູ້ຈັກ zrate.io ຜູ້ພັດທະນາເວັບໄຊກວດສອບອັດຕາແລກປ່ຽນເງິນບາດ, ກີບ, ໂດລາ ແລະ ເຄື່ອງມືແປງສະກຸນເງິນອາຊຽນ ພ້ອມແຫຼ່ງຂໍ້ມູ້ນການເງິນທີ່ໜ້າເຊື່ອຖື ແລະ ໂປ່ງໃສ.',
    eyebrow: 'ກ່ຽວກັບ zrate.io',
    heading: 'zrate.io ແມ່ນຫຍັງ',
    subheading: 'ເຄື່ອງມືກວດເບິ່ງອັດຕາແລກປ່ຽນ ແລະແປງສະກຸນເງິນສຳລັບອາຊຽນ',
    intro: 'zrate.io ຖືກສ້າງຂຶ້ນໂດຍກຸ່ມນັກພັດທະນາຊອບແວອິດສະຫຼະໃນອາຊີຕາເວັນອອກສ່ຽງໃຕ້ ເພື່ອເປັນເຄື່ອງມືອ້າງອີງຄວາມໄວສູງໃນການກວດສອບອັດຕາແລກປ່ຽນໃນຊີວິດປະຈຳວັນ. ພວກເຮົາເນັ້ນການອອກແບບທີ່ງ່າຍດາຍ, ໂຫຼດໄວ ແລະ ສະແດງຂໍ້ມູ້ນທີ່ຈຳເປັນທີ່ສຸດ.',
    badges: ['ແປງເງິນແບບສົດໆ', 'ເຣດລາຄາຕະຫຼາດ', 'ສະຖິຕິຄູ່ເງິນສົດ', 'ຄູ່ມືໂອນເງິນ', 'ຄູ່ເງິນອາຊຽນ'],
    features: [
      { title: 'ແປງເງິນແບບສົດໆ', desc: 'ປຽບທຽບ ແລະ ຄຳນວນມູນຄ່າສະກຸນເງິນຕ່າງປະເທດຫຼາຍກວ່າ 40 ສະກຸນເງິນແບບສົດໆ.' },
      { title: 'ເຣດຄູ່ເງິນອາຊຽນ', desc: 'ເນັ້ນການຕິດຕາມຄູ່ເງິນສຳຄັນໃນອາຊຽນ ເຊັ່ນ THB/LAK, THB/MMK, THB/KHR ແລະ USDT.' },
      { title: 'ຄຳນວນຕົ້ນທຶນ', desc: 'ຊ່ວຍປຽບທຽບຄ່າທຳນຽມ ແລະ ອັດຕາແລກປ່ຽນເພື່ອປະເມີນຍອດຮັບປາຍທາງ.' },
      { title: 'ສະຖິຕິແລະປະຫວັດ', desc: 'ສະແດງຂໍ້ມູ້ນຄວາມຜັນຜວນຂອງຄ່າເງິນ, ຄ່າສະເລ່ຍ 30 ວັນ ແລະ ປະຫວັດການປ່ຽນແປງ.' }
    ],
    helpHeading: 'zrate.io ຊ່ວຍວິເຄາະ ແລະ ອຳນວຍຄວາມສະດວກຫຍັງແດ່',
    helpItems: [
      'ຄຳນວນແປງຄ່າເງິນບາດ (THB), ກີບ (LAK), ຈ໊າດ (MMK), ລຽວ (KHR) ແລະ ໂດລາ (USD) ໄດ້ທັນທີ',
      'ກວດສອບອັດຕາແລກປ່ຽນອ້າງອີງແບບສົດໆ ອັບເດດຂໍ້ມູ້ນທຸກໆ 60 ວິນາທີ',
      'ປະເມີນຕົ້ນທຶນການໂອນເງິນຕ່າງປະເທດຂ້າມແດນແບບໂປ່ງໃສ',
      'ປຽບທຽບຄ່າເງິນຫຼາຍສະກຸນພ້ອມກັນໃນຕາຕະລາງດຽວເພື່ອຊ່ວຍຕັດສິນໃຈ',
      'ຄັດກອງເຣດເງິນສົດ ແລະ ເຣດອອນລາຍຕາມຄວາມຕ້ອງການຂອງອາຊຽນ'
    ],
    missionHeading: 'ພັນທະກິດຂອງພວກເຮົາ',
    missionText: 'ພັນທະກິດຂອງພວກເຮົາແມ່ນການສ້າງຄວາມໂປ່ງໃສທາງດ້ານການເງິນ ຊ່ວຍໃຫ້ຜູ້ຄົນໃນອາຊຽນ (ໄທ, ລາວ, ມຽນມາ, ກຳປູເຈຍ) ສາມາດປຽບທຽບອັດຕາແລກປ່ຽນເງິນຕາໄດ້ງ່າຍ ເພື່ອຫຼຸດຜ່ອນຕົ້ນທຶນການໂອນເງິນ ຫຼື ແລກປ່ຽນເງິນຕາ.',
    missionPara2: 'ພວກເຮົາເຊື່ອວ່າຄວາມໂປ່ງໃສທາງການເງິນເປັນສິດທິຂັ້ນພື້ນຖານ. ການມີເຄື່ອງມືທີ່ດີຊ່ວຍໃຫ້ຫຼີກລ່ຽງຄ່າໃຊ້ຈ່າຍທີ່ແຝງຢູ່ໄດ້.',
    universeHeading: 'ຄອບຄຸມຄູ່ເງິນອາຊຽນ ແລະ ສະກຸນເງິນຍອດນິຍົມ',
    universeText: 'ລະບົບຂອງພວກເຮົາສະໜັບສະໜູນ ແລະ ອອກແບບໜ້າຄູ່ເງິນອ້າງອີງສຳລັບຄູ່ເງິນທີ່ມີການຄົ້ນຫາຫຼາຍທີ່ສຸດ.',
    universeCols: ['ຄູ່ເງິນແນະນຳ', 'ຄູ່ເງິນອາຊຽນ', 'ຄູ່ເງິນອື່ນໆທັງໝົດ'],
    notHeading: 'zrate.io ບໍ່ແມ່ນຫຍັງ',
    notText: 'zrate.io ບໍ່ແມ່ນທະນາຄານ, ສະຖາບັນການເງິນ ຫຼື ຜູ້ໃຫ້ບໍລິການແລກປ່ຽນ/ໂອນເງິນຕ່າງປະເທດ. ພວກເຮົາມາເປັນແຫຼ່ງຂໍ້ມູ້ນອ້າງອີງເທົ່ານັ້ນ. ຜູ້ໃຊ້ຄວນກວດສອບເຣດຕົວຈິງກັບທະນາຄານກ່ອນເຮັດທຸລະກຳ.',
    faqHeading: 'ຄຳຖາມທີ່ພົບບ່ອຍກ່ຽວກັບ zrate.io',
    faqs: [
      { q: 'zrate.io ໃຊ້ເຮັດຫຍັງ?', a: 'ໃຊ້ກວດສອບອັດຕາແລກປ່ຽນ ແປງຄ່າເງິນ ຕິດຕາມແນວໂນ້ມ ແລະ ສຶກສາຄູ່ມືການໂອນເງິນ.' },
      { q: 'ຂໍ້ມູ້ນດຶງມາຈາກໃສ?', a: 'ດຶງມາແບບສົດໆຈາກ EODHD APIs ທີ່ປະມວນຜົນຂໍ້ມູ້ນຈາກຕະຫຼາດການເງິນທົ່ວໂລກ.' },
      { q: 'zrate.io ຮັບໂອນເງິນ ຫຼື ແລກເງິນແທ້ບໍ່?', a: 'ບໍ່, ເຮົາບໍ່ມີບໍລິການແລກເງິນ ຫຼື ໂອນເງິນ. ເວັບໄຊນີ້ເປັນພຽງແຫຼ່ງຂໍ້ມູ້ນ ແລະ ເຄື່ອງມືອ້າງອີງເທົ່ານັ້ນ.' },
      { q: 'ມືໃໝ່ໃຊ້ໄດ້ບໍ່?', a: 'ໃຊ້ໄດ້ງ່າຍຫຼາຍ ເພາະລະບົບອອກແບບໃຫ້ຄຳນວນຜົນທັນທີຫຼັງປ້ອນຕົວເລກ.' },
      { q: 'ມີຄ່າໃຊ້ຈ່າຍບໍ່?', a: 'ຟຣີ 100% ບໍ່ມີຄ່າສະມາຊິກ ຫຼື ຄ່າບໍລິການແອບແຝງ.' }
    ],
    homeLink: 'ກັບຄືນໜ້າຫຼັກ',
    contactLink: 'ຕິດຕໍ່ພວກເຮົາ',
    disclaimerHeading: 'ຂໍ້ຈຳກັດຄວາມຮັບຜິດຊອບ (Disclaimer)',
    disclaimerText: 'ອັດຕາແລກປ່ຽນເງິນຕາໃນ zrate.io ແມ່ນເພື່ອການໃຊ້ຂໍ້ມູ້ນທົ່ວໄປເທົ່ານັ້ນ. ເວັບໄຊທ໌ນີ້ບໍ່ຮັບປະກັນຄວາມຖືກຕ້ອງທັງໝົດ ແລະ ບໍ່ຮັບຜິດຊອບຕໍ່ຄວາມສູນເສຍໃດໆ. ຜູ້ໃຊ້ຄວນກວດສອບເລດແທ້ກັບທະນາຄານ ຫຼື ຮ້ານແລກເງິນກ່ອນເຮັດທຸລະກຳ.',
  },
  my: {
    title: 'ကျွန်ုပ်တို့အကြောင်း - zrate.io | ငွေလဲနှုန်းနှင့် နည်းပညာပွင့်လင်းမြင်သာမှု',
    metaDesc: 'zrate.io အကြောင်း လေ့လာပါ။ ထိုင်းဘတ်၊ မြန်မာကျပ်၊ အမေရိကန်ဒေါ်လာနှင့် အာဆီယံငွေကြေးအတွဲများကို အချိန်နှင့်တပြေးညီ တွက်ချက်ပေးသည့် ဝဘ်ဆိုက်၏ ရည်ရွယ်ချက်နှင့် အချက်အလက်အရင်းမြစ်များ။',
    eyebrow: 'zrate.io အကြောင်း',
    heading: 'zrate.io ဆိုတာဘာလဲ။',
    subheading: 'အာဆီယံဒေသတွင်းအတွက် အမြန်ငွေလဲနှုန်းစစ်ဆေးစက်နှင့် ကုန်ကျစရိတ်တွက်ချက်စနစ်',
    intro: 'zrate.io ကို အရှေ့တောင်အာရှရှိ အမှီအခိုကင်းသော ဆော့ဖ်ဝဲရေးဆွဲသူများနှင့် ဘဏ္ဍာရေးနည်းပညာဝါသနာရှင်များမှ တည်ထောင်ထားခြင်း ဖြစ်သည်။ ကျွန်ုပ်တို့သည် နေ့စဉ်ငွေလဲနှုန်းများကို မြန်မြန်ဆန်ဆန်၊ ရိုးရှင်းစွာနှင့် ကြော်ငြာများရှုပ်ထွေးမှုမရှိဘဲ ကိုးကားအသုံးပြုနိုင်ရန် ရည်ရွယ်ပါသည်။',
    badges: ['တိုက်ရိုက်တွက်ချက်စနစ်', 'စျေးကွက်ငွေလဲနှုန်း', 'ငွေသားနှုန်းစာရင်း', 'ငွေလွှဲလမ်းညွှန်', 'အာဆီယံအတွဲများ'],
    features: [
      { title: 'တိုက်ရိုက်ပြောင်းလဲမှု', desc: 'ကမ္ဘာ့ငွေကြေး ၄၀ ကျော်ကို အချိန်နှင့်တပြေးညီ တိကျစွာ ပြောင်းလဲတွက်ချက်ပေးသည်။' },
      { title: 'အာဆီယံအတွဲများ', desc: 'ဒေသတွင်းအဓိကအတွဲများဖြစ်သော THB/LAK, THB/MMK, THB/KHR နှင့် USDT နှုန်းများကို စောင့်ကြည့်နိုင်သည်။' },
      { title: 'ကုန်ကျစရိတ်တွက်ချက်မှု', desc: 'ဘဏ်နှင့် ဝန်ဆောင်မှုလုပ်ငန်းများ၏ ကုန်ကျစရိတ်များကို နှိုင်းယှဉ်ပြီး လက်ခံရရှိမည့် ပမာဏကို တွက်ချက်ပေးသည်။' },
      { title: 'ငွေကြေးမှတ်တမ်း', desc: 'ငွေလဲနှုန်းအတက်အကျ၊ ရက် ၃၀ ပျမ်းမျှနှုန်းနှင့် သမိုင်းမှတ်တမ်းများကို ဖော်ပြပေးသည်။' }
    ],
    helpHeading: 'zrate.io က သင့်ကို ဘယ်လိုကူညီပေးနိုင်လဲ။',
    helpItems: [
      'ထိုင်းဘတ် (THB)၊ လာအိုကစ် (LAK)၊ မြန်မာကျပ် (MMK)၊ ကမ္ဘောဒီးယားရီရယ် (KHR) နှင့် ဒေါ်လာ (USD) နှုန်းများကို ချက်ချင်းတွက်ချက်နိုင်ခြင်း',
      'စက္ကန့် ၆၀ တိုင်း အပ်ဒိတ်ဖြစ်နေသော တိုက်ရိုက်ငွေလဲနှုန်းများကို စစ်ဆေးနိုင်ခြင်း',
      'နိုင်ငံဖြတ်ကျော် ငွေလွှဲခနှင့် ကုန်ကျစရိတ်များကို ပွင့်လင်းမြင်သာစွာ စစ်ဆေးနိုင်ခြင်း',
      'ပင်မစာမျက်နှာရှိ ဇယားတွင် ငွေကြေးအများအပြားကို တစ်ပြိုင်တည်း နှိုင်းယှဉ်နိုင်ခြင်း',
      'အာဆီယံဒေသတွင်းအတွက် ငွေသားနှုန်းနှင့် အွန်လိုင်းနှုန်းများကို စစ်ထုတ်ကြည့်ရှုနိုင်ခြင်း'
    ],
    missionHeading: 'ကျွန်ုပ်တို့၏ ရည်မှန်းချက်',
    missionText: 'အာဆီယံဒေသတွင်း (အထူးသဖြင့် ထိုင်း၊ လာအို၊ မြန်မာ၊ ကမ္ဘောဒီးယား) ငွေလဲလှယ်မှုများကို ပွင့်လင်းမြင်သာမှုရှိစေရန်၊ နယ်စပ်ကုန်သည်များ၊ ခရီးသွားများနှင့် ရွှေ့ပြောင်းလုပ်သားများ ငွေကြေးလဲလှယ်ရာတွင် ကုန်ကျစရိတ်များကို သက်သာစွာ တွက်ချက်နိုင်ရန် ကူညီပေးခြင်းသည် ကျွန်ုပ်တို့၏ ရည်မှန်းချက်ဖြစ်ပါသည်။',
    missionPara2: 'ဘဏ္ဍာရေးဆိုင်ရာ ပွင့်လင်းမြင်သာမှုသည် လူတိုင်း၏ အခြေခံအခွင့်အရေးဖြစ်သည်ဟု ယုံကြည်ပါသည်။ ကောင်းမွန်သော နှိုင်းယှဉ်ကိရိယာရှိခြင်းက မလိုလားအပ်သော ကုန်ကျစရိတ်များကို ရှောင်ရှားစေနိုင်ပါသည်။',
    universeHeading: 'ငွေကြေးအတွဲများစုံလင်စွာ ဖော်ပြမှု',
    universeText: 'လူကြိုက်အများဆုံး ငွေကြေးအတွဲများအတွက် သီးခြားစာမျက်နှာများကို စနစ်တကျ ပြသပေးထားပါသည်။',
    universeCols: ['အဓိကအတွဲများ', 'အာဆီယံအတွဲများ', 'အခြားအတွဲအားလုံး'],
    notHeading: 'zrate.io မဟုတ်သည့်အရာများ',
    notText: 'zrate.io သည် ဘဏ်၊ ငွေလဲလုပ်ငန်း သို့မဟုတ် ငွေလွှဲဝန်ဆောင်မှုလုပ်ငန်း မဟုတ်ပါ။ ကျွန်ုပ်တို့သည် ငွေကြေးလွှဲပြောင်းမှု သို့မဟုတ် ကိုင်တွယ်မှုများကို ပြုလုပ်ခြင်းမရှိပါ။ ဖော်ပြထားသောနှုန်းများသည် ကိုးကားရန်အတွက်သာဖြစ်ပြီး၊ လုပ်ငန်းမလုပ်ဆောင်မီ ဘဏ် သို့မဟုတ် ငွေလဲကောင်တာတွင် နှုန်းထားများကို ထပ်မံအတည်ပြုရပါမည်။',
    faqHeading: 'zrate.io နှင့်ပတ်သက်၍ မကြာခဏမေးလေ့ရှိသော မေးခွန်းများ',
    faqs: [
      { q: 'zrate.io ကို ဘာအတွက် သုံးတာလဲ။', a: 'ငွေလဲနှုန်းများ စစ်ဆေးရန်၊ ငွေကြေးအတွဲများ တွက်ချက်ရန်၊ အတက်အကျမှတ်တမ်းကြည့်ရန်နှင့် ငွေလွှဲလမ်းညွှန်များ ဖတ်ရှုရန် သုံးသည်။' },
      { q: 'ငွေလဲနှုန်းဒေတာ ဘယ်ကရလဲ။', a: 'ကမ္ဘာလုံးဆိုင်ရာ ဘဏ္ဍာရေးအချက်အလက်များကို စုစည်းပေးသော EODHD APIs မှ တိုက်ရိုက်ရယူသည်။' },
      { q: 'zrate.io က ငွေလွှဲပေးပါသလား။', a: 'မလွှဲပေးပါ။ ငွေလွှဲခြင်း သို့မဟုတ် ငွေလဲလှယ်ခြင်း ဝန်ဆောင်မှုမရှိဘဲ၊ ကိုးကားရန်အတွက်သာ ဖော်ပြပေးခြင်းဖြစ်သည်။' },
      { q: 'အသုံးပြုခ ပေးရပါသလား။', a: 'လုံးဝ အခမဲ့ဖြစ်သည်။ မည်သည့်စာရင်းသွင်းခ သို့မဟုတ် လစဉ်ကြေးမှ ပေးရန်မလိုပါ။' },
      { q: 'စတင်အသုံးပြုသူများအတွက် အဆင်ပြေပါသလား။', a: 'အဆင်ပြေသည်။ ရိုးရှင်းသော ဒီဇိုင်းဖြင့် ပမာဏထည့်သွင်းရုံဖြင့် ချက်ချင်းတွက်ချက်ပေးသည်။' }
    ],
    homeLink: 'ပင်မစာမျက်နှာသို့',
    contactLink: 'ဆက်သွယ်ရန်',
    disclaimerHeading: 'ငြင်းဆိုချက်',
    disclaimerText: 'zrate.io ပေါ်ရှိ ငွေလဲနှုန်းများသည် ကိုးကားရန်အတွက်သာ ဖြစ်သည်။ တိကျမှုအတွက် အာမမခံပါ။ သုံးစွဲသူများသည် ဘဏ် သို့မဟုတ် တရားဝင်ငွေလဲဆိုင်များတွင် သေချာစွာ စစ်ဆေးပြီးမှသာ ငွေလဲလှယ်မှုများ ပြုလုပ်သင့်သည်။',
  },
  km: {
    title: 'អំពីយើង - zrate.io | ប្រភពព័ត៌មានអត្រាប្តូរប្រាក់ និងតម្លាភាពព័ត៌មាន',
    metaDesc: 'ស្វែងយល់អំពី zrate.io ក្រុមការងារអភិវឌ្ឍន៍ឧបករណ៍បម្លែងរូបិយប័ណ្ណ និងពិនិត្យអត្រាប្តូរប្រាក់ផ្សាយផ្ទាល់សម្រាប់ប្រាក់បាត, រៀល, ដុល្លារ និងរូបិយប័ណ្ណអាស៊ាន ព្រមទាំងតម្លាភាពទិន្នន័យ។',
    eyebrow: 'អំពី zrate.io',
    heading: 'តើ zrate.io គឺជាអ្វី?',
    subheading: 'ឧបករណ៍ពិនិត្យអត្រាប្តូរប្រាក់ និងបម្លែងរូបិយប័ណ្ណលឿនសម្រាប់អាស៊ាន',
    intro: 'zrate.io ត្រូវបានបង្កើតឡើងដោយក្រុមអ្នកអភិវឌ្ឍន៍កម្មវិធីឯករាជ្យ និងអ្នកជំនាញបច្ចេកវិទ្យាហិរញ្ញវត្ថុនៅអាស៊ីអាគ្នេយ៍ ដើម្បីផ្តល់ឧបករណ៍យោងអត្រាប្តូរប្រាក់ល្បឿនលឿន និងសាមញ្ញ។ យើងផ្តោតលើភាពងាយស្រួល ដំណើរការលឿន សម្រាប់អ្នកប្រើប្រាស់ទូទៅ។',
    badges: ['បម្លែងលុយភ្លាមៗ', 'អត្រាទីផ្សារ', 'ស្ថិតិលុយផ្ទាល់', 'មគ្គុទ្ទេសក៍ផ្ញើលុយ', 'គូរូបិយប័ណ្ណអាស៊ាន'],
    features: [
      { title: 'បម្លែងប្រាក់ផ្ទាល់', desc: 'ប្រៀបធៀប និងគណនាតម្លៃរូបិយប័ណ្ណបរទេសជាង 40 តាមពេលវេលាពិតប្រាកដ និងមានភាពត្រឹមត្រូវខ្ពស់។' },
      { title: 'គូរូបិយប័ណ្ណអាស៊ាន', desc: 'ផ្តោតលើការតាមដានគូសំខាន់ៗក្នុងតំបន់ដូចជា THB/LAK, THB/MMK, THB/KHR និងអត្រា USDT។' },
      { title: 'គណនាថ្លៃដើម', desc: 'ជួយប្រៀបធៀបកម្រៃសេវា និងអត្រាប្តូរប្រាក់ជាក់ស្តែង ដើម្បីវាយតម្លៃទឹកប្រាក់ទទួលបានចុងក្រោយ។' },
      { title: 'ស្ថិតិនិងប្រវត្តិចុងក្រោយ', desc: 'បង្ហាញទិន្នន័យអំពីភាពប្រែប្រួលនៃតម្លៃលុយ អត្រាមធ្យម 30 ថ្ងៃ និងប្រវត្តិនៃការប្រែប្រួល។' }
    ],
    helpHeading: 'តើ zrate.io ជួយវិភាគ និងសម្រួលអ្វីខ្លះដល់អ្នក?',
    helpItems: [
      'គណនាបម្លែងប្រាក់បាត (THB), ប្រាក់គីបឡាវ (LAK), ប្រាក់ច្យាតមីយ៉ាន់ម៉ា (MMK), ប្រាក់រៀលខ្មែរ (KHR) និងប្រាក់ដុល្លារ (USD) ភ្លាមៗ',
      'ពិនិត្យអត្រាប្តូរប្រាក់យោងតាមពេលវេលាពិត អាប់ដេតរៀងរាល់ 60 វិនាទីម្តង',
      'វាយតម្លៃ និងប្រៀបធៀបថ្លៃចំណាយក្នុងការផ្ទេរប្រាក់ទៅក្រៅប្រទេសប្រកបដោយតម្លាភាព',
      'ប្រៀបធៀបរូបិយប័ណ្ណច្រើនក្នុងពេលតែមួយលើតារាងនៅលើទំព័រដើម ដើម្បីងាយស្រួលសម្រេចចិត្ត',
      'តម្រងអត្រាប្រាក់សុទ្ធ និងអត្រាអនឡាញ តម្រូវតាមតម្រូវការជាក់ស្តែងក្នុងតំបន់អាស៊ាន'
    ],
    missionHeading: 'បេសកកម្មរបស់យើង',
    missionText: 'បេសកកម្មរបស់ zrate.io គឺបង្កើតតម្លាភាពហិរញ្ញវត្ថុក្នុងតំបន់អាស៊ាន (ថៃ ឡាវ មីយ៉ាន់ម៉ា កម្ពុជា) ជួយពលករទេសន្តរប្រវេសន៍ ភ្ញៀវទេសចរ និងអាជីវករព្រំដែន អាចប្រៀបធៀបតម្លៃលុយ និងគណនាថ្លៃផ្ញើប្រាក់បានច្បាស់លាស់។',
    missionPara2: 'យើងជឿជាក់ថា តម្លាភាពហិរញ្ញវត្ថុគឺជាសិទ្ធិជាមូលដ្ឋាន។ ការមានឧបករណ៍ប្រៀបធៀបដ៏ល្អ ជួយឱ្យអ្នកប្រើប្រាស់ជៀសវាងថ្លៃសេវាលាក់កំបាំងផ្សេងៗ។',
    universeHeading: 'គ្របដណ្តប់គូរូបិយប័ណ្ណពេញនិយម',
    universeText: 'ប្រព័ន្ធរបស់យើងគាំទ្រ និងរចនាទំព័រគូរូបិយប័ណ្ណយោងសម្រាប់គូដែលពេញនិយមបំផុត ដើម្បីសម្រួលដល់ការវិភាគ។',
    universeCols: ['គូរូបិយប័ណ្ណណែនាំ', 'គូរូបិយប័ណ្ណអាស៊ាន', 'គូរូបិយប័ណ្ណផ្សេងទៀតទាំងអស់'],
    notHeading: 'តើ zrate.io មិនមែនជាអ្វី?',
    notText: 'zrate.io មិនមែនជាធនាគារ ស្ថាប័នហិរញ្ញវត្ថុ ឬអ្នកផ្តល់សេវាប្តូរ/ផ្ទេរប្រាក់ឡើយ។ យើងមិនកាន់កាប់ ឬដំណើរការផ្ទេរប្រាក់ឡើយ។ ទិន្នន័យទាំងអស់គឺសម្រាប់តែជាឯកសារយោងប៉ុណ្ណោះ។ អ្នកប្រើប្រាស់ត្រូវតែផ្ទៀងផ្ទាត់ជាមួយអ្នកផ្តល់សេវាជាក់ស្តែងមុនពេលធ្វើប្រតិបត្តិការ។',
    faqHeading: 'សំណួរដែលសួរញឹកញាប់អំពី zrate.io',
    faqs: [
      { q: 'តើ zrate.io ប្រើសម្រាប់ធ្វើអ្វី?', a: 'zrate.io ប្រើសម្រាប់ពិនិត្យអត្រាប្តូរប្រាក់ បម្លែងប្រាក់ តាមដានស្ថិតិប្រែប្រួល និងអានមគ្គុទ្ទេសក៍ផ្ញើប្រាក់។' },
      { q: 'តើទិន្នន័យអត្រាប្តូរប្រាក់បានមកពីណា?', a: 'ទិន្នន័យទាំងអស់ត្រូវបានទាញយកតាមពេលវេលាពិតពី EODHD APIs ដែលប្រមូលផ្តុំពីទីផ្សារហិរញ្ញវត្ថុទូទាំងពិភពលោក។' },
      { q: 'តើ zrate.io ផ្ទេរប្រាក់ ឬប្តូរប្រាក់មែនទេ?', a: 'ទេ យើងមិនផ្ទេរប្រាក់ ឬប្តូរប្រាក់ឡើយ។ គេហទំព័រនេះគ្រាន់តែជាប្រភពព័ត៌មាន និងឧបករណ៍វិភាគយោងប៉ុណ្ណោះ។' },
      { q: 'តើអ្នកប្រើប្រាស់ថ្មីងាយយល់ទេ?', a: 'ងាយស្រួលបំផុត ដោយគ្រាន់តែបញ្ចូលទឹកប្រាក់ ប្រព័ន្ធនឹងបង្ហាញលទ្ធផលភ្លាមៗ ព្រមទាំងមានអត្ថបទណែនាំបន្ថែម។' },
      { q: 'តើត្រូវបង់ប្រាក់ដើម្បីប្រើប្រាស់ zrate.io ឬទេ?', a: 'ឥតគិតថ្លៃ 100% សម្រាប់អ្នកប្រើប្រាស់ទាំងអស់ គ្មានថ្លៃសេវាលាក់កំបាំង ឬតម្រូវឱ្យចុះឈ្មោះឡើយ។' }
    ],
    homeLink: 'ទៅទំព័រដើម',
    contactLink: 'ទំនាក់ទំនង',
    disclaimerHeading: 'ការបដិសេធ',
    disclaimerText: 'អត្រាប្តូរប្រាក់នៅលើ zrate.io គឺសម្រាប់តែព័ត៌មានទូទៅប៉ុណ្ណោះ។ យើងមិនធានាភាពត្រឹមត្រូវ 100% ឡើយ។ អ្នកប្រើប្រាស់ត្រូវតែផ្ទៀងផ្ទាត់ជាមួយធនាគារ ឬកន្លែងប្តូរប្រាក់ផ្លូវការមុនធ្វើប្រតិបត្តិការ។',
  },
}

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const lang = ((LOCALES as string[]).includes(resolvedParams.locale) ? resolvedParams.locale : 'th') as LanguageCode
  const content = ABOUT_CONTENT[lang]
  const prefix = lang === 'th' ? '' : `/${lang}`

  return {
    title: content.title,
    description: content.metaDesc,
    alternates: {
      canonical: `${SITE_URL}${prefix}/about`,
      languages: {
        th: `${SITE_URL}/about`,
        en: `${SITE_URL}/en/about`,
        lo: `${SITE_URL}/lo/about`,
        my: `${SITE_URL}/my/about`,
        km: `${SITE_URL}/km/about`,
        'x-default': `${SITE_URL}/about`,
      },
    },
    openGraph: {
      title: content.title,
      description: content.metaDesc,
      url: `${SITE_URL}${prefix}/about`,
      siteName: 'zrate.io',
      type: 'website',
      locale: lang === 'th' ? 'th_TH' : lang === 'en' ? 'en_US' : lang === 'lo' ? 'lo_LA' : lang === 'my' ? 'my_MM' : 'km_KH',
      images: [
        {
          url: `${SITE_URL}/about-illustration.png`,
          width: 1024,
          height: 1024,
          alt: content.title,
        },
      ],
    },
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const lang = ((LOCALES as string[]).includes(resolvedParams.locale) ? resolvedParams.locale : 'th') as LanguageCode
  const content = ABOUT_CONTENT[lang]
  const prefix = lang === 'th' ? '' : `/${lang}`

  const aboutPageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${SITE_URL}${prefix}/about#webpage`,
        'url': `${SITE_URL}${prefix}/about`,
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
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}${prefix}/about#faq`,
        'mainEntity': content.faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.q,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.a,
          },
        })),
      },
    ],
  }

  // Filter pairs for Coverage Universe
  const otherPairs = PAIRS.filter(
    p => !FEATURED_PAIRS.includes(p) && !REGIONAL_PAIRS.includes(p)
  )

  return (
    <main className={styles.container} lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />

      <Header lang={lang} subtitle={content.subheading} />

      <SeoNav lang={lang} active="about" />

      <section className={styles.contentSection}>
        {/* HERO SECTION */}
        <div className={styles.heroLayout}>
          <article className={styles.card}>
            <div className={styles.eyebrow}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
              {content.eyebrow}
            </div>
            <h1>{content.heading}</h1>
            <p className={styles.lead}>{content.intro}</p>
            <p className={styles.sublead}>{content.subheading}</p>
            <div className={styles.badgeList}>
              {content.badges.map(badge => (
                <span key={badge} className={styles.badge}>
                  {badge}
                </span>
              ))}
            </div>
          </article>
          <div className={styles.imageCard}>
            <Image
              src="/about-illustration.png"
              alt="zrate.io - ASEAN currency exchange and transparency illustration"
              width={600}
              height={600}
              priority
              className={styles.heroImage}
            />
          </div>
        </div>

        {/* 4 FEATURE BOXES */}
        <div className={styles.featuresGrid}>
          {content.features.map((feat, index) => (
            <article key={feat.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>
                {index === 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                ) : index === 1 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                ) : index === 2 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" x2="15" y1="22" y2="22"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
                )}
              </div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </article>
          ))}
        </div>

        {/* DETAIL LAYOUT (LEFT/RIGHT) */}
        <div className={styles.detailLayout}>
          <article className={`${styles.card} styles.listCard`}>
            <h2>{content.helpHeading}</h2>
            <ul>
              {content.helpItems.map(item => (
                <li key={item}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <aside className={`${styles.card} ${styles.missionCard}`}>
            <h2>{content.missionHeading}</h2>
            <p>{content.missionText}</p>
            <p>{content.missionPara2}</p>
            <div className={styles.missionLinks}>
              <Link className={styles.btnPrimary} href={lang === 'th' ? '/' : `/${lang}`}>
                {content.homeLink}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
              <Link className={styles.btnSecondary} href={lang === 'th' ? '/contact' : `/${lang}/contact`}>
                {content.contactLink}
              </Link>
            </div>
          </aside>
        </div>

        {/* COVERAGE UNIVERSE */}
        <section className={styles.card}>
          <h2>{content.universeHeading}</h2>
          <p>{content.universeText}</p>
          <div className={styles.universeGrid}>
            {/* Column 1: Featured Pairs */}
            <div className={styles.universeColumn}>
              <h3>{content.universeCols[0]}</h3>
              <div className={styles.universeLinks}>
                {FEATURED_PAIRS.map(pair => (
                  <Link key={pair} href={localizePath(lang, `/${pair}`)}>
                    {PAIR_LABELS[pair]}
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 2: Regional ASEAN Pairs */}
            <div className={styles.universeColumn}>
              <h3>{content.universeCols[1]}</h3>
              <div className={styles.universeLinks}>
                {REGIONAL_PAIRS.map(pair => (
                  <Link key={pair} href={localizePath(lang, `/${pair}`)}>
                    {PAIR_LABELS[pair]}
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 3: Other Currency Pairs */}
            <div className={styles.universeColumn}>
              <h3>{content.universeCols[2]}</h3>
              <div className={styles.universeLinks}>
                {otherPairs.map(pair => (
                  <Link key={pair} href={localizePath(lang, `/${pair}`)}>
                    {PAIR_LABELS[pair]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ANTI-FEATURES SECTION */}
        <article className={styles.card}>
          <h2>{content.notHeading}</h2>
          <p>{content.notText}</p>
        </article>

        {/* DISCLAIMER SECTION */}
        <article id="disclaimer" className={`${styles.card} ${styles.disclaimerCard}`}>
          <h2>{content.disclaimerHeading}</h2>
          <p>{content.disclaimerText}</p>
        </article>

        {/* FAQ SECTION */}
        <section id="faq" className={styles.card}>
          <h2>{content.faqHeading}</h2>
          <div className={styles.faqList}>
            {content.faqs.map(faq => (
              <div key={faq.q} className={styles.faqItem}>
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <Footer lang={lang} />
    </main>
  )
}
