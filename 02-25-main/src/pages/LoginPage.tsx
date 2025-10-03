import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Form, FormField, Input } from '@/components/common/Form';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { useAuthStore } from '@/store';
import { COLORS, SPACING, TYPOGRAPHY } from '@/core/constants';

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: SPACING.MD,
    backgroundColor: COLORS.BACKGROUND.DEFAULT,
  },
  card: {
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT.PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.LG,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT.SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.XL,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.MD,
  },
  buttonContainer: {
    marginTop: SPACING.LG,
  },
  forgotPassword: {
    textAlign: 'center',
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT.SECONDARY,
    marginTop: SPACING.MD,
  },
  forgotPasswordLink: {
    color: COLORS.PRIMARY.MAIN,
    textDecoration: 'none',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};

const LoginPage: React.FC = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login, isLoading } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error al cambiar el valor
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Credenciales inválidas',
      });
    }
  };

  return (
    <div style={styles.container}>
      <Card variant="elevated" style={styles.card}>
        <h1 style={styles.title}>Bienvenido</h1>
        <p style={styles.subtitle}>
          Inicia sesión para acceder al sistema académico
        </p>

        <Form onSubmit={handleSubmit}>
          <div style={styles.form}>
            <FormField
              label="Email"
              error={errors.email}
              required
            >
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@escuela.edu"
                autoComplete="email"
                disabled={isLoading}
                error={errors.email}
              />
            </FormField>

            <FormField
              label="Contraseña"
              error={errors.password}
              required
            >
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                error={errors.password}
              />
            </FormField>

            <div style={styles.buttonContainer}>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isLoading}
              >
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </Form>

        <div style={styles.forgotPassword}>
          <span
            style={styles.forgotPasswordLink}
            onClick={() => {/* Implementar recuperación de contraseña */}}
          >
            ¿Olvidaste tu contraseña?
          </span>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;