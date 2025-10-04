import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export const useFocusTrap = <T extends HTMLElement>(isActive: boolean) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const node = ref.current;

    if (!node) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    };

    node.focus();
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isActive]);

  return ref;
};
