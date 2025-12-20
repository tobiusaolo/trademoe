import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ComputerIcon from '@mui/icons-material/Computer';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
      
      {/* Professional Hero Section */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #2e7d32 100%)',
          overflow: 'hidden',
          pt: 8,
          pb: 8,
          backgroundImage: 'url(/car-flag.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(25, 118, 210, 0.7)',
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
          }}
        />
        
        {/* Decorative Circles */}
        <Box
          sx={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-150px',
            left: '-150px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.08)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              color: 'white',
            }}
          >
            {/* Main Heading */}
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              Central African Republic
            </Typography>
            
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              Ministry of Trade & Industry
            </Typography>

            <Box
              sx={{
                width: '100px',
                height: '4px',
                bgcolor: 'white',
                mb: 4,
                borderRadius: 2,
              }}
            />

            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                mb: 5,
                maxWidth: '800px',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.6,
                fontSize: { xs: '1.1rem', md: '1.5rem' },
              }}
            >
              Promoting industrialization and enterprise development through
              implementation of policies. Access government services online with
              ease, security, and convenience.
            </Typography>

            {/* Call to Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/dashboard')}
                sx={{
                  bgcolor: 'white',
                  color: '#1976d2',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 25px rgba(0,0,0,0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/dashboard')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 2,
                  },
                }}
              >
                Learn More
              </Button>
            </Box>

            {/* Stats or Features */}
            <Box
              sx={{
                display: 'flex',
                gap: 6,
                mt: 8,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  24/7
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Online Access
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  Secure
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  & Protected
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  Fast
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Processing
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
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
            p: 4,
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
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

