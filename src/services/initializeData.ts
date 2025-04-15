import { mockDrivers, mockCargos } from '../mockData';

const DRIVERS_KEY = 'drivers';
const CARGOS_KEY = 'cargos';

export const initializeLocalStorage = () => {
  // Only initialize if data doesn't exist
  if (!localStorage.getItem(DRIVERS_KEY)) {
    localStorage.setItem(DRIVERS_KEY, JSON.stringify(mockDrivers));
  }
  
  if (!localStorage.getItem(CARGOS_KEY)) {
    localStorage.setItem(CARGOS_KEY, JSON.stringify(mockCargos));
  }
}; 