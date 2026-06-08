export interface CityAttrs {
  id: number;
  name: string;
}

export interface PointCityRef {
  id: number;
  name: string;
}

export interface PointAttrs {
  id: number;
  name: string;
  address: string;
  cityId: PointCityRef;
}

export interface GeoResponse<T> {
  data: T[];
  count: number;
}
