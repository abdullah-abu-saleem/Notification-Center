import React from 'react';
import { X, Mail, Bell, MessageSquare, Flag, Send, Eye, MousePointer, XCircle, Users, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Notification, DeliveryChannel } from '@/types/notification';
import { STATUS_CONFIG, PRIORITY_CONFIG, CHANNEL_LABELS } from '@/types/notification';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  notification: Notification;
  onClose: () => void;
}

const CHANNEL_ICONS: Record<DeliveryChannel, React.FC<{ className?: string }>> = {
  'email': Mail,
  'app-notification': Bell,
  'pop-up': MessageSquare,
  'sticky-banner': Flag,
};

function formatDate(iso: string | null, locale: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

export const NotificationDetailModal: React.FC<Props> = ({ notification: n, onClose }) => {
  const { t, locale } = useLanguage();
  const localeCode = locale === 'ar' ? 'ar-SA' : 'en-US';
  const statusCfg = STATUS_CONFIG[n.status];
  const priorityCfg = PRIORITY_CONFIG[n.priority];
  const hasStats = n.stats.delivered > 0;
  const openRate = hasStats ? Math.round((n.stats.opened / n.stats.delivered) * 100) : 0;
  const clickRate = hasStats ? Math.round((n.stats.clicked / n.stats.delivered) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between shrink-0">
          <div className="flex-1 min-w-0 pr-4 rtl:pl-4 rtl:pr-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusCfg.color} ${statusCfg.bgColor}`}>
                {t(statusCfg.labelKey)}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${priorityCfg.color} ${priorityCfg.bgColor} border ${priorityCfg.borderColor}`}>
                {t(priorityCfg.labelKey)}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-800 truncate">{n.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{n.campaignName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {n.description && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{t('detail.description')}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{n.description}</p>
            </motion.div>
          )}

          {hasStats && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">{t('detail.performance')}</p>
              <div className="grid grid-cols-4 gap-3">
                <StatCard icon={Send} label={t('detail.delivered')} value={n.stats.delivered.toLocaleString(localeCode)} color="text-[#1CB0F6]" bg="bg-[#1CB0F6]/10" />
                <StatCard icon={Eye} label={t('detail.opened')} value={`${openRate}%`} color="text-[#58CC02]" bg="bg-[#58CC02]/10" />
                <StatCard icon={MousePointer} label={t('detail.clicked')} value={`${clickRate}%`} color="text-[#CE82FF]" bg="bg-[#CE82FF]/10" />
                <StatCard icon={XCircle} label={t('detail.dismissed')} value={n.stats.dismissed.toLocaleString(localeCode)} color="text-slate-500" bg="bg-slate-100" />
              </div>

              <div className="mt-4 bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-500 mb-2">{t('detail.deliveryFunnel')}</p>
                <div className="space-y-2">
                  <FunnelBar label={t('detail.delivered')} value={n.stats.delivered} max={n.audience.estimatedCount} color="bg-[#1CB0F6]" />
                  <FunnelBar label={t('detail.opened')} value={n.stats.opened} max={n.stats.delivered} color="bg-[#58CC02]" />
                  <FunnelBar label={t('detail.clicked')} value={n.stats.clicked} max={n.stats.delivered} color="bg-[#CE82FF]" />
                </div>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{t('detail.audience')}</p>
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
              <Users className="w-4 h-4 text-indigo-500" />
              <div>
                <p className="text-sm font-bold text-slate-700">
                  {n.audience.estimatedCount.toLocaleString(localeCode)} {t('detail.recipients')}
                </p>
                <p className="text-xs text-slate-400">
                  {n.audience.roles.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')}
                  {n.audience.grades.length > 0 && ` · ${t('detail.grades')} ${n.audience.grades.join(', ')}`}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{t('detail.channels')}</p>
            <div className="flex flex-wrap gap-2">
              {n.channels.map(ch => {
                const Icon = CHANNEL_ICONS[ch];
                return (
                  <div key={ch} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs font-bold text-slate-600">{t(CHANNEL_LABELS[ch].labelKey)}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{t('detail.timeline')}</p>
            <div className="space-y-2">
              <TimelineRow icon={Clock} label={t('detail.created')} value={formatDate(n.createdAt, locale)} />
              {n.sentAt && <TimelineRow icon={Send} label={t('detail.sent')} value={formatDate(n.sentAt, locale)} />}
              {n.scheduledAt && <TimelineRow icon={Calendar} label={t('detail.scheduled')} value={formatDate(n.scheduledAt, locale)} />}
              {n.expiresAt && <TimelineRow icon={XCircle} label={t('detail.expires')} value={formatDate(n.expiresAt, locale)} />}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.FC<{ className?: string }>; label: string; value: string; color: string; bg: string }> = ({ icon: Icon, label, value, color, bg }) => (
  <div className="text-center">
    <div className={`${bg} rounded-xl p-2 mx-auto w-fit mb-1.5`}>
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
    <p className="text-lg font-bold text-slate-800">{value}</p>
    <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
  </div>
);

const FunnelBar: React.FC<{ label: string; value: number; max: number; color: string }> = ({ label, value, max, color }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-slate-500">{label}</span>
        <span className="text-[10px] font-bold text-slate-700">{value.toLocaleString()} ({pct}%)</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  );
};

const TimelineRow: React.FC<{ icon: React.FC<{ className?: string }>; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 text-sm">
    <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    <span className="text-xs font-bold text-slate-400 uppercase w-20">{label}</span>
    <span className="text-xs font-medium text-slate-600">{value}</span>
  </div>
);
