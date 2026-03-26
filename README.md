# Trade Application Frontend

Frontend application for the Central African Republic Trade Application System.

## Features

- User authentication (Login/Register)
- Service management
- Application form with multi-step wizard
- Document upload (PDF and images)
- Application history and tracking
- Notifications system
- Responsive design with Material-UI

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

## Deployment to GitHub Pages

1. **Before deploying**, update the `homepage` field in `package.json` with your GitHub Pages URL:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/REPOSITORY_NAME"
   ```
   For example: `"homepage": "https://bateesa.github.io/trade-frontend"`

   **Note:** The `homepage` field is currently removed for local development. Add it back only when you're ready to deploy to GitHub Pages.

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

3. **After deployment**, if you want to continue local development, you can temporarily remove or comment out the `homepage` field again.

## Environment Variables

The API base URL is configured in `src/api/api.js`. It defaults to:
- Production: `https://trade-backend-latest-9jox.onrender.com`
- Can be overridden with `REACT_APP_API_URL` environment variable

## API Integration

All API calls are centralized in `src/api/api.js` using Axios. The frontend integrates with:
- Authentication endpoints
- Services endpoints
- Applications endpoints
- Documents endpoints
- Notifications endpoints

## Technologies

- React 18.2.0
- Material-UI 5.14.20
- React Router 6.20.1
- Axios 1.13.2
