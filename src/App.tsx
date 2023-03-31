import clsx from 'clsx';
import { useEffect, useRef, useState } from 'preact/hooks';
import { JSX } from 'preact/jsx-runtime';
import Hero from './components/Hero';
import { Search } from './components/icons';
import ToggleSwitch from './components/ToggleSwitch';
import ToggleTheme from './components/ToggleTheme';
import { SEARCH_ENGINE_NAME } from './constants';
import useDebounce from './hooks/useDebounce';
import useField from './hooks/useField';
import useOuterClick from './hooks/useOuterClick';
import useToggle from './hooks/useToggle';
import { getMessage } from './i18n';
import * as SearchServices from './services/searchServices';
import { addQuery, isEcoSearchEngine, searchEngine, toggleSearchEngine } from './store';

/**
 * 'window.location.href' Redirection
 *
 * @param {string} provider DDG // ECO
 * @param {string} text
 */
const redirect = (provider: string, text: string) => {
  const lowerProvider = provider.toLowerCase();
  const lowerText = text.toLowerCase();

  addQuery({ provider: lowerProvider, text: lowerText });
  SearchServices.redirectTo(lowerProvider, encodeURIComponent(lowerText));
};

export default function App() {
  const [buttonLabel, setButtonLabel] = useState('');
  const [isFocused, focusOn, focusOff] = useToggle();
  const [searchText, setSearchText] = useField('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const fieldRef = useOuterClick<HTMLDivElement>(focusOff);

  const debouncedFetch = useDebounce(() => {
    if (searchText.length > 0) {
      SearchServices.getAutoCompleteSuggestions(searchEngine.value, searchText).then(result => {
        setSuggestions(result);
      });
    }
  }, 150);

  /**
   * 'searchText' watcher
   * i.e. the debouncing method
   */
  useEffect(() => {
    debouncedFetch();
  }, [searchText]);

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
          setButtonLabel(currentLabel => (currentLabel += char));
        }, 100 * idx)
      ];
    });
  };

  /**
   * Handle hover on button (leaving)
   */
  const handleMouseLeave = () => {
    timers.current.forEach(timer => clearTimeout(timer));
    const chars = buttonLabel.split('');

    chars.forEach((_, idx) => {
      timers.current = [
        ...timers.current,
        setTimeout(() => {
          setButtonLabel(currentbuttonLabel => currentbuttonLabel.substring(0, currentbuttonLabel.length - 1));
        }, 50 * idx)
      ];
    });
  };

  /**
   * Handle <form> / <input> validation
   */
  const handleSubmit = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    event.preventDefault();
    redirect(searchEngine.value, searchText);
  };

  const placeholder = getMessage('Input.Text', { provider: SEARCH_ENGINE_NAME[searchEngine.value] });

  return (
    <div class="flex h-screen w-screen flex-col">
      <Hero />

      <header class="flex h-20 shrink grow-0 justify-between p-4">
        <ToggleSwitch
          className="z-10 m-4"
          id="toggle-search-engine"
          defaultChecked={isEcoSearchEngine.value}
          onInput={toggleSearchEngine}
        />
        <ToggleTheme />
      </header>

      <main class="flex flex-auto">
        <div ref={fieldRef} class="relative mx-8 my-auto w-full md:mx-auto md:w-1/2">
          <form class="flex space-x-4" onSubmit={handleSubmit}>
            <input
              class="field"
              placeholder={placeholder}
              onFocus={focusOn}
              defaultValue={searchText}
              onInput={setSearchText}
            />

            <button
              class="button"
              type="submit"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              disabled={searchText.length === 0}>
              <Search />
              {buttonLabel && <span class="font-poppins text-base">{buttonLabel}</span>}
            </button>
          </form>

          {isFocused && searchText.length > 0 && suggestions.length > 0 && (
            <ul class="autocomplete-list">
              {suggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  class={clsx(
                    'autocomplete-item',
                    isEcoSearchEngine.value && 'hover:bg-green-100',
                    !isEcoSearchEngine.value && 'hover:bg-orange-100'
                  )}
                  onClick={() => redirect(searchEngine.value, suggestion)}
                  tabIndex={0}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <footer class="z-10 flex h-20 shrink grow-0 flex-col justify-end">
        <span class="font-poppins mx-auto my-2 text-[12px] leading-[24px] tracking-wide text-gray-400">
          {getMessage('Footer.Text')}
          <a href="https://www.dmnchzl.dev" target="_blank" class="hover:underline">
            DmnChzl
          </a>
        </span>
      </footer>
    </div>
  );
}
