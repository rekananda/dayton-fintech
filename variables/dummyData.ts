import { NavbarButtonItemT, NavbarButtonSubItemT } from "@/components/Atoms/Button/NavbarButton/type";
import { BussinessModelDataT, EventDataT, LegalDataT, MenuDataT, QnADataT, TimelineDataT } from "@/config/types";

export const mainWhatsappNumber = '6282111009000';
export const mainWhatsappMessage = encodeURIComponent('Halo, saya ingin bertanya tentang layanan Dayton Fintech.');
export const mainWhatsappLink = `https://api.whatsapp.com/send?phone=${mainWhatsappNumber}&text=${mainWhatsappMessage}`;
export const mainEmail = 'admin@daytonfintech.co.id';
export const mainTitle = 'Trading Emas Otomatis, Aman dan Dinamis';
export const mainDescription = "Nevada Fintech Sniper Strategy adalah pendekatan trading berbasis presisi yang mengutamakan akurasi, disiplin, dan manajemen risiko.\n\nDikembangkan dengan mindset sniper, strategi ini fokus pada entry berkualitas tinggi, eksekusi terukur, dan perlindungan dari volatilitas pasar, bukan over-trading atau spekulasi berlebihan.\n\nDirancang untuk trader yang menginginkan konsistensi jangka panjang, bukan sekadar hasil sesaat.";
export const mainBadges = ["Gold • XAUUSD • H1 • MT4"];
export const secondaryBadges = ["Profit Sharing <b>25%</b>","Referral hingga <b>15%</b>","<b>Broker MT4 • H1</b>"];

export const DataMenus: MenuDataT[] = [
  { id: 1, label: 'Home', href: 'home', order: 1 },
  { id: 2, label: 'Explanation', href: 'explanation', order: 2 },
  { id: 3, label: 'Profit Sharing', href: 'profit-sharing', order: 3 },
  { id: 4, label: 'Events', href: 'events', order: 4 },
  { id: 5, label: 'Legal', href: 'legal', order: 5 },
  { id: 6, label: 'Q&A', href: 'qna', order: 6 },
  { id: 7, label: 'Daftar', href: 'register', order: 7 },
];

export const DataTimeline: TimelineDataT[] = [
  { 
    id: 1, 
    icon: 'CandlestickChartOutlined', 
    title: 'Arah Dulu, Entry Kemudian', 
    description: 'Sistem hanya masuk pasar saat arah pergerakan jelas dan terkonfirmasi, menghindari kondisi yang bising.', 
    color: 'primary', 
    order: 1 
  },
  { 
    id: 2, 
    icon: 'TrackChangesOutlined', 
    title: 'Target yang Fleksibel', 
    description: 'Target keuntungan menyesuaikan dinamika volatilitas sehingga tetap relevan di berbagai kondisi pasar trading.', 
    color: 'primary', 
    order: 2 
  },
  { 
    id: 3, 
    icon: 'CrisisAlertOutlined', 
    title: 'Risiko Terkontrol', 
    description: 'Jumlah posisi dan batas risiko harian dikontrol agar eksposur tidak berlebihan.', 
    color: 'primary', 
    order: 3 
  },
  { 
    id: 4, 
    icon: 'ShowChartOutlined', 
    title: 'Hindari Zona Risiko', 
    description: 'Pembukaan posisi ditahan saat periode rilis data ekonomi berdampak tinggi untuk meminimalkan lonjakan spread/slippage.', 
    color: 'primary', 
    order: 4 
  },
];

export const DataBussinessModel: BussinessModelDataT[] = [
  { 
    id: 1, 
    title: 'Profit Sharing', 
    description: 'Setiap akhir pekan, total profit bersih akun dihitung. Anda membayar 25% dari profit kepada Dayton Fintech. Jika tidak profit, maka tidak ada bill.', 
    tags: ['MINGGUAN'], 
    order: 1, 
    tables: [{
      columns: [
        { key: 'profit', label: 'Profit minggu ini' },
        { key: 'calculation', label: 'Perhitungan' },
      ],
      datas: [
        { id: 1, profit: '$200', calculation: 'Member $150 • Dayton $50', order: 1 },
        { id: 2, profit: '$0', calculation: 'Tidak ada penagihan', order: 2 },
      ],
    }] 
  },
  { 
    id: 2, 
    title: 'Referral/Team', 
    description: 'Setiap akhir pekan, total profit bersih akun dihitung. Anda membayar 25% dari profit kepada Dayton Fintech. Jika tidak profit, maka tidak ada bill.', 
    tags: ['HINGGA 10%'], 
    order: 2, 
    tables: [{
      columns: [
        { key: 'level', label: 'Level' },
        { key: 'commission', label: 'Komisi' },
      ],
      datas: [
        { id: 1, level: '1', commission: '5%', order: 1 },
        { id: 2, level: '2', commission: '10%', order: 2 },
        { id: 3, level: '3', commission: '15%', order: 3 },
      ],
    }],
    tnc: 'Komisi dibayarkan mingguan bersamaan siklus profit sharing. Contoh: Downline Level 1 membayar $100 → Anda menerima $5.',
  },
];

