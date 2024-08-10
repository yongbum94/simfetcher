// fetch ponyfill
// support  cross nodejs & browser platform ..
import fetch from 'cross-fetch';

import { clone, merge } from './utils';
import { FetcherState, FetcherStateProvider, FetcherStore } from './FetcherStore';
import { FetcherEvents } from './FetcherEvents';

export interface FetcherConfig extends RequestInit {
  baseUrl?: string;
  params?: Record<string, any>;
}

export type FetchRequsetIntercept = (config: FetcherConfig) => FetcherConfig;
export type FetchResponseIntercept = (response: Response) => Promise<any & Response>;
// export interface FetcherEvents {
//   request: FetchRequsetIntercept[];
//   response: FetchResponseIntercept[];
// }
export type FetchOnChangeEvent<T> = (provider: FetcherStateProvider<T>) => void;

export class Fetcher {
  constructor(
    public readonly config: FetcherConfig = {},
    public readonly events: FetcherEvents,
  ) {}

  get on() {
    return this.events.on.bind(this.events);
  }

  get off() {
    return this.events.off.bind(this.events);
  }

  create<T>(url: string, defaultValue: T, config: FetcherConfig = {}) {
    const store = new FetcherStore<T>(defaultValue);
    const provider = new FetcherStateProvider<T>(store);
    return this._createRequest<T>({ url, store, provider, config });
  }

  private _createRequest<T>({ url, store, config, provider }: { url: string; store: FetcherStore<T>; provider: FetcherStateProvider<T>; config: FetcherConfig }) {
    const _requestEvents: FetcherEvents = new FetcherEvents();

    const fetcher = this;

    const _onChangeEvents: FetchOnChangeEvent<T>[] = [];
    const _fireOnChangeEvents = (state: Partial<FetcherState<T>>) => {
      store.setState({ ...store.state, ...state });
      _onChangeEvents.forEach((listener) => listener(provider));
    };

    const _transferUrl = (url: string, params: Record<string, any>) => {
      const reg = /:[^\s/]+/;
      const matcher = url.match(reg);
      if (!matcher) return url;
      const key = matcher[0].substring(1);
      const _url = url.replace(matcher[0], params[key] || '');
      return _transferUrl(_url, params);
    };

    const onChange = (listener: FetchOnChangeEvent<T>) => {
      _onChangeEvents.push(listener);
    };

    const request = function request(requestConfig: FetcherConfig = {}) {
      const _requsetConfig = merge<FetcherConfig>(merge(clone(fetcher.config), clone(config)), clone(requestConfig));
      const _config = fetcher.events.request.concat(_requestEvents.request).reduce((acc, listener) => listener(acc), _requsetConfig);

      let res;

      try {
        res = fetch(_config.baseUrl + _transferUrl(url, _config.params || {}), _config);
      } catch (e) {
        return Promise.reject(e);
      }

      _fireOnChangeEvents({ status: 'pending', error: null });

      return new Promise<T>((resolve, reject) => {
        const _res = fetcher.events.response.concat(_requestEvents.response).reduce((acc, listener) => acc.then((__res) => listener(__res)), res);
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

    return { request, onChange, provider, events: _requestEvents };
  }
}
