import api from './api';

interface ResolvedMessage<T> {
  url: string;
  status: 'fulfilled';
  value: T;
}

interface RejectedMessage {
  url: string;
  status: 'rejected';
  reason: string;
}

type Message<T> = ResolvedMessage<T> | RejectedMessage;

const getBrowserInstance = (): typeof chrome => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const browserInstance = window.chrome || (window as any)['browser'];
  return browserInstance;
};

/**
 * @method redirectTo
 * @param {string} provider DDG // ECO
 * @param {string} query Encoded Text
 */
export const redirectTo = (provider: string, query: string) => {
  const redirectUrl: string = api.redirect[provider as 'ddg' | 'eco'](query);
  window.location.href = redirectUrl;
};

/**
 * @method fetchAutoCompleteSuggestions #ServerWay
 * @param {string} provider DDG // ECO
 * @param {string} text
 * @returns {Promise} Suggestions
 * @throws {string} Error msg
 */
export const fetchAutoCompleteSuggestions = async (provider: string, text: string): Promise<string[]> => {
  const lowerProvider = provider.toLowerCase();
  const lowerText = text.toLowerCase();

  return fetch(api.autocomplete(lowerProvider, encodeURIComponent(lowerText)), {
    method: 'GET'
    // mode: 'no-cors'
  })
    .then(response => response.json())
    .catch(err => err.message);
};

/**
 * Fetch Suggestions #BrowserWay
 *
 * @param {string} provider DDG // ECO
 * @param {string} text
 * @returns {Promise} Suggestions
 * @throws {string} Error msg
 */
export const sendMessage = async (provider: string, text: string): Promise<string[]> => {
  const lowerProvider = provider.toLowerCase();
  const lowerText = text.toLowerCase();

  return new Promise((resolve, reject) => {
    const browserInstance = getBrowserInstance();

    browserInstance.runtime.sendMessage(
      { provider: lowerProvider, query: encodeURIComponent(lowerText) },
      (message: Message<string[]>) => {
        if (message.status === 'fulfilled') {
          resolve(message.value);
        }

        if (message.status === 'rejected') {
          reject(message.reason);
        }
      }
    );
  });
};

export const getAutoCompleteSuggestions = async (...props: [string, string]): Promise<string[]> => {
  const extensionMode = import.meta.env['VITE_EXTENSION_MODE'] || 'false';
  return extensionMode === 'true' ? sendMessage(...props) : fetchAutoCompleteSuggestions(...props);
};
