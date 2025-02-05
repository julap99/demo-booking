import { useAuthStore } from '~/stores/auth'

// Declare the type for initAuth
declare module '#app' {
  interface NuxtApp {
    $initAuth: () => Promise<boolean>
  }
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore()

  // Add state to track initialization
  let isInitializing = false
  let initializationPromise: Promise<boolean> | null = null

  // Function to initialize auth
  const initializeAuth = async () => {
    if (isInitializing) {
      return initializationPromise
    }

    isInitializing = true
    initializationPromise = auth.checkAuth()

    try {
      await initializationPromise
    } finally {
      isInitializing = false
    }

    return initializationPromise
  }

  // Initialize on app creation
  await initializeAuth()

  // Provide the initialization function to the app
  return {
    provide: {
      initAuth: initializeAuth
    }
  }
}) 