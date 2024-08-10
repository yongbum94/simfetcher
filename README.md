# simfetcher

fetch를 베이스로 사용합니다.
서버별로 제공되는 REST API 서비스를 공통적인 처리를 구성하는 과정은 괴롭습니다.
간단하고 깔끔하게 작성할 수 있도록 제공되는 것에 초점을 맞췄습니다.
기존의 fetch 옵션을 대부분 그대로 사용합니다.

폴리필을 포함합니다.
nodejs & browser 환경을 지원합니다.

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
    alert('fail request!');
    return Promise.reject(res);
  }

  if (res.headers['content-type'] === 'application/json') {
    return new Promise((resolve) => {
      res.json().then((body) => {
        resolve(body);
      });
    });
  }

  return Promise.resolve(res);
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

request({ params: { id: 1 } });
```

```ts
// none detect simple request
const { request } = fetcher.create('/boards/:id', {}, { method: 'DELETE' });

export function deleteBoard(id: string | number) {
  return request({ params: { id } });
}

deleteBoard(1).then((res) => {
  //done!
});
```

## License

[MIT](LICENSE) @yongbum94

## Reference

[cross-fetch](https://github.com/lquixada/cross-fetch)
