import React, { useRef, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../store/uiStore';
import Input from './Input';

const SearchBar: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isCommandMenuOpen, setCommandMenuOpen } = useUIStore();
  const { t } = useTranslation();

  const shortcut = useMemo(() => {
    if (typeof navigator === 'undefined') {
      return 'Ctrl+K';
    }

    return /mac/i.test(navigator.userAgent) ? '⌘K' : 'Ctrl+K';
  }, []);

  useEffect(() => {
    if (!isCommandMenuOpen) {
      return;
    }

    let frame: number | null = null;
    let cancelled = false;

    const schedule =
      typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
        ? window.requestAnimationFrame.bind(window)
        : (callback: FrameRequestCallback) => setTimeout(() => callback(performance.now()), 0);

    const cancelSchedule = (handle: number | null) => {
      if (handle === null) {
        return;
      }
      if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
        window.cancelAnimationFrame(handle);
      } else {
        clearTimeout(handle);
      }
    };

    const focusInput = () => {
      if (cancelled) {
        return;
      }

      const node = inputRef.current;

      if (node) {
        node.focus();
        node.select();
        setCommandMenuOpen(false);
        return;
      }

      frame = schedule(focusInput);
    };

    frame = schedule(focusInput);

    return () => {
      cancelled = true;
      cancelSchedule(frame);
    };
  }, [isCommandMenuOpen, setCommandMenuOpen]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
      <Input
        ref={inputRef}
        type="text"
        aria-label={t('ui.search.aria')}
        placeholder={t('ui.search.placeholder', { shortcut })}
        className="!pl-11"
      />
    </div>
  );
};

export default SearchBar;
