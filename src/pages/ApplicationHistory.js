import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import UserProfileSidebar from '../components/UserProfileSidebar';
import { useNavigate } from 'react-router-dom';
import { applicationsAPI } from '../api/api';

const ApplicationHistory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await applicationsAPI.getApplications({ search: searchQuery });
      setApplications(data);
    } catch (err) {
      setError('Failed to load applications. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== '') {
        loadApplications();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <Box>
      <Header isAuthenticated={true} />
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 75%' } }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Application History
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Your applications history arranged from recent
            </Typography>

            <TextField
              fullWidth
              placeholder="Search For Applications Using Application Number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 4 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
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
                  No Application
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  You Currently have no applications
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/dashboard')}
                  sx={{ textTransform: 'none', px: 4 }}
                >
                  Make An Application
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {applications.map((app) => (
                  <Card key={app.id}>
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ mb: 1 }}>
                            {app.application_reference || `Application #${app.id}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {app.service_name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                              label={app.status}
                              size="small"
                              color={
                                app.status === 'approved'
                                  ? 'success'
                                  : app.status === 'rejected'
                                  ? 'error'
                                  : app.status === 'submitted'
                                  ? 'info'
                                  : 'default'
                              }
                            />
                            <Typography variant="caption" color="text.secondary">
                              Created: {new Date(app.created_at).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          variant="outlined"
                          onClick={() => navigate(`/application/${app.id}`)}
                          sx={{ textTransform: 'none' }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
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

export default ApplicationHistory;

