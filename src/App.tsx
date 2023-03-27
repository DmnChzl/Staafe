import clsx from 'clsx';
import { useEffect, useRef, useState } from 'preact/hooks';
import Hero from './components/Hero';
import { Search } from './components/icons';
import ToggleTheme from './components/ToggleTheme';
import useDebounce from './hooks/useDebounce';
import useField from './hooks/useField';
import useOuterClick from './hooks/useOuterClick';
import useToggle from './hooks/useToggle';
import { getMessage } from './i18n';
import type { Phrases } from './services/searchServices';
import * as SearchServices from './services/searchServices';

const hasPopup = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get('popup');
};

const redirect = (text: string) => {
  // window.location.href = `https://safe.duckduckgo.com/?q=${encodeURIComponent(text)}`;
  SearchServices.getRedirectUrl(text).then(({ url: redirectUrl }) => {
    window.location.href = redirectUrl;
  });
};

export function App() {
  const [btnTxt, setBtnTxt] = useState('');
  const [isFocused, focusOn, focusOff] = useToggle();
  const [fieldValue, setFieldValue] = useField('');
  const [searchResults, setSearchResults] = useState<Phrases>([]);
  const fieldRef = useOuterClick<HTMLDivElement>(focusOff);

  const debouncedFetch = useDebounce(() => {
    if (fieldValue.length > 0) {
      SearchServices.getAutoCompletePhrases(fieldValue).then(phrases => {
        setSearchResults(phrases);
      });
    }
  }, 150);

  /**
   * 'fieldValue' watcher
   * i.e. the debouncing method
   */
  useEffect(() => {
    debouncedFetch();
  }, [fieldValue]);

  const timers = useRef<number[]>([]);

  /**
   * Handle hover on button (entering)
   */
  const handleMouseEnter = () => {
    timers.current.forEach(timer => clearTimeout(timer));
    const chars = getMessage('Button.Text').split('');

    chars.forEach((char, idx) => {
      timers.current = [
        ...timers.current,
        setTimeout(() => {
          setBtnTxt(currentLabel => (currentLabel += char));
        }, 100 * idx)
      ];
    });
  };

  /**
   * Handle hover on button (leaving)
   */
  const handleMouseLeave = () => {
    timers.current.forEach(timer => clearTimeout(timer));
    const chars = btnTxt.split('');

    chars.forEach((_, idx) => {
      timers.current = [
        ...timers.current,
        setTimeout(() => {
          setBtnTxt(currentBtnTxt => currentBtnTxt.substring(0, currentBtnTxt.length - 1));
        }, 50 * idx)
      ];
    });
  };

  return (
    <div class={clsx('flex flex-col', hasPopup() ? 'h-[600px] w-[400px]' : 'h-screen w-screen')}>
      <Hero />

      <header class="flex h-20 shrink grow-0 flex-col items-end p-4">
        <ToggleTheme />
      </header>

      <main class="flex flex-auto">
        <div ref={fieldRef} class="relative my-auto mx-8 w-full md:mx-auto md:w-1/2">
          <div class="flex space-x-4">
            <input
              class="field"
              placeholder={getMessage('Input.Text')}
              onFocus={focusOn}
              defaultValue={fieldValue}
              onInput={setFieldValue}
            />

            <button
              class="button"
              onClick={() => redirect(fieldValue)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              disabled={fieldValue.length === 0}>
              <Search class="h-6 w-6" />
              {btnTxt && <span class="font-poppins text-base">{btnTxt}</span>}
            </button>
          </div>

          {isFocused && fieldValue.length > 0 && searchResults.length > 0 && (
            <ul class="list">
              {searchResults.map((result, idx) => (
                <li key={idx} class="list-item" onClick={() => redirect(result.phrase)} tabIndex={0}>
                  {result.phrase}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <footer class="flex h-20 shrink grow-0 flex-col justify-end">
        <span class="font-poppins mx-auto my-2 text-[12px] leading-[24px] tracking-wide text-slate-400">
          {getMessage('Footer.Text')}
          <a href="https://www.dmnchzl.dev" target="_blank" class="hover:underline">
            DmnChzl
          </a>
        </span>
      </footer>
    </div>
  );
}
