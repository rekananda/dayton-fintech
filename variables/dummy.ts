import { RippleCardT } from "@/components/Molecules/Cards/RippleCard";
import { PropsTimelineCardT } from "@/components/Molecules/Cards/TimelineCard";

export const listMenus = [
  { label: 'Home', href: 'home' },
  { label: 'Explanation', href: 'explanation' },
  { label: 'Profit Sharing', href: 'profit-sharing' },
  { label: 'Daftar', href: 'daftar' },
  { label: 'Assets', href: 'assets' },
  { label: 'Q&A', href: 'qna' },
];

export const listTimeline: PropsTimelineCardT[] = [
  {
    icon: 'CandlestickChartOutlined',
    title: 'Arah Dulu, Entry Kemudian',
    description: 'Sistem hanya masuk pasar saat arah pergerakan jelas dan terkonfirmasi, menghindari kondisi yang bising.',
  },
  {
    icon: 'TrackChangesOutlined',
    title: 'Target yang Elastis',
    description: 'Target keuntungan menyesuaikan dinamika volatilitas sehingga tetap relevan di berbagai kondisi pasar.',
  },
  {
    icon: 'CrisisAlertOutlined',
    title: 'Hindari Momen Rawan',
    description: 'Pembukaan posisi ditahan saat periode rilis data ekonomi berdampak tinggi untuk meminimalkan lonjakan spread/slippage.',
  },
  {
    icon: 'ShowChartOutlined',
    title: 'Paparan Terkendali',
    description: 'Jumlah posisi dan batas risiko harian dikontrol agar eksposur tidak berlebihan.',
  }
];

export const listRippleCard: RippleCardT[] = [
  {
    title: 'Profit Sharing 25%',
    description: 'Setiap akhir pekan, total profit bersih akun dihitung. Anda membayar 25% dari profit kepada Dayton Fintech. Jika tidak profit, tidak ada tagihan.',
    tags: ['MINGGUAN'],
    ripple: ['bottom-left'],
  },
  {
    title: 'Referral / Team',
    description: 'Setiap akhir pekan, total profit bersih akun dihitung. Anda membayar 25% dari profit kepada Dayton Fintech. Jika tidak profit, tidak ada tagihan.',
    tags: ['HINGGA 10%'],
    ripple: ['top-right'],
  },
];