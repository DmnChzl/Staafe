import { parse } from 'flags/mod.ts';
import { serve } from 'http/server.ts';

const ASCII = `
 _     _             _ _        _                     _            _
(_)   | |           ( ) |      (_)                   | |          | |
 _  __| | ___  _ __ |/| |_ __ _ ___   _____  __ _  __| |_   _  ___| | __
| |/ _\` |/ _ \\| '_ \\  | __/ _\` | \\ \\ / / _ \\/ _\` |/ _\` | | | |/ __| |/ /
| | (_| | (_) | | | | | || (_| | |\\ V /  __/ (_| | (_| | |_| | (__|   <
|_|\\__,_|\\___/|_| |_|  \\__\\__, |_| \\_/ \\___|\\__,_|\\__,_|\\__,_|\\___|_|\\_\\
                           __/ |
                          |___/
`;

const SEARCH_ENGINE = {
  DDG: 'https://safe.duckduckgo.com',
  ECO: 'https://ac.ecosia.org'
};

const api: Record<string, Record<string, (query: string) => string>> = {
  autocomplete: {
    ddg: (query: string) => `${SEARCH_ENGINE.DDG}/ac/?q=${query}`,
    eco: (query: string) => `${SEARCH_ENGINE.ECO}/?q=${query}`
  }
};

enum RequestMethod {
  Post = 'POST',
  Get = 'GET',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
  Options = 'OPTIONS'
}

type DuckDuckGoResult = Array<{ phrase: string }>;

interface EcosiaResult {
  query: string;
  suggestions: string[];
}

const isDuckDuckGo = (provider: string) => ['duckduckgo', 'ddg'].includes(provider);
const isEcosia = (provider: string) => ['ecosia', 'eco'].includes(provider);

class Server {
  host: string;
  port: number;
  cors: boolean;

  constructor(host = '127.0.0.1', port = 1271, cors = false) {
    this.host = host;
    this.port = port;
    this.cors = cors;
  }

  getHeaders() {
    if (this.cors) {
      return new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
    }

    return new Headers();
  }

  getHandler() {
    const headers = this.getHeaders();

    return async (req: Request) => {
      const url = new URL(req.url);

      /**
       * [GET] AutoComplete 'phrases' / 'suggestions' From 'provider' / 'query'
       *
       * @returns "{ url, status: 'fulfilled', value }" || "{ url, status: 'rejected', reason }"
       */
      if (url.pathname === '/autocomplete' && RequestMethod.Get) {
        const searchParams = new URLSearchParams(url.search);
        const provider = searchParams.get('provider');
        const query = searchParams.get('query');

        if (!!provider) {
          if (isDuckDuckGo(provider)) {
            try {
              const data = await fetch(api.autocomplete.ddg(query), {
                method: 'GET',
                // mode: 'no-cors',
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(response => response.json())
                .then((data: DuckDuckGoResult) => data.map(({ phrase }) => phrase));

              return new Response(JSON.stringify(data), { status: 200, headers });
            } catch (err) {
              return new Response(JSON.stringify(err), {
                status: 500,
                headers
              });
            }
          }

          if (isEcosia(provider)) {
            try {
              const data = await fetch(api.autocomplete.eco(query), {
                method: 'GET',
                // mode: 'no-cors',
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(response => response.json())
                .then((data: EcosiaResult) => data.suggestions);

              return new Response(JSON.stringify(data), { headers });
            } catch (err) {
              return new Response(JSON.stringify(err), {
                status: 500,
                headers
              });
            }
          }

          return new Response(JSON.stringify({ message: 'Unknown Provider' }), { status: 400, headers });
        }

        return new Response(JSON.stringify({ message: 'No Provider' }), { status: 400, headers });
      }

      if (this.cors && req.method === RequestMethod.Options) {
        // ? Header: Content-Length '0'
        return new Response(null, {
          status: 204,
          headers
        });
      }

      return new Response(ASCII);
    };
  }

  listen() {
    const { host, port } = this;
    const handler = this.getHandler();

    serve(handler, {
      hostname: host,
      port,
      onListen() {
        console.log(ASCII);
      }
    });
  }
}

const parsedArgs = parse(Deno.args);

const HOST = parsedArgs.host || '127.0.0.1';
const PORT = +parsedArgs.port || 1271;
const CORS = Boolean(parsedArgs.cors) || false;

const server = new Server(HOST, PORT, CORS);
server.listen();
