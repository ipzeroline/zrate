'use client'

import styles from './page.module.css'

interface AseanDashboardProps {
  lang: string
}

const DASHBOARD_TEXTS: Record<string, {
  title: string
  subtitle: string
  interestLabel: string
  inflationLabel: string
  bankLabel: string
  thailand: string
  laos: string
  myanmar: string
  cambodia: string
  statusLabel: string
  hawk: string
  stable: string
  dove: string
}> = {
  th: {
    title: 'แดชบอร์ดธนาคารกลางอาเซียน (Macro Indicators)',
    subtitle: 'ข้อมูลสถิติทางการเงิน อัตราดอกเบี้ยนโยบาย และอัตราเงินเฟ้ออ้างอิงรายประเทศกลุ่มแม่น้ำโขง',
    interestLabel: 'ดอกเบี้ยนโยบาย',
    inflationLabel: 'อัตราเงินเฟ้อ',
    bankLabel: 'ธนาคารกลาง',
    thailand: 'ประเทศไทย',
    laos: 'ประเทศลาว',
    myanmar: 'ประเทศเมียนมา',
    cambodia: 'ประเทศกัมพูชา',
    statusLabel: 'แนวโน้มนโยบาย',
    hawk: 'คุมเข้มการเงิน (Hawkish)',
    stable: 'คงที่ / ทรงตัว (Stable)',
    dove: 'ผ่อนคลายการเงิน (Dovish)'
  },
  en: {
    title: 'ASEAN Central Bank Dashboard',
    subtitle: 'Key policy interest rates and inflation rate benchmarks for Mekong region nations.',
    interestLabel: 'Policy Rate',
    inflationLabel: 'Inflation Rate',
    bankLabel: 'Central Bank',
    thailand: 'Thailand',
    laos: 'Laos',
    myanmar: 'Myanmar',
    cambodia: 'Cambodia',
    statusLabel: 'Policy Stance',
    hawk: 'Hawkish Stance',
    stable: 'Stable / Neutral',
    dove: 'Dovish Stance'
  },
  lo: {
    title: 'ແດຊບອດທະນາຄານກາງອາຊຽນ',
    subtitle: 'ຂໍ້ມູນສະຖິຕິທາງການເງິນ ອັດຕາດອກເບ້ຍນະໂຍບາຍ ແລະ ອັດຕາເງິນເຟີ້ອ້າງອີງ',
    interestLabel: 'ດອກເບ້ຍນະໂຍບາຍ',
    inflationLabel: 'ອັດຕາເງິນເຟີ້',
    bankLabel: 'ທະນາຄານກາງ',
    thailand: 'ປະເທດໄທ',
    laos: 'ປະເທດລາວ',
    myanmar: 'ປະເທດມຽນມາ',
    cambodia: 'ປະເທດກຳປູເຈຍ',
    statusLabel: 'ແນວໂນ້ມນະໂຍບາຍ',
    hawk: 'ເຂັ້ມງວດການເງິນ (Hawkish)',
    stable: 'ຄົງທີ່ / ຊົງຕົວ (Stable)',
    dove: 'ຜ່ອນຄາຍການເງິນ (Dovish)'
  },
  my: {
    title: 'အာဆီယံ ဗဟိုဘဏ် ဒက်ရှ်ဘုတ်',
    subtitle: 'မဲခေါင်ဒေသနိုင်ငံများ၏ ဗဟိုဘဏ် အတိုးနှုန်းနှင့် ငွေကြေးဖောင်းပွမှု ညွှန်းကိန်းများ',
    interestLabel: 'မူဝါဒအတိုးနှုန်း',
    inflationLabel: 'ငွေကြေးဖောင်းပွမှုနှုန်း',
    bankLabel: 'ဗဟိုဘဏ်',
    thailand: 'ထိုင်းနိုင်ငံ',
    laos: 'လာအိုနိုင်ငံ',
    myanmar: 'မြန်မာနိုင်ငံ',
    cambodia: 'ကမ္ဘောဒီးယားနိုင်ငံ',
    statusLabel: 'မူဝါဒလမ်းကြောင်း',
    hawk: 'တင်းကျပ်သော မူဝါဒ (Hawkish)',
    stable: 'တည်ငြိမ်ဆဲ (Stable)',
    dove: 'ဖြေလျှော့သော မူဝါဒ (Dovish)'
  },
  km: {
    title: 'ផ្ទាំងព័ត៌មានធនាគារកណ្តាលអាស៊ាន',
    subtitle: 'អត្រាការប្រាក់គោលនយោបាយ និងសូចនាករអតិផរណាយោងសម្រាប់បណ្តាប្រទេសក្នុងតំបន់មេគង្គ',
    interestLabel: 'អត្រាការប្រាក់គោល',
    inflationLabel: 'អត្រាអតិផរណា',
    bankLabel: 'ធនាគារកណ្តាល',
    thailand: 'ប្រទេសថៃ',
    laos: 'ប្រទេសឡាវ',
    myanmar: 'ប្រទេសមីយ៉ាន់ម៉ា',
    cambodia: 'ប្រទេសកម្ពុជា',
    statusLabel: 'គោលនយោបាយ',
    hawk: 'រឹតបន្តឹងហិរញ្ញវត្ថុ (Hawkish)',
    stable: 'ស្ថេរភាព (Stable)',
    dove: 'ធូររលុងហិរញ្ញវត្ថុ (Dovish)'
  }
}

