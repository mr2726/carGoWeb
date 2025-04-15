import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useStore } from '../store';
import { Cargo, CargoStatus } from '../types';

interface CargoFormProps {
  initialData?: Cargo;
  onSubmit?: (cargo: Omit<Cargo, 'id'>) => void;
  mode?: 'create' | 'edit';
}

export const CargoForm: React.FC<CargoFormProps> = ({ 
  initialData, 
  onSubmit,
  mode = 'create' 
}) => {
  const navigate = useNavigate();
  const { drivers, cargos, addCargo, updateCargo } = useStore();
  const [formData, setFormData] = useState<Partial<Cargo>>({
    id: '',
    pickupLocation: '',
    deliveryLocation: '',
    pickupDateTime: new Date().toISOString(),
    deliveryDateTime: new Date().toISOString(),
    notes: '',
    status: 'booked',
    driverId: '',
    order: 0,
    rate: 0,
  });
  const [idError, setIdError] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field: keyof Cargo) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Check for duplicate ID when the ID field changes
    if (field === 'id') {
      const isDuplicate = cargos.some(cargo => cargo.id === value);
      setIdError(isDuplicate ? 'This ID already exists' : '');
    }
  };

  const handleDateChange = (field: 'pickupDateTime' | 'deliveryDateTime') => (
    date: Date | null
  ) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        [field]: date.toISOString(),
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (idError) {
      return; // Don't submit if there's an ID error
    }
    
    const cargoData: Omit<Cargo, 'id'> = {
      pickupLocation: formData.pickupLocation || '',
      deliveryLocation: formData.deliveryLocation || '',
      pickupDateTime: formData.pickupDateTime || new Date().toISOString(),
      deliveryDateTime: formData.deliveryDateTime || new Date().toISOString(),
      notes: formData.notes || '',
      status: (formData.status as CargoStatus) || 'booked',
      driverId: formData.driverId || '',
      order: formData.order || 0,
      rate: formData.rate || 0,
    };

    if (onSubmit) {
      onSubmit(cargoData);
    } else {
      if (mode === 'edit' && initialData) {
        await updateCargo(initialData.id, cargoData);
      } else {
        await addCargo({ ...cargoData, id: formData.id || Date.now().toString() });
      }
      navigate('/cargos');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Cargo ID"
            value={formData.id}
            onChange={handleChange('id')}
            error={!!idError}
            helperText={idError}
            disabled={mode === 'edit'}
            required={mode === 'create'}
            sx={{
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: '#666',
                fontFamily: 'monospace',
              }
            }}
          />
        </Grid>
        {mode === 'edit' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cargo ID"
              value={initialData?.id || ''}
              disabled
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#666',
                  fontFamily: 'monospace',
                }
              }}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Pickup Location"
            value={formData.pickupLocation}
            onChange={handleChange('pickupLocation')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Delivery Location"
            value={formData.deliveryLocation}
            onChange={handleChange('deliveryLocation')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Pickup Date/Time"
              value={new Date(formData.pickupDateTime || '')}
              onChange={handleDateChange('pickupDateTime')}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Delivery Date/Time"
              value={new Date(formData.deliveryDateTime || '')}
              onChange={handleDateChange('deliveryDateTime')}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={4}
            value={formData.notes}
            onChange={handleChange('notes')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            select
            label="Driver"
            value={formData.driverId}
            onChange={handleChange('driverId')}
          >
            {drivers.map((driver) => (
              <MenuItem key={driver.id} value={driver.id}>
                {driver.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            select
            label="Status"
            value={formData.status}
            onChange={handleChange('status')}
          >
            <MenuItem value="booked">Booked</MenuItem>
            <MenuItem value="dispatched">Dispatched</MenuItem>
            <MenuItem value="pickedup">Picked Up</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="TONU">TONU</MenuItem>
            <MenuItem value="canceled">Canceled</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            type="number"
            label="Rate ($)"
            value={formData.rate}
            onChange={handleChange('rate')}
            InputProps={{
              startAdornment: '$',
              inputProps: { min: 0 }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/cargos')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {mode === 'edit' ? 'Update Cargo' : 'Create Cargo'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}; 