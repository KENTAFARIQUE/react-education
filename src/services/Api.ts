const API_BASE_URL = import.meta.env.VITE_CARAPI_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_CARAPI_BASE_URL is not defined');
}

async function fetchApi(endpoint: string, options?: RequestInit) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      ...options,
    }
  );

  if (!response.ok) {
    const errorMessages: Record<number, string> = {
      400: 'Неверный запрос. Проверьте параметры.',
      403: 'Доступ запрещен. Проверьте API ключ.',
      404: 'Ресурс не найден. Проверьте endpoint.',
      429: 'Слишком много запросов. Подождите минуту.',
    };

    const errorMessage =
      errorMessages[response.status] ||
      (response.status >= 500
        ? 'Ошибка сервера. Попробуйте позже.'
        : `HTTP ${response.status}`);

    throw new Error(errorMessage);
  }

  return response.json();
}

export interface OrderAttrs {
  id: number;
  orderStatus_id: number;
  city_id: number;
  point_id: number;
  car_id: number;
  rate_id: number;
  color: string;
  dateFrom: number;
  dateTo: number;
  price: number;
  isFullTank: boolean;
  isNeedChildChair: boolean;
  isRightWheel: boolean;
}

export const carApi = {
  get: (
    resource: string,
    id?: string | number,
    relation?: string
  ) =>
    fetchApi(
      `/${resource}${id ? `/${id}` : ''}${relation ? `/${relation}` : ''}`
    ),

  getAllCars: () => carApi.get('car'),

  getAllCities: () => carApi.get('city'),

  getAllPoints: () => carApi.get('point'),

  createOrder: (order: OrderAttrs) =>
    fetchApi('/order', {
      method: 'POST',
      body: JSON.stringify(order),
    }),
};
