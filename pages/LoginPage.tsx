import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, LogIn, Shield, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BRANDING, DEFAULT_REDIRECTS, MOCK_CREDENTIALS, ROLES, ROUTES, Role } from '../config';
import { useAuthStore } from '../store/authStore';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const { t } = useTranslation();

  const role = searchParams.get('role') as Role | null;

  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!role) {
    navigate(ROUTES.auth.accessType, { replace: true });
    return null;
  }

  const roleInfo = useMemo(() => ({
    [ROLES.DIRECTOR]: {
      title: t('auth.login.title.director'),
      icon: Shield,
      credential: MOCK_CREDENTIALS[ROLES.DIRECTOR],
    },
    [ROLES.TEACHER]: {
      title: t('auth.login.title.teacher'),
      icon: GraduationCap,
      credential: MOCK_CREDENTIALS[ROLES.TEACHER],
    },
  }), [t]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const credential = roleInfo[role].credential;

    if (dni === credential.username && password === credential.password) {
      setError('');
      login(role);
      const redirectTo = role === ROLES.DIRECTOR ? DEFAULT_REDIRECTS.fallback : DEFAULT_REDIRECTS.teacher;
      navigate(redirectTo);
    } else {
      setError(t('auth.login.invalidCredentials'));
    }
  };

  const logoUrl = BRANDING.logoUrl;
  const RoleIcon = roleInfo[role].icon;
  const institutionName = t('branding.institutionName', { defaultValue: BRANDING.institutionName });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
       <div className="absolute top-4 left-4">
            <button onClick={() => navigate(ROUTES.auth.accessType)} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
                <ArrowLeft size={16} />
                <span>{t('auth.login.changeRole')}</span>
            </button>
       </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
            <img src={logoUrl} alt={t('branding.logoAlt')} className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
                <RoleIcon className="text-indigo-600" />
                {roleInfo[role].title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">{institutionName}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
            <form onSubmit={handleLogin} className="space-y-6">
                 <div>
                    <label htmlFor="dni" className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">{t('auth.login.dniLabel')}</label>
                    <input
                        id="dni"
                        type="text"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        placeholder={t(`auth.login.dniPlaceholder.${role}`)}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition focus:outline-none"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="password"className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">{t('auth.login.passwordLabel')}</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('auth.login.passwordPlaceholder')}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition focus:outline-none"
                        required
                    />
                </div>

                {error && <p className="text-sm text-rose-600 text-center">{error}</p>}

                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-full text-base font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                >
                    <LogIn size={18} />
                    <span>{t('auth.login.submit')}</span>
                </motion.button>
            </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;