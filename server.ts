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

const SAFE_SEARCH = 'https://safe.duckduckgo.com/';

const API = {
  AUTOCOMPLETE: '/autocomplete',
  REDIRECT: '/redirect'
};

// ? Enum ?
const REQUEST_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS'
};

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
        'Access-Control-Allow-Headers': 'Authorization, Content-Type'
      });
    }

    return new Headers();
  }

  getHandler() {
    const headers = this.getHeaders();

    return async (req: Request) => {
      const url = new URL(req.url);

      /**
       * [GET] /autocomplete
       * Route to get autocomplete phrases from query
       * @returns "{ url, status: 'fulfilled', value }" || "{ url, status: 'rejected', reason }"
       */
      if (url.pathname === API.AUTOCOMPLETE && REQUEST_METHOD.GET) {
        const searchParams = new URLSearchParams(url.search);
        const query = searchParams.get('query');

        try {
          const data = await fetch(`${SAFE_SEARCH}/ac/?q=${query}`, {
            method: 'GET',
            // mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(response => response.json());

          return new Response(JSON.stringify(data), {
            headers
          });
        } catch (err) {
          return new Response(JSON.stringify(err), {
            status: 500,
            headers
          });
        }
      }

      /**
       * [POST] /redirect
       * Route to get the redirect URL from query
       * @returns '{ url }'
       */
      if (url.pathname === API.REDIRECT && req.method === REQUEST_METHOD.GET) {
        const searchParams = new URLSearchParams(url.search);
        const query = searchParams.get('query');

        return new Response(JSON.stringify({ url: `${SAFE_SEARCH}/?q=${query}` }), {
          headers
        });
      }

      if (this.cors && req.method === REQUEST_METHOD.OPTIONS) {
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
