import { useState, useEffect } from "react";
import {
  Shield,
  ShieldCheck,
  Star,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Award,
  Search,
  Bell,
  Eye,
  Heart,
  Globe,
  Database,
  Fingerprint,
  BarChart2,
  AlertTriangle,
  Clock,
  Check,
  CircleDollarSign,
  ChevronRight,
  Package,
  Camera,
  Tag,
  MessageSquare,
  Lock,
  Zap,
  BadgeCheck,
  Share2,
  MapPin,
  Flag,
  Truck,
  CreditCard,
  Timer,
  Copy,
  ThumbsUp,
  PackageCheck,
  type LucideIcon,
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================

type Page = "landing" | "listing" | "signup" | "payment" | "confirm";
type SignupStep = 1 | 2 | 3 | 4 | 5;
type RiskLevel =
  | "verified"
  | "low"
  | "medium"
  | "medium-high"
  | "high"
  | "great-deal"
  | "fair"
  | "overpriced";

interface TrustCheck {
  id: string;
  name: string;
  nameTh: string;
  finding: string;
  detail: string;
  suspicion: number;
  riskLevel: RiskLevel;
  Icon: LucideIcon;
  weight: number;
}

// ============================================================
// TRUST SCORE DATA
// ============================================================

const trustChecks: TrustCheck[] = [
  {
    id: "longevity",
    name: "Account Longevity",
    nameTh: "อายุบัญชี",
    finding: "Account created 8 months ago (Jan 2024)",
    detail:
      "Accounts under 12 months receive elevated scrutiny. This seller has moderate history but has not yet reached the 1-year threshold associated with lower fraud rates. Activity log shows consistent weekly listings.",
    suspicion: 28,
    riskLevel: "low",
    Icon: Clock,
    weight: 0.08,
  },
  {
    id: "id_verify",
    name: "ID Verification",
    nameTh: "ยืนยันตัวตน",
    finding: "Thai National ID verified via DOPA ✓",
    detail:
      "Identity confirmed through Thailand's Department of Provincial Administration (DOPA) digital ID system. Physical ID selfie submitted and face-matched. Real name: Lekthong W., DOB verified.",
    suspicion: 0,
    riskLevel: "verified",
    Icon: Fingerprint,
    weight: 0.15,
  },
  {
    id: "cross_platform",
    name: "Cross-Platform History",
    nameTh: "ประวัติแพลตฟอร์มอื่น",
    finding:
      "Shopee 4.7★ (234 reviews, 2 yrs) · Facebook linked",
    detail:
      "Seller has a strong Shopee reputation with 234 verified reviews over 2 years of consistent selling. Facebook Marketplace profile is linked with a matching display name and phone number. No conflicts detected.",
    suspicion: 12,
    riskLevel: "low",
    Icon: Globe,
    weight: 0.1,
  },
  {
    id: "brand_badge",
    name: "Verified Brand Badge",
    nameTh: "แบดจ์แบรนด์",
    finding: "Individual seller — no brand badge applied",
    detail:
      "This account operates as an individual reseller, not as a registered business or brand. Applying for a Brand Verification Badge would add significant trust signals. Currently no brand application is on file.",
    suspicion: 38,
    riskLevel: "medium",
    Icon: Award,
    weight: 0.05,
  },
  {
    id: "image_forensics",
    name: "Image Forensics",
    nameTh: "การตรวจสอบรูปภาพ",
    finding:
      "1 of 6 images flagged — possible web-sourced photo",
    detail:
      "Reverse image search (perceptual hash + TinEye cross-reference) found that the box shot (image #3) has a 91% visual similarity match with a product image on a third-party tech review site. The remaining 5 photos appear to be original seller-taken photos.",
    suspicion: 62,
    riskLevel: "medium",
    Icon: Camera,
    weight: 0.12,
  },
  {
    id: "bot_detection",
    name: "Bot Detection",
    nameTh: "ตรวจจับบอท",
    finding:
      "Comments appear organic — varied timing & vocabulary",
    detail:
      "NLP analysis of 12 extracted review comments shows natural variation in sentence structure, vocabulary richness, and timestamps spread across 6 weeks. No coordinated review bursts or copy-paste patterns detected. Entropy score: 0.87 / 1.0.",
    suspicion: 8,
    riskLevel: "low",
    Icon: BarChart2,
    weight: 0.08,
  },
  {
    id: "review_ratio",
    name: "Volume-to-Review Ratio",
    nameTh: "สัดส่วนยอดขาย/รีวิว",
    finding: "89 items sold — only 12 written reviews (13.5%)",
    detail:
      "Expected review rate on MTMarket is 20-30%. A 13.5% rate is below average and may indicate that some transactions occurred off-platform (bypassing the review system) or buyers opted out. This contributes moderately to the risk score.",
    suspicion: 45,
    riskLevel: "medium",
    Icon: BarChart2,
    weight: 0.1,
  },
  {
    id: "evasion",
    name: "Platform Evasion",
    nameTh: "การหลีกเลี่ยงแพลตฟอร์ม",
    finding: '⚠️ Phrase detected: "Add Line for better price"',
    detail:
      "The product description contains language explicitly attempting to move buyers to Line for off-platform transactions. Conducting payment outside MTMarket's buyer protection.",
    suspicion: 88,
    riskLevel: "high",
    Icon: AlertTriangle,
    weight: 0.18,
  },
  {
    id: "db_check",
    name: "Fraud Database Check",
    nameTh: "ตรวจสอบฐานข้อมูลมิจฉาชีพ",
    finding: "No hits on Blacklistseller.com or Checkgon.go.th",
    detail:
      "Phone number 081-234-5678 and PromptPay ID 0812345678 were cross-referenced against Blacklistseller.com, Checkgon.go.th, and our internal fraud registry. Zero matches found. Bank account (Kasikorn) also checked — clean.",
    suspicion: 5,
    riskLevel: "low",
    Icon: Database,
    weight: 0.09,
  },
  {
    id: "deal_score",
    name: "Deal Score",
    nameTh: "คะแนนดีล",
    finding:
      "฿24,500 — 5.8% below market avg ฿26,000 · Great Deal",
    detail:
      "Current market average for iPhone 14 Pro Max 256GB in 9/10 condition is ฿26,000 (based on 340 recent comparable sales). At ฿24,500, this is a reasonable discount within normal range. Prices more than 25% below market are flagged as potential scam bait — this listing is not at that threshold.",
    suspicion: 15,
    riskLevel: "great-deal",
    Icon: Tag,
    weight: 0.05,
  },
];

function calcTrustScore(checks: TrustCheck[]): number {
  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const weighted = checks.reduce(
    (s, c) => s + c.suspicion * c.weight,
    0,
  );
  return Math.round(100 - weighted / totalWeight);
}

const TRUST_SCORE = calcTrustScore(trustChecks);

// ============================================================
// RISK BADGE
// ============================================================

const riskConfig: Record<
  RiskLevel,
  { label: string; className: string; dot: string }
> = {
  verified: {
    label: "Verified",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  "great-deal": {
    label: "Great Deal",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  low: {
    label: "Low Risk",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  fair: {
    label: "Fair Price",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  medium: {
    label: "Moderate",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  "medium-high": {
    label: "Caution",
    className: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },
  high: {
    label: "High Risk",
    className: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  overpriced: {
    label: "Overpriced",
    className: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },
};

function RiskBadge({ level }: { level: RiskLevel }) {
  const cfg = riskConfig[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`}
      />
      {cfg.label}
    </span>
  );
}

// ============================================================
// TRUST GAUGE
// ============================================================

function TrustGauge({
  score,
  size = 160,
}: {
  score: number;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.4;
  const sw = size * 0.065;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 75
      ? "#10B981"
      : score >= 50
        ? "#F59E0B"
        : "#EF4444";
  const label =
    score >= 75
      ? "Trusted"
      : score >= 50
        ? "Moderate Risk"
        : "High Risk";

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={sw}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fontSize={size * 0.2}
          fontWeight="700"
          fill={color}
          fontFamily="DM Mono, monospace"
        >
          {score}
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fontSize={size * 0.07}
          fill="rgba(255,255,255,0.6)"
          fontFamily="Sarabun, sans-serif"
        >
          /100 Trust Score
        </text>
        <text
          x={cx}
          y={cy + 26}
          textAnchor="middle"
          fontSize={size * 0.08}
          fontWeight="600"
          fill={color}
          fontFamily="Sarabun, sans-serif"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}

function TrustGaugeLight({ score }: { score: number }) {
  const r = 64;
  const sw = 10;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 75
      ? "#10B981"
      : score >= 50
        ? "#F59E0B"
        : "#EF4444";
  const label =
    score >= 75
      ? "Trusted"
      : score >= 50
        ? "Moderate"
        : "High Risk";

  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      <circle
        cx="80"
        cy="80"
        r={r}
        fill="none"
        stroke="#DDE4F5"
        strokeWidth={sw}
      />
      <circle
        cx="80"
        cy="80"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 80 80)"
      />
      <text
        x="80"
        y="74"
        textAnchor="middle"
        fontSize="32"
        fontWeight="700"
        fill={color}
        fontFamily="DM Mono, monospace"
      >
        {score}
      </text>
      <text
        x="80"
        y="92"
        textAnchor="middle"
        fontSize="11"
        fill="#5E6A99"
        fontFamily="Sarabun, sans-serif"
      >
        /100
      </text>
      <text
        x="80"
        y="112"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill={color}
        fontFamily="Sarabun, sans-serif"
      >
        {label}
      </text>
    </svg>
  );
}

// ============================================================
// TRUST CHECK ROW
// ============================================================

function TrustCheckRow({
  check,
  expanded,
  onToggle,
}: {
  check: TrustCheck;
  expanded: boolean;
  onToggle: () => void;
}) {
  const high = check.suspicion >= 70;
  const mid = check.suspicion >= 40 && !high;
  const barColor = high
    ? "bg-red-500"
    : mid
      ? "bg-amber-500"
      : "bg-emerald-500";
  const iconBg = high
    ? "bg-red-100"
    : mid
      ? "bg-amber-100"
      : "bg-emerald-100";
  const iconColor = high
    ? "text-red-600"
    : mid
      ? "text-amber-600"
      : "text-emerald-600";

  return (
    <div className="border border-border rounded-xl overflow-hidden transition-shadow hover:shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors text-left"
      >
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
        >
          <check.Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-1.5 mb-0.5">
            <span className="text-sm font-semibold text-foreground">
              {check.name}
            </span>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              {check.nameTh}
            </span>
            <RiskBadge level={check.riskLevel} />
          </div>
          <p className="text-xs text-muted-foreground truncate pr-4">
            {check.finding}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-20 hidden sm:block">
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-muted-foreground">
                Suspicion
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {check.suspicion}%
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${barColor}`}
                style={{ width: `${check.suspicion}%` }}
              />
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-3 bg-secondary/30 border-t border-border">
          <div className="flex items-center gap-2 mb-2 sm:hidden">
            <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${barColor}`}
                style={{ width: `${check.suspicion}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {check.suspicion}% suspicion
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {check.detail}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// NAVIGATION
// ============================================================

function Nav({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <button
          onClick={() => setPage("landing")}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight leading-none">
            <span className="text-primary">MT</span>
            <span style={{ color: "#FF5722" }}>♥</span>
            <span className="text-primary">Market</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setPage("listing")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ซื้อสินค้า
          </button>
          <button
            onClick={() => setPage("signup")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ขายสินค้า
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            วิธีการใช้งาน
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <Search className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-full hover:bg-muted transition-colors relative">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "#FF5722" }}
            />
          </button>
          <button
            onClick={() => setPage("signup")}
            className="ml-2 bg-primary text-white text-sm px-4 py-2 rounded-full hover:bg-primary/90 transition-all font-semibold shadow-sm"
          >
            เป็นผู้ขาย
          </button>
        </div>
      </div>
    </nav>
  );
}

// ============================================================
// LANDING PAGE
// ============================================================

function LandingPage({
  setPage,
}: {
  setPage: (p: Page) => void;
}) {
  const features = [
    {
      Icon: Clock,
      title: "อายุบัญชี",
      en: "Account Longevity",
      desc: "ตรวจสอบว่าบัญชีถูกสร้างมานานแค่ไหน",
      color: "bg-violet-100 text-violet-600",
    },
    {
      Icon: Fingerprint,
      title: "ยืนยันตัวตน",
      en: "ID Verification",
      desc: "ยืนยันบัตรประชาชนไทยผ่านระบบ DOPA",
      color: "bg-blue-100 text-blue-600",
    },
    {
      Icon: Globe,
      title: "ข้ามแพลตฟอร์ม",
      en: "Cross-Platform",
      desc: "เชื่อมต่อประวัติ Shopee, Lazada, Facebook",
      color: "bg-sky-100 text-sky-600",
    },
    {
      Icon: Award,
      title: "แบดจ์แบรนด์",
      en: "Brand Badges",
      desc: "แบรนด์และธุรกิจที่ได้รับการรับรอง",
      color: "bg-amber-100 text-amber-600",
    },
    {
      Icon: Camera,
      title: "ตรวจสอบรูปภาพ",
      en: "Image Forensics",
      desc: "ตรวจจับรูปปลอมหรือรูปจากอินเทอร์เน็ต",
      color: "bg-rose-100 text-rose-600",
    },
    {
      Icon: BarChart2,
      title: "ตรวจจับบอท",
      en: "Bot Detection",
      desc: "วิเคราะห์ความจริงแท้ของรีวิวและคอมเมนต์",
      color: "bg-teal-100 text-teal-600",
    },
    {
      Icon: Eye,
      title: "อัตรารีวิว",
      en: "Volume-to-Review",
      desc: "เปรียบเทียบยอดขายกับจำนวนรีวิวที่ได้รับ",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      Icon: AlertTriangle,
      title: "การหลีกเลี่ยง",
      en: "Evasion Detection",
      desc: "สแกนข้อความหลบเลี่ยงระบบ (เช่น แอดไลน์รับส่วนลด, โอนตรงเท่านั้น)",
      color: "bg-orange-100 text-orange-600",
    },
    {
      Icon: Database,
      title: "ฐานข้อมูลมิจฉาชีพ",
      en: "Fraud Database",
      desc: "เช็คกับ database ศูนย์กลางตรวจสอบคนโกงออนไลน์",
      color: "bg-red-100 text-red-600",
    },
    {
      Icon: Tag,
      title: "ประเมินราคา",
      en: "Deal Score",
      desc: "ตรวจสอบราคากับราคาตลาดว่าสมเหตุสมผลไหม",
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  const stats = [
    {
      val: "124,500+",
      label: "ผู้ขายยืนยันตัวตนแล้ว",
      sub: "Verified Sellers",
    },
    {
      val: "฿2.8B+",
      label: "มูลค่าธุรกรรมปลอดภัย",
      sub: "Safe Transactions",
    },
    {
      val: "98.7%",
      label: "ผู้ซื้อพึงพอใจ",
      sub: "Buyer Satisfaction",
    },
    {
      val: "3,201",
      label: "มิจฉาชีพที่ถูกบล็อก",
      sub: "Scams Prevented",
    },
  ];

  const listings = [
    {
      name: "iPhone 14 Pro Max 256GB Space Black",
      price: "฿24,500",
      score: 65,
      cond: "มือสอง 9/10",
      seller: "@techresell_lek",
      img: "photo-1512941937669-90a1b58e7e9c",
    },
    {
      name: "Sony WH-1000XM5 Headphones",
      price: "฿8,900",
      score: 82,
      cond: "มือสองสภาพดีมาก",
      seller: "@audiolovers_th",
      img: "photo-1505740420023-02f3c4a54f6b",
    },
    {
      name: "Nike Air Jordan 1 Retro High",
      price: "฿6,500",
      score: 91,
      cond: "แกะกล่องแล้ว",
      seller: "@sneakervault_bkk",
      img: "photo-1542291026-7eec183d3a6b",
    },
    {
      name: 'iPad Pro 12.9" M2 (2022)',
      price: "฿32,000",
      score: 55,
      cond: "มือสอง 8/10",
      seller: "@gadget_palace99",
      img: "photo-1544244015-09f229e9b6c8",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative bg-primary overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/5 rounded-full" />
          <div className="absolute bottom-0 -left-24 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-sm mb-6">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-medium">
                  Thailand's #1 Anti-Scam Marketplace
                </span>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl font-bold leading-[1.1] mb-5">
                ซื้อขายมือสอง
                <br />
                <span style={{ color: "#FF8A65" }}>
                  ปลอดภัย
                </span>{" "}
                ไร้กังวล
              </h1>
              <p className="text-blue-200 text-lg leading-relaxed mb-8 max-w-md">
                ทุกรายการมี{" "}
                <strong className="text-white">
                  Trust Score AI
                </strong>{" "}
                 ที่ตรวจสอบความปลอดภัย 10 มิติ
                ก่อนที่คุณจะตัดสินใจซื้อ
                และเป็นตัวกลางปกป้องทุกธุรกรรม
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <button
                  onClick={() => setPage("listing")}
                  className="flex items-center gap-2 text-white px-6 py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: "#FF5722" }}
                >
                  ดูสินค้า <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage("signup")}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 rounded-full font-semibold border border-white/25 transition-all"
                >
                  เริ่มขายเลย
                </button>
              </div>
              <div className="flex items-center gap-5 pt-8 border-t border-white/15">
                <div className="flex -space-x-2.5">
                  {[
                    "#64B5F6",
                    "#81C784",
                    "#FFB74D",
                    "#F06292",
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-2 border-primary flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: c }}
                    >
                      {["S", "N", "P", "T"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    124,500+ ผู้ขายผ่านการยืนยัน
                  </p>
                  <p className="text-blue-300 text-xs">
                    Trust Score ผ่านแล้วทุกคน
                  </p>
                </div>
              </div>
            </div>

            {/* Right — mini Trust Score mockup */}
            <div className="hidden lg:flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-5 border border-white/20 w-80">
                <div className="bg-white rounded-2xl p-5 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-foreground text-sm">
                        Trust Score Report
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ตรวจสอบล่าสุด 2 นาทีที่แล้ว
                      </p>
                    </div>
                  </div>
                  <TrustGaugeLight score={65} />
                  <div className="mt-4 space-y-2">
                    {[
                      {
                        ok: true,
                        text: "ยืนยันตัวตนผ่าน DOPA แล้ว",
                      },
                      {
                        ok: true,
                        text: "Shopee 4.7★ · 234 รีวิว",
                      },
                      {
                        ok: false,
                        text: 'พบ "Add Line" ในรายการ',
                      },
                      {
                        ok: false,
                        text: "รูป 1/6 อาจมาจากเว็บ",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm"
                      >
                        {item.ok ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        )}
                        <span
                          className={
                            item.ok
                              ? "text-foreground"
                              : "text-amber-700 font-medium"
                          }
                        >
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage("listing")}
                    className="w-full mt-4 bg-primary text-white text-sm py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    <Lock className="w-4 h-4" /> ซื้อเลย
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 56"
            preserveAspectRatio="none"
            className="w-full h-14 block"
          >
            <path
              d="M0 56L48 48C96 40 192 24 288 18C384 12 480 16 576 22C672 28 768 34 864 34C960 34 1056 26 1152 20C1248 14 1344 8 1392 5L1440 2V56H0Z"
              fill="#EEF1FB"
            />
          </svg>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-display font-bold text-3xl sm:text-4xl text-primary">
                  {s.val}
                </p>
                <p className="text-sm text-foreground font-semibold mt-1">
                  {s.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#FF5722" }}
            >
              Trust Score System
            </span>
            <h2 className="font-display text-4xl font-bold text-foreground mt-2 mb-4">
              AI ตรวจสอบ 10 มิติ
              <br />
              ก่อนทุกการซื้อขาย
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              AI วิเคราะห์ผู้ขายและรายการสินค้าทุกชิ้น
              ให้คุณเห็นความเสี่ยงก่อนตัดสินใจ
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-5 border border-border hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${f.color}`}
                >
                  <f.Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm mb-0.5">
                  {f.title}
                </h3>
                <p className="text-[11px] text-muted-foreground mb-1 font-mono">
                  {f.en}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Escrow Flow ── */}
      <section className="py-20 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#FF5722" }}
            >
              ตัวกลาง MT❤️Market
            </span>
            <h2 className="font-display text-4xl font-bold text-foreground mt-2">
              เงินปลอดภัย ทุกธุรกรรม
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">
              MT❤️Market ถือเงินแทนผู้ซื้อ
              จนกว่าจะรับสินค้าและพึงพอใจ
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-1 relative">
            {[
              {
                n: "01",
                Icon: CircleDollarSign,
                title: "ผู้ซื้อชำระเงิน",
                desc: "เงินถูกเก็บไว้ใน MTMarket อย่างปลอดภัย ไม่ถึงมือผู้ขายทันที",
              },
              {
                n: "02",
                Icon: Package,
                title: "ผู้ขายจัดส่ง",
                desc: "ผู้ขายจัดส่งสินค้าพร้อมเลขติดตาม MTMarket ตรวจสอบการส่ง",
              },
              {
                n: "03",
                Icon: CheckCircle,
                title: "ผู้ซื้อยืนยันรับ",
                desc: "ผู้ซื้อตรวจสินค้าและยืนยันหรือแจ้งปัญหา",
              },
              {
                n: "04",
                Icon: Zap,
                title: "โอนเงินผู้ขาย",
                desc: "เงินโอนให้ผู้ขายทันทีหลังยืนยัน",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="relative text-center px-4 py-6"
              >
                {i < 3 && (
                  <div className="hidden md:block absolute top-12 right-0 w-1/2 h-px bg-border z-0" />
                )}
                <div className="relative z-10 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <s.Icon className="w-7 h-7 text-white" />
                </div>
                <p className="font-mono text-[10px] text-muted-foreground tracking-widest mb-1.5">
                  {s.n}
                </p>
                <h3 className="font-display font-semibold text-foreground text-base mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Listings ── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                สินค้าแนะนำ
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                จากผู้ขายที่ผ่านการยืนยันตัวตนแล้ว
              </p>
            </div>
            <button
              onClick={() => setPage("listing")}
              className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
            >
              ดูทั้งหมด <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {listings.map((item, i) => {
              const sc = item.score;
              const scColor =
                sc >= 75
                  ? "text-emerald-700 bg-emerald-50/90"
                  : sc >= 50
                    ? "text-amber-700 bg-amber-50/90"
                    : "text-red-700 bg-red-50/90";
              return (
                <button
                  key={i}
                  onClick={() => setPage("listing")}
                  className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
                >
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/${item.img}?w=400&h=400&fit=crop&auto=format`}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${scColor}`}
                    >
                      <Shield className="w-3 h-3" /> {sc}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-foreground text-sm leading-snug mb-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {item.cond}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-xl text-primary">
                        {item.price}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.seller}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-primary text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            พร้อมเริ่มขายแล้วไหม?
          </h2>
          <p className="text-blue-200 text-lg mb-8 leading-relaxed">
            สมัครวันนี้ ยืนยันตัวตน รับ Trust Badge
            ที่สร้างความมั่นใจให้ผู้ซื้อทุกคน
          </p>
          <button
            onClick={() => setPage("signup")}
            className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl transition-all hover:scale-105"
            style={{ backgroundColor: "#FF5722" }}
          >
            สมัครเป็นผู้ขาย <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-foreground text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-8">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="font-display font-bold text-lg">
              MTMarket
            </span>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 text-sm text-white/50 mb-10">
            <div>
              <p className="text-white font-semibold mb-3">
                MT❤️Market
              </p>
              <p className="leading-relaxed">
                ตลาดซื้อขายมือสองที่ปลอดภัยที่สุดในประเทศไทย
                ด้วยระบบ Trust Score 10 มิติ
              </p>
            </div>
            <div>
              <p className="text-white font-semibold mb-3">
                บริการ
              </p>
              <ul className="space-y-2">
                {[
                  "เป็นตัวกลาง",
                  "Trust Score",
                  "ยืนยันตัวตน",
                  "ประกันสินค้า",
                  "แจ้งปัญหา",
                ].map((s) => (
                  <li
                    key={s}
                    className="hover:text-white/80 cursor-pointer transition-colors"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold mb-3">
                ช่วยเหลือ
              </p>
              <ul className="space-y-2">
                {[
                  "ศูนย์ช่วยเหลือ",
                  "นโยบายความเป็นส่วนตัว",
                  "ข้อกำหนดการใช้งาน",
                  "ติดต่อเรา",
                ].map((s) => (
                  <li
                    key={s}
                    className="hover:text-white/80 cursor-pointer transition-colors"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-xs text-white/30 text-center">
            © 2024 MTMarket. All rights reserved. ·
            ระบบตรวจสอบมิจฉาชีพที่ดีที่สุดในไทย
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================
// LISTING PAGE
// ============================================================

function ListingPage({
  setPage,
}: {
  setPage: (p: Page) => void;
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [expandedCheck, setExpandedCheck] = useState<
    string | null
  >("evasion");
  const [tab, setTab] = useState<"trust" | "reviews">("trust");

  const imgs = [
    {
      id: "photo-1512941937669-90a1b58e7e9c",
      alt: "iPhone 14 Pro Max front",
    },
    {
      id: "photo-1511707171634-5f897ff02aa9",
      alt: "iPhone 14 Pro Max back",
    },
    {
      id: "photo-1605745622-aae928d0b785",
      alt: "iPhone 14 Pro Max box",
    },
  ];

  const reviews = [
    {
      name: "สมชาย พ.",
      r: 5,
      date: "15 ส.ค. 2567",
      text: "สินค้าตรงตามรายละเอียดมากครับ ส่งเร็ว บรรจุภัณฑ์ดี แนะนำเลย",
    },
    {
      name: "นภาพร ว.",
      r: 4,
      date: "3 ส.ค. 2567",
      text: "ได้รับสินค้าภายใน 2 วัน สภาพดีตามที่บอก มีรอยเล็กน้อยที่ขอบ แต่โดยรวมดีมากค่ะ",
    },
    {
      name: "ธนภัทร ก.",
      r: 5,
      date: "28 ก.ค. 2567",
      text: "ขอบคุณมากครับ phone ใช้งานดีมาก ผู้ขายตอบรับไวมาก ซื้อซ้ำแน่นอน",
    },
    {
      name: "พิชชาภา ร.",
      r: 3,
      date: "12 ก.ค. 2567",
      text: "สินค้าโอเค แต่ใช้เวลาส่งนานกว่าที่บอก ตัวสินค้าใช้ได้ปกติค่ะ",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <button
            onClick={() => setPage("landing")}
            className="hover:text-foreground transition-colors"
          >
            หน้าแรก
          </button>
          <ChevronRight className="w-3 h-3" />
          <span>อิเล็กทรอนิกส์</span>
          <ChevronRight className="w-3 h-3" />
          <span>โทรศัพท์มือถือ</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">
            iPhone 14 Pro Max
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* ── Left Column ── */}
          <div>
            {/* Gallery */}
            <div className="mb-6">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-3 border border-border">
                <img
                  src={`https://images.unsplash.com/${imgs[activeImg].id}?w=700&h=700&fit=crop&auto=format`}
                  alt={imgs[activeImg].alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-3">
                {imgs.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? "border-primary shadow-md" : "border-transparent"}`}
                  >
                    <img
                      src={`https://images.unsplash.com/${img.id}?w=120&h=120&fit=crop&auto=format`}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-xs text-muted-foreground bg-muted">
                  +3 รูป
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-card rounded-2xl border border-border p-6 mb-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                      มือสอง
                    </span>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      สภาพ 9/10
                    </span>
                    <span className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full font-medium">
                      Space Black
                    </span>
                  </div>
                  <h1 className="font-display text-2xl font-bold text-foreground leading-tight">
                    iPhone 14 Pro Max 256GB Space Black
                  </h1>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button className="p-2 rounded-full hover:bg-muted transition-colors">
                    <Heart className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-muted transition-colors">
                    <Share2 className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-display font-bold text-4xl text-primary">
                  ฿24,500
                </span>
                <span className="text-muted-foreground line-through text-lg">
                  ฿26,000
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-sm font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ประหยัด 5.8%
                </span>
              </div>

              {/* Deal Score */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Tag className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-800 text-sm">
                    Great Deal ✓ — ราคาดี ไม่ต้องกังวล
                  </p>
                  <p className="text-xs text-emerald-700">
                    ต่ำกว่าราคาตลาด 5.8% (เฉลี่ย ฿26,000) —
                    ส่วนลดในช่วงปกติ ไม่ได้ถูกผิดปกติ
                  </p>
                </div>
              </div>

              {/* Evasion Warning */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800 text-sm mb-1">
                      ⚠️ ตรวจพบ: พยายามหลีกเลี่ยงแพลตฟอร์ม
                    </p>
                    <p className="text-xs text-red-700">
                      รายการนี้มีข้อความ{" "}
                      <span className="font-mono bg-red-100 px-1 rounded">
                        "Add Line for better price"
                      </span>{" "}
                      — การซื้อขายนอกระบบจะสูญเสียการคุ้มครองของ
                      MT❤️Market ทั้งหมด
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>
                    กรุงเทพมหานคร (สาทร) · จัดส่งทั่วไทย
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Truck className="w-4 h-4 flex-shrink-0" />
                  <span>
                    ค่าส่ง ฿50–120 · ส่งภายใน 1–2 วันทำการ ·
                    Kerry / Flash
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="w-4 h-4 flex-shrink-0" />
                  <span>
                    123 คนดูสินค้านี้วันนี้ · เพิ่มในตะกร้าแล้ว
                    8 คน
                  </span>
                </div>
              </div>
            </div>

            {/* Seller Card */}
            <div className="bg-card rounded-2xl border border-border p-6 mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                ผู้ขาย
              </p>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  L
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-foreground">
                      @techresell_lek
                    </span>
                    <BadgeCheck
                      className="w-4 h-4 text-blue-500 flex-shrink-0"
                      title="ยืนยันตัวตนแล้ว"
                    />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{" "}
                      4.7
                    </span>
                    <span>89 รายการขาย</span>
                    <span>เข้าร่วม 8 เดือน</span>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors">
                  ดูร้านค้า
                </button>
              </div>
              <div className="grid grid-cols-3 divide-x divide-border border border-border rounded-xl overflow-hidden">
                {[
                  { v: "89", l: "รายการขาย" },
                  { v: "4.7★", l: "คะแนนร้าน" },
                  { v: "13.5%", l: "อัตรารีวิว" },
                ].map((s, i) => (
                  <div key={i} className="text-center py-3">
                    <p className="font-mono font-bold text-foreground text-sm">
                      {s.v}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="flex border-b border-border">
                {(["trust", "reviews"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-4 text-sm font-semibold transition-colors ${tab === t ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {t === "trust"
                      ? "Trust Score Breakdown"
                      : "รีวิวผู้ซื้อ (12)"}
                  </button>
                ))}
              </div>

              {tab === "trust" ? (
                <div className="p-5 space-y-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    กดที่แต่ละรายการเพื่อดูรายละเอียด ·
                    แถบสีแดงคือความน่าสงสัย
                  </p>
                  {trustChecks.map((check) => (
                    <TrustCheckRow
                      key={check.id}
                      check={check}
                      expanded={expandedCheck === check.id}
                      onToggle={() =>
                        setExpandedCheck(
                          expandedCheck === check.id
                            ? null
                            : check.id,
                        )
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="p-5 space-y-5">
                  {reviews.map((rv, i) => (
                    <div
                      key={i}
                      className="flex gap-4 pb-5 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {rv.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">
                              {rv.name}
                            </span>
                            <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {rv.date}
                          </span>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {Array.from({ length: 5 }).map(
                            (_, j) => (
                              <Star
                                key={j}
                                className={`w-3.5 h-3.5 ${j < rv.r ? "text-amber-400 fill-amber-400" : "text-muted"}`}
                              />
                            ),
                          )}
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {rv.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Sticky Trust Panel ── */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xl">
              {/* Score Header */}
              <div className="bg-primary p-6 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-3">
                  MTMarket Trust Score
                </p>
                <TrustGauge score={TRUST_SCORE} size={170} />
                <div className="mt-4 flex items-center justify-center gap-2 bg-amber-500/20 rounded-full px-4 py-2">
                  <AlertCircle className="w-4 h-4 text-amber-300 flex-shrink-0" />
                  <p className="text-xs text-amber-200 font-medium">
                    ใช้ระบบชำระเงินของ MTMarket เพื่อความปลอดภัย
                  </p>
                </div>
              </div>

              {/* Quick Summary */}
              <div className="p-5 border-b border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  สรุปผลการตรวจสอบ
                </p>
                <div className="space-y-2.5">
                  {[
                    {
                      ok: true,
                      text: "ยืนยันตัวตนผ่าน DOPA แล้ว",
                    },
                    {
                      ok: true,
                      text: "Shopee 4.7★ · 234 รีวิว ✓",
                    },
                    {
                      ok: true,
                      text: "ไม่พบในฐานข้อมูลมิจฉาชีพ",
                    },
                    {
                      ok: false,
                      text: 'ตรวจพบ "Add Line" ในรายการ ⚠️',
                    },
                    {
                      ok: false,
                      text: "รูปสินค้า 1/6 อาจมาจากเว็บ ⚠️",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      {item.ok ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={
                          item.ok
                            ? "text-foreground"
                            : "text-amber-700 font-medium"
                        }
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score Breakdown Mini */}
              <div className="p-5 border-b border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  ภาพรวม 10 มิติ
                </p>
                <div className="space-y-2">
                  {trustChecks.slice(0, 5).map((c) => {
                    const high = c.suspicion >= 70;
                    const mid = c.suspicion >= 40 && !high;
                    const barColor = high
                      ? "bg-red-500"
                      : mid
                        ? "bg-amber-500"
                        : "bg-emerald-500";
                    return (
                      <div
                        key={c.id}
                        className="flex items-center gap-2"
                      >
                        <span className="text-xs text-muted-foreground w-28 truncate">
                          {c.nameTh}
                        </span>
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${barColor}`}
                            style={{ width: `${c.suspicion}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground w-7 text-right">
                          {c.suspicion}%
                        </span>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => setTab("trust")}
                    className="text-xs text-primary hover:underline mt-1"
                  >
                    ดูทั้ง 10 มิติ →
                  </button>
                </div>
              </div>

              {/* CTA */}
              <div className="p-5 space-y-3">
                <button
                  onClick={() => setPage("payment")}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-md"
                >
                  <Lock className="w-4 h-4" /> ซื้อเลย
                </button>
                <button className="w-full bg-secondary text-foreground py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors border border-border">
                  <MessageSquare className="w-4 h-4" />{" "}
                  แชทกับผู้ขาย
                </button>
                <p className="text-center text-xs text-muted-foreground leading-relaxed">
                  ซื้อผ่าน MT❤️Market รับประกันคืนเงิน 100%
                  <br />
                  หากสินค้าไม่ตรงตามที่โฆษณา
                </p>
              </div>

              {/* Report */}
              <div className="px-5 pb-5">
                <button className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-red-600 transition-colors py-2 rounded-lg hover:bg-red-50">
                  <Flag className="w-3.5 h-3.5" />{" "}
                  รายงานรายการที่น่าสงสัย
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SELLER SIGNUP PAGE
// ============================================================

function SellerSignupPage({
  setPage,
}: {
  setPage: (p: Page) => void;
}) {
  const [step, setStep] = useState<SignupStep>(1);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    agreeTerms: false,
    idNumber: "",
    storeName: "",
    category: "",
    description: "",
    shopee: "",
    lazada: "",
    facebook: "",
    isBrand: false,
    brandRegNo: "",
  });
  const [shopeeOk, setShopeeOk] = useState(false);
  const [lazadaOk, setLazadaOk] = useState(false);
  const [fbOk, setFbOk] = useState(false);
  const [idChecking, setIdChecking] = useState(false);
  const [idOk, setIdOk] = useState(false);

  const steps = [
    { n: 1, title: "สร้างบัญชี", sub: "Create Account" },
    { n: 2, title: "ยืนยันตัวตน", sub: "ID Verification" },
    {
      n: 3,
      title: "เชื่อมต่อแพลตฟอร์ม",
      sub: "Link Platforms",
    },
    { n: 4, title: "ข้อมูลร้านค้า", sub: "Store Profile" },
    { n: 5, title: "ตรวจสอบและส่ง", sub: "Review & Submit" },
  ];

  const estimateScore = () => {
    let s = 30;
    if (form.fullName && form.email && form.phone) s += 8;
    if (idOk) s += 25;
    if (shopeeOk) s += 15;
    if (lazadaOk || fbOk) s += 8;
    if (form.storeName && form.category) s += 5;
    if (form.isBrand && form.brandRegNo) s += 10;
    return Math.min(s, 95);
  };

  const score = estimateScore();
  const scoreColor =
    score >= 75
      ? "text-emerald-500"
      : score >= 50
        ? "text-amber-500"
        : "text-red-500";
  const barColor =
    score >= 75
      ? "bg-emerald-500"
      : score >= 50
        ? "bg-amber-500"
        : "bg-red-500";

  const simulateVerify = (p: "shopee" | "lazada" | "fb") => {
    setTimeout(() => {
      if (p === "shopee") setShopeeOk(true);
      if (p === "lazada") setLazadaOk(true);
      if (p === "fb") setFbOk(true);
    }, 1500);
  };

  const simulateId = () => {
    if (form.idNumber.length < 13) return;
    setIdChecking(true);
    setTimeout(() => {
      setIdChecking(false);
      setIdOk(true);
    }, 2500);
  };

  const inputClass =
    "w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all disabled:opacity-50";

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <button
            onClick={() => setPage("landing")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> กลับหน้าแรก
          </button>
          <h1 className="font-display text-3xl font-bold text-foreground">
            สมัครเป็นผู้ขาย
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            ทุกขั้นตอนที่คุณทำ Trust Score จะเพิ่มขึ้น —
            ผู้ซื้อเห็นทันที
          </p>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* ── Sidebar ── */}
          <div className="space-y-4">
            {/* Step List */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                ขั้นตอน
              </p>
              <div className="space-y-1">
                {steps.map((s) => {
                  const done = s.n < step;
                  const active = s.n === step;
                  return (
                    <button
                      key={s.n}
                      onClick={() =>
                        done && setStep(s.n as SignupStep)
                      }
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${active ? "bg-primary/10" : done ? "hover:bg-emerald-50" : "cursor-default"}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${active ? "bg-primary text-white" : done ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}
                      >
                        {done ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          s.n
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-semibold leading-tight ${active ? "text-primary" : done ? "text-emerald-700" : "text-muted-foreground"}`}
                        >
                          {s.title}
                        </p>
                        <p
                          className={`text-[11px] font-mono ${active ? "text-primary/60" : "text-muted-foreground"}`}
                        >
                          {s.sub}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trust Score Estimator */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Trust Score โดยประมาณ
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span
                  className={`font-mono text-4xl font-bold ${scoreColor}`}
                >
                  {score}
                </span>
                <span className="text-muted-foreground text-sm">
                  /100
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <div className="space-y-2">
                {[
                  {
                    label: "ยืนยัน DOPA",
                    done: idOk,
                    pts: "+25",
                  },
                  {
                    label: "เชื่อม Shopee",
                    done: shopeeOk,
                    pts: "+15",
                  },
                  {
                    label: "เชื่อมแพลตฟอร์มอื่น",
                    done: lazadaOk || fbOk,
                    pts: "+8",
                  },
                  {
                    label: "Brand Badge",
                    done: form.isBrand && !!form.brandRegNo,
                    pts: "+10",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-1.5">
                      {item.done ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-muted" />
                      )}
                      <span
                        className={
                          item.done
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        {item.label}
                      </span>
                    </div>
                    <span className="font-mono text-emerald-600 font-semibold">
                      {item.pts}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Main Form Panel ── */}
          <div className="bg-card rounded-2xl border border-border p-7 sm:p-9">
            {/* Step 1 */}
            {step === 1 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                  สร้างบัญชีผู้ขาย
                </h2>
                <p className="text-muted-foreground text-sm mb-8">
                  กรอกข้อมูลพื้นฐานเพื่อเริ่มต้น
                </p>
                <div className="space-y-5 max-w-md">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      ชื่อ-นามสกุล (ภาษาไทย) *
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fullName: e.target.value,
                        })
                      }
                      placeholder="เช่น เล็กทอง วรกุล"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      อีเมล *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          email: e.target.value,
                        })
                      }
                      placeholder="your@email.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      เบอร์โทรศัพท์ *
                    </label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 bg-input-background border border-border rounded-xl px-3 py-3 text-sm text-muted-foreground flex-shrink-0">
                        🇹🇭 <span>+66</span>
                      </div>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            phone: e.target.value,
                          })
                        }
                        placeholder="081-234-5678"
                        className={inputClass}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      เบอร์นี้จะถูกตรวจสอบกับฐานข้อมูลมิจฉาชีพไทย
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      รหัสผ่าน *
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          password: e.target.value,
                        })
                      }
                      placeholder="อย่างน้อย 8 ตัวอักษร"
                      className={inputClass}
                    />
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.agreeTerms}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          agreeTerms: e.target.checked,
                        })
                      }
                      className="mt-0.5 w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      ฉันยอมรับ{" "}
                      <span className="text-primary underline">
                        ข้อกำหนดการใช้งาน
                      </span>{" "}
                      และ{" "}
                      <span className="text-primary underline">
                        นโยบายความเป็นส่วนตัว
                      </span>{" "}
                      รวมถึงการตรวจสอบตัวตนตามพระราชบัญญัติข้อมูลส่วนบุคคล
                      (PDPA)
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                  ยืนยันตัวตน
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  ต้องใช้บัตรประชาชนไทย
                  เพื่อสร้างความน่าเชื่อถือให้ผู้ซื้อทุกคน
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 mb-7">
                  <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    ข้อมูลส่วนตัวเข้ารหัสด้วย AES-256
                    และใช้เพื่อการยืนยันตัวตนเท่านั้น
                    ไม่เปิดเผยต่อสาธารณะ
                  </p>
                </div>

                {idOk ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="font-display text-xl font-bold text-emerald-800 mb-2">
                      ยืนยันตัวตนสำเร็จ!
                    </h3>
                    <p className="text-emerald-700 text-sm mb-4">
                      ชื่อ: เล็กทอง วรกุล · บัตรประชาชน ผ่าน
                      DOPA แล้ว
                    </p>
                    <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 px-5 py-2.5 rounded-full">
                      <BadgeCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-700">
                        Trust Score +25 คะแนน
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5 max-w-md">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">
                        เลขบัตรประชาชน 13 หลัก *
                      </label>
                      <input
                        type="text"
                        value={form.idNumber}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            idNumber: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 13),
                          })
                        }
                        placeholder="X XXXX XXXXX XX X"
                        className={`${inputClass} font-mono tracking-widest`}
                      />
                      {form.idNumber.length > 0 &&
                        form.idNumber.length < 13 && (
                          <p className="text-xs text-amber-600 mt-1">
                            กรอกให้ครบ 13 หลัก (
                            {form.idNumber.length}/13)
                          </p>
                        )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">
                        รูปบัตรประชาชน (ด้านหน้า) *
                      </label>
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 cursor-pointer bg-input-background hover:bg-secondary/50 transition-all">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-foreground font-medium">
                          คลิกอัปโหลด หรือลากวาง
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG, PNG ขนาดไม่เกิน 5MB
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">
                        เซลฟี่ถือบัตรประชาชน *
                      </label>
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 cursor-pointer bg-input-background hover:bg-secondary/50 transition-all">
                        <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-foreground font-medium">
                          ถ่ายเซลฟี่พร้อมบัตร
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ต้องเห็นใบหน้าและตัวหนังสือในบัตรชัดเจน
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={simulateId}
                      disabled={
                        idChecking || form.idNumber.length < 13
                      }
                      className="w-full bg-primary text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {idChecking ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          กำลังตรวจสอบกับระบบ DOPA...
                        </>
                      ) : (
                        <>
                          <Fingerprint className="w-5 h-5" />{" "}
                          ยืนยันตัวตน
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                  เชื่อมต่อแพลตฟอร์มอื่น
                </h2>
                <p className="text-muted-foreground text-sm mb-8">
                  ประวัติจากแพลตฟอร์มอื่นช่วยเพิ่ม Trust Score
                  และสร้างความมั่นใจให้ผู้ซื้อ
                </p>
                <div className="space-y-4 max-w-md">
                  {[
                    {
                      key: "shopee" as const,
                      label: "Shopee",
                      emoji: "🛒",
                      pts: "+15",
                      ok: shopeeOk,
                      val: form.shopee,
                      ph: "shopee.co.th/yourshop",
                      onVerify: () => simulateVerify("shopee"),
                      onChange: (v: string) =>
                        setForm({ ...form, shopee: v }),
                    },
                    {
                      key: "lazada" as const,
                      label: "Lazada",
                      emoji: "🏪",
                      pts: "+8",
                      ok: lazadaOk,
                      val: form.lazada,
                      ph: "lazada.co.th/shop/yourshop",
                      onVerify: () => simulateVerify("lazada"),
                      onChange: (v: string) =>
                        setForm({ ...form, lazada: v }),
                    },
                    {
                      key: "fb" as const,
                      label: "Facebook Marketplace",
                      emoji: "👥",
                      pts: "+8",
                      ok: fbOk,
                      val: form.facebook,
                      ph: "facebook.com/yourprofile",
                      onVerify: () => simulateVerify("fb"),
                      onChange: (v: string) =>
                        setForm({ ...form, facebook: v }),
                    },
                  ].map((p) => (
                    <div
                      key={p.key}
                      className={`bg-card border rounded-xl p-5 transition-colors ${p.ok ? "border-emerald-200 bg-emerald-50/30" : "border-border"}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-lg">
                          {p.emoji}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground text-sm">
                            {p.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {p.ok
                              ? "ยืนยันแล้ว ✓"
                              : `Trust Score ${p.pts}`}
                          </p>
                        </div>
                        {p.ok && (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={p.val}
                          onChange={(e) =>
                            p.onChange(e.target.value)
                          }
                          placeholder={p.ph}
                          disabled={p.ok}
                          className={`${inputClass} flex-1`}
                        />
                        <button
                          onClick={p.onVerify}
                          disabled={p.ok || !p.val}
                          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex-shrink-0 ${p.ok ? "bg-emerald-100 text-emerald-700 cursor-default" : "bg-primary text-white hover:bg-primary/90 disabled:opacity-40"}`}
                        >
                          {p.ok ? "ยืนยันแล้ว" : "ตรวจสอบ"}
                        </button>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    ข้ามได้ แต่ Trust Score จะน้อยกว่า
                  </p>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                  ข้อมูลร้านค้า
                </h2>
                <p className="text-muted-foreground text-sm mb-8">
                  บอกผู้ซื้อให้รู้จักร้านของคุณ
                </p>
                <div className="space-y-5 max-w-md">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      ชื่อร้านค้า *
                    </label>
                    <input
                      type="text"
                      value={form.storeName}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          storeName: e.target.value,
                        })
                      }
                      placeholder="เช่น TechResell by Lek"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      หมวดหมู่หลัก *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          category: e.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      <option value="">เลือกหมวดหมู่</option>
                      <option value="electronics">
                        📱 อิเล็กทรอนิกส์
                      </option>
                      <option value="fashion">
                        👗 แฟชั่นและเครื่องแต่งกาย
                      </option>
                      <option value="home">
                        🏠 บ้านและของตกแต่ง
                      </option>
                      <option value="sports">
                        ⚽ กีฬาและออกกำลังกาย
                      </option>
                      <option value="books">
                        📚 หนังสือและการศึกษา
                      </option>
                      <option value="vehicles">
                        🚗 ยานพาหนะและอะไหล่
                      </option>
                      <option value="collectibles">
                        🎨 ของสะสมและงานศิลป์
                      </option>
                      <option value="services">🛠 บริการ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      คำอธิบายร้านค้า
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          description: e.target.value,
                        })
                      }
                      placeholder="เล่าเกี่ยวกับสินค้าที่ขายและประสบการณ์ของคุณ..."
                      rows={4}
                      className={`${inputClass} resize-none`}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      คำอธิบายที่ดีช่วยเพิ่มความน่าเชื่อถือกับผู้ซื้อ
                    </p>
                  </div>

                  {/* Brand Badge Section */}
                  <div
                    className={`border rounded-xl p-5 transition-all ${form.isBrand ? "border-amber-300 bg-amber-50/50" : "border-border"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            Brand Verification Badge
                          </p>
                          <p className="text-xs text-muted-foreground">
                            สำหรับธุรกิจและแบรนด์ที่จดทะเบียน
                            รับ +10 Trust Score
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setForm({
                            ...form,
                            isBrand: !form.isBrand,
                          })
                        }
                        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${form.isBrand ? "bg-amber-500" : "bg-muted"}`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isBrand ? "translate-x-5" : "translate-x-0.5"}`}
                        />
                      </button>
                    </div>
                    {form.isBrand && (
                      <div className="mt-4 space-y-3">
                        <input
                          type="text"
                          value={form.brandRegNo}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              brandRegNo: e.target.value,
                            })
                          }
                          placeholder="เลขทะเบียนพาณิชย์ หรือเลขนิติบุคคล"
                          className={inputClass}
                        />
                        <div className="border-2 border-dashed border-amber-300 rounded-xl p-5 text-center cursor-pointer hover:bg-amber-50 transition-colors">
                          <Upload className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
                          <p className="text-sm text-amber-800 font-medium">
                            อัปโหลดหนังสือรับรองบริษัท
                          </p>
                          <p className="text-xs text-amber-600 mt-0.5">
                            ทีมงานตรวจสอบภายใน 7–14 วันทำการ
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5 */}
            {step === 5 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                  ตรวจสอบและส่งคำขอ
                </h2>
                <p className="text-muted-foreground text-sm mb-8">
                  ตรวจสอบข้อมูลทั้งหมดก่อนเปิดร้านค้า
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    {
                      s: 1,
                      title: "ข้อมูลบัญชี",
                      ok: !!(
                        form.fullName &&
                        form.email &&
                        form.phone
                      ),
                      rows: [
                        { l: "ชื่อ", v: form.fullName || "—" },
                        { l: "อีเมล", v: form.email || "—" },
                        {
                          l: "โทร",
                          v: form.phone
                            ? `+66 ${form.phone}`
                            : "—",
                        },
                      ],
                    },
                    {
                      s: 2,
                      title: "ยืนยันตัวตน",
                      ok: idOk,
                      rows: [
                        {
                          l: "สถานะ",
                          v: idOk
                            ? "ผ่าน DOPA แล้ว ✓"
                            : "ยังไม่ยืนยัน",
                        },
                      ],
                    },
                    {
                      s: 3,
                      title: "แพลตฟอร์ม",
                      ok: shopeeOk || lazadaOk || fbOk,
                      rows: [
                        {
                          l: "Shopee",
                          v: shopeeOk
                            ? "ยืนยันแล้ว ✓"
                            : form.shopee || "—",
                        },
                        {
                          l: "Lazada",
                          v: lazadaOk
                            ? "ยืนยันแล้ว ✓"
                            : "ไม่ได้เชื่อม",
                        },
                        {
                          l: "Facebook",
                          v: fbOk
                            ? "ยืนยันแล้ว ✓"
                            : "ไม่ได้เชื่อม",
                        },
                      ],
                    },
                    {
                      s: 4,
                      title: "ข้อมูลร้านค้า",
                      ok: !!(form.storeName && form.category),
                      rows: [
                        {
                          l: "ชื่อร้าน",
                          v: form.storeName || "—",
                        },
                        {
                          l: "หมวดหมู่",
                          v: form.category || "—",
                        },
                        {
                          l: "Brand Badge",
                          v:
                            form.isBrand && form.brandRegNo
                              ? "สมัครแล้ว (รอตรวจสอบ)"
                              : "ไม่สมัคร",
                        },
                      ],
                    },
                  ].map((section) => (
                    <div
                      key={section.s}
                      className={`rounded-xl border p-4 ${section.ok ? "border-emerald-200 bg-emerald-50/40" : "border-amber-200 bg-amber-50/30"}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {section.ok ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                          )}
                          <span className="font-semibold text-sm text-foreground">
                            {section.title}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            setStep(section.s as SignupStep)
                          }
                          className="text-xs text-primary hover:underline"
                        >
                          แก้ไข
                        </button>
                      </div>
                      <div className="space-y-1">
                        {section.rows.map((row, i) => (
                          <div
                            key={i}
                            className="flex gap-2 text-xs"
                          >
                            <span className="text-muted-foreground w-24 flex-shrink-0">
                              {row.l}:
                            </span>
                            <span
                              className={`${row.v.includes("✓") ? "text-emerald-700 font-semibold" : row.v === "—" || row.v.includes("ไม่ได้") || row.v.includes("ยังไม่") ? "text-amber-700" : "text-foreground"}`}
                            >
                              {row.v}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Final Score Display */}
                <div className="bg-primary rounded-2xl p-7 text-center mb-6">
                  <p className="text-blue-300 text-sm mb-2">
                    Trust Score เริ่มต้นของร้านคุณ
                  </p>
                  <p
                    className={`font-mono text-6xl font-bold mb-1 ${score >= 75 ? "text-emerald-300" : score >= 50 ? "text-amber-300" : "text-red-300"}`}
                  >
                    {score}
                  </p>
                  <p className="text-blue-200 text-sm">
                    /100 —{" "}
                    {score >= 75
                      ? "เชื่อถือได้มาก"
                      : score >= 50
                        ? "ปานกลาง ยังเพิ่มได้"
                        : "ต้องยืนยันเพิ่มเติม"}
                  </p>
                  <p className="text-blue-300/70 text-xs mt-3">
                    คะแนนจะเพิ่มขึ้นเรื่อย ๆ
                    เมื่อมียอดขายและรีวิวจากผู้ซื้อ
                  </p>
                </div>

                <button
                  className="w-full text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg mb-3"
                  style={{ backgroundColor: "#FF5722" }}
                >
                  <ShieldCheck className="w-5 h-5" />{" "}
                  เปิดร้านค้าและรับ Trust Badge
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  MTMarket จะส่งอีเมลยืนยันภายใน 24 ชั่วโมง
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-10 pt-8 border-t border-border">
              <button
                onClick={() =>
                  step > 1 && setStep((step - 1) as SignupStep)
                }
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors ${step === 1 ? "invisible" : ""}`}
              >
                <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
              </button>
              {step < 5 && (
                <button
                  onClick={() =>
                    setStep((step + 1) as SignupStep)
                  }
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
                >
                  ถัดไป <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FAKE QR CODE (PromptPay visual)
// ============================================================

function FakeQR() {
  const n = 21;
  const sz = 180;
  const cs = sz / n;

  const cell = (r: number, c: number): boolean => {
    if (r < 7 && c < 7) {
      if (r === 0 || r === 6 || c === 0 || c === 6) return true;
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    if (r < 7 && c >= 14) {
      const cc = c - 14;
      if (r === 0 || r === 6 || cc === 0 || cc === 6) return true;
      if (r >= 2 && r <= 4 && cc >= 2 && cc <= 4) return true;
      return false;
    }
    if (r >= 14 && c < 7) {
      const rr = r - 14;
      if (rr === 0 || rr === 6 || c === 0 || c === 6) return true;
      if (rr >= 2 && rr <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    if (r === 6) return c % 2 === 0;
    if (c === 6) return r % 2 === 0;
    if (r >= 16 && r <= 18 && c >= 16 && c <= 18) {
      if (r === 16 || r === 18 || c === 16 || c === 18 || (r === 17 && c === 17)) return true;
      return false;
    }
    return (r * 17 + c * 13 + r * c * 3) % 7 < 3;
  };

  return (
    <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} className="rounded-xl">
      <rect width={sz} height={sz} fill="white" />
      {Array.from({ length: n }, (_, r) =>
        Array.from({ length: n }, (_, c) =>
          cell(r, c) ? (
            <rect
              key={`${r}-${c}`}
              x={c * cs + 0.5}
              y={r * cs + 0.5}
              width={cs - 0.5}
              height={cs - 0.5}
              fill="#0B1633"
              rx="0.5"
            />
          ) : null
        )
      )}
    </svg>
  );
}

// ============================================================
// PAYMENT PAGE — หน้าจ่ายตังค์
// ============================================================

function PaymentPage({ setPage }: { setPage: (p: Page) => void }) {
  const [method, setMethod] = useState<"promptpay" | "bank" | "card">("promptpay");
  const [timeLeft, setTimeLeft] = useState(600);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (paid || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [paid, timeLeft]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const expired = timeLeft <= 0;

  const itemPrice = 24500;
  const shipping = 80;
  const escrowFee = Math.round(itemPrice * 0.015);
  const total = itemPrice + shipping + escrowFee;

  if (paid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">ชำระเงินสำเร็จ!</h2>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            เงิน <strong className="text-foreground">฿{total.toLocaleString()}</strong> ถูกเก็บใน Escrow อย่างปลอดภัย
            <br />รอผู้ขายจัดส่งสินค้าให้คุณ
          </p>
          <div className="bg-card border border-border rounded-2xl p-5 mb-6 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">หมายเลขออเดอร์</p>
            <p className="font-mono font-bold text-foreground text-lg">ORD-2024-08221234</p>
            <p className="text-xs text-muted-foreground mt-1">22 ส.ค. 2567 · 10:31 น.</p>
          </div>
          <button
            onClick={() => setPage("confirm")}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-md mb-3"
          >
            <Package className="w-5 h-5" /> ติดตามออเดอร์
          </button>
          <button onClick={() => setPage("landing")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            กลับหน้าแรก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-4 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button onClick={() => setPage("listing")} className="p-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="font-display font-bold text-foreground text-lg leading-tight">ชำระเงิน</h1>
            <p className="text-xs text-muted-foreground">ปลอดภัยด้วยระบบ Escrow</p>
          </div>
          <div
            className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono font-bold transition-colors ${
              expired
                ? "bg-red-100 text-red-700"
                : timeLeft < 120
                ? "bg-amber-100 text-amber-700"
                : "bg-muted text-foreground"
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            {expired ? "หมดเวลา" : `${mins}:${secs}`}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Left: Payment method */}
          <div className="space-y-5">
            {/* Method Selector */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="p-5 border-b border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">เลือกวิธีชำระเงิน</p>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      { key: "promptpay", label: "PromptPay", emoji: "📱", sub: "QR Code" },
                      { key: "bank", label: "โอนเงิน", emoji: "🏦", sub: "ธนาคาร" },
                      { key: "card", label: "บัตร", emoji: "💳", sub: "Credit/Debit" },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setMethod(m.key)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                        method === m.key
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <span className="text-2xl">{m.emoji}</span>
                      <span className={`text-xs font-semibold ${method === m.key ? "text-primary" : "text-foreground"}`}>{m.label}</span>
                      <span className="text-[10px] text-muted-foreground">{m.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PromptPay Panel */}
              {method === "promptpay" && (
                <div className="p-6 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">PromptPay</span>
                    <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">พร้อมเพย์</span>
                  </div>
                  <div className="bg-white border-4 border-primary/15 rounded-2xl p-4 mb-4 shadow-inner">
                    <FakeQR />
                  </div>
                  <p className="text-sm font-semibold text-foreground">MT❤️Market Escrow</p>
                  <p className="text-xs text-muted-foreground mb-3">PromptPay · 0-2345-6789</p>
                  <div className="bg-primary rounded-full px-6 py-2 mb-4">
                    <span className="text-white font-mono font-bold text-xl">฿{total.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center max-w-xs leading-relaxed">
                    สแกน QR ด้วยแอปธนาคารของคุณ — เงินเข้าระบบ Escrow โดยตรง ไม่ถึงมือผู้ขาย
                  </p>
                </div>
              )}

              {/* Bank Transfer Panel */}
              {method === "bank" && (
                <div className="p-5 space-y-3">
                  <p className="text-sm text-muted-foreground mb-1">โอนเงินเข้าบัญชี Escrow ของ MTMarket พร้อมหมายเลขอ้างอิง</p>
                  {[
                    { bank: "ธนาคารกสิกรไทย (KBank)", acc: "123-4-56789-0", color: "bg-green-50 border-green-200 text-green-900" },
                    { bank: "ธนาคารไทยพาณิชย์ (SCB)", acc: "123-456789-0", color: "bg-violet-50 border-violet-200 text-violet-900" },
                    { bank: "ธนาคารกรุงเทพ (BBL)", acc: "101-9-12345-6", color: "bg-blue-50 border-blue-200 text-blue-900" },
                  ].map((b, i) => (
                    <div key={i} className={`rounded-xl border p-4 ${b.color}`}>
                      <p className="text-xs font-semibold mb-1 opacity-70">{b.bank}</p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono font-bold">{b.acc}</p>
                        <button className="flex items-center gap-1 text-xs font-medium opacity-60 hover:opacity-100 transition-opacity">
                          <Copy className="w-3.5 h-3.5" /> คัดลอก
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-xs text-amber-800 font-semibold">หมายเลขอ้างอิง (ต้องใส่ในช่อง "ข้อความ/หมายเหตุ")</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="font-mono font-bold text-amber-900">REF-2024-08221234</p>
                      <button className="text-xs text-amber-700 flex items-center gap-1 hover:opacity-70 transition-opacity">
                        <Copy className="w-3.5 h-3.5" /> คัดลอก
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">โอนจำนวน <strong>฿{total.toLocaleString()}</strong> พอดี · อัปโหลดสลิปหลังโอน</p>
                </div>
              )}

              {/* Card Panel */}
              {method === "card" && (
                <div className="p-5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">หมายเลขบัตร</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm font-mono pr-12 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1.5">วันหมดอายุ</label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1.5">CVV</label>
                        <input
                          type="text"
                          placeholder="•••"
                          className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">ชื่อบนบัตร</label>
                      <input
                        type="text"
                        placeholder="SOMCHAI PHONGSAK"
                        className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>SSL 256-bit · ไม่บันทึกข้อมูลบัตร · PCI-DSS Compliant</span>
                  </div>
                </div>
              )}
            </div>

            {/* Escrow explanation */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex gap-4">
              <Shield className="w-8 h-8 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm mb-1">เงินของคุณปลอดภัยใน Escrow</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  MTMarket เก็บเงินไว้แทนคุณ — จะโอนให้ผู้ขายก็ต่อเมื่อคุณกด "ยืนยันรับสินค้า" เท่านั้น
                  หากสินค้าไม่ตรงตามที่โฆษณา เราคืนเงินเต็มจำนวน
                </p>
              </div>
            </div>
          </div>

          {/* Right: Order summary (sticky) */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            {/* Product card */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="flex gap-4 p-5 border-b border-border">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=160&h=160&fit=crop&auto=format"
                    alt="iPhone 14 Pro Max"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm leading-snug mb-1">iPhone 14 Pro Max 256GB Space Black</p>
                  <p className="text-xs text-muted-foreground mb-2">@techresell_lek · สภาพ 9/10</p>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      <Shield className="w-3 h-3 text-amber-600" />
                      <span className="text-[11px] font-bold text-amber-700">Trust 65</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">Moderate Risk</span>
                  </div>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">สรุปราคา</p>
                <div className="space-y-2.5 text-sm">
                  {[
                    { l: "ราคาสินค้า", v: `฿${itemPrice.toLocaleString()}` },
                    { l: "ค่าจัดส่ง (Kerry Express)", v: `฿${shipping}` },
                    { l: "ค่าบริการ Escrow (1.5%)", v: `฿${escrowFee.toLocaleString()}` },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-muted-foreground">{row.l}</span>
                      <span className="font-medium text-foreground">{row.v}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2.5 flex justify-between items-center">
                    <span className="font-bold text-foreground">ยอดชำระทั้งหมด</span>
                    <span className="font-display font-bold text-xl text-primary">฿{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => setPaid(true)}
              disabled={expired}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Lock className="w-5 h-5" />
              {expired ? "หมดเวลาชำระเงิน" : `ยืนยันชำระเงิน ฿${total.toLocaleString()}`}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              เงินจะถูกเก็บใน Escrow — ไม่ถึงมือผู้ขายจนกว่าคุณจะยืนยันรับสินค้า
            </p>

            {/* Trust warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                ผู้ขายรายนี้ Trust Score <strong>65/100</strong> — ตรวจพบวลี "Add Line" ในรายการ
                <strong className="text-red-700"> ห้ามจ่ายเงินนอกระบบ</strong> ใช้ Escrow เท่านั้น
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CONFIRM RECEIPT PAGE — หน้าติ๊กรับสินค้า
// ============================================================

function ConfirmReceiptPage({ setPage }: { setPage: (p: Page) => void }) {
  const [checks, setChecks] = useState([false, false, false, false]);
  const [confirmed, setConfirmed] = useState(false);
  const [rating, setRating] = useState(0);
  const [dispute, setDispute] = useState(false);
  const [timeLeft, setTimeLeft] = useState(71 * 3600 + 32 * 60 + 45);

  useEffect(() => {
    if (confirmed || dispute || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [confirmed, dispute, timeLeft]);

  const hh = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const mm = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  const allChecked = checks.every(Boolean);

  const toggleCheck = (i: number) => {
    const next = [...checks];
    next[i] = !next[i];
    setChecks(next);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="w-28 h-28 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <PackageCheck className="w-14 h-14 text-emerald-500" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">ยืนยันรับสินค้าแล้ว!</h2>
          <p className="text-muted-foreground mb-1 text-sm">
            เงิน <strong className="text-foreground text-base">฿24,500</strong> ถูกโอนให้ผู้ขาย @techresell_lek แล้ว
          </p>
          <p className="text-xs text-muted-foreground font-mono mb-8">ORD-2024-08221234 · 24 ส.ค. 2567</p>

          {/* Rating card */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-4 text-left">
            <p className="font-display font-semibold text-foreground mb-1 text-center">ให้คะแนนผู้ขาย</p>
            <p className="text-xs text-muted-foreground text-center mb-4">รีวิวของคุณช่วยผู้ซื้อท่านอื่นตัดสินใจ</p>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)} className="transition-transform hover:scale-110 active:scale-95">
                  <Star className={`w-9 h-9 transition-colors ${n <= rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
            <textarea
              placeholder="เล่าประสบการณ์ให้ผู้ซื้อท่านอื่นฟัง... (ไม่บังคับ)"
              rows={3}
              className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            <button className="w-full mt-3 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
              ส่งรีวิว
            </button>
          </div>
          <button onClick={() => setPage("landing")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            กลับหน้าแรก
          </button>
        </div>
      </div>
    );
  }

  const timeline = [
    { label: "สั่งซื้อสำเร็จ", sub: "22 ส.ค. 2567 · 10:23 น.", done: true, active: false },
    { label: "ชำระเงินเข้า Escrow", sub: "22 ส.ค. 2567 · 10:31 น.", done: true, active: false },
    { label: "ผู้ขายจัดส่งแล้ว", sub: "23 ส.ค. 2567 · 09:15 น.", done: true, active: false },
    { label: "อยู่ระหว่างการจัดส่ง", sub: "Kerry Express · TH123456789", done: false, active: true },
    { label: "รอยืนยันรับสินค้า", sub: `เหลือเวลา ${hh}:${mm}:${ss}`, done: false, active: false },
  ];

  const checkLabels = [
    "สภาพสินค้าตรงตามที่โฆษณา (9/10 ไม่มีรอยที่ไม่ได้แจ้ง)",
    "ครบชิ้นส่วนตามที่ระบุ (กล่อง, สายชาร์จ, หูฟัง)",
    "ทดสอบแล้ว iPhone เปิดได้และใช้งานได้ปกติ",
    "ไม่มีความเสียหายที่ซ่อนเร้นหรือไม่ได้แจ้ง",
  ];

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-4 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={() => setPage("listing")} className="p-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="font-display font-bold text-foreground text-lg leading-tight">ยืนยันรับสินค้า</h1>
            <p className="text-xs text-muted-foreground font-mono">ORD-2024-08221234</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700">Escrow Active</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        {/* Escrow status banner */}
        <div className="bg-primary rounded-2xl p-5 flex items-center gap-4 text-white shadow-md">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">เงิน ฿24,500 อยู่ใน Escrow อย่างปลอดภัย</p>
            <p className="text-xs text-blue-200 mt-0.5 leading-relaxed">
              จะโอนให้ผู้ขายหลังคุณยืนยันรับสินค้า หรือคืนให้คุณหากแจ้งปัญหา
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-mono font-bold text-lg leading-tight">{hh}:{mm}:{ss}</p>
            <p className="text-[10px] text-blue-300">เหลือเวลา</p>
          </div>
        </div>

        {/* Order timeline */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">สถานะออเดอร์</p>
          {timeline.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors ${
                    step.done
                      ? "bg-emerald-500"
                      : step.active
                      ? "bg-primary ring-4 ring-primary/20"
                      : "bg-muted border-2 border-border"
                  }`}
                >
                  {step.done ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : step.active ? (
                    <Truck className="w-4 h-4 text-white" />
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                {i < timeline.length - 1 && (
                  <div className={`w-0.5 h-10 my-0.5 ${step.done ? "bg-emerald-200" : "bg-border"}`} />
                )}
              </div>
              <div className="flex-1 pb-1 pt-1">
                <p
                  className={`text-sm font-semibold leading-tight ${
                    step.done ? "text-foreground" : step.active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </p>
                <p
                  className={`text-xs mt-0.5 ${
                    step.active ? "text-primary/80 font-mono" : "text-muted-foreground"
                  }`}
                >
                  {step.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery tracking */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">ติดตามพัสดุ</p>
            <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-semibold">Kerry Express</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-mono font-bold text-foreground text-sm">TH 123 456 789 00</p>
              <p className="text-xs text-muted-foreground">หมายเลขพัสดุ</p>
            </div>
            <button className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
              <Copy className="w-3.5 h-3.5" /> คัดลอก
            </button>
          </div>
          <div className="bg-muted/40 rounded-xl p-4 space-y-3">
            {[
              { time: "24 ส.ค. 09:41 น.", loc: "ศูนย์กระจายพัสดุ ดอนเมือง กรุงเทพฯ", active: true },
              { time: "24 ส.ค. 06:15 น.", loc: "รับพัสดุจากผู้ส่ง สาขาลาดพร้าว", active: false },
              { time: "23 ส.ค. 16:30 น.", loc: "ผู้ส่งนำส่งพัสดุที่จุดรับ Kerry", active: false },
            ].map((t, i) => (
              <div key={i} className="flex gap-3 text-xs">
                <div className="flex flex-col items-center pt-0.5">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.active ? "bg-primary" : "bg-border"}`} />
                  {i < 2 && <div className="w-px flex-1 bg-border mt-1 mb-1" style={{ minHeight: "20px" }} />}
                </div>
                <div className="pb-2">
                  <p className={`font-semibold ${t.active ? "text-primary" : "text-muted-foreground"}`}>{t.loc}</p>
                  <p className="text-muted-foreground font-mono mt-0.5">{t.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product summary */}
        <div className="bg-card rounded-2xl border border-border p-5 flex gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=160&h=160&fit=crop&auto=format"
              alt="iPhone"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground text-sm mb-1">iPhone 14 Pro Max 256GB Space Black</p>
            <p className="text-xs text-muted-foreground mb-2">@techresell_lek · สภาพ 9/10</p>
            <p className="font-display font-bold text-primary text-lg">฿24,500</p>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">ตรวจสอบก่อนยืนยัน</p>
          <p className="text-xs text-muted-foreground mb-4">ติ๊กให้ครบทุกข้อก่อนกดยืนยัน — เพื่อความปลอดภัยของคุณ</p>
          <div className="space-y-3">
            {checkLabels.map((label, i) => (
              <button
                key={i}
                onClick={() => toggleCheck(i)}
                className="flex items-start gap-3 w-full text-left group"
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    checks[i] ? "bg-emerald-500 border-emerald-500" : "border-border group-hover:border-primary/50"
                  }`}
                >
                  {checks[i] && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm leading-relaxed transition-colors ${checks[i] ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
          {allChecked && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <p className="text-sm text-emerald-700 font-medium">ครบทุกข้อแล้ว — พร้อมยืนยันรับสินค้า!</p>
            </div>
          )}
        </div>

        {/* Dispute form (expandable) */}
        {dispute && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <p className="font-semibold text-amber-800">แจ้งปัญหากับ MTMarket</p>
            </div>
            <textarea
              rows={4}
              placeholder="อธิบายปัญหาที่พบ เช่น สินค้าชำรุด, ไม่ครบ, ไม่ตรงรายละเอียด..."
              className="w-full bg-white border border-amber-300 rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none mb-3"
            />
            <div className="flex gap-3">
              <button className="flex-1 bg-amber-500 text-white py-2.5 rounded-xl font-bold hover:bg-amber-600 transition-colors text-sm">
                ส่งเรื่องร้องเรียน
              </button>
              <button
                onClick={() => setDispute(false)}
                className="flex-1 bg-white border border-amber-300 text-amber-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-amber-50 transition-colors"
              >
                ยกเลิก
              </button>
            </div>
            <p className="text-xs text-amber-700 text-center mt-3 leading-relaxed">
              ทีม MTMarket จะตรวจสอบและติดต่อกลับภายใน 24 ชั่วโมง
              <br />เงินยังอยู่ใน Escrow ระหว่างการพิจารณา
            </p>
          </div>
        )}
      </div>

      {/* Sticky CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border p-4 z-40">
        <div className="max-w-3xl mx-auto flex gap-3">
          <button
            onClick={() => setDispute((d) => !d)}
            className="flex-1 bg-muted text-foreground py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-muted/70 transition-colors border border-border"
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            แจ้งปัญหา
          </button>
          <button
            onClick={() => allChecked && setConfirmed(true)}
            disabled={!allChecked}
            className="flex-[2] bg-emerald-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <PackageCheck className="w-5 h-5" />
            {allChecked ? "ยืนยันรับสินค้า" : `ติ๊กให้ครบก่อน (${checks.filter(Boolean).length}/4)`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// APP
// ============================================================

export default function App() {
  const [page, setPage] = useState<Page>("landing");

  return (
    <div className="min-h-screen bg-background">
      {page !== "payment" && page !== "confirm" && <Nav setPage={setPage} />}
      {page === "landing" && <LandingPage setPage={setPage} />}
      {page === "listing" && <ListingPage setPage={setPage} />}
      {page === "signup" && <SellerSignupPage setPage={setPage} />}
      {page === "payment" && <PaymentPage setPage={setPage} />}
      {page === "confirm" && <ConfirmReceiptPage setPage={setPage} />}
    </div>
  );
}