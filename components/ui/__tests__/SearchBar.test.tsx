import React from 'react';
import { vi } from 'vitest';
import { act } from 'react';
import { render, screen } from '../../../tests/test-utils';

const storeState = {
  isCommandMenuOpen: false,
  setCommandMenuOpen: vi.fn((value: boolean) => {
    storeState.isCommandMenuOpen = value;
  }),
};

vi.mock('../../../store/uiStore', () => ({
  useUIStore: () => storeState,
}));

import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  const originalUserAgent = navigator.userAgent;

  afterEach(() => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });
    storeState.isCommandMenuOpen = false;
    storeState.setCommandMenuOpen.mockClear();
  });

  it('uses mac shortcut when running on macOS', async () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
      configurable: true,
    });

    await act(async () => {
      render(<SearchBar />);
      await Promise.resolve();
    });

    expect(screen.getByPlaceholderText('Search by name, ID or role… (⌘K)')).toBeInTheDocument();
  });

  it('uses ctrl shortcut on non-mac platforms', async () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0)',
      configurable: true,
    });

    await act(async () => {
      render(<SearchBar />);
      await Promise.resolve();
    });

    expect(screen.getByPlaceholderText('Search by name, ID or role… (Ctrl+K)')).toBeInTheDocument();
  });

  it('focuses and selects the input when the command menu opens', async () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(performance.now());
      return 1;
    });
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

    storeState.isCommandMenuOpen = true;

    await act(async () => {
      render(<SearchBar />);
      await Promise.resolve();
    });

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toHaveFocus();
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(input.value.length);
    expect(storeState.setCommandMenuOpen).toHaveBeenCalledWith(false);
    expect(storeState.isCommandMenuOpen).toBe(false);

    rafSpy.mockRestore();
    cancelSpy.mockRestore();
  });
});
