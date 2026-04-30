export interface Coordinates {
  longitude: number
  latitude: number
}

export type CoordinatesTuple = [number, number]

export interface YMapLocation {
  center: CoordinatesTuple
  zoom: number
}

export interface YMapGeoObjectsCollection {
  add: (geoObject: object) => void
  remove: (geoObject: object) => void
}

export interface YMapInstance {
  geoObjects: YMapGeoObjectsCollection
  setCenter: (center: CoordinatesTuple, zoom?: number) => void
  setZoom: (zoom: number) => void
  destroy: () => void
}

export type YMapMarkerInstance = object

export interface YMapMarkerOptions {
  coordinates: CoordinatesTuple
  draggable: boolean
}

export interface YMapPlacemarkOptions {
  draggable?: boolean
  preset?: string
}

export interface YMapPlacemarkProperties {
  hintContent?: string
  balloonContent?: string
}

export interface YMapPlacemarkInstance {
  events: {
    add: (eventName: 'click', handler: () => void) => void
  }
}

export interface YMapsApi {
  ready: (
    successCallback?: (api: YMapsApi) => void,
    errorCallback?: (error: Error) => void,
    context?: object,
  ) => Promise<YMapsApi>
  Map: new (
    container: HTMLElement | string,
    state: {
      center: CoordinatesTuple
      zoom: number
      controls?: string[]
      type?: string
    },
    options?: object,
  ) => YMapInstance
  Placemark: new (
    coordinates: CoordinatesTuple,
    properties?: YMapPlacemarkProperties,
    options?: YMapPlacemarkOptions,
  ) => YMapPlacemarkInstance
}

export interface Marker {
  id: string | number
  coordinates: CoordinatesTuple
  title?: string
  description?: string
  draggable?: boolean
  onClick?: (marker: Marker) => void
}

export interface YandexMapProps {
  apiKey: string
  center?: CoordinatesTuple
  zoom?: number
  markers?: Marker[]
  onMapLoad?: (map: YMapInstance) => void
  onMarkerClick?: (marker: Marker) => void
  className?: string
  style?: React.CSSProperties
}

export interface YandexMapRef {
  map: YMapInstance | null
  setCenter: (coordinates: CoordinatesTuple, zoom?: number) => void
  addMarker: (marker: Marker) => void
  removeMarker: (markerId: string | number) => void
}