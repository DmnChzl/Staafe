// Get 'localStorage'
export const getItem = <T>(key: string): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : {};
};

// Set 'localStorage' #Preserve
export const setItem = <T>(key: string, val: Record<string, T>) => {
  const item = localStorage.getItem(key);
  const parsedItem = item ? JSON.parse(item) : {};
  localStorage.setItem(key, JSON.stringify({ ...parsedItem, ...val }));
};
