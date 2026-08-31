import { Link } from 'react-router-dom';
import {
  Shield, Award, Users2, Building2, Target, Eye,
  Heart, Zap, TrendingDown, Check, ArrowLeft, Phone,
} from 'lucide-react';
import { insuranceCompanies } from '@/data/insurance';

export default function About() {
  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-l from-primary-800 to-primary-950 py-16 md:py-24">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-secondary-500/10 blur-3xl" />
        <div className="container-x relative z-10 text-center">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">عن بيكير</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            المنصة الأذكى لمقارنة عروض تأمين السيارات في السعودية. نساعدك في الحصول على
            أفضل تأمين بأقل سعر وبأسرع وقت.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="-mt-12 relative z-20">
        <div className="container-x">
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-dark-200/60 md:grid-cols-4 md:p-8">
            {[
              { icon: Building2, value: '+20', label: 'شركة تأمين شريكة' },
              { icon: Users2, value: '+500K', label: 'عميل سعيد' },
              { icon: Award, value: '+1M', label: 'وثيقة مصدرة' },
              { icon: Zap, value: 'دقائق', label: 'وقت الإصدار' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <stat.icon className="h-7 w-7" />
                </div>
                <div className="mt-3 text-2xl font-extrabold text-dark-900">{stat.value}</div>
                <div className="text-sm text-dark-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-x">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold text-dark-900 md:text-4xl">قصتنا</h2>
              <p className="mt-4 text-lg leading-relaxed text-dark-600">
                انطلقت بيكير برؤية واضحة: تبسيط عملية شراء التأمين في المملكة العربية السعودية.
                وجدنا أن العملاء يضطرون للتواصل مع عشرات شركات التأمين للحصول على أفضل سعر،
                فقررنا بناء منصة تجمع كل العروض في مكان واحد.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-dark-600">
                اليوم، بيكير هي المنصة الأولى لمقارنة أسعار تأمين المركبات والطبي والسفر،
                مع أكثر من 20 شركة تأمين شريكة و500,000 عميل سعيد.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  'مقارنة فورية لكل عروض التأمين',
                  'إصدار فوري مع ربط مباشر بنجم',
                  'دعم فني متخصص على مدار الساعة',
                  'خصومات حصرية لعملاء بيكير',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-100">
                      <Check className="h-4 w-4 text-success-600" />
                    </div>
                    <span className="text-dark-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/35068847/pexels-photo-35068847.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="الرياض"
                className="h-96 w-full rounded-3xl object-cover shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-dark-200/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                    <Shield className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-dark-900">+8 سنوات</div>
                    <div className="text-sm text-dark-500">من الخبرة</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-dark-50">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-dark-200/60">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-2xl font-bold text-dark-900">رسالتنا</h3>
              <p className="mt-3 text-dark-600 leading-relaxed">
                تقديم تجربة تأمين ذكية وسهلة تمكن العملاء من مقارنة وشراء التأمين بأفضل سعر
                وأسرع وقت، مع ضمان أعلى معايير الجودة والشفافية.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-dark-200/60">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-50 text-secondary-600">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-2xl font-bold text-dark-900">رؤيتنا</h3>
              <p className="mt-3 text-dark-600 leading-relaxed">
                أن نكون المنصة الأولى والأذكى لمقارنة وشراء التأمين في المملكة العربية السعودية
                والمنطقة، وأن نحدث فرقاً حقيقياً في حياة عملائنا.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container-x">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-dark-900 md:text-4xl">قيمنا</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { icon: Heart, title: 'العميل أولاً', desc: 'نضع احتياجات عملائنا في مقدمة أولوياتنا' },
              { icon: Shield, title: 'الشفافية', desc: 'نوفر معلومات واضحة وصادقة حول كل عرض' },
              { icon: TrendingDown, title: 'أفضل الأسعار', desc: 'نضمن لك الحصول على أرخص الأسعار' },
            ].map((value) => (
              <div key={value.title} className="card text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-dark-900">{value.title}</h3>
                <p className="mt-2 text-sm text-dark-500">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section-padding bg-dark-50">
        <div className="container-x">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-dark-900">شركاؤنا</h2>
            <p className="mt-2 text-dark-500">نرتاح للعمل مع أفضل شركات التأمين</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
            {insuranceCompanies.map((company) => (
              <div
                key={company.id}
                className="flex h-24 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-dark-200/60"
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold"
                    style={{ backgroundColor: company.color }}
                  >
                    {company.name.charAt(0)}
                  </div>
                  <span className="text-center text-xs font-medium text-dark-700">{company.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-x">
          <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-center md:p-12">
            <h2 className="text-3xl font-extrabold text-white">جاهز لتبدأ؟</h2>
            <p className="mx-auto mt-3 max-w-lg text-primary-100">
              احصل على أفضل عرض تأمين في دقائق. مقارنة مجانية بدون التزام.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link to="/insurance/car" className="btn-accent">
                ابدأ المقارنة
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <a
                href="tel:920000000"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm hover:bg-white/20"
              >
                <Phone className="h-5 w-5" />
                تواصل معنا
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
