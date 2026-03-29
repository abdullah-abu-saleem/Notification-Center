import React from 'react';
import { Zap, Clock, Calendar } from 'lucide-react';
import type { ComposeFormState, ComposeAction } from '@/types/notification';
import { inputClass } from '@/theme/tokens';

interface Props {
  form: ComposeFormState;
  dispatch: React.Dispatch<ComposeAction>;
}

export const ScheduleSection: React.FC<Props> = ({ form, dispatch }) => {
  const setSendNow = (sendNow: boolean) => {
    dispatch({ type: 'SET_SCHEDULE', sendNow, scheduledAt: sendNow ? '' : form.scheduledAt });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Schedule Delivery</h3>
        <p className="text-sm text-slate-500 mt-1">Choose when this notification should be delivered.</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setSendNow(true)}
          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
            form.sendNow
              ? 'bg-emerald-50 border-emerald-300'
              : 'bg-white border-slate-100 hover:border-slate-200'
          }`}
        >
          <div className={`rounded-xl p-3 ${form.sendNow ? 'bg-emerald-100' : 'bg-slate-100'}`}>
            <Zap className={`w-5 h-5 ${form.sendNow ? 'text-emerald-600' : 'text-slate-400'}`} />
          </div>
          <div className="flex-1">
            <p className={`text-sm font-bold ${form.sendNow ? 'text-slate-800' : 'text-slate-600'}`}>Send Now</p>
            <p className="text-xs text-slate-400 mt-0.5">Notification will be delivered immediately upon publishing.</p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            form.sendNow ? 'border-emerald-500' : 'border-slate-300'
          }`}>
            {form.sendNow && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
          </div>
        </button>

        <button
          onClick={() => setSendNow(false)}
          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
            !form.sendNow
              ? 'bg-blue-50 border-blue-300'
              : 'bg-white border-slate-100 hover:border-slate-200'
          }`}
        >
          <div className={`rounded-xl p-3 ${!form.sendNow ? 'bg-blue-100' : 'bg-slate-100'}`}>
            <Clock className={`w-5 h-5 ${!form.sendNow ? 'text-blue-600' : 'text-slate-400'}`} />
          </div>
          <div className="flex-1">
            <p className={`text-sm font-bold ${!form.sendNow ? 'text-slate-800' : 'text-slate-600'}`}>Schedule for Later</p>
            <p className="text-xs text-slate-400 mt-0.5">Pick a date and time for delivery.</p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            !form.sendNow ? 'border-blue-500' : 'border-slate-300'
          }`}>
            {!form.sendNow && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
          </div>
        </button>
      </div>

      {!form.sendNow && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <label className="text-sm font-bold text-slate-700">Delivery Date & Time</label>
          </div>
          <input
            type="datetime-local"
            value={form.scheduledAt}
            onChange={e => dispatch({ type: 'SET_SCHEDULE', sendNow: false, scheduledAt: e.target.value })}
            className={inputClass}
            min={new Date().toISOString().slice(0, 16)}
          />
          <p className="text-xs text-slate-400">
            Times are in your local timezone. Delivery will occur at the specified time.
          </p>
        </div>
      )}

      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <p className="text-xs text-slate-500">
          <span className="font-bold">Tip:</span> You can always save as a draft and come back to schedule or send later.
        </p>
      </div>
    </div>
  );
};
