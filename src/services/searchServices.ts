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
 * Fetch DuckDuckGo #ProxyWay
 *
 * @param {string} query
 * @returns {Promise} Phrases
 * @throws {string} Error msg
 */
export const fetchDDG = async <T>(query: string): Promise<T> => {
  return fetch(`http://localhost:1234/ddg/ac/?q=${encodeURIComponent(query)}`, {
    method: 'GET',
    // mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then((data: T) => data)
    .catch(err => err.message);
};

/**
 * Fetch DuckDuckGo #BrowserWay
 *
 * @param {string} query
 * @returns {Promise} Phrases
 * @throws {string} Error msg
 */
export const ddgMessage = async <T>(query: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    const browserInstance = getBrowserInstance();

    browserInstance.runtime.sendMessage({ query: encodeURIComponent(query) }, (message: Message<T>) => {
      if (message.status === 'fulfilled') {
        resolve(message.value);
      }

      if (message.status === 'rejected') {
        reject(message.reason);
      }
    });
  });
};

// prettier-ignore
export const askDuckDuckGo = async <T>(query: string): Promise<T> => {
  const mode = import.meta.env['MODE'];
  return mode === 'production' ? ddgMessage<T>(query) : fetchDDG<T>(query);
}
