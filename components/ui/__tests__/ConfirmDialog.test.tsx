import React from 'react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from '../ConfirmDialog';
import { render, screen } from '../../../tests/test-utils';

describe('ConfirmDialog', () => {
  const baseProps = {
    title: 'Delete item',
    message: 'Are you sure?',
  };

  it('invokes onClose when the overlay is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <ConfirmDialog
        {...baseProps}
        isOpen
        onClose={onClose}
        onConfirm={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog');
    await user.click(dialog.parentElement!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside the dialog panel', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <ConfirmDialog
        {...baseProps}
        isOpen
        onClose={onClose}
        onConfirm={vi.fn()}
      />,
    );

    await user.click(screen.getByText('Delete item'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('sets required accessibility attributes', () => {
    render(
      <ConfirmDialog
        {...baseProps}
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog');

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });
});
