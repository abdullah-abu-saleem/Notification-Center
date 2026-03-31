export const inputClass =
  'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400';

export const inputSmClass =
  'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400';

export const inputErrorClass =
  'w-full bg-red-50/30 border border-red-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all placeholder:text-slate-400';

export const inputSmErrorClass =
  'w-full bg-red-50/30 border border-red-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all placeholder:text-slate-400';

export const inputSuccessClass =
  'w-full bg-emerald-50/20 border border-emerald-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400';

export const inputSmSuccessClass =
  'w-full bg-emerald-50/20 border border-emerald-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400';

export const labelClass = 'block text-sm font-bold text-slate-700 mb-1.5';

export const labelSmClass = 'block text-xs font-bold text-slate-500 mb-1';

export const counterClass = 'text-xs font-medium text-slate-400 mt-1 text-right tabular-nums';
export const counterWarningClass = 'text-xs font-medium text-amber-500 mt-1 text-right tabular-nums';
export const counterDangerClass = 'text-xs font-medium text-red-500 mt-1 text-right tabular-nums';

export const errorMessageClass = 'text-xs font-medium text-red-500 mt-1 flex items-center gap-1';

export const sectionHeadingClass = 'text-lg font-bold text-slate-800';
export const sectionDescriptionClass = 'text-sm text-slate-500 mt-1';
export const helperTextClass = 'text-xs text-slate-400 mt-1';

export function getCounterClass(current: number, max: number): string {
  const pct = max > 0 ? current / max : 0;
  if (pct > 0.95) return counterDangerClass;
  if (pct > 0.80) return counterWarningClass;
  return counterClass;
}
