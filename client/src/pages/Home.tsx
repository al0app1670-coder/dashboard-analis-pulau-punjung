import React, { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardPenLine,
  Database,
  Download,
  FilePlus2,
  FileText,
  Filter,
  KeyRound,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Plus,
  Pencil,
  Printer,
  Search,
  ShieldCheck,
  ShoppingBag,
  Target,
  Trash2,
  TrendingUp,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

// --- TYPES ---
export type UserRoleType = "SUPER_USER" | "USER_CABANG" | "USER_CAPEM";

export type UserAccount = {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: UserRoleType;
  branchId: string;
};

export type Branch = {
  id: string;
  name: string;
  code: string;
  type: "Cabang Utama" | "Cabang Pembantu";
};

export type Analyst = {
  id: string;
  name: string;
  initials: string;
  role: string;
  branchId: string;
  color: string;
};

export type ApplicationDetails = {
  applicantName: string;
  address: string;
  businessType: string;
  requestAmount: string;
  applicationDate: string;
  creditCategory: "Komersil" | "Konsumtif";
  usageType: "Modal Kerja" | "Investasi";
  productType: string;
};

export type ActivityItem = {
  id: number;
  title: string;
  analyst: string;
  branchId: string;
  type: "dpk" | "npl" | "kredit";
  amount: string;
  status: string;
  time: string;
  tone: string;
  month?: string;
  year?: string;
  details?: ApplicationDetails;
};

type TargetRecord = { target: number; dpk: number; npl: number };
type AchievementRecord = { kredit: number; dpk: number; npl: number; notes: string };

// --- CONSTANTS & INITIAL DATA ---
const monthOptions = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];
const yearOptions = ["2024", "2025", "2026"];

const initialProducts = ["KUR", "Non KUR", "KPR", "KCU", "KKB"];

const initialBranches: Branch[] = [
  { id: "b1", name: "Cabang Pulau Punjung", code: "PPJ-01", type: "Cabang Utama" },
  { id: "b2", name: "Capem Koto Baru", code: "KTB-02", type: "Cabang Pembantu" },
  { id: "b3", name: "Capem Sungai Rumbai", code: "SRM-03", type: "Cabang Pembantu" },
  { id: "b4", name: "Capem Sikabau", code: "SKB-04", type: "Cabang Pembantu" },
];

const initialRoles = [
  "Analis Kredit Mikro",
  "Analis Kredit Komersil",
  "Analis Kredit Consumer",
  "Analis Kredit Senior",
  "Junior Credit Officer",
];

const initialUsers: UserAccount[] = [
  { id: "u1", name: "Administrator Utama", username: "admin", password: "123", role: "SUPER_USER", branchId: "ALL" },
  { id: "u2", name: "Staf Cabang Utama", username: "cabang", password: "123", role: "USER_CABANG", branchId: "b1" },
  { id: "u3", name: "Staf Capem Koto Baru", username: "capem", password: "123", role: "USER_CAPEM", branchId: "b2" },
];

const initialAnalysts: Analyst[] = [
  { id: "1", name: "Rizki Pratama", initials: "RP", role: "Analis Kredit Komersil", branchId: "b1", color: "#2457a6" },
  { id: "2", name: "Dewi Lestari", initials: "DL", role: "Analis Kredit Consumer", branchId: "b2", color: "#4a8c82" },
  { id: "3", name: "Fadli Rahman", initials: "FR", role: "Analis Kredit Mikro", branchId: "b1", color: "#c7883a" },
  { id: "4", name: "Nadia Sari", initials: "NS", role: "Analis Kredit Senior", branchId: "b3", color: "#7b6eb0" },
];

const initialActivities: ActivityItem[] = [
  {
    id: 1,
    title: "Permohonan Kredit — Toko Sembako Jaya",
    analyst: "Fadli Rahman",
    branchId: "b1",
    type: "kredit",
    amount: "750",
    status: "Analisis Berkas",
    time: "1 jam lalu",
    tone: "amber",
    month: "September",
    year: "2026",
    details: {
      applicantName: "H. Ahmad Subagja",
      address: "Jl. Lintas Sumatra No. 45, Pulau Punjung",
      businessType: "Perdagangan Sembako Grosir",
      requestAmount: "750",
      applicationDate: "2026-09-12",
      creditCategory: "Komersil",
      usageType: "Modal Kerja",
      productType: "KUR",
    },
  },
  {
    id: 2,
    title: "Permohonan Kredit — PT Cahaya Agro",
    analyst: "Rizki Pratama",
    branchId: "b1",
    type: "kredit",
    amount: "1200",
    status: "Verifikasi Jaminan",
    time: "3 jam lalu",
    tone: "amber",
    month: "September",
    year: "2026",
    details: {
      applicantName: "Ir. Budi Santoso",
      address: "Koto Baru, Dharmasraya",
      businessType: "Perkebunan Kelapa Sawit",
      requestAmount: "1200",
      applicationDate: "2026-09-10",
      creditCategory: "Komersil",
      usageType: "Investasi",
      productType: "Non KUR",
    },
  },
  {
    id: 3,
    title: "Permohonan Kredit — KPR Rumah Sejahtera",
    analyst: "Dewi Lestari",
    branchId: "b2",
    type: "kredit",
    amount: "450",
    status: "Persetujuan Komite",
    time: "4 jam lalu",
    tone: "amber",
    month: "September",
    year: "2026",
    details: {
      applicantName: "Siti Rahmawati, S.Pd",
      address: "Perumahan Indah Blok C2, Koto Baru",
      businessType: "PNS / Pegawai Negeri",
      requestAmount: "450",
      applicationDate: "2026-09-08",
      creditCategory: "Konsumtif",
      usageType: "Investasi",
      productType: "KPR",
    },
  },
  {
    id: 4,
    title: "Permohonan Kredit — Usaha Peternakan Ayam",
    analyst: "Nadia Sari",
    branchId: "b3",
    type: "kredit",
    amount: "300",
    status: "Pemeriksaan Lapangan (OTS)",
    time: "5 jam lalu",
    tone: "amber",
    month: "September",
    year: "2026",
    details: {
      applicantName: "Rahmat Hidayat",
      address: "Sungai Rumbai, Dharmasraya",
      businessType: "Peternakan Unggas",
      requestAmount: "300",
      applicationDate: "2026-09-07",
      creditCategory: "Komersil",
      usageType: "Modal Kerja",
      productType: "KUR",
    },
  },
  { id: 5, title: "Pelunasan kredit Mikro", analyst: "Rizki Pratama", branchId: "b1", type: "npl", amount: "185", status: "Selesai", time: "12 menit lalu", tone: "teal", month: "September", year: "2026" },
  { id: 6, title: "Penagihan DPK — Koperasi Maju", analyst: "Dewi Lestari", branchId: "b2", type: "dpk", amount: "420", status: "Ditindaklanjuti", time: "38 menit lalu", tone: "blue", month: "September", year: "2026" },
];

const initialPeriodicTargets: Record<string, Record<string, TargetRecord>> = {
  "September_2026": {
    "Rizki Pratama": { target: 6.2, dpk: 4.0, npl: 2.0 },
    "Dewi Lestari": { target: 5.8, dpk: 3.8, npl: 1.8 },
    "Fadli Rahman": { target: 5.4, dpk: 3.5, npl: 1.5 },
    "Nadia Sari": { target: 5.1, dpk: 3.2, npl: 1.4 },
  },
};

const initialPeriodicAchievements: Record<string, Record<string, AchievementRecord>> = {
  "September_2026": {
    "Rizki Pratama": { kredit: 5.7, dpk: 3.5, npl: 1.6, notes: "Pencapaian September sangat konsisten." },
    "Dewi Lestari": { kredit: 5.0, dpk: 3.2, npl: 1.5, notes: "Pertumbuhan pencairan berkas bagus." },
    "Fadli Rahman": { kredit: 4.0, dpk: 2.9, npl: 1.4, notes: "Perlu ditingkatkan di akhir bulan." },
    "Nadia Sari": { kredit: 3.4, dpk: 2.8, npl: 1.2, notes: "Fokus pada penurunan NPL." },
  },
};

const formatRupiah = (value: number) => `Rp ${value.toFixed(1).replace(".", ",")} M`;

