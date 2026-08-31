import type { StepDefinition } from '@/site/lib/types';

// ============================================================
// Step Definitions — mapped to the actual website pages
// Each step corresponds to a real page in the customer journey.
// The order defines the locking sequence: a step is locked until
// the previous step is approved by the admin.
// ============================================================

export const APPLICATION_STEPS: StepDefinition[] = [
  {
    key: 'insurance_quote',
    title: 'عرض التأمين',
    order: 1,
    route: '/insurance/car',
    description: 'اختيار نوع التأمين ومقارنة العروض',
  },
  {
    key: 'customer_info',
    title: 'بيانات مقدم الطلب',
    order: 2,
    route: '/reg',
    description: 'إدخال البيانات الشخصية وبيانات المركبة',
  },
  {
    key: 'phone_verification',
    title: 'تأكيد رقم الهاتف',
    order: 3,
    route: '/phone',
    description: 'تأكيد رقم الجوال عبر رمز التحقق',
  },
  {
    key: 'payment',
    title: 'الدفع',
    order: 4,
    route: '/payment',
    description: 'إتمام عملية الدفع عبر مزود الدفع الآمن',
  },
  {
    key: 'confirmation',
    title: 'تأكيد الطلب',
    order: 5,
    route: '/success',
    description: 'تأكيد إصدار الوثيقة وربطها مع نظام المرور',
  },
];

export function getStepByKey(key: string): StepDefinition | undefined {
  return APPLICATION_STEPS.find((s) => s.key === key);
}

export function getStepByRoute(route: string): StepDefinition | undefined {
  // Match exact route or route prefix for dynamic routes
  return APPLICATION_STEPS.find(
    (s) => route === s.route || route.startsWith(s.route)
  );
}

export function getNextStep(currentKey: string): StepDefinition | undefined {
  const current = APPLICATION_STEPS.find((s) => s.key === currentKey);
  if (!current) return undefined;
  return APPLICATION_STEPS.find((s) => s.order === current.order + 1);
}

export function getPreviousStep(currentKey: string): StepDefinition | undefined {
  const current = APPLICATION_STEPS.find((s) => s.key === currentKey);
  if (!current) return undefined;
  return APPLICATION_STEPS.find((s) => s.order === current.order - 1);
}
