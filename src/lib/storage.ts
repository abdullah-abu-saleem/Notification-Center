import type { Notification, NotificationStats } from '@/types/notification';

const STORAGE_KEY = 'nc-notifications';
const DRAFT_KEY = 'nc-notification-draft';
const DATA_LOCALE_KEY = 'nc-data-locale';

export function loadNotifications(locale: 'en' | 'ar' = 'en'): Notification[] {
  try {
    const storedLocale = localStorage.getItem(DATA_LOCALE_KEY);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && storedLocale === locale) return JSON.parse(stored);
  } catch (e) {
    console.warn('Failed to load notifications:', e);
  }
  const seed = generateMockNotifications(locale);
  saveAllNotifications(seed);
  try { localStorage.setItem(DATA_LOCALE_KEY, locale); } catch {}
  return seed;
}

export function saveAllNotifications(notifications: Notification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.warn('Failed to save notifications:', e);
  }
}

export function addNotification(notification: Notification): Notification[] {
  const all = loadNotifications();
  all.unshift(notification);
  saveAllNotifications(all);
  return all;
}

export function updateNotification(id: string, partial: Partial<Notification>): Notification[] {
  const all = loadNotifications();
  const idx = all.findIndex(n => n.id === id);
  if (idx !== -1) all[idx] = { ...all[idx], ...partial };
  saveAllNotifications(all);
  return all;
}

export function deleteNotification(id: string): Notification[] {
  const all = loadNotifications().filter(n => n.id !== id);
  saveAllNotifications(all);
  return all;
}

export function loadDraft(): string | null {
  try {
    return localStorage.getItem(DRAFT_KEY);
  } catch {
    return null;
  }
}

export function saveDraft(formState: unknown): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formState));
  } catch (e) {
    console.warn('Failed to save draft:', e);
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
}

