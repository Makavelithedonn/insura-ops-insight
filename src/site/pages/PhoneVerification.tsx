import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Phone, ArrowLeft, Shield, Loader2, CheckCircle } from 'lucide-react';

export default function PhoneVerification() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^05\d{8}$/.test(phone)) {
      setError('رقم الهاتف غير صحيح. يجب أن يبدأ بـ 05 ويتكون من 10 أرقام');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/phoneOtp');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16 md:pt-20">
      <div className="container-x">
        <div className="mx-auto max-w-md">
          <div className="animate-scale-in rounded-3xl bg-white p-8 shadow-xl ring-1 ring-dark-200/60">
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
                <Phone className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-dark-900">تأكيد رقم هاتف مقدم الطلب</h1>
              <p className="mt-2 text-sm text-dark-500">
                أدخل رقم جوالك لإرسال رمز التحقق
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark-700">
                  رقم الجوال
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError('');
                    }}
                    placeholder="05xxxxxxxx"
                    className="input-field pr-12"
                    dir="ltr"
                    maxLength={10}
                    required
                  />
                  <Phone className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
                </div>
                {error && (
                  <p className="mt-2 text-sm text-error-600">{error}</p>
                )}
                <p className="mt-2 text-xs text-dark-400">
                  يجب أن يكون رقم الجوال موثقاً ومطابقاً لبيانات الهوية الوطنية / الإقامة
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
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    إرسال رمز التحقق
                    <ArrowLeft className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-2 rounded-xl bg-primary-50 p-4">
              <Shield className="h-5 w-5 flex-shrink-0 text-primary-600" />
              <p className="text-xs text-dark-600">
                سيتم إرسال رسالة كود التحقق في خلال دقيقة على رقم جوالك
              </p>
            </div>
          </div>

          {/* Steps indicator */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {[
              { num: 1, label: 'رقم الهاتف', active: true },
              { num: 2, label: 'التحقق', active: false },
              { num: 3, label: 'الدفع', active: false },
            ].map((step, idx) => (
              <div key={step.num} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  step.active ? 'bg-primary-600 text-white' : 'bg-dark-200 text-dark-400'
                }`}>
                  {step.num}
                </div>
                <span className={`text-xs ${step.active ? 'font-semibold text-primary-600' : 'text-dark-400'}`}>
                  {step.label}
                </span>
                {idx < 2 && <div className="h-0.5 w-6 bg-dark-200" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
