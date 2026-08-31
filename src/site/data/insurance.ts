// @ts-nocheck
export interface InsuranceCompany {
  id: string;
  name: string;
  logo: string;
  color: string;
}

export interface InsuranceOffer {
  id: string;
  companyId: string;
  companyName: string;
  logo: string;
  color: string;
  type: 'شامل' | 'ضد الغير' | 'ضد الغير بلس';
  price: number;
  deductible: number;
  features: string[];
  rating: number;
  popular?: boolean;
  featured?: boolean;
}

export interface InsuranceType {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  color: string;
  bgColor: string;
}

export const insuranceTypes: InsuranceType[] = [
  {
    id: 'car',
    name: 'تأمين المركبات',
    nameEn: 'Car Insurance',
    icon: 'car',
    description: 'قارن أسعار تأمين السيارات من أكثر من 20 شركة تأمين',
    color: 'text-primary-600',
    bgColor: 'bg-primary-50',
  },
  {
    id: 'medical',
    name: 'التأمين الطبي',
    nameEn: 'Medical Insurance',
    icon: 'heart-pulse',
    description: 'حماية صحية لك ولعائلتك بأفضل الأسعار',
    color: 'text-secondary-600',
    bgColor: 'bg-secondary-50',
  },
  {
    id: 'travel',
    name: 'تأمين السفر',
    nameEn: 'Travel Insurance',
    icon: 'plane',
    description: 'سافر بأمان مع تغطية شاملة لرحلاتك',
    color: 'text-accent-600',
    bgColor: 'bg-accent-50',
  },
  {
    id: 'domestic',
    name: 'تأمين العمالة المنزلية',
    nameEn: 'Domestic Workers',
    icon: 'users',
    description: 'تأمين شامل لعمالك المنزليين',
    color: 'text-primary-700',
    bgColor: 'bg-primary-50',
  },
  {
    id: 'medical-malpractice',
    name: 'تأمين الأخطاء الطبية',
    nameEn: 'Medical Malpractice',
    icon: 'stethoscope',
    description: 'حماية مهنية للممارسين الصحيين',
    color: 'text-secondary-700',
    bgColor: 'bg-secondary-50',
  },
  {
    id: 'transport',
    name: 'تأمين نقل البضائع',
    nameEn: 'Transport Insurance',
    icon: 'truck',
    description: 'تغطية شاملة للبضائع أثناء النقل',
    color: 'text-accent-700',
    bgColor: 'bg-accent-50',
  },
];

export const insuranceCompanies: InsuranceCompany[] = [
  { id: 'tawuniya', name: 'التعاونية', logo: '', color: '#1b6af0' },
  { id: 'salama', name: 'سلامة للتأمين', logo: '', color: '#14b89c' },
  { id: 'rajhi', name: 'تكافل الراجحي', logo: '', color: '#0d9583' },
  { id: 'walaa', name: 'ولاء للتأمين التعاوني', logo: '', color: '#3289fc' },
  { id: 'allianz', name: 'اليانز للتأمين', logo: '', color: '#1454dc' },
  { id: 'alrajhi', name: 'الراجحي تكافل', logo: '', color: '#0f776c' },
  { id: 'gulf', name: 'الخليجية العامة للتأمين', logo: '', color: '#193e8c' },
  { id: 'brog', name: 'بروج للتأمين التعاوني', logo: '', color: '#1b6af0' },
  { id: 'drv7', name: 'درايف7', logo: '', color: '#14b89c' },
  { id: 'midgulf', name: 'ميدغلف السعودية', logo: '', color: '#ea580c' },
  { id: 'yaqoot', name: 'ياقوت', logo: '', color: '#3289fc' },
  { id: 'wafa', name: 'وفاء للتأمين', logo: '', color: '#f97316' },
  { id: 'arabia', name: 'التأمين العربي التعاوني', logo: '', color: '#1454dc' },
  { id: 'livva', name: 'ليڤا للتأمين', logo: '', color: '#193e8c' },
  { id: 'shield', name: 'الدرع العربي', logo: '', color: '#0d9583' },
  { id: 'amana', name: 'أمانة للتأمين التعاوني', logo: '', color: '#1b6af0' },
  { id: 'national', name: 'الوطنية للتأمين', logo: '', color: '#14b89c' },
  { id: 'mtkmla', name: 'متكاملة للتأمين', logo: '', color: '#ea580c' },
  { id: 'gig', name: 'جي.آي.جي', logo: '', color: '#3289fc' },
  { id: 'jazira', name: 'الجزيرة التكافل', logo: '', color: '#0f776c' },
];

