import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Link,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { authAPI, getErrorMessage } from '../api/api';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData.username, formData.password);
      
      // Get user info and store it
      const user = await authAPI.getCurrentUser();
      localStorage.setItem('user', JSON.stringify(user));
      
      // Trigger event to update user info in Header and other components
      window.dispatchEvent(new Event('userInfoUpdated'));
      
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err) || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Header />
      <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              py: 4,
              px: 3,
              textAlign: 'center',
              color: 'white',
            }}
          >
            <Box
              component="img"
              src="/car-emblem.png"
              alt="Central African Republic"
              sx={{
                width: { xs: 80, sm: 100 },
                height: { xs: 80, sm: 100 },
                mb: 2,
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Sign in to access all Government Services
            </Typography>
          </Box>

          <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Email Address or ID Number"
                  required
                  value={formData.username}
                  onChange={handleChange('username')}
                  placeholder="you@example.com or 112233445"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#1976d2',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#1976d2' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" component="label" htmlFor="password" sx={{ fontWeight: 600 }}>
                      Password
                    </Typography>
                    <Link
                      component="button"
                      type="button"
                      onClick={() => {}}
                      sx={{ 
                        fontSize: '0.875rem', 
                        textDecoration: 'none',
                        color: '#1976d2',
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>
                  <TextField
                    fullWidth
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    required
                    value={formData.password}
                    onChange={handleChange('password')}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#1976d2',
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#1976d2' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#1976d2' }}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                  sx={{
                    bgcolor: '#1976d2',
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                    '&:hover': {
                      bgcolor: '#1565c0',
                      boxShadow: '0 6px 16px rgba(25, 118, 210, 0.5)',
                    },
                    '&:disabled': {
                      bgcolor: '#90caf9',
                    },
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Box>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link
                    component="button"
                    onClick={() => navigate('/register')}
                    sx={{ 
                      fontWeight: 600,
                      color: '#1976d2',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Create an account
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SignIn;

