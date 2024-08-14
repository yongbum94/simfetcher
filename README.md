# simfetcher

# Table of Content

- [Overview](#overview)
- [Fetures](#fetures)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Examples](#examples)
- [License](#license)

# Overview

simple library for managing REST API

# Fetures

- use native api `fetch`
- `intercept` events for `request` and `response`
- management for State based on URI.

# Installation

```bash
npm i simfetcher
```

# Quick Start

```ts
import simfetcher, { FetcherConfig } from '../dist/mjs/index.js';

class ApiError extends Error {
  constructor(response: Response) {
    super(`API ERROR [${response.status}] ${response.statusText}`);
    this.name = 'ApiError';
  }
}

interface AppResponse<T = any> {
  response?: Response;
  jsonBody: T;
}

interface AppFetcherConfig extends FetcherConfig {
  // custom config
}

const fetcher = simfetcher<AppFetcherConfig>({
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
    let message = '';
    if (response.status >= 500) {
      message = 'Server Error';
    } else if (response.status >= 400) {
      if (response.status === 400) {
        message ='Bad Requset';
      }
      if (response.status === 401) {
        message = 'Unauthorized';
      }
      if (response.status === 403) {
        message = 'Forbidden';
      }
      alert(message)
    } else {
      Promise.reject(new ApiError(response));
    }
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
interface Board {
  id: string;
  content: string;
  regDate: string;
}

const { provider, request, onChange, events } = fetcher.create<AppResponse<Board>>(
  '/boards/:id',
  { jsonBody: { id: '', title: '', content: '' } },
  {
    method: 'GET',
  },
);

// use Intercept by URI (request)
events.on('response', (response:AppResponse<Board>) => {
  return Promise.resolve(response);
});

// 1. management fetch state
onChange((provider) => {
  // onChangeServiceStatus {provider.status}
  if (provider.status === 'pending') {
    // pending..
  } else if (provider.status === 'success') {
    // success
  } else if (provider.status === 'error') {
    // error
  }
});

// 2. or use support promise..
request({ params: { id: 1 } })
  .then(({ response, jsonbody }) => {
    console.log(jsonbody)
    // resolve
    // no effect provider
  })
  .catch((error) => {
    // reject
    // no effect provider
  });
```

# API

## Make Fetcher

**default config type**

```ts
interface FetcherConfig extends RequestInit {
  baseUrl?: string;
  params?: Record<string, any>;
}

const fetcher = simfetcher(
  /* default FetcherConfig */
  {
    baseUrl: '/v1/api',
    headers: {
      'content-type': 'application/json',
    },
  },
);
```

**use custom config type**

```ts
export interface AppFetcherConfig extends FetcherConfig {
  slient: boolean;
}

const fetcher = simfetcher<AppFetcherConfig>({
  baseUrl: '/v1/api',
  headers: {
    'content-type': 'application/json',
  },
  slient: false,
});
```

### interceptor Request/Response

Events are fired sequentially.

```ts
fetcher.on('request', (config) => {
  config.headers = {
    ...config.headers,
    Authorization: localStorage.getItem('accessToken') || '',
  };
  return config; // config for fetch api
});
```

```ts
class ApiError extends Error {
  constructor(response: Response) {
    super(`API ERROR [${response.status}] ${response.statusText}`);
    this.name = 'ApiError';
  }
}

interface AppResponse<T = any> {
  response?: Response;
  jsonBody: T;
}

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
    } else {
      Promise.reject(new ApiError(response));
    }
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

fetcher.on('response', ({ jsonBody, response }: AppResponse) => {
  console.log('SUCCESS : ', jsonBody, response);
  return Promise.resolve({ jsonBody, response });
});
```

## Make FetchService by URI

### Fetcher.create

```ts
function create<RepsonseType, RequestConfig>(URI: string, defaultValue: RepsonseType, config: RequestConfig): FetcherSerivce;
```

### FetcherService

#### FetcherService.provider

**provider.status** : `pending` | `success` | `error` (default: `pending`)

**provider.error** : when status was error. it return `error` (default: `null`)

**provider.value = ResponseType** : response interceptor return value (default: `RepsonseType`)

**provider.force(state:RepsonseType)** : force update `provider.value`

**Warning**

```ts
const { status, error, value } = provider; // do not this.. can not observing
```

#### FetcherService.onChange

`provider.status` change event

ignore `provider.force`

```ts
onChange((provider) => {
  console.log(provider.staus);
});
```

#### FetcherService.events

interceptor Request/Response Events

it work after fetcher Interceptor

```ts
events.on('request', (config) => {
  return config;
});
events.on('response', (res) => {
  return Promise.resovle(res);
});
```

#### FetcherService.request

wort on `fetch`

```ts
request({ id: '1' }).then((response) => {
  // it work after all response Interceptor
});
```

# Examples

[Example Code](https://github.com/yongbum94/simfetcher/tree/main/examples)

# License

[MIT](LICENSE)
