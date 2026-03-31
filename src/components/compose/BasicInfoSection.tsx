import React from 'react';
import type { ComposeFormState, ComposeAction, NotificationPriority } from '@/types/notification';
import { PRIORITY_CONFIG } from '@/types/notification';
import { useLanguage } from '@/i18n/LanguageContext';
import { inputClass, labelClass, helperTextClass, sectionHeadingClass, sectionDescriptionClass, getCounterClass } from '@/theme/tokens';

interface Props {
  form: ComposeFormState;
  dispatch: React.Dispatch<ComposeAction>;
}

const LIMITS = { title: 100, campaignName: 80, description: 500 };

export const BasicInfoSection: React.FC<Props> = ({ form, dispatch }) => {
  const { t } = useLanguage();
  const update = (field: string, value: unknown) => dispatch({ type: 'UPDATE_FIELD', field, value });

  return (
    <div className="space-y-5">
      <div>
        <h3 className={sectionHeadingClass}>{t('basicInfo.heading')}</h3>
        <p className={sectionDescriptionClass}>{t('basicInfo.subtitle')}</p>
      </div>

      <div>
        <label className={labelClass}>{t('basicInfo.titleLabel')}</label>
        <input
          type="text"
          value={form.title}
          onChange={e => update('title', e.target.value)}
          placeholder={t('basicInfo.titlePlaceholder')}
          maxLength={LIMITS.title}
          className={inputClass}
        />
        <p className={getCounterClass(form.title.length, LIMITS.title)}>
          {form.title.length}/{LIMITS.title}
        </p>
      </div>

      <div>
        <label className={labelClass}>{t('basicInfo.campaignLabel')}</label>
        <input
          type="text"
          value={form.campaignName}
          onChange={e => update('campaignName', e.target.value)}
          placeholder={t('basicInfo.campaignPlaceholder')}
          maxLength={LIMITS.campaignName}
          className={inputClass}
        />
        <div className="flex items-center justify-between">
          <p className={helperTextClass}>{t('basicInfo.campaignHelper')}</p>
          <p className={getCounterClass(form.campaignName.length, LIMITS.campaignName)}>
            {form.campaignName.length}/{LIMITS.campaignName}
          </p>
        </div>
      </div>

      <div>
        <label className={labelClass}>{t('basicInfo.descriptionLabel')}</label>
        <textarea
          value={form.description}
          onChange={e => update('description', e.target.value)}
          placeholder={t('basicInfo.descriptionPlaceholder')}
          rows={3}
          maxLength={LIMITS.description}
          className={`${inputClass} resize-none`}
        />
        <p className={getCounterClass(form.description.length, LIMITS.description)}>
          {form.description.length}/{LIMITS.description}
        </p>
      </div>

      <div>
        <label className={labelClass}>{t('basicInfo.priorityLabel')}</label>
        <div className="grid grid-cols-4 gap-2">
          {(Object.entries(PRIORITY_CONFIG) as [NotificationPriority, typeof PRIORITY_CONFIG[NotificationPriority]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => update('priority', key)}
              className={`px-3 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                form.priority === key
                  ? `${cfg.bgColor} ${cfg.borderColor} ${cfg.color} shadow-sm scale-[1.02]`
                  : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
              }`}
            >
              {t(cfg.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>{t('basicInfo.expirationLabel')}</label>
        <input
          type="datetime-local"
          value={form.expiresAt}
          onChange={e => update('expiresAt', e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
          className={inputClass}
        />
        <p className={helperTextClass}>{t('basicInfo.expirationHelper')}</p>
      </div>
    </div>
  );
};
