'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { LoadState } from '@/lib/types';

export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: unknown[],
  options?: { enabled?: boolean }
): LoadState<T> & { refetch: () => void } {
  const [state, setState] = useState<LoadState<T>>({ status: 'loading' });
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const enabled = options?.enabled ?? true;

  const run = useCallback(() => {
    if (!enabled) return;
    setState({ status: 'loading' });
    fetcherRef.current()
      .then((data) => setState({ status: 'success', data }))
      .catch((err: Error) =>
        setState({ status: 'error', message: err.message })
      );
  }, [...deps, enabled]);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, refetch: run };
}
