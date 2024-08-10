# simfetch

simplify use fetch api

## Installation

```bash
npm i simfetch
```

## Usage

```ts
const fetcher = simfetch({
  base: '/v1/api',
  header: { 'content-type': 'application/json' },
});

fetcher.on('request', (req) => {
  return req;
});
fetcher.on('response', (res) => {
  if (res.statusCode !== 200) {
    return Promise.reject();
  }
  return Promise.resolve(res);
});

const { provider, request, onChange } = fetcher.create(
  '/boards/:id',
  {} /* defaultValue */,
  {
    // somthing..
  } /* Default Request Config */,
);

onChange((provider) => {
  // provider.status 가 변경될때마다 호출
});

request({} /*Request Config*/).then(() => {}) /* return promise..*/;
```

## License

[MIT](LICENSE) @yongbum94

## Reference

[cross-fetch](https://github.com/lquixada/cross-fetch)
