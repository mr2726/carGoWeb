import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  alpha, 
  useTheme,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon, PersonAdd } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const LoginPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    setLoading(true);

    if (!name && isRegistering) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        name,
        isAdmin: false
      });
      
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    setError('');
    setLoading(true);

    if (!name) {
      setError('Please enter admin name');
      setLoading(false);
      return;
    }

    try {
      const adminName = name;
      const email = `admin${Date.now()}@example.com`;
      const password = 'admin123';
      
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        name: adminName,
        isAdmin: true
      });
      
      alert(`Admin account created successfully!\nName: ${adminName}\nEmail: ${email}\nPassword: admin123`);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create admin account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
        overflow: 'hidden',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          width: 360,
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
            }}
          >
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: alpha(theme.palette.text.secondary, 0.8),
              textAlign: 'center',
            }}
          >
            {isRegistering ? 'Sign up to get started' : 'Sign in to access your account'}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          {isRegistering && (
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 1.5 }}
              InputProps={{
                sx: {
                  borderRadius: 1,
                  background: alpha(theme.palette.background.paper, 0.5),
                },
              }}
            />
          )}

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 1.5 }}
            InputProps={{
              sx: {
                borderRadius: 1,
                background: alpha(theme.palette.background.paper, 0.5),
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              sx: {
                borderRadius: 1,
                background: alpha(theme.palette.background.paper, 0.5),
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={isRegistering ? handleRegister : handleLogin}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : (isRegistering ? <PersonAdd /> : <LoginIcon />)}
            sx={{
              mb: 1.5,
              py: 1,
              borderRadius: 1,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              },
            }}
          >
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => setIsRegistering(!isRegistering)}
            disabled={loading}
            startIcon={isRegistering ? <LoginIcon /> : <PersonAdd />}
            sx={{
              py: 1,
              borderRadius: 1,
              borderColor: alpha(theme.palette.primary.main, 0.5),
              color: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                background: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            {isRegistering ? 'Back to Login' : 'Create Account'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}; 