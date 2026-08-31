import { Link } from 'react-router-dom';
import { CheckCircle, Download, Printer, Home, FileText } from 'lucide-react';

export default function Success() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-success-50 via-white to-primary-50 pt-16 md:pt-20">
      <div className="container-x">
        <div className="mx-auto max-w-lg">
          <div className="animate-bounce-in rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-dark-200/60 md:p-12">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-success-100">
              <CheckCircle className="h-14 w-14 text-success-600" />
            </div>

            <h1 className="mt-6 text-3xl font-extrabold text-dark-900">تم تسجيل بيانات الوثيقة بنجاح!</h1>
            <p className="mt-3 text-dark-500">
              تم إصدار وثيقة التأمين الخاصة بك بنجاح وربطها مع نظام المرور ونجم.
              ستصلك نسخة على بريدك الإلكتروني ورسالة نصية على جوالك.
            </p>

            <div className="mt-8 rounded-2xl bg-dark-50 p-6 text-right">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-500">رقم الوثيقة</span>
                  <span className="font-bold text-dark-900" dir="ltr">BC-2026-0098765</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-500">شركة التأمين</span>
                  <span className="font-bold text-dark-900">التعاونية</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-500">نوع التأمين</span>
                  <span className="font-bold text-dark-900">تأمين شامل</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-500">تاريخ بدء التأمين</span>
                  <span className="font-bold text-dark-900">27 أغسطس 2026</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-500">تاريخ انتهاء التأمين</span>
                  <span className="font-bold text-dark-900">26 أغسطس 2027</span>
                </div>
                <div className="flex justify-between border-t border-dark-200 pt-3">
                  <span className="font-bold text-dark-900">المبلغ المدفوع</span>
                  <span className="font-extrabold text-primary-600">1,667 ر.س</span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <button className="btn-secondary !py-2.5 !text-sm">
                <Download className="h-4 w-4" />
                تحميل الوثيقة
              </button>
              <button className="btn-secondary !py-2.5 !text-sm">
                <Printer className="h-4 w-4" />
                اطبع وثيقتك
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/" className="btn-primary flex-1">
                <Home className="h-5 w-5" />
                العودة للرئيسية
              </Link>
              <Link
                to="/contact"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-dark-700 ring-1 ring-dark-200 transition-all hover:bg-dark-50"
              >
                <FileText className="h-5 w-5" />
                تواصل معنا
              </Link>
            </div>

            <p className="mt-6 text-xs text-dark-400">
              جميع الحقوق محفوظة، شركة بيكير لوساطة التأمين © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
