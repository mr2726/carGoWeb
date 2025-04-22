import React from 'react';
import { Button } from '@mui/material';
import { useStore } from '../store';

const testDrivers = [
  {
    name: 'John Doe',
    phone: '+1 234 567 8901',
    homeCity: 'New York',
    ownerId: 'owner3',
    logid: 'log3',
  },
  {
    name: 'Jane Smith',
    phone: '+1 234 567 8902',
    homeCity: 'Los Angeles',
    ownerId: 'owner2',
    logid: 'log2',
  },
  {
    name: 'Mike Johnson',
    phone: '+1 234 567 8903',
    homeCity: 'Chicago',
    ownerId: 'owner1',
    logid: 'log1',
  },
];

export const AddTestDrivers = () => {
  const { addDriver } = useStore();

  const handleAddTestDrivers = async () => {
    for (const driver of testDrivers) {
      await addDriver(driver);
    }
    alert('Test drivers added successfully!');
  };

  return (
    <Button 
      variant="contained" 
      color="primary" 
      onClick={handleAddTestDrivers}
      sx={{ mb: 2 }}
    >
      Add Test Drivers
    </Button>
  );
}; 