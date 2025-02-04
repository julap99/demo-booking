<template>
  <div class="py-6 px-4 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-[var(--color-text-primary)]">
        Settings
      </h1>
      <p class="mt-2 text-sm text-[var(--color-text-secondary)]">
        Manage your booking system settings and account preferences
      </p>
    </div>

    <!-- Settings Tabs -->
    <div class="bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden">
      <div class="settings-tabs">
        <!-- Tab Headers -->
        <nav class="tab-nav bg-white border-b border-gray-200">
          <div class="flex items-center px-4 gap-8">
            <button
              v-for="tab in tabs"
              :key="tab.name"
              @click="activeTab = tab.name"
              :class="[
                'tab-btn relative py-4 text-sm font-medium transition-all duration-200 -mb-px',
                activeTab === tab.name
                  ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent',
              ]"
            >
              <div class="flex items-center gap-2">
                <component
                  :is="tab.icon"
                  class="w-5 h-5"
                  :class="
                    activeTab === tab.name
                      ? 'text-[var(--color-primary)]'
                      : 'text-gray-400'
                  "
                />
                <span>{{ tab.label }}</span>
              </div>
            </button>
          </div>
        </nav>

        <!-- Tab Content Background -->
        <div class="bg-gray-50 min-h-[400px]">
          <!-- Tab Panels -->
          <div class="tab-content p-4">
            <!-- Booking Time & Slot Panel -->
            <div
              v-if="activeTab === 'booking'"
              key="booking"
              class="space-y-6 relative"
            >
              <!-- Business Hours Section -->
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div class="p-4 border-b border-gray-100">
                  <h3
                    class="text-lg font-medium text-[var(--color-text-primary)]"
                  >
                    Business Hours
                  </h3>
                  <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Set your business operating hours for booking slots
                  </p>
                </div>
                <div class="p-4">
                  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                        >Opening Time</label
                      >
                      <div
                        class="relative time-input-wrapper"
                        :class="{ 'has-error': errors.openingTime }"
                      >
                        <input
                          type="time"
                          v-model="settings.openingTime"
                          :class="[
                            'block w-full rounded-md border py-2.5 text-sm transition-all duration-200 bg-white',
                            'pl-10 pr-4',
                            'focus:outline-none focus:ring-2 focus:ring-offset-0',
                            errors.openingTime
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                              : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                          ]"
                        />
                        <div
                          class="time-icon"
                          :class="{ error: errors.openingTime }"
                        >
                          <svg
                            class="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                        </div>
                        <div v-if="errors.openingTime" class="error-message">
                          {{ errors.openingTime }}
                        </div>
                      </div>
                    </div>
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                        >Closing Time</label
                      >
                      <div
                        class="relative time-input-wrapper"
                        :class="{ 'has-error': errors.closingTime }"
                      >
                        <input
                          type="time"
                          v-model="settings.closingTime"
                          :class="[
                            'block w-full rounded-md border py-2.5 text-sm transition-all duration-200 bg-white',
                            'pl-10 pr-4',
                            'focus:outline-none focus:ring-2 focus:ring-offset-0',
                            errors.closingTime
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                              : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                          ]"
                        />
                        <div
                          class="time-icon"
                          :class="{ error: errors.closingTime }"
                        >
                          <svg
                            class="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                        </div>
                        <div v-if="errors.closingTime" class="error-message">
                          {{ errors.closingTime }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Slot Duration Section -->
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div class="p-4 border-b border-gray-100">
                  <h3
                    class="text-lg font-medium text-[var(--color-text-primary)]"
                  >
                    Slot Duration & Rest Period
                  </h3>
                  <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Configure the duration of each booking slot and rest period
                    between sessions
                  </p>
                </div>
                <div class="p-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Session Duration
                      </label>
                      <select
                        v-model="settings.slotDuration"
                        class="block w-full rounded-md border-gray-300 pl-3 pr-8 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                      >
                        <option :value="15">15 minutes</option>
                        <option :value="30">30 minutes</option>
                        <option :value="45">45 minutes</option>
                        <option :value="60">1 hour</option>
                      </select>
                    </div>
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Rest Period Between Sessions
                      </label>
                      <select
                        v-model="settings.restDuration"
                        class="block w-full rounded-md border-gray-300 pl-3 pr-8 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                      >
                        <option :value="0">No rest</option>
                        <option :value="5">5 minutes</option>
                        <option :value="10">10 minutes</option>
                        <option :value="15">15 minutes</option>
                        <option :value="30">30 minutes</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Break Time Section -->
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div class="p-4 border-b border-gray-100">
                  <h3
                    class="text-lg font-medium text-[var(--color-text-primary)]"
                  >
                    Break Time
                  </h3>
                  <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Set your daily break time period
                  </p>
                </div>
                <div class="p-4">
                  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                        >Break Start Time</label
                      >
                      <div
                        class="relative time-input-wrapper"
                        :class="{ 'has-error': errors.breakStartTime }"
                      >
                        <input
                          type="time"
                          v-model="settings.breakStartTime"
                          :class="[
                            'block w-full rounded-md border py-2.5 text-sm transition-all duration-200 bg-white',
                            'pl-10 pr-4',
                            'focus:outline-none focus:ring-2 focus:ring-offset-0',
                            errors.breakStartTime
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                              : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                          ]"
                        />
                        <div
                          class="time-icon"
                          :class="{ error: errors.breakStartTime }"
                        >
                          <svg
                            class="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                        </div>
                        <div v-if="errors.breakStartTime" class="error-message">
                          {{ errors.breakStartTime }}
                        </div>
                      </div>
                    </div>
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                        >Break End Time</label
                      >
                      <div
                        class="relative time-input-wrapper"
                        :class="{ 'has-error': errors.breakEndTime }"
                      >
                        <input
                          type="time"
                          v-model="settings.breakEndTime"
                          :class="[
                            'block w-full rounded-md border py-2.5 text-sm transition-all duration-200 bg-white',
                            'pl-10 pr-4',
                            'focus:outline-none focus:ring-2 focus:ring-offset-0',
                            errors.breakEndTime
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                              : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                          ]"
                        />
                        <div
                          class="time-icon"
                          :class="{ error: errors.breakEndTime }"
                        >
                          <svg
                            class="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                        </div>
                        <div v-if="errors.breakEndTime" class="error-message">
                          {{ errors.breakEndTime }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Save Button -->
              <div
                class="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end"
              >
                <button
                  @click="saveSlotConfig"
                  :disabled="loadingStates.booking"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <svg
                    v-if="loadingStates.booking"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  {{ loadingStates.booking ? "Saving..." : "Save Changes" }}
                </button>
              </div>
            </div>

            <!-- Payment Gateway Panel -->
            <div
              v-if="activeTab === 'payment'"
              key="payment"
              class="p-6 space-y-6 relative"
            >
              <!-- Payment Provider Section -->
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div class="p-4 border-b border-gray-100">
                  <h3
                    class="text-lg font-medium text-[var(--color-text-primary)]"
                  >
                    Payment Provider
                  </h3>
                  <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Select and configure your payment gateway
                  </p>
                </div>
                <div class="p-4">
                  <div class="max-w-xs space-y-4">
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                        >Provider</label
                      >
                      <select
                        v-model="settings.paymentProvider"
                        class="block w-full rounded-md border-gray-300 pl-3 pr-8 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                      >
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                      </select>
                    </div>
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                        >API Key</label
                      >
                      <div class="relative">
                        <input
                          :type="showApiKey ? 'text' : 'password'"
                          v-model="settings.apiKey"
                          placeholder="Enter API key"
                          class="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] sm:text-sm"
                        />
                        <button
                          @click="showApiKey = !showApiKey"
                          type="button"
                          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <svg
                            v-if="showApiKey"
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                            />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        </button>
                      </div>
                      <p class="text-sm text-[var(--color-text-secondary)]">
                        Your API key will be encrypted before storing
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Save Button -->
              <div
                class="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end"
              >
                <button
                  @click="savePaymentSettings"
                  :disabled="loadingStates.payment"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <svg
                    v-if="loadingStates.payment"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  {{ loadingStates.payment ? "Saving..." : "Save Changes" }}
                </button>
              </div>
            </div>

            <!-- Password Panel -->
            <div v-if="activeTab === 'password'" key="password" class="p-6">
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div class="p-4 border-b border-gray-100">
                  <h3
                    class="text-lg font-medium text-[var(--color-text-primary)]"
                  >
                    Change Password
                  </h3>
                  <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Update your account password
                  </p>
                </div>
                <div class="p-4">
                  <form
                    @submit.prevent="handlePasswordChange"
                    class="space-y-4 max-w-md"
                  >
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                        >Current Password</label
                      >
                      <div class="relative">
                        <input
                          :type="showCurrentPassword ? 'text' : 'password'"
                          v-model="passwordForm.currentPassword"
                          placeholder="Enter current password"
                          class="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] sm:text-sm"
                        />
                        <button
                          @click="showCurrentPassword = !showCurrentPassword"
                          type="button"
                          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <svg
                            v-if="showCurrentPassword"
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                            />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                        >New Password</label
                      >
                      <div class="relative">
                        <input
                          :type="showNewPassword ? 'text' : 'password'"
                          v-model="passwordForm.newPassword"
                          placeholder="Enter new password"
                          class="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] sm:text-sm"
                        />
                        <button
                          @click="showNewPassword = !showNewPassword"
                          type="button"
                          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <svg
                            v-if="showNewPassword"
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                            />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                        >Confirm New Password</label
                      >
                      <div class="relative">
                        <input
                          :type="showConfirmPassword ? 'text' : 'password'"
                          v-model="passwordForm.confirmPassword"
                          placeholder="Confirm new password"
                          class="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] sm:text-sm"
                        />
                        <button
                          @click="showConfirmPassword = !showConfirmPassword"
                          type="button"
                          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <svg
                            v-if="showConfirmPassword"
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                            />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div class="pt-4">
                      <button
                        type="submit"
                        :disabled="isChangingPassword"
                        class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <svg
                          v-if="isChangingPassword"
                          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        {{
                          isChangingPassword
                            ? "Changing Password..."
                            : "Change Password"
                        }}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <template
      v-if="isLoading"
      class="absolute inset-0 bg-white/80 z-50 flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-3">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"
        ></div>
        <p class="text-sm text-gray-600">Loading settings...</p>
      </div>
    </template>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "dashboard",
});

