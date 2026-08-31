// @ts-nocheck
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Check, ChevronDown, Shield, Layers, Eye, Sparkles, Zap, BadgeCheck } from 'lucide-react';
import { insuranceCompanies } from '@/site/data/insurance';
import heroImage from '@/site/assets/becaree-hero.png';

const PLANS = [
  {
    type: 'شامل',
    badge: 'أفضل تغطية',
    title: 'التأمين الشامل',
    desc: 'يوفر حماية شاملة لمركبتك ضد الحوادث والسرقة والكوارث الطبيعية وأضرار الغير.',
    items: [
      'الحماية من أضرار الحوادث',
      'تغطية أضرار الغير',
      'الكوارث الطبيعية',
      'السرقة والحريق',
      'خدمة المساعدة على الطريق',
      'إصلاح المركبة داخل الوكالة',
    ],
  },
  {
    type: 'ضد الغير',
    badge: 'التغطية الأساسية',
    title: 'ضد الغير',
    desc: 'التغطية الأساسية المطلوبة لحماية مسؤوليتك تجاه الطرف الآخر.',
    items: [
      'تغطية الأضرار التي تلحق بالغير',
      'متوافق مع متطلبات المرور',
      'إصدار فوري للوثيقة',
    ],
  },
  {
    type: 'ضد الغير بلس',
    badge: 'التغطية المحسنة',
    title: 'ضد الغير بلس',
    desc: 'حماية ضد الغير مع مزايا إضافية تمنحك راحة ومرونة أكبر.',
    items: [
      'تغطية موسعة لأضرار الغير',
      'منافع إضافية اختيارية',
      'مساعدة على الطريق',
    ],
  },
];

const WHY = [
  { icon: Shield, title: 'الأمان في المملكة', desc: 'منصة تأمين معتمدة تجمع أنواع التأمين المناسبة في مكان واحد.' },
  { icon: Layers, title: 'وحدة وثائق التأمين', desc: 'قارن بين خيارات متعددة من شركات التأمين واختر الوثيقة الأنسب لسيارتك.' },
  { icon: Eye, title: 'الشفافية والوضوح', desc: 'نأخذ بيدك ونبسط لك تفاصيل كل تغطية لتختار وأنت مطمئن.' },
  { icon: Sparkles, title: 'الخبرة التقنية والاستشارية', desc: 'رحلة شراء سهلة تجمع خبرتنا التقنية بمعرفتنا بقطاع التأمين.' },
  { icon: Zap, title: 'المتابعة الأسرع لعروض التأمين', desc: 'استعرض خيارات متعددة واتخذ قرارك بخطوات واضحة وسريعة.' },
  { icon: BadgeCheck, title: 'تسعير موحّد وواضح', desc: 'اعرف السعر والتغطية بوضوح قبل إكمال عملية الشراء.' },
];

const FAQS = [
  { q: 'التأمين ضروري لتجديد الاستمارة؟', a: 'نعم، يشترط نظام المرور وجود وثيقة تأمين سارية لتجديد رخصة سير المركبة.' },
  { q: 'كيف أعرف خصم «نجم» حقي؟', a: 'يُحسب الخصم تلقائياً من سجل مطالباتك في نظام نجم ويظهر ضمن عرض السعر.' },
  { q: 'وش نظام الرصد الآلي الجديد 2026؟', a: 'نظام يربط المخالفات المرورية مباشرة بوثيقة التأمين لتحديد الأسعار بشكل عادل.' },
  { q: 'أقدر ألغي التأمين وأرجع فلوسي؟', a: 'يمكن إلغاء الوثيقة خلال المدة النظامية واسترداد المبلغ المتبقي بعد خصم أيام الاستخدام.' },
  { q: 'هل هيئة التأمين توحّد الأسعار؟', a: 'الأسعار تختلف بحسب الشركة والتغطية، وهيئة التأمين تراقب العدالة والشفافية فقط.' },
  { q: 'كم مدة صلاحية وثيقة التأمين؟', a: 'وثيقة التأمين على المركبة سارية عادةً لمدة سنة كاملة من تاريخ الإصدار.' },
];

export default function Home() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="bg-gradient-to-b from-primary-50/60 via-white to-white">
      {/* Hero */}
      <section className="bg-primary-50">
        <div className="container-x flex min-h-[560px] max-w-3xl flex-col items-center justify-center py-8 text-center md:py-12">
          <img
            src={heroImage}
            alt="عميل سعودي بجانب سيارة مؤمّنة"
            className="h-auto w-full max-w-xl object-contain"
          />
          <div className="mx-auto -mt-3 max-w-2xl">
            <h1 className="text-3xl font-extrabold leading-[1.45] text-dark-900 md:text-5xl">
              أول منصة لتأمين السيارات في السعودية
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-dark-500 md:text-base">
              جميع منتجات وخدمات التأمين من مزودين موثوقين. قارن الأسعار والتغطيات واختر وثيقتك المناسبة.
            </p>
            <Link
              to="/insurance/car"
              className="mx-auto mt-6 flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-primary-600/30 transition-all hover:bg-primary-700"
            >
              ابدأ الآن
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Partner strip */}
      <section className="border-y border-dark-100 bg-white py-5">
        <div className="container-x flex max-w-3xl flex-wrap items-center justify-around gap-4 text-center">
          {insuranceCompanies.slice(0, 4).map((c) => (
            <div key={c.id} className="flex items-center gap-2 text-xs font-bold text-dark-500 md:text-sm">
              <Shield className="h-5 w-5 shrink-0 text-primary-600" />
              <span className="truncate">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="container-x mt-16 md:mt-24">
        <div className="mb-8 text-center">
          <div className="text-sm font-semibold text-primary-600">اختر نوع تأمينك</div>
          <h2 className="mt-2 text-2xl font-extrabold text-dark-900 md:text-3xl">تغطية تناسب احتياجك</h2>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.type}
              className="rounded-3xl border-2 border-primary-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary-300 hover:shadow-xl"
            >
              <div className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                {p.badge}
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-dark-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-500">{p.desc}</p>
              <Link
                to={`/insurance/car?type=${encodeURIComponent(p.type)}`}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-primary-700"
              >
                ابدأ الآن
              </Link>
              <ul className="mt-5 space-y-2.5 text-sm">
                {p.items.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-dark-700">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="container-x mt-16 md:mt-24">
        <div className="mb-10 text-center">
          <div className="text-sm font-semibold text-primary-600">لماذا نحن؟</div>
          <h2 className="mt-2 text-2xl font-extrabold text-dark-900 md:text-3xl">اختر راحة تأمينك بذكاء</h2>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {WHY.map((w) => (
            <div key={w.title} className="rounded-2xl bg-white p-5 ring-1 ring-dark-100 transition-all hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <w.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-base font-bold text-dark-900">{w.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-dark-500">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x mt-16 pb-20 md:mt-24 md:pb-28">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold text-dark-900 md:text-3xl">الأسئلة الشائعة</h2>
          <p className="mt-2 text-sm text-dark-500">إجابات سريعة على أكثر الأسئلة شيوعاً عن تأمين المركبات</p>
        </div>
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="rounded-2xl border border-dark-100 bg-white">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
                >
                  <ChevronDown className={`h-5 w-5 text-primary-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  <span className="flex-1 text-sm font-bold text-dark-900 md:text-base">{f.q}</span>
                </button>
                {isOpen && (
                  <div className="border-t border-dark-100 px-5 py-4 text-sm leading-relaxed text-dark-500">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
