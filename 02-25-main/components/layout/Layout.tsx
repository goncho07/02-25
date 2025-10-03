import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useUIStore } from '../../store/uiStore';

interface BreadcrumbsProps {
  paths: Array<{
    name: string;
    href: string;
  }>;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ paths }) => {
  return (
    <nav className="mb-4">
      <ol className="flex space-x-2">
        {paths.map((path, index) => (
          <li key={path.href} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            <a href={path.href} className="text-blue-600 hover:text-blue-800">
              {path.name}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSidebarCollapsed } = useUIStore();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-28' : 'ml-80'}`}>
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <Breadcrumbs paths={[
                { name: 'Dashboard', href: '/dashboard' }
              ]} />
              {children}
            </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;