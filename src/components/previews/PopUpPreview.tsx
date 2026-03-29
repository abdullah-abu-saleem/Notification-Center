import React from 'react';
import { X } from 'lucide-react';
import type { PopUpConfig } from '@/types/notification';

interface Props {
  config: PopUpConfig;
}

export const PopUpPreview: React.FC<Props> = ({ config }) => {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-slate-200 rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-slate-100 px-3 py-2 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <div className="flex-1 mx-2 bg-white rounded-md px-2 py-0.5">
            <p className="text-[9px] text-slate-400 text-center">app.example.com</p>
          </div>
        </div>

        <div className="relative h-64 bg-slate-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />

          <div className="relative bg-white rounded-2xl shadow-2xl w-[85%] max-w-xs overflow-hidden">
            <button className="absolute top-3 right-3 p-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
              <X className="w-3 h-3 text-slate-400" />
            </button>

            <div className="p-5 space-y-3">
              {config.imageUrl && (
                <div className="bg-slate-100 rounded-xl h-20 flex items-center justify-center">
                  <p className="text-[10px] text-slate-400">Illustration</p>
                </div>
              )}

              <h3 className="text-sm font-bold text-slate-800 pr-6">
                {config.title || 'Pop-Up Title'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {config.body || 'Pop-up message content will appear here...'}
              </p>

              <div className="flex gap-2 pt-1">
                {config.primaryLabel && (
                  <span className="flex-1 bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl text-center">
                    {config.primaryLabel}
                  </span>
                )}
                {config.dismissLabel && (
                  <span className="flex-1 bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2 rounded-xl text-center">
                    {config.dismissLabel}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
