import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18nTestInstance } from './test-i18n';

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <I18nextProvider i18n={i18nTestInstance}>{children}</I18nextProvider>
);

const customRender = (ui: ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';
export { customRender as render, i18nTestInstance };
