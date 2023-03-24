import { useEffect, useRef, useState } from 'preact/hooks';
import Hero from './components/Hero';
import { Search } from './components/icons';
import ToggleTheme from './components/ToggleTheme';
import useDebounce from './hooks/useDebounce';
import useField from './hooks/useField';
import useToggle from './hooks/useToggle';
import { getMessage } from './i18n';
import * as SearchServices from './services/searchServices';

type Phrases = Array<{ phrase: string }>;

// prettier-ignore
const goToDuckDuck = (query: string) => (window.location.href = `https://safe.duckduckgo.com/?q=${encodeURIComponent(query)}`);

export function App() {
  const [btnTxt, setBtnTxt] = useState('');
  const [isFocused, focusOn, focusOff] = useToggle();
  const [fieldValue, setFieldValue] = useField('');
  const [searchResults, setSearchResults] = useState<Phrases>([]);

  const debouncedFetch = useDebounce(() => {
    if (fieldValue.length > 0) {
      SearchServices.askDuckDuckGo<Phrases>(fieldValue).then(phrases => {
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

  const timer = useRef<number>();

  /**
   * Handle hover on button (entering)
   */
  const handleMouseEnter = () => {
    clearTimeout(timer.current);
    const chars = getMessage('Button.Text').split('');

    chars.forEach((char, idx) => {
      timer.current = setTimeout(() => {
        setBtnTxt(currentLabel => (currentLabel += char));
      }, 100 * idx);
    });
  };

  /**
   * Handle hover on button (leaving)
   */
  const handleMouseLeave = () => {
    clearTimeout(timer.current);
    const chars = btnTxt.split('');

    chars.forEach((_, idx) => {
      timer.current = setTimeout(() => {
        setBtnTxt(currentBtnTxt => currentBtnTxt.substring(0, currentBtnTxt.length - 1));
      }, 50 * idx);
    });
  };

  return (
    <div class="flex h-screen flex-col">
      <Hero />

      <header class="flex h-20 shrink grow-0 flex-col items-end p-4">
        <ToggleTheme />
      </header>

      <main class="flex flex-auto">
        <div class="relative my-auto mx-8 w-full md:mx-auto md:w-1/2">
          <div class="flex space-x-4">
            <input
              class="field"
              placeholder={getMessage('Input.Text')}
              onFocus={focusOn}
              onBlur={focusOff}
              defaultValue={fieldValue}
              onInput={setFieldValue}
            />

            <button
              class="button"
              onClick={() => goToDuckDuck(fieldValue)}
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
                <li key={idx} class="list-item" onClick={() => goToDuckDuck(result.phrase)} tabIndex={0}>
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
          <a href="https://safe.duckduckgo.com" target="_blank" class="hover:underline">
            DuckDuckGo
          </a>
          's Safe Search
        </span>
      </footer>
    </div>
  );
}
