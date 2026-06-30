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
  getCar: (id: number) => carApi.get('car', id),

  createCar: (data: Record<string, unknown>) =>
    fetchApi('/car', { method: 'POST', body: JSON.stringify(data) }),

  updateCar: (id: number, data: Record<string, unknown>) =>
    fetchApi(`/car/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteCar: (id: number) =>
    fetchApi(`/car/${id}`, { method: 'DELETE' }),

  getAllCities: () => carApi.get('city'),

  getAllPoints: () => carApi.get('point'),
  getPoint: (id: number) => carApi.get('point', id),

  createPoint: (data: Record<string, unknown>) =>
    fetchApi('/point', { method: 'POST', body: JSON.stringify(data) }),

  updatePoint: (id: number, data: Record<string, unknown>) =>
    fetchApi(`/point/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deletePoint: (id: number) =>
    fetchApi(`/point/${id}`, { method: 'DELETE' }),

  createOrder: (order: OrderAttrs) =>
    fetchApi('/order', {
      method: 'POST',
      body: JSON.stringify(order),
    }),
};
