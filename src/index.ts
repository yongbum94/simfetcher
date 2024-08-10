import { Fetcher } from './Fetcher';
import type { FetcherConfig } from './Fetcher';

export type { FetchConfig, FetchOnChangeEvent, FetchRequsetIntercept, FetchResponseIntercept, FetcherConfig, FetcherEvents } from './Fetcher';
export type { FetcherError, FetcherState, FetcherStateProvider, FetcherStatus, FetcherStore } from './FetcherStore';

/**
 * Create Fetcher instance
 * @param config
 * @returns {Fetcher}
 */
export function simfetch(config: FetcherConfig = {}) {
  return new Fetcher(config);
}

export default simfetch;
