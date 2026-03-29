import React, { useState } from 'react';
import type { ComposeFormState, DeliveryChannel } from '@/types/notification';
import { CHANNEL_LABELS } from '@/types/notification';
import { EmailPreview } from '@/components/previews/EmailPreview';
import { AppNotificationPreview } from '@/components/previews/AppNotificationPreview';
import { PopUpPreview } from '@/components/previews/PopUpPreview';
import { StickyBannerPreview } from '@/components/previews/StickyBannerPreview';

interface Props {
  form: ComposeFormState;
}

export const PreviewSection: React.FC<Props> = ({ form }) => {
  const [activeChannel, setActiveChannel] = useState<DeliveryChannel | null>(
    form.channels[0] || null
  );

  if (form.channels.length === 0) {
    return (
      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Preview</h3>
          <p className="text-sm text-slate-500 mt-1">Go back to select at least one delivery channel to preview.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Preview</h3>
        <p className="text-sm text-slate-500 mt-1">See how your notification will appear to recipients.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {form.channels.map(ch => (
          <button
            key={ch}
            onClick={() => setActiveChannel(ch)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeChannel === ch
                ? 'bg-slate-800 text-white'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {CHANNEL_LABELS[ch].label}
          </button>
        ))}
      </div>

      <div className="bg-slate-100 rounded-2xl p-4 md:p-6 min-h-[300px] flex items-center justify-center">
        {activeChannel === 'email' && <EmailPreview config={form.emailConfig} title={form.title} />}
        {activeChannel === 'app-notification' && <AppNotificationPreview config={form.appNotifConfig} />}
        {activeChannel === 'pop-up' && <PopUpPreview config={form.popUpConfig} />}
        {activeChannel === 'sticky-banner' && <StickyBannerPreview config={form.bannerConfig} />}
      </div>

      <p className="text-xs text-slate-400 text-center italic">
        This is an approximate preview. Final appearance may vary slightly.
      </p>
    </div>
  );
};
