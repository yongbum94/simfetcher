import simfetcher, { FetcherConfig } from '../dist/mjs/index.js';

export class ApiError extends Error {
  constructor(response: Response) {
    super(response.statusText);
    this.name = 'ApiError';
  }
}

export interface AppResponse<T = any> {
  response?: Response;
  jsonBody: T;
}

const fetcher = simfetcher<FetcherConfig>({
  baseUrl: '/v1/api',
  headers: {
    'content-type': 'application/json',
  },
});

fetcher.on('request', (config) => {
  config.headers = {
    ...config.headers,
    Authorization: localStorage.getItem('accessToken') || '',
  };
  return config;
});

fetcher.on('response', (response: Response) => {
  if (!response.ok) {
    if (response.status >= 500) {
      alert('server error');
    } else if (response.status >= 400) {
      if (response.status === 400) {
        alert('Bad Requset');
      }
      if (response.status === 401) {
        alert('Unauthorized');
      }
      if (response.status === 403) {
        alert('forbidden');
      }
    } else throw new ApiError(response);
  }

  return new Promise<AppResponse>((resolve) => {
    if (response.headers.get('content-type') === 'application/json') {
      response.json().then((jsonBody) => {
        resolve({ response, jsonBody });
      });
    } else {
      resolve({ response, jsonBody: {} });
    }
  });
});

export default fetcher;
