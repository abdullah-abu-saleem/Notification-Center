import React from 'react';
import { Mail, Bell, MessageSquare, Flag, Check } from 'lucide-react';
import type { ComposeFormState, ComposeAction, DeliveryChannel } from '@/types/notification';
import { CHANNEL_LABELS } from '@/types/notification';
import { inputSmClass, labelSmClass } from '@/theme/tokens';

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
  { value: 'duo-blue', label: 'Blue', bg: 'bg-[#1CB0F6]' },
  { value: 'duo-green', label: 'Green', bg: 'bg-[#58CC02]' },
  { value: 'duo-gold', label: 'Gold', bg: 'bg-[#FFC800]' },
  { value: 'duo-red', label: 'Red', bg: 'bg-[#FF4B4B]' },
  { value: 'duo-purple', label: 'Purple', bg: 'bg-[#CE82FF]' },
  { value: 'duo-orange', label: 'Orange', bg: 'bg-[#FF9600]' },
];

export const ChannelSection: React.FC<Props> = ({ form, dispatch }) => {
  const channels: DeliveryChannel[] = ['email', 'app-notification', 'pop-up', 'sticky-banner'];

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Delivery Channels</h3>
        <p className="text-sm text-slate-500 mt-1">Select one or more channels and configure each one.</p>
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
                <div className="flex-1 text-left">
                  <p className={`text-sm font-bold ${enabled ? 'text-slate-800' : 'text-slate-600'}`}>{meta.label}</p>
                  <p className="text-xs text-slate-400">{meta.description}</p>
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
          Select at least one delivery channel to continue.
        </p>
      )}
    </div>
  );
};

const EmailFields: React.FC<Props> = ({ form, dispatch }) => (
  <>
    <div>
      <label className={labelSmClass}>Email Subject</label>
      <input
        type="text"
        value={form.emailConfig.subject}
        onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { subject: e.target.value } })}
        placeholder="e.g. Important: Schedule Update"
        className={inputSmClass}
      />
    </div>
    <div>
      <label className={labelSmClass}>Email Body</label>
      <textarea
        value={form.emailConfig.body}
        onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { body: e.target.value } })}
        placeholder="Write your email content here..."
        rows={4}
        className={`${inputSmClass} resize-none`}
      />
    </div>
    <div>
      <label className={labelSmClass}>Image / Banner URL (optional)</label>
      <input
        type="text"
        value={form.emailConfig.imageUrl}
        onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { imageUrl: e.target.value } })}
        placeholder="https://..."
        className={inputSmClass}
      />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={labelSmClass}>CTA Button Label</label>
        <input
          type="text"
          value={form.emailConfig.ctaLabel}
          onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { ctaLabel: e.target.value } })}
          placeholder="e.g. View Details"
          className={inputSmClass}
        />
      </div>
      <div>
        <label className={labelSmClass}>CTA URL</label>
        <input
          type="text"
          value={form.emailConfig.ctaUrl}
          onChange={e => dispatch({ type: 'UPDATE_EMAIL_CONFIG', payload: { ctaUrl: e.target.value } })}
          placeholder="/path or https://..."
          className={inputSmClass}
        />
      </div>
    </div>
    <p className="text-xs text-slate-400 italic">School branding and logo are applied automatically.</p>
  </>
);

const AppNotifFields: React.FC<Props> = ({ form, dispatch }) => (
  <>
    <div>
      <label className={labelSmClass}>Notification Title</label>
      <input
        type="text"
        value={form.appNotifConfig.title}
        onChange={e => dispatch({ type: 'UPDATE_APP_NOTIF_CONFIG', payload: { title: e.target.value } })}
        placeholder="Short title (max 60 chars)"
        maxLength={60}
        className={inputSmClass}
      />
    </div>
    <div>
      <label className={labelSmClass}>Short Message</label>
      <input
        type="text"
        value={form.appNotifConfig.message}
        onChange={e => dispatch({ type: 'UPDATE_APP_NOTIF_CONFIG', payload: { message: e.target.value } })}
        placeholder="Brief message — max 2 lines recommended"
        maxLength={120}
        className={inputSmClass}
      />
      <p className="text-xs text-slate-400 mt-1">{form.appNotifConfig.message.length}/120 characters</p>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={labelSmClass}>Action Label (optional)</label>
        <input
          type="text"
          value={form.appNotifConfig.actionLabel}
          onChange={e => dispatch({ type: 'UPDATE_APP_NOTIF_CONFIG', payload: { actionLabel: e.target.value } })}
          placeholder="e.g. View"
          className={inputSmClass}
        />
      </div>
      <div>
        <label className={labelSmClass}>Action URL</label>
        <input
          type="text"
          value={form.appNotifConfig.actionUrl}
          onChange={e => dispatch({ type: 'UPDATE_APP_NOTIF_CONFIG', payload: { actionUrl: e.target.value } })}
          placeholder="/path"
          className={inputSmClass}
        />
      </div>
    </div>
  </>
);

