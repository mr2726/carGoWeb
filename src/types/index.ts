export type CargoStatus = 'booked' | 'dispatched' | 'pickedup' | 'delivered' | 'paid' | 'TONU' | 'canceled';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  homeCity: string;
  lastLocation?: string;
  ownerId: string; // ID of the user who owns this driver or 'all' for public drivers
  logId: string; // Driver's login ID
}

export interface Cargo {
  id: string;
  cargoId: string; // Custom ID entered by user
  pickupLocation: string;
  deliveryLocation: string;
  pickupDateTime: string;
  deliveryDateTime: string;
  notes: string;
  status: CargoStatus;
  driverId: string;
  order: number;
  rate: number;
  createdBy: string; // ID of the user who created the cargo
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  name: string; // User's full name
} 