// Prices sourced from tamnbcare.online/compare (discounted column)
const TPL_FEATURES = [
  'تغطية الأضرار التي تلحق بالغير',
  'متوافق مع متطلبات المرور',
  'إصدار فوري للوثيقة',
];
const SHAMIL_A = [
  'تغطية شاملة للمركبة',
  'إصلاح في الوكالة',
  'سحب مجاني داخل المدينة',
  'تغطية السرقة والحريق',
];
const SHAMIL_B = [
  'تغطية شاملة للمركبة',
  'سيارة بديلة 10 أيام',
  'تغطية الكوارث الطبيعية',
  'خصم عدم المطالبة 20%',
];
const SHAMIL_C = [
  'تغطية شاملة للمركبة',
  'سيارة بديلة 7 أيام',
  'المساعدة على الطريق مجاناً',
  'تغطية دول الخليج',
];

export const carInsuranceOffers: InsuranceOffer[] = [
  // === ضد الغير ===
  { id: 'tpl-yaqoot', companyId: 'yaqoot', companyName: 'ياقوت', logo: '', color: '#3289fc', type: 'ضد الغير', price: 370, deductible: 0, features: TPL_FEATURES, rating: 4.3 },
  { id: 'tpl-drv7', companyId: 'drv7', companyName: 'درايف7', logo: '', color: '#14b89c', type: 'ضد الغير', price: 375, deductible: 0, features: TPL_FEATURES, rating: 4.4 },
  { id: 'tpl-brooj', companyId: 'brooj', companyName: 'بروج للتأمين التعاوني', logo: '', color: '#1b6af0', type: 'ضد الغير', price: 390, deductible: 0, features: TPL_FEATURES, rating: 4.0 },
  { id: 'tpl-amana', companyId: 'amana', companyName: 'أمانة للتأمين التعاوني', logo: '', color: '#1b6af0', type: 'ضد الغير', price: 395, deductible: 0, features: TPL_FEATURES, rating: 4.0 },
  { id: 'tpl-rajhi', companyId: 'alrajhi', companyName: 'تكافل الراجحي', logo: '', color: '#0f776c', type: 'ضد الغير', price: 400, deductible: 0, features: TPL_FEATURES, rating: 4.7, popular: true, featured: true },
  { id: 'tpl-walaa', companyId: 'walaa', companyName: 'ولاء للتأمين التعاوني', logo: '', color: '#3289fc', type: 'ضد الغير', price: 400, deductible: 0, features: TPL_FEATURES, rating: 4.2 },
  { id: 'tpl-wafa', companyId: 'wafa', companyName: 'وفاء للتأمين', logo: '', color: '#f97316', type: 'ضد الغير', price: 405, deductible: 0, features: TPL_FEATURES, rating: 4.0 },
  { id: 'tpl-salama', companyId: 'salama', companyName: 'سلامة للتأمين', logo: '', color: '#14b89c', type: 'ضد الغير', price: 410, deductible: 0, features: TPL_FEATURES, rating: 4.3 },
  { id: 'tpl-shield', companyId: 'shield', companyName: 'الدرع العربي', logo: '', color: '#0d9583', type: 'ضد الغير', price: 420, deductible: 0, features: TPL_FEATURES, rating: 4.2 },
  { id: 'tpl-gulf', companyId: 'gulf', companyName: 'الخليجية العامة للتأمين', logo: '', color: '#193e8c', type: 'ضد الغير', price: 425, deductible: 0, features: TPL_FEATURES, rating: 4.2 },
  { id: 'tpl-arabia', companyId: 'arabia', companyName: 'التأمين العربي التعاوني', logo: '', color: '#1454dc', type: 'ضد الغير', price: 430, deductible: 0, features: TPL_FEATURES, rating: 4.1 },
  { id: 'tpl-national', companyId: 'national', companyName: 'الوطنية للتأمين', logo: '', color: '#14b89c', type: 'ضد الغير', price: 430, deductible: 0, features: TPL_FEATURES, rating: 4.0 },
  { id: 'tpl-mtkmla', companyId: 'mtkmla', companyName: 'متكاملة للتأمين', logo: '', color: '#ea580c', type: 'ضد الغير', price: 445, deductible: 0, features: TPL_FEATURES, rating: 4.1 },
  { id: 'tpl-gig', companyId: 'gig', companyName: 'جي.آي.جي', logo: '', color: '#3289fc', type: 'ضد الغير', price: 455, deductible: 0, features: TPL_FEATURES, rating: 4.6 },
  { id: 'tpl-midgulf', companyId: 'midgulf', companyName: 'ميدغلف السعودية', logo: '', color: '#ea580c', type: 'ضد الغير', price: 460, deductible: 0, features: TPL_FEATURES, rating: 4.4 },
  { id: 'tpl-tawuniya', companyId: 'tawuniya', companyName: 'التعاونية', logo: '', color: '#1b6af0', type: 'ضد الغير', price: 470, deductible: 0, features: TPL_FEATURES, rating: 4.5 },
  { id: 'tpl-jazira', companyId: 'jazira', companyName: 'الجزيرة التكافل', logo: '', color: '#0f776c', type: 'ضد الغير', price: 470, deductible: 0, features: TPL_FEATURES, rating: 4.0 },
  { id: 'tpl-livva', companyId: 'livva', companyName: 'ليڤا للتأمين', logo: '', color: '#193e8c', type: 'ضد الغير', price: 480, deductible: 0, features: TPL_FEATURES, rating: 4.2 },
  { id: 'tpl-allianz', companyId: 'allianz', companyName: 'اليانز للتأمين', logo: '', color: '#1454dc', type: 'ضد الغير', price: 505, deductible: 0, features: TPL_FEATURES, rating: 4.7 },

  // === شامل ===
  { id: 'shm-yaqoot', companyId: 'yaqoot', companyName: 'ياقوت', logo: '', color: '#3289fc', type: 'شامل', price: 1425, deductible: 750, features: SHAMIL_A, rating: 4.3 },
  { id: 'shm-drv7', companyId: 'drv7', companyName: 'درايف7', logo: '', color: '#14b89c', type: 'شامل', price: 1445, deductible: 1000, features: SHAMIL_B, rating: 4.4 },
  { id: 'shm-brooj', companyId: 'brooj', companyName: 'بروج للتأمين التعاوني', logo: '', color: '#1b6af0', type: 'شامل', price: 1490, deductible: 750, features: SHAMIL_A, rating: 4.0 },
  { id: 'shm-amana', companyId: 'amana', companyName: 'أمانة للتأمين التعاوني', logo: '', color: '#1b6af0', type: 'شامل', price: 1505, deductible: 500, features: SHAMIL_C, rating: 4.0 },
  { id: 'shm-walaa', companyId: 'walaa', companyName: 'ولاء للتأمين التعاوني', logo: '', color: '#3289fc', type: 'شامل', price: 1520, deductible: 500, features: SHAMIL_C, rating: 4.2 },
  { id: 'shm-wafa', companyId: 'wafa', companyName: 'وفاء للتأمين', logo: '', color: '#f97316', type: 'شامل', price: 1550, deductible: 1000, features: SHAMIL_B, rating: 4.0 },
  { id: 'shm-salama', companyId: 'salama', companyName: 'سلامة للتأمين', logo: '', color: '#14b89c', type: 'شامل', price: 1585, deductible: 750, features: SHAMIL_A, rating: 4.3 },
  { id: 'shm-rajhi', companyId: 'alrajhi', companyName: 'تكافل الراجحي', logo: '', color: '#0f776c', type: 'شامل', price: 1590, deductible: 1000, features: SHAMIL_B, rating: 4.7, popular: true, featured: true },
  { id: 'shm-shield', companyId: 'shield', companyName: 'الدرع العربي', logo: '', color: '#0d9583', type: 'شامل', price: 1595, deductible: 1000, features: SHAMIL_B, rating: 4.2 },
  { id: 'shm-gig', companyId: 'gig', companyName: 'جي.آي.جي', logo: '', color: '#3289fc', type: 'شامل', price: 1600, deductible: 500, features: SHAMIL_C, rating: 4.6 },
  { id: 'shm-gulf', companyId: 'gulf', companyName: 'الخليجية العامة للتأمين', logo: '', color: '#193e8c', type: 'شامل', price: 1610, deductible: 500, features: SHAMIL_C, rating: 4.2 },
  { id: 'shm-jazira', companyId: 'jazira', companyName: 'الجزيرة التكافل', logo: '', color: '#0f776c', type: 'شامل', price: 1640, deductible: 750, features: SHAMIL_A, rating: 4.0 },
  { id: 'shm-arabia', companyId: 'arabia', companyName: 'التأمين العربي التعاوني', logo: '', color: '#1454dc', type: 'شامل', price: 1655, deductible: 500, features: SHAMIL_C, rating: 4.1 },
  { id: 'shm-tawuniya', companyId: 'tawuniya', companyName: 'التعاونية', logo: '', color: '#1b6af0', type: 'شامل', price: 1740, deductible: 500, features: SHAMIL_C, rating: 4.5 },
  { id: 'shm-midgulf', companyId: 'midgulf', companyName: 'ميدغلف السعودية', logo: '', color: '#ea580c', type: 'شامل', price: 1760, deductible: 750, features: SHAMIL_A, rating: 4.4 },
  { id: 'shm-national', companyId: 'national', companyName: 'الوطنية للتأمين', logo: '', color: '#14b89c', type: 'شامل', price: 1760, deductible: 750, features: SHAMIL_A, rating: 4.0 },
  { id: 'shm-mtkmla', companyId: 'mtkmla', companyName: 'متكاملة للتأمين', logo: '', color: '#ea580c', type: 'شامل', price: 1800, deductible: 1000, features: SHAMIL_B, rating: 4.1 },
  { id: 'shm-livva', companyId: 'livva', companyName: 'ليڤا للتأمين', logo: '', color: '#193e8c', type: 'شامل', price: 1805, deductible: 750, features: SHAMIL_A, rating: 4.2 },
  { id: 'shm-allianz', companyId: 'allianz', companyName: 'اليانز للتأمين', logo: '', color: '#1454dc', type: 'شامل', price: 1875, deductible: 500, features: SHAMIL_C, rating: 4.7 },
];

