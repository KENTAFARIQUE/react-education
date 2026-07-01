const API_BASE_URL = import.meta.env.DEV
  ? '/api/db'
  : import.meta.env.VITE_CARAPI_BASE_URL;

const AUTH_BASE_URL = import.meta.env.DEV
  ? '/api/auth'
  : import.meta.env.VITE_AUTH_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_CARAPI_BASE_URL is not defined');
}

if (!AUTH_BASE_URL) {
  throw new Error('VITE_AUTH_BASE_URL is not defined');
}

let _token: string | null = null;

export function setToken(token: string | null) {
  _token = token;
}

export function getToken() {
  return _token;
}

async function fetchApi(endpoint: string, options?: RequestInit) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (_token) {
    headers['Authorization'] = `Bearer ${_token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: 'GET',
      headers,
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

export interface ApiOrder {
  id: number;
  orderStatusId: { id: number; name?: string };
  cityId: { id: number; name: string };
  pointId: { id: number; name: string; address?: string };
  carId: { id: number; name: string; thumbnail?: { path: string } };
  rateId: { id: number; name?: string };
  color: string;
  dateFrom: number;
  dateTo: number;
  price: number;
  isFullTank: boolean;
  isNeedChildChair: boolean;
  isRightWheel: boolean;
  createdAt: string;
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
    relation?: string,
    signal?: AbortSignal
  ) =>
    fetchApi(
      `/${resource}${id ? `/${id}` : ''}${relation ? `/${relation}` : ''}`,
      signal ? { signal } : undefined
    ),

  getAllCars: (signal?: AbortSignal) => carApi.get('car', undefined, undefined, signal),
  getCar: (id: number) => carApi.get('car', id),

  createCar: (data: Record<string, unknown>) =>
    fetchApi('/car', { method: 'POST', body: JSON.stringify(data) }),

  updateCar: (id: number, data: Record<string, unknown>) =>
    fetchApi(`/car/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteCar: (id: number) =>
    fetchApi(`/car/${id}`, { method: 'DELETE' }),

  getAllCities: (signal?: AbortSignal) => carApi.get('city', undefined, undefined, signal),

  getAllPoints: (signal?: AbortSignal) => carApi.get('point', undefined, undefined, signal),
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

  getAllOrders: (signal?: AbortSignal) => carApi.get('order', undefined, undefined, signal),
};

async function authFetch(endpoint: string, username: string, password: string) {
  const response = await fetch(`${AUTH_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorMessages: Record<number, string> = {
      400: 'Неверный запрос. Проверьте логин и пароль.',
      403: 'Неверный логин или пароль.',
      404: 'Сервис авторизации недоступен.',
      429: 'Слишком много запросов. Подождите минуту.',
    };

    const errorMessage =
      errorMessages[response.status] ||
      (response.status >= 500
        ? 'Ошибка сервера. Попробуйте позже.'
        : `HTTP ${response.status}`);

    throw new Error(errorMessage);
  }

  return response.json() as Promise<{
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
    user_id: string;
  }>;
}

export const authApi = {
  login: (username: string, password: string) =>
    authFetch('/login', username, password),
  registration: (username: string, password: string) =>
    authFetch('/registration', username, password),
};
