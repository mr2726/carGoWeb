import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Driver, Cargo, User } from '../types';
import { auth } from '../config/firebase';
import { setStorageItem, getStorageItem } from './localStorage';

// Collections
const DRIVERS_COLLECTION = 'drivers';
const CARGOS_COLLECTION = 'cargos';
const USERS_COLLECTION = 'users';

// User Services
export const createUserDocument = async (userId: string, email: string, name: string, isAdmin: boolean = false): Promise<void> => {
  await setDoc(doc(db, 'users', userId), {
    email,
    name,
    isAdmin
  });
};

export const getUser = async (userId: string): Promise<User | null> => {
  console.log('Getting user data for ID:', userId);
  const userDoc = await getDoc(doc(db, 'users', userId));
  console.log('User doc exists:', userDoc.exists());
  
  if (!userDoc.exists()) {
    console.log('User document does not exist');
    // Create default user document if it doesn't exist
    const user = auth.currentUser;
    if (user) {
      await createUserDocument(userId, user.email || '', user.displayName || 'User', false);
      return {
        id: userId,
        email: user.email || '',
        name: user.displayName || 'User',
        isAdmin: false
      };
    }
    return null;
  }
  
  const userData = userDoc.data();
  console.log('Raw user data from Firestore:', userData);
  
  const user: User = {
    id: userDoc.id,
    email: userData.email || '',
    name: userData.name || 'User',
    isAdmin: Boolean(userData.isAdmin)
  };
  
  console.log('Processed user data:', user);
  return user;
};

export const getAllUsers = async (): Promise<User[]> => {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  return usersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as User[];
};

// Driver Services
export const getDrivers = async (userId: string, isAdmin: boolean): Promise<Driver[]> => {
  const driversCol = collection(db, DRIVERS_COLLECTION);

  if (isAdmin) {
    // Admins see all drivers
    const driverSnapshot = await getDocs(driversCol);
    return driverSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Driver[];
  } else {
    // Regular users see public drivers and their own drivers
    // if the ownerId is 'all', it means the driver is public and can be seen by all users
    // console.log(getDoc(driversCol));
    const q = query(driversCol, where('ownerId', '==', userId || "all"));
    const driverSnapshot = await getDocs(q);
    const driversData: Driver[] = [];
    driverSnapshot.docs.map(doc => {
      // Save all drivers to localStorage
      const driverData = { 
        id: doc.id,
        ...doc.data()
      } as Driver;
      driversData.push(driverData);
      setStorageItem('drivers', driversData);
    });
    return driversData as Driver[];
  }
};

export const subscribeToDrivers = (userId: string, isAdmin: boolean, callback: (drivers: Driver[]) => void) => {
  const driversCol = collection(db, DRIVERS_COLLECTION);
  const q = isAdmin 
    ? driversCol 
    : query(driversCol, where('ownerId', 'in', [userId, "all"] ));
  return onSnapshot(q, (snapshot) => {
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
export const getCargos = async (userId: string, isAdmin: boolean): Promise<Cargo[]> => {
  const cargosCol = collection(db, CARGOS_COLLECTION);
  if (isAdmin) {
    const cargoSnapshot = await getDocs(cargosCol);
    return cargoSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Cargo[];
  } else {
    // Get user's drivers first
    const drivers = await getDrivers(userId, false);
    const driverIds = drivers.map(d => d.id);
    
    // Get cargos only for user's drivers
    const q = query(cargosCol, where('driverId', 'in', driverIds));
    const cargoSnapshot = await getDocs(q);
    return cargoSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Cargo[];
  }
};

export const subscribeToCargos = (userId: string, isAdmin: boolean, callback: (cargos: Cargo[]) => void) => {
  const cargosRef = collection(db, CARGOS_COLLECTION);
  
  if (isAdmin) {
    // Admins see all cargos
    return onSnapshot(cargosRef, (snapshot) => {
      const cargos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Cargo[];
      // Update localStorage
      setStorageItem('cargos', cargos);
      callback(cargos);
    });
  } else {
    // Regular users see cargos of public drivers and their own drivers
    const driversRef = collection(db, DRIVERS_COLLECTION);
    const driversQuery = query(driversRef, where('ownerId', 'in', ['all', userId]));
    
    // First, get the initial list of drivers
    return onSnapshot(driversQuery, (driversSnapshot) => {
      const driverIds = driversSnapshot.docs.map(doc => doc.id);
      
      if (driverIds.length === 0) {
        // Update localStorage with empty array
        setStorageItem('cargos', []);
        callback([]);
        return;
      }
      
      // Create a query for cargos with these driver IDs
      const cargosQuery = query(cargosRef, where('driverId', 'in', driverIds));
      
      // Subscribe to cargo changes
      const unsubscribeCargos = onSnapshot(cargosQuery, (cargosSnapshot) => {
        const cargos = cargosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Cargo[];
        // Update localStorage
        setStorageItem('cargos', cargos);
        callback(cargos);
      });
      
      // Return a cleanup function that unsubscribes from both listeners
      return () => {
        unsubscribeCargos();
      };
    });
  }
};

export const addCargo = async (cargo: Omit<Cargo, 'id'>, userId: string): Promise<Cargo> => {
  try {
    const cargosCol = collection(db, CARGOS_COLLECTION);
    
    // Создаем новый системный ID
    const newId = doc(cargosCol).id;
    
    // Создаем документ с этим ID
    const cargoRef = doc(cargosCol, newId);
    
    // Добавляем системный ID и пользовательский cargoId в данные
    const cargoData = {
      ...cargo,
      id: newId,
      createdAt: new Date().toISOString(),
      createdBy: userId
    };
    
    // Сохраняем документ
    await setDoc(cargoRef, cargoData);
    
    return {
      ...cargoData,
      id: newId
    };
  } catch (error) {
    console.error('Error adding cargo:', error);
    throw error;
  }
};

export const updateCargo = async (id: string, cargo: Partial<Cargo>): Promise<Cargo> => {
  try {
    console.log('Starting cargo update...');
    console.log('Document ID:', id);
    
    const cargoRef = doc(db, CARGOS_COLLECTION, id);
    
    // Убедимся что id в данных совпадает с id документа
    const updatedData = {
      ...cargo,
      id: id, // Всегда используем id документа
      updatedAt: new Date().toISOString()
    };
    
    console.log('Updating with data:', updatedData);
    
    await updateDoc(cargoRef, updatedData);
    console.log('Update successful');
    
    // Get current cargos from localStorage
    const currentCargos = getStorageItem<Cargo>('cargos') || [];
    console.log('Current cargos from localStorage:', currentCargos);
    
    // Update the specific cargo in the array
    const updatedCargos = currentCargos.map(c => 
      c.id === id ? { ...c, ...updatedData } : c
    );
    console.log('Updated cargos array:', updatedCargos);
    
    // Save back to localStorage
    setStorageItem('cargos', updatedCargos);
    console.log('LocalStorage updated successfully');
    
    return {
      ...updatedData,
      id
    } as Cargo;
  } catch (error) {
    console.error('Error in updateCargo:', error);
    throw error;
  }
};

export const deleteCargo = async (id: string): Promise<void> => {
  const cargoRef = doc(db, CARGOS_COLLECTION, id);
  await deleteDoc(cargoRef);
};