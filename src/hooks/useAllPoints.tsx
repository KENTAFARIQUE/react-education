import { useState, useEffect } from 'react';
import { carApi } from '../services/Api';
import type { PointAttrs, GeoResponse } from '../types/geo';

export function useAllPoints() {
  const [points, setPoints] = useState<PointAttrs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchPoints = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await carApi.getAllPoints();
        const pointList = Array.isArray(response)
          ? response
          : (response as GeoResponse<PointAttrs>).data || [];

        if (!cancelled) {
          setPoints(pointList);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err.message || 'Произошла ошибка при загрузке пунктов выдачи'
          );
          setPoints([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPoints();

    return () => {
      cancelled = true;
    };
  }, []);

  return { points, loading, error, setPoints };
}
