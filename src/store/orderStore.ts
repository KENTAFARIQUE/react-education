import { create } from 'zustand'

export const ORDER_STEPS = [
  'location',
  'model',
  'additional',
  'total',
] as const

export type OrderStep = typeof ORDER_STEPS[number]

interface OrderStore {
  currentStep: OrderStep

  city: string
  pickupPoint: string
  pickupCoordinates: [number, number] | null

  selectedModel: string | null
  additionalOptions: string[]

  setStep: (step: OrderStep) => void

  setCity: (city: string) => void
  setPickupPoint: (pickupPoint: string) => void
  setPickupCoordinates: (
    pickupCoordinates: [number, number]
  ) => void

  setLocationInfo: (
    city: string,
    pickupPoint: string,
    coordinates: [number, number]
  ) => void

  setSelectedModel: (
    selectedModel: string | null
  ) => void

  toggleAdditionalOption: (option: string) => void

  resetOrder: () => void

  isStepCompleted: (step: OrderStep) => boolean
  canNavigateToStep: (step: OrderStep) => boolean

  resetSubsequentSteps: (fromStep: OrderStep) => void
}

export const useOrderStore = create<OrderStore>((set, get) => {
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

    additional: () => true,

    total: (state) =>
      stepValidators.location(state) &&
      stepValidators.model(state),
  }

  return {
    currentStep: 'location',

    city: 'Ульяновск',
    pickupPoint: '',
    pickupCoordinates: null,

    selectedModel: null,
    additionalOptions: [],

    setStep: (currentStep) =>
      set({ currentStep }),

    setCity: (city) => {
      set({
        city,
        pickupPoint: '',
        pickupCoordinates: null,
      })

      get().resetSubsequentSteps('location')
    },

    setPickupPoint: (pickupPoint) => {
      set({ pickupPoint })

      get().resetSubsequentSteps('location')
    },

    setPickupCoordinates: (pickupCoordinates) =>
      set({ pickupCoordinates }),

    setLocationInfo: (
      city,
      pickupPoint,
      coordinates
    ) => {
      set({
        city,
        pickupPoint,
        pickupCoordinates: coordinates,
      })

      get().resetSubsequentSteps('location')
    },

    setSelectedModel: (selectedModel) => {
      set({ selectedModel })

      get().resetSubsequentSteps('model')
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
        pickupPoint: '',
        pickupCoordinates: null,

        selectedModel: null,
        additionalOptions: [],
      }),

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
        })

        return
      }

      if (fromIndex <= getStepIndex('model')) {
        set({
          additionalOptions: [],
        })
      }
    },
  }
})