import React from 'react';
import { Mail, Bell, MessageSquare, Flag, Check } from 'lucide-react';
import type { ComposeFormState, ComposeAction, DeliveryChannel } from '@/types/notification';
import { CHANNEL_LABELS } from '@/types/notification';
import { inputSmClass, labelSmClass, getCounterClass, helperTextClass } from '@/theme/tokens';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  form: ComposeFormState;
  dispatch: React.Dispatch<ComposeAction>;
}

const CHANNEL_ICONS: Record<DeliveryChannel, React.FC<{ className?: string }>> = {
  'email': Mail,
  'app-notification': Bell,
  'pop-up': MessageSquare,
  'sticky-banner': Flag,
};

const CHANNEL_COLORS: Record<DeliveryChannel, { active: string; icon: string }> = {
  'email': { active: 'bg-blue-50 border-blue-300', icon: 'text-blue-500' },
  'app-notification': { active: 'bg-amber-50 border-amber-300', icon: 'text-amber-500' },
  'pop-up': { active: 'bg-purple-50 border-purple-300', icon: 'text-purple-500' },
  'sticky-banner': { active: 'bg-emerald-50 border-emerald-300', icon: 'text-emerald-500' },
};

const BANNER_COLOR_OPTIONS = [
  { value: 'duo-blue', labelKey: 'channels.colorBlue', bg: 'bg-[#1CB0F6]' },
  { value: 'duo-green', labelKey: 'channels.colorGreen', bg: 'bg-[#58CC02]' },
  { value: 'duo-gold', labelKey: 'channels.colorGold', bg: 'bg-[#FFC800]' },
  { value: 'duo-red', labelKey: 'channels.colorRed', bg: 'bg-[#FF4B4B]' },
  { value: 'duo-purple', labelKey: 'channels.colorPurple', bg: 'bg-[#CE82FF]' },
  { value: 'duo-orange', labelKey: 'channels.colorOrange', bg: 'bg-[#FF9600]' },
];

