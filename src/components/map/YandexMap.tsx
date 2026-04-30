import { useYandexMaps } from './useYandexMaps'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import type {
  Marker,
  YandexMapProps,
  YandexMapRef,
  YMapMarkerInstance,
} from './yandex-maps.types'
import styles from './yandexMap.module.css'
import { DEFAULT_CENTER, DEFAULT_ZOOM, MARKER_PRESET } from './yandexMapsConsts'

export const YandexMap = forwardRef<YandexMapRef, YandexMapProps>(
  (
    {
      apiKey,
      center = DEFAULT_CENTER,
      zoom = DEFAULT_ZOOM,
      markers = [],
      onMapLoad,
      onMarkerClick,
      className,
      style,
    },
    ref,
  ) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null)
    const mapRef = useRef<YandexMapRef['map']>(null)
    const markersRef = useRef<Map<Marker['id'], YMapMarkerInstance>>(new Map())
    const { isLoaded, error, ymaps } = useYandexMaps(apiKey)

    const removeMarkerFromMap = useCallback((markerId: Marker['id']) => {
      const map = mapRef.current

      if (!map) {
        return
      }

      const marker = markersRef.current.get(markerId)
      if (!marker) {
        return
      }

      map.geoObjects.remove(marker)
      markersRef.current.delete(markerId)
    }, [])

    const clearMarkers = useCallback(() => {
      if (!mapRef.current) {
        return
      }

      markersRef.current.forEach((marker) => {
        mapRef.current?.geoObjects.remove(marker)
      })
      markersRef.current.clear()
    }, [])

    const addMarkerToMap = useCallback(
      (marker: Marker) => {
        if (!mapRef.current || !ymaps) {
          return
        }

        removeMarkerFromMap(marker.id)

        const yandexMarker = new ymaps.Placemark(
          marker.coordinates,
          {
            hintContent: marker.title,
            balloonContent: marker.description,
          },
          {
            draggable: marker.draggable ?? false,
            preset: MARKER_PRESET,
          },
        )

        yandexMarker.events.add('click', () => {
          marker.onClick?.(marker)
          onMarkerClick?.(marker)
        })

        mapRef.current.geoObjects.add(yandexMarker)
        markersRef.current.set(marker.id, yandexMarker)
      },
      [onMarkerClick, removeMarkerFromMap, ymaps],
    )

    useEffect(() => {
      if (!isLoaded || !ymaps || !mapContainerRef.current || mapRef.current) {
        return
      }

      const map = new ymaps.Map(
        mapContainerRef.current,
        {
          center,
          zoom,
          controls: [],
        },
        {
          suppressMapOpenBlock: true,
          suppressObsoleteBrowserNotifier: true,
        },
      )

      mapRef.current = map
      onMapLoad?.(map)
    }, [center, isLoaded, onMapLoad, ymaps, zoom])

    useEffect(() => {
      if (!mapRef.current) {
        return
      }

      mapRef.current.setCenter(center, zoom)
    }, [center, zoom])

    useEffect(() => {
      if (!isLoaded || !ymaps || !mapRef.current) {
        return
      }

      clearMarkers()
      markers.forEach(addMarkerToMap)
    }, [addMarkerToMap, clearMarkers, isLoaded, markers, ymaps])

    useEffect(() => {
      return () => {
        clearMarkers()

        if (mapRef.current) {
          mapRef.current.destroy()
          mapRef.current = null
        }
      }
    }, [clearMarkers])

    useImperativeHandle(
      ref,
      () => ({
        map: mapRef.current,
        setCenter: (newCenter, newZoom) => {
          if (!mapRef.current) {
            return
          }

          mapRef.current.setCenter(newCenter, newZoom ?? zoom)
        },
        addMarker: (marker) => {
          addMarkerToMap(marker)
        },
        removeMarker: (markerId) => {
          removeMarkerFromMap(markerId)
        },
      }),
      [addMarkerToMap, removeMarkerFromMap, zoom],
    )

    if (error) {
      return (
        <div className={`${styles.stateBox} ${styles.error}`} style={style}>
          Ошибка загрузки карты: {error.message}
        </div>
      )
    }

    if (!isLoaded) {
      return (
        <div className={`${styles.stateBox} ${styles.loading}`} style={style}>
          Загрузка карты...
        </div>
      )
    }

    return (
      <div ref={mapContainerRef} className={`${styles.map} ${className || ''}`} style={style} />
    )
  },
)

YandexMap.displayName = 'YandexMap'