import './setup';
import simfetch, { Request } from '../src/index';

describe('sim-fetch', () => {
  it('response has jsonbody', async () => {
    const res = await simfetch.get('https://example.com/user');
    expect(res.jsonbody).toEqual({
      id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
      firstName: 'John',
      lastName: 'Maverick',
    });
  });

  it('response always has jsonbody', async () => {
    const res = await simfetch.get('https://example.com/error');
    expect(res.status).toBe(500);
    expect(res.jsonbody).toEqual({});
  });

  it('header() must set http header', () => {
    const request = simfetch.create().header('X-Header', 'HelloWorld');
    expect(request._header['X-Header']).toEqual('HelloWorld');
  });

  it('create() return Request Instance', () => {
    const request = simfetch.create();
    expect(request).toBeInstanceOf(Request);
  });

  it('BaseRequest methods always return Request Instnace', () => {
    const request = simfetch.create();
    expect(request.base('https://example.com')).toBeInstanceOf(Request);
    expect(request.url('/user')).toBeInstanceOf(Request);
    expect(request.header('key', 'value')).toBeInstanceOf(Request);
    expect(request.headers({ key2: 'value' })).toBeInstanceOf(Request);
    expect(request.cache('default')).toBeInstanceOf(Request);
    expect(request.keepalive(true)).toBeInstanceOf(Request);
    expect(request.cookie('key', 'value')).toBeInstanceOf(Request);
    expect(request.query('key', 'value')).toBeInstanceOf(Request);
    expect(request.auth('accessToken')).toBeInstanceOf(Request);
    expect(request.body('{}')).toBeInstanceOf(Request);
  });
});
