import React from 'react';
import { Page } from '@/components/common/Page';
import { DataTable } from '@/components/common/DataTable';
import { Filter } from '@/components/common/Filter';
import { Button } from '@/components/common/Button';
import { useApi, usePagination } from '@/hooks/useApi';
import { useToast } from '@/components/common/Toast';
import { ENDPOINTS } from '@/core/api';
import { User } from '@/core/api/types';
import { ROLES, COLORS, SPACING } from '@/core/constants';

interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
}

const UsersPage: React.FC = () => {
  const [filters, setFilters] = React.useState<UserFilters>({});
  const { showToast } = useToast();
  
  const {
    data: users,
    isLoading,
    error,
    page,
    totalPages,
    goToPage,
    refetch,
  } = usePagination<User>(ENDPOINTS.USERS, {
    transform: (response) => response.data,
    onError: (err) => showToast({
      type: 'error',
      message: err.message,
    }),
  });

  const handleFilterChange = (key: keyof UserFilters) => (value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: 100,
    },
    {
      key: 'firstName',
      title: 'Nombre',
      render: (value: string, user: User) => `${user.firstName} ${user.lastName}`,
    },
    {
      key: 'email',
      title: 'Email',
    },
    {
      key: 'role',
      title: 'Rol',
      render: (value: string) => (
        <span style={{
          padding: `${SPACING.XS}px ${SPACING.SM}px`,
          backgroundColor: `${COLORS.PRIMARY.LIGHT}20`,
          color: COLORS.PRIMARY.MAIN,
          borderRadius: '16px',
          fontSize: '12px',
        }}>
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Estado',
      render: (value: string) => (
        <span style={{
          padding: `${SPACING.XS}px ${SPACING.SM}px`,
          backgroundColor: value === 'active' ? `${COLORS.SUCCESS.LIGHT}20` : `${COLORS.ERROR.LIGHT}20`,
          color: value === 'active' ? COLORS.SUCCESS.MAIN : COLORS.ERROR.MAIN,
          borderRadius: '16px',
          fontSize: '12px',
        }}>
          {value === 'active' ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Acciones',
      width: 100,
      render: (_: any, user: User) => (
        <Button
          variant="secondary"
          size="small"
          onClick={() => handleEditUser(user)}
        >
          Editar
        </Button>
      ),
    },
  ];

  const handleEditUser = (user: User) => {
    // Implementar lógica de edición
    console.log('Editar usuario:', user);
  };

  const roleOptions = Object.entries(ROLES).map(([key, value]) => ({
    label: key,
    value: value,
  }));

  const statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  return (
    <Page
      title="Usuarios"
      subtitle="Gestión de usuarios del sistema"
      loading={isLoading}
      error={error?.message}
      actions={
        <Button
          variant="primary"
          onClick={() => {/* Implementar creación de usuario */}}
        >
          Nuevo Usuario
        </Button>
      }
    >
      <div style={{ display: 'flex', gap: SPACING.MD, marginBottom: SPACING.LG }}>
        <Filter
          label="Rol"
          value={filters.role || ''}
          onChange={handleFilterChange('role')}
          options={roleOptions}
        />
        <Filter
          label="Estado"
          value={filters.status || ''}
          onChange={handleFilterChange('status')}
          options={statusOptions}
        />
      </div>

      <DataTable
        data={users}
        columns={columns}
        loading={isLoading}
        onSort={(key, order) => {
          // Implementar ordenamiento
          console.log('Ordenar por:', key, order);
        }}
      />

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: SPACING.LG }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? 'primary' : 'secondary'}
              size="small"
              onClick={() => goToPage(p)}
              style={{ margin: `0 ${SPACING.XS}px` }}
            >
              {p}
            </Button>
          ))}
        </div>
      )}
    </Page>
  );
};

export default UsersPage;