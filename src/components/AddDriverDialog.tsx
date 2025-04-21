import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  useTheme,
  alpha,
} from '@mui/material';
import { useStore } from '../store';
import { Driver, User } from '../types';
import { getAllUsers } from '../services/firebase';

interface AddDriverDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AddDriverDialog: React.FC<AddDriverDialogProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const addDriver = useStore((state) => state.addDriver);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [logId, setLogId] = useState('');
  const [ownerId, setOwnerId] = useState('all'); // 'all' or user ID
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      // Load users when dialog opens
      getAllUsers().then(users => {
        setUsers(users);
      });
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name || !phone || !homeCity || !logId) {
      setError('Please fill in all fields');
      return;
    }

    const driver: Omit<Driver, 'id'> = {
      name,
      phone,
      homeCity,
      logid: logId.toLowerCase(),
      ownerId: ownerId === 'all' ? 'all' : ownerId,
    };

    await addDriver(driver);
    setName('');
    setPhone('');
    setHomeCity('');
    setLogId('');
    setOwnerId('all');
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
            label="Login ID"
            fullWidth
            value={logId}
            onChange={(e) => setLogId(e.target.value)}
            error={error === 'Login ID is required'}
            helperText={error === 'Login ID is required' ? error : ''}
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
            value={homeCity}
            onChange={(e) => setHomeCity(e.target.value)}
            error={error === 'Home location is required'}
            helperText={error === 'Home location is required' ? error : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <FormControl fullWidth required>
            <InputLabel>Driver Owner</InputLabel>
            <Select
              value={ownerId}
              label="Driver Owner"
              onChange={(e) => setOwnerId(e.target.value)}
            >
              <MenuItem value="all">
                <em>All Users (Public)</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} {user.isAdmin ? '(Admin)' : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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