import { useEffect, useState } from 'preact/hooks';
import { ITEM_KEY, THEME } from '../constants';
import { Moon, Sun } from './icons';

export default function ToggleTheme() {
  const [theme, setTheme] = useState(THEME.LIGHT);

  useEffect(() => {
    const item = localStorage.getItem(ITEM_KEY);

    if (item) {
      const parsedItem: { theme?: string } = JSON.parse(item);

      // Check if 'localStorage' has theme value + Apply it!
      if (parsedItem?.theme && parsedItem.theme === THEME.DARK) {
        document.documentElement.classList.add(THEME.DARK);
        setTheme(THEME.DARK);
      }
    }
  }, []);

  /**
   * Set 'localStorage' + Signal's value to DARK
   */
  const switchDark = () => {
    localStorage.setItem(ITEM_KEY, JSON.stringify({ theme: THEME.DARK }));
    setTheme(THEME.DARK);
  };

  /**
   * Set 'localStorage' + Signal's value to LIGHT
   */
  const switchLight = () => {
    localStorage.setItem(ITEM_KEY, JSON.stringify({ theme: THEME.LIGHT }));
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
      {theme === THEME.DARK ? <Moon class="h-6 w-6" /> : <Sun class="h-6 w-6" />}
    </button>
  );
}
