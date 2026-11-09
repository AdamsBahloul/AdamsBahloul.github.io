import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { initGsap } from './animations/gsapConfig';
import { LenisProvider } from './hooks/useLenis';
import App from './App';
import '@fontsource-variable/geist';
import './styles/main.scss';

initGsap();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LenisProvider><App /></LenisProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
