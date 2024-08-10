import { FetcherConfig } from './Fetcher';

export type FetchRequsetIntercept = (config: FetcherConfig) => FetcherConfig;
export type FetchResponseIntercept = (response: Response) => Promise<any & Response>;
export class FetcherEvents {
  public readonly request: FetchRequsetIntercept[] = [];
  public readonly response: FetchResponseIntercept[] = [];

  constructor() {}

  on(event: 'request', listener: FetchRequsetIntercept): void;
  on(event: 'response', listener: FetchResponseIntercept): void;
  on(event: 'request' | 'response', listener: any) {
    this[event].push(listener);
  }

  off(event: 'request' | 'response', listener: any) {
    const idx = this[event].indexOf(listener);
    if (idx > -1) this[event].splice(idx, 1);
  }
}
