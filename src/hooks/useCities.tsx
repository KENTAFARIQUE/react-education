import { useState, useEffect } from 'react';
import { carApi } from '../services/Api';
import type { CityAttrs, GeoResponse } from '../types/geo';

export function useCities() {
  const [cities, setCities] = useState<CityAttrs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchCities = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: GeoResponse<CityAttrs> = await carApi.getAllCities(abortController.signal);

        setCities(response.data || []);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;

        setError(
          err instanceof Error ? err.message : 'Произошла ошибка при загрузке городов'
        );
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();

    return () => abortController.abort();
  }, []);

  return { cities, loading, error };
}
