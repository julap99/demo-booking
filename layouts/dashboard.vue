<template>
  <div class="min-h-screen bg-[var(--color-bg-primary)]">
    <!-- Navigation -->
    <nav class="bg-[var(--color-bg-secondary)] shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Brand -->
          <div class="flex">
            <NuxtLink to="/dashboard" class="flex-shrink-0 flex items-center">
              <div
                class="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-white"
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
              <span class="ml-3 text-xl font-bold text-gray-900"
                >Stitch & Shutter</span
              >
            </NuxtLink>

            <!-- Navigation Links -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink
                to="/dashboard"
                class="border-transparent text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-text-primary)] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                active-class="border-[var(--color-primary)] text-[var(--color-text-primary)]"
              >
                Dashboard
              </NuxtLink>
              <NuxtLink
                to="/dashboard/bookings"
                class="border-transparent text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-text-primary)] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                active-class="border-[var(--color-primary)] text-[var(--color-text-primary)]"
              >
                Booking
              </NuxtLink>
              <NuxtLink
                to="/dashboard/contacts"
                class="border-transparent text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-text-primary)] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                active-class="border-[var(--color-primary)] text-[var(--color-text-primary)]"
              >
                Contact
              </NuxtLink>
              <NuxtLink
                to="/dashboard/calendar"
                class="border-transparent text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-text-primary)] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                active-class="border-[var(--color-primary)] text-[var(--color-text-primary)]"
              >
                Calendar
              </NuxtLink>
              <NuxtLink
                to="/dashboard/settings"
                class="border-transparent text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-text-primary)] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                active-class="border-[var(--color-primary)] text-[var(--color-text-primary)]"
              >
                Setting
              </NuxtLink>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="flex items-center sm:hidden">
            <button
              type="button"
              class="inline-flex items-center justify-center p-2 rounded-md text-[var(--color-text-primary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-primary)]"
              @click="toggleMobileMenu"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                :class="[showMobileMenu ? 'hidden' : 'block', 'h-6 w-6']"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <svg
                :class="[showMobileMenu ? 'block' : 'hidden', 'h-6 w-6']"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- User Menu -->
          <div class="hidden sm:flex sm:items-center">
            <div class="ml-3 relative">
              <div>
                <button
                  id="profile-button"
                  type="button"
                  @click="showProfileMenu = !showProfileMenu"
                  class="max-w-xs bg-[var(--color-bg-secondary)] flex items-center gap-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] p-1 pr-2 hover:bg-[var(--color-bg-primary)] transition-colors duration-200"
                >
                  <span class="sr-only">Open user menu</span>
                  <div
                    class="h-8 w-8 rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center shadow-sm"
                  >
                    <span class="text-[var(--color-primary)] font-medium">{{
                      userInitial
                    }}</span>
                  </div>
                  <span class="text-[var(--color-text-primary)] font-medium hidden md:block">{{ user?.name }}</span>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <!-- Profile Dropdown -->
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-show="showProfileMenu"
                  id="profile-menu"
                  class="origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-lg py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 divide-y divide-gray-100"
                >
                  <!-- User Info Section -->
                  <div class="px-4 py-3">
                   Stich & Shutter Studio
                  </div>

                  <!-- Menu Items -->
                  <div class="py-1">
                    <NuxtLink
                      to="/dashboard/settings"
                      class="flex items-center px-4 py-2 text-sm  hover:bg-[var(--color-bg-primary)] transition-colors duration-200 gap-2"
                      @click="showProfileMenu = false"
                    >
                      <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </NuxtLink>
                  </div>

                  <!-- Logout Section -->
                  <div class="py-1">
                    <button
                      @click="handleLogout"
                      class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 gap-2"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <div
        v-show="showMobileMenu"
        class="sm:hidden bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-primary)]"
      >
        <div class="pt-2 pb-3 space-y-1">
          <NuxtLink
            to="/dashboard"
            class="border-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-text-primary)] block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
            active-class="bg-[var(--color-bg-primary)] border-[var(--color-primary)] text-[var(--color-text-primary)]"
            @click="showMobileMenu = false"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/dashboard/bookings"
            class="border-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-text-primary)] block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
            active-class="bg-[var(--color-bg-primary)] border-[var(--color-primary)] text-[var(--color-text-primary)]"
            @click="showMobileMenu = false"
          >
            Booking
          </NuxtLink>
          <NuxtLink
            to="/dashboard/contacts"
            class="border-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-text-primary)] block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
            active-class="bg-[var(--color-bg-primary)] border-[var(--color-primary)] text-[var(--color-text-primary)]"
            @click="showMobileMenu = false"
          >
            Contact
          </NuxtLink>
          <NuxtLink
            to="/dashboard/calendar"
            class="border-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-text-primary)] block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
            active-class="bg-[var(--color-bg-primary)] border-[var(--color-primary)] text-[var(--color-text-primary)]"
            @click="showMobileMenu = false"
          >
            Calendar
          </NuxtLink>
          <NuxtLink
            to="/dashboard/settings"
            class="border-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-text-primary)] block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
            active-class="bg-[var(--color-bg-primary)] border-[var(--color-primary)] text-[var(--color-text-primary)]"
            @click="showMobileMenu = false"
          >
            Setting
          </NuxtLink>
        </div>

        <!-- Mobile Profile Menu -->
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <div
                class="h-10 w-10 rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center"
              >
                <span class="text-[var(--color-primary)] font-medium">{{
                  userInitial
                }}</span>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">
                {{ user?.name }}
              </div>
              <div class="text-sm font-medium text-gray-500">
                {{ user?.email }}
              </div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-base font-medium text-[var(--color-text-primary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)]"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto p-4">
      <div class="">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
const auth = useAuthStore();
const showProfileMenu = ref(false);
const showMobileMenu = ref(false);

// Initialize auth on component mount
onMounted(async () => {
  await auth.fetchUser();
  
  // Add click outside handler for profile menu
  document.addEventListener('click', (event) => {
    const profileMenu = document.querySelector('#profile-menu');
    const profileButton = document.querySelector('#profile-button');
    
    if (profileMenu && !profileMenu.contains(event.target) && 
        profileButton && !profileButton.contains(event.target)) {
      showProfileMenu.value = false;
    }
  });
});

const user = computed(() => auth.getUser);
const userInitial = computed(() => {
  const name = user.value?.name?.trim() || "U";
  return name.charAt(0).toUpperCase();
});

const handleLogout = async () => {
  await auth.logout();
  navigateTo("/login");
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    name: "Bookings",
    href: "/dashboard/bookings",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: "M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z",
  },
  {
    name: "Contacts",
    href: "/dashboard/contacts",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
];
</script>

<style scoped>
.router-link-active {
  @apply border-[#785340] text-gray-900;
}
</style>
