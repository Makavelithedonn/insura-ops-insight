// @ts-nocheck
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  CreditCard, Lock, Check, ArrowLeft, Loader2,
  Shield, Calendar, User, Receipt,
} from 'lucide-react';
import { carInsuranceOffers } from '@/site/data/insurance';

export default function Payment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedOffer = carInsuranceOffers[0];
  const vat = Math.round(selectedOffer.price * 0.15);
  const total = selectedOffer.price + vat;

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!cardData.name.trim()) {
      newErrors.name = 'اسم حامل البطاقة مطلوب';
    }

    if (cardData.number.replace(/\s/g, '').length !== 16) {
      newErrors.number = 'رقم البطاقة يجب أن يكون 16 رقم';
    }

    if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
      newErrors.expiry = 'تاريخ انتهاء البطاقة غير صحيح';
    }

    if (cardData.cvv.length !== 3) {
      newErrors.cvv = 'رمز CVV غير صحيح';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/success');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-dark-50 pt-16 md:pt-20">
      <div className="container-x py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-2xl font-bold text-dark-900">معلومات الفاتورة</h1>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Payment Form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-dark-200/60 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                    <CreditCard className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-dark-900">طرق الدفع</h2>
                    <p className="text-sm text-dark-500">أدخل بيانات البطاقة</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark-700">
                      اسم حامل البطاقة
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                        placeholder="الاسم كما يظهر على البطاقة"
                        className="input-field pr-12"
                        required
                      />
                      <User className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
                    </div>
                    {errors.name && <p className="mt-1.5 text-sm text-error-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark-700">
                      رقم البطاقة
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                        placeholder="0000 0000 0000 0000"
                        className="input-field pr-12"
                        dir="ltr"
                        maxLength={19}
                        required
                      />
                      <CreditCard className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
                    </div>
                    {errors.number && <p className="mt-1.5 text-sm text-error-600">{errors.number}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-dark-700">
                        تاريخ الانتهاء
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                          placeholder="MM/YY"
                          className="input-field pr-12"
                          dir="ltr"
                          maxLength={5}
                          required
                        />
                        <Calendar className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
                      </div>
                      {errors.expiry && <p className="mt-1.5 text-sm text-error-600">{errors.expiry}</p>}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-dark-700">
                        CVV
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                          placeholder="000"
                          className="input-field pr-12"
                          dir="ltr"
                          maxLength={3}
                          required
                        />
                        <Lock className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
                      </div>
                      {errors.cvv && <p className="mt-1.5 text-sm text-error-600">{errors.cvv}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-success-50 p-4">
                    <Shield className="h-5 w-5 flex-shrink-0 text-success-600" />
                    <p className="text-xs text-dark-600">
                      جميع المعاملات مشفرة وآمنة. نستخدم أحدث تقنيات الحماية لبياناتك.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        جاري المعالجة...
                      </>
                    ) : (
                      <>
                        ادفع الآن - {total.toLocaleString()} ر.س
                        <ArrowLeft className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-dark-200/60">
                <div className="mb-4 flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary-600" />
                  <h2 className="font-bold text-dark-900">تفاصيل المعاملة</h2>
                </div>

                <div className="mb-4 flex items-center gap-3 rounded-xl bg-dark-50 p-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white"
                    style={{ backgroundColor: selectedOffer.color }}
                  >
                    {selectedOffer.companyName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-dark-900">{selectedOffer.companyName}</div>
                    <div className="text-xs text-dark-500">تأمين {selectedOffer.type}</div>
                  </div>
                </div>

                <div className="space-y-3 border-t border-dark-100 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-500">سعر التأمين</span>
                    <span className="font-semibold text-dark-900">{selectedOffer.price.toLocaleString()} ر.س</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-500">ضريبة القيمة المضافة (15%)</span>
                    <span className="font-semibold text-dark-900">{vat.toLocaleString()} ر.س</span>
                  </div>
                  <div className="flex justify-between border-t border-dark-100 pt-3">
                    <span className="font-bold text-dark-900">المبلغ المستحق</span>
                    <span className="text-xl font-extrabold text-primary-600">
                      {total.toLocaleString()} ر.س
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 rounded-xl bg-primary-50 p-4">
                  {selectedOffer.features.slice(0, 3).map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-xs text-dark-600">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success-500" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-dark-400">شهادة ضريبة القيمة المضافة متاحة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
