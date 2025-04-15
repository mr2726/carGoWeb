import { Driver, Cargo } from '../types';

// Storage keys
const DRIVERS_KEY = 'drivers';
const CARGOS_KEY = 'cargos';

// Helper functions
const getStorageItem = <T>(key: string): T[] => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : [];
};

const setStorageItem = <T>(key: string, value: T[]): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Driver Services
export const getDrivers = async (): Promise<Driver[]> => {
  return getStorageItem<Driver>(DRIVERS_KEY);
};

export const addDriver = async (driver: Omit<Driver, 'id'>): Promise<Driver> => {
  const drivers = getStorageItem<Driver>(DRIVERS_KEY);
  const newDriver = {
    ...driver,
    id: Date.now().toString()
  };
  drivers.push(newDriver);
  setStorageItem(DRIVERS_KEY, drivers);
  return newDriver;
};

export const updateDriver = async (id: string, driver: Partial<Driver>): Promise<Driver> => {
  const drivers = getStorageItem<Driver>(DRIVERS_KEY);
  const index = drivers.findIndex(d => d.id === id);
  if (index === -1) throw new Error('Driver not found');
  
  const updatedDriver = {
    ...drivers[index],
    ...driver
  };
  drivers[index] = updatedDriver;
  setStorageItem(DRIVERS_KEY, drivers);
  return updatedDriver;
};

export const deleteDriver = async (id: string): Promise<void> => {
  const drivers = getStorageItem<Driver>(DRIVERS_KEY);
  const filteredDrivers = drivers.filter(d => d.id !== id);
  setStorageItem(DRIVERS_KEY, filteredDrivers);
};

// Cargo Services
export const getCargos = async (): Promise<Cargo[]> => {
  return getStorageItem<Cargo>(CARGOS_KEY);
};

export const addCargo = async (cargo: Omit<Cargo, 'id'> & { id?: string }): Promise<Cargo> => {
  const cargos = getStorageItem<Cargo>(CARGOS_KEY);
  const newCargo = {
    ...cargo,
    id: cargo.id || Date.now().toString(),
    order: cargo.order || 0,
    status: cargo.status || 'booked'
  };
  cargos.push(newCargo);
  setStorageItem(CARGOS_KEY, cargos);
  return newCargo;
};

export const updateCargo = async (id: string, cargo: Partial<Cargo>): Promise<Cargo> => {
  const cargos = getStorageItem<Cargo>(CARGOS_KEY);
  const index = cargos.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Cargo not found');
  
  const updatedCargo = {
    ...cargos[index],
    ...cargo
  };
  cargos[index] = updatedCargo;
  setStorageItem(CARGOS_KEY, cargos);
  return updatedCargo;
};

export const deleteCargo = async (id: string): Promise<void> => {
  const cargos = getStorageItem<Cargo>(CARGOS_KEY);
  const filteredCargos = cargos.filter(c => c.id !== id);
  setStorageItem(CARGOS_KEY, filteredCargos);
}; 