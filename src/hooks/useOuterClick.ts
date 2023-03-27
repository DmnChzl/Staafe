import { useEffect, useRef } from 'preact/hooks';

/**
 * @param {Function} callback
 * @returns HTMLElement's ref
 */
export default function useOuterClick<T>(callback: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement && ref.current instanceof HTMLElement) {
        if (ref.current && !ref.current.contains(event.target)) callback();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [ref]);

  return ref;
}
