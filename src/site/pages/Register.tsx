import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  User, Phone, Loader2, ArrowLeft, Shield, AlertCircle,
  Car, FileText, Calendar, CreditCard, Hash,
} from 'lucide-react';
import { carBrands } from '@/site/data/insurance';

const insuranceTypesList = [
  { id: 'new', label: 'تأمين جديد' },
  { id: 'renew', label: 'تجديد تأمين' },
  { id: 'transfer', label: 'نقل ملكية' },
];

const tameenTypesList = [
  { id: 'shamel', label: 'تأمين شامل' },
  { id: 'against', label: 'تأمين ضد الغير' },
];

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nationalId: '',
    fullName: '',
    phone: '',
    birthDate: '',
    serialNumber: '',
    carBrand: '',
    carYear: '',
    customsCard: '',
    insuranceType: 'new',
    tameenType: 'shamel',
    agree: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.nationalId || !form.fullName || !form.phone || !form.serialNumber) {
      setError('جميع البيانات مطلوبة');
      return;
    }

    if (form.nationalId.length !== 10) {
      setError('رقم الهوية الوطنية او الاقامة يجب أن يتكون من 10 أرقام');
      return;
    }

    if (!form.agree) {
      setError('يجب الموافقة على الشروط والأحكام');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/phone');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16 md:pt-20 py-12">
      <div className="container-x">
        <div className="mx-auto max-w-2xl">
          <div className="animate-scale-in rounded-3xl bg-white p-6 shadow-xl ring-1 ring-dark-200/60 md:p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-dark-900">أستمارة</h1>
              <p className="mt-2 text-sm text-dark-500">
                أدخل بيانات طلب التأمين على مركبتك
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-error-50 p-3 text-sm text-error-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Insurance Type Selection */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-dark-700">نوع الطلب</label>
                <div className="grid grid-cols-3 gap-2">
                  {insuranceTypesList.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setForm({ ...form, insuranceType: t.id })}
                      className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all ${
                        form.insuranceType === t.id
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-dark-200 text-dark-600 hover:border-primary-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tameen Type Selection */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-dark-700">نوع التأمين</label>
                <div className="grid grid-cols-2 gap-2">
                  {tameenTypesList.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setForm({ ...form, tameenType: t.id })}
                      className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all ${
                        form.tameenType === t.id
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-dark-200 text-dark-600 hover:border-primary-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-dark-100" />

              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-dark-900">
                  <User className="h-5 w-5 text-primary-600" />
                  بيانات مقدم الطلب
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark-700">
                      رقم الهوية الوطنية / الإقامة
                    </label>
                    <input
                      type="text"
                      value={form.nationalId}
                      onChange={(e) => setForm({ ...form, nationalId: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      placeholder="مثال: 1234567890"
                      className="input-field"
                      dir="ltr"
                      maxLength={10}
                      required
                    />
                    <p className="mt-1 text-xs text-dark-400">يجب أن يبدأ بـ 1 أو 2 ويتكون من 10 أرقام</p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark-700">
                      رقم الجوال
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="05xxxxxxxx"
                        className="input-field pr-12"
                        dir="ltr"
                        maxLength={10}
                        required
                      />
                      <Phone className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-dark-700">
                    أسم مقدم الطلب كاملآ
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="input-field pr-12"
                      required
                    />
                    <User className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-dark-700">
                    تاريخ الميلاد
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={form.birthDate}
                      onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                      className="input-field pr-12"
                    />
                    <Calendar className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
                  </div>
                </div>
              </div>

              <div className="h-px bg-dark-100" />

              {/* Vehicle Info */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-dark-900">
                  <Car className="h-5 w-5 text-primary-600" />
                  بيانات المركبة
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark-700">
                      الرقم التسلسلي
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.serialNumber}
                        onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                        placeholder="آخر 5 أرقام من الرقم التسلسلي"
                        className="input-field pr-12"
                        dir="ltr"
                        required
                      />
                      <Hash className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark-700">
                      سنة صنع المركبة
                    </label>
                    <select
                      value={form.carYear}
                      onChange={(e) => setForm({ ...form, carYear: e.target.value })}
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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark-700">
                      ماركة السيارة
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
                      رقم البطاقة الجمركية (اختياري)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.customsCard}
                        onChange={(e) => setForm({ ...form, customsCard: e.target.value })}
                        placeholder="بطاقة جمركية"
                        className="input-field pr-12"
                        dir="ltr"
                      />
                      <CreditCard className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Agreement */}
              <div className="space-y-3 rounded-xl bg-primary-50 p-4">
                <label className="flex items-start gap-3 text-sm text-dark-700">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-primary-300 text-primary-600"
                  />
                  <span>
                    أوافق على منح شركة بيكير الحق في الاستعلام من شركة نجم و/أو مركز المعلومات
                    الوطني عن بياناتي
                  </span>
                </label>
                <label className="flex items-start gap-3 text-sm text-dark-700">
                  <input type="checkbox" className="mt-1 h-4 w-4 rounded border-primary-300 text-primary-600" />
                  <span>
                    أوافق على <Link to="/terms" className="font-semibold text-primary-600">الشروط والأحكام</Link> و
                    <Link to="/privacy" className="font-semibold text-primary-600"> سياسة الخصوصية</Link>
                  </span>
                </label>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري التسجيل...
                  </>
                ) : (
                  <>
                    متابعة
                    <ArrowLeft className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-dark-600">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700">
                دخول
              </Link>
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-dark-400">
            <FileText className="h-4 w-4" />
            مصرح من: هيئة التأمين
          </div>
        </div>
      </div>
    </div>
  );
}
