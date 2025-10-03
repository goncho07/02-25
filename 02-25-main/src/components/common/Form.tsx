import React from 'react';
import { COLORS, SPACING, TYPOGRAPHY, TRANSITIONS } from '@/core/constants';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ label: string; value: string | number }>;
  error?: string;
}

const styles = {
  formField: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.XS,
    marginBottom: SPACING.MD,
  },
  label: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT.SECONDARY,
  },
  required: {
    color: COLORS.ERROR.MAIN,
    marginLeft: SPACING.XS,
  },
  input: {
    padding: SPACING.SM,
    border: `1px solid ${COLORS.GREY[300]}`,
    borderRadius: '4px',
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    transition: `all ${TRANSITIONS.DURATION.SHORT}ms ${TRANSITIONS.EASING.EASE_IN_OUT}`,
    '&:focus': {
      outline: 'none',
      borderColor: COLORS.PRIMARY.MAIN,
      boxShadow: `0 0 0 2px ${COLORS.PRIMARY.LIGHT}40`,
    },
  },
  error: {
    borderColor: COLORS.ERROR.MAIN,
    '&:focus': {
      borderColor: COLORS.ERROR.MAIN,
      boxShadow: `0 0 0 2px ${COLORS.ERROR.LIGHT}40`,
    },
  },
  errorText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    color: COLORS.ERROR.MAIN,
  },
  select: {
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.7rem top 50%',
    backgroundSize: '0.65rem auto',
  },
};

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required,
  children,
}) => {
  return (
    <div style={styles.formField}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.required}>*</span>}
      </label>
      {children}
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
};

export const Input: React.FC<InputProps> = ({ error, ...props }) => {
  return (
    <input
      style={{
        ...styles.input,
        ...(error && styles.error),
      }}
      {...props}
    />
  );
};

export const TextArea: React.FC<TextAreaProps> = ({ error, ...props }) => {
  return (
    <textarea
      style={{
        ...styles.input,
        ...(error && styles.error),
        minHeight: '100px',
        resize: 'vertical',
      }}
      {...props}
    />
  );
};

export const Select: React.FC<SelectProps> = ({ options, error, ...props }) => {
  return (
    <select
      style={{
        ...styles.input,
        ...styles.select,
        ...(error && styles.error),
      }}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export const Form: React.FC<{
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}> = ({ onSubmit, children }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
      style={{ width: '100%' }}
    >
      {children}
    </form>
  );
};