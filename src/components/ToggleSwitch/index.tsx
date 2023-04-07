import { JSX } from 'preact/jsx-runtime';
import { getRandomString } from '../../utils';
import styles from './toggle-switch.module.css';

interface Props {
  className?: string;
  id: string;
  defaultChecked?: boolean;
  onInput?: (event: JSX.TargetedEvent<HTMLInputElement, Event>) => void;
}

export default function ToggleSwitch({ className, id = getRandomString(), ...props }: Props) {
  return (
    <div class={className} style={{ position: 'relative' }}>
      <input class={styles.offscreen} id={id} type="checkbox" {...props} />
      <label class={styles.switch} for={id} />
    </div>
  );
}
