import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { isProduction } from 'common/utils/env.util.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  isProduction() ? (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    <App />
  ),
);