const tabs = [
  {
    name: "booking",
    label: "Booking Time & Slot",
    icon: defineComponent({
      template: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>`,
    }),
  },
  {
    name: "payment",
    label: "Payment Gateway",
    icon: defineComponent({
      template: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>`,
    }),
  },
  {
    name: "password",
    label: "Password",
    icon: defineComponent({
      template: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0110 0v4"></path>
      </svg>`,
    }),
  },
];

const activeTab = ref("booking");
const showApiKey = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// Settings state
const settings = ref({
  openingTime: "09:00",
  closingTime: "17:00",
  slotDuration: 30,
  breakStartTime: "12:00",
  breakEndTime: "13:00",
  restDuration: 15,
  paymentProvider: "stripe",
  apiKey: "",
});

// Password change form
const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const isChangingPassword = ref(false);

// Add form validation
const errors = ref({
  openingTime: "",
  closingTime: "",
  breakStartTime: "",
  breakEndTime: "",
});

// Validate time ranges
function validateTimeRanges() {
  errors.value = {
    openingTime: "",
    closingTime: "",
    breakStartTime: "",
    breakEndTime: "",
  };

  const opening = new Date(`2000-01-01T${settings.value.openingTime}`);
  const closing = new Date(`2000-01-01T${settings.value.closingTime}`);
  const breakStart = new Date(`2000-01-01T${settings.value.breakStartTime}`);
  const breakEnd = new Date(`2000-01-01T${settings.value.breakEndTime}`);

  if (closing <= opening) {
    errors.value.closingTime = "Closing time must be after opening time";
  }
  if (breakEnd <= breakStart) {
    errors.value.breakEndTime = "Break end time must be after break start time";
  }
  if (breakStart < opening) {
    errors.value.breakStartTime = "Break must be within business hours";
  }
  if (breakEnd > closing) {
    errors.value.breakEndTime = "Break must be within business hours";
  }
}

// Watch for time changes
watch(
  [
    () => settings.value.openingTime,
    () => settings.value.closingTime,
    () => settings.value.breakStartTime,
    () => settings.value.breakEndTime,
  ],
  validateTimeRanges
);

// Handle password change
async function handlePasswordChange() {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert("New passwords do not match");
    return;
  }

  try {
    isChangingPassword.value = true;
    // Add your password change API call here
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
    alert("Password changed successfully");
    passwordForm.value = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  } catch (error) {
    alert("Failed to change password");
  } finally {
    isChangingPassword.value = false;
  }
}

// Watch for settings changes
// watch(
//   settings,
//   async (newSettings) => {
//     try {
//       // Add your settings update API call here
//       await new Promise((resolve) => setTimeout(resolve, 500)); // Simulated API call
//       alert("Settings updated successfully");
//     } catch (error) {
//       alert("Failed to update settings");
//     }
//   },
//   { deep: true }
// );

const isLoading = ref(true);
const isSaving = ref(false);

// Add loading states for each tab
const loadingStates = ref({
  booking: false,
  payment: false,
  password: false,
});

// Add save functions
async function saveBookingSettings() {
  try {
    loadingStates.value.booking = true;
    await $fetch("/api/setting/update-configs", {
      method: "POST",
      body: {
        slotConfig: {
          start_time: settings.value.openingTime,
          end_time: settings.value.closingTime,
          start_break: settings.value.breakStartTime,
          end_break: settings.value.breakEndTime,
          duration: settings.value.slotDuration,
          rest: settings.value.restDuration,
        },
      },
    });
  } catch (error) {
    console.error("Failed to save booking settings:", error);
    ElMessage.error("Failed to save booking settings");
  } finally {
    loadingStates.value.booking = false;
  }
}

async function savePaymentSettings() {
  try {
    loadingStates.value.payment = true;
    // Add your payment settings API call here
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
    ElMessage.success("Payment settings saved successfully");
  } catch (error) {
    console.error("Failed to save payment settings:", error);
    ElMessage.error("Failed to save payment settings");
  } finally {
    loadingStates.value.payment = false;
  }
}

// Update fetchConfig
async function fetchConfig() {
  try {
    isLoading.value = true;
    const response = await $fetch("/api/setting/get-configs");

    if (response.statusCode === 200) {
      settings.value.openingTime = response.data.slotConfig.start_time;
      settings.value.closingTime = response.data.slotConfig.end_time;
      settings.value.breakStartTime = response.data.slotConfig.start_break;
      settings.value.breakEndTime = response.data.slotConfig.end_break;
      settings.value.slotDuration = response.data.slotConfig.duration;
      settings.value.restDuration = response.data.slotConfig.rest;
    }
  } catch (error) {
    console.error(error);
    ElMessage.error("Failed to load settings");
  } finally {
    isLoading.value = false;
  }
}

async function saveSlotConfig() {
  try {
    loadingStates.value.booking = true;

    let resp = await $fetch("/api/setting/update-slot-config", {
      method: "POST",
      body: {
        start_time: settings.value.openingTime,
        end_time: settings.value.closingTime,
        start_break: settings.value.breakStartTime,
        end_break: settings.value.breakEndTime,
        duration: settings.value.slotDuration,
        rest: settings.value.restDuration,
      },
    });
    console.log(resp);

    if (resp.statusCode === 200) {
      alert("Slot config updated successfully");
    } else {
      alert("Failed to update slot config");
    }
  } catch (error) {
    console.error(error);
    alert("Failed to update slot config");
  } finally {
    loadingStates.value.booking = false;
  }
}

onMounted(async () => {
  await fetchConfig();
});
</script>

<style lang="scss" scoped>
.tab-btn {
  position: relative;
  white-space: nowrap;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--color-primary);
    transform: scaleX(0);
    transition: transform 0.2s ease;
    transform-origin: center;
  }

  &:hover::after {
    transform: scaleX(0.5);
  }

  &:focus {
    outline: none;
    &::after {
      transform: scaleX(0.8);
    }
  }

  &.active::after,
  &[aria-selected="true"]::after {
    transform: scaleX(1);
  }
}

.settings-tabs {
  .tab-nav {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: white;
    backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

// Enhanced time input styles
input[type="time"] {
  @apply relative bg-white;
  min-width: 140px;
  font-variant-numeric: tabular-nums;
  cursor: pointer;

  // Base styles
  &::-webkit-datetime-edit-fields-wrapper {
    @apply px-0 text-gray-900;
    padding-inline: 0;
  }

  &::-webkit-datetime-edit {
    @apply text-gray-900;
    padding-inline: 0;
  }

  // Custom calendar picker indicator
  &::-webkit-calendar-picker-indicator {
    @apply opacity-50 cursor-pointer w-4 h-4 hover:opacity-100 transition-opacity duration-200;
    margin-right: 0.5rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'%3E%3C/path%3E%3C/svg%3E");
  }

  // Hour field
  &::-webkit-datetime-edit-hour-field {
    @apply px-1 text-gray-900 rounded transition-colors;

    &:focus {
      @apply bg-[var(--color-primary)] bg-opacity-10;
    }
  }

  // Minute field
  &::-webkit-datetime-edit-minute-field {
    @apply px-1 text-gray-900 rounded transition-colors;

    &:focus {
      @apply bg-[var(--color-primary)] bg-opacity-10;
    }
  }

  // Separator styling
  &::-webkit-datetime-edit-text {
    @apply text-gray-400 px-0.5 select-none;
  }

  // States
  &:hover:not(:disabled) {
    @apply border-[var(--color-primary-light)] bg-gray-50 bg-opacity-50;
  }

  &:focus:not(:disabled) {
    @apply outline-none ring-2 ring-[var(--color-primary)] ring-opacity-20 border-[var(--color-primary)] bg-white;
  }

  &:disabled {
    @apply bg-gray-50 cursor-not-allowed;

    &::-webkit-datetime-edit {
      @apply text-gray-500;
    }
  }
}

// Time input wrapper
.time-input-wrapper {
  @apply relative flex items-center;

  .time-icon {
    @apply absolute left-3 text-gray-400 pointer-events-none transition-colors duration-200 z-10;

    &.error {
      @apply text-red-400;
    }
  }

  &:hover .time-icon:not(.error) {
    @apply text-gray-500;
  }

  &:focus-within .time-icon:not(.error) {
    @apply text-[var(--color-primary)];
  }
}

// Error state
.has-error {
  input[type="time"] {
    @apply border-red-300;

    &:focus {
      @apply ring-red-500 ring-opacity-20 border-red-500;
    }

    &::-webkit-datetime-edit {
      @apply text-red-900;
    }

    &::-webkit-datetime-edit-hour-field,
    &::-webkit-datetime-edit-minute-field {
      &:focus {
        @apply bg-red-50;
      }
    }
  }
}

// Error message styling
.error-message {
  @apply mt-1.5 text-sm text-red-600 transition-all absolute -bottom-6 left-0;
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

// Shake animation
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

// Input icon styling
.input-icon {
  @apply absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors duration-200;
}

// Remove duplicate transitions
.fade-enter-active,
.fade-leave-active {
  @apply transition-all duration-200 ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0 transform translate-y-2;
}

// Form group spacing
.form-group {
  @apply space-y-2;

  &:not(:last-child) {
    @apply mb-6;
  }
}

// Input label styling
.input-label {
  @apply block text-sm font-medium text-[var(--color-text-primary)];
}

// Loading overlay
.loading-overlay {
  backdrop-filter: blur(2px);
}

// Save button container
.save-button-container {
  background: linear-gradient(to top, white, white, transparent);
}
</style>