export const ChannelSection: React.FC<Props> = ({ form, dispatch }) => {
  const { t } = useLanguage();
  const channels: DeliveryChannel[] = ['email', 'app-notification', 'pop-up', 'sticky-banner'];

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800">{t('channels.heading')}</h3>
        <p className="text-sm text-slate-500 mt-1">{t('channels.subtitle')}</p>
      </div>

      <div className="space-y-3">
        {channels.map(ch => {
          const enabled = form.channels.includes(ch);
          const Icon = CHANNEL_ICONS[ch];
          const meta = CHANNEL_LABELS[ch];
          const colors = CHANNEL_COLORS[ch];

          return (
            <div key={ch} className="rounded-xl border-2 border-slate-100 overflow-hidden transition-all">
              <button
                onClick={() => dispatch({ type: 'TOGGLE_CHANNEL', channel: ch })}
                className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all ${
                  enabled ? `${colors.active}` : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`rounded-lg p-2 ${enabled ? colors.active : 'bg-slate-100'}`}>
                  <Icon className={`w-4.5 h-4.5 ${enabled ? colors.icon : 'text-slate-400'}`} />
                </div>
                <div className="flex-1 text-start">
                  <p className={`text-sm font-bold ${enabled ? 'text-slate-800' : 'text-slate-600'}`}>{t(meta.labelKey)}</p>
                  <p className="text-xs text-slate-400">{t(meta.descKey)}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  enabled ? 'bg-slate-800 border-slate-800' : 'border-slate-300'
                }`}>
                  {enabled && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>

              {enabled && (
                <div className="px-4 py-4 bg-white border-t border-slate-100 space-y-3">
                  {ch === 'email' && <EmailFields form={form} dispatch={dispatch} />}
                  {ch === 'app-notification' && <AppNotifFields form={form} dispatch={dispatch} />}
                  {ch === 'pop-up' && <PopUpFields form={form} dispatch={dispatch} />}
                  {ch === 'sticky-banner' && <BannerFields form={form} dispatch={dispatch} />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {form.channels.length === 0 && (
        <p className="text-sm text-amber-600 bg-amber-50 rounded-xl px-4 py-3 border border-amber-100 font-medium">
          {t('channels.noChannelWarning')}
        </p>
      )}
    </div>
  );
};

const EmailFields: React.FC<Props> = ({ form, dispatch }) => {
  const { t } = useLanguage();
  return (
  <>
    <div>
      <label className={labelSmClass}>{t('channels.emailSubject')}</label>
      <input
        type="text"
        value={form.emailConfig.subject}
        onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { subject: e.target.value } })}
        placeholder={t('channels.emailSubjectPlaceholder')}
        maxLength={150}
        className={inputSmClass}
      />
      <p className={getCounterClass(form.emailConfig.subject.length, 150)}>
        {form.emailConfig.subject.length}/150
      </p>
    </div>
    <div>
      <label className={labelSmClass}>{t('channels.emailBody')}</label>
      <textarea
        value={form.emailConfig.body}
        onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { body: e.target.value } })}
        placeholder={t('channels.emailBodyPlaceholder')}
        rows={4}
        maxLength={2000}
        className={`${inputSmClass} resize-none`}
      />
      <p className={getCounterClass(form.emailConfig.body.length, 2000)}>
        {form.emailConfig.body.length}/2000
      </p>
    </div>
    <ImageUpload
      value={form.emailConfig.imageUrl}
      onChange={(v) => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { imageUrl: v } })}
      label="Banner Image (optional)"
      aspectHint="Landscape 16:9 recommended"
    />
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={labelSmClass}>{t('channels.ctaButtonLabel')}</label>
        <input
          type="text"
          value={form.emailConfig.ctaLabel}
          onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { ctaLabel: e.target.value } })}
          placeholder={t('channels.ctaButtonPlaceholder')}
          maxLength={40}
          className={inputSmClass}
        />
      </div>
      <div>
        <label className={labelSmClass}>{t('channels.ctaUrl')}</label>
        <input
          type="text"
          value={form.emailConfig.ctaUrl}
          onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { ctaUrl: e.target.value } })}
          placeholder={t('channels.ctaUrlPlaceholder')}
          className={inputSmClass}
        />
      </div>
    </div>
    <p className={`${helperTextClass} italic`}>{t('channels.emailBranding')}</p>
  </>
  );
};

const AppNotifFields: React.FC<Props> = ({ form, dispatch }) => {
  const { t } = useLanguage();
  return (
  <>
    <div>
      <label className={labelSmClass}>{t('channels.notifTitle')}</label>
      <input
        type="text"
        value={form.appNotifConfig.title}
        onChange={e => dispatch({ type: 'UPDATE_APP_NOTIF_CONFIG', payload: { title: e.target.value } })}
        placeholder={t('channels.notifTitlePlaceholder')}
        maxLength={60}
        className={inputSmClass}
      />
      <p className={getCounterClass(form.appNotifConfig.title.length, 60)}>
        {form.appNotifConfig.title.length}/60
      </p>
    </div>
    <div>
      <label className={labelSmClass}>{t('channels.shortMessage')}</label>
      <input
        type="text"
        value={form.appNotifConfig.message}
        onChange={e => dispatch({ type: 'UPDATE_APP_NOTIF_CONFIG', payload: { message: e.target.value } })}
        placeholder={t('channels.shortMessagePlaceholder')}
        maxLength={120}
        className={inputSmClass}
      />
      <p className={getCounterClass(form.appNotifConfig.message.length, 120)}>
        {t('channels.characters').replace('{count}', String(form.appNotifConfig.message.length))}
      </p>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={labelSmClass}>{t('channels.actionLabel')}</label>
        <input
          type="text"
          value={form.appNotifConfig.actionLabel}
          onChange={e => dispatch({ type: 'UPDATE_APP_NOTIF_CONFIG', payload: { actionLabel: e.target.value } })}
          placeholder={t('channels.actionLabelPlaceholder')}
          maxLength={30}
          className={inputSmClass}
        />
      </div>
      <div>
        <label className={labelSmClass}>{t('channels.actionUrl')}</label>
        <input
          type="text"
          value={form.appNotifConfig.actionUrl}
          onChange={e => dispatch({ type: 'UPDATE_APP_NOTIF_CONFIG', payload: { actionUrl: e.target.value } })}
          placeholder={t('channels.actionUrlPlaceholder')}
          className={inputSmClass}
        />
      </div>
    </div>
  </>
  );
};

const PopUpFields: React.FC<Props> = ({ form, dispatch }) => {
  const { t } = useLanguage();
  return (
  <>
    <div>
      <label className={labelSmClass}>{t('channels.popUpTitle')}</label>
      <input
        type="text"
        value={form.popUpConfig.title}
        onChange={e => dispatch({ type: 'UPDATE_POPUP_CONFIG', payload: { title: e.target.value } })}
        placeholder={t('channels.popUpTitlePlaceholder')}
        maxLength={80}
        className={inputSmClass}
      />
      <p className={getCounterClass(form.popUpConfig.title.length, 80)}>
        {form.popUpConfig.title.length}/80
      </p>
    </div>
    <div>
      <label className={labelSmClass}>{t('channels.bodyText')}</label>
      <textarea
        value={form.popUpConfig.body}
        onChange={e => dispatch({ type: 'UPDATE_POPUP_CONFIG', payload: { body: e.target.value } })}
        placeholder={t('channels.bodyTextPlaceholder')}
        rows={3}
        maxLength={500}
        className={`${inputSmClass} resize-none`}
      />
      <p className={getCounterClass(form.popUpConfig.body.length, 500)}>
        {form.popUpConfig.body.length}/500
      </p>
    </div>
    <ImageUpload
      value={form.popUpConfig.imageUrl}
      onChange={(v) => dispatch({ type: 'UPDATE_POPUP_CONFIG', payload: { imageUrl: v } })}
      label="Illustration Image (optional)"
      aspectHint="Square or 4:3 recommended"
    />
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={labelSmClass}>{t('channels.primaryButtonLabel')}</label>
        <input
          type="text"
          value={form.popUpConfig.primaryLabel}
          onChange={e => dispatch({ type: 'UPDATE_POPUP_CONFIG', payload: { primaryLabel: e.target.value } })}
          placeholder={t('channels.primaryButtonPlaceholder')}
          maxLength={40}
          className={inputSmClass}
        />
      </div>
      <div>
        <label className={labelSmClass}>{t('channels.primaryButtonUrl')}</label>
        <input
          type="text"
          value={form.popUpConfig.primaryUrl}
          onChange={e => dispatch({ type: 'UPDATE_POPUP_CONFIG', payload: { primaryUrl: e.target.value } })}
          placeholder={t('channels.ctaUrlPlaceholder')}
          className={inputSmClass}
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={labelSmClass}>{t('channels.dismissButtonLabel')}</label>
        <input
          type="text"
          value={form.popUpConfig.dismissLabel}
          onChange={e => dispatch({ type: 'UPDATE_POPUP_CONFIG', payload: { dismissLabel: e.target.value } })}
          placeholder={t('channels.dismissButtonPlaceholder')}
          maxLength={30}
          className={inputSmClass}
        />
      </div>
      <div>
        <label className={labelSmClass}>{t('channels.priorityQueueOrder')}</label>
        <select
          value={form.popUpConfig.priority}
          onChange={e => dispatch({ type: 'UPDATE_POPUP_CONFIG', payload: { priority: Number(e.target.value) } })}
          className={inputSmClass}
        >
          <option value={1}>{t('channels.priorityNormal')}</option>
          <option value={2}>{t('channels.priorityHigh')}</option>
          <option value={3}>{t('channels.priorityCritical')}</option>
        </select>
      </div>
    </div>
    <p className={`${helperTextClass} italic`}>{t('channels.popUpNote')}</p>
  </>
  );
};

const BannerFields: React.FC<Props> = ({ form, dispatch }) => {
  const { t } = useLanguage();
  return (
  <>
    <div>
      <label className={labelSmClass}>{t('channels.bannerMessage')}</label>
      <input
        type="text"
        value={form.bannerConfig.message}
        onChange={e => dispatch({ type: 'UPDATE_BANNER_CONFIG', payload: { message: e.target.value } })}
        placeholder={t('channels.bannerMessagePlaceholder')}
        maxLength={100}
        className={inputSmClass}
      />
      <p className={getCounterClass(form.bannerConfig.message.length, 100)}>
        {t('channels.bannerCharacters').replace('{count}', String(form.bannerConfig.message.length))}
      </p>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={labelSmClass}>{t('channels.ctaLabelOptional')}</label>
        <input
          type="text"
          value={form.bannerConfig.ctaLabel}
          onChange={e => dispatch({ type: 'UPDATE_BANNER_CONFIG', payload: { ctaLabel: e.target.value } })}
          placeholder={t('channels.primaryButtonPlaceholder')}
          maxLength={30}
          className={inputSmClass}
        />
      </div>
      <div>
        <label className={labelSmClass}>{t('channels.ctaUrl')}</label>
        <input
          type="text"
          value={form.bannerConfig.ctaUrl}
          onChange={e => dispatch({ type: 'UPDATE_BANNER_CONFIG', payload: { ctaUrl: e.target.value } })}
          placeholder={t('channels.actionUrlPlaceholder')}
          className={inputSmClass}
        />
      </div>
    </div>
    <div>
      <label className={labelSmClass}>{t('channels.bannerColor')}</label>
      <div className="flex gap-2">
        {BANNER_COLOR_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => dispatch({ type: 'UPDATE_BANNER_CONFIG', payload: { colorTheme: opt.value } })}
            className={`w-8 h-8 rounded-lg ${opt.bg} transition-all relative ${
              form.bannerConfig.colorTheme === opt.value
                ? 'ring-2 ring-offset-2 ring-slate-800 scale-110'
                : 'hover:scale-105'
            }`}
            title={t(opt.labelKey)}
          >
            {form.bannerConfig.colorTheme === opt.value && (
              <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto drop-shadow-sm" />
            )}
          </button>
        ))}
      </div>
    </div>
    <div className="flex items-center gap-3">
      <button
        onClick={() => dispatch({ type: 'UPDATE_BANNER_CONFIG', payload: { dismissible: !form.bannerConfig.dismissible } })}
        className={`w-10 h-6 rounded-full transition-all relative ${
          form.bannerConfig.dismissible ? 'bg-slate-800' : 'bg-slate-200'
        }`}
      >
        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
          form.bannerConfig.dismissible ? 'left-5 rtl:right-5 rtl:left-auto' : 'left-1 rtl:right-1 rtl:left-auto'
        }`} />
      </button>
      <span className="text-sm font-medium text-slate-600">{t('channels.dismissToggle')}</span>
    </div>
    <p className={`${helperTextClass} italic`}>{t('channels.bannerNote')}</p>
  </>
  );
};
