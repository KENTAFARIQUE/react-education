import { useState, useEffect } from 'react';
import { carApi } from '../services/Api';
import type { PointAttrs, GeoResponse } from '../types/geo';

export function useCityPoints(cityId: number | null) {
  const [allPoints, setAllPoints] = useState<PointAttrs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchPoints = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await carApi.getAllPoints();
        const pointList = Array.isArray(response) ? response : (response as GeoResponse<PointAttrs>).data || [];

        if (!cancelled) {
          setAllPoints(pointList);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err.message || 'Произошла ошибка при загрузке точек выдачи'
          );
          setAllPoints([]);
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

  const points = cityId === null
    ? []
    : allPoints.filter((p) => p.cityId.id === cityId);

  return { points, loading, error };
}
