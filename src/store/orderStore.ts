import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const ORDER_STEPS = [
  'location',
  'model',
  'additional',
  'total',
] as const

export type OrderStep = typeof ORDER_STEPS[number]

export interface SelectedCarInfo {
  id: number;
  name: string;
  priceMin: number;
  priceMax: number;
  colors: string[];
  thumbnail: { path: string };
}

export interface SavedOrder {
  id: number;
  carName: string;
  cityName: string;
  pointName: string;
  rateName: string;
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
  createdAt: string;
}

interface OrderStore {
  currentStep: OrderStep

  city: string
  cityId: number | null
  pickupPoint: string
  pointId: number | null
  pickupCoordinates: [number, number] | null

  selectedModel: SelectedCarInfo | null
  additionalOptions: string[]

  color: string
  rentalStart: string
  rentalEnd: string
  rate: string

  setStep: (step: OrderStep) => void

  setCity: (city: string, cityId?: number) => void
  setPickupPoint: (pickupPoint: string, pointId?: number) => void
  setPickupCoordinates: (
    pickupCoordinates: [number, number]
  ) => void

  setLocationInfo: (
    city: string,
    cityId: number,
    pickupPoint: string,
    pointId: number,
    coordinates: [number, number]
  ) => void

  setSelectedModel: (
    selectedModel: SelectedCarInfo | null
  ) => void

  setColor: (color: string) => void
  setRentalStart: (rentalStart: string) => void
  setRentalEnd: (rentalEnd: string) => void
  setRate: (rate: string) => void

  toggleAdditionalOption: (option: string) => void

  resetOrder: () => void

  savedOrders: SavedOrder[]
  saveOrder: (order: Omit<SavedOrder, 'id' | 'createdAt'>) => number
  cancelOrder: (id: number) => void

  isStepCompleted: (step: OrderStep) => boolean
  canNavigateToStep: (step: OrderStep) => boolean

  resetSubsequentSteps: (fromStep: OrderStep) => void
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => {
  const getStepIndex = (step: OrderStep) =>
    ORDER_STEPS.indexOf(step)

  const stepValidators: Record<
    OrderStep,
    (state: OrderStore) => boolean
  > = {
    location: (state) =>
      state.city.trim() !== '' &&
      state.pickupPoint.trim() !== '',

    model: (state) =>
      state.selectedModel !== null,

    additional: (state) => {
      if (state.color === '' || state.rentalStart === '' || state.rentalEnd === '' || state.rate === '') {
        return false
      }
      const DISPLAY_RE = /^(\d{2})\.(\d{2})\.(\d{4})\s(\d{2}):(\d{2})$/
      const start = state.rentalStart.match(DISPLAY_RE)
      const end = state.rentalEnd.match(DISPLAY_RE)
      if (!start || !end) return false
      const startDate = new Date(+start[3], +start[2] - 1, +start[1], +start[4], +start[5])
      const endDate = new Date(+end[3], +end[2] - 1, +end[1], +end[4], +end[5])
      return endDate >= startDate
    },

    total: (state) =>
      stepValidators.location(state) &&
      stepValidators.model(state) &&
      stepValidators.additional(state),
  }

  return {
    currentStep: 'location',

    city: 'Ульяновск',
    cityId: null,
    pickupPoint: '',
    pointId: null,
    pickupCoordinates: null,

    selectedModel: null,
    additionalOptions: [],

    color: '',
    rentalStart: '',
    rentalEnd: '',
    rate: '',

    savedOrders: [],

    setStep: (currentStep) =>
      set({ currentStep }),

    setCity: (city, cityId) => {
      set({
        city,
        cityId: cityId ?? null,
        pickupPoint: '',
        pointId: null,
        pickupCoordinates: null,
      })

      get().resetSubsequentSteps('location')
    },

    setPickupPoint: (pickupPoint, pointId) => {
      set({ pickupPoint, pointId: pointId ?? null })

      get().resetSubsequentSteps('location')
    },

    setPickupCoordinates: (pickupCoordinates) =>
      set({ pickupCoordinates }),

    setLocationInfo: (
      city,
      cityId,
      pickupPoint,
      pointId,
      coordinates
    ) => {
      set({
        city,
        cityId,
        pickupPoint,
        pointId,
        pickupCoordinates: coordinates,
      })

      get().resetSubsequentSteps('location')
    },

    setSelectedModel: (selectedModel) => {
      set({ selectedModel })

      get().resetSubsequentSteps('model')
    },

    setColor: (color) => {
      set({ color })
    },

    setRentalStart: (rentalStart) => {
      set({ rentalStart })
    },

    setRentalEnd: (rentalEnd) => {
      set({ rentalEnd })
    },

    setRate: (rate) => {
      set({ rate })
    },

    toggleAdditionalOption: (option) => {
      set((state) => ({
        additionalOptions:
          state.additionalOptions.includes(option)
            ? state.additionalOptions.filter(
                (value) => value !== option
              )
            : [...state.additionalOptions, option],
      }))
    },

    resetOrder: () =>
      set({
        currentStep: 'location',

        city: 'Ульяновск',
        cityId: null,
        pickupPoint: '',
        pointId: null,
        pickupCoordinates: null,

        selectedModel: null,
        additionalOptions: [],

        color: '',
        rentalStart: '',
        rentalEnd: '',
        rate: '',
      }),

    saveOrder: (order) => {
      const { savedOrders } = get()
      const nextId = savedOrders.length === 0
        ? 1
        : Math.max(...savedOrders.map((o) => o.id)) + 1
      const saved: SavedOrder = {
        ...order,
        id: nextId,
        createdAt: new Date().toISOString(),
      }
      set({ savedOrders: [...savedOrders, saved] })
      return saved.id
    },

    cancelOrder: (id) => {
      set((state) => ({
        savedOrders: state.savedOrders.filter((o) => o.id !== id),
      }))
    },

    isStepCompleted: (step) => {
      return stepValidators[step](get())
    },

    canNavigateToStep: (step) => {
      const state = get()

      const targetIndex = getStepIndex(step)
      const currentIndex = getStepIndex(
        state.currentStep
      )

      if (targetIndex <= currentIndex) {
        return true
      }

      return ORDER_STEPS
        .slice(0, targetIndex)
        .every((step) =>
          stepValidators[step](state)
        )
    },

    resetSubsequentSteps: (fromStep) => {
      const fromIndex = getStepIndex(fromStep)

      if (fromIndex <= getStepIndex('location')) {
        set({
          selectedModel: null,
          additionalOptions: [],
          color: '',
          rentalStart: '',
          rentalEnd: '',
          rate: '',
        })

        return
      }

      if (fromIndex <= getStepIndex('model')) {
        set({
          additionalOptions: [],
          color: '',
          rentalStart: '',
          rentalEnd: '',
          rate: '',
        })
      }
    },
  }
},
    {
      name: 'react_education_orders',
      partialize: (state) => ({ savedOrders: state.savedOrders }),
    }
  )
)