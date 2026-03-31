import React from 'react';
import { Users, Layers, Calendar, AlertCircle, Pencil, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ComposeFormState } from '@/types/notification';
import { PRIORITY_CONFIG, CHANNEL_LABELS } from '@/types/notification';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  form: ComposeFormState;
  onGoToStep: (step: number) => void;
}

export const ReviewSection: React.FC<Props> = ({ form, onGoToStep }) => {
  const { t, locale } = useLanguage();
  const priorityCfg = PRIORITY_CONFIG[form.priority];
  const localeCode = locale === 'ar' ? 'ar-SA' : 'en-US';

  const warnings: string[] = [];
  if (!form.title.trim()) warnings.push(t('review.warnTitle'));
  if (form.audience.roles.length === 0) warnings.push(t('review.warnAudience'));
  if (form.channels.length === 0) warnings.push(t('review.warnChannel'));
  if (!form.sendNow && !form.scheduledAt) warnings.push(t('review.warnSchedule'));

  const sectionStatus = {
    basicInfo: !!form.title.trim(),
    audience: form.audience.roles.length > 0,
    channels: form.channels.length > 0,
    schedule: form.sendNow || !!form.scheduledAt,
  };

  const isReady = warnings.length === 0;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800">{t('review.heading')}</h3>
        <p className="text-sm text-slate-500 mt-1">{t('review.subtitle')}</p>
      </div>

      {warnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 rounded-xl p-4 border border-amber-200 space-y-1.5"
        >
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">
            {warnings.length} {warnings.length === 1 ? 'issue' : 'issues'} to resolve
          </p>
          {warnings.map((w, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-amber-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-medium">{w}</span>
            </div>
          ))}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <SummaryCard title={t('review.basicInfo')} step={0} onEdit={onGoToStep} editLabel={t('actions.edit')} complete={sectionStatus.basicInfo}>
          <SummaryRow label={t('review.labelTitle')} value={form.title || '—'} />
          <SummaryRow label={t('review.labelCampaign')} value={form.campaignName || '—'} />
          <SummaryRow label={t('review.labelPriority')}>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${priorityCfg.color} ${priorityCfg.bgColor}`}>
              {t(priorityCfg.labelKey)}
            </span>
          </SummaryRow>
          {form.expiresAt && (
            <SummaryRow label={t('review.labelExpires')} value={new Date(form.expiresAt).toLocaleString(localeCode)} />
          )}
        </SummaryCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <SummaryCard title={t('review.audienceSection')} step={1} onEdit={onGoToStep} icon={Users} editLabel={t('actions.edit')} complete={sectionStatus.audience}>
          <SummaryRow label={t('review.labelRoles')} value={form.audience.roles.length > 0 ? form.audience.roles.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ') : '—'} />
          {form.audience.grades.length > 0 && (
            <SummaryRow label={t('review.labelGrades')} value={`${t('review.gradePrefix')} ${form.audience.grades.join(', ')}`} />
          )}
          {form.audience.classes.length > 0 && (
            <SummaryRow label={t('review.labelSections')} value={`${t('review.sectionPrefix')} ${form.audience.classes.join(', ')}`} />
          )}
          <SummaryRow label={t('review.labelEstimated')}>
            <span className="font-bold text-indigo-600">{t('review.recipientsCount').replace('{count}', form.audience.estimatedCount.toLocaleString(localeCode))}</span>
          </SummaryRow>
        </SummaryCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <SummaryCard title={t('review.channelsSection')} step={2} onEdit={onGoToStep} icon={Layers} editLabel={t('actions.edit')} complete={sectionStatus.channels}>
          {form.channels.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {form.channels.map(ch => (
                <span key={ch} className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                  {t(CHANNEL_LABELS[ch].labelKey)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">{t('review.noChannels')}</p>
          )}
        </SummaryCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <SummaryCard title={t('review.scheduleSection')} step={3} onEdit={onGoToStep} icon={Calendar} editLabel={t('actions.edit')} complete={sectionStatus.schedule}>
          <SummaryRow
            label={t('review.labelDelivery')}
            value={form.sendNow ? t('review.immediateDelivery') : form.scheduledAt ? t('review.scheduledDelivery').replace('{date}', new Date(form.scheduledAt).toLocaleString(localeCode)) : t('review.notSet')}
          />
        </SummaryCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className={`rounded-xl p-4 border text-center ${
          isReady
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-slate-50 border-slate-100'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          {isReady ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <p className="text-sm font-bold text-emerald-700">
                {form.sendNow ? 'Ready to send' : 'Ready to schedule'}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-500">
              {form.sendNow
                ? t('review.sendNowHint')
                : t('review.scheduleHint')}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const SummaryCard: React.FC<{
  title: string;
  step: number;
  onEdit: (step: number) => void;
  icon?: React.FC<{ className?: string }>;
  editLabel?: string;
  complete?: boolean;
  children: React.ReactNode;
}> = ({ title, step, onEdit, editLabel, complete, children }) => (
  <div className={`bg-white rounded-xl border overflow-hidden transition-all ${
    complete ? 'border-slate-100' : 'border-amber-200'
  }`}>
    <div className={`flex items-center justify-between px-4 py-3 border-b ${
      complete ? 'border-slate-50 bg-slate-50/50' : 'border-amber-50 bg-amber-50/30'
    }`}>
      <div className="flex items-center gap-2">
        {complete ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        ) : (
          <AlertCircle className="w-4 h-4 text-amber-500" />
        )}
        <h4 className="text-sm font-bold text-slate-700">{title}</h4>
      </div>
      <button
        onClick={() => onEdit(step)}
        className="flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors"
      >
        <Pencil className="w-3 h-3" />
        {editLabel}
      </button>
    </div>
    <div className="px-4 py-3 space-y-2">
      {children}
    </div>
  </div>
);

const SummaryRow: React.FC<{
  label: string;
  value?: string;
  children?: React.ReactNode;
}> = ({ label, value, children }) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide shrink-0">{label}</span>
    {children || <span className="text-sm font-medium text-slate-700 text-end">{value}</span>}
  </div>
);
