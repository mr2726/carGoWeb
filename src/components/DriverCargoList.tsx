import React, { useEffect } from 'react';
import { Box, Typography, Paper, alpha, Tabs, Tab, Chip, useTheme } from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableCargoItem } from './SortableCargoItem';
import { Cargo } from '../types';
import { useStore } from '../store';

interface DriverCargoListProps {
  driverId: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const theme = useTheme();

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`cargo-tabpanel-${index}`}
      aria-labelledby={`cargo-tab-${index}`}
      sx={{
        background: 'transparent',
      }}
      {...other}
    >
      {value === index && (
        <Box 
          sx={{ 
            py: 2,
            background: 'transparent',
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
}

export const DriverCargoList: React.FC<DriverCargoListProps> = ({ driverId }) => {
  const theme = useTheme();
  const { cargos, updateCargoOrder, initializeSubscriptions } = useStore();
  const [activeTab, setActiveTab] = React.useState(0);

  useEffect(() => {
    console.log('DriverCargoList: Initializing subscriptions');
    const cleanup = initializeSubscriptions();
    return () => {
      console.log('DriverCargoList: Cleaning up subscriptions');
      cleanup();
    };
  }, [initializeSubscriptions]);

  useEffect(() => {
    console.log('DriverCargoList: Cargos updated:', cargos);
  }, [cargos]);

  // Получаем все грузы водителя
  const driverCargos = cargos.filter((cargo) => cargo.driverId === driverId);
  console.log('DriverCargoList: Filtered driver cargos:', driverCargos);
  
  // Получаем только активные грузы (dispatched и pickedup)
  const activeCargos = driverCargos.filter(
    (cargo) => cargo.status === 'dispatched' || cargo.status === 'pickedup'
  ).sort((a, b) => (a.order || 0) - (b.order || 0));
  console.log('DriverCargoList: Active cargos:', activeCargos);
  
  // Получаем забронированные грузы
  const bookedCargos = driverCargos.filter(
    (cargo) => cargo.status === 'booked'
  ).sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // Получаем историю грузов
  const historyCargos = driverCargos.filter(
    (cargo) => 
      cargo.status !== 'dispatched' && 
      cargo.status !== 'pickedup' && 
      cargo.status !== 'booked'
  ).sort((a, b) => (a.order || 0) - (b.order || 0));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('Drag end event:', { active, over });

    if (over && active.id !== over.id) {
      console.log('Starting cargo reorder...');
      // Находим индексы только среди активных грузов
      const oldIndex = activeCargos.findIndex((cargo) => cargo.id === active.id);
      const newIndex = activeCargos.findIndex((cargo) => cargo.id === over.id);
      console.log('Indices:', { oldIndex, newIndex });

      // Перемещаем только активные грузы
      const newOrder = arrayMove(activeCargos, oldIndex, newIndex).map((cargo, index) => ({
        ...cargo,
        order: index + 1, // Начинаем с 1
      }));
      console.log('New cargo order:', newOrder);

      // Обновляем порядок только для активных грузов
      newOrder.forEach((cargo) => {
        console.log('Updating cargo order:', { id: cargo.id, order: cargo.order });
        updateCargoOrder(cargo.id, cargo.order);
      });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Paper
      sx={{
        p: 3,
        background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.6)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box 
        sx={{ 
          borderBottom: 1, 
          borderColor: alpha(theme.palette.divider, 0.1), 
          mb: 2,
        }}
      >
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              minWidth: 120,
              color: alpha(theme.palette.text.primary, 0.7),
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Active Cargos
                {activeCargos.length > 0 && (
                  <Chip 
                    label={activeCargos.length} 
                    size="small" 
                    color="primary"
                    sx={{ 
                      height: 20, 
                      fontSize: '0.75rem',
                      background: alpha(theme.palette.primary.main, 0.1),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      '& .MuiChip-label': {
                        color: theme.palette.primary.light,
                      },
                    }}
                  />
                )}
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Booked
                {bookedCargos.length > 0 && (
                  <Chip 
                    label={bookedCargos.length} 
                    size="small" 
                    color="info"
                    sx={{ 
                      height: 20, 
                      fontSize: '0.75rem',
                      background: alpha(theme.palette.info.main, 0.1),
                      border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                      '& .MuiChip-label': {
                        color: theme.palette.info.light,
                      },
                    }}
                  />
                )}
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                History
                {historyCargos.length > 0 && (
                  <Chip 
                    label={historyCargos.length} 
                    size="small" 
                    color="default"
                    sx={{ 
                      height: 20, 
                      fontSize: '0.75rem',
                      background: alpha(theme.palette.text.primary, 0.1),
                      border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
                      '& .MuiChip-label': {
                        color: alpha(theme.palette.text.primary, 0.7),
                      },
                    }}
                  />
                )}
              </Box>
            } 
          />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={activeCargos.map(cargo => cargo.id)} strategy={verticalListSortingStrategy}>
            <Box 
              sx={{ 
                minHeight: 100,
                flex: 1,
                background: 'transparent',
              }}
            >
              {activeCargos.length === 0 ? (
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    fontStyle: 'italic',
                    color: alpha(theme.palette.text.secondary, 0.8),
                  }}
                >
                  No active cargos
                </Typography>
              ) : (
                activeCargos.map((cargo) => (
                  <SortableCargoItem key={cargo.id} cargo={cargo} />
                ))
              )}
            </Box>
          </SortableContext>
        </DndContext>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Box 
          sx={{ 
            minHeight: 100,
            flex: 1,
            background: 'transparent',
          }}
        >
          {bookedCargos.length === 0 ? (
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                py: 4,
                fontStyle: 'italic',
                color: alpha(theme.palette.text.secondary, 0.8),
              }}
            >
              No booked cargos
            </Typography>
          ) : (
            bookedCargos.map((cargo) => (
              <SortableCargoItem key={cargo.id} cargo={cargo} />
            ))
          )}
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Box 
          sx={{ 
            minHeight: 100,
            flex: 1,
            background: 'transparent',
          }}
        >
          {historyCargos.length === 0 ? (
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                py: 4,
                fontStyle: 'italic',
                color: alpha(theme.palette.text.secondary, 0.8),
              }}
            >
              No history cargos
            </Typography>
          ) : (
            historyCargos.map((cargo) => (
              <SortableCargoItem key={cargo.id} cargo={cargo} />
            ))
          )}
        </Box>
      </TabPanel>
    </Paper>
  );
}; 