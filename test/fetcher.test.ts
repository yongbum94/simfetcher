import './setup';
import 'cross-fetch';

import { Fetcher, FetcherConfig, FetcherStateProvider, simfetcher } from '../src';
import { FetcherEvents } from '../src/FetcherEvents';
/**
 * @jest-environment jsdom
 */

interface User {
  id: string;
  firstName: string;
  lastName: string;
}
describe('simfetcher', () => {
  let fetcher: Fetcher, provider: any, request: any, onChange: any, events: FetcherEvents;

  beforeAll(() => {
    fetcher = simfetcher({
      baseUrl: 'https://example.com',
      headers: { 'content-type': 'application/json' },
    });

    fetcher.on('response', (res) => {
      if (!res.ok) {
        return Promise.reject(res);
      }

      if (res.headers.get('content-type') === 'application/json') {
        return new Promise((resolve) => {
          res.json().then((body) => {
            resolve(body);
          });
        });
      }

      return Promise.resolve(res);
    });

    const service = fetcher.create<User>(
      '/user',
      { id: '', firstName: '', lastName: '' },
      {
        method: 'GET',
      },
    );
    provider = service.provider;
    request = service.request;
    onChange = service.onChange;
    events = service.events;
  });

  describe('Fetcher', () => {
    it('Should Intercept Request', async () => {
      const mockFn = jest.fn();
      const mockFn2 = jest.fn();
      const mockFn3 = jest.fn();

      fetcher.on('request', (config) => {
        mockFn();
        return config;
      });

      const onRequset = (config: FetcherConfig) => {
        mockFn2();
        return config;
      };

      fetcher.on('request', onRequset);

      fetcher.on('request', (config) => {
        mockFn3();
        return config;
      });
      fetcher.off('request', onRequset);

      await request();

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn2).toHaveBeenCalledTimes(0);
      expect(mockFn3).toHaveBeenCalledTimes(1);
    });

    it('Should Intercept Response', async () => {
      const mockFn = jest.fn();
      const mockFn2 = jest.fn();
      const mockFn3 = jest.fn();

      fetcher.on('response', (res) => {
        mockFn();
        return Promise.resolve(res);
      });

      const onResponse = (res: Response) => {
        mockFn2();
        return Promise.resolve(res);
      };

      fetcher.on('response', onResponse);
      fetcher.on('response', (res) => {
        mockFn3();
        return Promise.resolve(res);
      });
      fetcher.off('response', onResponse);

      await request();

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn2).toHaveBeenCalledTimes(0);
      expect(mockFn3).toHaveBeenCalledTimes(1);
    });
  });

  describe('Fetcher Services', () => {
    describe('request', () => {
      it('url params tarnsform', async () => {
        const { request } = fetcher.create('/params/:parent/:id', {}, {});
        const body = await request({ params: { parent: 5, id: 1 } });

        expect(body).toEqual({ parent: '5', id: '1' });
      });
    });

    describe('onChange', () => {
      it('fire onChange event', async () => {
        const pendingMock = jest.fn();
        const successMock = jest.fn();
        const errorMock = jest.fn();
        const unknownMock = jest.fn();
        const { request, onChange } = fetcher.create('/user', {}, {});

        onChange((provider) => {
          if (provider.status === 'pending') pendingMock();
          else if (provider.status === 'success') successMock();
          else if (provider.status === 'error') errorMock();
          else unknownMock();
        });

        onChange((provider) => {
          if (provider.status === 'pending') pendingMock();
          else if (provider.status === 'success') successMock();
          else if (provider.status === 'error') errorMock();
          else unknownMock();
        });

        await request();

        expect(pendingMock).toHaveBeenCalledTimes(2);
        expect(successMock).toHaveBeenCalledTimes(2);
        expect(errorMock).toHaveBeenCalledTimes(0);
        expect(unknownMock).toHaveBeenCalledTimes(0);
      });
    });

    describe('provider', () => {
      it('provide status, value', async () => {
        const { request, onChange, provider } = fetcher.create('/user', {}, { method: 'GET' });

        let pending, success;
        onChange(() => {
          if (provider.status === 'pending') pending = provider.value;
          if (provider.status === 'success') success = provider.value;
        });

        await request();

        expect(pending).toEqual({});
        expect(success).toEqual({ id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d', firstName: 'John', lastName: 'Maverick' });
      });

      it('provide status, error', async () => {
        const mockFn = jest.fn();
        const { request, onChange, provider } = fetcher.create('/error', {}, { method: 'GET' });
        let pending,
          error = {} as any;
        onChange(() => {
          if (provider.status === 'pending') pending = provider.value;
          if (provider.status === 'error') error = provider.error.status;
        });

        try {
          await request();
        } catch (e) {
          mockFn();
        }

        expect(pending).toEqual({});
        expect(mockFn).toHaveBeenCalled();
        expect(error).toEqual(500);
      });
    });

    describe('events', () => {
      it('Should Intercept Request', async () => {
        const mockFn = jest.fn();
        const mockFn2 = jest.fn();
        const mockFn3 = jest.fn();

        events.on('request', (config) => {
          mockFn();
          return config;
        });

        const onRequset = (config: FetcherConfig) => {
          mockFn2();
          return config;
        };

        events.on('request', onRequset);

        events.on('request', (config) => {
          mockFn3();
          return config;
        });
        events.off('request', onRequset);

        await request();

        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn2).toHaveBeenCalledTimes(0);
        expect(mockFn3).toHaveBeenCalledTimes(1);
      });

      it('Should Intercept Response', async () => {
        const mockFn = jest.fn();
        const mockFn2 = jest.fn();
        const mockFn3 = jest.fn();

        events.on('response', (res) => {
          mockFn();
          return Promise.resolve(res);
        });

        const onResponse = (res: Response) => {
          mockFn2();
          return Promise.resolve(res);
        };

        events.on('response', onResponse);
        events.on('response', (res) => {
          mockFn3();
          return Promise.resolve(res);
        });
        events.off('response', onResponse);

        await request();

        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn2).toHaveBeenCalledTimes(0);
        expect(mockFn3).toHaveBeenCalledTimes(1);
      });
    });
  });
});
