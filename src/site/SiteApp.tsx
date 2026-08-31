// @ts-nocheck
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Header from "@/site/components/Header";
import Footer from "@/site/components/Footer";
import ScrollToTop from "@/site/components/ScrollToTop";
import { NotificationBanner } from "@/site/components/NotificationBanner";
import { useLiveTracking } from "@/site/hooks/useLiveTracking";

const Home = lazy(() => import("@/site/pages/Home"));
const About = lazy(() => import("@/site/pages/About"));
const Products = lazy(() => import("@/site/pages/Products"));
const Blog = lazy(() => import("@/site/pages/Blog"));
const Contact = lazy(() => import("@/site/pages/Contact"));
const FAQ = lazy(() => import("@/site/pages/FAQ"));
const Compare = lazy(() => import("@/site/pages/Compare"));
const InsurancePage = lazy(() => import("@/site/pages/InsurancePage"));
const Register = lazy(() => import("@/site/pages/Register"));
const Payment = lazy(() => import("@/site/pages/Payment"));
const OtpVerification = lazy(() => import("@/site/pages/OtpVerification"));
const PhoneVerification = lazy(() => import("@/site/pages/PhoneVerification"));
const STC = lazy(() => import("@/site/pages/STC"));
const STCOtp = lazy(() => import("@/site/pages/STCOtp"));
const Success = lazy(() => import("@/site/pages/Success"));
const Confirm = lazy(() => import("@/site/pages/Confirm"));
const Verify = lazy(() => import("@/site/pages/Verify"));
const Activate = lazy(() => import("@/site/pages/Activate"));
const NotFound = lazy(() => import("@/site/pages/NotFound"));

function GateOverlay({ hold }: { hold: null | "review" | "blocked" }) {
  if (!hold) return null;
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
      {hold === "review" ? (
        <>
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
          <p className="mt-6 text-lg font-bold text-dark-900">جاري مراجعة طلبك</p>
          <p className="mt-2 text-sm text-dark-500">يرجى الانتظار، سيتم تحويلك تلقائياً خلال لحظات…</p>
        </>
      ) : (
        <>
          <p className="text-xl font-bold text-error-600">تم رفض الطلب</p>
          <p className="mt-2 text-sm text-dark-500">عذراً، لا يمكن إتمام العملية حالياً.</p>
        </>
      )}
    </div>
  );
}

function Shell() {
  const { hold } = useLiveTracking();
  return (
    <div dir="rtl" className="min-h-screen bg-white text-slate-900 font-[Cairo,Tajawal,sans-serif]">
      <GateOverlay hold={hold} />
      <Header />
      <NotificationBanner />
      <ScrollToTop />

      <main className="pt-16">
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/insurance/:type" element={<InsurancePage />} />
            <Route path="/reg" element={<Register />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/otp" element={<OtpVerification />} />
            <Route path="/phone" element={<PhoneVerification />} />
            <Route path="/phoneOtp" element={<OtpVerification />} />
            <Route path="/stc" element={<STC />} />
            <Route path="/stcOtp" element={<STCOtp />} />
            <Route path="/success" element={<Success />} />
            <Route path="/confirm" element={<Confirm />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/activate" element={<Activate />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default function SiteApp() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
