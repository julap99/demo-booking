import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    refreshToken: null,
    loading: false,
    error: null,
    isInitialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user || { name: 'U' },
    getError: (state) => state.error,
    getToken: (state) => state.token
  },

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null

      try {
        // TODO: Implement actual login API call
        // Example API call:
        // const response = await fetch('/api/auth/login', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email, password })
        // })
        // const data = await response.json()
        // if (!response.ok) throw new Error(data.message)

        // Simulated successful login
        await new Promise(resolve => setTimeout(resolve, 1000))
        const data = {
          token: 'dummy_token_' + Date.now(),
          refreshToken: 'dummy_refresh_token_' + Date.now(),
          user: {
            id: 1,
            name: 'John Doe',
            email: email,
            imageUrl: null
          }
        }

        this.setAuthData(data)
        return true
      } catch (error) {
        this.error = error.message
        return false
      } finally {
        this.loading = false
      }
    },

    async register(name, email, password) {
      this.loading = true
      this.error = null

      try {
        // TODO: Implement actual registration API call
        // Example API call:
        // const response = await fetch('/api/auth/register', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ name, email, password })
        // })
        // const data = await response.json()
        // if (!response.ok) throw new Error(data.message)

        // Simulated successful registration
        await new Promise(resolve => setTimeout(resolve, 1000))
        return await this.login(email, password)
      } catch (error) {
        this.error = error.message
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true

      try {
        // TODO: Implement actual logout API call
        // Example API call:
        // const response = await fetch('/api/auth/logout', {
        //   method: 'POST',
        //   headers: { 
        //     'Authorization': `Bearer ${this.token}`,
        //     'Content-Type': 'application/json'
        //   }
        // })

        // Simulated logout
        await new Promise(resolve => setTimeout(resolve, 500))
        this.clearAuthData()
        return true
      } catch (error) {
        this.error = error.message
        return false
      } finally {
        this.loading = false
      }
    },

    async refreshAuthToken() {
      try {
        if (!this.refreshToken) return false

        // TODO: Implement actual token refresh API call
        // Example API call:
        // const response = await fetch('/api/auth/refresh', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ refreshToken: this.refreshToken })
        // })
        // const data = await response.json()
        // if (!response.ok) throw new Error(data.message)

        // Simulated token refresh
        const data = {
          token: 'dummy_token_' + Date.now(),
          refreshToken: 'dummy_refresh_token_' + Date.now(),
          user: this.user
        }

        this.setAuthData(data)
        return true
      } catch (error) {
        this.clearAuthData()
        return false
      }
    },

    async checkAuth() {
      if (this.isInitialized) {
        return !!this.token;
      }

      const storage = useStorage()
      
      const token = storage.getItem('token')
      const refreshToken = storage.getItem('refreshToken')
      const userData = storage.getItem('user')

      if (token && refreshToken && userData) {
        this.token = token
        this.refreshToken = refreshToken
        this.user = JSON.parse(userData)

        // Check if token needs refresh (e.g., if it's close to expiration)
        // In a real app, you would decode the JWT and check its expiration
        const tokenAge = Date.now() - parseInt(token.split('_')[2] || 0)
        if (tokenAge > 3600000) { // Refresh if token is older than 1 hour
          await this.refreshAuthToken()
        }

        this.isInitialized = true
        return true
      }

      this.isInitialized = true
      return false
    },

    setAuthData(data) {
      const storage = useStorage()
      
      this.token = data.token
      this.refreshToken = data.refreshToken
      this.user = data.user
      this.isInitialized = true

      storage.setItem('token', data.token)
      storage.setItem('refreshToken', data.refreshToken)
      storage.setItem('user', JSON.stringify(data.user))
    },

    clearAuthData() {
      const storage = useStorage()
      
      this.token = null
      this.refreshToken = null
      this.user = null
      this.error = null
      this.isInitialized = true
      
      storage.removeItem('token')
      storage.removeItem('refreshToken')
      storage.removeItem('user')
      storage.removeItem('redirectTo')
    },

    clearError() {
      this.error = null
    }
  }
}) 