import { useAuthStore } from "~/stores/auth";
import { defineNuxtPlugin } from "#app";
import type { NitroFetchRequest, NitroFetchOptions } from "nitropack";

// Define public routes that don't need auth handling
const PUBLIC_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/verify",
  "/api/booking/get-config",
  "/api/booking/get-themes",
  "/api/booking/get-addons",
  "/api/booking/get-slots",
  "/api/booking/get-available-slots",
  "/api/booking/proceed",
  "/api/booking/get-receipt-detail",
];

export default defineNuxtPlugin((nuxtApp) => {
  const auth = useAuthStore();

  // Add auth header to all API requests
  nuxtApp.hook("app:created", () => {
    const originalFetch = globalThis.$fetch;

    globalThis.$fetch = async function $fetch<T = unknown>(
      request: NitroFetchRequest,
      options: NitroFetchOptions<NitroFetchRequest> = {}
    ): Promise<T> {
      console.log("Requested API: ", request);

      // Only add headers for API requests that are not public
      if (typeof request === "string" && request.startsWith("/api/")) {
        // Extract base URL without query parameters
        const baseUrl = request.split("?")[0];

        if (!PUBLIC_ROUTES.includes(baseUrl)) {
          console.log("Adding headers for API request: ", request);

          // Always include credentials for API requests
          options.credentials = "include";

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

      console.log("Lepas checking headers");

      try {
        return await originalFetch(request, options);
      } catch (error: any) {
        console.log("Error: ", error);

        // Handle 401 errors globally
        if (
          error.response?.status === 401 &&
          !PUBLIC_ROUTES.includes(request.toString().split("?")[0])
        ) {
          // Only try to refresh if we're not already trying to refresh
          if (request !== "/api/auth/refresh") {
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
            if (!PUBLIC_ROUTES.includes(request.toString().split("?")[0])) {
              auth.clearAuthData();
              navigateTo("/login");
            }
          }
        }
        throw error;
      }
    } as typeof globalThis.$fetch;
  });
});
