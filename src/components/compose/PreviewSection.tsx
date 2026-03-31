import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ComposeFormState, DeliveryChannel } from '@/types/notification';
import { CHANNEL_LABELS } from '@/types/notification';
import { useLanguage } from '@/i18n/LanguageContext';
import { EmailPreview } from '@/components/previews/EmailPreview';
import { AppNotificationPreview } from '@/components/previews/AppNotificationPreview';
import { PopUpPreview } from '@/components/previews/PopUpPreview';
import { StickyBannerPreview } from '@/components/previews/StickyBannerPreview';

interface Props {
  form: ComposeFormState;
}

export const PreviewSection: React.FC<Props> = ({ form }) => {
  const { t } = useLanguage();
  const [activeChannel, setActiveChannel] = useState<DeliveryChannel | null>(
    form.channels[0] || null
  );

  if (form.channels.length === 0) {
    return (
      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{t('preview.heading')}</h3>
          <p className="text-sm text-slate-500 mt-1">{t('preview.noChannels')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800">{t('preview.heading')}</h3>
        <p className="text-sm text-slate-500 mt-1">{t('preview.subtitle')}</p>
      </div>

      <div className="flex gap-2 flex-wrap relative">
        {form.channels.map(ch => (
          <button
            key={ch}
            onClick={() => setActiveChannel(ch)}
            className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeChannel === ch
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {t(CHANNEL_LABELS[ch].labelKey)}
          </button>
        ))}
      </div>

      <div className="bg-slate-100 rounded-2xl p-4 md:p-6 min-h-[300px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChannel}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeChannel === 'email' && <EmailPreview config={form.emailConfig} title={form.title} />}
            {activeChannel === 'app-notification' && <AppNotificationPreview config={form.appNotifConfig} />}
            {activeChannel === 'pop-up' && <PopUpPreview config={form.popUpConfig} />}
            {activeChannel === 'sticky-banner' && <StickyBannerPreview config={form.bannerConfig} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="text-xs text-slate-400 text-center italic">
        {t('preview.disclaimer')}
      </p>
    </div>
  );
};
