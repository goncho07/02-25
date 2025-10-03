import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';

interface ToastProps {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

const toastTypeStyles = {
    success: {
        bg: 'bg-emerald-100 dark:bg-emerald-500/20',
        text: 'text-emerald-800 dark:text-emerald-300',
        icon: CheckCircle2,
    },
    error: {
        bg: 'bg-rose-100 dark:bg-rose-500/20',
        text: 'text-rose-800 dark:text-rose-300',
        icon: X,
    },
    warning: {
        bg: 'bg-amber-100 dark:bg-amber-500/20',
        text: 'text-amber-800 dark:text-amber-300',
        icon: AlertTriangle,
    },
    info: {
        bg: 'bg-sky-100 dark:bg-sky-500/20',
        text: 'text-sky-800 dark:text-sky-300',
        icon: Info,
    },
};

const Toast: React.FC<ToastProps & { onDismiss: () => void }> = ({ type, message, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const { bg, text, icon: Icon } = toastTypeStyles[type];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`flex items-center gap-3 w-full max-w-sm px-4 py-3 rounded-xl shadow-lg ${bg} ${text}`}
        >
            <Icon className="shrink-0" size={20} />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={onDismiss}
                className={`shrink-0 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 ${text}`}
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

const ToastProvider: React.FC<{ children?: React.ReactNode }> = () => {
    const { notifications, dismissNotification } = useNotificationStore();
    const [mounted, setMounted] = useState(false);

    // useLayoutEffect evita el parpadeo en el montaje inicial
    React.useLayoutEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleDismiss = React.useCallback((id: string) => {
        dismissNotification(id);
    }, [dismissNotification]);

    if (!mounted) return null;

    // Limitamos a mostrar solo las últimas 3 notificaciones para evitar sobrecarga visual
    const visibleNotifications = notifications.slice(0, 3);

    return (
        <div className="fixed top-0 right-0 z-50 p-4 space-y-4 pointer-events-none">
            <AnimatePresence mode="sync">
                {visibleNotifications.map((notification) => (
                    <div key={notification.id} className="pointer-events-auto">
                        <Toast
                            {...notification}
                            onDismiss={() => handleDismiss(notification.id)}
                        />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastProvider;