import { useAuthStore } from '~/stores/auth';
import { defineNuxtPlugin } from '#app';
import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack';

// Define public routes that don't need auth handling
const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/verify',
  '/api/booking/get-config',
  '/api/booking/get-themes',
  '/api/booking/get-addons',
  '/api/booking/get-slots',
  '/api/booking/get-available-slots',
  '/api/booking/proceed'
];

export default defineNuxtPlugin((nuxtApp) => {
  const auth = useAuthStore();

  // Add auth header to all API requests
  nuxtApp.hook('app:created', () => {
    const originalFetch = globalThis.$fetch;
    
    globalThis.$fetch = async function $fetch<T = unknown>(
      request: NitroFetchRequest,
      options: NitroFetchOptions<NitroFetchRequest> = {}
    ): Promise<T> {
      // Only add headers for API requests
      if (typeof request === 'string' && request.startsWith('/api/')) {
        // Skip auth handling for public routes
        if (!PUBLIC_ROUTES.includes(request)) {
          // Always include credentials for API requests
          options.credentials = 'include';

          // Add Authorization header if token exists
          const token = auth.getToken;
          if (token) {
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${token}`,
            };
          }
        }
      }

      try {
        return await originalFetch(request, options);
      } catch (error: any) {
        // Handle 401 errors globally
        if (error.response?.status === 401 && !PUBLIC_ROUTES.includes(request as string)) {
          // Only try to refresh if we're not already trying to refresh
          if (request !== '/api/auth/refresh') {
            // Try to refresh the token
            const refreshSuccess = await auth.refreshAuthToken();
            if (refreshSuccess) {
              // Retry the original request with the new token
              const newToken = auth.getToken;
              if (newToken) {
                options.headers = {
                  ...options.headers,
                  Authorization: `Bearer ${newToken}`,
                };
                return await originalFetch(request, options);
              }
            }
            
            // If refresh failed and we're not on a public route, clear auth and redirect
            if (!PUBLIC_ROUTES.includes(request as string)) {
              auth.clearAuthData();
              navigateTo('/login');
            }
          }
        }
        throw error;
      }
    } as typeof globalThis.$fetch;
  });
}); 