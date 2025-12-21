import { AccordionItemT } from "@/components/Atoms/Accordion/type";
import { RippleCardT } from "@/components/Molecules/Cards/RippleCard/type";
import { TimelineCardT } from "@/components/Molecules/Cards/TimelineCard/type";

export const listMenus = [
  { label: 'Home', href: 'home' },
  { label: 'Explanation', href: 'explanation' },
  { label: 'Profit Sharing', href: 'profit-sharing' },
  { label: 'Daftar', href: 'daftar' },
  { label: 'Assets', href: 'assets' },
  { label: 'Q&A', href: 'qna' },
];

export const listTimeline: TimelineCardT[] = [
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

export const listQnA: AccordionItemT[] = [
  {
    value: 'qna-1',
    title: 'Bagaimana cara penagihan dilakukan?',
    content: 'Setiap akhir pekan, total profit bersih akun dihitung. Anda membayar 25% dari profit kepada Dayton Fintech. Jika tidak profit, tidak ada tagihan.',
  },
  {
    value: 'qna-2',
    title: 'Apakah punya batas maksimum account?',
    content: 'Tidak ada batas maksimum account. Anda dapat membuat account sebanyak yang Anda inginkan.',
  },
  {
    value: 'qna-3',
    title: 'Apakah ada rekomendasi minimum balance?',
    content: 'Tidak ada rekomendasi minimum balance. Anda dapat memulai trading dengan modal yang Anda inginkan.',
  },
  {
    value: 'qna-4',
    title: 'Apakah ada perbedaan jenis account?',
    content: 'Tidak ada perbedaan jenis account. Anda dapat memilih jenis account yang Anda inginkan.',
  },
  {
    value: 'qna-5',
    title: 'Broker apakah ditentukan?',
    content: 'Broker ditentukan oleh Dayton Fintech. Anda dapat memilih broker yang Anda inginkan.',
  },
];

export const listLegal: TimelineCardT[] = [
  {
    numberedIcon: 1,
    title: 'Terms & Conditions',
    description: 'Penggunaan layanan Dayton Fintech berarti Anda memahami bahwa trading memiliki risiko tinggi. Tidak ada jaminan profit. Anda setuju untuk bertanggung jawab penuh atas keputusan dan modal Anda. Pelanggaran terhadap ketentuan (fraud/abuse) dapat mengakibatkan penghentian layanan dan/atau komisi.',
  },
  {
    numberedIcon: 2,
    title: 'Privacy Policy',
    description: 'Kami hanya mengumpulkan data yang Anda berikan secara sukarela untuk keperluan onboarding, operasional profit sharing, dan dukungan layanan. Data tidak dijual ke pihak ketiga. Untuk akses/koreksi/penghapusan data, hubungi admin@daytonfintech.co.id.',
  },
];
