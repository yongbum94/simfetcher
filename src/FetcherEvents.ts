import { FetcherConfig } from './Fetcher';

export type FetchRequsetIntercept<T extends FetcherConfig> = (config: T) => T;
export type FetchResponseIntercept = (response: any) => Promise<any>;
export class FetcherEvents<T extends FetcherConfig> {
  public readonly request: FetchRequsetIntercept<T>[] = [];
  public readonly response: FetchResponseIntercept[] = [];

  on(event: 'request', listener: FetchRequsetIntercept<T>): void;
  on(event: 'response', listener: FetchResponseIntercept): void;
  on(event: 'request' | 'response', listener: any) {
    this[event].push(listener);
  }

  off(event: 'request' | 'response', listener: any) {
    const idx = this[event].indexOf(listener);
    if (idx > -1) this[event].splice(idx, 1);
  }
}