export const carBrands = [
  'تويوتا', 'هيونداي', 'كيا', 'نيسان', 'فورد', 'شيفروليه', 'مرسيدس', 'بي إم دبليو',
  'لكزس', 'هوندا', 'مازدا', 'ميتسوبيشي', 'فولكس واجن', 'أودي', 'جيب', 'دودج',
  'جي إم سي', 'كاديلاك', 'إنفiniti', 'بيجو', 'رينو', 'سكودا', 'سوبارو', 'سوزوكي',
];

export const carModels = [
  'كامري 2023', 'كورولا 2023', 'سوناتا 2023', 'إلنترا 2023', 'أوبتيا 2023',
  'صني 2023', 'التيرا 2023', 'إكسبلورر 2023', 'تاهو 2023', 'C200 2023',
  'X5 2023', 'ES350 2023', 'سيفيك 2023', 'CX-5 2023', 'باترول 2023',
];

export const saudiCities = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر',
  'الظهران', 'الطائف', 'تبوك', 'بريدة', 'أبها', 'خميس مشيط', 'حائل', 'نجران',
  'جازان', 'ينبع', 'الأحساء', 'الجبيل', 'القطيف', 'عرعر', 'سكاكا', 'الباحة',
];

export const faqs = [
  {
    q: 'كيف أقارن عروض التأمين؟',
    a: 'أدخل بيانات مركبتك وستحصل على مقارنة فورية لكل عروض شركات التأمين، مع إمكانية فلترة النتائج حسب السعر والتغطية.',
  },
  {
    q: 'هل إصدار الوثيقة فوري؟',
    a: 'نعم، بعد اختيار العرض المناسب وإتمام عملية الدفع، يتم إصدار الوثيقة فوراً وربطها بنظام المرور ونجم.',
  },
  {
    q: 'ما الفرق بين التأمين الشامل وضد الغير؟',
    a: 'التأمين الشامل يغطي أضرار مركبتك وأضرار الغير، بينما التأمين ضد الغير يغطي فقط أضرار الطرف الآخر.',
  },
  {
    q: 'هل يمكنني تقسيط التأمين؟',
    a: 'نعم، نقدم خدمة تقسيط التأمين على بطاقات الائتمان مع إمكانية الدفع على دفعات متعددة.',
  },
  {
    q: 'كيف أتواصل مع الدعم الفني؟',
    a: 'يمكنك التواصل معنا عبر الهاتف أو البريد الإلكتروني أو من خلال نموذج التواصل في الموقع.',
  },
  {
    q: 'هل بياناتي آمنة؟',
    a: 'نعم، نستخدم أحدث تقنيات التشفير لحماية بياناتك الشخصية وبيانات الدفع.',
  },
];

