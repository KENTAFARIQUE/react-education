import type { Marker } from './yandex-maps.types'

export const YANDEX_MAPS_V2_SCRIPT_SELECTOR = 'script[data-yandex-maps-v2="true"]'

export const MOCK_CITY_OPTIONS = [
  { id: 'ulyanovsk', label: 'Ульяновск' },
  { id: 'samara', label: 'Самара' },
  { id: 'kazan', label: 'Казань' },
  { id: 'moscow', label: 'Москва' },
]

export type PickupPoint = Marker & {
  city: string
  address: string
}

export const DEMO_MARKERS: Marker[] = [
  {
    id: 'ulyanovsk-narimanova',
    coordinates: [54.346369, 48.402115],
    title: 'Ульяновск, Нариманова 42',
    description: 'Основной салон в Ульяновске',
  },
  {
    id: 'ulyanovsk-goncharova',
    coordinates: [54.318221, 48.404025],
    title: 'Ульяновск, Гончарова 10',
    description: 'Склад в центре Ульяновска',
  },
  {
    id: 'kazan-pobedy',
    coordinates: [55.749567, 49.219104],
    title: 'Казань, Проспект Победы 141',
    description: 'Пункт выдачи в Казани',
  },
  {
    id: 'moscow-hamovniki',
    coordinates: [55.726923, 37.592312],
    title: 'Москва, Лужнецкая набережная 2/4с4',
    description: 'Пункт выдачи в Москве',
  },
]

export const DEMO_PICKUP_POINTS: PickupPoint[] = [
  {
    id: 'ulyanovsk-narimanova',
    city: 'Ульяновск',
    address: 'Нариманова 42',
    coordinates: [54.346369, 48.402115],
    title: 'Ульяновск, Нариманова 42',
  },
  {
    id: 'ulyanovsk-goncharova',
    city: 'Ульяновск',
    address: 'Гончарова 10',
    coordinates: [54.318221, 48.404025],
    title: 'Ульяновск, Гончарова 10',
  },
  {
    id: 'samara-avrora',
    city: 'Самара',
    address: 'Авроры 110к1',
    coordinates: [53.200124, 50.183839],
    title: 'Самара, Авроры 110к1',
  },
  {
    id: 'kazan-pobedy',
    city: 'Казань',
    address: 'Проспект Победы 141',
    coordinates: [55.749567, 49.219104],
    title: 'Казань, Проспект Победы 141',
  },
  {
    id: 'moscow-hamovniki',
    city: 'Москва',
    address: 'Лужнецкая набережная 2/4с4',
    coordinates: [55.726923, 37.592312],
    title: 'Москва, Лужнецкая набережная 2/4с4',
  },
]

export const CITY_CENTERS: Record<string, [number, number]> = {
  Ульяновск: [54.314192, 48.402115],
  Самара: [53.195878, 50.150043],
  Казань: [55.796127, 49.106414],
  Москва: [55.755814, 37.617635],
}

export const DEFAULT_MAP_HEIGHT = '500px'
export const DEFAULT_CENTER: [number, number] = [55.76, 37.64]
export const DEFAULT_ZOOM = 10
export const MARKER_PRESET = 'islands#redDotIcon'