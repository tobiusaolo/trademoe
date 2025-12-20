import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/api';

const Header = ({ isAuthenticated = false, showNav = false }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user, setUser] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserInfo();
      
      // Listen for storage changes (e.g., when user info is updated)
      const handleStorageChange = () => {
        loadUserInfo();
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      // Also listen for custom event when user info is updated
      window.addEventListener('userInfoUpdated', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('userInfoUpdated', handleStorageChange);
      };
    } else {
      setUser(null);
    }
  }, [isAuthenticated]);

  const loadUserInfo = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } else {
        // Try to fetch from API if not in localStorage
        authAPI.getCurrentUser()
          .then(userData => {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          })
          .catch(err => {
            console.error('Failed to load user info:', err);
          });
      }
    } catch (err) {
      console.error('Error loading user info:', err);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`.trim();
    } else if (user.first_name) {
      return user.first_name;
    } else if (user.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getUserTypeLabel = () => {
    if (!user) return 'Profile';
    
    const userTypeMap = {
      'citizens': 'Citizen',
      'residents': 'Resident',
      'foreigners': 'Foreigner',
    };
    
    return userTypeMap[user.user_type] || 'Individual';
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    authAPI.logout();
    navigate('/signin');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
            src="/car-emblem.png"
            alt="Central African Republic"
            sx={{
              width: 50,
              height: 50,
              objectFit: 'contain',
              mr: 1,
            }}
          />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Ministry of Trade and Industry
          </Typography>
        </Box>

        {isAuthenticated ? (
          <Box>
            <Button
              onClick={handleClick}
              endIcon={<ArrowDropDownIcon />}
              sx={{ color: 'white', textTransform: 'none' }}
            >
              <Box sx={{ textAlign: 'right', mr: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', opacity: 0.9 }}>
                  {getUserTypeLabel()} Profile
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {getUserDisplayName()}
                </Typography>
              </Box>
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleClose}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {getUserDisplayName()}
                  </Typography>
                  {user?.email && (
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  )}
                </Box>
              </MenuItem>
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/signin')}
              sx={{ textTransform: 'none' }}
            >
              Sign in
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#2e7d32',
                textTransform: 'none',
                '&:hover': { bgcolor: '#1b5e20' },
              }}
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

