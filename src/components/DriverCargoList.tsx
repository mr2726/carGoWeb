import React, { useState } from 'react';
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
  driverId: string | undefined;
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
  const { cargos, updateCargoOrder } = useStore();
  const [activeTab, setActiveTab] = useState(0);

  if (!driverId) return null;

  const driverCargos = cargos
    .filter((cargo) => cargo.driverId === driverId)
    .sort((a, b) => a.order - b.order);

  const activeCargos = driverCargos.filter(
    (cargo) => cargo.status === 'dispatched' || cargo.status === 'pickedup'
  );
  const bookedCargos = driverCargos.filter(
    (cargo) => cargo.status === 'booked'
  );
  const historyCargos = driverCargos.filter(
    (cargo) => 
      cargo.status !== 'dispatched' && 
      cargo.status !== 'pickedup' && 
      cargo.status !== 'booked'
  );

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

    if (over && active.id !== over.id) {
      const oldIndex = driverCargos.findIndex((cargo) => cargo.id === active.id);
      const newIndex = driverCargos.findIndex((cargo) => cargo.id === over.id);

      const newOrder = arrayMove(driverCargos, oldIndex, newIndex).map((cargo, index) => ({
        ...cargo,
        order: index + 1,
      }));

      newOrder.forEach((cargo) => {
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
                {driverCargos.filter(cargo => cargo.status === 'dispatched' || cargo.status === 'pickedup').length > 0 && (
                  <Chip 
                    label={driverCargos.filter(cargo => cargo.status === 'dispatched' || cargo.status === 'pickedup').length} 
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
                {driverCargos.filter(cargo => cargo.status === 'booked').length > 0 && (
                  <Chip 
                    label={driverCargos.filter(cargo => cargo.status === 'booked').length} 
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
                {driverCargos.filter(cargo => cargo.status !== 'dispatched' && cargo.status !== 'pickedup' && cargo.status !== 'booked').length > 0 && (
                  <Chip 
                    label={driverCargos.filter(cargo => cargo.status !== 'dispatched' && cargo.status !== 'pickedup' && cargo.status !== 'booked').length} 
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
          <SortableContext items={driverCargos.filter(cargo => cargo.status === 'dispatched' || cargo.status === 'pickedup')} strategy={verticalListSortingStrategy}>
            <Box 
              sx={{ 
                minHeight: 100,
                flex: 1,
                background: 'transparent',
              }}
            >
              {driverCargos.filter(cargo => cargo.status === 'dispatched' || cargo.status === 'pickedup').length === 0 ? (
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
                driverCargos.filter(cargo => cargo.status === 'dispatched' || cargo.status === 'pickedup').map((cargo) => (
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
          {driverCargos.filter(cargo => cargo.status === 'booked').length === 0 ? (
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