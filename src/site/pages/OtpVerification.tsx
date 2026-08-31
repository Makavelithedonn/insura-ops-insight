import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Shield, Loader2, RefreshCw } from 'lucide-react';

export default function OtpVerification() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setError('');

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newDigits.every((d) => d !== '')) {
      handleSubmit(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (code?: string) => {
    const otpCode = code || digits.join('');
    if (otpCode.length !== 4) {
      setError('يرجى إدخال رمز التحقق المرسل الي جوالك');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/payment');
    }, 1500);
  };

  const handleResend = () => {
    setDigits(['', '', '', '']);
    setTimer(60);
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16 md:pt-20">
      <div className="container-x">
        <div className="mx-auto max-w-md">
          <div className="animate-scale-in rounded-3xl bg-white p-8 shadow-xl ring-1 ring-dark-200/60">
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-dark-900">التحقق من رقم الهاتف</h1>
              <p className="mt-2 text-sm text-dark-500">
                تم إرسال رمز التحقق إلي هاتفك النقال، الرجاء إدخاله في هذه الخانة
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-center gap-3" dir="ltr">
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputsRef.current[index] = el; }}
                      type="text"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      maxLength={1}
                      className={`h-16 w-14 rounded-2xl border-2 text-center text-2xl font-bold transition-all focus:outline-none ${
                        error
                          ? 'border-error-400 focus:border-error-500'
                          : 'border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                      }`}
                    />
                  ))}
                </div>
                {error && (
                  <p className="mt-3 text-center text-sm text-error-600">{error}</p>
                )}
              </div>

              <button
                onClick={() => handleSubmit()}
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
                    إرسال
                    <ArrowLeft className="h-5 w-5" />
                  </>
                )}
              </button>

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-sm text-dark-500">
                    إعادة إرسال بعد <span className="font-bold text-primary-600">{timer}</span> ثانية
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    إعادة إرسال الرمز
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-warning-50 p-4">
              <p className="text-xs text-dark-600">
                يجب إدخال الرقم في خلال 60 ثانية. في حالة إدخال الرقم بشكل خاطئ أو انتهاء الصلاحية،
                سيتم إعادة توجيهك هنا مرة أخرى مع رقم جديد.
              </p>
            </div>
          </div>

          {/* Steps indicator */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {[
              { num: 1, label: 'رقم الهاتف', active: false },
              { num: 2, label: 'التحقق', active: true },
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
