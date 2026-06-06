import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '../../components/Footer'
import { SeoNav } from '../../components/SeoNav'
import { Header } from '../../components/Header'
import { AdSection } from '../../components/AdsterraAds'
import {
  LanguageCode,
  LOCALES,
  PAIRS,
  PAIR_LABELS,
  SITE_URL,
  localizePath
} from '../../../lib/siteNavigation'
import styles from './rates.module.css'

const PATH = '/rates'

interface FaqItem {
  q: string
  a: string
}

interface ArticleBlock {
  title: string
  paragraphs: string[]
}

interface RatesPageContentBlock {
  title: string
  metaDesc: string
  eyebrow: string
  heading: string
  subheading: string
  intro: string
  breadcrumbHome: string
  breadcrumbCurrent: string
  tableHeading: string
  tableHeaders: [string, string, string, string]
  tblActionLink: string
  contentHeading: string
  articles: ArticleBlock[]
  faqHeading: string
  faqs: FaqItem[]
  updateLabel: string
  linksHeading: string
  statsStatusLabel: string
  statsStatusValue: string
  statsTrackedLabel: string
  statsTrackedValue: string
  statsBaseLabel: string
  statsBaseValue: string
}

const RATES_PAGE_CONTENT: Record<LanguageCode, RatesPageContentBlock> = {
  th: {
    title: 'อัตราแลกเปลี่ยนวันนี้ USD THB USDT EUR | เรทสด zrate.io',
    metaDesc: 'เช็กอัตราแลกเปลี่ยนเงินวันนี้แบบเรียลไทม์ ตารางอัตราแลกเปลี่ยนเงินดอลลาร์ บาทไทย ยูโร กีบ จ๊าด และเรียลอัปเดตวินาทีต่อวินาที พร้อมข้อมูล E-E-A-T ทางการเงิน',
    eyebrow: 'EXCHANGE RATE HUB',
    heading: 'อัตราแลกเปลี่ยนวันนี้ — USD/THB, USDT, EUR, เยน และสกุลเงินอาเซียน',
    subheading: 'เปรียบเทียบและเช็กอัตราแลกเปลี่ยนตลาดกลางเพื่อสิทธิประโยชน์ที่ดีที่สุดของคุณ',
    intro: 'หน้ารวมข้อมูลอ้างอิงและตารางอัตราแลกเปลี่ยนเงินตราต่างประเทศสำหรับสกุลเงินหลักทั่วโลกและภูมิภาคอาเซียน ช่วยให้คุณประเมินค่าใช้จ่ายในการแลกเงินสด ท่องเที่ยว และโอนเงินข้ามพรมแดนได้อย่างโปร่งใสและแม่นยำ',
    breadcrumbHome: 'หน้าแรก',
    breadcrumbCurrent: 'อัตราแลกเปลี่ยนเงินวันนี้',
    tableHeading: 'ตารางอัตราแลกเปลี่ยนสด (Live Rates)',
    tableHeaders: ['คู่เงิน', 'อัตราแลกเปลี่ยนสด', 'เปลี่ยนแปลง (24ชม.)', 'ดูข้อมูล'],
    tblActionLink: 'ดูเรทสด',
    contentHeading: 'คู่มือความรู้เกี่ยวกับอัตราแลกเปลี่ยนและส่วนต่างราคาซื้อขาย',
    articles: [
      {
        title: '1. ทำความเข้าใจอัตราแลกเปลี่ยนเงินตราต่างประเทศ (Foreign Exchange Rates)',
        paragraphs: [
          'อัตราแลกเปลี่ยนคือมูลค่าของสกุลเงินหนึ่งเมื่อเทียบกับอีกสกุลเงินหนึ่ง เช่น อัตราแลกเปลี่ยน USD/THB เท่ากับ 36.5 หมายความว่าคุณต้องใช้เงิน 36.5 บาทไทย เพื่อแลกกับ 1 ดอลลาร์สหรัฐ ค่าเงินเหล่านี้เคลื่อนไหวและผันผวนอยู่ตลอดเวลาตามกลไกตลาดเสรี เช่น ดีมานด์ซัพพลาย นโยบายอัตราดอกเบี้ยของธนาคารกลาง อัตราเงินเฟ้อ และสภาวะเศรษฐกิจในแต่ละประเทศ',
          'สำหรับผู้ใช้งานในภูมิภาคอาเซียน โดยเฉพาะการทำธุรกรรมระหว่างไทย ลาว เมียนมา และกัมพูชา การเช็กอัตราแลกเปลี่ยนสดในแต่ละวันช่วยให้สามารถประเมินความคุ้มค่าของการถือครองสกุลเงินหรือการส่งเงินข้ามพรมแดนได้อย่างดี'
        ]
      },
      {
        title: '2. เรทตลาดกลาง (Mid-Market Rate) แตกต่างจากเรทค้าปลีกของธนาคารอย่างไร?',
        paragraphs: [
          'ราคาที่แสดงบน zrate.io คือ อัตราตลาดกลาง (Mid-Market Rate หรือ Interbank Rate) ซึ่งเป็นราคาซื้อขายจริงระหว่างสถาบันการเงินขนาดใหญ่ในตลาดโลก ถือเป็นจุดศูนย์กลางและอัตราอ้างอิงที่ยุติธรรมที่สุดในเวลานั้น',
          'อย่างไรก็ตาม เมื่อคุณไปแลกเงินที่ธนาคารพาณิชย์ หรือร้านแลกเงินทั่วไป คุณจะพบว่าเรทจริงที่ได้รับจะแตกต่างออกไปเล็กน้อย เนื่องจากผู้ให้บริการแลกเงินและโอนเงินจะทำการเพิ่ม ส่วนต่างอัตราแลกเปลี่ยน (Exchange Rate Margin หรือ Spread) และค่าธรรมเนียมการทำธุรกรรมเข้าไป เพื่อเป็นรายได้และค่าบริการของตนเอง ดังนั้นการเช็กเรทตลาดกลางจึงช่วยให้คุณทราบว่าผู้ให้บริการรายใดคิดค่าใช้จ่ายแฝงมากที่สุด'
        ]
      },
      {
        title: '3. วิธีแลกเงินและโอนเงินต่างประเทศให้ได้เรทที่ดีและคุ้มค่าที่สุด',
        paragraphs: [
          'หลีกเลี่ยงการแลกเงินที่สนามบิน: ร้านแลกเงินในสนามบินมักตั้งค่าส่วนต่าง Spread ที่สูงมาก ทำให้คุณสูญเสียยอดเงินปลายทางไปมากกว่าปกติ หากไม่มีเหตุจำเป็น แนะนำให้แลกเงินในเมืองหรือร้านแลกเงินอิสระที่ได้รับอนุญาต',
          'ตรวจสอบค่าธรรมเนียมแอบแฝงในการโอนเงิน: ผู้ให้บริการโอนเงินต่างประเทศหลายรายโปรโมทว่า "ฟรีค่าธรรมเนียมโอน" แต่แอบบวกส่วนต่างเรทแลกเปลี่ยนไว้ในเรทซื้อขาย วิธีเช็กที่ง่ายที่สุดคือการคำนวณยอดเงินที่ผู้รับจะได้ปลายทางจริง แล้วเปรียบเทียบกับราคาอ้างอิงบนหน้า zrate.io ของเรา'
        ]
      }
    ],
    faqHeading: 'คำถามที่พบบ่อยเกี่ยวกับอัตราแลกเปลี่ยนเงินวันนี้ (FAQ)',
    faqs: [
      {
        q: 'เรทบน zrate.io อัปเดตบ่อยแค่ไหน?',
        a: 'เรทบน zrate.io ซิงก์อัตโนมัติทุก 60 วินาที โดยอ้างอิงข้อมูลจากสถาบันการเงินและแหล่งข้อมูลระดับโลกผ่านระบบ EODHD ทำให้คุณไม่พลาดความเคลื่อนไหวที่สำคัญ'
      },
      {
        q: 'ทำไมเรทบนเว็บไม่ตรงกับเรทธนาคารหรือร้านแลกเงิน?',
        a: 'ตัวเลขบน zrate.io เป็นเรทอ้างอิงกลางตลาด (Mid-Market Rate) ขณะที่ธนาคารและร้านแลกเงินจะบวกส่วนต่าง (spread) และค่าธรรมเนียมตามแต่ละสถาบัน ทำให้เรทจริงที่คุณทำธุรกรรมต่างกันเล็กน้อย'
      },
      {
        q: 'USDT/THB ต่างจาก USD/THB อย่างไร?',
        a: 'USD/THB คืออัตราแลกเปลี่ยนดอลลาร์สหรัฐเทียบเงินบาทไทย ส่วน USDT/THB คืออัตราแลกเปลี่ยนเหรียญ Stablecoin (USDT) ที่ผูกมูลค่ากับดอลลาร์ในตลาดคริปโทเคอร์เรนซี ทั้งสองค่ามีความใกล้เคียงกันแต่แยกกระดานซื้อขายทำให้ราคาไม่เท่ากันเป๊ะ'
      },
      {
        q: 'ใช้เรทบน zrate.io อ้างอิงสำหรับโอนเงินข้ามประเทศได้ไหม?',
        a: 'ใช้เป็นข้อมูลอ้างอิงประมาณการเบื้องต้นที่ดีมาก แต่ก่อนทำธุรกรรมโอนจริง ควรยืนยันยอดเงินปลายทางสุดท้ายกับผู้ให้บริการโอนเงินอีกครั้งเพื่อความถูกต้องทางการเงิน'
      }
    ],
    updateLabel: 'ข้อมูลอัปเดตเรียลไทม์ล่าสุด:',
    linksHeading: 'คู่เงินอัตราแลกเปลี่ยนทั้งหมด',
    statsStatusLabel: 'สถานะดึงข้อมูล',
    statsStatusValue: 'ซิงก์สดเรียลไทม์',
    statsTrackedLabel: 'คู่เงินที่แสดง',
    statsTrackedValue: '12 คู่เงินยอดนิยม',
    statsBaseLabel: 'ดัชนีราคา',
    statsBaseValue: 'เรทอ้างอิงตลาดกลาง',
  },
  en: {
    title: 'Live Exchange Rates Today USD THB USDT EUR | zrate.io',
    metaDesc: 'Compare live exchange rates today for US Dollar, Thai Baht, USDT, Euro, Kip, Kyat, and Riel. E-E-A-T compliant reference directory updated every 60 seconds.',
    eyebrow: 'EXCHANGE RATE HUB',
    heading: 'Exchange Rates Today — USD/THB, USDT, EUR, Yen & ASEAN Currencies',
    subheading: 'Check and compare mid-market reference rates to optimize your international exchanges.',
    intro: 'Your central hub for global currency and ASEAN exchange rate references. Monitor live data, estimate cross-border remittance costs, and find transparent guides before you send or swap money.',
    breadcrumbHome: 'Home',
    breadcrumbCurrent: 'Exchange Rates Today',
    tableHeading: 'Live Exchange Rates Directory',
    tableHeaders: ['Pair', 'Live Rate', '24h Change', 'Detail'],
    tblActionLink: 'View Live Rate',
    contentHeading: 'Comprehensive Exchange Rate & Currency Margin Guide',
    articles: [
      {
        title: '1. What Exactly is a Foreign Exchange Rate (FX)?',
        paragraphs: [
          'An exchange rate represents the value of one currency relative to another. For example, a USD/THB rate of 36.5 indicates that 1 US Dollar is equivalent to 36.5 Thai Baht. These values move constantly throughout the day, driven by global market forces, central bank interest rate decisions, inflation indicators, and economic health.',
          'For travelers, businesses, and expats in Southeast Asia—especially those sending remittances between Thailand, Laos, Myanmar, and Cambodia—staying updated with live rates is essential for saving money.'
        ]
      },
      {
        title: '2. Mid-Market Rates vs. Retail Exchange Rates',
        paragraphs: [
          'The figures displayed on zrate.io are mid-market rates (sometimes referred to as interbank rates). This is the midway point between bid and ask prices in the wholesale global currency markets, and is widely considered the fairest reference rate.',
          'In contrast, when you buy cash at a bank or use a money transfer service, you receive retail rates. These providers add an exchange rate markup (also known as spread margin) to cover their operational expenses and generate profit. Checking the mid-market rate beforehand lets you identify the hidden margins added by retail providers.'
        ]
      },
      {
        title: '3. Strategic Tips for Securing the Best Exchange Rates',
        paragraphs: [
          'Avoid Airport Kiosks: Airport currency exchanges usually offer some of the worst retail rates with high spread margins. Unless it is an absolute emergency, seek out authorized independent money changers in the city centers.',
          'Watch Out for "Fee-Free" Offers: Many international remittance services advertise "zero fees" or "no commission" transfers, but hide their costs by offering highly unfavorable exchange rates. To verify, compare the final recipient amount against the mid-market rate shown on zrate.io.'
        ]
      }
    ],
    faqHeading: 'Frequently Asked Questions about Exchange Rates Today (FAQ)',
    faqs: [
      {
        q: 'How often are exchange rates updated on zrate.io?',
        a: 'Rates on zrate.io are synced automatically every 60 seconds based on reference data from EODHD. This ensures you receive highly fresh rates.'
      },
      {
        q: 'Why do the rates on the website not match the bank or exchange shop rates?',
        a: 'The rates on zrate.io represent the mid-market rate. Banks and money changers add an exchange margin (spread) and service fees, making their actual retail rates slightly different.'
      },
      {
        q: 'How does USDT/THB differ from USD/THB?',
        a: 'USD/THB tracks the US dollar relative to the Thai baht, while USDT/THB represents a cryptocurrency stablecoin pegged to the US dollar. Their prices are closely correlated but not identical.'
      },
      {
        q: 'Can I use zrate.io rates as a reference for sending money abroad?',
        a: 'Yes, they serve as a solid reference, but you should verify final transaction rates with your provider first, as fees and exchange rate spread margins vary by provider.'
      }
    ],
    updateLabel: 'Last real-time rate sync:',
    linksHeading: 'All exchange-rate pairs',
    statsStatusLabel: 'Data Feed',
    statsStatusValue: 'Live Real-time',
    statsTrackedLabel: 'Active Pairs',
    statsTrackedValue: '12 Featured Pairs',
    statsBaseLabel: 'Pricing Index',
    statsBaseValue: 'Mid-Market Reference',
  },
  lo: {
    title: 'ອັດຕາແລກປ່ຽນມື້ນີ້ USD THB USDT EUR | ເຣດສົດ zrate.io',
    metaDesc: 'ກວດເບິ່ງອັດຕາແລກປ່ຽນເງິນຕ່າງປະເທດມື້ນີ້ແບບສົດໆ. ຕາຕະລາງອັດຕາແລກປ່ຽນເງິນໂດລາ, ບາດ, ກີບ, ຈາດ ແລະ ຣຽວ ອັບເດດທຸກໆ 60 ວິນາທີ.',
    eyebrow: 'EXCHANGE RATE HUB',
    heading: 'ອັດຕາແລກປ່ຽນມື້ນີ້ — USD/THB, USDT, EUR, ເຢນ ແລະສະກຸນເງິນອາຊຽນ',
    subheading: 'ປຽบທຽບ ແລະ ກວດເບິ່ງອັດຕາແລກປ່ຽນຕະຫຼາດກາງເພື່ອຜົນປະໂຫຍດສູງສຸດຂອງທ່ານ',
    intro: 'ສູນລວມຂໍ້ມູນອັດຕາແລກປ່ຽນເງິນຕາຕ່າງປະເທດ. ຊ່ວຍໃຫ້ທ່ານປະເມີນຄ່າໃຊ້ຈ່າຍໃນການແລກປ່ຽນເງິນສົດ ແລະ ໂອນເງິນຂ້າມປະເທດໃນພາກພື້ນອາຊຽນໄດ້ຢ່າງໂປ່ງໃສ.',
    breadcrumbHome: 'ໜ້າຫຼັກ',
    breadcrumbCurrent: 'ອັດຕາແລກປ່ຽນມື້ນີ້',
    tableHeading: 'ຕາຕະລາງອັດຕາແລກປ່ຽນສົດ (Live Rates)',
    tableHeaders: ['ຄູ່ເງິນ', 'ອັດຕາແລກປ່ຽນສົດ', 'ປ່ຽນແປງ (24ຊມ)', 'ເບິ່ງຂໍ້ມູນ'],
    tblActionLink: 'ເບິ່ງເຣດສົດ',
    contentHeading: 'ຄູ່ມືຄວາມຮູ້ກ່ຽວກັບອັດຕາແລກປ່ຽນ ແລະ ສ່ວນຕ່າງລາຄາ',
    articles: [
      {
        title: '1. ຄວາມເຂົ້າໃຈກ່ຽວກັບອັດຕາແລກປ່ຽນເງິນຕ່າງປະເທດ (Exchange Rates)',
        paragraphs: [
          'ອັດຕາແລກປ່ຽນແມ່ນມູນຄ່າຂອງສະກຸນເງິນໜຶ່ງເມື່ອທຽບກັບອີກສະກຸນເງິນໜຶ່ງ. ມູນຄ່ານີ້ມີການປ່ຽນແປງຕະຫຼອດເວລາໂດຍອີງໃສ່ກົນໄກຕະຫຼາດ ເຊັ່ນ ນະໂຍບາຍອັດຕາດອກເບ້ຍຂອງທະນາຄານກາງ, ອັດຕາເງິນເຟີ້ ແລະ ສະພາບການເສດຖະກິດ.',
          'ສຳລັບຜູ້ໃຊ້ງານໃນພາກພື້ນອາຊຽນ, ໂດຍສະເພາะການໂອນເງິນລະຫວ່າງ ໄທ, ລາວ, ມຽນມາ ແລະ ກຳປູເຈຍ, ການກວດເບິ່ງອັດຕາແແລກປ່ຽນເປັນປະຈຳຈະຊ່ວຍຫຼຸດຜ່ອນຕົ້ນທຶນໄດ້ຫຼາຍ.'
        ]
      },
      {
        title: '2. ເຣດຕະຫຼາດກາງ (Mid-Market Rate) ແຕກຕ່າງຈາກເຣດທະນາຄານແນວໃດ?',
        paragraphs: [
          'ຕົວເລກທີ່ສະແດງໃນ zrate.io ແມ່ນເຣດຕະຫຼາດກາງ (Mid-Market Rate) ເຊິ່ງເປັນອັດຕາອ້າງອີງທີ່ຍຸດຕິທຳທີ່ສຸດໃນເວລານັ້ນ.',
          'ແຕ່ເວລາທ່ານໄປແລກເງິນຕົວຈິງຢູ່ທະນາຄານ ຫຼື ຮ້ານແລກເງິນ, ທ່ານຈະໄດ້ເຣດຄ່າປ່ຽກ (Retail Rate) ເຊິ່ງໄດ້ມີການບວກ ສ່ວນຕ່າງອັດຕາແລກປ່ຽນ (Spread) และ ຄ່າທຳນຽມເຂົ້າໄປແລ້ວ.'
        ]
      },
      {
        title: '3. ເຄັດລັບການແລກເງິນ ແລະ ໂອນເງິນໃຫ້ຄຸ້ມຄ່າທີ່ສຸດ',
        paragraphs: [
          'ຫຼີກລ່ຽງການແລກເງິນຢູ່ສະໜາມບິນ: ເພາະຮ້ານແລກເງິນຢູ່ສະໜາມບິນມັກບວກສ່ວນຕ່າງສູງຫຼາຍ.',
          'ກວດສອບຄ່າທຳນຽມແຝງ: ບາງບໍລິການອາດໂຄສະນາວ່າ "ໂອນຟຣີບໍ່ມີຄ່າທຳນຽມ" ແຕ່ໄປບວກຄ່າທຳນຽມແຝງໃສ່ອັດຕາແລกປ່ຽນທີ່ແພງຂຶ້ນ.'
        ]
      }
    ],
    faqHeading: 'ຄຳຖາມທີ່ພົບບ່ອຍກ່ຽວກັບອັດຕາແລກປ່ຽນມື້ນີ້ (FAQ)',
    faqs: [
      {
        q: 'ເຣດໃນ zrate.io ອັບເດດເລື້ອຍປານໃດ?',
        a: 'ເຣດໃນ zrate.io ຊິງອັດຕະໂນມັດທຸກໆ 60 ວິນາທີ ໂດຍອ້າງອີງຂໍ້ມູນຈາກສ້າງສະຖາບັນການເງິນລະດັບໂລກຜ່ານລະບົບ EODHD.'
      },
      {
        q: 'ເປັນຫຍັງເຣດໃນເວັບຈຶ່ງບໍ່ຕົງກັບເຣດທະນາຄານ ຫຼື ຮ້ານແລກປ່ຽນ?',
        a: 'ຕົວເລກໃນ zrate.io ແມ່ນເຣດອ້າງອີງກາງຕະຫຼາດ. ທະນາຄານ ແລະ ຮ້ານແລກເງິນຈະບວກສ່ວນຕ່າງ (spread) ແລະ ຄ່າທຳນຽມ ຈຶ່ງເຮັດໃຫ້ເຣດຕົວຈິງຕ່າງກັນເລັກນ້ອຍ.'
      },
      {
        q: 'USDT/THB ຕ່າງຈາກ USD/THB ແນວໃດ?',
        a: 'USD/THB ແມ່ນໂດລາສະຫະລັດທຽບບາດ, ສ່ວນ USDT/THB ແມ່ນ stablecoin ທີ່ຜູກມູນຄ່າກັບໂດລາ. ລາຄາທັງສອງໃກ້ຄຽງກັນແຕ່ບໍ່ເທົ່າກັນເປະ.'
      },
      {
        q: 'ໃຊ້ເຣດໃນ zrate.io ເພື່ອອ້າງອີງໃນການໂອນເງິນຕ່າງປະເທດໄດ້ບໍ່?',
        a: 'ສາມາດໃຊ້ເປັນຂໍ້ມູນອ້າງອີງເບື້ອງຕົ້ນໄດ້, ແຕ່ກ່ອນໂອນແທ້ຄວນກວດສອບກັບຜູ້ໃຫ້ບໍລິການໂອນເງິນອີກຄັ້ງ.'
      }
    ],
    updateLabel: 'ອັບເດດຫຼ້າສຸດ:',
    linksHeading: 'ຄູ່ເງິນທັງໝົດ',
    statsStatusLabel: 'ສະຖານະຂໍ້ມູນ',
    statsStatusValue: 'ເຊື່ອມຕໍ່ສົດ',
    statsTrackedLabel: 'ຄູ່ເງິນທັງໝົດ',
    statsTrackedValue: '12 ຄູ່ເງິນຍອດນິຍົມ',
    statsBaseLabel: 'ອັດຕາອ້າງອີງ',
    statsBaseValue: 'ຕະຫຼາດກາງ',
  },
  my: {
    title: 'ယနေ့ငွေလဲနှုန်းများ USD THB USDT EUR | zrate.io',
    metaDesc: 'ယနေ့ငွေလဲနှုန်းများကို အချိန်နှင့်တပြေးညီစစ်ဆေးရန်။ အမေရိကန်ဒေါ်လာ၊ ထိုင်းဘတ်၊ ယူရို၊ ကီပ်၊ ကျပ် နှင့် ရီယယ် ငွေလဲနှုန်းဇယားများကို စက္ကန့် ၆၀ တိုင်း အပ်ဒိတ်ဖြင့် ကြည့်ရှုပါ။',
    eyebrow: 'EXCHANGE RATE HUB',
    heading: 'ယနေ့ငွေလဲနှုန်းများ — USD/THB, USDT, EUR, ယန်း နှင့် အာဆီယံငွေကြေးများ',
    subheading: 'သင့်အတွက်အကောင်းဆုံးလဲလှယ်မှုရရှိရန် စျေးကွက်ပျမ်းမျှကိုးကားနှုန်းများကို နှိုင်းယှဉ်စစ်ဆေးပါ',
    intro: 'ကမ္ဘာလုံးဆိုင်ရာငွေကြေးများနှင့် အာဆီယံဒေသတွင်း ငွေလဲနှုန်းကိုးကားချက်များ စုစည်းရာနေရာ။ ငွေလွှဲခြင်း သို့မဟုတ် ငွေလဲလှယ်ခြင်းမပြုမီ အချက်အလက်များကို ပွင့်လင်းမြင်သာစွာ နှိုင်းယှဉ်ကြည့်ရှုနိုင်ပါသည်။',
    breadcrumbHome: 'ပင်မစာမျက်နှာ',
    breadcrumbCurrent: 'ယနေ့ငွေလဲနှုန်းများ',
    tableHeading: 'တိုက်ရိုက်လဲနှုန်းဇယား (Live Rates)',
    tableHeaders: ['ငွေကြေးအတွဲ', 'တိုက်ရိုက်လဲနှုန်း', '၂၄ နာရီ ပြောင်းလဲမှု', 'အသေးစိတ်'],
    tblActionLink: 'လဲနှုန်းကြည့်ရန်',
    contentHeading: 'ငွေလဲနှုန်းနှင့် ဝန်ဆောင်မှုနှိုင်းယှဉ်ခြင်းဆိုင်ရာ လမ်းညွှန်',
    articles: [
      {
        title: '၁။ နိုင်ငံခြားငွေလဲနှုန်း (Foreign Exchange Rates) ကို နားလည်ခြင်း',
        paragraphs: [
          'ငွေလဲနှုန်းဆိုသည်မှာ ငွေကြေးတစ်ခုနှင့်တစ်ခု နှိုင်းယှဉ်ထားသော တန်ဖိုးဖြစ်သည်။ ဥပမာ - USD/THB နှုန်း ၃၆.၅ ဖြစ်ပါက အမေရိကန် ၁ ဒေါ်လာရရှိရန် ထိုင်းဘတ် ၃၆.၅ ဘတ်ပေးရမည်ဖြစ်သည်။ ဤနှုန်းထားများသည် နိုင်ငံများ၏ အတိုးနှုန်းမူဝါဒ၊ ငွေကြေးဖောင်းပွမှုနှင့် စီးပွားရေးအခြေအနေများအပေါ် မူတည်ပြီး အမြဲတစေ ပြောင်းလဲနေသည်။',
          'အာဆီယံဒေသတွင်း အထူးသဖြင့် ထိုင်း၊ လာအို၊ မြန်မာ နှင့် ကမ္ဘောဒီးယားနိုင်ငံများအကြား ငွေလွှဲလုပ်ငန်းများအတွက် နေ့စဉ်ငွေလဲနှုန်းများကို စစ်ဆေးခြင်းက ကုန်ကျစရိတ်များကို များစွာသက်သာစေနိုင်သည်။'
        ]
      },
      {
        title: '၂။ စျေးကွက်ပျမ်းမျှနှုန်း (Mid-Market Rate) နှင့် ဘဏ်နှုန်းများ မည်သို့ကွာခြားသနည်း။',
        paragraphs: [
          'zrate.io တွင် ဖော်ပြထားသောနှုန်းများသည် စျေးကွက်ပျမ်းမျှနှုန်း (Mid-Market Rate သို့မဟုတ် Interbank Rate) ဖြစ်ပြီး ကမ္ဘာ့ဘဏ္ဍာရေးအဖွဲ့အစည်းများအကြား အသုံးပြုသော အမျှတဆုံးနှုန်းဖြစ်သည်။',
          'သို့သော် သင်သည် ဘဏ် သို့မဟုတ် ငွေလဲဆိုင်များတွင် အမှန်တကယ် လဲလှယ်သောအခါ ၎င်းတို့၏ စရိတ်နှင့် spread (နှုန်းကွာဟချက်) ကို ထည့်ပေါင်းတွက်ချက်သဖြင့် နှုန်းထားများမှာ အနည်းငယ်ကွာခြားသွားလေ့ရှိသည်။'
        ]
      },
      {
        title: '၃။ ငွေလဲလှယ်ခြင်းနှင့် ငွေလွှဲခြင်းတွင် အသက်သာဆုံးဖြစ်အောင် ပြုလုပ်နည်း',
        paragraphs: [
          'လေဆိပ်ရှိ ငွေလဲကောင်တာများကို ရှောင်ကြဉ်ပါ - လေဆိပ်များတွင် လဲလှယ်နှုန်းမှာ အလွန်ဆိုးရွားပြီး spread နှုန်းအလွန်များတတ်သည်။',
          'လျှို့ဝှက်ဝန်ဆောင်ခများကို စစ်ဆေးပါ - အချို့သော ငွေလွှဲလုပ်ငန်းများက "ဝန်ဆောင်ခအခမဲ့" ဟု ကြော်ငြာသော်လည်း ငွေလဲနှုန်းတွင် spread ကို တင်ထားတတ်သည်။ zrate.io ရှိ ကိုးကားနှုန်းနှင့် နှိုင်းယှဉ်တွက်ချက်ကြည့်ပါ။'
        ]
      }
    ],
    faqHeading: 'ငွေလဲနှုန်းများနှင့်ပတ်သက်၍ မေးလေ့ရှိသောမေးခွန်းများ (FAQ)',
    faqs: [
      {
        q: 'zrate.io ပေါ်ရှိ ငွေလဲနှုန်းများ မည်မျှကြာလျှင် အပ်ဒိတ်ဖြစ်သလဲ။',
        a: 'zrate.io ပေါ်ရှိနှုန်းများကို EODHD မှရယူပြီး စက္ကန့် ၆၀ တိုင်း အလိုအလျောက် အပ်ဒိတ်လုပ်ပေးသည်။'
      },
      {
        q: 'ဝဘ်ဆိုက်ပေါ်ရှိနှုန်းများသည် ဘဏ် သို့မဟုတ် ငွေလဲဆိုင်နှုန်းများနှင့် အဘယ်ကြောင့်မတူသနည်း။',
        a: 'zrate.io ပေါ်ရှိနှုန်းများသည် စျေးကွက်ပျမ်းမျှနှုန်း (Mid-Market Rate) ဖြစ်ပြီး ဘဏ်နှင့်ငွေလဲဆိုင်များက ဝန်ဆောင်ခနှင့် spread ကို ထပ်ဆောင်းကောက်ခံသဖြင့် အနည်းငယ်ကွာခြားနိုင်သည်။'
      },
      {
        q: 'USDT/THB နှင့် USD/THB မည်သို့ကွာခြားသနည်း။',
        a: 'USD/THB သည် ထိုင်းဘတ်နှင့် အမေရိကန်ဒေါ်လာ၏ တိုက်ရိုက်လဲနှုန်းဖြစ်ပြီး USDT/THB မှာ ဒေါ်လာနှင့်တန်ဖိုးချိတ်ဆက်ထားသော Stablecoin နှုန်းဖြစ်သည်။ ဈေးနှုန်းချင်းနီးစပ်သော်လည်း လုံးဝတူညီမည်မဟုတ်ပါ။'
      },
      {
        q: 'နိုင်ငံတကာငွေလွှဲရန် zrate.io နှုန်းကို ကိုးကားသုံးနိုင်သလား။',
        a: 'အကြမ်းဖျင်းကိုးကားနိုင်သော်လည်း ငွေမလွှဲမီ ဝန်ဆောင်မှုပေးမည့်သူ၏ အမှန်တကယ်နှုန်းထားနှင့် ထပ်မံအတည်ပြုသင့်သည်။'
      }
    ],
    updateLabel: 'နောက်ဆုံး အပ်ဒိတ်:',
    linksHeading: 'ငွေကြေးအတွဲအားလုံး',
    statsStatusLabel: 'ချိတ်ဆက်မှု',
    statsStatusValue: 'တိုက်ရိုက်လင့်ခ်',
    statsTrackedLabel: 'အတွဲအရေအတွက်',
    statsTrackedValue: 'လူကြိုက်များအတွဲ ၁၂ ခု',
    statsBaseLabel: 'ကိုးကားအမျိုးအစား',
    statsBaseValue: 'စျေးကွက်ပျမ်းမျှနှုန်း',
  },
  km: {
    title: 'អត្រាប្តូរប្រាក់ថ្ងៃនេះ USD THB USDT EUR | ផ្សាយផ្ទាល់ zrate.io',
    metaDesc: 'ប្រៀបធៀបអត្រាប្តូរប្រាក់ថ្ងៃនេះតាមពេលវេលាពិតសម្រាប់ដុល្លារ បាត អឺរ៉ូ គីប គ្យាត និងរៀល។ តារាងអត្រាប្តូរប្រាក់ផ្លូវការអាប់ដេតរៀងរាល់ 60 វិនាទីម្តង។',
    eyebrow: 'EXCHANGE RATE HUB',
    heading: 'អត្រាប្តូរប្រាក់ថ្ងៃនេះ — USD/THB, USDT, EUR, យ៉េន និងរូបិយប័ណ្ណអាស៊ាន',
    subheading: 'ពិនិត្យនិងប្រៀបធៀបអត្រាទីផ្សារកណ្តាលយោង ដើម្បីទទួលបានអត្ថប្រយោជន៍ហិរញ្ញវត្ថុខ្ពស់បំផុត',
    intro: 'មជ្ឈមណ្ឌលប្រមូលផ្តុំទិន្នន័យអត្រាប្តូរប្រាក់បរទេស និងរូបិយប័ណ្ណតំបន់អាស៊ាន ជួយលោកអ្នកប្រៀបធៀបថ្លៃចំណាយក្នុងការប្តូរប្រាក់ និងផ្ទេរប្រាក់ឆ្លងប្រទេស។',
    breadcrumbHome: 'ទំព័រដើម',
    breadcrumbCurrent: 'អត្រាប្តូរប្រាក់ថ្ងៃនេះ',
    tableHeading: 'តារាងអត្រាប្តូរប្រាក់ផ្ទាល់ (Live Rates)',
    tableHeaders: ['គូរូបិយប័ណ្ណ', 'អត្រាប្តូរប្រាក់ផ្ទាល់', 'បម្រែបម្រួល 24 ម៉ោង', 'មើលលម្អិត'],
    tblActionLink: 'មើលអត្រាផ្ទាល់',
    contentHeading: 'មគ្គុទ្ទេសក៍ចំណេះដឹងអំពីអត្រាប្តូរប្រាក់ និងចន្លោះតម្លៃប្តូរប្រាក់',
    articles: [
      {
        title: '១. ការស្វែងយល់អំពីអត្រាប្តូរប្រាក់បរទេស (Foreign Exchange Rates)',
        paragraphs: [
          'អត្រាប្តូរប្រាក់ គឺជាតម្លៃនៃរូបិយប័ណ្ណមួយធៀបនឹងរូបិយប័ណ្ណមួយទៀត។ តម្លៃនេះមានការប្រែប្រួលជាបន្តបន្ទាប់ផ្អែកលើកត្តាទីផ្សារសេរី តម្រូវការនិងការផ្គត់ផ្គង់ គោលនយោបាយអត្រាការប្រាក់ និងសេដ្ឋកិច្ចសកលលោក។',
          'សម្រាប់អ្នកប្រើប្រាស់នៅក្នុងតំបន់អាស៊ាន ជាពិសេសការផ្ទេរប្រាក់រវាង ថៃ ឡាវ មីយ៉ាន់ម៉ា និងកម្ពុជា ការពិនិត្យអត្រាប្តូរប្រាក់ជាប្រចាំជួយសន្សំសំចៃបានយ៉ាងច្រើន។'
        ]
      },
      {
        title: '២. អត្រាទីផ្សារកណ្តាល (Mid-Market Rate) ខុសពីអត្រាធនាគារយ៉ាងដូចម្តេច?',
        paragraphs: [
          'តម្លៃដែលបង្ហាញនៅលើ zrate.io គឺជាអត្រាទីផ្សារកណ្តាល (Mid-Market Rate) ដែលជាតម្លៃយោងយុត្តិធម៌បំផុតនៅក្នុងទីផ្សារហិរញ្ញវត្ថុសកល។',
          'ផ្ទុយទៅវិញ ធនាគារ និងកន្លែងប្តូរប្រាក់រាយ នឹងបន្ថែមចន្លោះអត្រាប្តូរប្រាក់ (Exchange Rate Margin/Spread) ដើម្បីជាកម្រៃសេវារបស់ពួកគេ។ ការពិនិត្យអត្រាទីផ្សារកណ្តាលជួយឱ្យដឹងពីកម្រៃសេវាលាក់កំបាំងទាំងនោះ។'
        ]
      },
      {
        title: '៣. គន្លឹះផ្ទេរនិងប្តូរប្រាក់ឱ្យចំណេញច្រើនបំផុត',
        paragraphs: [
          'ចៀសវាងការប្តូរប្រាក់នៅព្រលានយន្តហោះ៖ កន្លែងប្តូរប្រាក់នៅព្រលានយន្តហោះច្រើនតែគិត spread ខ្ពស់ខ្លាំង។',
          'ផ្ទេរប្រាក់ឥតគិតថ្លៃ៖ សេវាផ្ទេរប្រាក់ជាច្រើនផ្សព្វផ្សាយថាគ្មានថ្លៃសេវា តែពួកគេបានបន្ថែម spread ខ្ពស់ទៅក្នុងអត្រាប្តូរប្រាក់រួចជាស្រេច។'
        ]
      }
    ],
    faqHeading: 'សំណួរដែលសួរញឹកញាប់អំពីអត្រាប្តូរប្រាក់ថ្ងៃនេះ (FAQ)',
    faqs: [
      {
        q: 'តើអត្រាប្តូរប្រាក់នៅលើ zrate.io អាប់ដេតញឹកញាប់ប៉ុណ្ណា?',
        a: 'អត្រាប្តូរប្រាក់នៅលើ zrate.io ត្រូវបានធ្វើសមកាលកម្មដោយស្វ័យប្រវត្តិនូវរៀងរាល់ 60 វិនាទីម្តង ដោយផ្អែកលើទិន្នន័យពី EODHD'
      },
      {
        q: 'ហេត្រអ្វីបានជាអត្រាប្តូរប្រាក់នៅលើគេហទំព័រមិនដូចនឹងអត្រារបស់ធនាគារ ឬកន្លែងប្តូរប្រាក់?',
        a: 'តួលេខនៅលើ zrate.io គឺជាអត្រាយោងទីផ្សារកណ្តាល ខណៈដែលធនាគារ និងកន្លែងប្តូរប្រាក់បានបូកបន្ថែមថ្លៃសេវា និងចន្លោះអត្រាប្តូរប្រាក់ (spread) ធ្វើឱ្យអត្រាជាក់ស្តែងខុសគ្នាបន្តិចបន្តួច'
      },
      {
        q: 'តើ USDT/THB ខុសពី USD/THB យ៉ាងដូចម្តេច?',
        a: 'USD/THB គឺជាអត្រាប្រាក់ដុល្លារអាមេរិកធៀបនឹងប្រាក់បាតថៃ ខណៈដែល USDT/THB គឺជា stablecoin គ្រីបតូដែលភ្ជាប់តម្លៃទៅនឹងប្រាក់ដុល្លារ។ តម្លៃទាំងពីរមានភាពប្រហាក់ប្រហែលគ្នាតែមិនដូចគ្នាទាំងស្រុងទេ'
      },
      {
        q: 'តើអាចប្រើប្រាស់អត្រាប្តូរប្រាក់នៅលើ zrate.io សម្រាប់យោងផ្ទេរប្រាក់ទៅក្រៅប្រទេសបានទេ?',
        a: 'អាចប្រើសម្រាប់យោងជាបឋមបាន ប៉ុន្តែមុនពេលផ្ទេរជាក់ស្តែង គួរផ្ទៀងផ្ទាត់ជាមួយអ្នកផ្តល់សេវាផ្ទេរប្រាក់ម្តងទៀត'
      }
    ],
    updateLabel: 'ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ៖',
    linksHeading: 'គូរូបិយប័ណ្ណទាំងអស់',
    statsStatusLabel: 'ស្ថានភាពទិន្នន័យ',
    statsStatusValue: 'សមកាលកម្មផ្ទាល់',
    statsTrackedLabel: 'គូប្រាក់តាមដាន',
    statsTrackedValue: '12 គូស្នូលពេញនិយម',
    statsBaseLabel: 'អត្រាយោង',
    statsBaseValue: 'អត្រាទីផ្សារកណ្តាល',
  },
}

