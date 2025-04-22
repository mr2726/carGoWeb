import { create } from 'zustand';
import { Driver, Cargo, CargoStatus, User } from '../types';
import * as firebaseService from '../services/firebase';
import { auth } from '../config/firebase';

interface StoreState {
  drivers: Driver[];
  cargos: Cargo[];
  currentUser: User | null;
  selectedDate: Date;
  isLoading: boolean;
  setCargos: (cargos: Cargo[]) => void;
  setDrivers: (drivers: Driver[]) => void;
  setSelectedDate: (date: Date) => void;
  setCurrentUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  fetchDrivers: () => Promise<void>;
  fetchCargos: () => Promise<(() => void) | undefined>;
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
  currentUser: null,
  selectedDate: new Date(),
  isLoading: false,
  setCargos: (cargos) => set({ cargos }),
  setDrivers: (drivers) => set({ drivers }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setIsLoading: (isLoading) => set({ isLoading }),

  fetchDrivers: async () => {
    set({ isLoading: true });
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('No user authenticated, skipping drivers fetch');
        return;
      }
      
      const userData = await firebaseService.getUser(user.uid);
      if (!userData) {
        console.log('No user data found, skipping drivers fetch');
        return;
      }
      
      const drivers = await firebaseService.getDrivers(user.uid, userData.isAdmin);
      set({ drivers, currentUser: userData});
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCargos: async () => {
    set({ isLoading: true });
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('No user authenticated, skipping cargo fetch');
        return;
      }
      
      const userData = await firebaseService.getUser(user.uid);
      if (!userData) {
        console.log('No user data found, skipping cargo fetch');
        return;
      }
      
      // Get fresh data from Firestore
      const cargos = await firebaseService.getCargos(user.uid, userData.isAdmin);
      set({ cargos });
      
      // Set up real-time subscription
      const unsubscribe = firebaseService.subscribeToCargos(
        user.uid,
        userData.isAdmin,
        (updatedCargos) => {
          set({ cargos: updatedCargos });
        }
      );
      
      return unsubscribe;
    } catch (error) {
      console.error('Error fetching cargos:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addDriver: async (driver: Omit<Driver, 'id'>) => {
    set({ isLoading: true });
    try {
      const newDriver = await firebaseService.addDriver(driver);
      set((state) => ({ drivers: [...state.drivers, newDriver] }));
    } catch (error) {
      console.error('Error adding driver:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateDriver: async (id: string, driver: Partial<Driver>) => {
    set({ isLoading: true });
    try {
      const updatedDriver = await firebaseService.updateDriver(id, driver);
      set((state) => ({
        drivers: state.drivers.map((d) => (d.id === id ? updatedDriver : d)),
      }));
    } catch (error) {
      console.error('Error updating driver:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addCargo: async (cargo: Omit<Cargo, 'id'>) => {
    set({ isLoading: true });
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      await firebaseService.addCargo(cargo, user.uid);
    } catch (error) {
      console.error('Error adding cargo:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCargo: async (id: string, cargo: Partial<Cargo>) => {
    set({ isLoading: true });
    try {
      await firebaseService.updateCargo(id, cargo);
    } catch (error) {
      console.error('Error updating cargo:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCargoOrder: async (cargoId: string, newOrder: number) => {
    console.log('Store: updateCargoOrder called with:', { cargoId, newOrder });
    set({ isLoading: true });
    try {
      console.log('Store: calling firebaseService.updateCargo');
      await firebaseService.updateCargo(cargoId, { order: newOrder });
      console.log('Store: cargo order updated successfully');
    } catch (error) {
      console.error('Store: Error updating cargo order:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getDriverCargos: (driverId: string) => {
    return get().cargos.filter((cargo) => cargo.driverId === driverId);
  },

  getDriverLastLocation: (driverId: string) => {
    const driverCargos = get().getDriverCargos(driverId);
    if (driverCargos.length === 0) return '';
    return driverCargos[driverCargos.length - 1].deliveryLocation;
  },

  initializeSubscriptions: () => {
    const user = auth.currentUser;
    console.log('Current auth user:', user);
    
    if (!user) {
      console.log('No user authenticated, skipping subscriptions');
      return () => {};
    }

    let unsubscribeDrivers: (() => void) | undefined;
    let unsubscribeCargos: (() => void) | undefined;

    // Get user data
    firebaseService.getUser(user.uid).then(userData => {
      console.log('User data loaded in store:', userData);
      
      if (!userData) {
        console.log('No user data found in Firestore');
        return;
      }

      // Set user data in store
      set({ currentUser: userData });
      console.log('Current user set in store:', get().currentUser);
      
      // Setup subscriptions only after we have user data
      unsubscribeDrivers = firebaseService.subscribeToDrivers(
        user.uid,
        userData.isAdmin,
        (drivers) => {
          set({ drivers });
        }
      );

      unsubscribeCargos = firebaseService.subscribeToCargos(
        user.uid,
        userData.isAdmin,
        (cargos) => {
          set({ cargos });
        }
      );
    }).catch(error => {
      console.error('Error loading user data:', error);
    });

    return () => {
      if (unsubscribeDrivers) unsubscribeDrivers();
      if (unsubscribeCargos) unsubscribeCargos();
    };
  },
})); 