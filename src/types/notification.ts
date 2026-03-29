export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';
export type NotificationStatus = 'draft' | 'scheduled' | 'sent' | 'expired';
export type DeliveryChannel = 'email' | 'app-notification' | 'pop-up' | 'sticky-banner';
export type AudienceRole = 'student' | 'teacher' | 'parent';

export interface AudienceTarget {
  roles: AudienceRole[];
  grades: string[];
  classes: string[];
  estimatedCount: number;
}

export interface EmailConfig {
  subject: string;
  body: string;
  imageUrl: string;
  ctaLabel: string;
  ctaUrl: string;
}

export interface AppNotifConfig {
  title: string;
  message: string;
  actionLabel: string;
  actionUrl: string;
}

export interface PopUpConfig {
  title: string;
  body: string;
  imageUrl: string;
  primaryLabel: string;
  primaryUrl: string;
  dismissLabel: string;
  priority: number;
}

export interface BannerConfig {
  message: string;
  ctaLabel: string;
  ctaUrl: string;
  dismissible: boolean;
  colorTheme: string;
}

export interface NotificationStats {
  delivered: number;
  opened: number;
  clicked: number;
  dismissed: number;
}

export interface Notification {
  id: string;
  title: string;
  campaignName: string;
  description: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  audience: AudienceTarget;
  channels: DeliveryChannel[];
  emailConfig?: EmailConfig;
  appNotifConfig?: AppNotifConfig;
  popUpConfig?: PopUpConfig;
  bannerConfig?: BannerConfig;
  sendNow: boolean;
  scheduledAt: string | null;
  sentAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  stats: NotificationStats;
}

export interface ComposeFormState {
  step: number;
  title: string;
  campaignName: string;
  description: string;
  priority: NotificationPriority;
  expiresAt: string;
  audience: AudienceTarget;
  channels: DeliveryChannel[];
  emailConfig: EmailConfig;
  appNotifConfig: AppNotifConfig;
  popUpConfig: PopUpConfig;
  bannerConfig: BannerConfig;
  sendNow: boolean;
  scheduledAt: string;
}

export type ComposeAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'UPDATE_FIELD'; field: string; value: unknown }
  | { type: 'UPDATE_AUDIENCE'; payload: Partial<AudienceTarget> }
  | { type: 'TOGGLE_CHANNEL'; channel: DeliveryChannel }
  | { type: 'UPDATE_EMAIL_CONFIG'; payload: Partial<EmailConfig> }
  | { type: 'UPDATE_APP_NOTIF_CONFIG'; payload: Partial<AppNotifConfig> }
  | { type: 'UPDATE_POPUP_CONFIG'; payload: Partial<PopUpConfig> }
  | { type: 'UPDATE_BANNER_CONFIG'; payload: Partial<BannerConfig> }
  | { type: 'SET_SCHEDULE'; sendNow: boolean; scheduledAt: string }
  | { type: 'RESET' };

export const INITIAL_COMPOSE_STATE: ComposeFormState = {
  step: 0,
  title: '',
  campaignName: '',
  description: '',
  priority: 'normal',
  expiresAt: '',
  audience: { roles: [], grades: [], classes: [], estimatedCount: 0 },
  channels: [],
  emailConfig: { subject: '', body: '', imageUrl: '', ctaLabel: '', ctaUrl: '' },
  appNotifConfig: { title: '', message: '', actionLabel: '', actionUrl: '' },
  popUpConfig: { title: '', body: '', imageUrl: '', primaryLabel: '', primaryUrl: '', dismissLabel: 'Dismiss', priority: 1 },
  bannerConfig: { message: '', ctaLabel: '', ctaUrl: '', dismissible: true, colorTheme: 'duo-blue' },
  sendNow: true,
  scheduledAt: '',
};

export function composeReducer(state: ComposeFormState, action: ComposeAction): ComposeFormState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'UPDATE_AUDIENCE':
      return { ...state, audience: { ...state.audience, ...action.payload } };
    case 'TOGGLE_CHANNEL': {
      const has = state.channels.includes(action.channel);
      return {
        ...state,
        channels: has
          ? state.channels.filter(c => c !== action.channel)
          : [...state.channels, action.channel],
      };
    }
    case 'UPDATE_EMAIL_CONFIG':
      return { ...state, emailConfig: { ...state.emailConfig, ...action.payload } };
    case 'UPDATE_APP_NOTIF_CONFIG':
      return { ...state, appNotifConfig: { ...state.appNotifConfig, ...action.payload } };
    case 'UPDATE_POPUP_CONFIG':
      return { ...state, popUpConfig: { ...state.popUpConfig, ...action.payload } };
    case 'UPDATE_BANNER_CONFIG':
      return { ...state, bannerConfig: { ...state.bannerConfig, ...action.payload } };
    case 'SET_SCHEDULE':
      return { ...state, sendNow: action.sendNow, scheduledAt: action.scheduledAt };
    case 'RESET':
      return INITIAL_COMPOSE_STATE;
    default:
      return state;
  }
}

export const CHANNEL_LABELS: Record<DeliveryChannel, { label: string; icon: string; description: string }> = {
  'email': { label: 'Email', icon: 'Mail', description: 'Branded email to registered addresses' },
  'app-notification': { label: 'App Notification', icon: 'Bell', description: 'In-app bell notification' },
  'pop-up': { label: 'Platform Pop-Up', icon: 'MessageSquare', description: 'Modal shown on next login' },
  'sticky-banner': { label: 'Sticky Banner', icon: 'Flag', description: 'Persistent bar below navigation' },
};

export const PRIORITY_CONFIG: Record<NotificationPriority, { label: string; color: string; bgColor: string; borderColor: string }> = {
  low: { label: 'Low', color: 'text-slate-600', bgColor: 'bg-slate-50', borderColor: 'border-slate-200' },
  normal: { label: 'Normal', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  high: { label: 'High', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  urgent: { label: 'Urgent', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
};

export const STATUS_CONFIG: Record<NotificationStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Draft', color: 'text-slate-600', bgColor: 'bg-slate-100' },
  scheduled: { label: 'Scheduled', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  sent: { label: 'Sent', color: 'text-emerald-700', bgColor: 'bg-emerald-50' },
  expired: { label: 'Expired', color: 'text-red-600', bgColor: 'bg-red-50' },
};

export const ALL_GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
export const ALL_CLASSES = ['A', 'B', 'C', 'D'];
