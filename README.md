# simfetch

simplify use fetch api

## Installation

```bash
npm i simfetch
```

## Usage

```ts
simfetch
  .get('/boards')
  .set('Accept', '*')
  .set('Content-Type', 'application/json')
  .auth('Bearer ...') // Authorization Header
  .cookie('key', 'value') // cookie key, value
  .query({ cate: 'book' })
  .query({ page: 5 })
  .call()
  .then((res) => {})
  .catch((err) => {
    console.error(err);
  });
```

```ts
simfetch
  .create({ base: '/v1/api' })
  .set('Content-Type', 'application/json')
  .post('/board')
  .body({ title: '', content: '' })
  .call()
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
  .get('/boards')
  .call<Response<Boards>>()
  .then((res) => {
    console.log(res.jsonbody); // json body parse
  })
```