const PopUpFields: React.FC<Props> = ({ form, dispatch }) => (
  <>
    <div>
      <label className={labelSmClass}>Pop-Up Title</label>
      <input
        type="text"
        value={form.popUpConfig.title}
        onChange={e => dispatch({ type: 'UPDATE_POPUP_CONFIG', payload: { title: e.target.value } })}
        placeholder="e.g. Important Announcement"
        className={inputSmClass}
      />
    </div>
    <div>
      <label className={labelSmClass}>Body Text</label>
      <textarea
        value={form.popUpConfig.body}
        onChange={e => dispatch({ type: 'UPDATE_POPUP_CONFIG', payload: { body: e.target.value } })}
        placeholder="Pop-up message content..."
        rows={3}
        className={`${inputSmClass} resize-none`}
      />
    </div>
    <div>
      <label className={labelSmClass}>Image URL (optional)</label>
      <input
        type="text"
        value={form.popUpConfig.imageUrl}
        onChange={e => dispatch({ type: 'UPDATE_POPUP_CONFIG', payload: { imageUrl: e.target.value } })}
        placeholder="https://..."
        className={inputSmClass}
      />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={labelSmClass}>Primary Button Label</label>
        <input
          type="text"
          value={form.popUpConfig.primaryLabel}
          onChange={e => dispatch({ type: 'UPDATE_POPUP_CONFIG', payload: { primaryLabel: e.target.value } })}
          placeholder="e.g. Learn More"
          className={inputSmClass}
        />
      </div>
      <div>
        <label className={labelSmClass}>Primary Button URL</label>
        <input
          type="text"
          value={form.popUpConfig.primaryUrl}
          onChange={e => dispatch({ type: 'UPDATE_POPUP_CONFIG', payload: { primaryUrl: e.target.value } })}
          placeholder="/path or https://..."
          className={inputSmClass}
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={labelSmClass}>Dismiss Button Label</label>
        <input
          type="text"
          value={form.popUpConfig.dismissLabel}
          onChange={e => dispatch({ type: 'UPDATE_POPUP_CONFIG', payload: { dismissLabel: e.target.value } })}
          placeholder="e.g. Dismiss"
          className={inputSmClass}
        />
      </div>
      <div>
        <label className={labelSmClass}>Priority (Queue Order)</label>
        <select
          value={form.popUpConfig.priority}
          onChange={e => dispatch({ type: 'UPDATE_POPUP_CONFIG', payload: { priority: Number(e.target.value) } })}
          className={inputSmClass}
        >
          <option value={1}>1 — Normal</option>
          <option value={2}>2 — High</option>
          <option value={3}>3 — Critical</option>
        </select>
      </div>
    </div>
    <p className="text-xs text-slate-400 italic">Only one pop-up per session. Higher priority shows first; others queue for next login.</p>
  </>
);

const BannerFields: React.FC<Props> = ({ form, dispatch }) => (
  <>
    <div>
      <label className={labelSmClass}>Banner Message</label>
      <input
        type="text"
        value={form.bannerConfig.message}
        onChange={e => dispatch({ type: 'UPDATE_BANNER_CONFIG', payload: { message: e.target.value } })}
        placeholder="Short message for the banner strip"
        maxLength={100}
        className={inputSmClass}
      />
      <p className="text-xs text-slate-400 mt-1">{form.bannerConfig.message.length}/100 characters</p>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={labelSmClass}>CTA Label (optional)</label>
        <input
          type="text"
          value={form.bannerConfig.ctaLabel}
          onChange={e => dispatch({ type: 'UPDATE_BANNER_CONFIG', payload: { ctaLabel: e.target.value } })}
          placeholder="e.g. Learn More"
          className={inputSmClass}
        />
      </div>
      <div>
        <label className={labelSmClass}>CTA URL</label>
        <input
          type="text"
          value={form.bannerConfig.ctaUrl}
          onChange={e => dispatch({ type: 'UPDATE_BANNER_CONFIG', payload: { ctaUrl: e.target.value } })}
          placeholder="/path"
          className={inputSmClass}
        />
      </div>
    </div>
    <div>
      <label className={labelSmClass}>Banner Color</label>
      <div className="flex gap-2">
        {BANNER_COLOR_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => dispatch({ type: 'UPDATE_BANNER_CONFIG', payload: { colorTheme: opt.value } })}
            className={`w-8 h-8 rounded-lg ${opt.bg} transition-all ${
              form.bannerConfig.colorTheme === opt.value
                ? 'ring-2 ring-offset-2 ring-slate-800 scale-110'
                : 'hover:scale-105'
            }`}
            title={opt.label}
          />
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
          form.bannerConfig.dismissible ? 'left-5' : 'left-1'
        }`} />
      </button>
      <span className="text-sm font-medium text-slate-600">Allow users to dismiss</span>
    </div>
    <p className="text-xs text-slate-400 italic">Banner persists across pages until dismissed or expired.</p>
  </>
);
