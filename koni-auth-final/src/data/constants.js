export const COLORS = {
  merah: "#CC0000",
  putih: "#FFFFFF",
  gold: "#B8960C",
  goldLight: "#D4AF37",
  navy: "#0A1628",
  navyMid: "#132040",
  navyLight: "#1E3A5F",
  gray: "#F5F5F0",
  textMuted: "#6B7280",
  border: "rgba(184,150,12,0.25)",
  primary: "#CC0000",
  text: "#0A1628",
  textSecondary: "#6B7280",
  success: "#22C55E",
  error: "#EF4444",
  gradient: "linear-gradient(160deg, #0A1628 0%, #132040 55%, #1E3A5F 100%)",
  dark10: "rgba(255,255,255,0.04)",
  dark20: "rgba(255,255,255,0.08)",
};

export const navItems = [
  { label: "Beranda", href: "#beranda" },
  { label: "Profil", href: "#profil" },
  { label: "Cabang Olahraga", href: "#cabor" },
  { label: "Atlet", href: "#atlet" },
  { label: "Berita", href: "#berita" },
  { label: "Kontak", href: "#kontak" },
];

export const caborData = [
  { nama: "Atletik", icon: "🏃", medali: 12, atlet: 45 },
  { nama: "Renang", icon: "🏊", medali: 18, atlet: 38 },
  { nama: "Bulutangkis", icon: "🏸", medali: 24, atlet: 52 },
  { nama: "Angkat Besi", icon: "🏋️", medali: 9, atlet: 28 },
  { nama: "Pencak Silat", icon: "🥋", medali: 15, atlet: 60 },
  { nama: "Panahan", icon: "🏹", medali: 7, atlet: 22 },
  { nama: "Sepak Bola", icon: "⚽", medali: 2, atlet: 110 },
  { nama: "Voli", icon: "🏐", medali: 4, atlet: 48 },
];

export const beritaData = [
  {
    tanggal: "10 Mei 2026",
    judul: "Tim Indonesia Raih 5 Medali Emas di SEA Games 2026",
    kategori: "Prestasi",
    img: "🏅",
    deskripsi:
      "Kontingen Indonesia berhasil mengukir prestasi gemilang dengan meraih lima medali emas pada hari ketiga SEA Games 2026 di Singapura.",
  },
  {
    tanggal: "7 Mei 2026",
    judul: "KONI Luncurkan Program Pembinaan Atlet Muda 2026",
    kategori: "Program",
    img: "🎯",
    deskripsi:
      "KONI Pusat resmi meluncurkan program nasional pembinaan atlet muda berusia 14–21 tahun untuk mempersiapkan generasi emas Indonesia.",
  },
  {
    tanggal: "2 Mei 2026",
    judul: "Kongres Nasional KONI: Evaluasi dan Strategi 2026–2030",
    kategori: "Organisasi",
    img: "📋",
    deskripsi:
      "Kongres Nasional KONI yang dihadiri 34 KONI Provinsi menetapkan strategi pembinaan olahraga nasional untuk lima tahun ke depan.",
  },
];

export const statsData = [
  { angka: "67", satuan: "Cabang Olahraga", icon: "🏆" },
  { angka: "4.200+", satuan: "Atlet Nasional", icon: "🤸" },
  { angka: "34", satuan: "KONI Provinsi", icon: "🗺️" },
  { angka: "500+", satuan: "Medali Internasional", icon: "🥇" },
];

export const pimpinanData = [
  { nama: "Letjen TNI (Purn) Marciano Norman", jabatan: "Ketua Umum", periode: "2019–2027" },
  { nama: "Sekjen KONI Pusat", jabatan: "Sekretaris Jenderal", periode: "2019–2027" },
  { nama: "Bendahara KONI Pusat", jabatan: "Bendahara Umum", periode: "2019–2027" },
];

