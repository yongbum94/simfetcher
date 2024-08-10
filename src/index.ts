import { Fetcher } from './Fetcher';
import { FetcherEvents } from './FetcherEvents';
import type { FetcherConfig } from './Fetcher';
export type { Fetcher, FetcherConfig, FetchOnChangeEvent, FetchRequsetIntercept, FetchResponseIntercept } from './Fetcher';
export type { FetcherError, FetcherState, FetcherStateProvider, FetcherStatus, FetcherStore } from './FetcherStore';
export type { FetcherEvents } from './FetcherEvents';

/**
 * Create Fetcher instance
 * @param config
 * @returns {Fetcher}
 */
export function simfetcher(config: FetcherConfig = {}) {
  return new Fetcher(config, new FetcherEvents());
}

export default simfetcher;
