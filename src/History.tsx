import clsx from 'clsx';
import { useEffect } from 'preact/hooks';
import { Trash } from './components/icons';
import DuckDuckGo from './components/icons/DuckDuckGo';
import Tree from './components/icons/Tree';
import { ITEM_KEY, THEME } from './constants';
import type { Query } from './interfaces';
import * as SearchServices from './services/searchServices';
import * as StorageServices from './services/storageServices';
import { noQuery, queries, resetQueries, searchEngine } from './store';
import { reverseSortBy } from './utils';

const isDuckDuckGo = (provider: string) => ['duckduckgo', 'ddg'].includes(provider);
const isEcosia = (provider: string) => ['ecosia', 'eco'].includes(provider);

/**
 * 'window.location.href' Redirection
 *
 * @param {string} provider DDG // ECO
 * @param {string} text
 */
const redirect = (provider: string, text: string) => {
  const lowerProvider = provider.toLowerCase();
  const lowerText = text.toLowerCase();

  SearchServices.createTab(lowerProvider, encodeURIComponent(lowerText));
};

export default function History() {
  useEffect(() => {
    const item = StorageServices.getItem<{ theme?: string }>(ITEM_KEY);

    // Check if 'localStorage' has theme value + Apply it!
    if (item?.theme && item.theme === THEME.DARK) {
      document.documentElement.classList.add(THEME.DARK);
    }
  }, []);

  return (
    <div class="relative flex h-[600px] w-[400px] flex-auto flex-col">
      <div class="fade top-0 bg-gradient-to-b" />
      <div class="fade bottom-0 bg-gradient-to-t" />

      <ul class="queries-list">
        {queries.value.sort(reverseSortBy<Query>('timestamp')).map(query => (
          <li
            class={clsx(
              'query-item',
              isDuckDuckGo(query.provider) && 'from-red-500 via-orange-500 to-amber-500',
              isEcosia(query.provider) && 'from-emerald-500 via-green-500 to-lime-500'
            )}
            onClick={() => redirect(searchEngine.value, query.text)}
            tabIndex={0}>
            <div
              class={clsx(
                'flex h-12 w-12 shrink-0 rounded-full text-white',
                isDuckDuckGo(query.provider) && 'bg-orange-400',
                isEcosia(query.provider) && 'bg-green-400'
              )}>
              {isDuckDuckGo(query.provider) && <DuckDuckGo className="m-auto" />}
              {isEcosia(query.provider) && <Tree className="m-auto" />}
            </div>
            <span class="line-clamp-2 text-base text-white">{query.text}</span>
          </li>
        ))}
      </ul>

      {!noQuery.value && (
        <button class="fab" type="button" onClick={resetQueries}>
          <Trash />
        </button>
      )}
    </div>
  );
}
