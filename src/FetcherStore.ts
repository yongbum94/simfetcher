import { clone } from './utils';

export type FetcherStatus = 'pending' | 'success' | 'error';
export type FetcherError = Error | any;

export interface FetcherState<T> {
  value: T;
  status: FetcherStatus;
  error: FetcherError | null;
}

export class FetcherStore<T> {
  private _state: FetcherState<T>;
  constructor(value: T, status: FetcherStatus = 'pending', error: FetcherError | null = null) {
    this._state = { value, status, error };
  }

  get state() {
    return this._state;
  }

  public setState(state: FetcherState<T>) {
    this._state = state;
  }
}

export class FetcherStateProvider<T> {
  constructor(private store: FetcherStore<T>) {}

  private get state() {
    return this.store.state;
  }

  get status() {
    return this.state.status;
  }

  get value() {
    return this.state.value;
  }

  get error() {
    return this.state.error;
  }

  force(value: FetcherState<T>) {
    this.store.setState(value);
  }
}
