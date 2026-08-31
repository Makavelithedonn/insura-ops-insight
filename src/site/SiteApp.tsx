// @ts-nocheck
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Header from "@/site/components/Header";
import Footer from "@/site/components/Footer";
import ScrollToTop from "@/site/components/ScrollToTop";
import NotificationBanner from "@/site/components/NotificationBanner";
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

function Shell() {
  useLiveTracking();
  return (
    <div dir="rtl" className="min-h-screen bg-white text-slate-900 font-[Cairo,Tajawal,sans-serif]">
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
