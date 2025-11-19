import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Seed only when explicitly intended (e.g., in staging CI)
const isStaging = process.env.STAGING === "true";
const prisma = new PrismaClient();

async function seedMenus() {
  const count = await prisma.menu.count();
  if (count > 0) return;
  await prisma.menu.createMany({
    data: [
      { label: "Home", href: "home", order: 1 },
      { label: "Explanation", href: "explanation", order: 2 },
      { label: "Profit Sharing", href: "profit-sharing", order: 3 },
      { label: "Events", href: "events", order: 4 },
      { label: "Legal", href: "legal", order: 5 },
      { label: "Q&A", href: "qna", order: 6 },
      { label: "Daftar", href: "register", order: 7 },
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
      },
      {
        icon: "TrackChangesOutlined",
        title: "Target yang Elastis",
        description:
          "Target keuntungan menyesuaikan dinamika volatilitas sehingga tetap relevan di berbagai kondisi pasar.",
        color: "primary",
        order: 2,
      },
      {
        icon: "CrisisAlertOutlined",
        title: "Hindari Momen Rawan",
        description:
          "Pembukaan posisi ditahan saat periode rilis data ekonomi berdampak tinggi untuk meminimalkan lonjakan spread/slippage.",
        color: "primary",
        order: 3,
      },
      {
        icon: "ShowChartOutlined",
        title: "Paparan Terkendali",
        description:
          "Jumlah posisi dan batas risiko harian dikontrol agar eksposur tidak berlebihan.",
        color: "primary",
        order: 4,
      },
    ],
  });
}

async function seedBusinessModels() {
  const count = await prisma.businessModel.count();
  if (count > 0) return;

  // 1) Profit Sharing
  const bm1 = await prisma.businessModel.create({
    data: {
      title: "Profit Sharing",
      description:
        "Setiap akhir pekan, total profit bersih akun dihitung. Anda membayar 25% dari profit kepada Dayton Fintech. Jika tidak profit, tidak ada tagihan.",
      tags: ["MINGGUAN"],
      order: 1,
      tnc: null,
    },
  });
  const table1 = await prisma.businessModelTable.create({
    data: {
      businessModelId: bm1.id,
      name: "Profit Sharing",
      order: 1,
    },
  });
  const [cProfit, cCalc] = await prisma.$transaction([
    prisma.businessModelTableColumn.create({
      data: { tableId: table1.id, key: "profit", label: "Profit minggu ini", order: 1 },
    }),
    prisma.businessModelTableColumn.create({
      data: { tableId: table1.id, key: "calculation", label: "Perhitungan", order: 2 },
    }),
  ]);
  // rows
  const row1 = await prisma.businessModelTableRow.create({
    data: { tableId: table1.id, order: 1 },
  });
  await prisma.businessModelTableCell.createMany({
    data: [
      { rowId: row1.id, columnId: cProfit.id, value: "$200" },
      { rowId: row1.id, columnId: cCalc.id, value: "Member $150 • Dayton $50" },
    ],
  });
  const row2 = await prisma.businessModelTableRow.create({
    data: { tableId: table1.id, order: 2 },
  });
  await prisma.businessModelTableCell.createMany({
    data: [
      { rowId: row2.id, columnId: cProfit.id, value: "$0" },
      { rowId: row2.id, columnId: cCalc.id, value: "Tidak ada penagihan" },
    ],
  });

  // 2) Referral/Team
  const bm2 = await prisma.businessModel.create({
    data: {
      title: "Referral/Team",
      description:
        "Setiap akhir pekan, total profit bersih akun dihitung. Anda membayar 25% dari profit kepada Dayton Fintech. Jika tidak profit, tidak ada tagihan.",
      tags: ["HINGGA 10%"],
      order: 2,
      tnc:
        "Komisi dibayarkan mingguan bersamaan siklus profit sharing. Contoh: Downline Level 1 membayar $100 → Anda menerima $5.",
    },
  });
  const table2 = await prisma.businessModelTable.create({
    data: {
      businessModelId: bm2.id,
      name: "Referral/Team",
      order: 1,
    },
  });
  const [cLevel, cCommission] = await prisma.$transaction([
    prisma.businessModelTableColumn.create({
      data: { tableId: table2.id, key: "level", label: "Level", order: 1 },
    }),
    prisma.businessModelTableColumn.create({
      data: { tableId: table2.id, key: "commission", label: "Komisi", order: 2 },
    }),
  ]);
  const r1 = await prisma.businessModelTableRow.create({
    data: { tableId: table2.id, order: 1 },
  });
  await prisma.businessModelTableCell.createMany({
    data: [
      { rowId: r1.id, columnId: cLevel.id, value: "1" },
      { rowId: r1.id, columnId: cCommission.id, value: "5%" },
    ],
  });
  const r2 = await prisma.businessModelTableRow.create({
    data: { tableId: table2.id, order: 2 },
  });
  await prisma.businessModelTableCell.createMany({
    data: [
      { rowId: r2.id, columnId: cLevel.id, value: "2" },
      { rowId: r2.id, columnId: cCommission.id, value: "10%" },
    ],
  });
  const r3 = await prisma.businessModelTableRow.create({
    data: { tableId: table2.id, order: 3 },
  });
  await prisma.businessModelTableCell.createMany({
    data: [
      { rowId: r3.id, columnId: cLevel.id, value: "3" },
      { rowId: r3.id, columnId: cCommission.id, value: "15%" },
    ],
  });
}

