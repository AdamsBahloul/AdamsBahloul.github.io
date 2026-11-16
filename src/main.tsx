import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { initGsap } from './animations/gsapConfig';
import { LenisProvider } from './hooks/useLenis';
import App from './App';
import '@fontsource-variable/geist';
import './styles/main.scss';

initGsap();
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
const themes = ['light', 'dark', 'red'] as const;
document.documentElement.dataset.theme = themes[Math.floor(Math.random() * themes.length)];

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LenisProvider><App /></LenisProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