// --- HELPER COMPONENTS ---
function MetricCard({ label, value, sublabel, trend, icon: Icon, accent, progress }: { label: string; value: string; sublabel: string; trend: string; icon: typeof Target; accent: string; progress: number }) {
  return (
    <div className="metric-card group">
      <div className="flex items-start justify-between gap-3">
        <span className="metric-icon" style={{ background: `${accent}14`, color: accent }}><Icon size={18} strokeWidth={2.2} /></span>
        <span className="metric-trend"><ArrowUpRight size={13} /> {trend}</span>
      </div>
      <div className="mt-5">
        <p className="eyebrow">{label}</p>
        <p className="metric-value">{value}</p>
        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-[#70809a]">
          <span>{sublabel}</span>
          <span className="font-semibold text-[#42516b]">{progress}%</span>
        </div>
        <div className="progress-track mt-2"><div className="progress-fill" style={{ width: `${progress}%`, background: accent }} /></div>
      </div>
    </div>
  );
}

function PeriodFields({ month, year, onChange }: { month: string; year: string; onChange: (field: "month" | "year", value: string) => void }) {
  return (
    <div className="form-two-col period-fields">
      <label>Bulan<select value={month} onChange={(e) => onChange("month", e.target.value)}>{monthOptions.map((o) => <option key={o}>{o}</option>)}</select></label>
      <label>Tahun<select value={year} onChange={(e) => onChange("year", e.target.value)}>{yearOptions.map((o) => <option key={o}>{o}</option>)}</select></label>
    </div>
  );
}

// --- APP MAIN COMPONENT ---
export default function App() {
  // STATE AUTENTIKASI USER
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Form Autentikasi
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "USER_CAPEM" as UserRoleType,
    branchId: initialBranches[1].id,
  });

  // State Utama Aplikasi
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState("Tahun 2026");

  // Master Data Tab State
  const [masterTab, setMasterTab] = useState<"analysts" | "branches" | "roles" | "targets" | "products" | "permissions">("analysts");

  // Master State Produk Kredit & Cabang
  const [productsList, setProductsList] = useState<string[]>(initialProducts);
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("ALL");
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  // Filter Periode Global
  const [selectedMonth, setSelectedMonth] = useState("September");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedAnalystFilter, setSelectedAnalystFilter] = useState("Semua Analis");
  const [reportTab, setReportTab] = useState<"permohonan" | "pencapaian">("permohonan");

  // Master State Peran & Modal
  const [rolesList, setRolesList] = useState<string[]>(initialRoles);
  const [isAddingCustomRole, setIsAddingCustomRole] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState("");

  const [activeModal, setActiveModal] = useState<"activity" | "analyst" | "target" | "achievement" | "branch" | null>(null);
  const [editingAnalystId, setEditingAnalystId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua analis");
  const [activityTypeFilter, setActivityTypeFilter] = useState("Semua jenis");

  // Master Data State
  const [analysts, setAnalysts] = useState<Analyst[]>(initialAnalysts);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>(initialActivities);
  const [periodicTargets, setPeriodicTargets] = useState<Record<string, Record<string, TargetRecord>>>(initialPeriodicTargets);
  const [periodicAchievements, setPeriodicAchievements] = useState<Record<string, Record<string, AchievementRecord>>>(initialPeriodicAchievements);

  // Form State Inputs
  const [branchForm, setBranchForm] = useState({ name: "", code: "", type: "Cabang Pembantu" as "Cabang Utama" | "Cabang Pembantu" });
  const [analystForm, setAnalystForm] = useState({ name: "", role: initialRoles[0], branchId: initialBranches[0].id });
  
  const [targetForm, setTargetForm] = useState({ 
    analyst: "Rizki Pratama", target: "", dpk: "", npl: "", month: "September", year: "2026"
  });
  
  const [achievementForm, setAchievementForm] = useState({ analyst: "Rizki Pratama", kredit: "", dpk: "", npl: "", notes: "", month: "September", year: "2026" });
  const [activityForm, setActivityForm] = useState({
    analyst: "Rizki Pratama",
    type: "Permohonan kredit",
    amount: "",
    notes: "",
    month: "September",
    year: "2026",
    applicantName: "",
    address: "",
    businessType: "",
    applicationDate: new Date().toISOString().split("T")[0],
    creditCategory: "Komersil" as "Komersil" | "Konsumtif",
    usageType: "Modal Kerja" as "Modal Kerja" | "Investasi",
    productType: initialProducts[0] || "KUR",
  });

  // --- HANDLER AUTENTIKASI ---
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = userAccounts.find(
      (u) => u.username.toLowerCase() === loginForm.username.toLowerCase().trim() && u.password === loginForm.password
    );

    if (found) {
      setCurrentUser(found);
      setSelectedBranchId(found.role === "SUPER_USER" ? "ALL" : found.branchId);
      toast.success(`Selamat datang, ${found.name}!`);
    } else {
      toast.error("Username atau password salah. Coba lagi!");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.username || !registerForm.password) {
      toast.error("Mohon lengkapi seluruh formulir pendaftaran.");
      return;
    }

    const isExist = userAccounts.some((u) => u.username.toLowerCase() === registerForm.username.toLowerCase().trim());
    if (isExist) {
      toast.error("Username sudah terdaftar. Silakan gunakan username lain.");
      return;
    }

    const newUser: UserAccount = {
      id: `u_${Date.now()}`,
      name: registerForm.name.trim(),
      username: registerForm.username.trim(),
      password: registerForm.password,
      role: registerForm.role,
      branchId: registerForm.role === "SUPER_USER" ? "ALL" : registerForm.branchId,
    };

    setUserAccounts((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setSelectedBranchId(newUser.role === "SUPER_USER" ? "ALL" : newUser.branchId);
    toast.success("Akun baru berhasil didaftarkan dan login!");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginForm({ username: "", password: "" });
    toast.info("Anda telah berhasil keluar dari akun.");
  };

  // Filtered Analysts berdasarkan Cabang Terkunci/Dipilih
  const branchFilteredAnalysts = useMemo(() => {
    if (selectedBranchId === "ALL") return analysts;
    return analysts.filter((a) => a.branchId === selectedBranchId);
  }, [analysts, selectedBranchId]);

  const analystNames = useMemo(() => branchFilteredAnalysts.map((a) => a.name), [branchFilteredAnalysts]);
  const currentPeriodKey = `${selectedMonth}_${selectedYear}`;
  const currentTargets = periodicTargets[currentPeriodKey] || {};
  const currentAchievements = periodicAchievements[currentPeriodKey] || {};

  const dashboardActivities = useMemo(() => {
    return activityItems.filter((item) => {
      const matchesBranch = selectedBranchId === "ALL" || item.branchId === selectedBranchId;
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.analyst.toLowerCase().includes(search.toLowerCase()) ||
        (item.details?.applicantName || "").toLowerCase().includes(search.toLowerCase());
      const matchesType =
        activityTypeFilter === "Semua jenis" ||
        (activityTypeFilter === "DPK" && item.type === "dpk") ||
        (activityTypeFilter === "NPL" && item.type === "npl") ||
        (activityTypeFilter === "Permohonan Kredit" && item.type === "kredit");
      return matchesBranch && matchesSearch && matchesType;
    });
  }, [activityItems, selectedBranchId, search, activityTypeFilter]);

  const totalsSummary = useMemo(() => {
    let totalTargetKredit = 0;
    let totalRealKredit = 0;
    let totalTargetDPK = 0;
    let totalRealDPK = 0;
    let totalTargetNPL = 0;
    let totalRealNPL = 0;

    branchFilteredAnalysts.forEach((a) => {
      const trg = currentTargets[a.name] || { target: 5.0, dpk: 4.0, npl: 2.0 };
      const rec = currentAchievements[a.name];

      const kReal = rec?.kredit ?? Number(((trg.target * 80) / 100).toFixed(1));
      const dReal = rec?.dpk ?? Number(((trg.dpk * 75) / 100).toFixed(1));
      const nReal = rec?.npl ?? Number(((trg.npl * 70) / 100).toFixed(1));

      totalTargetKredit += trg.target;
      totalRealKredit += kReal;

      totalTargetDPK += trg.dpk;
      totalRealDPK += dReal;

      totalTargetNPL += trg.npl;
      totalRealNPL += nReal;
    });

    const pctKredit = totalTargetKredit ? Math.round((totalRealKredit / totalTargetKredit) * 100) : 0;
    const pctDPK = totalTargetDPK ? Math.round((totalRealDPK / totalTargetDPK) * 100) : 0;
    const pctNPL = totalTargetNPL ? Math.round((totalRealNPL / totalTargetNPL) * 100) : 0;

    return {
      kredit: { target: totalTargetKredit, real: totalRealKredit, pct: pctKredit },
      dpk: { target: totalTargetDPK, real: totalRealDPK, pct: pctDPK },
      npl: { target: totalTargetNPL, real: totalRealNPL, pct: pctNPL },
    };
  }, [branchFilteredAnalysts, currentTargets, currentAchievements]);

  const filteredAnalysts = useMemo(() => branchFilteredAnalysts.filter((analyst) => {
    const matchesSearch = analyst.name.toLowerCase().includes(search.toLowerCase());
    const trg = currentTargets[analyst.name] || { target: 5.0, dpk: 4.0, npl: 2.0 };
    const rec = currentAchievements[analyst.name];
    const kreditReal = rec?.kredit ?? Number(((trg.target * 80) / 100).toFixed(1));
    const kreditPct = trg.target ? Math.round((kreditReal / trg.target) * 100) : 0;
    const status = kreditPct >= 80 ? "On track" : "Perlu perhatian";
    return matchesSearch && (filter === "Semua analis" || status === filter);
  }), [branchFilteredAnalysts, search, filter, currentTargets, currentAchievements]);

  const currentPeriodKreditActivities = useMemo(() => {
    return activityItems.filter(
      (item) =>
        item.type === "kredit" &&
        (selectedBranchId === "ALL" || item.branchId === selectedBranchId) &&
        (item.month === selectedMonth || !item.month) &&
        (item.year === selectedYear || !item.year)
    );
  }, [activityItems, selectedBranchId, selectedMonth, selectedYear]);

  const rekapPermohonan = useMemo(() => {
    const totalBerkas = currentPeriodKreditActivities.length;
    const totalNominalJuta = currentPeriodKreditActivities.reduce((acc, curr) => {
      const val = curr.details?.requestAmount ? Number(curr.details.requestAmount) : Number(curr.amount.replace(/[^0-9]/g, "")) || 0;
      return acc + val;
    }, 0);

    const breakdownProduk = currentPeriodKreditActivities.reduce((acc, curr) => {
      const prod = curr.details?.productType || "Lainnya";
      acc[prod] = (acc[prod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalBerkas, totalNominalJuta, breakdownProduk };
  }, [currentPeriodKreditActivities]);

  const filteredPermohonanTabel = useMemo(() => {
    return currentPeriodKreditActivities.filter((item) => {
      const matchesAnalyst = selectedAnalystFilter === "Semua Analis" || item.analyst === selectedAnalystFilter;
      const matchesSearch =
        (item.details?.applicantName || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.details?.businessType || "").toLowerCase().includes(search.toLowerCase()) ||
        item.analyst.toLowerCase().includes(search.toLowerCase());
      return matchesAnalyst && matchesSearch;
    });
  }, [currentPeriodKreditActivities, selectedAnalystFilter, search]);

  // --- MODAL & ACTION HELPERS ---
  const openAddAnalystModal = () => {
    setEditingAnalystId(null);
    setAnalystForm({ 
      name: "", 
      role: rolesList[0] || "Analis Kredit", 
      branchId: selectedBranchId !== "ALL" ? selectedBranchId : branches[0]?.id || "b1" 
    });
    setIsAddingCustomRole(false);
    setCustomRoleInput("");
    setActiveModal("analyst");
  };

  const openEditAnalystModal = (analyst: Analyst) => {
    setEditingAnalystId(analyst.id);
    setAnalystForm({ name: analyst.name, role: analyst.role, branchId: analyst.branchId });
    setIsAddingCustomRole(false);
    setCustomRoleInput("");
    setActiveModal("analyst");
  };

  const openAddBranchModal = () => {
    if (currentUser?.role !== "SUPER_USER") {
      toast.error("Hanya Super User yang dapat menambahkan unit cabang.");
      return;
    }
    setEditingBranchId(null);
    setBranchForm({ name: "", code: "", type: "Cabang Pembantu" });
    setActiveModal("branch");
  };

  const openEditBranchModal = (b: Branch) => {
    if (currentUser?.role !== "SUPER_USER") {
      toast.error("Hanya Super User yang dapat mengubah data cabang.");
      return;
    }
    setEditingBranchId(b.id);
    setBranchForm({ name: b.name, code: b.code, type: b.type });
    setActiveModal("branch");
  };

  const handleDeleteBranch = (b: Branch) => {
    if (currentUser?.role !== "SUPER_USER") {
      toast.error("Hanya Super User yang dapat menghapus cabang.");
      return;
    }
    if (branches.length <= 1) {
      toast.error("Minimal harus ada 1 cabang dalam sistem.");
      return;
    }
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${b.name}?`)) {
      setBranches((prev) => prev.filter((item) => item.id !== b.id));
      toast.success(`Unit ${b.name} berhasil dihapus`);
    }
  };

  const handleDeleteRole = (roleToDelete: string) => {
    if (currentUser?.role !== "SUPER_USER") {
      toast.error("Hanya Super User yang dapat menghapus peran.");
      return;
    }
    if (rolesList.length <= 1) {
      toast.error("Minimal harus ada 1 jabatan/peran.");
      return;
    }
    if (window.confirm(`Hapus jabatan "${roleToDelete}"?`)) {
      setRolesList((prev) => prev.filter((r) => r !== roleToDelete));
      toast.success(`Jabatan "${roleToDelete}" berhasil dihapus`);
    }
  };

  const handleAddProduct = () => {
    if (currentUser?.role !== "SUPER_USER") {
      toast.error("Hanya Super User yang dapat menambah produk kredit.");
      return;
    }
    const newProd = prompt("Masukkan nama Produk Kredit baru:");
    if (newProd && newProd.trim()) {
      const trimmed = newProd.trim();
      if (!productsList.includes(trimmed)) {
        setProductsList((prev) => [...prev, trimmed]);
        toast.success(`Produk Kredit "${trimmed}" berhasil ditambahkan`);
      } else {
        toast.error("Produk Kredit sudah ada dalam daftar.");
      }
    }
  };

  const handleDeleteProduct = (prodToDelete: string) => {
    if (currentUser?.role !== "SUPER_USER") {
      toast.error("Hanya Super User yang dapat menghapus produk kredit.");
      return;
    }
    if (productsList.length <= 1) {
      toast.error("Minimal harus ada 1 produk kredit terdaftar.");
      return;
    }
    if (window.confirm(`Hapus produk kredit "${prodToDelete}"?`)) {
      setProductsList((prev) => prev.filter((p) => p !== prodToDelete));
      toast.success(`Produk "${prodToDelete}" berhasil dihapus`);
    }
  };

  const handleDeleteAnalyst = (analyst: Analyst) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data analis ${analyst.name}?`)) {
      setAnalysts((prev) => prev.filter((a) => a.id !== analyst.id));

      setPeriodicTargets((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((pKey) => {
          if (updated[pKey][analyst.name]) {
            delete updated[pKey][analyst.name];
          }
        });
        return updated;
      });

      setPeriodicAchievements((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((pKey) => {
          if (updated[pKey][analyst.name]) {
            delete updated[pKey][analyst.name];
          }
        });
        return updated;
      });

      toast.success(`Data analis ${analyst.name} berhasil dihapus`);
    }
  };

  // --- SUBMIT HANDLERS ---
  const handleBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchForm.name.trim() || !branchForm.code.trim()) return;

    if (editingBranchId) {
      setBranches((prev) =>
        prev.map((b) =>
          b.id === editingBranchId
            ? { ...b, name: branchForm.name.trim(), code: branchForm.code.trim().toUpperCase(), type: branchForm.type }
            : b
        )
      );
      toast.success(`Data Cabang "${branchForm.name}" berhasil diperbarui`);
    } else {
      const newBranch: Branch = {
        id: `b_${Date.now()}`,
        name: branchForm.name.trim(),
        code: branchForm.code.trim().toUpperCase(),
        type: branchForm.type,
      };
      setBranches((prev) => [...prev, newBranch]);
      toast.success(`Cabang/Capem Baru "${newBranch.name}" berhasil ditambahkan`);
    }

    setActiveModal(null);
    setBranchForm({ name: "", code: "", type: "Cabang Pembantu" });
  };

  const handleAnalystSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newName = analystForm.name.trim();
    if (!newName) return;

    let finalRole = analystForm.role;
    if (isAddingCustomRole && customRoleInput.trim()) {
      finalRole = customRoleInput.trim();
      if (!rolesList.includes(finalRole)) {
        setRolesList((prev) => [...prev, finalRole]);
      }
    }

    if (editingAnalystId) {
      const targetAnalyst = analysts.find((a) => a.id === editingAnalystId);
      const oldName = targetAnalyst ? targetAnalyst.name : "";

      setAnalysts((prev) =>
        prev.map((a) =>
          a.id === editingAnalystId
            ? { ...a, name: newName, role: finalRole, branchId: analystForm.branchId, initials: newName.slice(0, 2).toUpperCase() }
            : a
        )
      );

      if (oldName && oldName !== newName) {
        setPeriodicTargets((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((pKey) => {
            if (updated[pKey][oldName]) {
              updated[pKey][newName] = updated[pKey][oldName];
              delete updated[pKey][oldName];
            }
          });
          return updated;
        });

        setPeriodicAchievements((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((pKey) => {
            if (updated[pKey][oldName]) {
              updated[pKey][newName] = updated[pKey][oldName];
              delete updated[pKey][oldName];
            }
          });
          return updated;
        });

        setActivityItems((prev) =>
          prev.map((item) => (item.analyst === oldName ? { ...item, analyst: newName, branchId: analystForm.branchId } : item))
        );
      }

      toast.success("Data Analis, Jabatan & Cabang berhasil diperbarui");
    } else {
      const newAnalyst: Analyst = {
        id: String(Date.now()),
        name: newName,
        initials: newName.slice(0, 2).toUpperCase(),
        role: finalRole,
        branchId: analystForm.branchId,
        color: "#2457a6",
      };
      setAnalysts((prev) => [...prev, newAnalyst]);
      
      setPeriodicTargets((prev) => ({
        ...prev,
        [currentPeriodKey]: {
          ...(prev[currentPeriodKey] || {}),
          [newAnalyst.name]: { target: 5.0, dpk: 3.5, npl: 1.5 }
        }
      }));

      toast.success("Analis baru berhasil ditambahkan");
    }

    setActiveModal(null);
  };

  const handleTargetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetForm.analyst) return;

    const targetPeriodKey = `${targetForm.month}_${targetForm.year}`;

    setPeriodicTargets((prev) => ({
      ...prev,
      [targetPeriodKey]: {
        ...(prev[targetPeriodKey] || {}),
        [targetForm.analyst]: {
          target: Number(targetForm.target) || 0,
          dpk: Number(targetForm.dpk) || 0,
          npl: Number(targetForm.npl) || 0,
        },
      },
    }));

    setActiveModal(null);
    toast.success(`Target ${targetForm.analyst} (${targetForm.month} ${targetForm.year}) berhasil disimpan`);
  };

  const handleAchievementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const periodKey = `${achievementForm.month}_${achievementForm.year}`;
    setPeriodicAchievements((prev) => ({
      ...prev,
      [periodKey]: {
        ...(prev[periodKey] || {}),
        [achievementForm.analyst]: {
          kredit: Number(achievementForm.kredit) || 0,
          dpk: Number(achievementForm.dpk) || 0,
          npl: Number(achievementForm.npl) || 0,
          notes: achievementForm.notes,
        },
      },
    }));
    setActiveModal(null);
    toast.success(`Realisasi target ${achievementForm.analyst} (${achievementForm.month} ${achievementForm.year}) berhasil diperbarui`);
  };

  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAnalystObj = analysts.find((a) => a.name === activityForm.analyst);
    const analystBranchId = selectedAnalystObj ? selectedAnalystObj.branchId : (selectedBranchId !== "ALL" ? selectedBranchId : branches[0].id);

    const isKreditReq = activityForm.type === "Permohonan kredit";
    const detailsData: ApplicationDetails | undefined = isKreditReq ? {
      applicantName: activityForm.applicantName || "Tanpa Nama",
      address: activityForm.address || "-",
      businessType: activityForm.businessType || "-",
      requestAmount: activityForm.amount || "0",
      applicationDate: activityForm.applicationDate,
      creditCategory: activityForm.creditCategory,
      usageType: activityForm.usageType,
      productType: activityForm.productType,
    } : undefined;

    setActivityItems((items) => [{
      id: Date.now(),
      title: isKreditReq ? `Permohonan Kredit — ${activityForm.applicantName}` : `${activityForm.type} — ${activityForm.notes || "Proses berkas"}`,
      analyst: activityForm.analyst,
      branchId: analystBranchId,
      type: activityForm.type === "Penagihan DPK" ? "dpk" : activityForm.type === "Penyelesaian NPL" ? "npl" : "kredit",
      amount: activityForm.amount ? `${activityForm.amount}` : "0",
      status: "Analisis Berkas",
      time: "Baru saja",
      tone: activityForm.type === "Penagihan DPK" ? "blue" : activityForm.type === "Penyelesaian NPL" ? "teal" : "amber",
      month: activityForm.month,
      year: activityForm.year,
      details: detailsData,
    }, ...items]);
    setActiveModal(null);
    toast.success("Aktivitas tersimpan");
  };

  const exportToCSV = () => {
    if (currentPeriodKreditActivities.length === 0) {
      toast.error(`Tidak ada data permohonan kredit untuk bulan ${selectedMonth} ${selectedYear}`);
      return;
    }

    const headers = [
      "Tanggal Pengajuan", "Cabang / Capem", "Analis Penanggung Jawab", "Nama Pemohon", "Jenis Usaha", "Alamat",
      "Jumlah Permohonan (Juta Rp)", "Kategori Kredit", "Jenis Penggunaan", "Produk Kredit", "Status Berkas"
    ];

    const rows = currentPeriodKreditActivities.map((app) => {
      const br = branches.find((b) => b.id === app.branchId)?.name || "Utama";
      return [
        `"${app.details?.applicationDate || app.time}"`,
        `"${br}"`,
        `"${app.analyst}"`,
        `"${app.details?.applicantName || app.title}"`,
        `"${app.details?.businessType || "-"}"`,
        `"${app.details?.address || "-"}"`,
        app.details?.requestAmount || app.amount,
        `"${app.details?.creditCategory || "Komersil"}"`,
        `"${app.details?.usageType || "Modal Kerja"}"`,
        `"${app.details?.productType || "KUR"}"`,
        `"${app.status}"`,
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Permohonan_Kredit_${selectedMonth}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Laporan periode ${selectedMonth} ${selectedYear} berhasil diekspor`);
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Pencapaian Analis", icon: BarChart3 },
    { label: "Proses Kredit", icon: BriefcaseBusiness },
    { label: "Laporan & Report", icon: FileText },
    { label: "Master Data", icon: Database },
  ];

  const currentBranchObj = branches.find((b) => b.id === selectedBranchId);

  const permissionMatrix = [
    {
      feature: "Akses Filter Unit (Cabang & Capem)",
      superUser: "Semua Cabang Utama & Seluruh Capem (Konsolidasi)",
      cabang: "Terbatas Hanya Cabang Utama (Pulau Punjung)",
      capem: "Terbatas Hanya Capem Sendiri (Contoh: Capem Koto Baru)",
    },
    {
      feature: "Kelola Master Data Cabang/Capem",
      superUser: "Penuh (Tambah, Edit, Hapus Unit Cabang)",
      cabang: "Hanya Lihat (Read-Only)",
      capem: "Hanya Lihat (Read-Only)",
    },
    {
      feature: "Kelola Master Produk Kredit",
      superUser: "Penuh (Tambah & Hapus Jenis Produk Kredit)",
      cabang: "Hanya Lihat (Read-Only)",
      capem: "Hanya Lihat (Read-Only)",
    },
    {
      feature: "Pengelolaan Analis & Jabatan",
      superUser: "Bisa Kelola Analis di Seluruh Unit",
      cabang: "Bisa Kelola Analis Internal Cabang Utama",
      capem: "Bisa Kelola Analis Internal Capem",
    },
    {
      feature: "Penetapan Target Kinerja Analis",
      superUser: "Set & Edit Target Seluruh Analis",
      cabang: "Set & Edit Target Analis Cabang Utama",
      capem: "Set & Edit Target Analis Capem",
    },
    {
      feature: "Input Permohonan Kredit & Aktivitas",
      superUser: "Bisa Input ke Seluruh Unit",
      cabang: "Input Khusus Berkas Cabang Utama",
      capem: "Input Khusus Berkas Capem",
    },
    {
      feature: "Cetak & Export Laporan / Report",
      superUser: "Export Laporan Konsolidasi / Semua Unit",
      cabang: "Export Laporan Khusus Cabang Utama",
      capem: "Export Laporan Khusus Capem",
    },
  ];

  // --- Halaman Autentikasi (JIKA BELUM LOGIN) ---
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-[#1e3a8a] p-6 text-white text-center flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white font-extrabold text-xl border border-white/20">
              BN
            </div>
            <h2 className="text-xl font-bold tracking-tight">Bank Nagari</h2>
            <p className="text-xs text-blue-200">Sistem Monitoring Kredit & Pencapaian Kinerja Analis</p>
          </div>

          <div className="p-6">
            <div className="flex border-b border-slate-200 mb-6">
              <button
                className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition-colors ${
                  authMode === "login" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-400"
                }`}
                onClick={() => setAuthMode("login")}
              >
                MASUK (LOGIN)
              </button>
              <button
                className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition-colors ${
                  authMode === "register" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-400"
                }`}
                onClick={() => setAuthMode("register")}
              >
                PENDAFTARAN (REGISTER)
              </button>
            </div>

            {authMode === "login" ? (
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Username / Email</label>
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    placeholder="Contoh: admin / cabang / capem"
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Password</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Masukkan password Anda..."
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <button type="submit" className="w-full py-2.5 bg-blue-700 text-white font-bold rounded-lg text-xs hover:bg-blue-800 transition-colors shadow-md mt-2">
                  Masuk ke Sistem
                </button>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex flex-col gap-1">
                  <span className="font-bold text-slate-800">Akun Demo Pengujian:</span>
                  <span>• <strong>admin</strong> (pass: 123) — Super User</span>
                  <span>• <strong>cabang</strong> (pass: 123) — User Cabang Utama</span>
                  <span>• <strong>capem</strong> (pass: 123) — User Capem Koto Baru</span>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Nama Lengkap Pengguna</label>
                  <input
                    type="text"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Username</label>
                  <input
                    type="text"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                    placeholder="Buat username login..."
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Password</label>
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    placeholder="Buat password aman..."
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Peran / Hak Akses User</label>
                  <select
                    value={registerForm.role}
                    onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value as UserRoleType })}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="USER_CAPEM">📍 User Capem (Cabang Pembantu)</option>
                    <option value="USER_CABANG">🏛️ User Cabang Utama</option>
                    <option value="SUPER_USER">👑 Super User (Administrator Full)</option>
                  </select>
                </div>

                {registerForm.role !== "SUPER_USER" && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Unit Cabang Penempatan</label>
                    <select
                      value={registerForm.branchId}
                      onChange={(e) => setRegisterForm({ ...registerForm, branchId: e.target.value })}
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 bg-white"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.code})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button type="submit" className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-700 transition-colors shadow-md mt-2">
                  Daftarkan Akun Baru
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- APP LAYOUT UTAMA (SETELAH LOGIN) ---
  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand-block">
          <div className="brand-mark"><span>BN</span><i /></div>
          <div><p className="brand-name">Bank Nagari</p><p className="brand-unit">Cabang Pulau Punjung</p></div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
        </div>

        {/* SELECTOR CABANG / CAPEM DENGAN KONTROL AKSES */}
        <div className="p-3 mx-4 my-2 bg-white/10 rounded-xl border border-white/10 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-blue-200">
            <span className="flex items-center gap-1">
              <Building2 size={12} /> Unit Cabang Ditampilkan:
            </span>
            {currentUser.role === "SUPER_USER" && (
              <button onClick={openAddBranchModal} className="text-white hover:underline font-bold">+ Capem</button>
            )}
          </div>
          <select
            value={selectedBranchId}
            disabled={currentUser.role !== "SUPER_USER"}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className={`w-full text-xs font-semibold p-2 rounded-lg border border-blue-400/30 focus:outline-none ${
              currentUser.role !== "SUPER_USER" ? "bg-slate-800/80 text-gray-300 cursor-not-allowed" : "bg-[#1e3a8a] text-white"
            }`}
          >
            {currentUser.role === "SUPER_USER" && <option value="ALL">🏢 Semua Cabang & Capem</option>}
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.type === "Cabang Utama" ? "🏛️ " : "📍 "}{b.name} ({b.code})
              </option>
            ))}
          </select>
          {currentUser.role !== "SUPER_USER" && (
            <span className="text-[10px] text-amber-300 flex items-center gap-1 font-medium mt-0.5">
              <Lock size={10} /> Terkunci sesuai otorisasi akun
            </span>
          )}
        </div>

        <nav className="nav-group">
          <p className="nav-caption">Workspace</p>
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${activeNav === label ? "active" : ""}`} onClick={() => { setActiveNav(label); setSidebarOpen(false); }}>
              <Icon size={18} /> <span>{label}</span>
              {label === "Dashboard" && <span className="nav-count">{dashboardActivities.length}</span>}
              {label === "Master Data" && <span className="nav-count bg-amber-500 text-white font-bold">{analysts.length}</span>}
            </button>
          ))}
          
          <p className="nav-caption input-caption">Menu Input & Kontrol</p>
          {currentUser.role === "SUPER_USER" && (
            <button className="nav-item" onClick={openAddBranchModal}><Building2 size={18} /> <span>Tambah Capem Baru</span><Plus size={14} className="nav-plus" /></button>
          )}
          <button className="nav-item" onClick={openAddAnalystModal}><UserPlus size={18} /> <span>Edit / Input Nama Analis</span><Plus size={14} className="nav-plus" /></button>
          <button className="nav-item" onClick={() => {
            setTargetForm({ ...targetForm, month: selectedMonth, year: selectedYear });
            setActiveModal("target");
          }}><Target size={18} /> <span>Input Target Analis</span><Plus size={14} className="nav-plus" /></button>
          <button className="nav-item" onClick={() => setActiveModal("achievement")}><BarChart3 size={18} /> <span>Input Realisasi Target</span><Plus size={14} className="nav-plus" /></button>
          <button className="nav-item" onClick={() => setActiveModal("activity")}><ClipboardPenLine size={18} /> <span>Input Aktivitas / Kredit</span><Plus size={14} className="nav-plus" /></button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button>
            <div>
              <p className="breadcrumb">
                {currentBranchObj ? currentBranchObj.name : "Semua Cabang & Capem"} <span>/</span> Monitoring
              </p>
              <h1>{activeNav}</h1>
            </div>
          </div>
          
          <div className="topbar-actions flex items-center gap-3">
            {/* INFORMASI USER LOGGED-IN & LOGOUT */}
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl text-xs">
              <User size={14} className="text-blue-700" />
              <div className="flex flex-col">
                <span className="font-bold text-blue-900 leading-tight">{currentUser.name}</span>
                <span className="text-[10px] text-blue-600 font-semibold">
                  {currentUser.role === "SUPER_USER" ? "👑 Super User" : currentUser.role === "USER_CABANG" ? "🏛️ User Cabang" : "📍 User Capem"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Keluar dari sistem"
                className="ml-2 p-1 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1 font-bold text-[11px]"
              >
                <LogOut size={14} /> Keluar
              </button>
            </div>

            <div className="period-select">
              <CalendarDays size={15} />
              <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option>Tahun 2026</option><option>Semester II 2026</option>
              </select>
            </div>
          </div>
        </header>

        <div className="content-wrap">
          {/* MENU 1: DASHBOARD UTAMA */}
          {activeNav === "Dashboard" ? (
            <div className="flex flex-col gap-6">
              <section className="metric-grid" aria-label="Ringkasan Aktivitas Dashboard">
                <MetricCard label="Total Aktivitas" value={`${dashboardActivities.length} Catatan`} sublabel="Aktivitas di unit pilihan" trend="Real-time" icon={Activity} accent="#2b65b5" progress={100} />
                <MetricCard label="Permohonan Kredit" value={`${dashboardActivities.filter(i => i.type === "kredit").length} Berkas`} sublabel="Dalam analisis & berkas" trend="Aktif" icon={BriefcaseBusiness} accent="#3b8b84" progress={80} />
                <MetricCard label="Penagihan DPK" value={`${dashboardActivities.filter(i => i.type === "dpk").length} Tindakan`} sublabel="Realisasi penagihan" trend="Stabil" icon={TrendingUp} accent="#7165a2" progress={75} />
                <MetricCard label="Penyelesaian NPL" value={`${dashboardActivities.filter(i => i.type === "npl").length} Kasus`} sublabel="Penanganan kredit bermasalah" trend="Perlu pantau" icon={ShieldCheck} accent="#b9792d" progress={60} />
              </section>

              <div className="panel flex flex-col gap-4">
                <div className="panel-heading flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow">Monitor Real-Time</p>
                    <h3>Dashboard Seluruh Aktivitas — {currentBranchObj ? currentBranchObj.name : "Semua Unit"}</h3>
                  </div>

                  <div className="table-tools flex items-center gap-3">
                    <div className="search-box">
                      <Search size={16} />
                      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari aktivitas, pemohon, analis..." />
                    </div>

                    <div className="filter-box">
                      <Filter size={14} />
                      <select value={activityTypeFilter} onChange={(e) => setActivityTypeFilter(e.target.value)}>
                        <option value="Semua jenis">Semua Jenis</option>
                        <option value="Permohonan Kredit">Permohonan Kredit</option>
                        <option value="DPK">DPK</option>
                        <option value="NPL">NPL</option>
                      </select>
                      <ChevronDown size={13} />
                    </div>

                    <button onClick={() => setActiveModal("activity")} className="primary-button compact flex items-center gap-1.5"><Plus size={14} /> Input Aktivitas</button>
                  </div>
                </div>

                <div className="activity-list mt-2">
                  {dashboardActivities.length > 0 ? (
                    dashboardActivities.map((item) => {
                      const branchInfo = branches.find((b) => b.id === item.branchId);
                      return (
                        <div className="activity-item py-4 px-5 rounded-xl border border-[#e9eef5] mb-3 bg-white" key={item.id}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`activity-icon ${item.tone} p-2.5 rounded-xl`}>
                                {item.type === "dpk" ? <Activity size={20} /> : item.type === "npl" ? <ShieldCheck size={20} /> : <FilePlus2 size={20} />}
                              </div>
                              <div>
                                <strong className="text-base font-semibold text-[#0f172a]">{item.title}</strong>
                                <div className="text-xs text-[#64748b] mt-0.5">
                                  Analis: <strong className="text-[#334155]">{item.analyst}</strong> • <span className="text-blue-600 font-semibold">{branchInfo?.name || "Cabang"}</span> • {item.time}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`activity-status ${item.tone} px-3 py-1 rounded-full text-xs font-semibold`}>{item.status}</span>
                              <div className="activity-amount font-bold text-base text-[#0f172a]">{item.type === "kredit" ? `Rp ${item.amount} Jt` : item.amount}</div>
                            </div>
                          </div>

                          {item.details && (
                            <div className="mt-3 pt-3 border-t border-[#f1f5f9] grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-[#f8fafc] p-3 rounded-lg">
                              <div><span className="text-[#64748b] block">Nama Pemohon:</span><strong className="text-[#1e293b]">{item.details.applicantName}</strong></div>
                              <div><span className="text-[#64748b] block">Jenis Usaha:</span><strong className="text-[#1e293b]">{item.details.businessType}</strong></div>
                              <div><span className="text-[#64748b] block">Jenis Kredit:</span><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium inline-block mt-0.5">{item.details.creditCategory}</span></div>
                              <div><span className="text-[#64748b] block">Produk Kredit:</span><span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded font-medium inline-block mt-0.5">{item.details.productType}</span></div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-xs text-[#70809a]">Tidak ada aktivitas yang sesuai kriteria.</div>
                  )}
                </div>
              </div>
            </div>
          ) : activeNav === "Pencapaian Analis" ? (
            /* MENU 2: PENCAPAIAN ANALIS */
            <div className="flex flex-col gap-6">
              <div className="panel flex flex-wrap items-center justify-between gap-4 p-4">
                <div>
                  <h3 className="text-[#0f172a] font-bold text-base">Evaluasi Pencapaian Kinerja Analis</h3>
                  <p className="text-xs text-[#64748b]">Rincian realisasi kredit, DPK, dan penyelesaian NPL per unit cabang/capem ({selectedMonth} {selectedYear})</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#f8fafc] p-1.5 rounded-xl border border-[#e2e8f0]">
                    <CalendarDays size={14} className="text-[#64748b] ml-1" />
                    <select className="bg-transparent text-xs font-semibold text-[#1e293b] cursor-pointer focus:outline-none" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                      {monthOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select className="bg-transparent text-xs font-semibold text-[#1e293b] cursor-pointer focus:outline-none" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                      {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <button onClick={openAddAnalystModal} className="ghost-button text-xs flex items-center gap-1.5"><UserPlus size={14} /> Tambah Analis</button>
                  <button onClick={() => setActiveModal("achievement")} className="primary-button compact flex items-center gap-1.5"><Plus size={14} /> Input Realisasi Target</button>
                </div>
              </div>

              <section className="metric-grid" aria-label="Rekap Kinerja Cabang">
                <MetricCard
                  label="Total Pencapaian Kredit"
                  value={formatRupiah(totalsSummary.kredit.real)}
                  sublabel={`Target Unit: ${formatRupiah(totalsSummary.kredit.target)}`}
                  trend={`${totalsSummary.kredit.pct}%`}
                  icon={Target}
                  accent="#2b65b5"
                  progress={totalsSummary.kredit.pct}
                />
                <MetricCard
                  label="Total Realisasi DPK"
                  value={formatRupiah(totalsSummary.dpk.real)}
                  sublabel={`Target Unit: ${formatRupiah(totalsSummary.dpk.target)}`}
                  trend={`${totalsSummary.dpk.pct}%`}
                  icon={TrendingUp}
                  accent="#3b8b84"
                  progress={totalsSummary.dpk.pct}
                />
                <MetricCard
                  label="Total Penyelesaian NPL"
                  value={formatRupiah(totalsSummary.npl.real)}
                  sublabel={`Target Unit: ${formatRupiah(totalsSummary.npl.target)}`}
                  trend={`${totalsSummary.npl.pct}%`}
                  icon={ShieldCheck}
                  accent="#b9792d"
                  progress={totalsSummary.npl.pct}
                />
              </section>

              <div className="panel flex flex-col gap-4">
                <div className="panel-heading flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow">Rincian Performa Individu</p>
                    <h3>Detail Pencapaian Kinerja Masing-Masing Analis ({selectedMonth} {selectedYear})</h3>
                  </div>

                  <div className="table-tools flex items-center gap-3">
                    <div className="search-box">
                      <Search size={16} />
                      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama analis..." />
                    </div>

                    <div className="filter-box">
                      <Filter size={14} />
                      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="Semua analis">Semua Status</option>
                        <option value="On track">On track</option>
                        <option value="Perlu perhatian">Perlu perhatian</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto mt-2">
                  <table className="w-full text-left text-xs text-[#1e293b] border-collapse">
                    <thead>
                      <tr className="border-b border-[#e2e8f0] text-[#64748b] font-semibold bg-[#f8fafc]">
                        <th className="py-3 px-3">Nama Analis & Jabatan</th>
                        <th className="py-3 px-3">Unit Cabang / Capem</th>
                        <th className="py-3 px-3">Pencapaian Kredit</th>
                        <th className="py-3 px-3">Pencapaian DPK</th>
                        <th className="py-3 px-3">Pencapaian NPL</th>
                        <th className="py-3 px-3">Status Evaluasi</th>
                        <th className="py-3 px-3">Aksi Control</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAnalysts.map((analyst) => {
                        const trg = currentTargets[analyst.name] || { target: 5.0, dpk: 4.0, npl: 2.0 };
                        const rec = currentAchievements[analyst.name];

                        const kreditReal = rec?.kredit ?? Number(((trg.target * 80) / 100).toFixed(1));
                        const dpkReal = rec?.dpk ?? Number(((trg.dpk * 75) / 100).toFixed(1));
                        const nplReal = rec?.npl ?? Number(((trg.npl * 70) / 100).toFixed(1));

                        const kreditPct = trg.target ? Math.round((kreditReal / trg.target) * 100) : 0;
                        const dpkPct = trg.dpk ? Math.round((dpkReal / trg.dpk) * 100) : 0;
                        const nplPct = trg.npl ? Math.round((nplReal / trg.npl) * 100) : 0;

                        const branchInfo = branches.find((b) => b.id === analyst.branchId);

                        return (
                          <tr key={analyst.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                            <td className="py-3.5 px-3 align-top">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-xs" style={{ background: analyst.color }}>
                                  {analyst.initials}
                                </div>
                                <div>
                                  <strong className="block text-sm text-[#0f172a]">{analyst.name}</strong>
                                  <span className="text-[11px] text-blue-700 font-medium px-1.5 py-0.5 bg-blue-50 rounded inline-block mt-0.5">{analyst.role}</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-3 align-top">
                              <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded font-semibold inline-block">
                                {branchInfo?.name || "Cabang Utama"}
                              </span>
                            </td>

                            <td className="py-3.5 px-3 align-top">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[#64748b]">Realisasi:</span>
                                  <strong className="text-sm text-[#0f172a]">{formatRupiah(kreditReal)}</strong>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-[#64748b]">Target: {formatRupiah(trg.target)}</span>
                                  <strong className="text-blue-600 font-bold">{kreditPct}%</strong>
                                </div>
                                <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden mt-0.5">
                                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(kreditPct, 100)}%` }} />
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-3 align-top">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[#64748b]">Realisasi:</span>
                                  <strong className="text-sm text-[#0f172a]">{formatRupiah(dpkReal)}</strong>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-[#64748b]">Target: {formatRupiah(trg.dpk)}</span>
                                  <strong className="text-emerald-600 font-bold">{dpkPct}%</strong>
                                </div>
                                <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden mt-0.5">
                                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${Math.min(dpkPct, 100)}%` }} />
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-3 align-top">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[#64748b]">Penyelesaian:</span>
                                  <strong className="text-sm text-[#0f172a]">{formatRupiah(nplReal)}</strong>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-[#64748b]">Target: {formatRupiah(trg.npl)}</span>
                                  <strong className="text-amber-600 font-bold">{nplPct}%</strong>
                                </div>
                                <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden mt-0.5">
                                  <div className="h-full bg-amber-600 rounded-full" style={{ width: `${Math.min(nplPct, 100)}%` }} />
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-3 align-top">
                              <span className={`status px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${kreditPct >= 80 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                                {kreditPct >= 80 ? "On track" : "Perlu perhatian"}
                              </span>
                            </td>

                            <td className="py-3.5 px-3 align-top">
                              <div className="flex items-center gap-1.5">
                                <button title="Ubah Nama & Jabatan Analis" onClick={() => openEditAnalystModal(analyst)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition-colors flex items-center gap-1 text-[11px] font-semibold">
                                  <Pencil size={13} /> Edit
                                </button>
                                <button title="Hapus Analis" onClick={() => handleDeleteAnalyst(analyst)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded border border-rose-200 transition-colors flex items-center gap-1 text-[11px] font-semibold">
                                  <Trash2 size={13} /> Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeNav === "Proses Kredit" ? (
            /* MENU 3: PROSES KREDIT */
            <div className="flex flex-col gap-6">
              <div className="panel flex flex-wrap items-center justify-between gap-4 p-4">
                <div>
                  <h3 className="text-[#0f172a] font-bold text-base">Proses & Permohonan Kredit Analis</h3>
                  <p className="text-xs text-[#64748b]">Monitoring alur operasional permohonan kredit per masing-masing analis</p>
                </div>
                <div className="flex items-center gap-2 bg-[#f8fafc] p-1.5 rounded-xl border border-[#e2e8f0]">
                  <CalendarDays size={14} className="text-[#64748b] ml-1" />
                  <select className="bg-transparent text-xs font-semibold text-[#1e293b] cursor-pointer" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                    {monthOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select className="bg-transparent text-xs font-semibold text-[#1e293b] cursor-pointer" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <section className="metric-grid" aria-label="Rekap Permohonan Kredit">
                <MetricCard
                  label="Total Berkas Permohonan"
                  value={`${rekapPermohonan.totalBerkas} Berkas`}
                  sublabel={`Periode ${selectedMonth} ${selectedYear}`}
                  trend="Masuk"
                  icon={FileText}
                  accent="#2b65b5"
                  progress={100}
                />
                <MetricCard
                  label="Total Nominal Plafond"
                  value={`Rp ${rekapPermohonan.totalNominalJuta.toLocaleString("id-ID")} Jt`}
                  sublabel={`Akumulasi Rp ${(rekapPermohonan.totalNominalJuta / 1000).toFixed(2)} M`}
                  trend="Pengajuan"
                  icon={TrendingUp}
                  accent="#3b8b84"
                  progress={85}
                />
                <MetricCard
                  label="Distribusi Produk Utama"
                  value={Object.entries(rekapPermohonan.breakdownProduk).map(([k, v]) => `${k} (${v})`).join(", ") || "Belum Ada"}
                  sublabel="Komposisi produk permohonan"
                  trend="Portofolio"
                  icon={BriefcaseBusiness}
                  accent="#7165a2"
                  progress={70}
                />
              </section>

              <div className="panel flex flex-col gap-4">
                <div className="panel-heading flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow">Daftar Detail Permohonan</p>
                    <h3>Tabel Permohonan Kredit Masing-Masing Analis</h3>
                  </div>

                  <div className="table-tools flex flex-wrap items-center gap-3">
                    <div className="filter-box">
                      <Filter size={14} />
                      <select value={selectedAnalystFilter} onChange={(e) => setSelectedAnalystFilter(e.target.value)}>
                        <option value="Semua Analis">Semua Analis</option>
                        {branchFilteredAnalysts.map((a) => (
                          <option key={a.id} value={a.name}>{a.name}</option>
                        ))}
                      </select>
                      <ChevronDown size={13} />
                    </div>

                    <div className="search-box">
                      <Search size={16} />
                      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama pemohon, usaha, analis..." />
                    </div>

                    <button onClick={() => setActiveModal("activity")} className="primary-button compact flex items-center gap-1.5"><Plus size={14} /> Permohonan Baru</button>
                  </div>
                </div>

                <div className="overflow-x-auto mt-2">
                  <table className="w-full text-left text-xs text-[#1e293b] border-collapse">
                    <thead>
                      <tr className="border-b border-[#e2e8f0] text-[#64748b] font-semibold bg-[#f8fafc]">
                        <th className="py-3 px-3">No.</th>
                        <th className="py-3 px-3">Tgl Pengajuan</th>
                        <th className="py-3 px-3">Cabang/Capem</th>
                        <th className="py-3 px-3">Analis PJ</th>
                        <th className="py-3 px-3">Pemohon & Jenis Usaha</th>
                        <th className="py-3 px-3">Alamat Pemohon</th>
                        <th className="py-3 px-3">Jumlah Permohonan</th>
                        <th className="py-3 px-3">Kategori & Penggunaan</th>
                        <th className="py-3 px-3">Produk Kredit</th>
                        <th className="py-3 px-3">Status Berkas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPermohonanTabel.length > 0 ? (
                        filteredPermohonanTabel.map((item, index) => {
                          const det = item.details;
                          const branchInfo = branches.find((b) => b.id === item.branchId);
                          return (
                            <tr key={item.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                              <td className="py-3 px-3 font-medium text-[#64748b]">{index + 1}</td>
                              <td className="py-3 px-3 whitespace-nowrap">{det?.applicationDate || item.time}</td>
                              <td className="py-3 px-3 whitespace-nowrap font-semibold text-slate-700">{branchInfo?.name || "Utama"}</td>
                              <td className="py-3 px-3 font-bold text-[#0f172a] whitespace-nowrap">
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md">{item.analyst}</span>
                              </td>
                              <td className="py-3 px-3">
                                <strong className="block text-[#0f172a] text-sm">{det?.applicantName || item.title}</strong>
                                <span className="text-[11px] text-[#64748b]">{det?.businessType || "Usaha Umum"}</span>
                              </td>
                              <td className="py-3 px-3 text-[#475569] max-w-[200px] truncate">{det?.address || "-"}</td>
                              <td className="py-3 px-3 font-bold text-blue-700 whitespace-nowrap text-sm">
                                Rp {det?.requestAmount || item.amount} Jt
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-semibold text-[#334155]">{det?.creditCategory || "Komersil"}</span>
                                  <span className="text-[11px] text-[#64748b]">{det?.usageType || "Modal Kerja"}</span>
                                </div>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded font-semibold">{det?.productType || "KUR"}</span>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-semibold text-[11px]">
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={10} className="text-center py-8 text-xs text-[#70809a]">
                            Tidak ada permohonan kredit yang ditemukan untuk periode {selectedMonth} {selectedYear}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeNav === "Laporan & Report" ? (
            /* MENU 4: LAPORAN & REPORT */
            <div className="flex flex-col gap-6">
              <div className="panel flex flex-wrap items-center justify-between gap-4 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#f1f5f9] p-1.5 rounded-xl">
                    <button onClick={() => setReportTab("permohonan")} className={`px-4 py-2 rounded-lg text-xs font-bold ${reportTab === "permohonan" ? "bg-white text-blue-700 shadow-sm" : "text-[#64748b]"}`}>
                      Laporan Permohonan Kredit ({currentPeriodKreditActivities.length})
                    </button>
                    <button onClick={() => setReportTab("pencapaian")} className={`px-4 py-2 rounded-lg text-xs font-bold ${reportTab === "pencapaian" ? "bg-white text-blue-700 shadow-sm" : "text-[#64748b]"}`}>
                      Laporan Pencapaian Analis
                    </button>
                  </div>

                  <div className="flex items-center gap-2 bg-[#f8fafc] p-1.5 rounded-xl border border-[#e2e8f0]">
                    <CalendarDays size={14} className="text-[#64748b] ml-1" />
                    <span className="text-xs text-[#64748b] font-medium">Periode:</span>
                    <select className="bg-transparent text-xs font-bold text-[#1e293b] cursor-pointer focus:outline-none" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                      {monthOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select className="bg-transparent text-xs font-bold text-[#1e293b] cursor-pointer focus:outline-none" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                      {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={exportToCSV} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#f1f5f9] text-[#334155] rounded-lg hover:bg-[#e2e8f0] transition-colors">
                    <Download size={14} /> Export CSV
                  </button>
                  <button onClick={() => window.print()} className="primary-button compact flex items-center gap-1.5">
                    <Printer size={14} /> Cetak Laporan
                  </button>
                </div>
              </div>

              {reportTab === "permohonan" ? (
                <div className="panel flex flex-col gap-4">
                  <div className="panel-heading flex items-center justify-between">
                    <div>
                      <p className="eyebrow">Rekapitulasi Permohonan Kredit</p>
                      <h3>Laporan Resmi Permohonan Kredit Masuk — {selectedMonth} {selectedYear}</h3>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1e293b] border-collapse">
                      <thead>
                        <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                          <th className="py-3 px-3">No.</th>
                          <th className="py-3 px-3">Tgl Pengajuan</th>
                          <th className="py-3 px-3">Cabang/Capem</th>
                          <th className="py-3 px-3">Pemohon & Jenis Usaha</th>
                          <th className="py-3 px-3">Alamat</th>
                          <th className="py-3 px-3">Plafond (Jt)</th>
                          <th className="py-3 px-3">Kategori</th>
                          <th className="py-3 px-3">Produk</th>
                          <th className="py-3 px-3">Analis PJ</th>
                          <th className="py-3 px-3">Status Berkas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPeriodKreditActivities.length > 0 ? (
                          currentPeriodKreditActivities.map((app, idx) => {
                            const br = branches.find((b) => b.id === app.branchId);
                            return (
                              <tr key={app.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                                <td className="py-3 px-3 font-semibold text-[#64748b]">{idx + 1}</td>
                                <td className="py-3 px-3 whitespace-nowrap">{app.details?.applicationDate || app.time}</td>
                                <td className="py-3 px-3 whitespace-nowrap font-medium text-slate-700">{br?.name || "Utama"}</td>
                                <td className="py-3 px-3"><strong>{app.details?.applicantName || app.title}</strong><br/><span className="text-[11px] text-[#64748b]">{app.details?.businessType || "-"}</span></td>
                                <td className="py-3 px-3">{app.details?.address || "-"}</td>
                                <td className="py-3 px-3 font-bold text-blue-700 whitespace-nowrap">Rp {app.details?.requestAmount || app.amount} Jt</td>
                                <td className="py-3 px-3">{app.details?.creditCategory || "Komersil"}</td>
                                <td className="py-3 px-3"><span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded font-semibold">{app.details?.productType || "KUR"}</span></td>
                                <td className="py-3 px-3 font-medium">{app.analyst}</td>
                                <td className="py-3 px-3"><span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-semibold">{app.status}</span></td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={10} className="text-center py-8 text-xs text-[#70809a]">
                              Tidak ada data permohonan kredit untuk periode {selectedMonth} {selectedYear}.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="panel flex flex-col gap-4">
                  <div className="panel-heading flex items-center justify-between">
                    <div>
                      <p className="eyebrow">Evaluasi Tim</p>
                      <h3>Laporan Pencapaian Kinerja Analis — {selectedMonth} {selectedYear}</h3>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1e293b]">
                      <thead>
                        <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                          <th className="py-3 px-3">Nama Analis & Jabatan</th>
                          <th className="py-3 px-3">Unit Cabang</th>
                          <th className="py-3 px-3">Target Kredit</th>
                          <th className="py-3 px-3">Realisasi Kredit</th>
                          <th className="py-3 px-3">Realisasi DPK</th>
                          <th className="py-3 px-3">Penyelesaian NPL</th>
                          <th className="py-3 px-3">% Kredit</th>
                          <th className="py-3 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {branchFilteredAnalysts.map((analyst) => {
                          const trg = currentTargets[analyst.name] || { target: 5.0, dpk: 4.0, npl: 2.0 };
                          const rec = currentAchievements[analyst.name];
                          const kreditReal = rec?.kredit ?? Number(((trg.target * 80) / 100).toFixed(1));
                          const dpkReal = rec?.dpk ?? Number(((trg.dpk * 75) / 100).toFixed(1));
                          const nplReal = rec?.npl ?? Number(((trg.npl * 70) / 100).toFixed(1));
                          const pct = trg.target ? Math.round((kreditReal / trg.target) * 100) : 0;
                          const br = branches.find((b) => b.id === analyst.branchId);
                          return (
                            <tr key={analyst.id} className="border-b border-[#f1f5f9]">
                              <td className="py-3 px-3"><strong>{analyst.name}</strong><br/><span className="text-[11px] text-[#64748b]">{analyst.role}</span></td>
                              <td className="py-3 px-3 font-medium text-slate-600">{br?.name || "Utama"}</td>
                              <td className="py-3 px-3">Rp {trg.target.toFixed(1)} M</td>
                              <td className="py-3 px-3 font-bold">Rp {kreditReal.toFixed(1)} M</td>
                              <td className="py-3 px-3">Rp {dpkReal.toFixed(1)} M</td>
                              <td className="py-3 px-3">Rp {nplReal.toFixed(1)} M</td>
                              <td className="py-3 px-3 font-bold text-blue-700">{pct}%</td>
                              <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full font-semibold ${pct >= 80 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{pct >= 80 ? "On track" : "Perlu perhatian"}</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* MENU 5: MASTER DATA */
            <div className="flex flex-col gap-6">
              <div className="panel flex flex-wrap items-center justify-between gap-4 p-4">
                <div>
                  <h3 className="text-[#0f172a] font-bold text-base">Kelola Master Data Sistem</h3>
                  <p className="text-xs text-[#64748b]">Pusat kontrol data Analis, Jabatan, Produk Kredit, Unit Cabang/Capem, Target, & Otorisasi Peran User</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 bg-[#f1f5f9] p-1.5 rounded-xl border border-[#e2e8f0]">
                  <button onClick={() => setMasterTab("analysts")} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${masterTab === "analysts" ? "bg-white text-blue-700 shadow-sm" : "text-[#64748b]"}`}>
                    <Users size={14} /> Master Analis ({analysts.length})
                  </button>
                  <button onClick={() => setMasterTab("products")} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${masterTab === "products" ? "bg-white text-purple-700 shadow-sm" : "text-[#64748b]"}`}>
                    <ShoppingBag size={14} /> Produk Kredit ({productsList.length})
                  </button>
                  <button onClick={() => setMasterTab("branches")} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${masterTab === "branches" ? "bg-white text-blue-700 shadow-sm" : "text-[#64748b]"}`}>
                    <Building2 size={14} /> Cabang/Capem ({branches.length})
                  </button>
                  <button onClick={() => setMasterTab("roles")} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${masterTab === "roles" ? "bg-white text-blue-700 shadow-sm" : "text-[#64748b]"}`}>
                    <BriefcaseBusiness size={14} /> Jabatan/Peran ({rolesList.length})
                  </button>
                  <button onClick={() => setMasterTab("targets")} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${masterTab === "targets" ? "bg-white text-blue-700 shadow-sm" : "text-[#64748b]"}`}>
                    <Target size={14} /> Target Kinerja
                  </button>
                  <button onClick={() => setMasterTab("permissions")} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${masterTab === "permissions" ? "bg-amber-500 text-white shadow-sm" : "text-amber-700 font-bold bg-amber-50"}`}>
                    <KeyRound size={14} /> Matrix Peran User
                  </button>
                </div>
              </div>

              {/* TAB 1: MASTER ANALIS */}
              {masterTab === "analysts" && (
                <div className="panel flex flex-col gap-4">
                  <div className="panel-heading flex items-center justify-between">
                    <div>
                      <p className="eyebrow">Pengelolaan Pengguna</p>
                      <h3>Daftar Master Analis Terdaftar</h3>
                    </div>
                    <button onClick={openAddAnalystModal} className="primary-button compact flex items-center gap-1.5">
                      <UserPlus size={14} /> Tambah Analis Baru
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1e293b] border-collapse">
                      <thead>
                        <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                          <th className="py-3 px-3">Nama Analis</th>
                          <th className="py-3 px-3">Jabatan / Peran</th>
                          <th className="py-3 px-3">Unit Cabang / Capem</th>
                          <th className="py-3 px-3">Target Kredit (M)</th>
                          <th className="py-3 px-3">Aksi Control</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysts.map((a) => {
                          const br = branches.find((b) => b.id === a.branchId);
                          const trg = currentTargets[a.name] || { target: 5.0, dpk: 3.5, npl: 1.5 };
                          return (
                            <tr key={a.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                              <td className="py-3 px-3 font-bold text-[#0f172a]">{a.name}</td>
                              <td className="py-3 px-3"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold">{a.role}</span></td>
                              <td className="py-3 px-3 font-medium text-slate-700">{br?.name || "Utama"}</td>
                              <td className="py-3 px-3 font-bold text-blue-700">Rp {trg.target.toFixed(1)} M</td>
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  <button onClick={() => openEditAnalystModal(a)} className="px-2.5 py-1 text-blue-600 border border-blue-200 hover:bg-blue-50 rounded flex items-center gap-1 font-semibold">
                                    <Pencil size={13} /> Edit
                                  </button>
                                  <button onClick={() => handleDeleteAnalyst(a)} className="px-2.5 py-1 text-rose-600 border border-rose-200 hover:bg-rose-50 rounded flex items-center gap-1 font-semibold">
                                    <Trash2 size={13} /> Hapus
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: MASTER PRODUK KREDIT */}
              {masterTab === "products" && (
                <div className="panel flex flex-col gap-4">
                  <div className="panel-heading flex items-center justify-between">
                    <div>
                      <p className="eyebrow">Manajemen Portofolio Produk</p>
                      <h3>Daftar Produk Kredit Terdaftar</h3>
                    </div>
                    {currentUser.role === "SUPER_USER" ? (
                      <button onClick={handleAddProduct} className="primary-button compact flex items-center gap-1.5">
                        <Plus size={14} /> Tambah Produk Kredit Baru
                      </button>
                    ) : (
                      <span className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1 font-semibold">
                        <Lock size={12} /> Read Only (Membutuhkan Akses Super User)
                      </span>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1e293b] border-collapse">
                      <thead>
                        <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                          <th className="py-3 px-3">No.</th>
                          <th className="py-3 px-3">Nama Produk Kredit</th>
                          <th className="py-3 px-3">Jumlah Berkas Menggunakan</th>
                          <th className="py-3 px-3">Aksi Control</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productsList.map((prod, index) => {
                          const countUsage = activityItems.filter(
                            (item) => item.details?.productType === prod
                          ).length;
                          return (
                            <tr key={prod} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                              <td className="py-3 px-3 text-[#64748b] font-medium">{index + 1}</td>
                              <td className="py-3 px-3 font-bold text-[#0f172a]">
                                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg font-bold border border-purple-200 inline-block">
                                  {prod}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-semibold">{countUsage} Berkas Terdaftar</td>
                              <td className="py-3 px-3">
                                {currentUser.role === "SUPER_USER" ? (
                                  <button
                                    onClick={() => handleDeleteProduct(prod)}
                                    className="px-2.5 py-1 text-rose-600 border border-rose-200 hover:bg-rose-50 rounded flex items-center gap-1 font-semibold transition-colors"
                                  >
                                    <Trash2 size={13} /> Hapus Produk
                                  </button>
                                ) : (
                                  <span className="text-gray-400 italic text-[11px] flex items-center gap-1"><Lock size={11} /> Read Only</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: MASTER CABANG / CAPEM */}
              {masterTab === "branches" && (
                <div className="panel flex flex-col gap-4">
                  <div className="panel-heading flex items-center justify-between">
                    <div>
                      <p className="eyebrow">Struktur Organisasi</p>
                      <h3>Daftar Unit Cabang & Cabang Pembantu (Capem)</h3>
                    </div>
                    {currentUser.role === "SUPER_USER" && (
                      <button onClick={openAddBranchModal} className="primary-button compact flex items-center gap-1.5">
                        <Plus size={14} /> Tambah Capem Baru
                      </button>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1e293b] border-collapse">
                      <thead>
                        <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                          <th className="py-3 px-3">Kode Unit</th>
                          <th className="py-3 px-3">Nama Cabang / Capem</th>
                          <th className="py-3 px-3">Tipe Unit</th>
                          <th className="py-3 px-3">Jumlah Analis</th>
                          <th className="py-3 px-3">Aksi Control</th>
                        </tr>
                      </thead>
                      <tbody>
                        {branches.map((b) => {
                          const countAnalyst = analysts.filter((a) => a.branchId === b.id).length;
                          return (
                            <tr key={b.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                              <td className="py-3 px-3 font-mono font-bold text-blue-700">{b.code}</td>
                              <td className="py-3 px-3 font-bold text-[#0f172a]">{b.name}</td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded font-semibold ${b.type === "Cabang Utama" ? "bg-purple-100 text-purple-800" : "bg-emerald-100 text-emerald-800"}`}>
                                  {b.type}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-semibold">{countAnalyst} Analis Terdaftar</td>
                              <td className="py-3 px-3">
                                {currentUser.role === "SUPER_USER" ? (
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => openEditBranchModal(b)} className="px-2.5 py-1 text-blue-600 border border-blue-200 hover:bg-blue-50 rounded flex items-center gap-1 font-semibold">
                                      <Pencil size={13} /> Edit
                                    </button>
                                    <button onClick={() => handleDeleteBranch(b)} className="px-2.5 py-1 text-rose-600 border border-rose-200 hover:bg-rose-50 rounded flex items-center gap-1 font-semibold">
                                      <Trash2 size={13} /> Hapus
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 italic text-[11px] flex items-center gap-1"><Lock size={11} /> Read Only</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: MASTER JABATAN & PERAN */}
              {masterTab === "roles" && (
                <div className="panel flex flex-col gap-4">
                  <div className="panel-heading flex items-center justify-between">
                    <div>
                      <p className="eyebrow">Master Peran & Jabatan</p>
                      <h3>Daftar Jabatan Analis Terdaftar</h3>
                    </div>
                    {currentUser.role === "SUPER_USER" && (
                      <button
                        onClick={() => {
                          const newR = prompt("Masukkan nama Jabatan / Peran baru:");
                          if (newR && newR.trim()) {
                            if (!rolesList.includes(newR.trim())) {
                              setRolesList((prev) => [...prev, newR.trim()]);
                              toast.success(`Jabatan "${newR.trim()}" berhasil ditambahkan`);
                            } else {
                              toast.error("Jabatan sudah ada dalam daftar.");
                            }
                          }
                        }}
                        className="primary-button compact flex items-center gap-1.5"
                      >
                        <Plus size={14} /> Tambah Jabatan Baru
                      </button>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1e293b] border-collapse">
                      <thead>
                        <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                          <th className="py-3 px-3">No.</th>
                          <th className="py-3 px-3">Nama Jabatan / Peran</th>
                          <th className="py-3 px-3">Jumlah Pengguna</th>
                          <th className="py-3 px-3">Aksi Control</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rolesList.map((r, index) => {
                          const countRole = analysts.filter((a) => a.role === r).length;
                          return (
                            <tr key={r} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                              <td className="py-3 px-3 text-[#64748b] font-medium">{index + 1}</td>
                              <td className="py-3 px-3 font-bold text-[#0f172a]">{r}</td>
                              <td className="py-3 px-3 font-semibold">{countRole} Analis Menggunakan Peran Ini</td>
                              <td className="py-3 px-3">
                                {currentUser.role === "SUPER_USER" ? (
                                  <button onClick={() => handleDeleteRole(r)} className="px-2.5 py-1 text-rose-600 border border-rose-200 hover:bg-rose-50 rounded flex items-center gap-1 font-semibold">
                                    <Trash2 size={13} /> Hapus Jabatan
                                  </button>
                                ) : (
                                  <span className="text-gray-400 italic text-[11px] flex items-center gap-1"><Lock size={11} /> Read Only</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: MASTER TARGET ANALIS */}
              {masterTab === "targets" && (
                <div className="panel flex flex-col gap-4">
                  <div className="panel-heading flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="eyebrow">Parameter Kinerja Periode</p>
                      <h3>Master Target Analis — {selectedMonth} {selectedYear}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-[#f8fafc] p-1.5 rounded-xl border border-[#e2e8f0]">
                        <CalendarDays size={14} className="text-[#64748b] ml-1" />
                        <span className="text-xs text-[#64748b] font-medium">Periode:</span>
                        <select className="bg-transparent text-xs font-bold text-[#1e293b] cursor-pointer focus:outline-none" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                          {monthOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select className="bg-transparent text-xs font-bold text-[#1e293b] cursor-pointer focus:outline-none" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                          {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <button onClick={() => {
                        setTargetForm({ ...targetForm, month: selectedMonth, year: selectedYear });
                        setActiveModal("target");
                      }} className="primary-button compact flex items-center gap-1.5">
                        <Target size={14} /> Input Target Analis
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1e293b] border-collapse">
                      <thead>
                        <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                          <th className="py-3 px-3">Nama Analis</th>
                          <th className="py-3 px-3">Periode</th>
                          <th className="py-3 px-3">Target Kredit (M)</th>
                          <th className="py-3 px-3">Target DPK (M)</th>
                          <th className="py-3 px-3">Target NPL (M)</th>
                          <th className="py-3 px-3">Aksi Control</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysts.map((a) => {
                          const targetObj = currentTargets[a.name];
                          const hasTarget = !!targetObj;
                          const trg = targetObj || { target: 0, dpk: 0, npl: 0 };
                          return (
                            <tr key={a.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                              <td className="py-3 px-3 font-bold text-[#0f172a]">{a.name}</td>
                              <td className="py-3 px-3">
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold">
                                  {selectedMonth} {selectedYear}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-bold text-blue-700">
                                {hasTarget ? `Rp ${trg.target.toFixed(1)} M` : <span className="text-gray-400 italic">Belum Set</span>}
                              </td>
                              <td className="py-3 px-3 font-bold text-emerald-700">
                                {hasTarget ? `Rp ${trg.dpk.toFixed(1)} M` : <span className="text-gray-400 italic">Belum Set</span>}
                              </td>
                              <td className="py-3 px-3 font-bold text-amber-700">
                                {hasTarget ? `Rp ${trg.npl.toFixed(1)} M` : <span className="text-gray-400 italic">Belum Set</span>}
                              </td>
                              <td className="py-3 px-3">
                                <button
                                  onClick={() => {
                                    setTargetForm({
                                      analyst: a.name,
                                      target: hasTarget ? String(trg.target) : "",
                                      dpk: hasTarget ? String(trg.dpk) : "",
                                      npl: hasTarget ? String(trg.npl) : "",
                                      month: selectedMonth,
                                      year: selectedYear,
                                    });
                                    setActiveModal("target");
                                  }}
                                  className="px-2.5 py-1 text-blue-600 border border-blue-200 hover:bg-blue-50 rounded flex items-center gap-1 font-semibold"
                                >
                                  <Pencil size={13} /> {hasTarget ? "Edit Target" : "Set Target"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: TABEL MATRIX PEMBAGIAN FUNGSI & PERAN USER (RBAC) */}
              {masterTab === "permissions" && (
                <div className="panel flex flex-col gap-6">
                  <div className="panel-heading flex items-center justify-between">
                    <div>
                      <p className="eyebrow">Sistem Otorisasi (RBAC)</p>
                      <h3>Matriks Pembagian Fungsi & Peran Masing-Masing User</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 text-sm flex items-center gap-2">
                          👑 Super User (Administrator)
                        </span>
                        <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-extrabold rounded">Full Access</span>
                      </div>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Memiliki wewenang penuh atas seluruh fitur sistem, pengawasan konsolidasi lintas Cabang Utama dan seluruh Capem.
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-900 text-sm flex items-center gap-2">
                          🏛️ User Cabang Utama
                        </span>
                        <span className="px-2 py-0.5 bg-blue-200 text-blue-900 text-[10px] font-extrabold rounded">Cabang Only</span>
                      </div>
                      <p className="text-xs text-blue-800 leading-relaxed">
                        Berwenang mengelola seluruh berkas permohonan, pencapaian target, dan data analis di internal Cabang Utama.
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                          📍 User Capem (Cabang Pembantu)
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 text-[10px] font-extrabold rounded">Capem Only</span>
                      </div>
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        Terisolasi khusus untuk input data permohonan, pemantauan kinerja, dan pelaporan internal Capem yang bersangkutan.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto mt-2">
                    <table className="w-full text-left text-xs text-[#1e293b] border-collapse">
                      <thead>
                        <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                          <th className="py-3.5 px-4 font-bold text-slate-700">Fungsi / Fitur Sistem</th>
                          <th className="py-3.5 px-4 font-bold text-amber-800 bg-amber-50/50">👑 Super User</th>
                          <th className="py-3.5 px-4 font-bold text-blue-800 bg-blue-50/50">🏛️ User Cabang Utama</th>
                          <th className="py-3.5 px-4 font-bold text-emerald-800 bg-emerald-50/50">📍 User Capem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {permissionMatrix.map((item, idx) => (
                          <tr key={idx} className="border-b border-[#f1f5f9] hover:bg-slate-50 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-[#0f172a]">{item.feature}</td>
                            <td className="py-3.5 px-4 bg-amber-50/20 text-amber-900 font-medium">{item.superUser}</td>
                            <td className="py-3.5 px-4 bg-blue-50/20 text-blue-900 font-medium">{item.cabang}</td>
                            <td className="py-3.5 px-4 bg-emerald-50/20 text-emerald-900 font-medium">{item.capem}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* MODAL MODAL EDIT & INPUT GLOBAL */}
      {activeModal === "branch" && (
        <div className="modal-backdrop" onMouseDown={() => setActiveModal(null)}>
          <div className="modal-card max-w-md" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div><h3>{editingBranchId ? "Ubah Data Cabang / Capem" : "Tambah Cabang Pembantu (Capem) Baru"}</h3></div>
              <button className="close-modal" onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleBranchSubmit} className="flex flex-col gap-3">
              <label>Nama Unit / Capem
                <input type="text" value={branchForm.name} onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })} placeholder="Contoh: Capem Sikabau" required />
              </label>
              <div className="form-two-col">
                <label>Kode Unit
                  <input type="text" value={branchForm.code} onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })} placeholder="Contoh: SKB-04" required />
                </label>
                <label>Jenis Unit
                  <select value={branchForm.type} onChange={(e) => setBranchForm({ ...branchForm, type: e.target.value as any })}>
                    <option value="Cabang Pembantu">Cabang Pembantu</option>
                    <option value="Cabang Utama">Cabang Utama</option>
                  </select>
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="ghost-button" onClick={() => setActiveModal(null)}>Batal</button>
                <button type="submit" className="primary-button">{editingBranchId ? "Perbarui Unit" : "Simpan Capem"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === "analyst" && (
        <div className="modal-backdrop" onMouseDown={() => setActiveModal(null)}>
          <div className="modal-card max-w-md" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div><h3>{editingAnalystId ? "Ubah Nama, Jabatan & Unit Analis" : "Input Analis Baru"}</h3></div>
              <button className="close-modal" onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAnalystSubmit} className="flex flex-col gap-3">
              <label>Nama Lengkap Analis
                <input type="text" value={analystForm.name} onChange={(e) => setAnalystForm({ ...analystForm, name: e.target.value })} placeholder="Contoh: Budi Santoso" required />
              </label>

              <label>Pilih Unit Cabang / Capem
                <select
                  value={analystForm.branchId}
                  disabled={currentUser.role !== "SUPER_USER"}
                  onChange={(e) => setAnalystForm({ ...analystForm, branchId: e.target.value })}
                  className={currentUser.role !== "SUPER_USER" ? "bg-slate-100 cursor-not-allowed" : ""}
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                  ))}
                </select>
              </label>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#334155]">Jabatan / Peran Analis</label>
                {!isAddingCustomRole ? (
                  <div className="flex items-center gap-2">
                    <select
                      className="flex-1 p-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:border-blue-600"
                      value={analystForm.role}
                      onChange={(e) => setAnalystForm({ ...analystForm, role: e.target.value })}
                    >
                      {rolesList.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsAddingCustomRole(true)}
                      className="px-3 py-2 text-xs font-semibold bg-[#f1f5f9] text-[#334155] rounded-lg hover:bg-[#e2e8f0] transition-colors whitespace-nowrap"
                    >
                      + Tambah Peran
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-700">Buat Peran / Jabatan Baru</span>
                      <button type="button" onClick={() => setIsAddingCustomRole(false)} className="text-[11px] text-rose-600 font-semibold hover:underline">Batal</button>
                    </div>
                    <input
                      type="text"
                      value={customRoleInput}
                      onChange={(e) => setCustomRoleInput(e.target.value)}
                      placeholder="Ketik nama jabatan baru..."
                      className="p-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="ghost-button" onClick={() => setActiveModal(null)}>Batal</button>
                <button type="submit" className="primary-button">{editingAnalystId ? "Perbarui Data Analis" : "Simpan Analis"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === "target" && (
        <div className="modal-backdrop" onMouseDown={() => setActiveModal(null)}>
          <div className="modal-card max-w-md" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div><h3>Input Target Kinerja Analis</h3></div>
              <button className="close-modal" onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleTargetSubmit} className="flex flex-col gap-3">
              <PeriodFields 
                month={targetForm.month} 
                year={targetForm.year} 
                onChange={(field, val) => setTargetForm({ ...targetForm, [field]: val })} 
              />
              
              <label>Pilih Analis
                <select value={targetForm.analyst} onChange={(e) => setTargetForm({ ...targetForm, analyst: e.target.value })}>
                  {analystNames.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              
              <label>Target Pencairan Kredit (Miliard Rp)
                <input type="number" step="0.1" value={targetForm.target} onChange={(e) => setTargetForm({ ...targetForm, target: e.target.value })} placeholder="Contoh: 5.5" required />
              </label>
              
              <div className="form-two-col">
                <label>Target DPK (Miliard Rp)
                  <input type="number" step="0.1" value={targetForm.dpk} onChange={(e) => setTargetForm({ ...targetForm, dpk: e.target.value })} placeholder="Contoh: 3.5" required />
                </label>
                <label>Target NPL (Miliard Rp)
                  <input type="number" step="0.1" value={targetForm.npl} onChange={(e) => setTargetForm({ ...targetForm, npl: e.target.value })} placeholder="Contoh: 1.5" required />
                </label>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="ghost-button" onClick={() => setActiveModal(null)}>Batal</button>
                <button type="submit" className="primary-button">Simpan Target Periode Ini</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === "achievement" && (
        <div className="modal-backdrop" onMouseDown={() => setActiveModal(null)}>
          <div className="modal-card max-w-md" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div><h3>Input Realisasi Target (Pencapaian)</h3></div>
              <button className="close-modal" onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAchievementSubmit} className="flex flex-col gap-3">
              <PeriodFields month={achievementForm.month} year={achievementForm.year} onChange={(field, val) => setAchievementForm({ ...achievementForm, [field]: val })} />
              <label>Pilih Analis
                <select value={achievementForm.analyst} onChange={(e) => setAchievementForm({ ...achievementForm, analyst: e.target.value })}>
                  {analystNames.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <label>Realisasi Kredit (Miliard Rp)
                <input type="number" step="0.1" value={achievementForm.kredit} onChange={(e) => setAchievementForm({ ...achievementForm, kredit: e.target.value })} placeholder="Contoh: 4.8" required />
              </label>
              <div className="form-two-col">
                <label>Realisasi DPK (Miliard Rp)
                  <input type="number" step="0.1" value={achievementForm.dpk} onChange={(e) => setAchievementForm({ ...achievementForm, dpk: e.target.value })} placeholder="Contoh: 3.2" required />
                </label>
                <label>Penyelesaian NPL (Miliard Rp)
                  <input type="number" step="0.1" value={achievementForm.npl} onChange={(e) => setAchievementForm({ ...achievementForm, npl: e.target.value })} placeholder="Contoh: 1.2" required />
                </label>
              </div>
              <label>Catatan Evaluation Supervisor
                <textarea rows={2} value={achievementForm.notes} onChange={(e) => setAchievementForm({ ...achievementForm, notes: e.target.value })} placeholder="Keterangan pencapaian atau kendala..." />
              </label>
              <div className="modal-actions">
                <button type="button" className="ghost-button" onClick={() => setActiveModal(null)}>Batal</button>
                <button type="submit" className="primary-button">Simpan Realisasi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === "activity" && (
        <div className="modal-backdrop" onMouseDown={() => setActiveModal(null)}>
          <div className="modal-card max-w-2xl" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-heading"><div><h3>Input Aktivitas & Permohonan Kredit</h3></div><button className="close-modal" onClick={() => setActiveModal(null)}><X size={18} /></button></div>
            <form onSubmit={handleActivitySubmit} className="flex flex-col gap-3">
              <PeriodFields month={activityForm.month} year={activityForm.year} onChange={(field, val) => setActivityForm({ ...activityForm, [field]: val })} />
              <div className="form-two-col">
                <label>Analis Penanggung Jawab<select value={activityForm.analyst} onChange={(e) => setActivityForm({ ...activityForm, analyst: e.target.value })}>{analystNames.map((n) => <option key={n}>{n}</option>)}</select></label>
                <label>Jenis Aktivitas<select value={activityForm.type} onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}><option value="Permohonan kredit">Permohonan Kredit</option><option value="Penagihan DPK">Penagihan DPK</option><option value="Penyelesaian NPL">Penyelesaian NPL</option></select></label>
              </div>

              {activityForm.type === "Permohonan kredit" && (
                <div className="bg-[#f8fafc] p-4 rounded-xl border flex flex-col gap-3">
                  <div className="form-two-col">
                    <label>Nama Pemohon<input type="text" value={activityForm.applicantName} onChange={(e) => setActivityForm({ ...activityForm, applicantName: e.target.value })} required /></label>
                    <label>Jenis Usaha<input type="text" value={activityForm.businessType} onChange={(e) => setActivityForm({ ...activityForm, businessType: e.target.value })} required /></label>
                  </div>
                  <label>Alamat Usaha<input type="text" value={activityForm.address} onChange={(e) => setActivityForm({ ...activityForm, address: e.target.value })} required /></label>
                  <div className="form-two-col">
                    <label>Jumlah Permohonan (Juta Rp)<input type="number" value={activityForm.amount} onChange={(e) => setActivityForm({ ...activityForm, amount: e.target.value })} required /></label>
                    <label>Tanggal Permohonan<input type="date" value={activityForm.applicationDate} onChange={(e) => setActivityForm({ ...activityForm, applicationDate: e.target.value })} required /></label>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <label>Jenis Kredit<select value={activityForm.creditCategory} onChange={(e) => setActivityForm({ ...activityForm, creditCategory: e.target.value as any })}><option value="Komersil">Komersil</option><option value="Konsumtif">Konsumtif</option></select></label>
                    <label>Penggunaan<select value={activityForm.usageType} onChange={(e) => setActivityForm({ ...activityForm, usageType: e.target.value as any })}><option value="Modal Kerja">Modal Kerja</option><option value="Investasi">Investasi</option></select></label>
                    <label>Produk Kredit
                      <select value={activityForm.productType} onChange={(e) => setActivityForm({ ...activityForm, productType: e.target.value })}>
                        {productsList.map((prod) => (
                          <option key={prod} value={prod}>{prod}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              )}
              <div className="modal-actions"><button type="button" className="ghost-button" onClick={() => setActiveModal(null)}>Batal</button><button type="submit" className="primary-button">Simpan Aktivitas</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}