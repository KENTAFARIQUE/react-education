const API_BASE_URL = import.meta.env.VITE_CARAPI_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_CARAPI_BASE_URL is not defined');
}

async function fetchApi(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

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
};