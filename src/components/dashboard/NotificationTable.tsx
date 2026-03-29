import React, { useState, useMemo } from 'react';
import { Search, Mail, Bell, MessageSquare, Flag, Eye, Pencil, Trash2, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Notification, NotificationStatus, DeliveryChannel } from '@/types/notification';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/types/notification';

interface Props {
  notifications: Notification[];
  onView: (n: Notification) => void;
  onEdit: (n: Notification) => void;
  onDelete: (id: string) => void;
}

type TabKey = 'all' | NotificationStatus;

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'sent', label: 'Sent' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'draft', label: 'Draft' },
  { key: 'expired', label: 'Expired' },
];

const CHANNEL_ICONS: Record<DeliveryChannel, React.FC<{ className?: string }>> = {
  'email': Mail,
  'app-notification': Bell,
  'pop-up': MessageSquare,
  'sticky-banner': Flag,
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const NotificationTable: React.FC<Props> = ({ notifications, onView, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = notifications;
    if (activeTab !== 'all') {
      list = list.filter(n => n.status === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.campaignName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [notifications, activeTab, search]);

  const tabCounts = useMemo(() => {
    const counts: Record<TabKey, number> = { all: notifications.length, sent: 0, scheduled: 0, draft: 0, expired: 0 };
    notifications.forEach(n => { counts[n.status]++; });
    return counts;
  }, [notifications]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 md:p-5 border-b border-slate-100 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 ${activeTab === tab.key ? 'text-slate-300' : 'text-slate-400'}`}>
                {tabCounts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-slate-50 rounded-2xl p-4 mb-4">
            <Inbox className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-sm font-bold text-slate-400">No notifications found</p>
          <p className="text-xs text-slate-400 mt-1">
            {search ? 'Try a different search term' : 'Create your first notification to get started'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Title</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Channels</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Audience</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Metrics</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.map((notif) => {
                  const statusCfg = STATUS_CONFIG[notif.status];
                  const priorityCfg = PRIORITY_CONFIG[notif.priority];

                  return (
                    <motion.tr
                      key={notif.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors cursor-pointer group"
                      onClick={() => onView(notif)}
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-bold text-slate-800 group-hover:text-slate-900">{notif.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{notif.campaignName}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1.5">
                          {notif.channels.map(ch => {
                            const Icon = CHANNEL_ICONS[ch];
                            return (
                              <div key={ch} className="bg-slate-100 rounded-lg p-1.5" title={ch}>
                                <Icon className="w-3.5 h-3.5 text-slate-500" />
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm text-slate-600">
                          <span className="font-bold">{notif.audience.estimatedCount.toLocaleString()}</span>
                          <span className="text-xs text-slate-400 ml-1">recipients</span>
                        </div>
                        <div className="flex gap-1 mt-1">
                          {notif.audience.roles.map(r => (
                            <span key={r} className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-1.5 py-0.5 rounded">
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${priorityCfg.color} ${priorityCfg.bgColor} border ${priorityCfg.borderColor}`}>
                          {priorityCfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusCfg.color} ${statusCfg.bgColor}`}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-600">
                          {notif.status === 'sent' ? formatDate(notif.sentAt) :
                           notif.status === 'scheduled' ? formatDate(notif.scheduledAt) :
                           formatDate(notif.createdAt)}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase mt-0.5">
                          {notif.status === 'sent' ? 'Sent' :
                           notif.status === 'scheduled' ? 'Scheduled' : 'Created'}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        {notif.stats.delivered > 0 ? (
                          <div className="text-xs space-y-0.5">
                            <p className="text-slate-600"><span className="font-bold text-emerald-600">{notif.stats.opened.toLocaleString()}</span> opened</p>
                            <p className="text-slate-400"><span className="font-medium">{notif.stats.clicked.toLocaleString()}</span> clicked</p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => onView(notif)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {(notif.status === 'draft' || notif.status === 'scheduled') && (
                            <button
                              onClick={() => onEdit(notif)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(notif.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
