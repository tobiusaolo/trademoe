/**
 * Navigation utility for use outside React components
 * This allows navigation from API interceptors and other non-component code
 */

let navigateFunction = null;

/**
 * Set the navigate function from React Router
 * Should be called from App.js or a component that has access to useNavigate
 */
export const setNavigate = (navigate) => {
  navigateFunction = navigate;
};

/**
 * Navigate to a route
 * Falls back to custom event if navigate function is not yet set
 */
export const navigateTo = (path, options = {}) => {
  if (navigateFunction) {
    navigateFunction(path, options);
  } else {
    // Fallback: dispatch custom event that App component can listen to
    // This ensures React Router handles the navigation properly
    const event = new CustomEvent('navigateTo', { 
      detail: { path, options } 
    });
    window.dispatchEvent(event);
    
    // If event listener hasn't been set up yet, use a small delay
    setTimeout(() => {
      if (navigateFunction) {
        navigateFunction(path, options);
      } else {
        // Last resort: use window.location but preserve history
        if (options.replace) {
          window.location.replace(path);
        } else {
          window.location.href = path;
        }
      }
    }, 100);
  }
};

/**
 * Navigate to signin page (commonly used for 401 errors)
 */
export const navigateToSignIn = () => {
  navigateTo('/signin', { replace: true });
};

