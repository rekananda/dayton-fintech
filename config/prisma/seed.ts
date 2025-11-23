import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma";

const isStaging = process.env.STAGING === "true";

async function seedMenus() {
  const count = await prisma.menu.count();
  if (count > 0) return;
  await prisma.menu.createMany({
    data: [
      { label: "Home", href: "home", order: 1, createdBy: "admin", updatedBy: "admin"},
      { label: "Explanation", href: "explanation", order: 2, createdBy: "admin", updatedBy: "admin"},
      { label: "Profit Sharing", href: "profit-sharing", order: 3, createdBy: "admin", updatedBy: "admin"},
      { label: "Events", href: "events", order: 4, createdBy: "admin", updatedBy: "admin"},
      { label: "Legal", href: "legal", order: 5, createdBy: "admin", updatedBy: "admin"},
      { label: "Q&A", href: "qna", order: 6, createdBy: "admin", updatedBy: "admin"},
      { label: "Daftar", href: "register", order: 7, createdBy: "admin", updatedBy: "admin"},
    ],
  });
}

async function seedTimelines() {
  const count = await prisma.timeline.count();
  if (count > 0) return;
  await prisma.timeline.createMany({
    data: [
      {
        icon: "CandlestickChartOutlined",
        title: "Arah Dulu, Entry Kemudian",
        description:
          "Sistem hanya masuk pasar saat arah pergerakan jelas dan terkonfirmasi, menghindari kondisi yang bising.",
        color: "primary",
        order: 1,
        createdBy: "admin",
        updatedBy: "admin",
      },
      {
        icon: "TrackChangesOutlined",
        title: "Target yang Elastis",
        description:
          "Target keuntungan menyesuaikan dinamika volatilitas sehingga tetap relevan di berbagai kondisi pasar.",
        color: "primary",
        order: 2,
        createdBy: "admin",
        updatedBy: "admin",
      },
      {
        icon: "CrisisAlertOutlined",
        title: "Hindari Momen Rawan",
        description:
          "Pembukaan posisi ditahan saat periode rilis data ekonomi berdampak tinggi untuk meminimalkan lonjakan spread/slippage.",
        color: "primary",
        order: 3,
        createdBy: "admin",
        updatedBy: "admin",
      },
      {
        icon: "ShowChartOutlined",
        title: "Paparan Terkendali",
        description:
          "Jumlah posisi dan batas risiko harian dikontrol agar eksposur tidak berlebihan.",
        color: "primary",
        order: 4,
        createdBy: "admin",
        updatedBy: "admin",
      },
    ],
  });
}

