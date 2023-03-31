export const getRandomString = (): string => Math.random().toString(36).substring(2);

export const isHistory = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get('history') === 'true';
};

// prettier-ignore
export const sortBy = <T>(key: keyof T) => (a: T, b: T) => a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0;

// prettier-ignore
export const reverseSortBy = <T>(key: keyof T) => (a: T, b: T) => sortBy(key)(a, b) * -1;
