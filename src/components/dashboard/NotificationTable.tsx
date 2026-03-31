import React, { useState, useMemo } from 'react';
import { Search, Mail, Bell, MessageSquare, Flag, Eye, Pencil, Trash2, Copy, XCircle, Inbox, MoreHorizontal, Calendar, ChevronDown, Send, MousePointerClick } from 'lucide-react';
import type { Notification, NotificationStatus, DeliveryChannel } from '@/types/notification';
import { STATUS_CONFIG } from '@/types/notification';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  notifications: Notification[];
  onView: (n: Notification) => void;
  onEdit: (n: Notification) => void;
  onDelete: (id: string) => void;
}

type TabKey = 'all' | NotificationStatus;

// TABS moved inside component to use t()

const CHANNEL_ICONS: Record<DeliveryChannel, React.FC<{ className?: string }>> = {
  'email': Mail,
  'app-notification': Bell,
  'pop-up': MessageSquare,
  'sticky-banner': Flag,
};

// --- MODERN MOCK SUB-COMPONENTS ---
const MockDateRange = () => (
  <button className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm whitespace-nowrap">
    <Calendar className="w-4 h-4 text-slate-400" />
    <span>All Dates</span>
  </button>
);

const MockFilter = ({ label }: { label: string }) => (
  <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm whitespace-nowrap">
    <span>{label}</span>
    <ChevronDown className="w-4 h-4 text-slate-400" />
  </button>
);

