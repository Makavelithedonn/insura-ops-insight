import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Car, HeartPulse, Plane, Users, Stethoscope, Truck,
  ArrowLeft, Check, Shield, Star, Clock, Zap, Phone,
  Loader2, AlertCircle, FileText,
} from 'lucide-react';
import { insuranceTypes, carBrands, saudiCities } from '@/site/data/insurance';
import { getStoredApplicationId, submitStep, resumeApplication, createApplication, updateCurrentStep } from '@/site/lib/api';
import { canEditStep } from '@/site/lib/api';
import type { ApplicationStep } from '@/site/lib/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  car: Car,
  'heart-pulse': HeartPulse,
  plane: Plane,
  users: Users,
  stethoscope: Stethoscope,
  truck: Truck,
};

const pageContent: Record<string, { title: string; subtitle: string; benefits: string[]; image: string }> = {
  car: {
    title: 'تأمين المركبات',
    subtitle: 'قارن أسعار تأمين السيارات من أكثر من 20 شركة تأمين في السعودية. تأمين شامل أو ضد الغير مع إصدار فوري وربط مباشر بنجم.',
    benefits: [
      'تغطية الأضرار المادية والطبيعية للمركبة',
      'تغطية الحوادث الشخصية للسائق والركاب',
      'تغطية السرقة والحريق',
      'إصلاح في الوكالة',
      'خدمة طوارئ على الطريق',
      'تغطية دول مجلس التعاون الخليجي',
    ],
    image: 'https://images.pexels.com/photos/10999980/pexels-photo-10999980.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  medical: {
    title: 'التأمين الطبي',
    subtitle: 'حماية صحية لك ولعائلتك بأفضل الأسعار. اختر من خطط تأمين طبي متنوعة تناسب احتياجاتك.',
    benefits: [
      'تغطية الزيارات الطبية',
      'تغطية الفحوصات والتحاليل',
      'تغطية الأدوية',
      'تغطية العمليات الجراحية',
      'تغطية طب الأسنان',
      'تغطية طب العيون',
    ],
    image: 'https://images.pexels.com/photos/7163950/pexels-photo-7163950.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  travel: {
    title: 'تأمين السفر',
    subtitle: 'سافر بأمان مع تغطية شاملة لرحلاتك. تأمين سفر يحميك من الطوارئ أثناء سفرك.',
    benefits: [
      'تغطية المصاريف الطبية في الخارج',
      'تغطية إلغاء الرحلة',
      'تغطية فقدان الأمتعة',
      'تغطية تأخر الرحلات',
      'مساعدة طارئة على مدار الساعة',
      'تغطية المسؤولية المدنية',
    ],
    image: 'https://images.pexels.com/photos/14989848/pexels-photo-14989848.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  domestic: {
    title: 'تأمين العمالة المنزلية',
    subtitle: 'تأمين شامل لعمالك المنزليين وفقاً لأنظمة المملكة العربية السعودية.',
    benefits: [
      'تغطية المصاريف الطبية',
      'تغطية الإصابات الشخصية',
      'تغطية المسؤولية المدنية',
      'تغطية إعادة العامل',
      'تغطية الفقدان أو الهروب',
      'إصدار فوري',
    ],
    image: 'https://images.pexels.com/photos/38096888/pexels-photo-38096888.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  'medical-malpractice': {
    title: 'تأمين الأخطاء الطبية',
    subtitle: 'حماية مهنية للممارسين الصحيين ضد مخاطر الأخطاء الطبية.',
    benefits: [
      'تغطية المطالبات الناتجة عن الأخطاء الطبية',
      'تغطية المصاريف القانونية',
      'تغطية التعويضات',
      'حماية مهنية شاملة',
      'إصدار سريع',
      'خطط مرنة',
    ],
    image: 'https://images.pexels.com/photos/39192334/pexels-photo-39192334.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  transport: {
    title: 'تأمين نقل البضائع',
    subtitle: 'تغطية شاملة للبضائع أثناء النقل البري والبحري والجوي.',
    benefits: [
      'تغطية تلف أو فقدان البضائع',
      'تغطية حوادث النقل',
      'تغطية نقل المشتقات النفطية',
      'تغطية نقل الركاب',
      'خطط مرنة للشركات',
      'إصدار فوري',
    ],
    image: 'https://images.pexels.com/photos/35068847/pexels-photo-35068847.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
};

export default function InsurancePage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const insuranceType = insuranceTypes.find((t) => t.id === type);
  const content = pageContent[type || 'car'] || pageContent.car;
  const Icon = iconMap[insuranceType?.icon || 'car'] || Car;

  const [form, setForm] = useState({
    nationalId: '',
    phone: '',
    carBrand: '',
    carModel: '',
    year: '',
    city: '',
    insuranceType: 'شامل',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/compare?type=${type || 'car'}`);
  };

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={content.image} alt={content.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-primary-950/95 via-primary-900/85 to-primary-800/70" />
        </div>
        <div className="container-x relative z-10 py-16 md:py-24">
          <div className="max-w-2xl animate-slide-up">
            <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ${insuranceType?.color || 'text-white'}`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-white md:text-5xl">{content.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-primary-100">{content.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-primary-100">
                <Zap className="h-5 w-5 text-accent-400" />
                إصدار فوري
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-100">
                <Shield className="h-5 w-5 text-accent-400" />
                معتمد من هيئة التأمين
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-100">
                <Clock className="h-5 w-5 text-accent-400" />
                مقارنة في دقائق
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-x py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-dark-200/60 md:p-8">
              <h2 className="mb-2 text-2xl font-bold text-dark-900">أدخل بياناتك</h2>
              <p className="mb-6 text-sm text-dark-500">جميع البيانات مطلوبة</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark-700">
                      رقم الهوية الوطنية / الإقامة
                    </label>
                    <input
                      type="text"
                      value={form.nationalId}
                      onChange={(e) => setForm({ ...form, nationalId: e.target.value })}
                      placeholder="مثال: 1234567890"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark-700">
                      رقم الجوال
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="05xxxxxxxx"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark-700">
                      ماركة و موديل السيارة
                    </label>
                    <select
                      value={form.carBrand}
                      onChange={(e) => setForm({ ...form, carBrand: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="">اختر الماركة</option>
                      {carBrands.map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark-700">
                      سنة صنع المركبة
                    </label>
                    <select
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="">اختر السنة</option>
                      {Array.from({ length: 15 }, (_, i) => 2024 - i).map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark-700">
                      المدينة
                    </label>
                    <select
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="">اختر المدينة</option>
                      {saudiCities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark-700">
                      نوع التأمين
                    </label>
                    <select
                      value={form.insuranceType}
                      onChange={(e) => setForm({ ...form, insuranceType: e.target.value })}
                      className="input-field"
                    >
                      <option value="شامل">تأمين شامل</option>
                      <option value="ضد الغير">تأمين ضد الغير</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-xl bg-primary-50 p-4">
                  <label className="flex items-start gap-3 text-sm text-dark-700">
                    <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-primary-300 text-primary-600" />
                    <span>
                      أوافق على منح شركة بيكير الحق في الاستعلام من شركة نجم و/أو مركز المعلومات
                      الوطني عن بياناتي
                    </span>
                  </label>
                </div>

                <button type="submit" className="btn-primary w-full">
                  إظهار العروض
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-white shadow-lg">
              <Shield className="h-10 w-10 text-white/80" />
              <h3 className="mt-4 text-lg font-bold">المزايا الأساسية</h3>
              <ul className="mt-4 space-y-3">
                {content.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-sm text-primary-100">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-400" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card text-center">
              <Phone className="mx-auto h-10 w-10 text-primary-600" />
              <h3 className="mt-3 text-lg font-bold text-dark-900">تحتاج مساعدة؟</h3>
              <p className="mt-2 text-sm text-dark-500">فريقنا جاهز لمساعدتك</p>
              <a href="tel:920000000" className="btn-secondary mt-4 w-full" dir="ltr">
                920 000 000
              </a>
            </div>

            <div className="card">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-accent-400 text-accent-400" />
                <span className="font-bold text-dark-900">4.8 من 5</span>
              </div>
              <p className="mt-2 text-sm text-dark-500">
                بناءً على تقييمات أكثر من 500,000 عميل
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Other Insurance Types */}
      <section className="section-padding bg-dark-50">
        <div className="container-x">
          <h2 className="mb-8 text-2xl font-bold text-dark-900">منتجات أخرى</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {insuranceTypes
              .filter((t) => t.id !== type)
              .slice(0, 3)
              .map((t) => {
                const OtherIcon = iconMap[t.icon] || Car;
                return (
                  <Link key={t.id} to={`/insurance/${t.id}`} className="group card hover:scale-[1.02]">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${t.bgColor} ${t.color}`}>
                      <OtherIcon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-dark-900">{t.name}</h3>
                    <p className="mt-1 text-sm text-dark-500">{t.description}</p>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
}
