import { useCallback, useEffect, useState } from 'react'
import type { YMapsApi } from './yandex-maps.types'
import { YANDEX_MAPS_V2_SCRIPT_SELECTOR } from './yandexMapsConsts'

let yandexMapsLoadPromise: Promise<YMapsApi> | null = null

declare global {
  interface Window {
    ymaps?: YMapsApi
  }
}

interface YandexMapsStatus {
  isLoaded: boolean
  error: Error | null
  ymaps: YMapsApi | null
}

interface UseYandexMapsOptions {
  lang?: 'ru_RU' | 'en_US'
}

export const useYandexMaps = (
  apiKey: string,
  options: UseYandexMapsOptions = {},
): YandexMapsStatus => {
  const missingApiKeyError = new Error('API key is required')
  const [status, setStatus] = useState<YandexMapsStatus>({
    isLoaded: false,
    error: null,
    ymaps: null,
  })

  const toError = (err: unknown): Error => {
    return err instanceof Error ? err : new Error('Unknown Yandex Maps error')
  }

  const loadYandexMaps = useCallback(
    (lang: NonNullable<UseYandexMapsOptions['lang']>) => {
      if (window.ymaps) {
        return window.ymaps.ready().then((ymaps) => ymaps)
      }

      if (yandexMapsLoadPromise) {
        return yandexMapsLoadPromise
      }

      const existingScript = document.querySelector<HTMLScriptElement>(
        YANDEX_MAPS_V2_SCRIPT_SELECTOR,
      )

      if (existingScript) {
        yandexMapsLoadPromise = new Promise<YMapsApi>((resolve, reject) => {
          const finalize = () => {
            if (window.ymaps) {
              window.ymaps.ready().then(resolve).catch(reject)
              return
            }

            reject(new Error('Yandex Maps API loaded but ymaps3 is unavailable'))
          }

          existingScript.addEventListener('load', finalize, { once: true })
          existingScript.addEventListener(
            'error',
            () => reject(new Error('Failed to load Yandex Maps API')),
            { once: true },
          )

          if (window.ymaps) {
            finalize()
          }
        })

        return yandexMapsLoadPromise
      }

      const script = document.createElement('script')
      script.dataset.yandexMapsV2 = 'true'
      script.async = true
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=${lang}`

      yandexMapsLoadPromise = new Promise<YMapsApi>((resolve, reject) => {
        script.addEventListener(
          'load',
          () => {
            if (!window.ymaps) {
              reject(new Error('Yandex Maps API loaded but ymaps is unavailable'))
              return
            }

            window.ymaps.ready().then(resolve).catch(reject)
          },
          { once: true },
        )

        script.addEventListener(
          'error',
          () => reject(new Error('Failed to load Yandex Maps API')),
          { once: true },
        )
      })

      document.head.appendChild(script)

      return yandexMapsLoadPromise
    },
    [apiKey],
  )

  useEffect(() => {
    if (!apiKey) {
      return
    }

    const lang = options.lang || 'ru_RU'
    loadYandexMaps(lang)
      .then((ymapsApi) => {
        setStatus({
          isLoaded: true,
          error: null,
          ymaps: ymapsApi ?? null,
        })
      })
      .catch((err: unknown) => {
        setStatus({
          isLoaded: false,
          error: toError(err),
          ymaps: null,
        })
      })
  }, [apiKey, loadYandexMaps, options.lang])

  if (!apiKey) {
    return {
      isLoaded: false,
      error: missingApiKeyError,
      ymaps: null,
    }
  }

  return status
}