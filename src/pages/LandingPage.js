import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Link,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ComputerIcon from '@mui/icons-material/Computer';
import DownloadIcon from '@mui/icons-material/Download';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <LockIcon sx={{ fontSize: 60 }} />,
      title: 'Create account',
      description:
        'Take a few seconds to get yourself signed up. All you need is your ID for citizens and residents and Passport Number for foreigners.',
      color: '#ff9800',
    },
    {
      icon: <ComputerIcon sx={{ fontSize: 60 }} />,
      title: 'Apply for service',
      description:
        'Find the service you need, fill the application form then pay service fees using mobile money, Cards and online banking from local banks.',
      color: '#2196f3',
    },
    {
      icon: <DownloadIcon sx={{ fontSize: 60 }} />,
      title: 'Download Permit',
      description:
        'Receive email and sms notification every time your application has progressed. receive your permit in PDF format from wherever you are.',
      color: '#4caf50',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#eef2f7' }}>
      <Header />
      
      {/* Hero Section - SSERIES Style */}
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Left Section - Marketing/Information (2/3 width) */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '0 0 66.666%' },
            background: 'linear-gradient(180deg, #1565c0 0%, #1976d2 50%, #42a5f5 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: { xs: 3, md: 6, lg: 8 },
            py: { xs: 6, md: 8 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Pattern Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
            }}
          />

          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            {/* Logo and Branding */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box
                component="img"
                src="/car-emblem.png"
                alt="Central African Republic"
                sx={{
                  width: { xs: 50, md: 60 },
                  height: { xs: 50, md: 60 },
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)',
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                }}
              >
                Ministry of Trade & Industry
              </Typography>
            </Box>

            {/* Main Headline */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                fontWeight: 800,
                color: 'white',
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              Making Trade Services{' '}
              <Box
                component="span"
                sx={{
                  color: '#ffa726',
                  display: 'inline-block',
                }}
              >
                Swift
              </Box>
            </Typography>

            {/* Sub-headline */}
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: 'rgba(255, 255, 255, 0.95)',
                mb: 6,
                maxWidth: '600px',
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              Our platform helps Central African Republic businesses and individuals stay compliant, save time, and grow with confidence.
            </Typography>

            {/* 3 Simple Steps Section */}
            <Box sx={{ maxWidth: '600px' }}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  color: 'white',
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                3 Simple Steps to Start
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {[
                  'Login with your credentials',
                  'Apply for your service in less than 5 minutes',
                  'Track and receive your permit',
                ].map((step, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 32, md: 40 },
                        height: { xs: 32, md: 40 },
                        borderRadius: '50%',
                        bgcolor: '#ffa726',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: { xs: '1rem', md: '1.25rem' },
                        fontWeight: 700,
                        color: 'white',
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography
                      sx={{
                        color: 'white',
                        fontSize: { xs: '1rem', md: '1.125rem' },
                        fontWeight: 400,
                      }}
                    >
                      {step}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Right Section - Access Card (1/3 width) */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '0 0 33.333%' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            px: { xs: 3, md: 4 },
            py: { xs: 6, md: 8 },
          }}
        >
          <Card
            sx={{
              width: '100%',
              maxWidth: '450px',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              overflow: 'visible',
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              {/* Title */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  fontSize: { xs: '1.75rem', md: '2rem' },
                  color: '#1a1a1a',
                }}
              >
                Access Trade Services
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: '#666',
                  mb: 4,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                }}
              >
                Your digital partner for seamless trade compliance in Central African Republic.
              </Typography>

              {/* Citizen/Resident Option */}
              <Card
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  border: '2px solid #e0e0e0',
                  '&:hover': {
                    borderColor: '#1976d2',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                  },
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/signin')}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: '#e3f2fd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <PersonIcon sx={{ color: '#1976d2', fontSize: 28 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            color: '#1a1a1a',
                          }}
                        >
                          Citizen / Resident
                        </Typography>
                        <Chip
                          label="Recommended"
                          size="small"
                          sx={{
                            bgcolor: '#4caf50',
                            color: 'white',
                            fontSize: '0.7rem',
                            height: 20,
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          mb: 2,
                          fontSize: '0.875rem',
                        }}
                      >
                        Login with your credentials to manage trade applications
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          bgcolor: '#1976d2',
                          color: 'white',
                          textTransform: 'none',
                          fontWeight: 600,
                          py: 1.25,
                          '&:hover': {
                            bgcolor: '#1565c0',
                          },
                        }}
                      >
                        Continue as Citizen / Resident
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Separator */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  my: 2,
                  color: '#999',
                }}
              >
                <Box sx={{ flex: 1, height: 1, bgcolor: '#e0e0e0' }} />
                <Typography variant="body2" sx={{ px: 2, fontSize: '0.875rem' }}>
                  or
                </Typography>
                <Box sx={{ flex: 1, height: 1, bgcolor: '#e0e0e0' }} />
              </Box>

              {/* Foreign Visitor Option */}
              <Card
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  border: '2px solid #e0e0e0',
                  '&:hover': {
                    borderColor: '#1976d2',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                  },
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/signin')}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <BusinessIcon sx={{ color: '#666', fontSize: 28 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          color: '#1a1a1a',
                          mb: 0.5,
                        }}
                      >
                        Foreign Visitor
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          mb: 2,
                          fontSize: '0.875rem',
                        }}
                      >
                        Access services using your passport number
                      </Typography>
                      <Button
                        variant="outlined"
                        fullWidth
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          borderColor: '#e0e0e0',
                          color: '#666',
                          textTransform: 'none',
                          fontWeight: 600,
                          py: 1.25,
                          '&:hover': {
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            bgcolor: 'rgba(25, 118, 210, 0.04)',
                          },
                        }}
                      >
                        Continue as Foreign Visitor
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Footer */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                  color: '#666',
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 16 }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.75rem',
                    color: '#666',
                  }}
                >
                  Bank-grade security. Your data is encrypted
                </Typography>
              </Box>

              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/register')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                <HelpOutlineIcon sx={{ fontSize: 16 }} />
                Not sure which one? • Get Help
              </Link>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>

        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box
            component="img"
            src="/car-emblem.png"
            alt="Central African Republic Emblem"
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              objectFit: 'contain',
            }}
          />
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Getting Started with eServices.gov.ss
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
            Central African Republic Citizens, Foreign Residents, and Foreign visitors to
            Central African Republic can now apply for Government services in a simple,
            secure, and convenient way.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 4,
            mb: 6,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {steps.map((step, index) => (
            <Box
              key={index}
              sx={{
                flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' },
                minWidth: { xs: '100%', md: '300px' },
                maxWidth: { xs: '100%', md: '400px' },
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      bgcolor: step.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      color: 'white',
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            bgcolor: '#2e7d32',
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 3, sm: 0 },
            textAlign: { xs: 'center', sm: 'left' },
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px)',
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: 'white', fontWeight: 600, maxWidth: 500 }}
          >
            One Account is all you need. Register to access all Government
            Services.
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: 'white',
              color: '#2e7d32',
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#f5f5f5',
              },
            }}
          >
            Create Account
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;

