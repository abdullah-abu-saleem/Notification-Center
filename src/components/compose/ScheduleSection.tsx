import React from 'react';
import { Zap, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ComposeFormState, ComposeAction } from '@/types/notification';
import { inputClass } from '@/theme/tokens';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  form: ComposeFormState;
  dispatch: React.Dispatch<ComposeAction>;
}

export const ScheduleSection: React.FC<Props> = ({ form, dispatch }) => {
  const { t } = useLanguage();
  const setSendNow = (sendNow: boolean) => {
    dispatch({ type: 'SET_SCHEDULE', sendNow, scheduledAt: sendNow ? '' : form.scheduledAt });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800">{t('schedule.heading')}</h3>
        <p className="text-sm text-slate-500 mt-1">{t('schedule.subtitle')}</p>
      </div>

      <div className="space-y-3">
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setSendNow(true)}
          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-start ${
            form.sendNow
              ? 'bg-emerald-50 border-emerald-300 shadow-sm shadow-emerald-100'
              : 'bg-white border-slate-100 hover:border-slate-200'
          }`}
        >
          <div className={`rounded-xl p-3 ${form.sendNow ? 'bg-emerald-100' : 'bg-slate-100'}`}>
            <Zap className={`w-5 h-5 ${form.sendNow ? 'text-emerald-600' : 'text-slate-400'}`} />
          </div>
          <div className="flex-1">
            <p className={`text-sm font-bold ${form.sendNow ? 'text-slate-800' : 'text-slate-600'}`}>{t('schedule.sendNowTitle')}</p>
            <p className="text-xs text-slate-400 mt-0.5">{t('schedule.sendNowDesc')}</p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            form.sendNow ? 'border-emerald-500' : 'border-slate-300'
          }`}>
            {form.sendNow && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
          </div>
        </motion.button>

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setSendNow(false)}
          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-start ${
            !form.sendNow
              ? 'bg-blue-50 border-blue-300 shadow-sm shadow-blue-100'
              : 'bg-white border-slate-100 hover:border-slate-200'
          }`}
        >
          <div className={`rounded-xl p-3 ${!form.sendNow ? 'bg-blue-100' : 'bg-slate-100'}`}>
            <Clock className={`w-5 h-5 ${!form.sendNow ? 'text-blue-600' : 'text-slate-400'}`} />
          </div>
          <div className="flex-1">
            <p className={`text-sm font-bold ${!form.sendNow ? 'text-slate-800' : 'text-slate-600'}`}>{t('schedule.laterTitle')}</p>
            <p className="text-xs text-slate-400 mt-0.5">{t('schedule.laterDesc')}</p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            !form.sendNow ? 'border-blue-500' : 'border-slate-300'
          }`}>
            {!form.sendNow && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
          </div>
        </motion.button>
      </div>

      {!form.sendNow && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <label className="text-sm font-bold text-slate-700">{t('schedule.dateTimeLabel')}</label>
          </div>
          <input
            type="datetime-local"
            value={form.scheduledAt}
            onChange={e => dispatch({ type: 'SET_SCHEDULE', sendNow: false, scheduledAt: e.target.value })}
            className={inputClass}
            min={new Date().toISOString().slice(0, 16)}
          />
          <p className="text-xs text-slate-400">
            {t('schedule.timezoneNote')}
          </p>
        </motion.div>
      )}

      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <p className="text-xs text-slate-500">
          <span className="font-bold">{t('schedule.tip')}</span> {t('schedule.tipText')}
        </p>
      </div>
    </div>
  );
};
