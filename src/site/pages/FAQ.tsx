import { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { faqs } from '@/site/data/insurance';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-l from-primary-800 to-primary-950 py-16 md:py-20">
        <div className="container-x text-center">
          <HelpCircle className="mx-auto h-12 w-12 text-white/80" />
          <h1 className="mt-4 text-4xl font-extrabold text-white md:text-5xl">الأسئلة الشائعة</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            إجابات على أكثر الأسئلة شيوعاً حول خدماتنا
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="section-padding bg-white">
        <div className="container-x">
          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border-2 border-dark-100 bg-white transition-all hover:border-primary-200"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-right"
                >
                  <span className="font-bold text-dark-900">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-primary-600 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all ${
                    openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-dark-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-12 mx-auto max-w-3xl">
            <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-white/80" />
              <h2 className="mt-4 text-2xl font-bold text-white">لم تجد إجابتك؟</h2>
              <p className="mt-2 text-primary-100">فريقنا متاح للإجابة على جميع استفساراتك</p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Link to="/contact" className="btn-accent">
                  تواصل معنا
                </Link>
                <a
                  href="tel:920000000"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm hover:bg-white/20"
                >
                  <Phone className="h-5 w-5" />
                  920000000
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
