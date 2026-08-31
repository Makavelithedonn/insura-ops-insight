import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Check, Star, ArrowLeft, Shield, Clock, TrendingDown,
  Filter, Loader2, Award, Phone,
} from 'lucide-react';
import { carInsuranceOffers } from '@/data/insurance';

export default function Compare() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('price');
  const [filterType, setFilterType] = useState<'all' | 'شامل' | 'ضد الغير'>('all');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const filteredOffers = carInsuranceOffers
    .filter((o) => filterType === 'all' || o.type === filterType)
    .sort((a, b) => (sortBy === 'price' ? a.price - b.price : b.rating - a.rating));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-50 pt-16 md:pt-20">
        <div className="text-center">
          <div className="relative mx-auto h-24 w-24">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary-200" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-dark-900">جاري البحث عن عروض شركات التأمين...</h2>
          <p className="mt-2 text-sm text-dark-500">نقارن لك أكثر من 20 عرض في وقت واحد</p>
          <div className="mt-6 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 animate-pulse rounded-full bg-primary-600"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50 pt-16 md:pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container-x py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-dark-900">عروض التأمين</h1>
              <p className="mt-1 text-sm text-dark-500">
                وجدنا <span className="font-bold text-primary-600">{filteredOffers.length} عروض</span> تناسب احتياجك
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-dark-200 bg-white px-3 py-2">
                <Filter className="h-4 w-4 text-dark-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'شامل' | 'ضد الغير')}
                  className="border-0 bg-transparent text-sm font-medium text-dark-700 focus:outline-none"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="شامل">تأمين شامل</option>
                  <option value="ضد الغير">ضد الغير</option>
                </select>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-dark-200 bg-white px-3 py-2">
                <span className="text-sm text-dark-400">ترتيب:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price' | 'rating')}
                  className="border-0 bg-transparent text-sm font-medium text-dark-700 focus:outline-none"
                >
                  <option value="price">الأقل سعراً</option>
                  <option value="rating">الأعلى تقييماً</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offers */}
      <div className="container-x py-8">
        <div className="space-y-4">
          {filteredOffers.map((offer, index) => (
            <div
              key={offer.id}
              className={`animate-slide-up overflow-hidden rounded-2xl bg-white shadow-sm ring-1 transition-all hover:shadow-lg ${
                offer.popular ? 'ring-2 ring-primary-500' : 'ring-dark-200/60'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col lg:flex-row">
                {/* Company Info */}
                <div className="flex items-center gap-4 border-b border-dark-100 p-6 lg:w-64 lg:border-b-0 lg:border-l">
                  <div
                    className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-md"
                    style={{ backgroundColor: offer.color }}
                  >
                    {offer.companyName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-dark-900">{offer.companyName}</h3>
                    <div className="mt-1 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
                      <span className="text-sm font-semibold text-dark-700">{offer.rating}</span>
                      <span className="text-xs text-dark-400">/ 5</span>
                    </div>
                    <span
                      className={`mt-1 inline-block rounded-lg px-2 py-0.5 text-xs font-semibold ${
                        offer.type === 'شامل'
                          ? 'bg-primary-50 text-primary-700'
                          : 'bg-secondary-50 text-secondary-700'
                      }`}
                    >
                      تأمين {offer.type}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex-1 p-6">
                  {offer.popular && (
                    <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                      <Award className="h-3 w-3" />
                      الأكثر طلباً
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {offer.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2 text-sm text-dark-600">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  {offer.deductible > 0 && (
                    <div className="mt-3 text-xs text-dark-400">
                      قيمة التحمل: {offer.deductible} ر.س
                    </div>
                  )}
                </div>

                {/* Price & Action */}
                <div className="flex flex-col items-center justify-center gap-3 border-t border-dark-100 bg-dark-50/50 p-6 lg:w-56 lg:border-t-0 lg:border-r">
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-dark-900">
                      {offer.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-dark-500">ريال / سنوي</div>
                  </div>
                  <button
                    onClick={() => navigate('/phone')}
                    className="btn-primary w-full !py-2.5 !text-sm"
                  >
                    اشترِ الآن
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="card flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-dark-900">إصدار فوري</h4>
              <p className="text-sm text-dark-500">وثيقتك في دقائق</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-dark-900">ربط مباشر بنجم</h4>
              <p className="text-sm text-dark-500">ربط آلي مع المرور</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
              <TrendingDown className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-dark-900">أفضل الأسعار</h4>
              <p className="text-sm text-dark-500">نضمن لك أرخص سعر</p>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-l from-primary-600 to-primary-800 p-6 text-white md:flex-row">
          <div className="flex items-center gap-3">
            <Phone className="h-8 w-8 text-accent-400" />
            <div>
              <h3 className="font-bold">تحتاج مساعدة في الاختيار؟</h3>
              <p className="text-sm text-primary-100">فريقنا متاح لمساعدتك</p>
            </div>
          </div>
          <a href="tel:920000000" className="btn-accent" dir="ltr">
            920 000 000
          </a>
        </div>
      </div>
    </div>
  );
}
