import { create } from 'zustand'

export type OrderStep = 'location' | 'model' | 'additional' | 'total'

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
  setPickupCoordinates: (pickupCoordinates: [number, number]) => void
  setLocationInfo: (city: string, pickupPoint: string, coordinates: [number, number]) => void
  setSelectedModel: (selectedModel: string | null) => void
  toggleAdditionalOption: (option: string) => void
  resetOrder: () => void
}

export const useOrderStore = create<OrderStore>((set) => ({
  currentStep: 'location',
  city: 'Ульяновск',
  pickupPoint: '',
  pickupCoordinates: null,
  selectedModel: null,
  additionalOptions: [],

  setStep: (currentStep) => set({ currentStep }),
  setCity: (city) => set({ city, pickupPoint: '', pickupCoordinates: null }),
  setPickupPoint: (pickupPoint) => set({ pickupPoint }),
  setPickupCoordinates: (pickupCoordinates) => set({ pickupCoordinates }),
  setLocationInfo: (city, pickupPoint, coordinates) => set({ city, pickupPoint, pickupCoordinates: coordinates }),
  setSelectedModel: (selectedModel) => set({ selectedModel }),
  toggleAdditionalOption: (option) =>
    set((state) => ({
      additionalOptions: state.additionalOptions.includes(option)
        ? state.additionalOptions.filter((value) => value !== option)
        : [...state.additionalOptions, option],
    })),
  resetOrder: () =>
    set({
      currentStep: 'location',
      city: 'Ульяновск',
      pickupPoint: '',
      pickupCoordinates: null,
      selectedModel: null,
      additionalOptions: [],
    }),
}))
