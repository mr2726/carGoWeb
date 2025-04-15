import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Driver, Cargo } from '../types';

// Collections
const DRIVERS_COLLECTION = 'drivers';
const CARGOS_COLLECTION = 'cargos';

// Driver Services
export const getDrivers = async (): Promise<Driver[]> => {
  const driversCol = collection(db, DRIVERS_COLLECTION);
  const driverSnapshot = await getDocs(driversCol);
  return driverSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Driver[];
};

export const subscribeToDrivers = (callback: (drivers: Driver[]) => void) => {
  const driversCol = collection(db, DRIVERS_COLLECTION);
  return onSnapshot(driversCol, (snapshot) => {
    const drivers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Driver[];
    callback(drivers);
  });
};

export const addDriver = async (driver: Omit<Driver, 'id'>): Promise<Driver> => {
  const driversCol = collection(db, DRIVERS_COLLECTION);
  const docRef = await addDoc(driversCol, driver);
  return {
    id: docRef.id,
    ...driver
  };
};

export const updateDriver = async (id: string, driver: Partial<Driver>): Promise<Driver> => {
  const driverRef = doc(db, DRIVERS_COLLECTION, id);
  await updateDoc(driverRef, driver);
  return {
    id,
    ...driver
  } as Driver;
};

export const deleteDriver = async (id: string): Promise<void> => {
  const driverRef = doc(db, DRIVERS_COLLECTION, id);
  await deleteDoc(driverRef);
};

// Cargo Services
export const getCargos = async (): Promise<Cargo[]> => {
  const cargosCol = collection(db, CARGOS_COLLECTION);
  const cargoSnapshot = await getDocs(cargosCol);
  return cargoSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Cargo[];
};

export const subscribeToCargos = (callback: (cargos: Cargo[]) => void) => {
  const cargosCol = collection(db, CARGOS_COLLECTION);
  return onSnapshot(cargosCol, (snapshot) => {
    const cargos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Cargo[];
    callback(cargos);
  });
};

export const addCargo = async (cargo: Omit<Cargo, 'id'>): Promise<Cargo> => {
  const cargosCol = collection(db, CARGOS_COLLECTION);
  const docRef = await addDoc(cargosCol, cargo);
  return {
    id: docRef.id,
    ...cargo
  };
};

export const updateCargo = async (id: string, cargo: Partial<Cargo>): Promise<Cargo> => {
  const cargoRef = doc(db, CARGOS_COLLECTION, id);
  await updateDoc(cargoRef, cargo);
  return {
    id,
    ...cargo
  } as Cargo;
};

export const deleteCargo = async (id: string): Promise<void> => {
  const cargoRef = doc(db, CARGOS_COLLECTION, id);
  await deleteDoc(cargoRef);
}; 