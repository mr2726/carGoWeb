import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  alpha,
  useTheme,
  Tooltip,
  Button,
  Badge,
  IconButton,
  Avatar,
  Divider,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AddIcon from '@mui/icons-material/Add';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import PaymentIcon from '@mui/icons-material/Payment';
import { AccountBalance as AccountBalanceIcon } from '@mui/icons-material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useStore } from '../store';
import { AddDriverDialog } from './AddDriverDialog';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

const DRAWER_WIDTH = 240;
const DRAWER_WIDTH_COLLAPSED = 73;

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { cargos, currentUser } = useStore();
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // console.log('Navigation render - currentUser:', currentUser);
  // console.log('Is admin check:', currentUser?.isAdmin);

  useEffect(() => {
    // console.log('Navigation useEffect - currentUser:', currentUser);
  }, [currentUser]);

  const isActive = (path: string) => location.pathname === path;

  const activeCargosCount = cargos.filter(
    cargo => cargo.status === 'dispatched' || cargo.status === 'pickedup'
  ).length;

  const bookedCargosCount = cargos.filter(
    cargo => cargo.status === 'booked'
  ).length;

  const unpaidDeliveredCount = cargos.filter(
    cargo => cargo.status === 'delivered'
  ).length;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: isExpanded ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isExpanded ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
            boxSizing: 'border-box',
            background: theme.palette.background.paper,
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            display: 'flex',
            flexDirection: 'column',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        <Box
          sx={{
            p: isExpanded ? 3 : 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            gap: 2,
            cursor: 'pointer',
          }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '14px',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
                },
                '50%': {
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
                '100%': {
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
                },
              },
            }}
          >
            <DirectionsCarIcon sx={{ color: 'white', fontSize: 26 }} />
          </Box>
          {isExpanded && (
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px',
              }}
            >
              CarGo
            </Typography>
          )}
        </Box>

        <List sx={{ flex: 1 }}>
          <Tooltip title={!isExpanded ? "Drivers" : ""} placement="right">
            <ListItem
              button
              onClick={() => navigate('/')}
              sx={{
                borderRadius: '12px',
                mb: 1,
                background: isActive('/') ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                color: isActive('/') ? theme.palette.primary.main : theme.palette.text.primary,
                justifyContent: isExpanded ? 'flex-start' : 'center',
                px: isExpanded ? 2 : 1,
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.05),
                  color: theme.palette.primary.main,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: isExpanded ? 40 : 'auto' }}>
                <DirectionsCarIcon
                  sx={{
                    color: isActive('/') ? theme.palette.primary.main : theme.palette.text.primary,
                  }}
                />
              </ListItemIcon>
              {isExpanded && <ListItemText primary="Drivers" />}
            </ListItem>
          </Tooltip>

          <Tooltip title={!isExpanded ? "Cargos" : ""} placement="right">
            <ListItem
              button
              onClick={() => navigate('/cargos')}
              sx={{
                borderRadius: '12px',
                mb: 1,
                background: isActive('/cargos') ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                color: isActive('/cargos') ? theme.palette.primary.main : theme.palette.text.primary,
                justifyContent: isExpanded ? 'flex-start' : 'center',
                px: isExpanded ? 2 : 1,
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.05),
                  color: theme.palette.primary.main,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: isExpanded ? 40 : 'auto' }}>
                <Badge
                  badgeContent={activeCargosCount + bookedCargosCount}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      animation: activeCargosCount + bookedCargosCount > 0 ? 'bounce 1s infinite' : 'none',
                      right: isExpanded ? -8 : -4,
                      top: isExpanded ? 4 : 2,
                      '@keyframes bounce': {
                        '0%, 100%': {
                          transform: 'scale(1) translate(50%, -50%)',
                        },
                        '50%': {
                          transform: 'scale(1.1) translate(50%, -50%)',
                        },
                      },
                    },
                  }}
                >
                  <LocalShippingIcon
                    sx={{
                      color: isActive('/cargos') ? theme.palette.primary.main : theme.palette.text.primary,
                    }}
                  />
                </Badge>
              </ListItemIcon>
              {isExpanded && <ListItemText primary="Cargos" />}
            </ListItem>
          </Tooltip>

          <Tooltip title={!isExpanded ? "Unpaid Delivered" : ""} placement="right">
            <ListItem
              button
              onClick={() => navigate('/unpaid-delivered')}
              sx={{
                borderRadius: '12px',
                mb: 1,
                background: isActive('/unpaid-delivered') ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                color: isActive('/unpaid-delivered') ? theme.palette.primary.main : theme.palette.text.primary,
                justifyContent: isExpanded ? 'flex-start' : 'center',
                px: isExpanded ? 2 : 1,
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.05),
                  color: theme.palette.primary.main,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: isExpanded ? 40 : 'auto' }}>
                <Badge
                  badgeContent={unpaidDeliveredCount}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      animation: unpaidDeliveredCount > 0 ? 'bounce 1s infinite' : 'none',
                      right: isExpanded ? -8 : -4,
                      top: isExpanded ? 4 : 2,
                      '@keyframes bounce': {
                        '0%, 100%': {
                          transform: 'scale(1) translate(50%, -50%)',
                        },
                        '50%': {
                          transform: 'scale(1.1) translate(50%, -50%)',
                        },
                      },
                    },
                  }}
                >
                  <PaymentIcon
                    sx={{
                      color: isActive('/unpaid-delivered') ? theme.palette.primary.main : theme.palette.text.primary,
                    }}
                  />
                </Badge>
              </ListItemIcon>
              {isExpanded && <ListItemText primary="Unpaid Delivered" />}
            </ListItem>
          </Tooltip>

          <Tooltip title={!isExpanded ? "Accounting" : ""} placement="right">
            <ListItem
              button
              onClick={() => navigate('/accounting')}
              sx={{
                borderRadius: '12px',
                mb: 1,
                background: isActive('/accounting') ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                color: isActive('/accounting') ? theme.palette.primary.main : theme.palette.text.primary,
                justifyContent: isExpanded ? 'flex-start' : 'center',
                px: isExpanded ? 2 : 1,
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.05),
                  color: theme.palette.primary.main,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: isExpanded ? 40 : 'auto' }}>
                <AccountBalanceIcon
                  sx={{
                    color: isActive('/accounting') ? theme.palette.primary.main : theme.palette.text.primary,
                  }}
                />
              </ListItemIcon>
              {isExpanded && <ListItemText primary="Accounting" />}
            </ListItem>
          </Tooltip>
        </List>

        <Box sx={{ p: 2 }}>
          <Tooltip title={!isExpanded ? "Add Cargo" : ""} placement="right">
            <Button
              fullWidth
              startIcon={isExpanded ? <AddIcon /> : undefined}
              onClick={() => navigate('/create-cargo')}
              sx={{
                py: 1.2,
                minWidth: 'auto',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
                color: '#fff',
                justifyContent: 'center',
                mb: 2,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.35)}`,
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              {!isExpanded ? <AddIcon /> : "Add Cargo"}
            </Button>
          </Tooltip>

          {currentUser?.isAdmin && (
            <Tooltip title={!isExpanded ? "Add Driver" : ""} placement="right">
              <Button
                fullWidth
                startIcon={isExpanded ? <PersonAddIcon /> : undefined}
                onClick={() => setIsAddDriverOpen(true)}
                sx={{
                  py: 1.2,
                  minWidth: 'auto',
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.secondary.main, 0.25)}`,
                  color: '#fff',
                  justifyContent: 'center',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 28px ${alpha(theme.palette.secondary.main, 0.35)}`,
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                {!isExpanded ? <PersonAddIcon /> : "Add Driver"}
              </Button>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1) }} />

        <Box sx={{ p: 2 }}>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              borderRadius: '12px',
              background: 'transparent',
              color: theme.palette.text.primary,
              justifyContent: isExpanded ? 'flex-start' : 'center',
              px: isExpanded ? 2 : 1,
              '&:hover': {
                background: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: isExpanded ? 40 : 'auto' }}>
              <LogoutIcon
                sx={{
                  color: 'inherit',
                }}
              />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Logout" />}
          </ListItem>
        </Box>
      </Drawer>

      <AddDriverDialog
        open={isAddDriverOpen}
        onClose={() => setIsAddDriverOpen(false)}
      />
    </>
  );
};