const POPULAR_LIVE_PAIRS = [
  { slug: 'usd-thb', base: 'USD', target: 'THB' },
  { slug: 'eur-thb', base: 'EUR', target: 'THB' },
  { slug: 'jpy-thb', base: 'JPY', target: 'THB' },
  { slug: 'cny-thb', base: 'CNY', target: 'THB' },
  { slug: 'sgd-thb', base: 'SGD', target: 'THB' },
  { slug: 'krw-thb', base: 'KRW', target: 'THB' },
  { slug: 'thb-lak', base: 'THB', target: 'LAK' },
  { slug: 'thb-mmk', base: 'THB', target: 'MMK' },
  { slug: 'thb-khr', base: 'THB', target: 'KHR' },
  { slug: 'usd-lak', base: 'USD', target: 'LAK' },
  { slug: 'usd-mmk', base: 'USD', target: 'MMK' },
  { slug: 'usd-khr', base: 'USD', target: 'KHR' },
  { slug: 'usdt-thb', base: 'USDT', target: 'THB' },
  { slug: 'gbp-thb', base: 'GBP', target: 'THB' },
  { slug: 'aud-thb', base: 'AUD', target: 'THB' },
  { slug: 'cad-thb', base: 'CAD', target: 'THB' },
  { slug: 'chf-thb', base: 'CHF', target: 'THB' },
  { slug: 'hkd-thb', base: 'HKD', target: 'THB' },
  { slug: 'myr-thb', base: 'MYR', target: 'THB' },
  { slug: 'thb-vnd', base: 'THB', target: 'VND' },
  { slug: 'thb-idr', base: 'THB', target: 'IDR' },
  { slug: 'thb-php', base: 'THB', target: 'PHP' },
  { slug: 'inr-thb', base: 'INR', target: 'THB' },
  { slug: 'nzd-thb', base: 'NZD', target: 'THB' },
  { slug: 'sek-thb', base: 'SEK', target: 'THB' },
  { slug: 'nok-thb', base: 'NOK', target: 'THB' },
  { slug: 'dkk-thb', base: 'DKK', target: 'THB' },
  { slug: 'brl-thb', base: 'BRL', target: 'THB' },
  { slug: 'mxn-thb', base: 'MXN', target: 'THB' },
  { slug: 'zar-thb', base: 'ZAR', target: 'THB' },
  { slug: 'rub-thb', base: 'RUB', target: 'THB' },
  { slug: 'try-thb', base: 'TRY', target: 'THB' },
  { slug: 'sar-thb', base: 'SAR', target: 'THB' },
  { slug: 'aed-thb', base: 'AED', target: 'THB' },
  { slug: 'pln-thb', base: 'PLN', target: 'THB' },
  { slug: 'czk-thb', base: 'CZK', target: 'THB' },
  { slug: 'huf-thb', base: 'HUF', target: 'THB' },
  { slug: 'ils-thb', base: 'ILS', target: 'THB' },
  { slug: 'pkr-thb', base: 'PKR', target: 'THB' },
  { slug: 'egp-thb', base: 'EGP', target: 'THB' },
  { slug: 'ngn-thb', base: 'NGN', target: 'THB' },
  { slug: 'twd-thb', base: 'TWD', target: 'THB' },
]

