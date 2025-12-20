import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import UserProfileSidebar from '../components/UserProfileSidebar';
import { useNavigate } from 'react-router-dom';
import { servicesAPI, applicationsAPI } from '../api/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [servicesData, applicationsData] = await Promise.all([
        servicesAPI.getServices(),
        applicationsAPI.getApplications({ limit: 5 }),
      ]);
      setServices(servicesData);
      setApplications(applicationsData);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Featured Services" />
                <Tab label="Recent Applications" />
              </Tabs>
            </Box>

            {tabValue === 0 && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Featured Services
                  </Typography>
                  <Button variant="text" sx={{ textTransform: 'none' }}>
                    View All
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  These are featured services
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {services
                      .filter((service) =>
                        service.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((service) => (
                        <Card key={service.id}>
                          <CardContent>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Box>
                                <Typography variant="h6">{service.name}</Typography>
                                {service.description && (
                                  <Typography variant="body2" color="text.secondary">
                                    {service.description}
                                  </Typography>
                                )}
                              </Box>
                              <Button
                                variant="contained"
                                onClick={() => handleApply(service.id)}
                                sx={{ textTransform: 'none' }}
                              >
                                Apply
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    {services.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        No services available
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Recent Applications
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/applications')}
                    sx={{ textTransform: 'none' }}
                  >
                    View History
                  </Button>
                </Box>

                <TextField
                  fullWidth
                  placeholder="Search For Applications Using Application Number..."
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
                ) : applications.length === 0 ? (
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 8,
                      bgcolor: '#f5f5f5',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                      No Applications
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      Currently there are no Applications available for you
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/services')}
                      sx={{ textTransform: 'none' }}
                    >
                      Create Application
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {applications
                      .filter((app) =>
                        app.application_reference?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((app) => (
                        <Card key={app.id}>
                          <CardContent>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Box>
                                <Typography variant="h6">
                                  {app.application_reference || `Application #${app.id}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {app.service_name} • Status: {app.status}
                                </Typography>
                              </Box>
                              <Button
                                variant="outlined"
                                onClick={() => navigate(`/application/${app.id}`)}
                                sx={{ textTransform: 'none' }}
                              >
                                View
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                  </Box>
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

export default Dashboard;

