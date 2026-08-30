export type WorkflowStep =
  | "quote_landing"
  | "customer_info"
  | "vehicle_info"
  | "insurer_selected"
  | "offer_review"
  | "payment"
  | "confirmation"
  | "completed";

export const WORKFLOW_STEPS: { key: WorkflowStep; label: string }[] = [
  { key: "quote_landing", label: "Quote / Landing" },
  { key: "customer_info", label: "Customer information" },
  { key: "vehicle_info", label: "Vehicle information" },
  { key: "insurer_selected", label: "Insurer selected" },
  { key: "offer_review", label: "Offer review" },
  { key: "payment", label: "Payment" },
  { key: "confirmation", label: "Confirmation" },
  { key: "completed", label: "Completed" },
];

export function stepLabel(step: WorkflowStep) {
  return WORKFLOW_STEPS.find((s) => s.key === step)?.label ?? step;
}

export type SessionStatus = "active" | "pending_review" | "completed" | "closed" | "rejected";
export type QuoteStatus = "new" | "in_progress" | "pending" | "completed" | "rejected";

export interface AdminSession {
  sessionId: string;
  quoteId: string;
  customerName: string;
  nationalId: string;
  phone: string;
  vehicleMake: string;
  vehicleModel: string;
  modelYear: number;
  vehicleDetails: string;
  declaredValue: number;
  insuranceCompany: string;
  insuranceOffer: string;
  quoteStatus: QuoteStatus;
  currentStep: WorkflowStep;
  status: SessionStatus;
  createdAt: string;
  lastActivity: string;
  /** Set when an admin has reviewed the submitted documents for the current step. */
  reviewDecision: "pending" | "accepted" | "rejected";
  reviewNote?: string;
}

export function maskNationalId(value: string) {
  if (value.length <= 4) return "••••";
  return `${value.slice(0, 2)}${"•".repeat(Math.max(value.length - 4, 2))}${value.slice(-2)}`;
}