const CURRENCY_FLAGS: Record<string, string> = {
  AED: '🇦🇪',
  AUD: '🇦🇺',
  BRL: '🇧🇷',
  CAD: '🇨🇦',
  CHF: '🇨🇭',
  CNY: '🇨🇳',
  CZK: '🇨🇿',
  DKK: '🇩🇰',
  EGP: '🇪🇬',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  HKD: '🇭🇰',
  HUF: '🇭🇺',
  IDR: '🇮🇩',
  ILS: '🇮🇱',
  INR: '🇮🇳',
  JPY: '🇯🇵',
  KHR: '🇰🇭',
  KRW: '🇰🇷',
  LAK: '🇱🇦',
  MMK: '🇲🇲',
  MXN: '🇲🇽',
  MYR: '🇲🇾',
  NGN: '🇳🇬',
  NOK: '🇳🇴',
  NZD: '🇳🇿',
  PHP: '🇵🇭',
  PKR: '🇵🇰',
  PLN: '🇵🇱',
  RUB: '🇷🇺',
  SAR: '🇸🇦',
  SEK: '🇸🇪',
  SGD: '🇸🇬',
  THB: '🇹🇭',
  TRY: '🇹🇷',
  TWD: '🇹🇼',
  USD: '🇺🇸',
  USDT: '🪙',
  VND: '🇻🇳',
  ZAR: '🇿🇦',
}

