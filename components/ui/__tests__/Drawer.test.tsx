import React from 'react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from '../../../tests/test-utils';
import Drawer from '../Drawer';

describe('Drawer', () => {
  const baseProps = {
    title: 'Panel title',
  };

  it('does not trigger onClose when closed and Escape is pressed', () => {
    const onClose = vi.fn();

    render(
      <Drawer isOpen={false} onClose={onClose} {...baseProps}>
        <p>Content</p>
      </Drawer>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes when Escape is pressed while open', () => {
    const onClose = vi.fn();

    render(
      <Drawer isOpen onClose={onClose} {...baseProps}>
        <p>Content</p>
      </Drawer>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('stops propagation of clicks inside the panel', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Drawer isOpen onClose={onClose} {...baseProps}>
        <button type="button">Inner button</button>
      </Drawer>,
    );

    await user.click(screen.getByRole('button', { name: 'Inner button' }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes when clicking on the overlay', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Drawer isOpen onClose={onClose} {...baseProps}>
        <p>Content</p>
      </Drawer>,
    );

    const dialog = screen.getByRole('dialog');
    await user.click(dialog.parentElement!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
