// @ts-nocheck
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Shield } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16 md:pt-20">
      <div className="container-x text-center">
        <div className="mx-auto max-w-md">
          <div className="flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary-50">
              <Shield className="h-12 w-12 text-primary-600" />
            </div>
          </div>
          <h1 className="mt-6 text-7xl font-extrabold text-primary-600">404</h1>
          <h2 className="mt-2 text-2xl font-bold text-dark-900">عذراً، الصفحة غير متاحه</h2>
          <p className="mt-3 text-dark-500">
            الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى موقع آخر.
          </p>
          <Link to="/" className="btn-primary mt-8">
            <Home className="h-5 w-5" />
            العودة للرئيسية
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
