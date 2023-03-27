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

export type Phrases = Array<{ phrase: string }>;

const SEARCH_ENGINE_URL = import.meta.env['VITE_SEARCH_ENGINE_URL'];

const getBrowserInstance = (): typeof chrome => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const browserInstance = window.chrome || (window as any)['browser'];
  return browserInstance;
};

/**
 * @method getRedirectUrl
 * @param {string} text
 * @returns {Promise} { url: redirectUrl }
 */
export const getRedirectUrl = async (text: string): Promise<{ url: string }> => {
  return fetch(`${SEARCH_ENGINE_URL}/redirect?query=${encodeURIComponent(text)}`, {
    method: 'GET'
    // mode: 'no-cors'
  }).then(response => response.json());
};

/**
 * @method getAutoCompletePhrases #ServerWay
 * @param {string} text
 * @returns {Promise} Phrases
 * @throws {string} Error msg
 */
export const getAutoCompletePhrases = async (text: string): Promise<Phrases> => {
  return fetch(`${SEARCH_ENGINE_URL}/autocomplete?query=${encodeURIComponent(text)}`, {
    method: 'GET',
    // mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .catch(err => err.message);
};

/**
 * Fetch DuckDuckGo #ProxyWay
 *
 * @param {string} text
 * @returns {Promise} Phrases
 * @throws {string} Error msg
 */
export const fetchDuckDuckGo = async (text: string): Promise<Phrases> => {
  return fetch(`http://localhost:1234/ddg/ac/?q=${encodeURIComponent(text)}`, {
    method: 'GET',
    // mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .catch(err => err.message);
};

/**
 * Fetch DuckDuckGo #BrowserWay
 *
 * @param {string} text
 * @returns {Promise} Phrases
 * @throws {string} Error msg
 */
export const sendMessage = async (text: string): Promise<Phrases> => {
  return new Promise((resolve, reject) => {
    const browserInstance = getBrowserInstance();

    browserInstance.runtime.sendMessage({ query: encodeURIComponent(text) }, (message: Message<Phrases>) => {
      if (message.status === 'fulfilled') {
        resolve(message.value);
      }

      if (message.status === 'rejected') {
        reject(message.reason);
      }
    });
  });
};

export const askDuckDuckGo = async (query: string): Promise<Phrases> => {
  const mode = import.meta.env['MODE'];
  return mode === 'production' ? sendMessage(query) : fetchDuckDuckGo(query);
};
