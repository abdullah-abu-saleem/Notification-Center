import React, { useMemo } from 'react';
import { Send, Eye, Megaphone, Clock, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { Notification } from '@/types/notification';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  notifications: Notification[];
  onCompose: () => void;
}

export const NotificationHeader: React.FC<Props> = ({ notifications, onCompose }) => {
  const { t } = useLanguage();

  const stats = useMemo(() => {
    const sent = notifications.filter(n => n.status === 'sent');
    const totalDelivered = sent.reduce((sum, n) => sum + n.stats.delivered, 0);
    const totalOpened = sent.reduce((sum, n) => sum + n.stats.opened, 0);
    const openRate = totalDelivered > 0 ? Math.round((totalOpened / totalDelivered) * 100) : 0;
    const active = notifications.filter(n => n.status === 'sent' || n.status === 'scheduled').length;
    const scheduled = notifications.filter(n => n.status === 'scheduled').length;

    return { totalSent: sent.length, openRate, active, scheduled };
  }, [notifications]);

  const cards = [
    { label: t('dashboard.totalSent'), value: stats.totalSent, icon: Send, color: 'text-[#1CB0F6]', bg: 'bg-[#1CB0F6]/10' },
    { label: t('dashboard.openRate'), value: `${stats.openRate}%`, icon: Eye, color: 'text-[#58CC02]', bg: 'bg-[#58CC02]/10' },
    { label: t('dashboard.activeCampaigns'), value: stats.active, icon: Megaphone, color: 'text-[#CE82FF]', bg: 'bg-[#CE82FF]/10' },
    { label: t('dashboard.scheduled'), value: stats.scheduled, icon: Clock, color: 'text-[#FFC800]', bg: 'bg-[#FFC800]/10' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t('dashboard.overview')}</h2>
          <p className="text-sm text-slate-500">{t('dashboard.overviewSubtitle')}</p>
        </div>
        <Button variant="primary" size="sm" onClick={onCompose}>
          <Plus className="w-4 h-4" />
          {t('dashboard.compose')}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, type: 'spring', stiffness: 300, damping: 24 }}
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md p-5 flex items-start gap-4 transition-shadow cursor-default"
          >
            <div className={`${card.bg} rounded-xl p-2.5 shrink-0`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{card.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-0.5">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
