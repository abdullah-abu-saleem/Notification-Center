import React, { useReducer, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Send, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { ComposeFormState } from '@/types/notification';
import { INITIAL_COMPOSE_STATE, composeReducer } from '@/types/notification';
import { saveDraft, loadDraft, clearDraft } from '@/lib/storage';
import { BasicInfoSection } from './BasicInfoSection';
import { AudienceSection } from './AudienceSection';
import { ChannelSection } from './ChannelSection';
import { ScheduleSection } from './ScheduleSection';
import { PreviewSection } from './PreviewSection';
import { ReviewSection } from './ReviewSection';

interface Props {
  initialState: ComposeFormState | null;
  onClose: () => void;
  onPublish: (form: ComposeFormState) => void;
  onSaveDraft: (form: ComposeFormState) => void;
}

const STEPS = [
  { label: 'Basic Info', shortLabel: 'Info' },
  { label: 'Audience', shortLabel: 'Audience' },
  { label: 'Channels', shortLabel: 'Channels' },
  { label: 'Schedule', shortLabel: 'Schedule' },
  { label: 'Preview', shortLabel: 'Preview' },
  { label: 'Review & Send', shortLabel: 'Review' },
];

export const ComposeDrawer: React.FC<Props> = ({ initialState, onClose, onPublish, onSaveDraft }) => {
  const [form, dispatch] = useReducer(composeReducer, null, () => {
    if (initialState) return initialState;
    try {
      const stored = loadDraft();
      if (stored) return { ...INITIAL_COMPOSE_STATE, ...JSON.parse(stored) };
    } catch {}
    return INITIAL_COMPOSE_STATE;
  });

  useEffect(() => {
    saveDraft(form);
  }, [form]);

  const step = form.step;
  const setStep = useCallback((s: number) => dispatch({ type: 'SET_STEP', step: s }), []);

  const handleNext = () => { if (step < 5) setStep(step + 1); };
  const handleBack = () => { if (step > 0) setStep(step - 1); };

  const handlePublish = () => {
    onPublish(form);
    clearDraft();
  };

  const handleDraft = () => {
    onSaveDraft(form);
    clearDraft();
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <BasicInfoSection form={form} dispatch={dispatch} />;
      case 1: return <AudienceSection form={form} dispatch={dispatch} />;
      case 2: return <ChannelSection form={form} dispatch={dispatch} />;
      case 3: return <ScheduleSection form={form} dispatch={dispatch} />;
      case 4: return <PreviewSection form={form} />;
      case 5: return <ReviewSection form={form} onGoToStep={setStep} />;
      default: return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full lg:w-[620px] bg-white shadow-2xl flex flex-col h-full"
        >
          <div className="shrink-0 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Compose Notification</h2>
              <p className="text-xs text-slate-400 mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step].label}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="shrink-0 px-6 pt-4 pb-2">
            <div className="flex gap-1.5">
              {STEPS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className="flex-1 group"
                  title={s.label}
                >
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i < step ? 'bg-[#58CC02]' :
                      i === step ? 'bg-slate-800' :
                      'bg-slate-200'
                    }`}
                  />
                  <p className={`text-[10px] font-bold mt-1 transition-colors ${
                    i === step ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {s.shortLabel}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="shrink-0 px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <div>
              {step > 0 && (
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDraft}>
                <Save className="w-4 h-4" />
                Save Draft
              </Button>

              {step < 5 ? (
                <Button variant="primary" size="sm" onClick={handleNext}>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={handlePublish}>
                  <Send className="w-4 h-4" />
                  {form.sendNow ? 'Send Now' : 'Schedule'}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
