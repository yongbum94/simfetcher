import { Fetcher } from './Fetcher';
import type { FetcherConfig } from './Fetcher';

export type { Fetcher, FetcherConfig, FetchOnChangeEvent, FetchRequsetIntercept, FetchResponseIntercept, FetcherEvents } from './Fetcher';
export type { FetcherError, FetcherState, FetcherStateProvider, FetcherStatus, FetcherStore } from './FetcherStore';

/**
 * Create Fetcher instance
 * @param config
 * @returns {Fetcher}
 */
export function simfetcher(config: FetcherConfig = {}) {
  return new Fetcher(config);
}

export default simfetcher;
