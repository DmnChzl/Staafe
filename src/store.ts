import { computed, effect, signal } from '@preact/signals';
import { ITEM_KEY, SEARCH_ENGINE_ALIAS as SEARCH_ENGINE } from './constants';
import type { Query } from './interfaces';
import * as StorageServices from './services/storageServices';

// Get default 'searchEngine' signal's value
const getSearchEngine = () => {
  const item = StorageServices.getItem<{ provider?: string }>(ITEM_KEY);
  return item?.provider || SEARCH_ENGINE.DDG;
};

export const searchEngine = signal<string>(getSearchEngine());

// Update 'localStorage' each time 'searchEngine' signal's value changes
effect(() => {
  StorageServices.setItem(ITEM_KEY, { provider: searchEngine.value });
});

export const isEcoSearchEngine = computed<boolean>(() => searchEngine.value === SEARCH_ENGINE.ECO);

export const useDefaultSearchEngine = () => (searchEngine.value = SEARCH_ENGINE.DDG);
export const useEcoSearchEngine = () => (searchEngine.value = SEARCH_ENGINE.ECO);

export const toggleSearchEngine = () => {
  if (isEcoSearchEngine.value) {
    useDefaultSearchEngine();
  } else {
    useEcoSearchEngine();
  }
};

// Get default 'queries' signal's value
const getQueries = () => {
  const item = StorageServices.getItem<{ queries?: Query[] }>(ITEM_KEY);
  return item?.queries || [];
};

export const queries = signal<Query[]>(getQueries());

// Update 'localStorage' each time 'queries' signal's value changes
effect(() => {
  StorageServices.setItem(ITEM_KEY, { queries: queries.value });
});

export const noQuery = computed<boolean>(() => queries.value.length === 0);

export const addQuery = (query: { provider: string; text: string }) => {
  const now = Date.now();

  queries.value = [
    ...queries.value,
    {
      timestamp: now,
      ...query
    }
  ];
};

export const resetQueries = () => (queries.value = []);
