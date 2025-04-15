import React, { useMemo } from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { CargoList } from '../components/CargoList';
import { useStore } from '../store';

export const UnpaidDeliveredCargosPage: React.FC = () => {
  const { cargos } = useStore();

  const unpaidDeliveredCargos = useMemo(() => {
    return cargos.filter(cargo => 
      cargo.status === 'delivered'
    );
  }, [cargos]);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Unpaid Delivered Cargos
      </Typography>
      <Box sx={{ mt: 2 }}>
        <CargoList 
          customCargos={unpaidDeliveredCargos}
          hideDateFilter={true}
          hideStatusFilter={true}
        />
      </Box>
    </Paper>
  );
}; 