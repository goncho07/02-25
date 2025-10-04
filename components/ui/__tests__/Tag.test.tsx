import React from 'react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Tag from '../Tag';
import { render, screen } from '../../../tests/test-utils';

describe('Tag', () => {
  it('stops propagation when removing the tag', async () => {
    const onRemove = vi.fn();
    const parentClick = vi.fn();
    const user = userEvent.setup();

    render(
      <div onClick={parentClick}>
        <Tag onRemove={onRemove}>Example</Tag>
      </div>,
    );

    const removeButton = screen.getByRole('button', { name: 'Remove tag' });
    await user.click(removeButton);

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(parentClick).not.toHaveBeenCalled();
  });

  it('allows overriding the remove aria-label', () => {
    render(<Tag onRemove={vi.fn()} removableLabel="Custom remove">Example</Tag>);

    expect(screen.getByRole('button', { name: 'Custom remove' })).toBeInTheDocument();
  });
});
