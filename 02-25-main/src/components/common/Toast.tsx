import React from 'react';
import { COLORS, SPACING, TYPOGRAPHY, TRANSITIONS } from '@/core/constants';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const getToastColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return {
        background: COLORS.SUCCESS.LIGHT,
        text: COLORS.SUCCESS.DARK,
      };
    case 'error':
      return {
        background: COLORS.ERROR.LIGHT,
        text: COLORS.ERROR.DARK,
      };
    case 'warning':
      return {
        background: COLORS.WARNING.LIGHT,
        text: COLORS.WARNING.DARK,
      };
    case 'info':
      return {
        background: COLORS.INFO.LIGHT,
        text: COLORS.INFO.DARK,
      };
  }
};

const styles: Record<string, React.CSSProperties> = {
  toast: {
    position: 'fixed',
    bottom: SPACING.LG,
    right: SPACING.LG,
    padding: SPACING.MD,
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.SM,
    maxWidth: '400px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    animation: `slideIn ${TRANSITIONS.DURATION.SHORT}ms ${TRANSITIONS.EASING.EASE_OUT}`,
    zIndex: 9999,
  },
  message: {
    margin: 0,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.PRIMARY,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    flex: 1,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: SPACING.XS,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
    transition: `opacity ${TRANSITIONS.DURATION.SHORT}ms ${TRANSITIONS.EASING.EASE_IN_OUT}`,
    '&:hover': {
      opacity: 1,
    },
  },
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 5000,
  onClose,
}) => {
  const colors = getToastColor(type as ToastType);
  
  React.useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      style={{
        ...styles.toast,
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      <p style={styles.message}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          style={styles.closeButton}
          aria-label="Cerrar notificación"
        >
          ×
        </button>
      )}
    </div>
  );
};

interface ToastContextType {
  showToast: (props: Omit<ToastProps, 'onClose'>) => void;
}

export const ToastContext = React.createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = React.useState<ToastProps | null>(null);

  const showToast = (props: Omit<ToastProps, 'onClose'>) => {
    setToast({ ...props, onClose: () => setToast(null) });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast {...toast} />}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};