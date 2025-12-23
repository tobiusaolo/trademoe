import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
import NotFound from './pages/NotFound';
import { setNavigate } from './utils/navigation';

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

// Inner component to access useNavigate hook
const AppRoutes = () => {
  const navigate = useNavigate();
  
  // Set navigate function for use in API interceptors
  React.useEffect(() => {
    setNavigate(navigate);
    
    // Listen for custom navigation events from API interceptors
    const handleNavigateEvent = (event) => {
      const { path, options } = event.detail;
      navigate(path, options);
    };
    
    window.addEventListener('navigateTo', handleNavigateEvent);
    
    return () => {
      window.removeEventListener('navigateTo', handleNavigateEvent);
      setNavigate(null); // Clean up
    };
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/services" element={<Services />} />
      <Route path="/applications" element={<ApplicationHistory />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/application/:id" element={<ApplicationForm />} />
      {/* Catch-all route for 404 - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;

