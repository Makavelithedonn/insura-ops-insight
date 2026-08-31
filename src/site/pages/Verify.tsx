// @ts-nocheck
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Shield, ArrowLeft, Loader2, Fingerprint, Check, AlertCircle,
} from 'lucide-react';

export default function Verify() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [method, setMethod] = useState<'nafath' | 'biometric' | null>(null);

  const handleVerify = (selectedMethod: 'nafath' | 'biometric') => {
    setMethod(selectedMethod);
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/confirm');
    }, 2500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16 md:pt-20 py-12">
      <div className="container-x">
        <div className="mx-auto max-w-md">
          <div className="animate-scale-in rounded-3xl bg-white p-8 shadow-xl ring-1 ring-dark-200/60">
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-dark-900">أثبت هويتك</h1>
              <p className="mt-2 text-sm text-dark-500">
                اختر طريقة التحقق للمتابعة
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-error-50 p-3 text-sm text-error-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-3">
              {/* Nafath */}
              <button
                onClick={() => handleVerify('nafath')}
                disabled={loading}
                className="flex w-full items-center gap-4 rounded-2xl border-2 p-5 text-right transition-all hover:border-primary-400 hover:bg-primary-50 disabled:opacity-60"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success-50 text-success-600">
                  <Check className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-dark-900">التحقق من خلال تطبيق نفاذ</h3>
                  <p className="mt-1 text-xs text-dark-500">
                    افتح تطبيق نفاذ وقم بتأكيد طلب إصدار أمر ربط شريحتك
                  </p>
                </div>
                {loading && method === 'nafath' && (
                  <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                )}
              </button>

              {/* Biometric */}
              <button
                onClick={() => handleVerify('biometric')}
                disabled={loading}
                className="flex w-full items-center gap-4 rounded-2xl border-2 p-5 text-right transition-all hover:border-primary-400 hover:bg-primary-50 disabled:opacity-60"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <Fingerprint className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-dark-900">والتحقق عبر السمات الحيوية</h3>
                  <p className="mt-1 text-xs text-dark-500">
                    تحقق سريع باستخدام البصمة أو الوجه
                  </p>
                </div>
                {loading && method === 'biometric' && (
                  <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                )}
              </button>
            </div>

            {loading && (
              <div className="mt-6 rounded-xl bg-primary-50 p-4 text-center">
                <p className="text-sm text-dark-600">
                  {method === 'nafath'
                    ? 'الرجاء، فتح تطبيق نفاذ وتأكيد طلب اصدار أمر ربط شريحتك على رقم الجوال'
                    : 'جاري التحقق من السمات الحيوية...'}
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-dark-400">
              <Shield className="h-4 w-4" />
              جميع البيانات مشفرة وآمنة
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
