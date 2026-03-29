import React from 'react';
import { Users, Layers, Calendar, AlertCircle, Pencil } from 'lucide-react';
import type { ComposeFormState } from '@/types/notification';
import { PRIORITY_CONFIG, CHANNEL_LABELS } from '@/types/notification';

interface Props {
  form: ComposeFormState;
  onGoToStep: (step: number) => void;
}

export const ReviewSection: React.FC<Props> = ({ form, onGoToStep }) => {
  const priorityCfg = PRIORITY_CONFIG[form.priority];

  const warnings: string[] = [];
  if (!form.title.trim()) warnings.push('Notification title is required.');
  if (form.audience.roles.length === 0) warnings.push('No audience selected.');
  if (form.channels.length === 0) warnings.push('No delivery channel selected.');
  if (!form.sendNow && !form.scheduledAt) warnings.push('Scheduled delivery time is missing.');

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Review & Send</h3>
        <p className="text-sm text-slate-500 mt-1">Review all details before publishing.</p>
      </div>

      {warnings.length > 0 && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 space-y-1">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-amber-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-medium">{w}</span>
            </div>
          ))}
        </div>
      )}

      <SummaryCard title="Basic Information" step={0} onEdit={onGoToStep}>
        <SummaryRow label="Title" value={form.title || '—'} />
        <SummaryRow label="Campaign" value={form.campaignName || '—'} />
        <SummaryRow label="Priority">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${priorityCfg.color} ${priorityCfg.bgColor}`}>
            {priorityCfg.label}
          </span>
        </SummaryRow>
        {form.expiresAt && (
          <SummaryRow label="Expires" value={new Date(form.expiresAt).toLocaleString()} />
        )}
      </SummaryCard>

      <SummaryCard title="Audience" step={1} onEdit={onGoToStep} icon={Users}>
        <SummaryRow label="Roles" value={form.audience.roles.length > 0 ? form.audience.roles.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ') : '—'} />
        {form.audience.grades.length > 0 && (
          <SummaryRow label="Grades" value={`Grade ${form.audience.grades.join(', ')}`} />
        )}
        {form.audience.classes.length > 0 && (
          <SummaryRow label="Sections" value={`Section ${form.audience.classes.join(', ')}`} />
        )}
        <SummaryRow label="Estimated">
          <span className="font-bold text-indigo-600">~{form.audience.estimatedCount.toLocaleString()} recipients</span>
        </SummaryRow>
      </SummaryCard>

      <SummaryCard title="Delivery Channels" step={2} onEdit={onGoToStep} icon={Layers}>
        {form.channels.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {form.channels.map(ch => (
              <span key={ch} className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                {CHANNEL_LABELS[ch].label}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No channels selected</p>
        )}
      </SummaryCard>

      <SummaryCard title="Schedule" step={3} onEdit={onGoToStep} icon={Calendar}>
        <SummaryRow
          label="Delivery"
          value={form.sendNow ? 'Immediately on publish' : `Scheduled: ${form.scheduledAt ? new Date(form.scheduledAt).toLocaleString() : 'Not set'}`}
        />
      </SummaryCard>

      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
        <p className="text-sm text-slate-500">
          {form.sendNow
            ? 'Click "Send Now" to deliver immediately, or "Save Draft" to send later.'
            : 'Click "Schedule" to queue for delivery, or "Save Draft" to edit later.'}
        </p>
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{
  title: string;
  step: number;
  onEdit: (step: number) => void;
  icon?: React.FC<{ className?: string }>;
  children: React.ReactNode;
}> = ({ title, step, onEdit, children }) => (
  <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50 bg-slate-50/50">
      <h4 className="text-sm font-bold text-slate-700">{title}</h4>
      <button
        onClick={() => onEdit(step)}
        className="flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors"
      >
        <Pencil className="w-3 h-3" />
        Edit
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
    {children || <span className="text-sm font-medium text-slate-700 text-right">{value}</span>}
  </div>
);