export function generateId(): string {
  return 'notif-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

function randomStats(audience: number): NotificationStats {
  const delivered = Math.floor(audience * (0.85 + Math.random() * 0.14));
  const opened = Math.floor(delivered * (0.4 + Math.random() * 0.45));
  const clicked = Math.floor(opened * (0.2 + Math.random() * 0.4));
  const dismissed = Math.floor(delivered * (0.05 + Math.random() * 0.15));
  return { delivered, opened, clicked, dismissed };
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function generateMockNotifications(locale: 'en' | 'ar' = 'en'): Notification[] {
  if (locale === 'ar') return generateArabicMocks();
  return generateEnglishMocks();
}

function generateEnglishMocks(): Notification[] {
  return [
    {
      id: 'notif-mock-001',
      title: 'End of Term Exam Schedule',
      campaignName: 'Term 2 Exams 2026',
      description: 'Notify all students and parents about upcoming final exams schedule and preparation tips.',
      priority: 'high',
      status: 'sent',
      audience: { roles: ['student', 'parent'], grades: ['7', '8', '9', '10', '11', '12'], classes: [], estimatedCount: 840 },
      channels: ['email', 'app-notification', 'pop-up'],
      emailConfig: { subject: 'Final Exam Schedule — Term 2', body: 'Dear Students and Parents,\n\nPlease find attached the final exam schedule for Term 2. Exams begin on April 15th. Make sure to review the preparation guidelines included.\n\nBest regards,\nAl-Khadr Modern Schools', imageUrl: '', ctaLabel: 'View Schedule', ctaUrl: '/announcements/exams' },
      appNotifConfig: { title: 'Exam Schedule Published', message: 'Term 2 final exam schedule is now available. Tap to view.', actionLabel: 'View', actionUrl: '/announcements/exams' },
      popUpConfig: { title: 'Final Exams Starting Soon', body: 'The Term 2 exam schedule has been published. Please review the dates and preparation guidelines.', imageUrl: '', primaryLabel: 'View Schedule', primaryUrl: '/announcements/exams', dismissLabel: 'Later', priority: 2 },
      sendNow: true,
      scheduledAt: null,
      sentAt: daysAgo(3),
      expiresAt: daysFromNow(12),
      createdAt: daysAgo(5),
      stats: randomStats(840),
    },
    {
      id: 'notif-mock-002',
      title: 'Parent-Teacher Conference',
      campaignName: 'PTC March 2026',
      description: 'Invite parents to the upcoming parent-teacher conference with booking details.',
      priority: 'normal',
      status: 'sent',
      audience: { roles: ['parent'], grades: ['1', '2', '3', '4', '5', '6'], classes: [], estimatedCount: 420 },
      channels: ['email', 'sticky-banner'],
      emailConfig: { subject: 'You\'re Invited: Parent-Teacher Conference', body: 'Dear Parents,\n\nWe are pleased to invite you to the Parent-Teacher Conference on March 30th. Please book your preferred time slot using the link below.', imageUrl: '', ctaLabel: 'Book Time Slot', ctaUrl: '/ptc/booking' },
      bannerConfig: { message: 'Parent-Teacher Conference: March 30th — Book your slot now!', ctaLabel: 'Book Now', ctaUrl: '/ptc/booking', dismissible: true, colorTheme: 'duo-blue' },
      sendNow: true,
      scheduledAt: null,
      sentAt: daysAgo(7),
      expiresAt: daysFromNow(2),
      createdAt: daysAgo(10),
      stats: randomStats(420),
    },
    {
      id: 'notif-mock-003',
      title: 'New Learning Platform Features',
      campaignName: 'Platform Update v2.5',
      description: 'Announce new skill map visualizations and practice mode to all users.',
      priority: 'low',
      status: 'sent',
      audience: { roles: ['student', 'teacher'], grades: [], classes: [], estimatedCount: 650 },
      channels: ['app-notification', 'sticky-banner'],
      appNotifConfig: { title: 'New Features Available!', message: 'Check out the new Galaxy skill map and practice mode.', actionLabel: 'Explore', actionUrl: '/skill-map' },
      bannerConfig: { message: 'New! Galaxy skill map & practice mode are here.', ctaLabel: 'Try Now', ctaUrl: '/skill-map', dismissible: true, colorTheme: 'duo-purple' },
      sendNow: true,
      scheduledAt: null,
      sentAt: daysAgo(14),
      expiresAt: daysAgo(1),
      createdAt: daysAgo(15),
      stats: randomStats(650),
    },
    {
      id: 'notif-mock-004',
      title: 'School Sports Day',
      campaignName: 'Sports Day 2026',
      description: 'Announce the annual sports day event with registration details.',
      priority: 'normal',
      status: 'scheduled',
      audience: { roles: ['student', 'parent', 'teacher'], grades: [], classes: [], estimatedCount: 1200 },
      channels: ['email', 'app-notification', 'pop-up'],
      emailConfig: { subject: 'Annual Sports Day — April 20th', body: 'Get ready for the biggest sports event of the year! Register your child for events by April 10th.', imageUrl: '', ctaLabel: 'Register Now', ctaUrl: '/events/sports-day' },
      appNotifConfig: { title: 'Sports Day Registration Open', message: 'Register for Sports Day events before April 10th.', actionLabel: 'Register', actionUrl: '/events/sports-day' },
      popUpConfig: { title: 'Sports Day 2026!', body: 'Annual Sports Day is on April 20th. Registration closes April 10th.', imageUrl: '', primaryLabel: 'Register', primaryUrl: '/events/sports-day', dismissLabel: 'Remind Me Later', priority: 1 },
      sendNow: false,
      scheduledAt: daysFromNow(3),
      sentAt: null,
      expiresAt: daysFromNow(25),
      createdAt: daysAgo(2),
      stats: { delivered: 0, opened: 0, clicked: 0, dismissed: 0 },
    },
    {
      id: 'notif-mock-005',
      title: 'Ramadan Schedule Change',
      campaignName: 'Ramadan Hours 2026',
      description: 'Inform everyone about adjusted school hours during Ramadan.',
      priority: 'urgent',
      status: 'sent',
      audience: { roles: ['student', 'parent', 'teacher'], grades: [], classes: [], estimatedCount: 1200 },
      channels: ['email', 'app-notification', 'sticky-banner', 'pop-up'],
      emailConfig: { subject: 'Updated School Hours — Ramadan', body: 'School hours will be adjusted during the holy month of Ramadan. Classes will run from 8:00 AM to 1:00 PM starting March 1st.', imageUrl: '', ctaLabel: 'View Full Schedule', ctaUrl: '/schedule/ramadan' },
      appNotifConfig: { title: 'Ramadan Schedule', message: 'School hours adjusted: 8 AM – 1 PM during Ramadan.', actionLabel: 'Details', actionUrl: '/schedule/ramadan' },
      popUpConfig: { title: 'Ramadan Schedule Update', body: 'School hours will be 8:00 AM – 1:00 PM during Ramadan, effective March 1st.', imageUrl: '', primaryLabel: 'View Schedule', primaryUrl: '/schedule/ramadan', dismissLabel: 'Got It', priority: 3 },
      bannerConfig: { message: 'Ramadan hours: 8 AM – 1 PM starting March 1st', ctaLabel: 'Details', ctaUrl: '/schedule/ramadan', dismissible: false, colorTheme: 'duo-gold' },
      sendNow: true,
      scheduledAt: null,
      sentAt: daysAgo(20),
      expiresAt: daysFromNow(10),
      createdAt: daysAgo(22),
      stats: randomStats(1200),
    },
    {
      id: 'notif-mock-006',
      title: 'Grade 12 Graduation Ceremony',
      campaignName: 'Graduation 2026',
      description: 'Details about the upcoming graduation ceremony for senior students.',
      priority: 'high',
      status: 'scheduled',
      audience: { roles: ['student', 'parent'], grades: ['12'], classes: [], estimatedCount: 120 },
      channels: ['email', 'pop-up'],
      emailConfig: { subject: 'Graduation Ceremony — June 15th', body: 'We are honored to invite you to the Class of 2026 Graduation Ceremony. Please RSVP by June 1st.', imageUrl: '', ctaLabel: 'RSVP Now', ctaUrl: '/events/graduation' },
      popUpConfig: { title: 'Graduation Ceremony', body: 'You\'re invited to the Class of 2026 Graduation! June 15th at the main auditorium.', imageUrl: '', primaryLabel: 'RSVP', primaryUrl: '/events/graduation', dismissLabel: 'Maybe Later', priority: 2 },
      sendNow: false,
      scheduledAt: daysFromNow(7),
      sentAt: null,
      expiresAt: daysFromNow(80),
      createdAt: daysAgo(1),
      stats: { delivered: 0, opened: 0, clicked: 0, dismissed: 0 },
    },
    {
      id: 'notif-mock-007',
      title: 'Weekly Math Challenge',
      campaignName: 'Math Challenge W12',
      description: 'Draft for the weekly math challenge notification.',
      priority: 'low',
      status: 'draft',
      audience: { roles: ['student'], grades: ['7', '8', '9'], classes: [], estimatedCount: 280 },
      channels: ['app-notification'],
      appNotifConfig: { title: 'Weekly Math Challenge', message: 'This week\'s challenge is live! Can you solve it?', actionLabel: 'Play', actionUrl: '/learn/math' },
      sendNow: true,
      scheduledAt: null,
      sentAt: null,
      expiresAt: null,
      createdAt: daysAgo(0),
      stats: { delivered: 0, opened: 0, clicked: 0, dismissed: 0 },
    },
    {
      id: 'notif-mock-008',
      title: 'Summer Break Announcement',
      campaignName: 'Summer 2025',
      description: 'Last year\'s summer break announcement — expired.',
      priority: 'normal',
      status: 'expired',
      audience: { roles: ['student', 'parent', 'teacher'], grades: [], classes: [], estimatedCount: 1200 },
      channels: ['email', 'sticky-banner'],
      emailConfig: { subject: 'Summer Break Begins June 20th', body: 'Wishing everyone a wonderful summer break. See you in September!', imageUrl: '', ctaLabel: '', ctaUrl: '' },
      bannerConfig: { message: 'Summer break starts June 20th. Have a great summer!', ctaLabel: '', ctaUrl: '', dismissible: true, colorTheme: 'duo-green' },
      sendNow: true,
      scheduledAt: null,
      sentAt: daysAgo(280),
      expiresAt: daysAgo(200),
      createdAt: daysAgo(285),
      stats: randomStats(1200),
    },
    {
      id: 'notif-mock-009',
      title: 'Teacher Professional Development Day',
      campaignName: 'PD Day April',
      description: 'Notify teachers about the upcoming professional development workshop.',
      priority: 'normal',
      status: 'draft',
      audience: { roles: ['teacher'], grades: [], classes: [], estimatedCount: 40 },
      channels: ['email', 'app-notification'],
      emailConfig: { subject: 'PD Day — April 5th', body: 'All teachers are required to attend the professional development workshop on April 5th. Topics include differentiated instruction and tech integration.', imageUrl: '', ctaLabel: 'View Agenda', ctaUrl: '/pd/agenda' },
      appNotifConfig: { title: 'PD Day Reminder', message: 'Professional Development Day on April 5th. Check the agenda.', actionLabel: 'View', actionUrl: '/pd/agenda' },
      sendNow: false,
      scheduledAt: '',
      sentAt: null,
      expiresAt: null,
      createdAt: daysAgo(1),
      stats: { delivered: 0, opened: 0, clicked: 0, dismissed: 0 },
    },
    {
      id: 'notif-mock-010',
      title: 'Library New Arrivals',
      campaignName: 'Library March 2026',
      description: 'Announce new book arrivals in the school library.',
      priority: 'low',
      status: 'sent',
      audience: { roles: ['student', 'teacher'], grades: [], classes: [], estimatedCount: 650 },
      channels: ['app-notification'],
      appNotifConfig: { title: 'New Books in the Library!', message: '15 new titles added this week. Come check them out!', actionLabel: 'Browse', actionUrl: '/library' },
      sendNow: true,
      scheduledAt: null,
      sentAt: daysAgo(5),
      expiresAt: daysFromNow(25),
      createdAt: daysAgo(6),
      stats: randomStats(650),
    },
  ];
}

function generateArabicMocks(): Notification[] {
  return [
    {
      id: 'notif-mock-001',
      title: 'جدول اختبارات نهاية الفصل',
      campaignName: 'اختبارات الفصل الثاني 2026',
      description: 'إبلاغ جميع الطلاب وأولياء الأمور بجدول الاختبارات النهائية ونصائح التحضير.',
      priority: 'high',
      status: 'sent',
      audience: { roles: ['student', 'parent'], grades: ['7', '8', '9', '10', '11', '12'], classes: [], estimatedCount: 840 },
      channels: ['email', 'app-notification', 'pop-up'],
      emailConfig: { subject: 'جدول الاختبارات النهائية — الفصل الثاني', body: 'أعزاءنا الطلاب وأولياء الأمور،\n\nيسرنا إعلامكم بجدول الاختبارات النهائية للفصل الثاني. تبدأ الاختبارات في 15 أبريل. يرجى مراجعة إرشادات التحضير المرفقة.\n\nمع أطيب التحيات،\nمدارس الخضر الحديثة', imageUrl: '', ctaLabel: 'عرض الجدول', ctaUrl: '/announcements/exams' },
      appNotifConfig: { title: 'تم نشر جدول الاختبارات', message: 'جدول اختبارات الفصل الثاني النهائية متاح الآن. اضغط للعرض.', actionLabel: 'عرض', actionUrl: '/announcements/exams' },
      popUpConfig: { title: 'الاختبارات النهائية قريبًا', body: 'تم نشر جدول اختبارات الفصل الثاني. يرجى مراجعة المواعيد وإرشادات التحضير.', imageUrl: '', primaryLabel: 'عرض الجدول', primaryUrl: '/announcements/exams', dismissLabel: 'لاحقًا', priority: 2 },
      sendNow: true,
      scheduledAt: null,
      sentAt: daysAgo(3),
      expiresAt: daysFromNow(12),
      createdAt: daysAgo(5),
      stats: randomStats(840),
    },
    {
      id: 'notif-mock-002',
      title: 'اجتماع أولياء الأمور والمعلمين',
      campaignName: 'اجتماع مارس 2026',
      description: 'دعوة أولياء الأمور لحضور اجتماع أولياء الأمور والمعلمين مع تفاصيل الحجز.',
      priority: 'normal',
      status: 'sent',
      audience: { roles: ['parent'], grades: ['1', '2', '3', '4', '5', '6'], classes: [], estimatedCount: 420 },
      channels: ['email', 'sticky-banner'],
      emailConfig: { subject: 'دعوة: اجتماع أولياء الأمور والمعلمين', body: 'أعزاءنا أولياء الأمور،\n\nيسرنا دعوتكم لحضور اجتماع أولياء الأمور والمعلمين في 30 مارس. يرجى حجز الموعد المناسب عبر الرابط أدناه.', imageUrl: '', ctaLabel: 'احجز موعدك', ctaUrl: '/ptc/booking' },
      bannerConfig: { message: 'اجتماع أولياء الأمور والمعلمين: 30 مارس — احجز موعدك الآن!', ctaLabel: 'احجز الآن', ctaUrl: '/ptc/booking', dismissible: true, colorTheme: 'duo-blue' },
      sendNow: true,
      scheduledAt: null,
      sentAt: daysAgo(7),
      expiresAt: daysFromNow(2),
      createdAt: daysAgo(10),
      stats: randomStats(420),
    },
    {
      id: 'notif-mock-003',
      title: 'ميزات جديدة في منصة التعلم',
      campaignName: 'تحديث المنصة v2.5',
      description: 'الإعلان عن خريطة المهارات الجديدة ووضع التدريب لجميع المستخدمين.',
      priority: 'low',
      status: 'sent',
      audience: { roles: ['student', 'teacher'], grades: [], classes: [], estimatedCount: 650 },
      channels: ['app-notification', 'sticky-banner'],
      appNotifConfig: { title: 'ميزات جديدة متاحة!', message: 'اكتشف خريطة المهارات الجديدة ووضع التدريب.', actionLabel: 'استكشف', actionUrl: '/skill-map' },
      bannerConfig: { message: 'جديد! خريطة المهارات ووضع التدريب متاحان الآن.', ctaLabel: 'جرّب الآن', ctaUrl: '/skill-map', dismissible: true, colorTheme: 'duo-purple' },
      sendNow: true,
      scheduledAt: null,
      sentAt: daysAgo(14),
      expiresAt: daysAgo(1),
      createdAt: daysAgo(15),
      stats: randomStats(650),
    },
    {
      id: 'notif-mock-004',
      title: 'اليوم الرياضي للمدرسة',
      campaignName: 'اليوم الرياضي 2026',
      description: 'الإعلان عن اليوم الرياضي السنوي مع تفاصيل التسجيل.',
      priority: 'normal',
      status: 'scheduled',
      audience: { roles: ['student', 'parent', 'teacher'], grades: [], classes: [], estimatedCount: 1200 },
      channels: ['email', 'app-notification', 'pop-up'],
      emailConfig: { subject: 'اليوم الرياضي السنوي — 20 أبريل', body: 'استعدوا لأكبر حدث رياضي في العام! سجّلوا أبناءكم في الفعاليات قبل 10 أبريل.', imageUrl: '', ctaLabel: 'سجّل الآن', ctaUrl: '/events/sports-day' },
      appNotifConfig: { title: 'التسجيل في اليوم الرياضي مفتوح', message: 'سجّل في فعاليات اليوم الرياضي قبل 10 أبريل.', actionLabel: 'تسجيل', actionUrl: '/events/sports-day' },
      popUpConfig: { title: 'اليوم الرياضي 2026!', body: 'اليوم الرياضي السنوي في 20 أبريل. ينتهي التسجيل في 10 أبريل.', imageUrl: '', primaryLabel: 'تسجيل', primaryUrl: '/events/sports-day', dismissLabel: 'ذكّرني لاحقًا', priority: 1 },
      sendNow: false,
      scheduledAt: daysFromNow(3),
      sentAt: null,
      expiresAt: daysFromNow(25),
      createdAt: daysAgo(2),
      stats: { delivered: 0, opened: 0, clicked: 0, dismissed: 0 },
    },
    {
      id: 'notif-mock-005',
      title: 'تغيير مواعيد رمضان',
      campaignName: 'مواعيد رمضان 2026',
      description: 'إبلاغ الجميع بتعديل مواعيد الدوام خلال شهر رمضان.',
      priority: 'urgent',
      status: 'sent',
      audience: { roles: ['student', 'parent', 'teacher'], grades: [], classes: [], estimatedCount: 1200 },
      channels: ['email', 'app-notification', 'sticky-banner', 'pop-up'],
      emailConfig: { subject: 'تحديث مواعيد الدوام — رمضان', body: 'سيتم تعديل مواعيد الدوام خلال شهر رمضان المبارك. ستكون الحصص من الساعة 8:00 صباحًا حتى 1:00 ظهرًا اعتبارًا من 1 مارس.', imageUrl: '', ctaLabel: 'عرض الجدول الكامل', ctaUrl: '/schedule/ramadan' },
      appNotifConfig: { title: 'مواعيد رمضان', message: 'مواعيد الدوام المعدّلة: 8 ص – 1 م خلال رمضان.', actionLabel: 'التفاصيل', actionUrl: '/schedule/ramadan' },
      popUpConfig: { title: 'تحديث مواعيد رمضان', body: 'مواعيد الدوام ستكون من 8:00 صباحًا حتى 1:00 ظهرًا خلال رمضان، اعتبارًا من 1 مارس.', imageUrl: '', primaryLabel: 'عرض الجدول', primaryUrl: '/schedule/ramadan', dismissLabel: 'فهمت', priority: 3 },
      bannerConfig: { message: 'مواعيد رمضان: 8 ص – 1 م اعتبارًا من 1 مارس', ctaLabel: 'التفاصيل', ctaUrl: '/schedule/ramadan', dismissible: false, colorTheme: 'duo-gold' },
      sendNow: true,
      scheduledAt: null,
      sentAt: daysAgo(20),
      expiresAt: daysFromNow(10),
      createdAt: daysAgo(22),
      stats: randomStats(1200),
    },
    {
      id: 'notif-mock-006',
      title: 'حفل تخرج الصف الثاني عشر',
      campaignName: 'التخرج 2026',
      description: 'تفاصيل حفل التخرج القادم لطلاب الصف الثاني عشر.',
      priority: 'high',
      status: 'scheduled',
      audience: { roles: ['student', 'parent'], grades: ['12'], classes: [], estimatedCount: 120 },
      channels: ['email', 'pop-up'],
      emailConfig: { subject: 'حفل التخرج — 15 يونيو', body: 'يشرفنا دعوتكم لحضور حفل تخرج دفعة 2026. يرجى تأكيد الحضور قبل 1 يونيو.', imageUrl: '', ctaLabel: 'تأكيد الحضور', ctaUrl: '/events/graduation' },
      popUpConfig: { title: 'حفل التخرج', body: 'أنتم مدعوون لحضور حفل تخرج دفعة 2026! 15 يونيو في القاعة الرئيسية.', imageUrl: '', primaryLabel: 'تأكيد', primaryUrl: '/events/graduation', dismissLabel: 'ربما لاحقًا', priority: 2 },
      sendNow: false,
      scheduledAt: daysFromNow(7),
      sentAt: null,
      expiresAt: daysFromNow(80),
      createdAt: daysAgo(1),
      stats: { delivered: 0, opened: 0, clicked: 0, dismissed: 0 },
    },
    {
      id: 'notif-mock-007',
      title: 'تحدي الرياضيات الأسبوعي',
      campaignName: 'تحدي الرياضيات أ12',
      description: 'مسودة إشعار تحدي الرياضيات الأسبوعي.',
      priority: 'low',
      status: 'draft',
      audience: { roles: ['student'], grades: ['7', '8', '9'], classes: [], estimatedCount: 280 },
      channels: ['app-notification'],
      appNotifConfig: { title: 'تحدي الرياضيات الأسبوعي', message: 'تحدي هذا الأسبوع جاهز! هل تستطيع حله؟', actionLabel: 'العب', actionUrl: '/learn/math' },
      sendNow: true,
      scheduledAt: null,
      sentAt: null,
      expiresAt: null,
      createdAt: daysAgo(0),
      stats: { delivered: 0, opened: 0, clicked: 0, dismissed: 0 },
    },
    {
      id: 'notif-mock-008',
      title: 'إعلان الإجازة الصيفية',
      campaignName: 'صيف 2025',
      description: 'إعلان الإجازة الصيفية للعام الماضي — منتهي الصلاحية.',
      priority: 'normal',
      status: 'expired',
      audience: { roles: ['student', 'parent', 'teacher'], grades: [], classes: [], estimatedCount: 1200 },
      channels: ['email', 'sticky-banner'],
      emailConfig: { subject: 'تبدأ الإجازة الصيفية في 20 يونيو', body: 'نتمنى للجميع إجازة صيفية سعيدة. نراكم في سبتمبر!', imageUrl: '', ctaLabel: '', ctaUrl: '' },
      bannerConfig: { message: 'تبدأ الإجازة الصيفية في 20 يونيو. إجازة سعيدة!', ctaLabel: '', ctaUrl: '', dismissible: true, colorTheme: 'duo-green' },
      sendNow: true,
      scheduledAt: null,
      sentAt: daysAgo(280),
      expiresAt: daysAgo(200),
      createdAt: daysAgo(285),
      stats: randomStats(1200),
    },
    {
      id: 'notif-mock-009',
      title: 'يوم التطوير المهني للمعلمين',
      campaignName: 'يوم التطوير - أبريل',
      description: 'إبلاغ المعلمين بورشة التطوير المهني القادمة.',
      priority: 'normal',
      status: 'draft',
      audience: { roles: ['teacher'], grades: [], classes: [], estimatedCount: 40 },
      channels: ['email', 'app-notification'],
      emailConfig: { subject: 'يوم التطوير المهني — 5 أبريل', body: 'يجب على جميع المعلمين حضور ورشة التطوير المهني في 5 أبريل. تشمل المواضيع التعليم المتمايز ودمج التكنولوجيا.', imageUrl: '', ctaLabel: 'عرض البرنامج', ctaUrl: '/pd/agenda' },
      appNotifConfig: { title: 'تذكير يوم التطوير المهني', message: 'يوم التطوير المهني في 5 أبريل. راجع البرنامج.', actionLabel: 'عرض', actionUrl: '/pd/agenda' },
      sendNow: false,
      scheduledAt: '',
      sentAt: null,
      expiresAt: null,
      createdAt: daysAgo(1),
      stats: { delivered: 0, opened: 0, clicked: 0, dismissed: 0 },
    },
    {
      id: 'notif-mock-010',
      title: 'وصول كتب جديدة للمكتبة',
      campaignName: 'المكتبة مارس 2026',
      description: 'الإعلان عن وصول كتب جديدة إلى مكتبة المدرسة.',
      priority: 'low',
      status: 'sent',
      audience: { roles: ['student', 'teacher'], grades: [], classes: [], estimatedCount: 650 },
      channels: ['app-notification'],
      appNotifConfig: { title: 'كتب جديدة في المكتبة!', message: '15 عنوانًا جديدًا أُضيفت هذا الأسبوع. تعالوا واكتشفوها!', actionLabel: 'تصفّح', actionUrl: '/library' },
      sendNow: true,
      scheduledAt: null,
      sentAt: daysAgo(5),
      expiresAt: daysFromNow(25),
      createdAt: daysAgo(6),
      stats: randomStats(650),
    },
  ];
}
