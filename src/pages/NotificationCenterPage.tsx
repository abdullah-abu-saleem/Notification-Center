import React, { useState, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Notification, ComposeFormState } from '@/types/notification';
import { INITIAL_COMPOSE_STATE } from '@/types/notification';
import { loadNotifications, addNotification, deleteNotification, generateId, clearDraft } from '@/lib/storage';
import { NotificationHeader } from '@/components/dashboard/NotificationHeader';
import { NotificationTable } from '@/components/dashboard/NotificationTable';
import { ComposeDrawer } from '@/components/compose/ComposeDrawer';
import { NotificationDetailModal } from '@/components/detail/NotificationDetailModal';

const NotificationCenterPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(() => loadNotifications());
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [editDraft, setEditDraft] = useState<ComposeFormState | null>(null);

  const handleCompose = useCallback(() => {
    setEditDraft(null);
    setIsComposeOpen(true);
  }, []);

  const handlePublish = useCallback((form: ComposeFormState) => {
    const now = new Date().toISOString();
    const notification: Notification = {
      id: generateId(),
      title: form.title,
      campaignName: form.campaignName,
      description: form.description,
      priority: form.priority,
      status: form.sendNow ? 'sent' : 'scheduled',
      audience: form.audience,
      channels: form.channels,
      emailConfig: form.channels.includes('email') ? form.emailConfig : undefined,
      appNotifConfig: form.channels.includes('app-notification') ? form.appNotifConfig : undefined,
      popUpConfig: form.channels.includes('pop-up') ? form.popUpConfig : undefined,
      bannerConfig: form.channels.includes('sticky-banner') ? form.bannerConfig : undefined,
      sendNow: form.sendNow,
      scheduledAt: form.sendNow ? null : form.scheduledAt || null,
      sentAt: form.sendNow ? now : null,
      expiresAt: form.expiresAt || null,
      createdAt: now,
      stats: form.sendNow
        ? {
            delivered: Math.floor(form.audience.estimatedCount * (0.88 + Math.random() * 0.1)),
            opened: Math.floor(form.audience.estimatedCount * (0.35 + Math.random() * 0.4)),
            clicked: Math.floor(form.audience.estimatedCount * (0.1 + Math.random() * 0.2)),
            dismissed: Math.floor(form.audience.estimatedCount * (0.02 + Math.random() * 0.08)),
          }
        : { delivered: 0, opened: 0, clicked: 0, dismissed: 0 },
    };
    const updated = addNotification(notification);
    setNotifications(updated);
    setIsComposeOpen(false);
    clearDraft();
  }, []);

  const handleSaveDraft = useCallback((form: ComposeFormState) => {
    const now = new Date().toISOString();
    const notification: Notification = {
      id: generateId(),
      title: form.title || 'Untitled Draft',
      campaignName: form.campaignName,
      description: form.description,
      priority: form.priority,
      status: 'draft',
      audience: form.audience,
      channels: form.channels,
      emailConfig: form.channels.includes('email') ? form.emailConfig : undefined,
      appNotifConfig: form.channels.includes('app-notification') ? form.appNotifConfig : undefined,
      popUpConfig: form.channels.includes('pop-up') ? form.popUpConfig : undefined,
      bannerConfig: form.channels.includes('sticky-banner') ? form.bannerConfig : undefined,
      sendNow: form.sendNow,
      scheduledAt: form.sendNow ? null : form.scheduledAt || null,
      sentAt: null,
      expiresAt: form.expiresAt || null,
      createdAt: now,
      stats: { delivered: 0, opened: 0, clicked: 0, dismissed: 0 },
    };
    const updated = addNotification(notification);
    setNotifications(updated);
    setIsComposeOpen(false);
    clearDraft();
  }, []);

  const handleDelete = useCallback((id: string) => {
    const updated = deleteNotification(id);
    setNotifications(updated);
  }, []);

  const handleEdit = useCallback((notif: Notification) => {
    const form: ComposeFormState = {
      step: 0,
      title: notif.title,
      campaignName: notif.campaignName,
      description: notif.description,
      priority: notif.priority,
      expiresAt: notif.expiresAt || '',
      audience: notif.audience,
      channels: notif.channels,
      emailConfig: notif.emailConfig || INITIAL_COMPOSE_STATE.emailConfig,
      appNotifConfig: notif.appNotifConfig || INITIAL_COMPOSE_STATE.appNotifConfig,
      popUpConfig: notif.popUpConfig || INITIAL_COMPOSE_STATE.popUpConfig,
      bannerConfig: notif.bannerConfig || INITIAL_COMPOSE_STATE.bannerConfig,
      sendNow: true,
      scheduledAt: notif.scheduledAt || '',
    };
    handleDelete(notif.id);
    setEditDraft(form);
    setIsComposeOpen(true);
  }, [handleDelete]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -15 }}
            animate={{ rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Bell className="w-6 h-6 text-amber-400" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Notification Center</h1>
            <p className="text-xs text-slate-400">Centralized school communication hub</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
        <NotificationHeader notifications={notifications} onCompose={handleCompose} />
        <NotificationTable
          notifications={notifications}
          onView={setSelectedNotification}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {isComposeOpen && (
        <ComposeDrawer
          initialState={editDraft}
          onClose={() => setIsComposeOpen(false)}
          onPublish={handlePublish}
          onSaveDraft={handleSaveDraft}
        />
      )}

      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
};

export default NotificationCenterPage;