export const testimonials = [
  {
    name: 'أحمد العتيبي',
    city: 'الرياض',
    text: 'خدمة ممتازة وسريعة، قارنت أكثر من 10 عروض في دقائق واخترت الأنسب لي. أنصح الجميع بتجربة بيكير.',
    rating: 5,
  },
  {
    name: 'سارة القحطاني',
    city: 'جدة',
    text: 'أعجبني سهولة الموقع وسرعة إصدار الوثيقة. وفّرت علي وقت ومجهود كبير في البحث عن أفضل سعر.',
    rating: 5,
  },
  {
    name: 'محمد الدوسري',
    city: 'الدمام',
    text: 'أول مرة أقدر أقارن كل عروض التأمين في مكان واحد. الخصومات ممتازة والخدمة احترافية.',
    rating: 4,
  },
  {
    name: 'نورة الحربي',
    city: 'مكة المكرمة',
    text: 'تجربة رائعة من البداية للنهاية. الدعم الفني متعاون والأسعار منافسة جداً.',
    rating: 5,
  },
  {
    name: 'فهد الشمري',
    city: 'الطائف',
    text: 'بيكير وفّر لي أكثر من 400 ريال على تأمين سيارتي. منصة لا غنى عنها.',
    rating: 5,
  },
  {
    name: 'ريم الزهراني',
    city: 'الخبر',
    text: 'واجهة سهلة الاستخدام وعروض متنوعة. اخترت تأمين شامل بسعر ممتاز في أقل من 10 دقائق.',
    rating: 4,
  },
];

