import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';
import { render, screen } from '../../../tests/test-utils';

describe('Breadcrumbs', () => {
  const renderWithRouter = (initialPath: string, props?: React.ComponentProps<typeof Breadcrumbs>) => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="*" element={<Breadcrumbs {...props} />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it('handles invalid encoded segments safely', () => {
    renderWithRouter('/reportes/%ZZ');

    expect(screen.getByText('%ZZ')).toBeInTheDocument();
  });

  it('collapses breadcrumbs when exceeding maxItems', () => {
    renderWithRouter('/reportes/informes/anuales/2025', { maxItems: 3 });

    expect(screen.getByText('…')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
    expect(screen.queryByText('Informes')).not.toBeInTheDocument();
  });
});
