import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Snackbar,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import UserProfileSidebar from '../components/UserProfileSidebar';
import { notificationsAPI, getErrorMessage } from '../api/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0); // 0 = all, 1 = unread
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [markingAsRead, setMarkingAsRead] = useState(false);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, [tabValue]);

  const loadUnreadCount = async () => {
    try {
      const count = await notificationsAPI.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to load unread count:', err);
    }
  };

  const loadNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const params = tabValue === 1 ? { is_read: false } : {};
      const data = await notificationsAPI.getNotifications(params);
      setNotifications(data);
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to load notifications. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (notificationId) => {
    try {
      const notification = await notificationsAPI.getNotification(notificationId);
      setSelectedNotification(notification);
      setDetailDialogOpen(true);
      
      // If notification is unread, mark it as read when viewing
      if (!notification.is_read) {
        await handleMarkAsRead(notificationId, false);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: getErrorMessage(err) || 'Failed to load notification details.',
        severity: 'error',
      });
      console.error('Failed to load notification:', err);
    }
  };

  const handleMarkAsRead = async (notificationId, showSnackbar = true) => {
    setMarkingAsRead(true);
    try {
      await notificationsAPI.markAsRead(notificationId);
      await loadNotifications(); // Reload to update UI
      await loadUnreadCount(); // Update unread count
      // Trigger a custom event to update unread count in Navigation
      window.dispatchEvent(new Event('notificationUpdated'));
      
      if (showSnackbar) {
        setSnackbar({
          open: true,
          message: 'Notification marked as read',
          severity: 'success',
        });
      }
    } catch (err) {
      const errorMsg = getErrorMessage(err) || 'Failed to mark notification as read.';
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: 'error',
      });
      console.error('Failed to mark notification as read:', err);
    } finally {
      setMarkingAsRead(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAllAsRead(true);
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      if (unreadNotifications.length === 0) {
        setSnackbar({
          open: true,
          message: 'No unread notifications to mark',
          severity: 'info',
        });
        return;
      }

      // Mark all unread notifications as read
      await Promise.all(
        unreadNotifications.map(notif => notificationsAPI.markAsRead(notif.id))
      );

      await loadNotifications();
      await loadUnreadCount();
      window.dispatchEvent(new Event('notificationUpdated'));

      setSnackbar({
        open: true,
        message: `Marked ${unreadNotifications.length} notification(s) as read`,
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: getErrorMessage(err) || 'Failed to mark all notifications as read.',
        severity: 'error',
      });
      console.error('Failed to mark all as read:', err);
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedNotification(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Header isAuthenticated={true} />
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 75%' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  Notifications
                </Typography>
                {unreadCount > 0 && (
                  <Chip 
                    label={`${unreadCount} Unread`} 
                    color="primary" 
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>
              {unreadCount > 0 && tabValue === 0 && (
                <Tooltip title="Mark all unread notifications as read">
                  <Button
                    variant="outlined"
                    startIcon={markingAllAsRead ? <CircularProgress size={16} /> : <DoneAllIcon />}
                    onClick={handleMarkAllAsRead}
                    disabled={markingAllAsRead}
                    sx={{ textTransform: 'none' }}
                    size="small"
                  >
                    Mark All Read
                  </Button>
                </Tooltip>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              View your recent notifications and updates
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="All Notifications" />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Unread
                      {unreadCount > 0 && (
                        <Chip 
                          label={unreadCount} 
                          size="small" 
                          color="primary"
                          sx={{ height: 20, minWidth: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  } 
                />
              </Tabs>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : notifications.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  bgcolor: '#f5f5f5',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  No Notifications
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  You currently have no notifications
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    sx={{
                      bgcolor: notification.is_read ? 'background.paper' : 'action.hover',
                      borderLeft: notification.is_read ? 'none' : '4px solid',
                      borderColor: 'primary.main',
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box 
                          sx={{ flex: 1, cursor: 'pointer' }}
                          onClick={() => handleViewDetails(notification.id)}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: notification.is_read ? 400 : 600 }}>
                              {notification.title}
                            </Typography>
                            {!notification.is_read && (
                              <Chip label="New" size="small" color="primary" />
                            )}
                            <Chip
                              label={notification.notification_type}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(notification.created_at).toLocaleString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View details">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(notification.id);
                              }}
                              color="primary"
                              size="small"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          {!notification.is_read && (
                            <Tooltip title="Mark as read">
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                color="primary"
                                size="small"
                                disabled={markingAsRead}
                              >
                                {markingAsRead ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  <CheckCircleIcon />
                                )}
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
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

      {/* Notification Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedNotification && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ flex: 1 }}>
                  {selectedNotification.title}
                </Typography>
                {!selectedNotification.is_read && (
                  <Chip label="New" size="small" color="primary" />
                )}
                <Chip
                  label={selectedNotification.notification_type}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                {selectedNotification.message}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                <Typography variant="caption" color="text.secondary">
                  <strong>Created:</strong> {new Date(selectedNotification.created_at).toLocaleString()}
                </Typography>
                {selectedNotification.related_application_id && (
                  <Typography variant="caption" color="text.secondary">
                    <strong>Related Application ID:</strong> {selectedNotification.related_application_id}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  <strong>Status:</strong> {selectedNotification.is_read ? 'Read' : 'Unread'}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              {!selectedNotification.is_read && (
                <Button
                  onClick={() => {
                    handleMarkAsRead(selectedNotification.id);
                    handleCloseDetailDialog();
                  }}
                  startIcon={<CheckCircleOutlineIcon />}
                  variant="outlined"
                  sx={{ textTransform: 'none' }}
                >
                  Mark as Read
                </Button>
              )}
              <Button
                onClick={handleCloseDetailDialog}
                variant="contained"
                sx={{ textTransform: 'none' }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Notifications;