async function seedEvents() {
  const count = await prisma.event.count();
  if (count > 0) return;
  await prisma.event.createMany({
    data: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop",
        dateText: "15 Maret 2024",
        title: "Workshop Trading Emas untuk Pemula",
        description:
          "Pelajari dasar-dasar trading emas dengan pendekatan yang disiplin dan terukur. Workshop ini akan membahas strategi trend-following, manajemen risiko, dan cara membaca chart dengan benar.",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop",
        dateText: "22 Maret 2024",
        title: "Seminar Advanced Trading Strategies",
        description:
          "Tingkatkan skill trading Anda dengan strategi lanjutan. Seminar ini cocok untuk trader yang sudah memiliki pengalaman dan ingin mengoptimalkan performa trading mereka.",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=600&fit=crop",
        dateText: "5 April 2024",
        title: "Webinar Risk Management & Psychology",
        description:
          "Pahami pentingnya manajemen risiko dan psikologi trading. Webinar ini akan membantu Anda mengendalikan emosi dan membuat keputusan trading yang lebih baik.",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&h=600&fit=crop",
        dateText: "12 April 2024",
        title: "Live Trading Session dengan Expert",
        description:
          "Ikuti sesi live trading langsung dengan expert trader kami. Pelajari bagaimana cara menganalisis pasar real-time dan mengambil keputusan trading yang tepat.",
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
      },
      {
        title: "Privacy Policy",
        description:
          "Kami hanya mengumpulkan data yang Anda berikan secara sukarela untuk keperluan onboarding, operasional profit sharing, dan dukungan layanan. Data tidak dijual ke pihak ketiga. Untuk akses/koreksi/penghapusan data, hubungi hello@daytonfintech.com.",
        order: 2,
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
  // Create default admin only if no user exists (idempotent, runs once)
  const userCount = await prisma.user.count();
  if (userCount > 0) return;
  // Default credential: admin / admin (bcrypt hashed)
  const passwordHash = await bcrypt.hash("admin", 10);
  await prisma.user.create({
    data: {
      email: "admin@daytonfintech.com",
      name: "Admin",
      passwordHash,
      role: "ADMIN",
    },
  });
}
// WhatsApp number, email, etc.
async function seedConfig() {
  const count = await prisma.config.count();
  if (count > 0) return;
  await prisma.config.createMany({
    data: [
      {
        key: "whatsapp_number",
        value: "6281234567890",
        description: "WhatsApp number for contact",
      },
      {
        key: "email",
        value: "admin@daytonfintech.com",
        description: "Email for contact",
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