export const DataEvents: EventDataT[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
    meetingLink: 'https://meet.google.com/abc123',
    location: 'Jakarta',
    date: new Date('2024-03-15').toISOString(),
    title: 'Workshop Trading Emas untuk Pemula',
    description: 'Pelajari dasar-dasar trading emas dengan pendekatan yang disiplin dan terukur. Workshop ini akan membahas strategi trend-following, manajemen risiko, dan cara membaca chart dengan benar.',  
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop',
    date: new Date('2024-03-22').toISOString(),
    meetingLink: 'https://meet.google.com/abc123',
    location: 'Jakarta',
    title: 'Seminar Advanced Trading Strategies',
    description: 'Tingkatkan skill trading Anda dengan strategi lanjutan. Seminar ini cocok untuk trader yang sudah memiliki pengalaman dan ingin mengoptimalkan performa trading mereka.',
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=600&fit=crop',
    date: new Date('2024-04-05').toISOString(),
    meetingLink: 'https://meet.google.com/abc123',
    location: 'Jakarta',
    title: 'Webinar Risk Management & Psychology',
    description: 'Pahami pentingnya manajemen risiko dan psikologi trading. Webinar ini akan membantu Anda mengendalikan emosi dan membuat keputusan trading yang lebih baik.',
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&h=600&fit=crop',
    meetingLink: 'https://meet.google.com/abc123',
    location: 'Jakarta',
    date: new Date('2024-04-12').toISOString(),
    title: 'Live Trading Session dengan Expert',
    description: 'Ikuti sesi live trading langsung dengan expert trader kami. Pelajari bagaimana cara menganalisis pasar real-time dan mengambil keputusan trading yang tepat.',
  }
];

export const DataLegal: LegalDataT[] = [
  {
    id: 1,
    title: 'Terms & Conditions',
    description: 'Penggunaan layanan Dayton Fintech berarti Anda memahami bahwa trading memiliki risiko tinggi. Tidak ada jaminan profit. Anda setuju untuk bertanggung jawab penuh atas keputusan dan modal Anda. Pelanggaran terhadap ketentuan (fraud/abuse) dapat mengakibatkan penghentian layanan dan/atau komisi.',
    order: 1
  },
  {
    id: 2,
    title: 'Privacy Policy',
    description: 'Kami hanya mengumpulkan data yang Anda berikan secara sukarela untuk keperluan onboarding, operasional profit sharing, dan dukungan layanan. Data tidak dijual ke pihak ketiga. Untuk akses/koreksi/penghapusan data, hubungi admin@daytonfintech.co.id.',
    order: 2
  },
];

export const DataQnA: QnADataT[] = [
  {
    id: 1,
    question: 'Bagaimana cara penagihan dilakukan?',
    answer: 'Setiap akhir pekan, total profit bersih akun dihitung. Anda membayar 25% dari profit kepada Dayton Fintech. Jika tidak profit, tidak ada tagihan.',
    order: 1
  },
  {
    id: 2,
    question: 'Apakah punya batas maksimum account?',
    answer: 'Tidak ada batas maksimum account. Anda dapat membuat account sebanyak yang Anda inginkan.',
    order: 2
  },
  {
    id: 3,
    question: 'Apakah ada rekomendasi minimum balance?',
    answer: 'Tidak ada rekomendasi minimum balance. Anda dapat memulai trading dengan modal yang Anda inginkan.',
    order: 3
  },
  {
    id: 4,
    question: 'Apakah ada perbedaan jenis account?',
    answer: 'Tidak ada perbedaan jenis account. Anda dapat memilih jenis account yang Anda inginkan.',
    order: 4
  },
  {
    id: 5,
    question: 'Broker apakah ditentukan?',
    answer: 'Broker ditentukan oleh Dayton Fintech. Anda dapat memilih broker yang Anda inginkan.',
    order: 5
  },
];

export const backofficeMenuItems: NavbarButtonItemT[] = [
  {
    icon: "IconCategory",
    label: "Menu",
    href: "/backoffice/menus",
  },
  {
    icon: "IconSettings",
    label: "Configuration",
    href: "/backoffice/configs",
  },
  {
    icon: "IconSchema",
    label: "Schema",
    href: "/backoffice/schemas",
  },
  {
    icon: "IconPerspective",
    label: "Business Model",
    href: "/backoffice/business-models",
  },
  {
    icon: "ImageAspectRatio",
    label: "Event",
    href: "/backoffice/events",
  },
  {
    icon: "IconRosetteDiscountCheck",
    label: "Legal",
    href: "/backoffice/legals",
  },
  {
    icon: "IconMessageCircleUser",
    label: "FAQ",
    href: "/backoffice/faqs",
  },
];

const flattenMenuItems = (items: NavbarButtonItemT[], level: number = 0): NavbarButtonSubItemT[] => {
  const result: NavbarButtonSubItemT[] = [];
  
  items.forEach((item) => {
    const subItem: NavbarButtonSubItemT = {
      icon: item.icon,
      label: item.label,
      href: item.href,
      subLevel: level,
    };
    result.push(subItem);

    if (item.subs && item.subs.length > 0) {
      result.push(...flattenMenuItems(item.subs, level + 1));
    }
  });
  
  return result;
};

export const backofficeMenuSubItems: NavbarButtonSubItemT[] = flattenMenuItems(backofficeMenuItems);