import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Global error handler to prevent crashes
window.onerror = function (message, source, lineno, colno, error) {
  console.log('Global error:', message);
  return true;
};

window.onunhandledrejection = function (event) {
  console.log('Unhandled rejection:', event.reason);
  event.preventDefault();
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
