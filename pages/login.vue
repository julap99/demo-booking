<script setup>
definePageMeta({
  layout: "empty",
});

const auth = useAuthStore();

const form = reactive({
  username: "",
  password: "",
  remember: false,
});

const error = ref("");
const loading = ref(false);
const showPassword = ref(false);

const handleSubmit = async () => {
  error.value = "";
  loading.value = true;

  try {
    if (!form.username || !form.password) {
      error.value = "All fields are required";
      return;
    }

    const success = await auth.login(form.username, form.password);
    if (success) {
      navigateTo("/dashboard");
    } else {
      // Get error from auth store
      error.value = auth.getError;
    }
  } catch (e) {
    console.error("Login error:", e);
    error.value = "An unexpected error occurred";
  } finally {
    loading.value = false;
  }
};

// Redirect if already logged in
onMounted(async () => {
  if (await auth.checkAuth()) {
    navigateTo("/dashboard");
  }
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-bg-primary)] via-[var(--color-bg-secondary)] to-[var(--color-bg-tertiary)] py-12 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-xl"
    >
      <!-- Logo and Title -->
      <div>
        <div class="flex justify-center">
          <div
            class="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
          >
            <svg
              class="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>
        <h2
          class="mt-6 text-center text-3xl font-extrabold text-[var(--color-text-primary)] font-playfair"
        >
          Welcome back
        </h2>
        <p class="mt-2 text-center text-sm text-[var(--color-text-primary)]/70">
          Please sign in to your account
        </p>
      </div>

      <!-- Error Alert -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
        <div v-if="error" class="rounded-lg bg-red-50 p-4 mt-8">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-[var(--color-error)]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-[var(--color-error)]">{{ error }}</p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-5">
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-[var(--color-text-primary)]"
              >Username</label
            >
            <div class="mt-1 relative rounded-lg shadow-sm">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-[var(--color-text-primary)]/40"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="username"
                v-model="form.username"
                type="text"
                autocomplete="username"
                required
                class="appearance-none block w-full pl-10 pr-3 py-2.5 border border-[var(--color-border-primary)] rounded-lg shadow-sm placeholder-[var(--color-text-primary)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-primary)] focus:border-[var(--color-border-primary)] sm:text-sm transition-colors duration-200"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-[var(--color-text-primary)]"
              >Password</label
            >
            <div class="mt-1 relative rounded-lg shadow-sm">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-[var(--color-text-primary)]/40"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="appearance-none block w-full pl-10 pr-10 py-2.5 border border-[var(--color-border-primary)] rounded-lg shadow-sm placeholder-[var(--color-text-primary)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-primary)] focus:border-[var(--color-border-primary)] sm:text-sm transition-colors duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="showPassword = !showPassword"
              >
                <svg
                  class="h-5 w-5 text-[var(--color-text-primary)]/40 hover:text-[var(--color-text-primary)] transition-colors duration-200"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    v-if="showPassword"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                  />
                  <path
                    v-if="showPassword"
                    d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                  />
                  <path
                    v-if="!showPassword"
                    d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                  />
                  <path
                    v-if="!showPassword"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.remember"
              type="checkbox"
              class="h-4 w-4 text-[var(--color-text-primary)] focus:ring-[var(--color-border-primary)]/20 border-[var(--color-border-primary)]/20 rounded transition-colors duration-200"
            />
            <label
              for="remember-me"
              class="ml-2 block text-sm text-[var(--color-text-primary)]"
              >Remember me</label
            >
          </div>

          <div class="text-sm">
            <a
              href="#"
              class="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors duration-200"
            >
              Forgot password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] hover:from-[var(--color-primary-dark)] hover:to-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all duration-200 transform hover:scale-[1.02]"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                class="h-5 w-5 text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors duration-200"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span v-if="loading" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </span>
            <span v-else>Sign in</span>
          </button>

          <div
            class="text-center text-sm text-[var(--color-text-primary)]/70 mt-4"
          >
            <NuxtLink
              to="/"
              class="hover:text-[var(--color-primary)] transition-colors duration-200"
              >Landing Page</NuxtLink
            >
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.bg-gradient-to-br {
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}
</style>
