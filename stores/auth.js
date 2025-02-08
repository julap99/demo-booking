import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
    isInitialized: false,
    isRefreshing: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    getUser: (state) => state.user || { name: "U" },
    getError: (state) => state.error,
    getToken: (state) => state.token,
  },

  actions: {
    async login(username, password) {
      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch("/api/auth/login", {
          method: "POST",
          body: { username, password },
        });

        if (response.status === "success" && response.data) {
          this.setAuthData(response.data);
          return true;
        } else {
          throw new Error(response.message || "Login failed");
        }
      } catch (error) {
        // Handle H3Error format
        if (error.data && error.data.message) {
          this.error = error.data.message;
        } else if (error.message) {
          this.error = error.message;
        } else {
          this.error = "Failed to login";
        }
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;

      try {
        // Clear refresh token cookie by making a request to the server
        await $fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });

        // Clear auth data from store and storage
        this.clearAuthData();
        return true;
      } catch (error) {
        this.error = error.message;
        return false;
      } finally {
        this.loading = false;
      }
    },

    async refreshAuthToken() {
      // Prevent multiple simultaneous refresh attempts
      if (this.isRefreshing) {
        return false;
      }

      this.isRefreshing = true;

      try {
        const response = await $fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (response.status === "success" && response.data) {
          this.setAuthData(response.data);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Token refresh error:", error);
        this.clearAuthData();
        return false;
      } finally {
        this.isRefreshing = false;
      }
    },

    async checkAuth() {
      if (this.isInitialized) {
        return this.isAuthenticated;
      }

      const storage = useStorage();

      try {
        const token = storage.getItem("token");
        const userData = storage.getItem("user");

        if (token && userData) {
          this.token = token;
          this.user = JSON.parse(userData);

          // Verify token validity by making a test request
          const response = await $fetch("/api/auth/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }).catch(() => null);

          if (!response) {
            // Token is invalid, try to refresh
            const refreshSuccess = await this.refreshAuthToken();
            if (!refreshSuccess) {
              this.clearAuthData();
            }
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        this.clearAuthData();
      } finally {
        this.isInitialized = true;
      }

      return this.isAuthenticated;
    },

    setAuthData(data) {
      const storage = useStorage();

      this.token = data.token;
      this.user = data.user;
      this.isInitialized = true;

      // Persist to storage
      try {
        storage.setItem("token", data.token);
        storage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        console.error("Error persisting auth data:", error);
      }
    },

    clearAuthData() {
      const storage = useStorage();

      this.token = null;
      this.user = null;
      this.error = null;
      this.isInitialized = false;
      this.isRefreshing = false;

      // Clear storage
      try {
        storage.removeItem("token");
        storage.removeItem("user");
        storage.removeItem("redirectTo");
      } catch (error) {
        console.error("Error clearing auth data:", error);
      }
    },

    clearError() {
      this.error = null;
    },
  },
});