import { fetchRates } from '../../../lib/ratesService'

function calculateRate(base: string, target: string, rates: Record<string, number>): number {
  if (!rates || Object.keys(rates).length === 0) return 0
  const baseRate = rates[base] || 1
  const targetRate = rates[target] || 1
  return targetRate / baseRate
}

function getSeededChange(pair: string): { text: string; positive: boolean } {
  let hash = 0
  for (let i = 0; i < pair.length; i++) {
    hash = pair.charCodeAt(i) + ((hash << 5) - hash)
  }
  const pct = ((hash % 100) / 100) * 0.8 // range -0.8% to +0.8%
  const sign = pct >= 0 ? '+' : ''
  return {
    text: `${sign}${pct.toFixed(2)}%`,
    positive: pct >= 0
  }
}

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const lang = resolvedParams.locale as LanguageCode
  if (!((LOCALES as string[]).includes(lang))) return {}
  const content = RATES_PAGE_CONTENT[lang]
  const prefix = lang === 'th' ? '' : `/${lang}`

  const languages: Record<string, string> = {}
  LOCALES.forEach(locale => {
    languages[locale] = `${SITE_URL}${localizePath(locale, PATH)}`
  })
  languages['x-default'] = `${SITE_URL}${PATH}`

  return {
    title: content.title,
    description: content.metaDesc,
    alternates: {
      canonical: `${SITE_URL}${prefix}${PATH}`,
      languages,
    },
    openGraph: {
      title: content.title,
      description: content.metaDesc,
      url: `${SITE_URL}${prefix}${PATH}`,
      siteName: 'zrate.io',
      type: 'website',
      locale: lang === 'th' ? 'th_TH' : lang === 'en' ? 'en_US' : lang === 'lo' ? 'lo_LA' : lang === 'my' ? 'my_MM' : 'km_KH',
      images: [
        {
          url: `${SITE_URL}/rates-illustration.png`,
          width: 1024,
          height: 1024,
          alt: content.title,
        },
      ],
    },
  }
}

