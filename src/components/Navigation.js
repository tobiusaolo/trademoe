import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Badge } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { notificationsAPI } from '../api/api';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
    // Refresh count every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    
    // Listen for notification updates
    const handleNotificationUpdate = () => {
      loadUnreadCount();
    };
    window.addEventListener('notificationUpdated', handleNotificationUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('notificationUpdated', handleNotificationUpdate);
    };
  }, []);

  // Refresh count when navigating to notifications page
  useEffect(() => {
    if (location.pathname === '/notifications') {
      loadUnreadCount();
    }
  }, [location.pathname]);

  const loadUnreadCount = async () => {
    try {
      const count = await notificationsAPI.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to load unread count:', err);
    }
  };

  const getTabValue = () => {
    if (location.pathname === '/dashboard') return 0;
    if (location.pathname === '/services') return 1;
    if (location.pathname.startsWith('/applications')) return 2;
    if (location.pathname === '/notifications') return 3;
    return 0;
  };

  const handleChange = (event, newValue) => {
    const routes = ['/dashboard', '/services', '/applications', '/notifications'];
    navigate(routes[newValue]);
  };

  return (
    <Box sx={{ bgcolor: '#1565c0', width: '100%' }}>
      <Tabs
        value={getTabValue()}
        onChange={handleChange}
        textColor="inherit"
        indicatorColor="primary"
        sx={{
          '& .MuiTab-root': {
            color: 'white',
            minHeight: 48,
            '&.Mui-selected': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            },
          },
        }}
      >
        <Tab label="Home" />
        <Tab label="Services" />
        <Tab label="Applications History" />
        <Tab 
          label={
            <Badge 
              badgeContent={unreadCount} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  right: -8,
                  top: 8,
                },
              }}
            >
              Notifications
            </Badge>
          } 
        />
      </Tabs>
    </Box>
  );
};

export default Navigation;

