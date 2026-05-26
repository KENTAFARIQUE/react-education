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
  isStepCompleted: (step: OrderStep) => boolean
  canNavigateToStep: (step: OrderStep) => boolean
  resetSubsequentSteps: (fromStep: OrderStep) => void
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  currentStep: 'location',
  city: 'Ульяновск',
  pickupPoint: '',
  pickupCoordinates: null,
  selectedModel: null,
  additionalOptions: [],

  setStep: (currentStep) => set({ currentStep }),
  setCity: (city) => {
    set({ city, pickupPoint: '', pickupCoordinates: null });
    get().resetSubsequentSteps('location');
  },
  setPickupPoint: (pickupPoint) => {
    set({ pickupPoint });
    get().resetSubsequentSteps('location');
  },
  setPickupCoordinates: (pickupCoordinates) => set({ pickupCoordinates }),
  setLocationInfo: (city, pickupPoint, coordinates) => {
    set({ city, pickupPoint, pickupCoordinates: coordinates });
    get().resetSubsequentSteps('location');
  },
  setSelectedModel: (selectedModel) => {
    set({ selectedModel });
    get().resetSubsequentSteps('model');
  },
  toggleAdditionalOption: (option) => {
    set((state) => ({
      additionalOptions: state.additionalOptions.includes(option)
        ? state.additionalOptions.filter((value) => value !== option)
        : [...state.additionalOptions, option],
    }));
    get().resetSubsequentSteps('additional');
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
    const state = get();
    switch (step) {
      case 'location':
        return state.city.trim() !== '' && state.pickupPoint.trim() !== '';
      case 'model':
        return state.selectedModel !== null;
      case 'additional':
        return true;
      case 'total':
        return state.isStepCompleted('location') &&
               state.isStepCompleted('model') &&
               state.isStepCompleted('additional');
      default:
        return false;
    }
  },

  canNavigateToStep: (step) => {
    const state = get();
    const stepIndex = ['location', 'model', 'additional', 'total'].indexOf(step);
    const currentIndex = ['location', 'model', 'additional', 'total'].indexOf(state.currentStep);

    if (stepIndex < currentIndex) {
      return true;
    }

    if (stepIndex === currentIndex + 1) {
      return state.isStepCompleted(state.currentStep);
    }

    if (stepIndex === currentIndex) {
      return true;
    }

    return false;
  },

  resetSubsequentSteps: (fromStep) => {
    const state = get();
    const steps = ['location', 'model', 'additional', 'total'];
    const fromIndex = steps.indexOf(fromStep);

    if (fromIndex < steps.length - 1) {
      set({
        selectedModel: fromIndex <= steps.indexOf('model') ? null : state.selectedModel,
        additionalOptions: fromIndex <= steps.indexOf('additional') ? [] : state.additionalOptions,
      });
    }
  },
}))
