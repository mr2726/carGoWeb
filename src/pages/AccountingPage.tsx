import React, { useMemo, useState } from 'react';
import { Typography, Paper, Box, Grid, Card, CardContent, alpha, useTheme, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { CargoList } from '../components/CargoList';
import { useStore } from '../store';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { AttachMoney as MoneyIcon, LocalShipping as ShippingIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export const AccountingPage: React.FC = () => {
  const { cargos, drivers } = useStore();
  const theme = useTheme();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');

  const filteredCargos = useMemo(() => {
    let filtered = [...cargos];
    
    // Фильтр по водителю
    if (selectedDriverId) {
      filtered = filtered.filter(cargo => cargo.driverId === selectedDriverId);
    }
    
    // Фильтр по месяцу
    if (selectedMonth) {
      const monthStart = startOfMonth(selectedMonth);
      const monthEnd = endOfMonth(selectedMonth);
      filtered = filtered.filter(cargo => {
        const deliveryDate = parseISO(cargo.deliveryDateTime);
        return isWithinInterval(deliveryDate, { start: monthStart, end: monthEnd });
      });
    }
    
    // Фильтр по диапазону дат
    if (startDate && endDate) {
      filtered = filtered.filter(cargo => {
        const deliveryDate = parseISO(cargo.deliveryDateTime);
        return isWithinInterval(deliveryDate, { start: startDate, end: endDate });
      });
    }
    
    return filtered;
  }, [cargos, startDate, endDate, selectedMonth, selectedDriverId]);

  const financialStats = useMemo(() => {
    const nonCanceledCargos = filteredCargos.filter(cargo => cargo.status !== 'canceled');
    const totalRevenue = nonCanceledCargos.reduce((sum, cargo) => sum + Number(cargo.rate || 0), 0);
    
    const unpaidCargos = filteredCargos.filter(cargo => 
      cargo.status === 'delivered' // Only delivered but not paid
    );
    const unpaidAmount = unpaidCargos.reduce((sum, cargo) => 
      sum + Number(cargo.rate || 0), 0
    );
    
    const paidCargos = filteredCargos.filter(cargo => cargo.status === 'paid');
    const paidAmount = paidCargos.reduce((sum, cargo) => 
      sum + Number(cargo.rate || 0), 0
    );

    return {
      totalRevenue,
      totalCargos: nonCanceledCargos.length,
      unpaidAmount,
      unpaidCount: unpaidCargos.length,
      paidAmount,
      paidCount: paidCargos.length,
    };
  }, [filteredCargos]);

  const recentTransactions = useMemo(() => {
    return filteredCargos
      .filter(cargo => cargo.status === 'paid' || cargo.status === 'delivered')
      .sort((a, b) => new Date(b.deliveryDateTime).getTime() - new Date(a.deliveryDateTime).getTime())
      .slice(0, 5);
  }, [filteredCargos]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Accounting Dashboard
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DatePicker
              label="Select Month"
              value={selectedMonth}
              onChange={(newValue) => setSelectedMonth(newValue)}
              views={['year', 'month']}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <FormControl fullWidth>
              <InputLabel>Driver</InputLabel>
              <Select
                value={selectedDriverId}
                label="Driver"
                onChange={(e) => setSelectedDriverId(e.target.value)}
              >
                <MenuItem value="">
                  <em>All Drivers</em>
                </MenuItem>
                {drivers.map((driver) => (
                  <MenuItem key={driver.id} value={driver.id}>
                    {driver.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </LocalizationProvider>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MoneyIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Total Revenue
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>
                ${financialStats.totalRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {financialStats.totalCargos} cargoes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.dark, 0.1)} 100%)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShippingIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Unpaid Cargos
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: theme.palette.warning.main }}>
                ${financialStats.unpaidAmount.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {financialStats.unpaidCount} cargoes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.dark, 0.1)} 100%)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Paid Cargos
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: theme.palette.success.main }}>
                ${financialStats.paidAmount.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {financialStats.paidCount} cargoes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recent Transactions
        </Typography>
        <Box sx={{ mt: 2 }}>
          <CargoList 
            customCargos={recentTransactions}
            hideDateFilter={true}
            hideStatusFilter={true}
          />
        </Box>
      </Paper>
    </Box>
  );
}; 