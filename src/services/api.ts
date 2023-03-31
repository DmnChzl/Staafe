const AUTOCOMPLETE_URL = import.meta.env['VITE_AUTOCOMPLETE_URL'] || '';
const DDG_URL = import.meta.env['VITE_DDG_URL'] || '';
const ECO_URL = import.meta.env['VITE_ECO_URL'] || '';

const api = {
  // prettier-ignore
  autocomplete: (provider: string, query: string) => `${AUTOCOMPLETE_URL}/autocomplete?provider=${provider}&query=${query}`,
  redirect: {
    ddg: (query: string) => `${DDG_URL}/?q=${query}`,
    eco: (query: string) => `${ECO_URL}/search?q=${query}&sfs=true`
  }
};

export default api;
