import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useStore } from './store';
import { initializeLocalStorage } from './services/initializeData';

// Initialize localStorage with mock data if empty
initializeLocalStorage();

// Initialize store by fetching data from localStorage
const store = useStore.getState();
store.fetchDrivers();
store.initializeSubscriptions();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 