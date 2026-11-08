import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppProviders from './providers/AppProviders';
import AppRouter from './router';

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AppProviders>
  );
}

