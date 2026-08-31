import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Phone, ArrowLeft, Loader2, Info, PhoneCall, RefreshCw, Clock } from 'lucide-react';

export default function STCOtp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [callStatus, setCallStatus] = useState<'waiting' | 'received' | 'expired'>('waiting');

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCallStatus('expired');
    }
  }, [timer]);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/confirm');
    }, 1500);
  };

  const handleRetry = () => {
    setTimer(60);
    setCallStatus('waiting');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16 md:pt-20 py-12">
      <div className="container-x">
        <div className="mx-auto max-w-md">
          <div className="animate-scale-in rounded-3xl bg-white p-8 shadow-xl ring-1 ring-dark-200/60">
            <div className="mb-6 text-center">
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
                callStatus === 'waiting' ? 'bg-warning-50' : 'bg-error-50'
              }`}>
                {callStatus === 'waiting' ? (
                  <PhoneCall className="h-8 w-8 text-warning-600 animate-pulse" />
                ) : (
                  <Clock className="h-8 w-8 text-error-600" />
                )}
              </div>
              <h1 className="mt-4 text-2xl font-bold text-dark-900">بانتظار تأكيد الجوال</h1>
              <p className="mt-2 text-sm text-dark-500">
                سوف يتم الاتصال بك الآن لتأكيد طلبك
              </p>
            </div>

            {callStatus === 'waiting' && (
              <>
                <div className="mb-6 flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary-50">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
                        <span className="text-2xl font-extrabold text-primary-700">{timer}</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 animate-ping rounded-full border-2 border-primary-300 opacity-30" />
                  </div>
                  <p className="text-sm text-dark-500">ثانية متبقية</p>
                </div>

                <div className="mb-6 rounded-xl bg-warning-50 p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 flex-shrink-0 text-warning-600" />
                    <div className="space-y-2 text-xs text-dark-600">
                      <p>
                        في حال تلفي مكالمة من 900 الرجاء قبولها واختيار الرقم 5
                      </p>
                      <p>
                        لتأكيد طلبك الرجاء الضغط على رقم 5
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleConfirm}
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
                      تأكيد
                      <ArrowLeft className="h-5 w-5" />
                    </>
                  )}
                </button>
              </>
            )}

            {callStatus === 'expired' && (
              <>
                <div className="mb-6 rounded-xl bg-error-50 p-4 text-center">
                  <p className="text-sm font-semibold text-error-700">انتهى الوقت!</p>
                  <p className="mt-1 text-xs text-dark-500">
                    لم تستلم مكالمة؟ يمكنك إعادة المحاولة
                  </p>
                </div>
                <button onClick={handleRetry} className="btn-primary w-full">
                  <RefreshCw className="h-5 w-5" />
                  إعادة الاتصال
                </button>
              </>
            )}

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
