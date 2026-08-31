// @ts-nocheck
import { useState } from 'react';
import {
  Phone, Mail, MapPin, Clock, Send, MessageSquare,
  Loader2, CheckCircle, Building2,
} from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-l from-primary-800 to-primary-950 py-16 md:py-20">
        <div className="container-x text-center">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">تواصل معنا</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            نحن هنا لمساعدتك. تواصل معنا في أي وقت وسنرد عليك بأسرع ما يمكن.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="-mt-10 relative z-20">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: Phone, title: 'الهاتف', value: '920 000 000', subValue: 'متاح 24/7', dir: 'ltr' },
              { icon: Mail, title: 'البريد الإلكتروني', value: 'info@becaree.com', subValue: 'نرد خلال 24 ساعة', dir: 'ltr' },
              { icon: MapPin, title: 'العنوان', value: 'الرياض، السعودية', subValue: 'طريق الملك فهد', dir: 'rtl' },
            ].map((card) => (
              <div key={card.title} className="card text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <card.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-bold text-dark-900">{card.title}</h3>
                <p className="mt-1 font-semibold text-primary-600" dir={card.dir as 'ltr' | 'rtl'}>
                  {card.value}
                </p>
                <p className="mt-1 text-sm text-dark-500">{card.subValue}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="section-padding bg-white">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Form */}
            <div className="rounded-3xl bg-dark-50 p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                  <MessageSquare className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-dark-900">أرسل لنا رسالة</h2>
                  <p className="text-sm text-dark-500">سنرد عليك في أقرب وقت</p>
                </div>
              </div>

              {sent && (
                <div className="mb-6 flex items-center gap-3 rounded-xl bg-success-50 p-4 animate-slide-down">
                  <CheckCircle className="h-6 w-6 text-success-600" />
                  <p className="text-sm font-medium text-success-700">تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark-700">الاسم</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark-700">رقم الجوال</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input-field"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-dark-700">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field"
                    dir="ltr"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-dark-700">الموضوع</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">اختر الموضوع</option>
                    <option value="استفسار">استفسار عام</option>
                    <option value="شكوى">شكوى</option>
                    <option value="اقتراح">اقتراح</option>
                    <option value="دعم فني">الدعم الفني</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-dark-700">الرسالة</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    className="input-field resize-none"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      إرسال
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white">
                <Building2 className="h-12 w-12 text-white/80" />
                <h3 className="mt-4 text-2xl font-bold">بيكير لوساطة التأمين</h3>
                <p className="mt-2 text-primary-100">
                  المنصة الأذكى لمقارنة عروض تأمين السيارات في السعودية
                </p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-accent-400" />
                    <span dir="ltr">920 000 000</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-accent-400" />
                    <span dir="ltr">info@becaree.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-accent-400" />
                    <span>الرياض، المملكة العربية السعودية</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-dark-50 p-8">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary-600" />
                  <h3 className="font-bold text-dark-900">أوقات العمل</h3>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-dark-500">الأحد - الخميس</span>
                    <span className="font-semibold text-dark-900">8 ص - 11 م</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-500">الجمعة - السبت</span>
                    <span className="font-semibold text-dark-900">10 ص - 10 م</span>
                  </div>
                  <div className="flex justify-between border-t border-dark-200 pt-2">
                    <span className="text-dark-500">الدعم الفني</span>
                    <span className="font-semibold text-success-600">24/7</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-warning-50 p-6">
                <h4 className="font-bold text-dark-900">طريقة رفع شكوى لهيئة التأمين</h4>
                <p className="mt-2 text-sm text-dark-600">
                  إذا كان لديك شكوى ولم يتم حلها، يمكنك التواصل مع هيئة التأمين عبر موقعهم
                  الرسمي أو الاتصال على رقمهم الموحد.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
