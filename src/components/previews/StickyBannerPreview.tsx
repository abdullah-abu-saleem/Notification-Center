import React from 'react';
import { X } from 'lucide-react';
import type { BannerConfig } from '@/types/notification';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  config: BannerConfig;
}

const COLOR_MAP: Record<string, string> = {
  'duo-blue': 'bg-[#1CB0F6]',
  'duo-green': 'bg-[#58CC02]',
  'duo-gold': 'bg-[#FFC800]',
  'duo-red': 'bg-[#FF4B4B]',
  'duo-purple': 'bg-[#CE82FF]',
  'duo-orange': 'bg-[#FF9600]',
};

const TEXT_COLOR_MAP: Record<string, string> = {
  'duo-blue': 'text-white',
  'duo-green': 'text-white',
  'duo-gold': 'text-slate-900',
  'duo-red': 'text-white',
  'duo-purple': 'text-white',
  'duo-orange': 'text-white',
};

export const StickyBannerPreview: React.FC<Props> = ({ config }) => {
  const { t } = useLanguage();
  const bgClass = COLOR_MAP[config.colorTheme] || 'bg-[#1CB0F6]';
  const textClass = TEXT_COLOR_MAP[config.colorTheme] || 'text-white';

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-slate-200 rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-slate-100 px-3 py-2 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <div className="flex-1 mx-2 bg-white rounded-md px-2 py-0.5">
            <p className="text-[9px] text-slate-400 text-center">{t('bannerPreview.addressBar')}</p>
          </div>
        </div>

        <div className="bg-white px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-slate-800" />
            <span className="text-[10px] font-bold text-slate-700">{t('bannerPreview.platform')}</span>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-2 bg-slate-200 rounded" />
            <div className="w-8 h-2 bg-slate-200 rounded" />
            <div className="w-8 h-2 bg-slate-200 rounded" />
          </div>
        </div>

        <div className={`${bgClass} px-4 py-2.5 flex items-center justify-between gap-3`}>
          <p className={`text-xs font-bold ${textClass} flex-1`}>
            {config.message || t('bannerPreview.bodyPlaceholder')}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            {config.ctaLabel && (
              <span className={`text-[10px] font-bold ${textClass} bg-white/20 px-2.5 py-1 rounded-lg`}>
                {config.ctaLabel}
              </span>
            )}
            {config.dismissible && (
              <X className={`w-3.5 h-3.5 ${textClass} opacity-70`} />
            )}
          </div>
        </div>

        <div className="bg-slate-50 px-4 py-6 space-y-3">
          <div className="h-3 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
          <div className="h-16 bg-white rounded-xl border border-slate-100 mt-4" />
          <div className="h-16 bg-white rounded-xl border border-slate-100" />
        </div>
      </div>
    </div>
  );
};
