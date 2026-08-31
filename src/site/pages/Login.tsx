// @ts-nocheck
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { User, Lock, Eye, EyeOff, Loader2, ArrowLeft, Shield, Phone } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.password) {
      setError('بيانات الدخول غير صحيحة');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16 md:pt-20">
      <div className="container-x">
        <div className="mx-auto max-w-md">
          <div className="animate-scale-in rounded-3xl bg-white p-8 shadow-xl ring-1 ring-dark-200/60">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-dark-900">دخول</h1>
              <p className="mt-2 text-sm text-dark-500">أدخل بياناتك للدخول إلى حسابك</p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-error-50 p-3 text-center text-sm text-error-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark-700">اسم المستخدم</label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="input-field pr-12"
                    required
                  />
                  <User className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark-700">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field pr-12 pl-12"
                    required
                  />
                  <Lock className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-dark-600">
                  <input type="checkbox" className="rounded border-dark-300 text-primary-600" />
                  تذكرني
                </label>
                <button type="button" className="font-semibold text-primary-600 hover:text-primary-700">
                  نسيت كلمة المرور؟
                </button>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري الدخول...
                  </>
                ) : (
                  <>
                    دخول
                    <ArrowLeft className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-dark-200" />
              <span className="text-xs text-dark-400">أو</span>
              <div className="h-px flex-1 bg-dark-200" />
            </div>

            <p className="text-center text-sm text-dark-600">
              ليس لديك حساب؟{' '}
              <Link to="/reg" className="font-bold text-primary-600 hover:text-primary-700">
                سجل الآن
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-dark-400">
            <Phone className="h-4 w-4" />
            <span>للمساعدة: </span>
            <a href="tel:920000000" className="font-semibold text-primary-600" dir="ltr">920 000 000</a>
          </div>
        </div>
      </div>
    </div>
  );
}
