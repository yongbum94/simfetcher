# simfetcher

`fetch`를 베이스로 사용합니다.

서버별로 제공되는 REST API 서비스를 공통적인 처리를 위해 구성하는 과정은 괴롭습니다.

해당 과정을 좀 더 쉽게 할 수 있도록 아래의 기능을 제공합니다.

1.  `fetch` 요청 및 응답에 대한 `intercept` 이벤트를 제공합니다.
2.  URI 별 요청 상태와 상태 설정값, 변경 이벤트를 세팅할 수 있습니다.

기존의 `fetch` 옵션을 대부분 그대로 사용합니다.

폴리필을 포함하며 `nodejs` & `browser` 환경을 지원합니다.

## Installation

```bash
npm i simfetcher
```

## Usage

```ts
import simfetcher from 'simfetcher';
// create fetcher
const fetcher = simfetcher({
  baseUrl: '/v1/api',
  headers: { 'content-type': 'application/json' },
});

// intercept request
fetcher.on('request', (config) => {
  config.headers['Authorization'] = localStorage.getItem('accessToken');
  return config;
});

// intercept response
fetcher.on('response', (res) => {
  if (!res.ok) {
    return Promise.reject(res);
  }

  if (res.headers['content-type'] === 'application/json') {
    return new Promise((resolve) => {
      res.json().then((body) => {
        resolve(body);
      });
    });
  }

  return Promise.resolve({});
});

const { provider, request, onChange } = fetcher.create<{
  id: string;
  title: string;
  content: string;
}>(
  '/boards/:id',
  { id: '', title: '', content: '' },
  {
    method: 'GET',
  },
);

onChange((provider) => {
  // provider.status 가 변경될때마다 호출
  if (provider.status === 'pending') {
    // 대기 상태에 대한 처리
  } else if (provider.status === 'success') {
    // 요청 성공시에 대한 처리
  } else if (provider.status === 'error') {
    // 요청이 실패된 경우에 대한 처리
  }
});

request({ params: { id: 1 } })
  .then((res) => {
    // resolve
  })
  .catch((error) => {
    // reject
  });
```

```ts
// none detect simple request
const { request } = fetcher.create('/boards/:id', {}, {});

export function deleteBoard(id: string | number) {
  return request({ params: { id }, method: 'DELETE' });
}

deleteBoard(1).then((res) => {
  //done!
});
```

## License

[MIT](LICENSE) @yongbum94

## Reference

[cross-fetch](https://github.com/lquixada/cross-fetch)