export function maskPhone(value: string) {
  const digits = value.replace(/\s/g, "");
  if (digits.length <= 4) return "••••";
  return `${digits.slice(0, 4)} ••• ${digits.slice(-2)}`;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-JO", {
    style: "currency",
    currency: "JOD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const minutesAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString();

export const SEED_SESSIONS: AdminSession[] = [
  {
    sessionId: "SES-84213",
    quoteId: "QT-2026-0841",
    customerName: "Omar Al-Rashid",
    nationalId: "9891023447",
    phone: "0791 234 887",
    vehicleMake: "Toyota",
    vehicleModel: "Corolla",
    modelYear: 2021,
    vehicleDetails: "1.6L · Sedan · Private use",
    declaredValue: 14500,
    insuranceCompany: "Jordan Insurance",
    insuranceOffer: "Comprehensive – Standard",
    quoteStatus: "in_progress",
    currentStep: "customer_info",
    status: "pending_review",
    createdAt: minutesAgo(38),
    lastActivity: minutesAgo(2),
    reviewDecision: "pending",
  },
  {
    sessionId: "SES-84210",
    quoteId: "QT-2026-0838",
    customerName: "Lina Haddad",
    nationalId: "9942118803",
    phone: "0776 550 214",
    vehicleMake: "Hyundai",
    vehicleModel: "Tucson",
    modelYear: 2023,
    vehicleDetails: "2.0L · SUV · Private use",
    declaredValue: 26800,
    insuranceCompany: "Arab Orient",
    insuranceOffer: "Comprehensive – Plus",
    quoteStatus: "pending",
    currentStep: "offer_review",
    status: "active",
    createdAt: minutesAgo(75),
    lastActivity: minutesAgo(6),
    reviewDecision: "accepted",
  },
  {
    sessionId: "SES-84205",
    quoteId: "QT-2026-0833",
    customerName: "Yousef Nabulsi",
    nationalId: "9870044521",
    phone: "0799 812 630",
    vehicleMake: "Kia",
    vehicleModel: "Sportage",
    modelYear: 2019,
    vehicleDetails: "1.6T · SUV · Private use",
    declaredValue: 18200,
    insuranceCompany: "Euro Arab",
    insuranceOffer: "Third Party – Extended",
    quoteStatus: "in_progress",
    currentStep: "vehicle_info",
    status: "pending_review",
    createdAt: minutesAgo(120),
    lastActivity: minutesAgo(11),
    reviewDecision: "pending",
  },
  {
    sessionId: "SES-84199",
    quoteId: "QT-2026-0827",
    customerName: "Rana Qasem",
    nationalId: "9963320017",
    phone: "0785 447 002",
    vehicleMake: "Nissan",
    vehicleModel: "Sunny",
    modelYear: 2020,
    vehicleDetails: "1.5L · Sedan · Private use",
    declaredValue: 11250,
    insuranceCompany: "Jordan Insurance",
    insuranceOffer: "Comprehensive – Standard",
    quoteStatus: "completed",
    currentStep: "completed",
    status: "completed",
    createdAt: minutesAgo(320),
    lastActivity: minutesAgo(48),
    reviewDecision: "accepted",
  },
  {
    sessionId: "SES-84186",
    quoteId: "QT-2026-0819",
    customerName: "Fadi Zaqtan",
    nationalId: "9812277640",
    phone: "0770 331 985",
    vehicleMake: "Mercedes-Benz",
    vehicleModel: "C200",
    modelYear: 2018,
    vehicleDetails: "2.0L · Sedan · Private use",
    declaredValue: 31500,
    insuranceCompany: "Arab Orient",
    insuranceOffer: "Comprehensive – Premium",
    quoteStatus: "pending",
    currentStep: "payment",
    status: "active",
    createdAt: minutesAgo(210),
    lastActivity: minutesAgo(14),
    reviewDecision: "accepted",
  },
  {
    sessionId: "SES-84180",
    quoteId: "QT-2026-0812",
    customerName: "Salma Odeh",
    nationalId: "9905561288",
    phone: "0798 220 471",
    vehicleMake: "Volkswagen",
    vehicleModel: "Golf",
    modelYear: 2017,
    vehicleDetails: "1.4T · Hatchback · Private use",
    declaredValue: 9800,
    insuranceCompany: "Euro Arab",
    insuranceOffer: "Third Party",
    quoteStatus: "new",
    currentStep: "quote_landing",
    status: "active",
    createdAt: minutesAgo(9),
    lastActivity: minutesAgo(1),
    reviewDecision: "pending",
  },
  {
    sessionId: "SES-84174",
    quoteId: "QT-2026-0806",
    customerName: "Tareq Bishara",
    nationalId: "9887712045",
    phone: "0791 004 338",
    vehicleMake: "Ford",
    vehicleModel: "Explorer",
    modelYear: 2022,
    vehicleDetails: "3.0L · SUV · Private use",
    declaredValue: 42000,
    insuranceCompany: "Jordan Insurance",
    insuranceOffer: "Comprehensive – Premium",
    quoteStatus: "rejected",
    currentStep: "customer_info",
    status: "rejected",
    createdAt: minutesAgo(400),
    lastActivity: minutesAgo(180),
    reviewDecision: "rejected",
    reviewNote: "National ID did not match uploaded document.",
  },
  {
    sessionId: "SES-84165",
    quoteId: "QT-2026-0798",
    customerName: "Dina Masri",
    nationalId: "9934480091",
    phone: "0777 615 209",
    vehicleMake: "Mazda",
    vehicleModel: "CX-5",
    modelYear: 2021,
    vehicleDetails: "2.5L · SUV · Private use",
    declaredValue: 23400,
    insuranceCompany: "Arab Orient",
    insuranceOffer: "Comprehensive – Standard",
    quoteStatus: "in_progress",
    currentStep: "insurer_selected",
    status: "active",
    createdAt: minutesAgo(150),
    lastActivity: minutesAgo(22),
    reviewDecision: "accepted",
  },
];

export function nextStep(step: WorkflowStep): WorkflowStep {
  const i = WORKFLOW_STEPS.findIndex((s) => s.key === step);
  return WORKFLOW_STEPS[Math.min(i + 1, WORKFLOW_STEPS.length - 1)]?.key ?? step;
}
