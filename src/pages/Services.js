import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import UserProfileSidebar from '../components/UserProfileSidebar';
import { useNavigate } from 'react-router-dom';
import { servicesAPI } from '../api/api';

const Services = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await servicesAPI.getServices();
      setServices(data);
    } catch (err) {
      setError('Failed to load services. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (serviceId) => {
    navigate(`/application/${serviceId}`);
  };

  return (
    <Box>
      <Header isAuthenticated={true} />
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 75%' } }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Services
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Browse and apply for available services
            </Typography>

            <TextField
              fullWidth
              placeholder="Search For Service Using Service Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {services
                  .filter((service) =>
                    service.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((service) => (
                    <Box key={service.id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: { xs: '100%', sm: '300px' } }}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 1 }}>
                            {service.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {service.description || 'No description available'}
                          </Typography>
                          <Button
                            variant="contained"
                            onClick={() => handleApply(service.id)}
                            sx={{ textTransform: 'none' }}
                          >
                            Apply
                          </Button>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                {services.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4, width: '100%' }}>
                    No services available
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 25%' } }}>
            <UserProfileSidebar />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Services;

