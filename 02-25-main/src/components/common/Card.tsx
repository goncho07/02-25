import React from 'react';
import { COLORS, SPACING, BORDERS, SHADOWS } from '@/core/constants';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  className,
  onClick,
}) => {
  const getPaddingValue = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return SPACING.SM;
      case 'large':
        return SPACING.LG;
      default:
        return SPACING.MD;
    }
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'outlined':
        return {
          border: `${BORDERS.WIDTH.XS} solid ${COLORS.GREY[200]}`,
          boxShadow: 'none',
        };
      case 'elevated':
        return {
          border: 'none',
          boxShadow: SHADOWS.MD,
        };
      default:
        return {
          border: 'none',
          boxShadow: SHADOWS.SM,
        };
    }
  };

  const baseStyles: React.CSSProperties = {
    backgroundColor: COLORS.BACKGROUND.PAPER,
    borderRadius: BORDERS.RADIUS.MD,
    padding: getPaddingValue(),
    cursor: onClick ? 'pointer' : 'default',
    ...getVariantStyles(),
  };

  return (
    <div
      style={baseStyles}
      className={className}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default Card;