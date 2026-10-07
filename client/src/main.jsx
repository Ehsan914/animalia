import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './styles/global.css';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              border: '1px solid rgba(25, 47, 90, 0.16)',
              boxShadow: '0 3px 0 #0b1730',
              borderRadius: '16px',
              fontFamily: 'Figtree, system-ui, sans-serif',
              fontWeight: '500',
              fontSize: '15px',
              color: '#0f1d3a',
              background: '#fff',
            },
            error: {
              iconTheme: {
                primary: '#d2452f',
                secondary: '#fff',
              },
            },
            success: {
              iconTheme: {
                primary: '#192f5a',
                secondary: '#fff',
              },
            },
          }}
        />
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