const ModernProgressBar = ({ value, max }: { value: number; max: number }) => {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="w-full mt-1.5">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Responses</span>
        <span className="text-xs font-bold text-slate-700">{value} <span className="text-slate-400 font-medium">/ {max}</span></span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

// Split date and time for cleaner UI
function formatDateTimeSplit(iso: string | null, locale: string) {
  if (!iso) return { date: '—', time: '' };
  const d = new Date(iso);
  const loc = locale === 'ar' ? 'ar-SA' : 'en-US';
  return {
    date: d.toLocaleDateString(loc, { month: 'short', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString(loc, { hour: 'numeric', minute: '2-digit' })
  };
}

export const NotificationTable: React.FC<Props> = ({ notifications, onView, onEdit, onDelete }) => {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'all', label: t('table.all') },
    { key: 'sent', label: t('table.sent') },
    { key: 'scheduled', label: t('table.scheduled') },
    { key: 'draft', label: t('table.draft') },
  ];

  const filtered = useMemo(() => {
    let list = notifications;
    if (activeTab !== 'all') list = list.filter(n => n.status === activeTab);
    if (search) list = list.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [notifications, activeTab, search]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: notifications.length, sent: 0, scheduled: 0, draft: 0 };
    notifications.forEach(n => { if (counts[n.status] !== undefined) counts[n.status]++; });
    return counts;
  }, [notifications]);

  // Modern structured stats rendering
  function renderDeliveryStats(n: Notification) {
    if (n.stats.delivered === 0) return <span className="text-slate-400 text-sm">—</span>;

    if (n.channelStats?.email) {
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs">
            <Send className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">{n.channelStats.email.sent.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')}</span>
            <span className="text-slate-500">{t('table.sent')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">{n.channelStats.email.opened.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')}</span>
            <span className="text-slate-500">{t('table.opened')}</span>
          </div>
        </div>
      );
    }

    if (n.channelStats?.appNotification) {
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">{n.channelStats.appNotification.seen.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')}</span>
            <span className="text-slate-500">{t('table.opened')}</span>
          </div>
          {n.channelStats.appNotification.clicked && (
            <div className="flex items-center gap-2 text-xs">
              <MousePointerClick className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-700">{n.channelStats.appNotification.clicked.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')}</span>
              <span className="text-slate-500">{t('table.clicked')}</span>
            </div>
          )}
        </div>
      );
    }

    // Fallback: use existing stats fields (opened/clicked) from the project's type
    if (n.stats.opened > 0 || n.stats.clicked > 0) {
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs">
            <Send className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">{n.stats.delivered.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')}</span>
            <span className="text-slate-500">{t('table.recipients')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">{n.stats.opened.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')}</span>
            <span className="text-slate-500">{t('table.opened')}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-xs">
        <Send className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-700">{n.stats.delivered.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')}</span>
        <span className="text-slate-500">{t('table.recipients')}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm overflow-hidden">

      {/* --- Control Panel --- */}
      <div className="p-6 border-b border-slate-200/70">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">

          {/* iOS Style Tabs */}
          <div className="flex bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/50 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-white text-slate-900 shadow-sm shadow-slate-200/50'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${activeTab === tab.key ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/50 text-slate-400'}`}>
                  {tabCounts[tab.key]}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[280px]">
              <Search className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('table.searchPlaceholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 pl-10 pr-4 rtl:pr-10 rtl:pl-4 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-400"
              />
            </div>

            <MockDateRange />
            <MockFilter label="Channel" />
          </div>
        </div>
      </div>

      {/* --- Table Area --- */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <div className="bg-slate-50 rounded-full p-8 mb-5 border border-slate-100">
            <Inbox className="w-12 h-12 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">{t('table.noResults')}</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-sm">
            {search ? t('table.noResultsSearch') : t('table.noResultsEmpty')}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200/70">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-start">{t('table.colTitle')}</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-start">{t('table.colChannels')}</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-start">{t('table.colAudience')}</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-start">{t('table.colDate')}</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-start">{t('table.colStatus')}</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-start">{t('table.colPerformance')}</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-end">{t('table.colActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filtered.map((notif) => {
                const statusCfg = STATUS_CONFIG[notif.status];
                const dateTime = formatDateTimeSplit(notif.status === 'sent' ? notif.sentAt : notif.status === 'scheduled' ? notif.scheduledAt : notif.createdAt, locale);
                const audienceLabel = notif.audience.audienceSummary || `${notif.audience.estimatedCount.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')} ${t('table.recipients')}`;

                return (
                  <tr key={notif.id} className="hover:bg-indigo-50/30 transition-colors group border-l-2 border-l-transparent hover:border-l-indigo-400">

                    {/* Title & Campaign */}
                    <td className="px-6 py-5 max-w-[280px]">
                      <div className="block cursor-pointer" onClick={() => onView(notif)}>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{notif.title}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-200"></span>
                          <p className="text-xs font-medium text-slate-500 truncate">{notif.campaignName}</p>
                        </div>
                      </div>
                    </td>

                    {/* Channels (Modern Avatar style) */}
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        {notif.channels.length === 0 ? <span className="text-slate-300 text-sm font-medium">—</span> : null}
                        {notif.channels.map((ch, idx) => {
                          const Icon = CHANNEL_ICONS[ch];
                          return (
                            <div
                              key={ch}
                              className={`w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 ${idx !== 0 ? '-ml-2' : ''} hover:z-10 relative transition-transform hover:scale-110`}
                              title={ch}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Audience */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <p className="text-sm font-semibold text-slate-700">
                        {audienceLabel}
                      </p>
                    </td>

                    {/* Date & Time (Split on two lines) */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700">{dateTime.date}</span>
                        <span className="text-xs font-medium text-slate-400 mt-0.5">{dateTime.time}</span>
                      </div>
                    </td>

                    {/* Status (Modern Soft Pill) */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide ${statusCfg.color} ${statusCfg.bgColor}`}>
                        {t(statusCfg.labelKey)}
                      </span>
                    </td>

                    {/* Performance & Stats */}
                    <td className="px-6 py-5 min-w-[200px]">
                       {renderDeliveryStats(notif)}
                       {notif.formConfig && notif.formStats && (
                         <ModernProgressBar value={notif.formStats.totalResponses} max={notif.audience.estimatedCount} />
                       )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === notif.id ? null : notif.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors focus:ring-2 focus:ring-indigo-100 outline-none"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        {openMenu === notif.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                            <div className="absolute right-6 top-10 mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-20 min-w-[180px] text-left">
                              <button onClick={() => { onView(notif); setOpenMenu(null); }} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2.5 transition-colors">
                                <Eye className="w-4 h-4 text-slate-400" /> {t('table.viewDetails')}
                              </button>
                              {(notif.status === 'draft' || notif.status === 'scheduled') && (
                                <button onClick={() => { onEdit(notif); setOpenMenu(null); }} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2.5 transition-colors">
                                  <Pencil className="w-4 h-4 text-slate-400" /> {t('table.edit')}
                                </button>
                              )}
                              <button className="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2.5 transition-colors">
                                <Copy className="w-4 h-4 text-slate-400" /> Duplicate
                              </button>
                              {(notif.status === 'scheduled' || notif.status === 'sent') && (
                                <button className="w-full text-left px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 flex items-center gap-2.5 transition-colors mt-1">
                                  <XCircle className="w-4 h-4 text-orange-400" /> Cancel Sending
                                </button>
                              )}
                              <div className="h-px bg-slate-100 my-1.5"></div>
                              <button onClick={() => { onDelete(notif.id); setOpenMenu(null); }} className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors">
                                <Trash2 className="w-4 h-4 text-red-400" /> {t('table.delete')}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
