import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()

  // Check authentication status on app initialization
  await auth.checkAuth()
}) 