interface BankData {
  countryKey: 'thailand' | 'laos' | 'myanmar' | 'cambodia'
  flag: string
  bankName: string
  interestRate: string
  inflationRate: string
  stance: 'hawk' | 'stable' | 'dove'
}

const CENTRAL_BANKS: BankData[] = [
  {
    countryKey: 'thailand',
    flag: '🇹🇭',
    bankName: 'Bank of Thailand (BOT)',
    interestRate: '2.50%',
    inflationRate: '0.78%',
    stance: 'stable'
  },
  {
    countryKey: 'laos',
    flag: '🇱🇦',
    bankName: 'Bank of the Lao PDR (BOL)',
    interestRate: '10.00%',
    inflationRate: '25.80%',
    stance: 'hawk'
  },
  {
    countryKey: 'myanmar',
    flag: '🇲🇲',
    bankName: 'Central Bank of Myanmar (CBM)',
    interestRate: '7.00%',
    inflationRate: '28.50%',
    stance: 'hawk'
  },
  {
    countryKey: 'cambodia',
    flag: '🇰🇭',
    bankName: 'National Bank of Cambodia (NBC)',
    interestRate: '3.75%',
    inflationRate: '1.20%',
    stance: 'stable'
  }
]

export function AseanDashboard({ lang }: AseanDashboardProps) {
  const t = DASHBOARD_TEXTS[lang] || DASHBOARD_TEXTS.th

  return (
    <section 
      style={{
        margin: '24px 0',
        border: '1px solid var(--border, rgba(148, 163, 184, 0.15))',
        background: 'var(--bg-surface, #f8fafc)',
        borderRadius: '12px',
        padding: '24px'
      }}
      aria-labelledby="asean-db-heading"
    >
      <div style={{ marginBottom: '20px' }}>
        <h2 id="asean-db-heading" style={{ fontSize: '1.32rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--ink)' }}>
          {t.title}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)', margin: 0 }}>
          {t.subtitle}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {CENTRAL_BANKS.map((bank) => {
          const stanceText = bank.stance === 'hawk' ? t.hawk : bank.stance === 'dove' ? t.dove : t.stable
          const stanceColor = bank.stance === 'hawk' ? '#ef4444' : bank.stance === 'dove' ? '#10b981' : '#f59e0b'
          
          return (
            <div 
              key={bank.countryKey}
              style={{
                background: 'var(--bg-elevated, #ffffff)',
                border: '1px solid var(--border, rgba(148, 163, 184, 0.12))',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{bank.flag}</span>
                <div>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
                    {t[bank.countryKey]}
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--ink-dim)' }}>
                    {bank.bankName}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                borderTop: '1px solid var(--border, rgba(148, 163, 184, 0.08))',
                borderBottom: '1px solid var(--border, rgba(148, 163, 184, 0.08))',
                padding: '8px 0'
              }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--ink-dim)' }}>
                    {t.interestLabel}
                  </span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--ink)', fontWeight: 700 }}>
                    {bank.interestRate}
                  </strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--ink-dim)' }}>
                    {t.inflationLabel}
                  </span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--ink)', fontWeight: 700 }}>
                    {bank.inflationRate}
                  </strong>
                </div>
              </div>

              {/* Policy Stance Stance indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--ink-dim)' }}>{t.statusLabel}:</span>
                <span style={{ 
                  color: stanceColor, 
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: stanceColor,
                    display: 'inline-block'
                  }} />
                  {stanceText}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
