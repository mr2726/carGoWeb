import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CargoList } from '../components/CargoList';
import { useStore } from '../store';

export const AllCargosPage: React.FC = () => {
  const { selectedDate, setSelectedDate } = useStore();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        All Cargos
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={(newValue) => newValue && setSelectedDate(newValue)}
          sx={{ mb: 3 }}
        />
        <Button onClick={() => setSelectedDate(null)} variant="outlined" style={{ marginLeft: '20px', lineHeight: '45px' }}>
          Clear Date Filter
        </Button>
      </LocalizationProvider>
      <CargoList />
    </Box>
  );
}; 