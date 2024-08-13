import { clone, merge, transferUrl } from './utils';
import { FetcherState, FetcherStateProvider, FetcherStore } from './FetcherStore';
import { FetcherEvents } from './FetcherEvents';

export interface FetcherConfig extends RequestInit {
  baseUrl?: string;
  params?: Record<string, any>;
}

export type FetchOnChangeEvent<T> = (provider: FetcherStateProvider<T>) => void;

export class Fetcher<T extends FetcherConfig> {
  constructor(
    public readonly config: T,
    public readonly events: FetcherEvents<T>,
  ) {}

  get on() {
    return this.events.on.bind(this.events);
  }

  get off() {
    return this.events.off.bind(this.events);
  }

  create<R = any, T1 extends T = T>(url: string, defaultValue: R, config: FetcherConfig = {}) {
    const store = new FetcherStore<R>(defaultValue);
    const provider = new FetcherStateProvider<R>(store);
    return this._createRequest<R, T1>({ url, store, provider, config });
  }

  private _createRequest<R = any, T1 extends T = T>({
    url,
    store,
    config,
    provider,
  }: {
    url: string;
    store: FetcherStore<R>;
    provider: FetcherStateProvider<R>;
    config: FetcherConfig;
  }) {
    const fetcher = this;
    const _requestEvents: FetcherEvents<T1> = new FetcherEvents();
    const _onChangeEvents: FetchOnChangeEvent<R>[] = [];
    const _fireOnChangeEvents = (state: Partial<FetcherState<R>>) => {
      store.setState({ ...store.state, ...state });
      _onChangeEvents.forEach((listener) => listener(provider));
    };
    const onChange = (listener: FetchOnChangeEvent<R>) => {
      _onChangeEvents.push(listener);
    };

    const request = function request(requestConfig: T1 = {} as T1) {
      const _requsetConfig = merge<T1>(merge(clone(fetcher.config), clone(config)), clone(requestConfig));
      const onReqeust = [...fetcher.events.request, ..._requestEvents.request];
      const _config = onReqeust.reduce((acc, listener) => listener(acc) as T1, _requsetConfig);

      let res;

      try {
        res = fetch(_config.baseUrl + transferUrl(url, _config.params || {}), _config);
      } catch (e) {
        return Promise.reject(e);
      }

      _fireOnChangeEvents({ status: 'pending', error: null });

      return new Promise<R>((resolve, reject) => {
        const onResponse = [...fetcher.events.response, ..._requestEvents.response];
        const _res = onResponse.reduce((acc, listener) => acc.then((__res) => listener(__res)), res) as Promise<R>;
        _res
          .then((__res) => {
            _fireOnChangeEvents({ status: 'success', value: __res, error: null });
            resolve(__res);
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
