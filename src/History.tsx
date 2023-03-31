import clsx from 'clsx';
import { useEffect } from 'preact/hooks';
import { Trash } from './components/icons';
import DuckDuckGo from './components/icons/DuckDuckGo';
import Tree from './components/icons/Tree';
import { ITEM_KEY, THEME } from './constants';
import * as SearchServices from './services/searchServices';
import * as StorageServices from './services/storageServices';
import { noQuery, queries, resetQueries, searchEngine } from './store';
import { reverseSortBy } from './utils';

const QUERIES = [
  { timestamp: 1680208244730, provider: 'ecosia', text: 'lorem ipsum' },
  {
    timestamp: 1680208254415,
    provider: 'duckduckgo',
    text: 'google chrome'
  },
  {
    timestamp: 1680208273444,
    provider: 'duckduckgo',
    text: 'deadmau5'
  },
  {
    timestamp: 1680208501279,
    provider: 'ecosia',
    text: 'quel est le sens de la vie'
  },
  {
    timestamp: 1680208511814,
    provider: 'ecosia',
    text: 'recette pain perdu'
  },
  {
    timestamp: 1680208519316,
    provider: 'ecosia',
    text: 'android police'
  },
  {
    timestamp: 1680208530650,
    provider: 'duckduckgo',
    text: 'nothing phone 1 amazon'
  },
  { timestamp: 1680208546292, provider: 'duckduckgo', text: 'fast com' }
];

const redirect = (provider: string, text: string) => {
  const lowerProvider = provider.toLowerCase();
  const lowerText = text.toLowerCase();

  SearchServices.redirectTo(lowerProvider, encodeURIComponent(lowerText));
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

      <ul class="scrollbar-none flex h-full flex-col space-y-4 overflow-y-auto py-4">
        {queries.value
          .sort(
            reverseSortBy<{
              timestamp: number;
              provider: string;
              text: string;
            }>('timestamp')
          )
          .map(query => (
            <li
              class={clsx(
                'mx-4 flex scale-100 cursor-pointer items-center space-x-4 rounded-lg bg-gradient-to-r p-4 transition-transform duration-[250ms] hover:scale-105',
                query.provider === 'duckduckgo' && 'from-red-500 via-orange-500 to-amber-500',
                query.provider === 'ecosia' && 'from-emerald-500 via-green-500 to-lime-500'
              )}
              onClick={() => redirect(searchEngine.value, query.text)}
              tabIndex={0}>
              <div
                class={clsx(
                  'flex h-12 w-12 shrink-0 rounded-full text-white',
                  query.provider === 'duckduckgo' && 'bg-orange-400',
                  query.provider === 'ecosia' && 'bg-green-400'
                )}>
                {query.provider === 'duckduckgo' && <DuckDuckGo className="m-auto" />}
                {query.provider === 'ecosia' && <Tree className="m-auto" />}
              </div>

              <span class="line-clamp-2 text-white">{query.text}</span>
            </li>
          ))}
      </ul>

      {!noQuery.value && (
        <button
          class="absolute bottom-8 left-[calc(50%-24px)] z-20 mx-auto flex h-12 w-12 items-center space-x-2 rounded-full bg-white px-4 py-2 text-gray-800 shadow hover:bg-gray-50 focus:bg-gray-100"
          onClick={resetQueries}>
          <Trash />
        </button>
      )}
    </div>
  );
}
