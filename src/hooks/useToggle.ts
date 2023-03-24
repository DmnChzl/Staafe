import { useState } from 'preact/hooks';

/**
 * 'on' / 'off' handler
 *
 * @param initialState (default: false)
 * @returns {[boolean, Function, Function]} { value, on(), off() }
 */
export default function useToggle(initialState = false): [boolean, () => void, () => void] {
  const [value, setValue] = useState(initialState);
  return [value, () => setValue(true), () => setValue(false)];
}
