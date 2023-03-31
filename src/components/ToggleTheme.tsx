import { useEffect, useState } from 'preact/hooks';
import { ITEM_KEY, THEME } from '../constants';
import * as StorageServices from '../services/storageServices';
import { Moon, Sun } from './icons';

export default function ToggleTheme() {
  const [theme, setTheme] = useState(THEME.LIGHT);

  useEffect(() => {
    const item = StorageServices.getItem<{ theme?: string }>(ITEM_KEY);

    // Check if 'localStorage' has theme value
    if (item?.theme && item.theme === THEME.DARK) {
      document.documentElement.classList.add(THEME.DARK);
      setTheme(THEME.DARK);
    }
  }, []);

  /**
   * Set 'localStorage' + Signal's value to DARK
   */
  const switchDark = () => {
    StorageServices.setItem(ITEM_KEY, { theme: THEME.DARK });
    setTheme(THEME.DARK);
  };

  /**
   * Set 'localStorage' + Signal's value to LIGHT
   */
  const switchLight = () => {
    StorageServices.setItem(ITEM_KEY, { theme: THEME.LIGHT });
    setTheme(THEME.LIGHT);
  };

  const toggleTheme = () => {
    const { classList } = document.documentElement;

    // Check if <html> has CSS theme class
    if (classList.contains(THEME.DARK)) {
      classList.remove(THEME.DARK);
      switchLight();
    } else {
      classList.add(THEME.DARK);
      switchDark();
    }
  };

  return (
    <button class="z-20 m-4 text-white opacity-50 transition-opacity hover:opacity-100" onClick={toggleTheme}>
      {theme === THEME.DARK ? <Moon /> : <Sun />}
    </button>
  );
}
