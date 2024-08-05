# simfetch

simplify use fetch api

## Installation

```bash
npm i simfetch
```

## Usage

```ts
simfetch
  .create()
  .header('Accept', '*')
  .header('Content-Type', 'application/json')
  .auth('Bearer ...') // Authorization Header
  .cookie('key', 'value') // cookie key, value
  .query({ cate: 'book' })
  .query({ page: 5 })
  .get<Response<Boards>>('/boards')
  .then((res) => {
    if (res.ok) {
      console.log(res.jsonbody); // safejsonbody
    }
  })
  .catch((err) => {
    console.error(err);
  });
```

```ts
simfetch
  .create({ base: '/v1/api' })
  .set('Content-Type', 'application/json')
  .body({ title: '', content: '' })
  .post('/board')
  .then((res) => {})
  .catch((err) => {
    console.error(err);
  });
```

```ts
// prettier-ignore
const myfetch = () => 
  simfetch
    .create({ base: '/v1/api' })
    .accept('*')
    .set('Content-Type', 'application/json')
    .auth(localstorage.get('accessToken'));

// usage simply
// prettier-ignore
myfetch()
  .get<Response<Boards>>('/boards')
  .then((res) => {
    console.log(res.jsonbody); // json body parse
  })
```

## simfetch API

**create()**

```js
import { create } from 'simfetch';
const request = create(); // create Request Instance
```

### Instance method

**_METHOD_**

Return Fetch Promise..

**request.get([url, [query]])**

**request.post([url, [body]])**

**request.put([url, [body]])**

**request.patch([url, [body]])**

**request.delete([url, [config]])**

**_CONFIG_**

Return Request Instance

**request.base(url)**

**request.url(url)**

**request.header(key, value)**

**request.headers({...key: value})**

**request.headers(...[key, value][])**

**request.auth(value[, key="Authorization"])**

**request.cache(mode)**

"default"(default) | "force-cache" | "no-cache" | "no-store" | "only-if-cached" | "reload"

**request.keepalive(boolean)**

**request.cookie(key, value)**

HTTP header Cookie set, only append

**request.credentials(mode|boolean)**

"include" | "omit" | "same-origin"(default)

**request.query(key, value)**

**request.query({...key, value})**

**request.body(XMLHttpRequestBodyInit)**

`Blob` | `BufferSource` | `FormData` | `URLSearchParams` | `string`

## License

[MIT](LICENSE) @yongbum94
