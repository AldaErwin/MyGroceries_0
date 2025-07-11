import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { DatabaseProvider } from './contexts/DatabaseContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <DatabaseProvider>
      <App />
    </DatabaseProvider>
  </React.StrictMode>,
);
