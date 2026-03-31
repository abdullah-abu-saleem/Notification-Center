import React, { useState } from 'react';
import type { EmailConfig } from '@/types/notification';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  config: EmailConfig;
  title: string;
}

export const EmailPreview: React.FC<Props> = ({ config, title }) => {
  const { t } = useLanguage();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400">
              <span className="font-bold">{t('emailPreview.from')}</span> {t('emailPreview.sender')}
            </p>
            <p className="text-[10px] text-slate-400">
              <span className="font-bold">{t('emailPreview.subject')}</span>{' '}
              <span className="text-slate-700 font-medium">{config.subject || t('emailPreview.noSubject')}</span>
            </p>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl px-5 py-4 mb-5 text-center">
            <p className="text-white font-bold text-sm">{t('emailPreview.schoolName')}</p>
            <p className="text-slate-300 text-[10px] mt-0.5">{t('emailPreview.notificationCenter')}</p>
          </div>

          {config.imageUrl && (
            <div className="relative rounded-xl h-32 mb-4 overflow-hidden bg-slate-100">
              <img
                src={config.imageUrl}
                alt={t('emailPreview.bannerImage')}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImgLoaded(true)}
              />
              {!imgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                </div>
              )}
            </div>
          )}

          <h2 className="text-base font-bold text-slate-800 mb-3">{title || t('emailPreview.notifTitle')}</h2>

          <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-5">
            {config.body || t('emailPreview.bodyPlaceholder')}
          </div>

          {config.ctaLabel && (
            <div className="text-center">
              <span className="inline-block bg-slate-800 text-white text-sm font-bold px-6 py-2.5 rounded-xl">
                {config.ctaLabel}
              </span>
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            {t('emailPreview.footer')}
          </p>
        </div>
      </div>
    </div>
  );
};
