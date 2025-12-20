# Frontend API Integration Guide

## ✅ Integration Complete

All frontend components have been integrated with the backend API using Axios.

## Files Created/Updated

### 1. API Configuration (`src/api/api.js`)
- ✅ Axios instance with base URL configuration
- ✅ Request interceptor for JWT token authentication
- ✅ Response interceptor for error handling
- ✅ All API endpoint functions organized by resource:
  - `authAPI` - Authentication endpoints
  - `servicesAPI` - Service management
  - `applicationsAPI` - Application CRUD operations
  - `documentsAPI` - Document upload/management
  - `notificationsAPI` - Notification system

### 2. Updated Components

#### SignIn.js
- ✅ Integrated with `authAPI.login()`
- ✅ Stores JWT token in localStorage
- ✅ Fetches and stores user data
- ✅ Error handling and loading states
- ✅ Redirects to dashboard on success

#### Register.js
- ✅ Integrated with `authAPI.register()`
- ✅ Handles all three user types (citizens, residents, foreigners)
- ✅ Validates email and password matching
- ✅ Auto-login after successful registration
- ✅ Error handling and loading states

#### Dashboard.js
- ✅ Fetches services from `servicesAPI.getServices()`
- ✅ Fetches recent applications from `applicationsAPI.getApplications()`
- ✅ Real-time search filtering
- ✅ Loading states and error handling
- ✅ Displays service cards and application list

#### ApplicationHistory.js
- ✅ Fetches all applications from API
- ✅ Search functionality with debouncing
- ✅ Displays application cards with status chips
- ✅ Loading and error states

## Installation

Make sure axios is installed:

```bash
cd MTAI
npm install axios
```

## Environment Variables

Create a `.env` file in the `MTAI` directory:

```env
REACT_APP_API_URL=http://localhost:8000
```

For production, update this to your production API URL.

## API Usage Examples

### Authentication

```javascript
import { authAPI } from '../api/api';

// Login
const response = await authAPI.login('user@example.com', 'password');

// Register
const user = await authAPI.register({
  user_type: 'citizens',
  personal_number: '12345678',
  first_name: 'John',
  email: 'john@example.com',
  password: 'password123'
});

// Get current user
const currentUser = await authAPI.getCurrentUser();
```

### Applications

```javascript
import { applicationsAPI } from '../api/api';

// Create application
const app = await applicationsAPI.createApplication({
  service_id: 1,
  importer_name: 'ABC Company',
  // ... other fields
});

// Get applications
const apps = await applicationsAPI.getApplications({
  search: 'AP-123',
  status: 'draft'
});

// Submit application
await applicationsAPI.submitApplication(applicationId);
```

### Documents

```javascript
import { documentsAPI } from '../api/api';

// Upload document
const document = await documentsAPI.uploadDocument(
  applicationId,
  'billOfLading',
  fileObject
);
```

## Token Management

The API automatically:
- ✅ Adds JWT token to all requests via Authorization header
- ✅ Stores token in localStorage after login
- ✅ Redirects to login page on 401 errors
- ✅ Clears token on logout

## Next Steps

### Components Still Needing Integration:

1. **ApplicationForm.js** - Needs to:
   - Load existing application if editing
   - Save draft to backend
   - Submit application
   - Upload documents

2. **Notifications.js** - Needs to:
   - Fetch notifications from API
   - Mark notifications as read

3. **Services.js** - Needs to:
   - Fetch services from API

## Testing

1. Start the backend:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. Start the frontend:
   ```bash
   cd MTAI
   npm start
   ```

3. Test the integration:
   - Register a new user
   - Login
   - View services on dashboard
   - Create an application
   - View application history

## Error Handling

All API calls include:
- ✅ Try/catch error handling
- ✅ User-friendly error messages
- ✅ Loading states
- ✅ Automatic token refresh handling

## Security Notes

- ✅ JWT tokens stored in localStorage
- ✅ Tokens automatically included in requests
- ✅ Automatic logout on authentication errors
- ✅ CORS configured on backend for frontend origin

