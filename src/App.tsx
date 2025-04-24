import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider, createTheme, CircularProgress, Box } from '@mui/material';
import { DriversPage } from './pages/DriversPage';
import { AllCargosPage } from './pages/AllCargosPage';
import { DriverCargosPage } from './pages/DriverCargosPage';
import { CreateCargoPage } from './pages/CreateCargoPage';
import { UnpaidDeliveredCargosPage } from './pages/UnpaidDeliveredCargosPage';
import { AccountingPage } from './pages/AccountingPage';
import { LoginPage } from './pages/LoginPage';
import { Navigation } from './components/Navigation';
import { useStore } from './store';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
          borderRadius: '1rem',
          backgroundColor: '#1e293b',
          marginTop: '2rem',
          marginBottom: '2rem',
          padding: '2rem !important',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
  },
});

function App() {
  const { fetchDrivers, fetchCargos, isLoading, initializeSubscriptions } = useStore();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isAuthLoading, setIsAuthLoading] = React.useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const loadData = async () => {
        try {
          // console.log('Starting to load data...');
          await Promise.all([
            fetchDrivers(),
            fetchCargos()
          ]);
          // console.log('Initial data loaded successfully');
        } catch (error) {
          console.error('Error loading initial data:', error);
        }
      };
      
      loadData();
      
      try {
        // console.log('Initializing subscriptions...');
        const cleanup = initializeSubscriptions();
        // console.log('Subscriptions initialized successfully');
        
        return () => {
          // console.log('Cleaning up subscriptions...');
          cleanup();
        };
      } catch (error) {
        console.error('Error initializing subscriptions:', error);
      }
    }
  }, [isAuthenticated]);

  if (isAuthLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
        }}
      >
        <Router>
          {isAuthenticated && <Navigation />}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Container
              maxWidth="lg" 
              sx={{ 
                mt: 4,
                width: '100%',
                animation: 'fadeIn 0.5s ease-in-out',
                '@keyframes fadeIn': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(10px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <Routes>
                <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/" element={isAuthenticated ? <DriversPage /> : <Navigate to="/login" />} />
                <Route path="/cargos" element={isAuthenticated ? <AllCargosPage /> : <Navigate to="/login" />} />
                <Route path="/create-cargo" element={isAuthenticated ? <CreateCargoPage /> : <Navigate to="/login" />} />
                <Route path="/driver/:driverId" element={isAuthenticated ? <DriverCargosPage /> : <Navigate to="/login" />} />
                <Route path="/unpaid-delivered" element={isAuthenticated ? <UnpaidDeliveredCargosPage /> : <Navigate to="/login" />} />
                <Route path="/accounting" element={isAuthenticated ? <AccountingPage /> : <Navigate to="/login" />} />
              </Routes>
            </Container>
          </Box>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App; 