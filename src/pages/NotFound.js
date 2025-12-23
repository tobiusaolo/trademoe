import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    // Go back in browser history if possible
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to home if no history
      navigate('/');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '6rem', md: '8rem' },
              fontWeight: 700,
              color: '#1976d2',
              mb: 2,
            }}
          >
            404
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: '#333',
            }}
          >
            Page Not Found
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              mb: 4,
            }}
          >
            The page you're looking for doesn't exist or has been moved.
          </Typography>
          {location.pathname !== '/' && (
            <Typography
              variant="body2"
              sx={{
                color: '#999',
                mb: 4,
                fontFamily: 'monospace',
              }}
            >
              Path: {location.pathname}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{
                textTransform: 'none',
                px: 3,
                py: 1.5,
              }}
            >
              Go Back
            </Button>
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{
                textTransform: 'none',
                px: 3,
                py: 1.5,
              }}
            >
              Go Home
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;

