import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { LucideProps } from 'lucide-react';
import { tokens } from '../../design/tokens';
import { getAriaProps } from '../../design/a11y';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'disabled' | 'children'> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'md' | 'lg';
  icon?: React.ComponentType<LucideProps>;
  iconOnly?: boolean;
  'aria-label': string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconOnly = false,
  className = '',
  disabled = false,
  ...props
}: ButtonProps): React.ReactElement => {
  const baseClasses = `inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900`;

  const sizeClasses = {
    md: `px-4 h-11 text-sm`,
    lg: `px-6 h-12 text-base`,
    iconMd: `w-11 h-11`,
    iconLg: `w-12 h-12`,
  };

  const variantClasses = {
    primary: `bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none`,
    secondary: `bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed`,
    tertiary: `bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed`,
    danger: `bg-rose-600 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed`,
  };

  const currentSizeClass = iconOnly ? sizeClasses[`icon${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof sizeClasses] : sizeClasses[size];

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${currentSizeClass} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      aria-disabled={disabled}
      {...getAriaProps(props['aria-label'])}
      {...props}
    >
      {Icon && <Icon size={iconOnly ? 22 : 18} />}
      {!iconOnly && children}
    </motion.button>
  );
};

export default Button;