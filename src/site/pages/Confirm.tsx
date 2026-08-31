// @ts-nocheck
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, ArrowLeft, ShieldCheck, FileText, Download, Printer } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Confirm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16 md:pt-20">
        <div className="text-center">
          <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary-600" />
          <h2 className="mt-6 text-xl font-bold text-dark-900">جاري معالجة طلبك...</h2>
          <p className="mt-2 text-sm text-dark-500">جاري التواصل مع نظام نفاذ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-success-50 via-white to-primary-50 pt-16 md:pt-20 py-12">
      <div className="container-x">
        <div className="mx-auto max-w-lg">
          <div className="animate-bounce-in rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-dark-200/60 md:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success-100">
              <CheckCircle2 className="h-12 w-12 text-success-600" />
            </div>

            <h1 className="mt-6 text-2xl font-extrabold text-dark-900">التحقق من الطلب</h1>
            <p className="mt-3 text-dark-500">
              تم تأكيد طلبك بنجاح. تم ربط وثيقة التأمين بشريحة الجوال الخاصة بك.
            </p>

            <div className="mt-6 rounded-2xl bg-dark-50 p-6 text-right">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-dark-900">
                <FileText className="h-5 w-5 text-primary-600" />
                تفاصيل المعاملة:
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-500">رقم الطلب</span>
                  <span className="font-semibold text-dark-900" dir="ltr">BC-2026-0098765</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-500">حالة الطلب</span>
                  <span className="font-semibold text-success-600">مؤكد</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-500">ربط نفاذ</span>
                  <span className="font-semibold text-success-600">مكتمل</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl bg-success-50 p-4 text-right">
              <ShieldCheck className="h-5 w-5 flex-shrink-0 text-success-600" />
              <p className="text-xs text-dark-600">
                تم ربط وثيقتك بنظام المرور ونجم بنجاح. ستصلك رسالة نصية بتفاصيل الوثيقة.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="btn-secondary !py-2.5 !text-sm">
                <Download className="h-4 w-4" />
                تحميل الوثيقة
              </button>
              <button className="btn-secondary !py-2.5 !text-sm">
                <Printer className="h-4 w-4" />
                طباعة
              </button>
            </div>

            <button
              onClick={() => navigate('/')}
              className="btn-primary mt-4 w-full"
            >
              العودة للرئيسية
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
