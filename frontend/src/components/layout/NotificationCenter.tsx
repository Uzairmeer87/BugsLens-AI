import React, { useEffect, useState } from 'react';
import { useUIStore } from '../../store/useUIStore.js';
import { notificationsApi } from '../../services/api.js';
import { NotificationItem } from '../../types/index.js';
import { CheckCircle2, AlertTriangle, Sparkles, Bell, X, Check } from 'lucide-react';
import { formatTimeAgo } from '../../lib/utils.js';

export const NotificationCenter: React.FC = () => {
  const { isNotificationsOpen, setNotificationsOpen } = useUIStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsApi.list();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // Fallback
      setNotifications([
        {
          _id: '1',
          userId: 'u1',
          title: 'Critical Bug Detected in Payment Gateway',
          message: 'Idempotency race condition identified in payment.service.ts (Line 84).',
          type: 'error',
          icon: 'AlertTriangle',
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          _id: '2',
          userId: 'u1',
          title: 'Automated Test Lab Run Completed',
          message: '1,248 tests executed across 6 suites with 87.4% test coverage.',
          type: 'success',
          icon: 'CheckCircle2',
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ]);
      setUnreadCount(2);
    }
  };

  useEffect(() => {
    if (isNotificationsOpen) {
      fetchNotifications();
    }
  }, [isNotificationsOpen]);

  if (!isNotificationsOpen) return null;

  const markAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-primary-light" />;
    }
  };

  return (
    <div className="fixed top-16 right-6 z-40 w-80 md:w-96 glass-panel border border-white/10 shadow-2xl p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-border-glass">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold text-text-primary">Notifications</h4>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-[11px] text-text-muted hover:text-primary transition-colors px-2 py-1 rounded"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={() => setNotificationsOpen(false)}
            className="text-text-muted hover:text-text-primary p-1 rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto space-y-2 mt-3 pr-1">
        {notifications.length === 0 ? (
          <p className="text-xs text-text-muted text-center py-6">No notifications yet.</p>
        ) : (
          notifications.map((item) => (
            <div
              key={item._id}
              className={`p-3 rounded-xl border transition-all ${
                item.read
                  ? 'bg-white/[0.01] border-transparent'
                  : 'bg-white/[0.04] border-border-glass shadow-sm'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-lg bg-white/5 mt-0.5">{getIcon(item.type)}</div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-semibold text-text-primary truncate">{item.title}</p>
                  <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-2">{item.message}</p>
                  <span className="text-[10px] text-text-muted mt-1 block">
                    {formatTimeAgo(item.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
