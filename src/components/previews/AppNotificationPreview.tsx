import React from 'react';
import { Bell } from 'lucide-react';
import type { AppNotifConfig } from '@/types/notification';

interface Props {
  config: AppNotifConfig;
}

export const AppNotificationPreview: React.FC<Props> = ({ config }) => {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-bold text-slate-700">Notifications</span>
          </div>
          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">1</span>
        </div>

        <div className="px-4 py-3 bg-blue-50/50 border-l-[3px] border-[#1CB0F6]">
          <div className="flex items-start gap-3">
            <div className="bg-[#1CB0F6]/10 rounded-lg p-1.5 shrink-0 mt-0.5">
              <Bell className="w-3.5 h-3.5 text-[#1CB0F6]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">
                {config.title || 'Notification Title'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                {config.message || 'Short notification message will appear here...'}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-slate-400">Just now</span>
                {config.actionLabel && (
                  <span className="text-[10px] font-bold text-[#1CB0F6]">
                    {config.actionLabel} →
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-slate-50 opacity-50">
          <div className="flex items-start gap-3">
            <div className="bg-slate-100 rounded-lg p-1.5 shrink-0 mt-0.5">
              <Bell className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-500">Previous notification</p>
              <p className="text-[10px] text-slate-400 mt-0.5">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