export const blogPosts = [
  {
    id: '1',
    title: 'دليلك الشامل لتأمين السيارات في السعودية 2026',
    excerpt: 'كل ما تحتاج معرفته عن أنواع تأمين السيارات، الفروقات بينها، وكيفية اختيار الأفضل لك.',
    date: '15 يناير 2026',
    category: 'تأمين السيارات',
    image: '',
  },
  {
    id: '2',
    title: 'كيف تختار التأمين الطبي المناسب لعائلتك',
    excerpt: 'نصائح عملية لاختيار التأمين الطبي الأنسب لك ولعائلتك بأفضل تغطية وسعر.',
    date: '8 يناير 2026',
    category: 'التأمين الطبي',
    image: '',
  },
  {
    id: '3',
    title: 'تأمين السفر: ماذا يغطي ولماذا تحتاجه',
    excerpt: 'تعرف على أهمية تأمين السفر وما يغطيه قبل سفرك القادم.',
    date: '2 يناير 2026',
    category: 'تأمين السفر',
    image: '',
  },
  {
    id: '4',
    title: 'فوائد تقسيط تأمين السيارات',
    excerpt: 'كيف يمكن لتقسيط التأمين أن يساعدك في إدارة ميزانيتك الشهرية.',
    date: '28 ديسمبر 2025',
    category: 'تأمين السيارات',
    image: '',
  },
  {
    id: '5',
    title: 'الفرق بين التأمين الشامل وضد الغير',
    excerpt: 'شرح مفصل للفروقات بين نوعي التأمين الأكثر شيوعاً في السعودية.',
    date: '20 ديسمبر 2025',
    category: 'تأمين السيارات',
    image: '',
  },
  {
    id: '6',
    title: 'طرق توفير المال عند شراء التأمين',
    excerpt: 'نصائح ذكية لتقليل تكلفة تأمينك دون التضحية بالتغطية.',
    date: '15 ديسمبر 2025',
    category: 'نصائح',
    image: '',
  },
];

export const features = [
  {
    icon: 'zap',
    title: 'إصدار سريع',
    description: 'أصدر وثيقتك في دقائق مع ربط مباشر بنظام المرور ونجم',
  },
  {
    icon: 'tag',
    title: 'أسعار أقل',
    description: 'نقارن لك كل عروض الأسعار بشكل فوري من كل شركات التأمين',
  },
  {
    icon: 'shield-check',
    title: 'منافع تحميك',
    description: 'خطط تأمين متنوعة مع المرونة في تحديد المنافع الإضافية',
  },
  {
    icon: 'calendar-check',
    title: 'جدول تأمينك',
    description: 'نرسل لك إشعارات تذكيرية لتجديد تأمينك وتقدر تجدول تاريخ بدايته',
  },
  {
    icon: 'folder',
    title: 'مكان واحد',
    description: 'تدير كل وثائقك إدارة إلكترونية كاملة من مكان واحد وتجددها في أي وقت',
  },
  {
    icon: 'credit-card',
    title: 'نقّسط تأمينك',
    description: 'نقسط لك تأمينك على البطاقات الائتمانية بكل سهولة',
  },
];
