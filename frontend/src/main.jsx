import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';
import { AuthProvider } from './AuthContext';
import './styles.css';

const theme = createTheme({ palette: { mode: 'light', primary: { main: '#bd9145' }, secondary: { main: '#292230' }, background: { default: '#f8f4ed', paper: '#fffdf9' }, text: { primary: '#292230', secondary: '#77716b' } }, typography: { fontFamily: 'Georgia, "Times New Roman", serif', button: { textTransform: 'none', fontWeight: 700 } }, shape: { borderRadius: 12 } });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
