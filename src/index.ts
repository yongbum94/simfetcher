import { Fetcher } from './Fetcher';
import { FetcherEvents } from './FetcherEvents';
import type { FetcherConfig } from './Fetcher';
export type { Fetcher, FetcherConfig, FetchOnChangeEvent } from './Fetcher';
export type { FetcherError, FetcherState, FetcherStateProvider, FetcherStatus, FetcherStore } from './FetcherStore';
export type { FetcherEvents, FetchRequsetIntercept, FetchResponseIntercept } from './FetcherEvents';

/**
 * Create Fetcher instance
 * @param config
 * @returns {Fetcher}
 */
export function simfetcher<T extends FetcherConfig = FetcherConfig>(config: T & FetcherConfig) {
  return new Fetcher<T & FetcherConfig>(config, new FetcherEvents<T & FetcherConfig>());
}

export default simfetcher;
