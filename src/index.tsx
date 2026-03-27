import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App';
import './index.css';
import { mockEnvReady } from './mockEnv';
import { init } from './init';

// Global error handler to prevent crashes
window.onerror = function (message, source, lineno, colno, error) {
  console.log('Global error:', message);
  return true;
};

window.onunhandledrejection = function (event) {
  console.log('Unhandled rejection:', event.reason);
  event.preventDefault();
};

// Initialize the app - wait for mock environment to be set up first
mockEnvReady.then(() => {
  return init();
}).then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch((error) => {
  console.error('Failed to initialize app:', error);
  // Still render the app even if init fails
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
