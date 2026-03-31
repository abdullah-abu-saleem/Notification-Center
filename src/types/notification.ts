export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';
export type NotificationStatus = 'draft' | 'scheduled' | 'sent' | 'expired' | 'cancelled';
export type DeliveryChannel = 'email' | 'app-notification' | 'pop-up' | 'sticky-banner';
export type AudienceRole = 'student' | 'teacher' | 'parent';

export interface AudienceTarget {
  roles: AudienceRole[];
  grades: string[];
  classes: string[];
  estimatedCount: number;
  audienceSummary?: string;
}

export interface EmailConfig {
  subject: string;
  body: string;
  /** URL string or base64 data URI (data:image/...) from file upload */
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
  /** URL string or base64 data URI (data:image/...) from file upload */
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
  channelStats?: any;
  formConfig?: boolean;
  formStats?: { totalResponses: number };
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

export const CHANNEL_LABELS: Record<DeliveryChannel, { labelKey: string; icon: string; descKey: string }> = {
  'email': { labelKey: 'channelLabels.email', icon: 'Mail', descKey: 'channelLabels.emailDesc' },
  'app-notification': { labelKey: 'channelLabels.appNotification', icon: 'Bell', descKey: 'channelLabels.appNotificationDesc' },
  'pop-up': { labelKey: 'channelLabels.popUp', icon: 'MessageSquare', descKey: 'channelLabels.popUpDesc' },
  'sticky-banner': { labelKey: 'channelLabels.stickyBanner', icon: 'Flag', descKey: 'channelLabels.stickyBannerDesc' },
};

export const PRIORITY_CONFIG: Record<NotificationPriority, { labelKey: string; color: string; bgColor: string; borderColor: string }> = {
  low: { labelKey: 'priority.low', color: 'text-slate-600', bgColor: 'bg-slate-50', borderColor: 'border-slate-200' },
  normal: { labelKey: 'priority.normal', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  high: { labelKey: 'priority.high', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  urgent: { labelKey: 'priority.urgent', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
};

export const STATUS_CONFIG: Record<NotificationStatus, { labelKey: string; color: string; bgColor: string }> = {
  sent: { labelKey: 'status.sent', color: 'text-emerald-700', bgColor: 'bg-emerald-100/50' },
  draft: { labelKey: 'status.draft', color: 'text-slate-600', bgColor: 'bg-slate-100' },
  scheduled: { labelKey: 'status.scheduled', color: 'text-blue-700', bgColor: 'bg-blue-100/50' },
  expired: { labelKey: 'status.expired', color: 'text-orange-700', bgColor: 'bg-orange-100/50' },
  cancelled: { labelKey: 'status.cancelled', color: 'text-red-700', bgColor: 'bg-red-100/50' },
};

export const ALL_GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
export const ALL_CLASSES = ['A', 'B', 'C', 'D'];
