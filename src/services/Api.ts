const API_BASE_URL = import.meta.env.VITE_CARAPI_BASE_URL;


async function fetchApi(endpoint: any) {
  try {
    const response = await fetch(API_BASE_URL + endpoint)

    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = 'Не удалось прочитать тело ошибки';
      }
      
      let errorMessage = `HTTP ${response.status}`;
      
      if (response.status === 400) {
        errorMessage = 'Неверный запрос. Проверьте параметры.';
      } else if (response.status === 403) {
        errorMessage = 'Доступ запрещен. Проверьте API ключ.';
      } else if (response.status === 404) {
        errorMessage = 'Ресурс не найден. Проверьте endpoint.';
      } else if (response.status === 429) {
        errorMessage = 'Слишком много запросов. Подождите минуту.';
      } else if (response.status >= 500) {
        errorMessage = 'Ошибка сервера. Попробуйте позже.';
      }
      throw new Error(errorMessage);
    }


    const data = await response.json();
    return data;

  } catch (error) {
    throw error;
  }
}

export const carApi = {
    get: (resource: any, id = null, relation = null) => 
        fetchApi(
        `/${resource}${id ? `/${id}` : ''}${relation ? `/${relation}` : ''}`
        ),

    getAllCars: () => carApi.get('car')
};