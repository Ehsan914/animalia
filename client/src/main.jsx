import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/global.css';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            border: '4px solid #3E8E41',
            boxShadow: '4px 4px 0px #000',
            borderRadius: '0px',
            fontFamily: 'Nunito',
            fontWeight: '600',
            fontSize: '14px',
            background: '#fff',
          },
          error: {
            style: {
              border: '4px solid #CC3E41',
              background: '#fff',
            },
            iconTheme: {
              primary: '#ff4444',
              secondary: '#fff',
            },
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
        }}
      />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
