import { JSX } from 'preact';
import { useState } from 'preact/hooks';

/**
 * 'event.target.value' handler
 *
 * @param initialState (default: '')
 * @returns {[boolean, Function, Function]} { value, set(), reset() }
 */
export default function useField(
  initialState = ''
): [string, (event: JSX.TargetedEvent<HTMLInputElement, Event>) => void, () => void] {
  const [value, setValue] = useState<string>(initialState);
  return [
    value,
    (event: JSX.TargetedEvent<HTMLInputElement, Event>) => setValue(event.currentTarget.value),
    () => setValue(initialState)
  ];
}
