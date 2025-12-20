import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import ApplicationHistory from './pages/ApplicationHistory';
import ApplicationForm from './pages/ApplicationForm';
import Notifications from './pages/Notifications';
import SignIn from './pages/SignIn';
import Register from './pages/Register';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
    },
    secondary: {
      main: '#2e7d32',
      dark: '#1b5e20',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/applications" element={<ApplicationHistory />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/application/:id" element={<ApplicationForm />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

