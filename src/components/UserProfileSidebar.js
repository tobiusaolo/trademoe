import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Avatar, Divider, Chip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import { authAPI } from '../api/api';

const UserProfileSidebar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const loadUserInfo = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } else {
        // Try to fetch from API if not in localStorage
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
          console.error('Failed to load user info:', err);
        }
      }
    } catch (err) {
      console.error('Error loading user info:', err);
    } finally {
      setLoading(false);
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
    if (!user) return '';
    
    const userTypeMap = {
      'citizens': 'Citizen',
      'residents': 'Resident',
      'foreigners': 'Foreigner',
    };
    
    return userTypeMap[user.user_type] || user.user_type || '';
  };

  const getInitials = () => {
    if (!user) return 'U';
    
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    } else if (user.first_name) {
      return user.first_name[0].toUpperCase();
    } else if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  if (loading) {
    return (
      <Card
        sx={{
          p: 3,
          bgcolor: '#f5f5f5',
          borderRadius: 2,
          minWidth: 250,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        p: 3,
        bgcolor: '#f5f5f5',
        borderRadius: 2,
        minWidth: 250,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: '#1976d2',
            mb: 2,
            fontSize: '2rem',
            fontWeight: 600,
          }}
        >
          {getInitials()}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>
          {getUserDisplayName()}
        </Typography>
        {getUserTypeLabel() && (
          <Chip
            label={getUserTypeLabel()}
            size="small"
            color="primary"
            sx={{ mb: 2 }}
          />
        )}
        
        <Divider sx={{ width: '100%', my: 2 }} />
        
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {user?.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                {user.email}
              </Typography>
            </Box>
          )}
          
          {user?.mobile_number && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {user.mobile_number}
              </Typography>
            </Box>
          )}
          
          {user?.personal_number && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BadgeIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {user.personal_number}
              </Typography>
            </Box>
          )}
          
          {user?.passport_number && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BadgeIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                Passport: {user.passport_number}
              </Typography>
            </Box>
          )}
          
          {user?.nationality && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Nationality:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.nationality}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default UserProfileSidebar;

