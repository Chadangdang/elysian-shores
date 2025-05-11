import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/variables.css';
import './styles/global.css';
import App from './App';
import '@fortawesome/fontawesome-free/css/brands.min.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

serviceWorkerRegistration.unregister();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
