import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  KeyRound, ArrowLeft, Loader2, ShieldCheck, AlertCircle, RefreshCw,
} from 'lucide-react';

export default function Activate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('رمز التفعيل غير صحيح');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/confirm');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16 md:pt-20 py-12">
      <div className="container-x">
        <div className="mx-auto max-w-md">
          <div className="animate-scale-in rounded-3xl bg-white p-8 shadow-xl ring-1 ring-dark-200/60">
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
                <KeyRound className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-dark-900">تفعيل الوثيقة</h1>
              <p className="mt-2 text-sm text-dark-500">
                أدخل رمز التفعيل المرسل إلى جوالك
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-error-50 p-3 text-sm text-error-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setError('');
                  }}
                  placeholder="------"
                  className="w-full rounded-xl border-2 border-dark-200 bg-white px-4 py-4 text-center text-3xl font-bold tracking-[0.5em] text-dark-900 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  dir="ltr"
                  maxLength={6}
                  required
                />
                <p className="mt-2 text-center text-xs text-dark-400">
                  أدخل الرمز المكون من 6 أرقام
                </p>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري التفعيل...
                  </>
                ) : (
                  <>
                    تفعيل
                    <ArrowLeft className="h-5 w-5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCode('')}
                className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                <RefreshCw className="h-4 w-4" />
                إعادة إرسال رمز التفعيل
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-dark-400">
              <ShieldCheck className="h-4 w-4" />
              حصل خطأ؟ تم ارسال رمز تفعيل اخر الى جوالك
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