async function seedBusinessModels() {
  const count = await prisma.businessModel.count();
  if (count > 0) return;
  const bm1 = await prisma.businessModel.create({
    data: {
      title: "Profit Sharing",
      description:
        "Setiap akhir pekan, total profit bersih akun dihitung. Anda membayar 25% dari profit kepada Dayton Fintech. Jika tidak profit, tidak ada tagihan.",
      tags: ["MINGGUAN"],
      order: 1,
      tnc: null,
      createdBy: "admin",
      updatedBy: "admin",
    },
  });
  const table1 = await prisma.businessModelTable.create({
    data: {
      businessModelId: bm1.id,
      name: "Profit Sharing",
      order: 1,
      createdBy: "admin",
      updatedBy: "admin",
    },
  });
  const [cProfit, cCalc] = await prisma.$transaction([
    prisma.businessModelTableColumn.create({
      data: { tableId: table1.id, key: "profit", label: "Profit minggu ini", order: 1, createdBy: "admin", updatedBy: "admin" },
    }),
    prisma.businessModelTableColumn.create({
      data: { tableId: table1.id, key: "calculation", label: "Perhitungan", order: 2, createdBy: "admin", updatedBy: "admin" },
    }),
  ]);
  const row1 = await prisma.businessModelTableRow.create({
    data: { tableId: table1.id, order: 1, createdBy: "admin", updatedBy: "admin" },
  });
  await prisma.businessModelTableCell.createMany({
    data: [
      { rowId: row1.id, columnId: cProfit.id, value: "$200", createdBy: "admin", updatedBy: "admin" },
      { rowId: row1.id, columnId: cCalc.id, value: "Member $150 • Dayton $50", createdBy: "admin", updatedBy: "admin" },
    ],
  });
  const row2 = await prisma.businessModelTableRow.create({
    data: { tableId: table1.id, order: 2, createdBy: "admin", updatedBy: "admin" },
  });
  await prisma.businessModelTableCell.createMany({
    data: [
      { rowId: row2.id, columnId: cProfit.id, value: "$0", createdBy: "admin", updatedBy: "admin" },
      { rowId: row2.id, columnId: cCalc.id, value: "Tidak ada penagihan", createdBy: "admin", updatedBy: "admin" },
    ],
  });

  const bm2 = await prisma.businessModel.create({
    data: {
      title: "Referral/Team",
      description:
        "Setiap akhir pekan, total profit bersih akun dihitung. Anda membayar 25% dari profit kepada Dayton Fintech. Jika tidak profit, tidak ada tagihan.",
      tags: ["HINGGA 10%"],
      order: 2,
      tnc:
        "Komisi dibayarkan mingguan bersamaan siklus profit sharing. Contoh: Downline Level 1 membayar $100 → Anda menerima $5.",
      createdBy: "admin",
      updatedBy: "admin",
    },
  });
  const table2 = await prisma.businessModelTable.create({
    data: {
      businessModelId: bm2.id,
      name: "Referral/Team",
      order: 1,
      createdBy: "admin",
      updatedBy: "admin",
    },
  });
  const [cLevel, cCommission] = await prisma.$transaction([
    prisma.businessModelTableColumn.create({
      data: { tableId: table2.id, key: "level", label: "Level", order: 1, createdBy: "admin", updatedBy: "admin" },
    }),
    prisma.businessModelTableColumn.create({
      data: { tableId: table2.id, key: "commission", label: "Komisi", order: 2, createdBy: "admin", updatedBy: "admin" },
    }),
  ]);
  const r1 = await prisma.businessModelTableRow.create({
    data: { tableId: table2.id, order: 1, createdBy: "admin", updatedBy: "admin" },
  });
  await prisma.businessModelTableCell.createMany({
    data: [
      { rowId: r1.id, columnId: cLevel.id, value: "Level 1", createdBy: "admin", updatedBy: "admin" },
      { rowId: r1.id, columnId: cCommission.id, value: "5%", createdBy: "admin", updatedBy: "admin" },
    ],
  });
  const r2 = await prisma.businessModelTableRow.create({
    data: { tableId: table2.id, order: 2, createdBy: "admin", updatedBy: "admin" },
  });
  await prisma.businessModelTableCell.createMany({
    data: [
      { rowId: r2.id, columnId: cLevel.id, value: "Level 2", createdBy: "admin", updatedBy: "admin" },
      { rowId: r2.id, columnId: cCommission.id, value: "10%", createdBy: "admin", updatedBy: "admin" },
    ],
  });
  const r3 = await prisma.businessModelTableRow.create({
    data: { tableId: table2.id, order: 3, createdBy: "admin", updatedBy: "admin" },
  });
  await prisma.businessModelTableCell.createMany({
    data: [
      { rowId: r3.id, columnId: cLevel.id, value: "Level 3", createdBy: "admin", updatedBy: "admin" },
      { rowId: r3.id, columnId: cCommission.id, value: "15%", createdBy: "admin", updatedBy: "admin" },
    ],
  });
}

async function seedEvents() {
  const count = await prisma.event.count();
  if (count > 0) return;
  const now = new Date();
  const futureDate1 = new Date(now);
  futureDate1.setDate(now.getDate() + 30); // 30 hari dari sekarang
  futureDate1.setHours(14, 0, 0, 0);
  
  const futureDate2 = new Date(now);
  futureDate2.setDate(now.getDate() + 37); // 37 hari dari sekarang
  futureDate2.setHours(14, 0, 0, 0);
  
  const futureDate3 = new Date(now);
  futureDate3.setDate(now.getDate() + 45); // 45 hari dari sekarang
  futureDate3.setHours(14, 0, 0, 0);
  
  const futureDate4 = new Date(now);
  futureDate4.setDate(now.getDate() + 52); // 52 hari dari sekarang
  futureDate4.setHours(14, 0, 0, 0);
  
  await prisma.event.createMany({
    data: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop",
        date: futureDate1,
        title: "Workshop Trading Emas untuk Pemula",
        description:
          "Pelajari dasar-dasar trading emas dengan pendekatan yang disiplin dan terukur. Workshop ini akan membahas strategi trend-following, manajemen risiko, dan cara membaca chart dengan benar.",
        createdBy: "admin",
        updatedBy: "admin",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop",
        date: futureDate2,
        title: "Seminar Advanced Trading Strategies",
        description:
          "Tingkatkan skill trading Anda dengan strategi lanjutan. Seminar ini cocok untuk trader yang sudah memiliki pengalaman dan ingin mengoptimalkan performa trading mereka.",
        createdBy: "admin",
        updatedBy: "admin",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=600&fit=crop",
        date: futureDate3,
        title: "Webinar Risk Management & Psychology",
        description:
          "Pahami pentingnya manajemen risiko dan psikologi trading. Webinar ini akan membantu Anda mengendalikan emosi dan membuat keputusan trading yang lebih baik.",
        createdBy: "admin",
        updatedBy: "admin",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&h=600&fit=crop",
        date: futureDate4,
        title: "Live Trading Session dengan Expert",
        description:
          "Ikuti sesi live trading langsung dengan expert trader kami. Pelajari bagaimana cara menganalisis pasar real-time dan mengambil keputusan trading yang tepat.",
        createdBy: "admin",
        updatedBy: "admin",
      },
    ],
  });
}

