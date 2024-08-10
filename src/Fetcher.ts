// fetch ponyfill
// support  cross nodejs & browser platform ..
import fetch from 'cross-fetch';

import { FetcherState, FetcherStateProvider, FetcherStore } from './FetcherStore';

export interface FetcherConfig extends RequestInit {
  baseUrl?: string;
}
export type FetchConfig = RequestInit;
export type FetchRequsetIntercept = (config: FetchConfig) => FetchConfig;
export type FetchResponseIntercept = (response: Response) => Promise<any & Response>;
export interface FetcherEvents {
  request: FetchRequsetIntercept[];
  response: FetchResponseIntercept[];
}
export type FetchOnChangeEvent<T> = (provider: FetcherStateProvider<T>) => void;

export class Fetcher {
  public readonly events: FetcherEvents = {
    request: [],
    response: [],
  };

  constructor(public readonly config: FetcherConfig = {}) {}

  on(event: 'request', listener: FetchRequsetIntercept): void;
  on(event: 'response', listener: FetchResponseIntercept): void;
  on(event: 'request' | 'response', listener: any) {
    this.events[event].push(listener);
  }

  off(event: 'request' | 'response', listener: any) {
    const idx = this.events[event].indexOf(listener);
    if (idx > -1) this.events[event].splice(idx, 1);
  }

  create<T>(url: string, defaultValue: T, config: FetchConfig = {}) {
    const store = new FetcherStore<T>(defaultValue);

    const provider = new FetcherStateProvider<T>(store);
    return this._createRequest<T>({ fetcher: this, url, store, provider, config });
  }

  private _createRequest<T>({
    fetcher,
    url,
    store,
    config,
    provider,
  }: {
    fetcher: Fetcher;
    url: string;
    store: FetcherStore<T>;
    provider: FetcherStateProvider<T>;
    config: FetchConfig;
  }) {
    // closer
    const _onChangeEvents: FetchOnChangeEvent<T>[] = [];
    const _fireOnChangeEvents = (state: Partial<FetcherState<T>>) => {
      store.setState({ ...store.state, ...state });
      _onChangeEvents.forEach((listener) => listener(provider));
    };

    const onChange = (listener: FetchOnChangeEvent<T>) => {
      _onChangeEvents.push(listener);
    };

    const fetchConfig = fetcher.config;
    const request = function request(requestConfig: FetchConfig = {}) {
      let res;

      const _config = fetcher.events.request.reduce((acc, listener) => listener(acc), { ...fetchConfig, ...requestConfig });

      try {
        res = fetch(_config.baseUrl + url, _config);
      } catch (e) {
        return Promise.reject(e);
      }

      _fireOnChangeEvents({ status: 'pending', error: null });

      return new Promise<T>((resolve, reject) => {
        const _res = fetcher.events.response.reduce((acc, listener) => {
          return acc.then((__res) => {
            return listener(__res);
          });
        }, res);

        _res
          .then((__res) => {
            _fireOnChangeEvents({ status: 'success', value: __res as T, error: null });
            resolve(__res as T);
          })
          .catch((e) => {
            _fireOnChangeEvents({ status: 'error', error: e });
            reject(e);
          });
      });
    };

    return { request, onChange, provider };
  }
}
