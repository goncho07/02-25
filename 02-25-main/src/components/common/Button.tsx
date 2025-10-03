import React from 'react';
import { COLORS, TYPOGRAPHY, SPACING, BORDERS, TRANSITIONS } from '@/core/constants';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ComponentType<{ size?: number }>;
  fullWidth?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

const getVariantStyles = (variant: ButtonVariant = 'primary') => {
  const styles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: COLORS.PRIMARY.MAIN,
      color: '#fff',
      '&:hover': {
        backgroundColor: COLORS.PRIMARY.DARK,
      },
      '&:active': {
        backgroundColor: COLORS.PRIMARY.LIGHT,
      },
    },
    secondary: {
      backgroundColor: 'transparent',
      color: COLORS.PRIMARY.MAIN,
      border: `${BORDERS.WIDTH.XS} solid ${COLORS.PRIMARY.MAIN}`,
      '&:hover': {
        backgroundColor: COLORS.PRIMARY.LIGHT,
        color: '#fff',
      },
    },
    tertiary: {
      backgroundColor: 'transparent',
      color: COLORS.TEXT.PRIMARY,
      '&:hover': {
        backgroundColor: COLORS.GREY[100],
      },
    },
    danger: {
      backgroundColor: COLORS.ERROR.MAIN,
      color: '#fff',
      '&:hover': {
        backgroundColor: COLORS.ERROR.DARK,
      },
    },
  };

  return styles[variant];
};

const getSizeStyles = (size: ButtonSize = 'medium') => {
  const styles: Record<ButtonSize, React.CSSProperties> = {
    small: {
      padding: `${SPACING.XS}px ${SPACING.SM}px`,
      fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    },
    medium: {
      padding: `${SPACING.SM}px ${SPACING.MD}px`,
      fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    },
    large: {
      padding: `${SPACING.MD}px ${SPACING.LG}px`,
      fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    },
  };

  return styles[size];
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.SM,
    border: 'none',
    borderRadius: BORDERS.RADIUS.MD,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    cursor: 'pointer',
    transition: `all ${TRANSITIONS.DURATION.SHORT}ms ${TRANSITIONS.EASING.EASE_IN_OUT}`,
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.6 : 1,
    pointerEvents: disabled || loading ? 'none' : 'auto',
  };

  const variantStyles = getVariantStyles(variant as ButtonVariant);
  const sizeStyles = getSizeStyles(size as ButtonSize);

  const combinedStyles = {
    ...baseStyles,
    ...variantStyles,
    ...sizeStyles,
  };

  return (
    <button
      style={combinedStyles}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading && (
        <span className="loading-spinner" style={{ marginRight: SPACING.XS }} />
      )}
      {Icon && <Icon size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />}
      {children}
    </button>
  );
};

export default Button;