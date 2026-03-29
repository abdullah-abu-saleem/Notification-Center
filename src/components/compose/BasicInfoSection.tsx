import React from 'react';
import type { ComposeFormState, ComposeAction, NotificationPriority } from '@/types/notification';
import { PRIORITY_CONFIG } from '@/types/notification';
import { inputClass, labelClass } from '@/theme/tokens';

interface Props {
  form: ComposeFormState;
  dispatch: React.Dispatch<ComposeAction>;
}

export const BasicInfoSection: React.FC<Props> = ({ form, dispatch }) => {
  const update = (field: string, value: unknown) => dispatch({ type: 'UPDATE_FIELD', field, value });

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Basic Information</h3>
        <p className="text-sm text-slate-500 mt-1">Set up the core details for this notification.</p>
      </div>

      <div>
        <label className={labelClass}>Notification Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={e => update('title', e.target.value)}
          placeholder="e.g. End of Term Exam Schedule"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Campaign Name</label>
        <input
          type="text"
          value={form.campaignName}
          onChange={e => update('campaignName', e.target.value)}
          placeholder="Internal reference (e.g. Term 2 Exams 2026)"
          className={inputClass}
        />
        <p className="text-xs text-slate-400 mt-1">For internal tracking only — not shown to recipients.</p>
      </div>

      <div>
        <label className={labelClass}>Description / Purpose</label>
        <textarea
          value={form.description}
          onChange={e => update('description', e.target.value)}
          placeholder="Brief description of why this notification is being sent..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className={labelClass}>Priority Level</label>
        <div className="grid grid-cols-4 gap-2">
          {(Object.entries(PRIORITY_CONFIG) as [NotificationPriority, typeof PRIORITY_CONFIG[NotificationPriority]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => update('priority', key)}
              className={`px-3 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                form.priority === key
                  ? `${cfg.bgColor} ${cfg.borderColor} ${cfg.color}`
                  : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Expiration Date</label>
        <input
          type="datetime-local"
          value={form.expiresAt}
          onChange={e => update('expiresAt', e.target.value)}
          className={inputClass}
        />
        <p className="text-xs text-slate-400 mt-1">After this date, the notification will be marked as expired.</p>
      </div>
    </div>
  );
};
