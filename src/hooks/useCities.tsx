import { useState, useEffect } from 'react';
import { carApi } from '../services/Api';
import type { CityAttrs, GeoResponse } from '../types/geo';

export function useCities() {
  const [cities, setCities] = useState<CityAttrs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchCities = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: GeoResponse<CityAttrs> = await carApi.getAllCities();

        if (!cancelled) {
          setCities(response.data || []);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err.message || 'Произошла ошибка при загрузке городов'
          );
          setCities([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCities();

    return () => {
      cancelled = true;
    };
  }, []);

  return { cities, loading, error };
}
