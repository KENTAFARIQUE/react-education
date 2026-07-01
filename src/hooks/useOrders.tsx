import { useState, useEffect, useCallback } from 'react';
import { carApi } from '../services/Api';
import type { ApiOrder } from '../services/Api';
import type { SavedOrder } from '../store/orderStore';

type OrdersResponse = {
  data: ApiOrder[];
  count: number;
};

function mapApiOrderToSavedOrder(apiOrder: ApiOrder): SavedOrder {
  return {
    id: apiOrder.id,
    carName: apiOrder.carId?.name || '',
    cityName: apiOrder.cityId?.name || '',
    pointName: apiOrder.pointId?.name || '',
    rateName: apiOrder.rateId?.name || '',
    orderStatus_id: apiOrder.orderStatusId?.id ?? 1,
    city_id: apiOrder.cityId?.id ?? 0,
    point_id: apiOrder.pointId?.id ?? 0,
    car_id: apiOrder.carId?.id ?? 0,
    rate_id: apiOrder.rateId?.id ?? 0,
    color: apiOrder.color,
    dateFrom: apiOrder.dateFrom,
    dateTo: apiOrder.dateTo,
    price: apiOrder.price,
    isFullTank: apiOrder.isFullTank,
    isNeedChildChair: apiOrder.isNeedChildChair,
    isRightWheel: apiOrder.isRightWheel,
    carThumbnail: apiOrder.carId?.thumbnail?.path || '',
    createdAt: apiOrder.createdAt,
  };
}

export function useOrders() {
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);

      const response: OrdersResponse = await carApi.getAllOrders(signal);
      setOrders((response.data || []).map(mapApiOrderToSavedOrder));
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;

      setError(
        err instanceof Error ? err.message : 'Произошла ошибка при загрузке заказов'
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchOrders(abortController.signal);
    return () => abortController.abort();
  }, [fetchOrders]);

  return { orders, loading, error, setOrders, refetch: (signal?: AbortSignal) => fetchOrders(signal) };
}