export const atletData = [
  {
    nama: "Kevin Sanjaya Sukamuljo",
    cabor: "Bulutangkis",
    icon: "🏸",
    prestasi: "Juara Dunia Ganda Putra",
    medali: 24,
    asal: "Manado, Sulut",
    tahun: "2017–Sekarang",
    ranking: "#1 Dunia",
    warna: "#CC0000",
  },
  {
    nama: "Greysia Polii",
    cabor: "Bulutangkis",
    icon: "🏸",
    prestasi: "Medali Emas Olimpiade Tokyo",
    medali: 18,
    asal: "Jakarta",
    tahun: "2004–2022",
    ranking: "Legenda",
    warna: "#B8960C",
  },
  {
    nama: "Eko Yuli Irawan",
    cabor: "Angkat Besi",
    icon: "🏋️",
    prestasi: "4x Medali Olimpiade",
    medali: 16,
    asal: "Metro, Lampung",
    tahun: "2008–Sekarang",
    ranking: "Terbaik Asia",
    warna: "#1E3A5F",
  },
  {
    nama: "Sriyati",
    cabor: "Pencak Silat",
    icon: "🥋",
    prestasi: "5x Emas SEA Games",
    medali: 20,
    asal: "Jawa Tengah",
    tahun: "2015–Sekarang",
    ranking: "#1 Asia Tenggara",
    warna: "#6B21A8",
  },
  {
    nama: "Rifda Irfanaluthfi",
    cabor: "Atletik",
    icon: "🏃",
    prestasi: "Rekor Nasional Lompat Jauh",
    medali: 8,
    asal: "Palembang, Sumsel",
    tahun: "2018–Sekarang",
    ranking: "Top 10 Asia",
    warna: "#0D6B3F",
  },
  {
    nama: "Aflah Fadlan",
    cabor: "Panahan",
    icon: "🏹",
    prestasi: "Emas Asian Games",
    medali: 11,
    asal: "Bandung, Jabar",
    tahun: "2018–Sekarang",
    ranking: "#3 Dunia",
    warna: "#B45309",
  },
];

export const timelineData = [
  {
    tahun: "1946",
    judul: "Berdirinya KONI",
    desc: "Komite Olahraga Nasional Indonesia resmi berdiri, menjadi induk organisasi olahraga nasional yang menaungi seluruh cabang olahraga Indonesia.",
    icon: "🏛️",
  },
  {
    tahun: "1952",
    judul: "Olimpiade Helsinki",
    desc: "Indonesia pertama kali berpartisipasi di Olimpiade, mengirimkan atlet terbaik ke panggung olahraga dunia.",
    icon: "🌐",
  },
  {
    tahun: "1962",
    judul: "Asian Games Jakarta",
    desc: "Indonesia menjadi tuan rumah Asian Games IV, membuktikan kemampuan menyelenggarakan ajang olahraga internasional skala besar.",
    icon: "🏟️",
  },
  {
    tahun: "1992",
    judul: "Emas Olimpiade Pertama",
    desc: "Susi Susanti dan Alan Budi Kusuma meraih medali emas Olimpiade Barcelona, emas pertama Indonesia di Olimpiade.",
    icon: "🥇",
  },
  {
    tahun: "2018",
    judul: "Asian Games Jakarta-Palembang",
    desc: "Indonesia sukses menjadi tuan rumah Asian Games XVIII dengan perolehan medali terbanyak sepanjang sejarah.",
    icon: "🎖️",
  },
  {
    tahun: "2026",
    judul: "Generasi Emas 2045",
    desc: "KONI meluncurkan program besar pembinaan atlet muda menuju Indonesia Emas 2045 dengan target prestasi olimpiade.",
    icon: "🚀",
  },
];

export const galeriData = [
  {
    judul: "Upacara Pembukaan SEA Games 2026",
    kategori: "SEA Games",
    lokasi: "Singapura",
    emoji: "🎆",
    bg: "linear-gradient(135deg, #0A1628, #1E3A5F)",
  },
  {
    judul: "Bulutangkis Final Beregu Putra",
    kategori: "Kompetisi",
    lokasi: "Istora Senayan",
    emoji: "🏸",
    bg: "linear-gradient(135deg, #7C0000, #CC0000)",
  },
  {
    judul: "Atlet Angkat Besi Nasional",
    kategori: "Training",
    lokasi: "Pusat Pelatihan Jakarta",
    emoji: "🏋️",
    bg: "linear-gradient(135deg, #1a1a2e, #16213e)",
  },
  {
    judul: "Podium Medali Asian Games",
    kategori: "Prestasi",
    lokasi: "Jakarta",
    emoji: "🥇",
    bg: "linear-gradient(135deg, #78350F, #B45309)",
  },
  {
    judul: "Pencak Silat Kejuaraan Dunia",
    kategori: "Kejuaraan Dunia",
    lokasi: "Jakarta Convention Center",
    emoji: "🥋",
    bg: "linear-gradient(135deg, #3B0764, #6B21A8)",
  },
  {
    judul: "Pelari Nasional Sprint 100m",
    kategori: "Atletik",
    lokasi: "Stadion Utama GBK",
    emoji: "🏃",
    bg: "linear-gradient(135deg, #064E3B, #0D6B3F)",
  },
];
