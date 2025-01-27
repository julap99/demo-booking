import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();
  const storage = useStorage();
  const isAuthenticated = await auth.checkAuth();

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/book-a-session", "/login", "/register"];

  // Routes that require authentication
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];

  // Check if the current route requires authentication
  const requiresAuth =
    to.path.startsWith("/dashboard") ||
    protectedRoutes.some((route) => to.path.startsWith(route));

  // If route requires auth and user is not authenticated
  if (requiresAuth && !isAuthenticated) {
    // Store the intended destination to redirect after login
    storage.setItem("redirectTo", to.fullPath);
    return navigateTo("/login");
  }

  // If user is authenticated and trying to access auth pages
  if (isAuthenticated && publicRoutes.includes(to.path)) {
    return navigateTo("/dashboard");
  }

  // If user is authenticated and there's a stored redirect
  if (isAuthenticated && to.path === "/login") {
    const redirectTo = storage.getItem("redirectTo");
    storage.removeItem("redirectTo");
    if (redirectTo) {
      return navigateTo(redirectTo);
    }
    return navigateTo("/dashboard");
  }
});
