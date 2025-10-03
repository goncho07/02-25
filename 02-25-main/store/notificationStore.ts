import { create } from 'zustand';

interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp?: Date;
    read?: boolean;
    action?: { label: string; path: string; };
}

interface NotificationState {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
    dismissNotification: (id: string) => void;
    markAsRead?: (id: string) => void;
    markAllAsRead?: () => void;
    clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    addNotification: (notification) =>
        set((state) => ({
            notifications: [
                {
                    ...notification,
                    id: Math.random().toString(36).slice(2),
                    timestamp: new Date(),
                    read: false,
                },
                ...state.notifications,
            ].slice(0, 50), // Mantener últimas 50 notificaciones
        })),
    dismissNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),
    markAsRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            ),
        })),
    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
    clearNotifications: () => set({ notifications: [] }),
}));
