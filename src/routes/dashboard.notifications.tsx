import { createFileRoute } from '@tanstack/react-router';
import { useAppStore } from '@/store/appStore';
import { Bell, Check } from 'lucide-react';

export const Route = createFileRoute('/dashboard/notifications')({
  component: NotificationsPage,
});

function NotificationsPage() {
  const { notifications, markNotificationRead } = useAppStore();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="space-y-2">
        {notifications.length === 0 && <p className="text-center text-muted-foreground py-10">No notifications</p>}
        {notifications.map(n => (
          <div key={n.id} className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${n.read ? 'bg-card border-border' : 'bg-primary/5 border-primary/20'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.read ? 'bg-secondary' : 'gradient-green'}`}>
              <Bell className={`w-4 h-4 ${n.read ? 'text-muted-foreground' : 'text-primary-foreground'}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm ${n.read ? 'text-muted-foreground' : 'font-medium'}`}>{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
            {!n.read && (
              <button onClick={() => markNotificationRead(n.id)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