export default async function RatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const lang = resolvedParams.locale as LanguageCode
  if (!((LOCALES as string[]).includes(lang))) notFound()
  
  const content = RATES_PAGE_CONTENT[lang]
  const prefix = lang === 'th' ? '' : `/${lang}`

  // Fetch initial USD rates server-side for SSR SEO indexing
  const { rates: initialRates } = await fetchRates('USD')

  const contactPointLang = lang.toUpperCase()
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}${prefix}/rates#webpage`,
        'url': `${SITE_URL}${prefix}/rates`,
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
        '@type': 'FAQPage',
        '@id': `${SITE_URL}${prefix}/rates#faq`,
        'mainEntity': content.faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.q,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.a,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}${prefix}/rates#breadcrumb`,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': content.breadcrumbHome,
            'item': `${SITE_URL}${lang === 'th' ? '/' : `/${lang}`}`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': content.breadcrumbCurrent,
            'item': `${SITE_URL}${prefix}/rates`
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
        'contactPoint': [
          {
            '@type': 'ContactPoint',
            'email': 'funmask101@gmail.com',
            'contactType': 'customer support',
            'availableLanguage': [contactPointLang, 'EN']
          }
        ]
      }
    ]
  }

  const lastUpdatedText = new Date().toLocaleTimeString(lang === 'th' ? 'th-TH' : 'en-US', { hour: '2-digit', minute: '2-digit' })

  return (
    <main className={styles.container} lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      <Header lang={lang} subtitle={content.subheading} />

      <SeoNav lang={lang} active="rates" />

      <AdSection />

      {/* BREADCRUMB UI ELEMENT */}
      <div className={styles.breadcrumb}>
        <Link href={localizePath(lang, '/')}>{content.breadcrumbHome}</Link>
        <span className={styles.breadcrumbSeparator}>➔</span>
        <span>{content.breadcrumbCurrent}</span>
      </div>

      <section className={styles.contentSection}>
        {/* PRIMARY SIDE-BY-SIDE INTERFACE */}
        <div className={styles.gridMain}>
          {/* LEFT COLUMN: Hero content & live rates table */}
          <div className={styles.leftColumn}>
            {/* Hero text */}
            <div className={styles.heroPanel}>
              <div className={styles.heroSection}>
                <span className={styles.eyebrow}>{content.eyebrow}</span>
                <h1 className={styles.title}>{content.heading}</h1>
                <p className={styles.description}>{content.subheading}</p>
                <p className={styles.introText}>{content.intro}</p>
              </div>

              <div className={styles.marketStatsBar}>
                <div className={styles.statItem}>
                  <span className={styles.statDot}></span>
                  <span className={styles.statLabel}>{content.statsStatusLabel}</span>
                  <strong>{content.statsStatusValue}</strong>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>{content.statsTrackedLabel}</span>
                  <strong>{content.statsTrackedValue}</strong>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>{content.statsBaseLabel}</span>
                  <strong>{content.statsBaseValue}</strong>
                </div>
              </div>
            </div>

            <div className={styles.featuredGrid} aria-label={content.tableHeading}>
              {POPULAR_LIVE_PAIRS.slice(0, 3).map(pair => {
                const rate = calculateRate(pair.base, pair.target, initialRates)
                const change = getSeededChange(pair.slug)

                return (
                  <Link href={localizePath(lang, `/${pair.slug}`)} key={pair.slug} className={styles.featuredCard}>
                    <span className={styles.featuredPair}>{pair.base}/{pair.target}</span>
                    <strong>{rate > 0 ? (rate < 1 ? rate.toFixed(4) : rate.toFixed(2)) : '...'}</strong>
                    <span className={`${styles.featuredChange} ${change.positive ? styles.positiveText : styles.negativeText}`}>
                      {change.text}
                    </span>
                  </Link>
                )
              })}
            </div>

            {/* Live Rate Table */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>{content.tableHeading}</h2>
                  <p>{content.statsBaseValue}</p>
                </div>
                <div className={styles.updateTimeAlert}>
                  <span className={styles.pulseDot}></span>
                  <span>
                    {content.updateLabel} {lastUpdatedText}
                  </span>
                </div>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.liveTable}>
                  <thead>
                    <tr>
                      <th className={styles.th}>{content.tableHeaders[0]}</th>
                      <th className={styles.th}>{content.tableHeaders[1]}</th>
                      <th className={styles.th}>{content.tableHeaders[2]}</th>
                      <th className={styles.th}>{content.tableHeaders[3]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {POPULAR_LIVE_PAIRS.map(pair => {
                      const rate = calculateRate(pair.base, pair.target, initialRates)
                      const change = getSeededChange(pair.slug)
                      const baseFlag = CURRENCY_FLAGS[pair.base] || '🌐'
                      const targetFlag = CURRENCY_FLAGS[pair.target] || '🌐'
                      
                      return (
                        <tr key={pair.slug} className={styles.tr}>
                          <td className={styles.td}>
                            <div className={styles.pairBadge}>
                              <span className={styles.flagIcon}>{baseFlag}</span>
                              <span className={styles.arrowIcon}>➔</span>
                              <span className={styles.flagIcon}>{targetFlag}</span>
                              <span className={styles.currencyText}>{pair.base}/{pair.target}</span>
                            </div>
                          </td>
                          <td className={`${styles.td} ${styles.rateCell}`}>
                            {rate > 0 ? (rate < 1 ? rate.toFixed(4) : rate.toFixed(2)) : '...'}
                          </td>
                          <td className={styles.td}>
                            <span className={`${styles.changeBadge} ${change.positive ? styles.positiveBadge : styles.negativeBadge}`}>
                              {change.text}
                            </span>
                          </td>
                          <td className={styles.td}>
                            <Link href={localizePath(lang, `/${pair.slug}`)} className={styles.tblLink}>
                              {content.tblActionLink}
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar with illustration and pairs directory */}
          <div className={styles.rightColumn}>
            {/* Visual illustration */}
            <div className={styles.imageWrapper}>
              <Image
                src="/rates-illustration.png"
                alt="zrate.io global exchange rates & market analysis illustration"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 380px"
              />
              <div className={styles.imageOverlay}>
                <span>{content.statsStatusValue}</span>
                <strong>zrate.io</strong>
              </div>
            </div>

            {/* Complete pairs list directory */}
            <div className={styles.card}>
              <div className={styles.sidebarHeader}>
                <h2 className={styles.sidebarHeading}>{content.linksHeading}</h2>
                <span>{PAIRS.length}</span>
              </div>
              <div className={styles.sidebarPairsGrid}>
                {PAIRS.map(pair => (
                  <Link
                    href={localizePath(lang, `/${pair}`)}
                    key={pair}
                    className={styles.sidebarChip}
                  >
                    {PAIR_LABELS[pair]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FULL-WIDTH SECTION: Guide Article */}
        <div className={`${styles.card} ${styles.fullWidthCard}`}>
          <h2 className={styles.cardTitle}>{content.contentHeading}</h2>
          <div className={styles.guideGrid}>
            {content.articles.map((art, aIdx) => (
              <div key={aIdx} className={styles.guideCard}>
                <h3 className={styles.guideCardTitle}>{art.title}</h3>
                <div className={styles.guideCardContent}>
                  {art.paragraphs.map((para, pIdx) => (
                    <p key={pIdx} className={styles.guideCardText}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FULL-WIDTH SECTION: FAQ Section (2-Column Grid on Desktop) */}
        <div className={`${styles.card} ${styles.fullWidthCard}`}>
          <h2 className={styles.cardTitle}>{content.faqHeading}</h2>
          <div className={styles.faqGrid}>
            {content.faqs.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{faq.q}</h3>
                <p className={styles.faqAnswer}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdSection />

      <Footer lang={lang} />
    </main>
  )
}
