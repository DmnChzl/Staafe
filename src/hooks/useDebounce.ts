import { useCallback, useRef } from 'preact/hooks';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useDebounce(func: (...args: any) => void, delay = 1000) {
  const timer = useRef<number>();

  return useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: any) => {
      const tick = () => {
        clearTimeout(timer.current);
        func(...args);
      };

      clearTimeout(timer.current);
      timer.current = setTimeout(tick, delay);
    },
    [func, delay]
  );
}
