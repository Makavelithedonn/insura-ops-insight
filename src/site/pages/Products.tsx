import { Link } from 'react-router-dom';
import {
  Car, HeartPulse, Plane, Users, Stethoscope, Truck,
  ArrowLeft, Check, Shield,
} from 'lucide-react';
import { insuranceTypes } from '@/data/insurance';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  car: Car,
  'heart-pulse': HeartPulse,
  plane: Plane,
  users: Users,
  stethoscope: Stethoscope,
  truck: Truck,
};

const productDetails: Record<string, { features: string[]; price: string }> = {
  car: {
    features: ['تغطية الأضرار المادية والطبيعية', 'تغطية الحوادث الشخصية', 'تغطية السرقة والحريق', 'إصلاح في الوكالة', 'إصدار فوري وربط بنجم'],
    price: 'من 690 ريال',
  },
  medical: {
    features: ['تغطية الزيارات الطبية', 'تغطية الفحوصات والتحاليل', 'تغطية الأدوية', 'تغطية العمليات الجراحية', 'طب الأسنان والعيون'],
    price: 'من 1,200 ريال',
  },
  travel: {
    features: ['تغطية المصاريف الطبية في الخارج', 'تغطية إلغاء الرحلة', 'تغطية فقدان الأمتعة', 'مساعدة طارئة 24/7', 'تغطية المسؤولية المدنية'],
    price: 'من 50 ريال',
  },
  domestic: {
    features: ['تغطية المصاريف الطبية', 'تغطية الإصابات الشخصية', 'تغطية المسؤولية المدنية', 'تغطية إعادة العامل', 'إصدار فوري'],
    price: 'من 300 ريال',
  },
  'medical-malpractice': {
    features: ['تغطية المطالبات الناتجة عن الأخطاء الطبية', 'تغطية المصاريف القانونية', 'تغطية التعويضات', 'حماية مهنية شاملة', 'خطط مرنة'],
    price: 'حسب التخصص',
  },
  transport: {
    features: ['تغطية تلف أو فقدان البضائع', 'تغطية حوادث النقل', 'تغطية نقل المشتقات النفطية', 'خطط مرنة للشركات', 'إصدار فوري'],
    price: 'حسب الحمولة',
  },
};

export default function Products() {
  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-l from-primary-800 to-primary-950 py-16 md:py-20">
        <div className="container-x text-center">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">منتجاتنا</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            أنواع تأمين متعددة تناسب جميع احتياجاتك. تأمين ضد الغير، تأمين مميز، تأمين شامل
            وقيمة تحمل متنوعة.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-white">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {insuranceTypes.map((type) => {
              const Icon = iconMap[type.icon] || Car;
              const details = productDetails[type.id];
              return (
                <div
                  key={type.id}
                  className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-dark-200/60 transition-all hover:shadow-xl"
                >
                  <div className="flex flex-col p-6 md:flex-row md:p-8">
                    <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl ${type.bgColor} ${type.color}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="mt-4 flex-1 md:mt-0 md:pr-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-dark-900">{type.name}</h3>
                        <span className="rounded-lg bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                          {details.price}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-dark-500">{type.description}</p>
                      <ul className="mt-4 space-y-2">
                        {details.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-dark-600">
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={`/insurance/${type.id}`}
                        className="mt-5 flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
                      >
                        احصل على عرض سعر
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-dark-50">
        <div className="container-x">
          <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-center md:p-12">
            <Shield className="mx-auto h-12 w-12 text-white/80" />
            <h2 className="mt-4 text-3xl font-extrabold text-white">تأمينك في دقيقة</h2>
            <p className="mx-auto mt-3 max-w-lg text-primary-100">
              نقارن لك كل عروض الأسعار بشكل فوري من كل شركات التأمين
            </p>
            <Link to="/insurance/car" className="btn-accent mt-6">
              ابدأ المقارنة الآن
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