async function seedLegal() {
  const count = await prisma.legal.count();
  if (count > 0) return;
  await prisma.legal.createMany({
    data: [
      {
        title: "Terms & Conditions",
        description:
          "Penggunaan layanan Dayton Fintech berarti Anda memahami bahwa trading memiliki risiko tinggi. Tidak ada jaminan profit. Anda setuju untuk bertanggung jawab penuh atas keputusan dan modal Anda. Pelanggaran terhadap ketentuan (fraud/abuse) dapat mengakibatkan penghentian layanan dan/atau komisi.",
        order: 1,
        createdBy: "admin",
        updatedBy: "admin",
      },
      {
        title: "Privacy Policy",
        description:
          "Kami hanya mengumpulkan data yang Anda berikan secara sukarela untuk keperluan onboarding, operasional profit sharing, dan dukungan layanan. Data tidak dijual ke pihak ketiga. Untuk akses/koreksi/penghapusan data, hubungi hello@daytonfintech.com.",
        order: 2,
        createdBy: "admin",
        updatedBy: "admin",
      },
    ],
  });
}

async function seedQnA() {
  const count = await prisma.qnA.count();
  if (count > 0) return;
  await prisma.qnA.createMany({
    data: [
      {
        question: "Bagaimana cara penagihan dilakukan?",
        answer:
          "Setiap akhir pekan, total profit bersih akun dihitung. Anda membayar 25% dari profit kepada Dayton Fintech. Jika tidak profit, tidak ada tagihan.",
        order: 1,
      },
      {
        question: "Apakah punya batas maksimum account?",
        answer:
          "Tidak ada batas maksimum account. Anda dapat membuat account sebanyak yang Anda inginkan.",
        order: 2,
      },
      {
        question: "Apakah ada rekomendasi minimum balance?",
        answer:
          "Tidak ada rekomendasi minimum balance. Anda dapat memulai trading dengan modal yang Anda inginkan.",
        order: 3,
      },
      {
        question: "Apakah ada perbedaan jenis account?",
        answer: "Tidak ada perbedaan jenis account. Anda dapat memilih jenis account yang Anda inginkan.",
        order: 4,
      },
      {
        question: "Broker apakah ditentukan?",
        answer:
          "Broker ditentukan oleh Dayton Fintech. Anda dapat memilih broker yang Anda inginkan.",
        order: 5,
      },
    ],
  });
}

async function seedDefaultAdmin() {
  const userCount = await prisma.user.count();
  if (userCount > 0) return;
  const passwordHash = await bcrypt.hash("admin", 10);
  await prisma.user.create({
    data: {
      email: "admin@daytonfintech.com",
      username: "admin",
      name: "Admin",
      passwordHash,
      role: "ADMIN",
    },
  });
}

async function seedConfig() {
  const count = await prisma.config.count();
  if (count > 0) return;
  await prisma.config.createMany({
    data: [
      {
        key: "whatsapp_number",
        value: "6281234567890",
        description: "WhatsApp number for contact",
        createdBy: "admin",
        updatedBy: "admin",
      },
      {
        key: "email",
        value: "admin@daytonfintech.com",
        description: "Email for contact",
        createdBy: "admin",
        updatedBy: "admin",
      },
      {
        key: "main-title",
        value: "Trading Emas Otomatis, Aman dan Terukur",
        description: "Kalimat utama untuk landing page",
        createdBy: "admin",
        updatedBy: "admin",
      },
      {
        key: "main-description",
        value: "Pendekatan trend-following yang disiplin dengan target adaptif mengikuti volatilitas, pengendalian eksposur, serta jeda otomatis saat rilis data berdampak tinggi.",
        description: "Deskripsi utama untuk landing page",
        createdBy: "admin",
        updatedBy: "admin",
      },
      {
        key: "main-badges",
        value: JSON.stringify(["Gold • XAUUSD • H1 • Tren"]),
        description: "Badges utama untuk landing page",
        createdBy: "admin",
        updatedBy: "admin",
      },
      {
        key: "secondary-badges",
        value: JSON.stringify(["Profit Sharing <b>25%</b>", "Referral hingga <b>10%</b>", "<b>Broker MT4 • H1</b>"]),
        description: "Badges sekunder untuk landing page",
        createdBy: "admin",
        updatedBy: "admin",
      },
    ],
  });
}

async function main() {
  if (!isStaging) {
    console.log("Seed skipped (STAGING env not true).");
    return;
  }
  await seedMenus();
  await seedTimelines();
  await seedBusinessModels();
  await seedEvents();
  await seedLegal();
  await seedQnA();
  await seedDefaultAdmin();
  await seedConfig();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

