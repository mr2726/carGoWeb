import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import { useStore } from '../store';

interface AddDriverDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AddDriverDialog: React.FC<AddDriverDialogProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const addDriver = useStore((state) => state.addDriver);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [homeLocation, setHomeLocation] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }
    if (!homeLocation.trim()) {
      setError('Home location is required');
      return;
    }

    addDriver({
      name: name.trim(),
      phone: phone.trim(),
      homeCity: homeLocation.trim(),
    });

    setName('');
    setPhone('');
    setHomeLocation('');
    setError(null);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: `linear-gradient(${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.9)})`,
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          width: '100%',
          maxWidth: 500,
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Add New Driver
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Driver Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error === 'Name is required'}
            helperText={error === 'Name is required' ? error : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <TextField
            label="Phone Number"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={error === 'Phone number is required'}
            helperText={error === 'Phone number is required' ? error : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <TextField
            label="Home Location"
            fullWidth
            value={homeLocation}
            onChange={(e) => setHomeLocation(e.target.value)}
            error={error === 'Home location is required'}
            helperText={error === 'Home location is required' ? error : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            px: 3,
            borderColor: alpha(theme.palette.divider, 0.1),
            '&:hover': {
              borderColor: alpha(theme.palette.divider, 0.2),
              background: alpha(theme.palette.divider, 0.05),
            },
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 3,
            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
            boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.25)}`,
            color: '#fff',
            '&:hover': {
              boxShadow: `0 6px 16px ${alpha(theme.palette.secondary.main, 0.35)}`,
            },
          }}
        >
          Add Driver
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 