import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Custom hook to execute async service calls and manage Loading, Error, and Data states.
 * Supports reload and pull-to-refresh.
 */
export function useAsyncData(fetcher) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  // Initial fetch on mount
  useEffect(() => {
    let ignore = false;
    fetcherRef.current()
      .then((result) => {
        if (!ignore) {
          setData(result);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || 'Terjadi kesalahan saat memuat data.');
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    fetcherRef.current()
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Terjadi kesalahan saat memuat data.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetcherRef.current()
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Terjadi kesalahan saat memuat data.');
      })
      .finally(() => {
        setRefreshing(false);
      });
  }, []);

  return {
    data,
    loading,
    error,
    refreshing,
    reload,
    refresh,
    setData,
  };
}
