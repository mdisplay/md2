import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// import './index.css'
import { registerShortcuts } from './lib/shortcuts-manager.ts';

// import { AppDispatch, RootState } from './state/store';
// import { setTime } from './state/clock/clock-slice.ts';

registerShortcuts();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

const splash = document.getElementById('splash');
// const splashTimeout = 1000;
const splashTimeout = 0;

setTimeout(() => {
  if (splash) {
    splash.style.display = 'none';
  }
}, splashTimeout);
