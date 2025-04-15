import { create } from 'zustand';
import { Driver, Cargo, CargoStatus } from '../types';
import * as firebaseService from '../services/firebase';

interface StoreState {
  drivers: Driver[];
  cargos: Cargo[];
  selectedDate: Date;
  isLoading: boolean;
  setSelectedDate: (date: Date) => void;
  fetchDrivers: () => Promise<void>;
  fetchCargos: () => Promise<void>;
  addDriver: (driver: Omit<Driver, 'id'>) => Promise<void>;
  updateDriver: (id: string, driver: Partial<Driver>) => Promise<void>;
  addCargo: (cargo: Omit<Cargo, 'id'>) => Promise<void>;
  updateCargo: (id: string, cargo: Partial<Cargo>) => Promise<void>;
  updateCargoOrder: (cargoId: string, newOrder: number) => Promise<void>;
  getDriverCargos: (driverId: string) => Cargo[];
  getDriverLastLocation: (driverId: string) => string;
  initializeSubscriptions: () => () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  drivers: [],
  cargos: [],
  selectedDate: new Date(),
  isLoading: false,

  setSelectedDate: (date) => set({ selectedDate: date }),

  fetchDrivers: async () => {
    set({ isLoading: true });
    try {
      const drivers = await firebaseService.getDrivers();
      set({ drivers });
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCargos: async () => {
    set({ isLoading: true });
    try {
      const cargos = await firebaseService.getCargos();
      set({ cargos });
    } catch (error) {
      console.error('Error fetching cargos:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addDriver: async (driver) => {
    set({ isLoading: true });
    try {
      await firebaseService.addDriver(driver);
    } catch (error) {
      console.error('Error adding driver:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateDriver: async (id, driver) => {
    set({ isLoading: true });
    try {
      await firebaseService.updateDriver(id, driver);
    } catch (error) {
      console.error('Error updating driver:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addCargo: async (cargo) => {
    set({ isLoading: true });
    try {
      await firebaseService.addCargo(cargo);
    } catch (error) {
      console.error('Error adding cargo:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateCargo: async (id, cargo) => {
    set({ isLoading: true });
    try {
      await firebaseService.updateCargo(id, cargo);
    } catch (error) {
      console.error('Error updating cargo:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateCargoOrder: async (cargoId, newOrder) => {
    set({ isLoading: true });
    try {
      await firebaseService.updateCargo(cargoId, { order: newOrder });
    } catch (error) {
      console.error('Error updating cargo order:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  getDriverCargos: (driverId) => {
    const state = get();
    return state.cargos
      .filter((cargo) => cargo.driverId === driverId)
      .sort((a, b) => a.order - b.order);
  },

  getDriverLastLocation: (driverId) => {
    const state = get();
    const activeStatuses: CargoStatus[] = ['booked', 'dispatched', 'pickedup'];
    const driverActiveCargos = state.cargos
      .filter((cargo) => 
        cargo.driverId === driverId && 
        activeStatuses.includes(cargo.status)
      )
      .sort((a, b) => a.order - b.order);

    if (driverActiveCargos.length === 0) {
      const driver = state.drivers.find((d) => d.id === driverId);
      return driver?.homeCity || '';
    }

    return driverActiveCargos[driverActiveCargos.length - 1].deliveryLocation;
  },

  initializeSubscriptions: () => {
    try {
      console.log('Setting up store subscriptions...');
      
      // Subscribe to drivers changes
      const unsubscribeDrivers = firebaseService.subscribeToDrivers((drivers) => {
        console.log('Drivers updated:', drivers.length);
        set({ drivers });
      });

      // Subscribe to cargos changes
      const unsubscribeCargos = firebaseService.subscribeToCargos((cargos) => {
        console.log('Cargos updated:', cargos.length);
        set({ cargos });
      });

      console.log('Store subscriptions set up successfully');

      // Return cleanup function
      return () => {
        console.log('Cleaning up store subscriptions...');
        unsubscribeDrivers();
        unsubscribeCargos();
      };
    } catch (error) {
      console.error('Error in store subscriptions:', error);
      throw error;
    }
  },
})); 