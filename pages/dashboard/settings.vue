<template>
  <div class="py-6 px-4 sm:px-6 lg:px-8">
    <!-- Status Modal -->
    <StatusModal
      :is-open="modalState.isOpen"
      :status="modalState.status"
      :title="modalState.title"
      :message="modalState.message"
      @close="closeModal"
    />

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
                  <div class="flex justify-between items-center">
                    <div>
                      <h3
                        class="text-lg font-medium text-[var(--color-text-primary)]"
                      >
                        Break Times
                      </h3>
                      <p
                        class="mt-1 text-sm text-[var(--color-text-secondary)]"
                      >
                        Set multiple break time periods throughout the day
                      </p>
                    </div>
                    <button
                      @click="
                        settings.breakTimes.push({
                          id: null,
                          startTime: '',
                          endTime: '',
                        })
                      "
                      class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      Add Break Time
                    </button>
                  </div>
                </div>
                <div class="p-4">
                  <div class="space-y-4">
                    <TransitionGroup name="break-list">
                      <div
                        v-for="(breakTime, index) in settings.breakTimes"
                        :key="index"
                        class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg relative group"
                      >
                        <div class="space-y-2">
                          <label
                            class="block text-sm font-medium text-[var(--color-text-primary)]"
                          >
                            Break Start Time
                          </label>
                          <div class="relative time-input-wrapper">
                            <input
                              type="time"
                              v-model="breakTime.startTime"
                              :class="[
                                'block w-full rounded-md border py-2.5 text-sm transition-all duration-200 bg-white',
                                'pl-10 pr-4',
                                'focus:outline-none focus:ring-2 focus:ring-offset-0',
                                errors[`breakTime${index}Start`]
                                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                                  : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                              ]"
                            />
                            <div
                              class="time-icon"
                              :class="{
                                error: errors[`breakTime${index}Start`],
                              }"
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
                            <div
                              v-if="errors[`breakTime${index}Start`]"
                              class="error-message"
                            >
                              {{ errors[`breakTime${index}Start`] }}
                            </div>
                          </div>
                        </div>
                        <div class="space-y-2">
                          <label
                            class="block text-sm font-medium text-[var(--color-text-primary)]"
                          >
                            Break End Time
                          </label>
                          <div class="relative time-input-wrapper">
                            <input
                              type="time"
                              v-model="breakTime.endTime"
                              :class="[
                                'block w-full rounded-md border py-2.5 text-sm transition-all duration-200 bg-white',
                                'pl-10 pr-4',
                                'focus:outline-none focus:ring-2 focus:ring-offset-0',
                                errors[`breakTime${index}End`]
                                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                                  : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                              ]"
                            />
                            <div
                              class="time-icon"
                              :class="{ error: errors[`breakTime${index}End`] }"
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
                            <div
                              v-if="errors[`breakTime${index}End`]"
                              class="error-message"
                            >
                              {{ errors[`breakTime${index}End`] }}
                            </div>
                          </div>
                        </div>
                        <button
                          v-if="settings.breakTimes.length > 1"
                          @click="settings.breakTimes.splice(index, 1)"
                          class="absolute -right-2 -top-2 p-1 rounded-full bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </TransitionGroup>
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

            <div v-if="activeTab === 'number-of-pax'">
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div class="p-4 border-b border-gray-100">
                  <h3
                    class="text-lg font-medium text-[var(--color-text-primary)]"
                  >
                    Number of Pax & Pricing
                  </h3>
                  <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Configure participant limits and pricing settings
                  </p>
                </div>
                <div class="p-4">
                  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Maximum Participants
                      </label>
                      <div class="relative">
                        <input
                          type="number"
                          v-model="settings.maxPax"
                          min="1"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500':
                              errors.maxPax,
                          }"
                        />
                        <p
                          v-if="errors.maxPax"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.maxPax }}
                        </p>
                      </div>
                      <p class="text-sm text-[var(--color-text-secondary)]">
                        Maximum number of participants allowed per session
                      </p>
                    </div>

                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Maximum Free Participants
                      </label>
                      <div class="relative">
                        <input
                          type="number"
                          v-model="settings.maxFreePax"
                          min="0"
                          :max="settings.maxPax"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500':
                              errors.maxFreePax,
                          }"
                        />
                        <p
                          v-if="errors.maxFreePax"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.maxFreePax }}
                        </p>
                      </div>
                      <p class="text-sm text-[var(--color-text-secondary)]">
                        Number of participants that can join for free (0 for no
                        free participants)
                      </p>
                    </div>

                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Charge Per Additional Participant
                      </label>
                      <div class="relative">
                        <div class="relative rounded-md shadow-sm">
                          <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                          >
                            <span class="text-gray-500 sm:text-sm">{{
                              settings.currency
                            }}</span>
                          </div>
                          <input
                            type="number"
                            v-model="settings.chargePerPax"
                            min="0"
                            step="0.01"
                            class="block w-full rounded-md border border-gray-300 pl-16 pr-8 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                            :class="{
                              'border-red-300 focus:border-red-500 focus:ring-red-500':
                                errors.chargePerPax,
                            }"
                          />
                        </div>
                        <p
                          v-if="errors.chargePerPax"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.chargePerPax }}
                        </p>
                      </div>
                      <p class="text-sm text-[var(--color-text-secondary)]">
                        Amount to charge for each participant beyond the free
                        limit
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Save Button -->
              <div
                class="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end mt-6"
              >
                <button
                  @click="savePaxSettings"
                  :disabled="loadingStates.pax"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <svg
                    v-if="loadingStates.pax"
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
                  {{ loadingStates.pax ? "Saving..." : "Save Changes" }}
                </button>
              </div>
            </div>

            <!-- Payment Gateway Panel -->
            <div
              v-if="activeTab === 'payment'"
              key="payment"
              class="space-y-6 relative"
            >
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div class="p-8 text-center">
                  <div class="mx-auto flex justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-16 h-16 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1"
                    >
                      <rect
                        x="1"
                        y="4"
                        width="22"
                        height="16"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                  </div>
                  <h3
                    class="mt-4 text-lg font-medium text-[var(--color-text-primary)]"
                  >
                    Payment Gateway Integration
                  </h3>
                  <p class="mt-2 text-sm text-[var(--color-text-secondary)]">
                    This feature is currently under development. We're working
                    hard to bring you secure payment processing capabilities
                    soon.
                  </p>
                  <div class="mt-6">
                    <span
                      class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800"
                    >
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Password Panel -->
            <div
              v-if="activeTab === 'password'"
              key="password"
              class="space-y-6 relative"
            >
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
                      >
                        Current Password
                      </label>
                      <div
                        class="relative"
                        :class="{ 'has-error': errors.currentPassword }"
                      >
                        <input
                          :type="showCurrentPassword ? 'text' : 'password'"
                          v-model="passwordForm.currentPassword"
                          placeholder="Enter current password"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500':
                              errors.currentPassword,
                          }"
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
                      <p
                        v-if="errors.currentPassword"
                        class="mt-1 text-sm text-red-600"
                      >
                        {{ errors.currentPassword }}
                      </p>
                    </div>

                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        New Password
                      </label>
                      <div
                        class="relative"
                        :class="{ 'has-error': errors.newPassword }"
                      >
                        <input
                          :type="showNewPassword ? 'text' : 'password'"
                          v-model="passwordForm.newPassword"
                          placeholder="Enter new password"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500':
                              errors.newPassword,
                          }"
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
                      <p
                        v-if="errors.newPassword"
                        class="mt-1 text-sm text-red-600"
                      >
                        {{ errors.newPassword }}
                      </p>
                    </div>

                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Confirm New Password
                      </label>
                      <div
                        class="relative"
                        :class="{ 'has-error': errors.confirmPassword }"
                      >
                        <input
                          :type="showConfirmPassword ? 'text' : 'password'"
                          v-model="passwordForm.confirmPassword"
                          placeholder="Confirm new password"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500':
                              errors.confirmPassword,
                          }"
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
                      <p
                        v-if="errors.confirmPassword"
                        class="mt-1 text-sm text-red-600"
                      >
                        {{ errors.confirmPassword }}
                      </p>
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

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

import StatusModal from "~/components/common/StatusModal.vue";
import type { FetchError } from "ofetch";

interface BreakTime {
  id: number | null;
  startTime: string;
  endTime: string;
}

interface Settings {
  openingTime: string;
  closingTime: string;
  slotDuration: number;
  breakTimes: BreakTime[];
  restDuration: number;
  paymentProvider: string;
  apiKey: string;
  webhookSecret: string;
  testMode: boolean;
  currency: string;
  maxPax: number;
  maxFreePax: number;
  chargePerPax: number;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ApiResponse {
  statusCode: number;
  message?: string;
  data?: {
    slotConfig?: {
      start_time: string;
      end_time: string;
      duration: number;
      rest: number;
    };
    breaks?: Array<{
      id: number;
      start_time: string;
      end_time: string;
    }>;
    chargePerPax?: number;
    maxFreePax?: number;
    maxPax?: number;
  };
}

interface Errors {
  openingTime?: string;
  closingTime?: string;
  apiKey?: string;
  webhookSecret?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  maxPax?: string;
  maxFreePax?: string;
  chargePerPax?: string;
  waitlistLimit?: string;
  [key: string]: string | undefined; // Add index signature for dynamic break time errors
}

type ModalStatus = "success" | "error";

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
    name: "number-of-pax",
    label: "Number of Pax",
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
const settings = ref<Settings>({
  openingTime: "09:00",
  closingTime: "17:00",
  slotDuration: 30,
  breakTimes: [],
  restDuration: 15,
  paymentProvider: "stripe",
  apiKey: "",
  webhookSecret: "",
  testMode: true,
  currency: "MYR",
  maxPax: 10,
  maxFreePax: 1,
  chargePerPax: 0,
});

// Password change form
const passwordForm = ref<PasswordForm>({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Add form validation
const errors = ref<Errors>({});

// Add modal state
const modalState = ref({
  isOpen: false,
  status: "success" as ModalStatus,
  title: "",
  message: "",
});

const isLoading = ref(true);
const isSaving = ref(false);
const isChangingPassword = ref(false);

// Add loading states for each tab
const loadingStates = ref({
  booking: false,
  payment: false,
  password: false,
  pax: false,
});

function showModal(status: ModalStatus, title: string, message: string) {
  modalState.value = {
    isOpen: true,
    status,
    title,
    message,
  };
}

function closeModal() {
  modalState.value.isOpen = false;
}

// Validate time ranges
function validateTimeRanges() {
  errors.value = {};

  const opening = new Date(`2000-01-01T${settings.value.openingTime}`);
  const closing = new Date(`2000-01-01T${settings.value.closingTime}`);

  if (closing <= opening) {
    errors.value.closingTime = "Closing time must be after opening time";
  }

  // Validate each break time
  settings.value.breakTimes.forEach((breakTime, index) => {
    const breakStart = new Date(`2000-01-01T${breakTime.startTime}`);
    const breakEnd = new Date(`2000-01-01T${breakTime.endTime}`);

    if (breakEnd <= breakStart) {
      errors.value[`breakTime${index}End`] =
        "Break end time must be after break start time";
    }
    if (breakStart < opening) {
      errors.value[`breakTime${index}Start`] =
        "Break must be within business hours";
    }
    if (breakEnd > closing) {
      errors.value[`breakTime${index}End`] =
        "Break must be within business hours";
    }

    // Check for overlapping breaks
    settings.value.breakTimes.forEach((otherBreak, otherIndex) => {
      if (index !== otherIndex) {
        const otherStart = new Date(`2000-01-01T${otherBreak.startTime}`);
        const otherEnd = new Date(`2000-01-01T${otherBreak.endTime}`);

        if (
          (breakStart >= otherStart && breakStart < otherEnd) ||
          (breakEnd > otherStart && breakEnd <= otherEnd) ||
          (breakStart <= otherStart && breakEnd >= otherEnd)
        ) {
          errors.value[`breakTime${index}Start`] = "Break times cannot overlap";
          errors.value[`breakTime${index}End`] = "Break times cannot overlap";
        }
      }
    });
  });
}

// Watch for time changes
watch(
  [
    () => settings.value.openingTime,
    () => settings.value.closingTime,
    () => settings.value.breakTimes,
  ],
  validateTimeRanges,
  { deep: true }
);

// Add validation for password change
const validatePasswordChange = () => {
  const passwordErrors: Errors = {};

  if (!passwordForm.value.currentPassword) {
    passwordErrors.currentPassword = "Current password is required";
  }

  if (!passwordForm.value.newPassword) {
    passwordErrors.newPassword = "New password is required";
  } else if (passwordForm.value.newPassword.length < 8) {
    passwordErrors.newPassword = "Password must be at least 8 characters";
  }

  if (!passwordForm.value.confirmPassword) {
    passwordErrors.confirmPassword = "Please confirm your new password";
  } else if (
    passwordForm.value.newPassword !== passwordForm.value.confirmPassword
  ) {
    passwordErrors.confirmPassword = "Passwords do not match";
  }

  return passwordErrors;
};

async function fetchConfig() {
  try {
    isLoading.value = true;
    const response = await $fetch<ApiResponse>("/api/setting/get-configs");

    console.log("Response: ", response);

    if (response.statusCode === 200 && response.data) {
      if (response.data.slotConfig) {
        settings.value.openingTime = response.data.slotConfig.start_time;
        settings.value.closingTime = response.data.slotConfig.end_time;

        // Handle multiple break times from API
        if (Array.isArray(response.data.breaks)) {
          settings.value.breakTimes = response.data.breaks.map((breakTime) => ({
            id: breakTime.id,
            startTime: breakTime.start_time,
            endTime: breakTime.end_time,
          }));
        } else {
          // Fallback for backward compatibility
          // settings.value.breakTimes = [
          //   {
          //     id: 1,
          //     startTime: response.data.breaks[0].start_time,
          //     endTime: response.data.breaks[0].end_time,
          //   },
          // ];
        }

        settings.value.slotDuration = response.data.slotConfig.duration;
        settings.value.restDuration = response.data.slotConfig.rest;
      }

      if (response.data.chargePerPax !== undefined) {
        settings.value.chargePerPax = response.data.chargePerPax;
      }
      if (response.data.maxFreePax !== undefined) {
        settings.value.maxFreePax = response.data.maxFreePax;
      }
      if (response.data.maxPax !== undefined) {
        settings.value.maxPax = response.data.maxPax;
      }
    }
  } catch (error) {
    const fetchError = error as FetchError;
    console.error(fetchError);
    showModal(
      "error",
      "Error",
      fetchError.message || "Failed to load settings"
    );
  } finally {
    isLoading.value = false;
  }
}

async function saveSlotConfig() {
  try {
    loadingStates.value.booking = true;

    // Validate all break times are filled
    const hasEmptyBreakTimes = settings.value.breakTimes.some(
      (breakTime) => !breakTime.startTime || !breakTime.endTime
    );

    if (hasEmptyBreakTimes) {
      showModal("error", "Error", "Please fill in all break time fields");
      return;
    }

    // Validate time ranges before saving
    validateTimeRanges();
    if (Object.keys(errors.value).length > 0) {
      showModal(
        "error",
        "Error",
        "Please fix the time range errors before saving"
      );
      return;
    }

    const response = await $fetch<ApiResponse>(
      "/api/setting/update-slot-config",
      {
        method: "POST",
        body: {
          start_time: settings.value.openingTime,
          end_time: settings.value.closingTime,
          breaks: settings.value.breakTimes.map((breakTime) => ({
            id: breakTime.id,
            start_time: breakTime.startTime,
            end_time: breakTime.endTime,
          })),
          duration: settings.value.slotDuration,
          rest: settings.value.restDuration,
        },
      }
    );

    if (response.statusCode === 200) {
      showModal(
        "success",
        "Success",
        "Slot configuration has been updated successfully"
      );
    } else {
      showModal(
        "error",
        "Error",
        response.message || "Failed to update slot configuration"
      );
    }
  } catch (error) {
    const fetchError = error as FetchError;
    console.error(fetchError);
    showModal(
      "error",
      "Error",
      fetchError.message || "Failed to update slot configuration"
    );
  } finally {
    loadingStates.value.booking = false;
  }
}

async function savePaxSettings() {
  try {
    loadingStates.value.pax = true;

    // Validate pax settings
    if (settings.value.maxPax < 1) {
      errors.value.maxPax = "Maximum participants must be at least 1";
      return;
    }

    if (settings.value.maxFreePax < 0) {
      errors.value.maxFreePax = "Maximum free participants cannot be negative";
      return;
    }

    if (settings.value.maxFreePax > settings.value.maxPax) {
      errors.value.maxFreePax =
        "Maximum free participants cannot exceed maximum participants";
      return;
    }

    if (settings.value.chargePerPax < 0) {
      errors.value.chargePerPax = "Charge per participant cannot be negative";
      return;
    }

    const response = await $fetch<ApiResponse>(
      "/api/setting/update-pax-config",
      {
        method: "PUT",
        body: {
          maxPax: settings.value.maxPax,
          maxFreePax: settings.value.maxFreePax,
          chargePerPax: settings.value.chargePerPax,
        },
      }
    );

    if (response.statusCode === 200) {
      showModal(
        "success",
        "Success",
        "Participant settings have been updated successfully"
      );
    } else {
      showModal(
        "error",
        "Error",
        response.message || "Failed to update participant settings"
      );
    }
  } catch (error) {
    const fetchError = error as FetchError;
    console.error(fetchError);
    showModal(
      "error",
      "Error",
      fetchError.message || "Failed to update participant settings"
    );
  } finally {
    loadingStates.value.pax = false;
  }
}

async function handlePasswordChange() {
  try {
    isChangingPassword.value = true;

    // Validate password change
    const passwordErrors = validatePasswordChange();
    if (Object.keys(passwordErrors).length > 0) {
      errors.value = { ...errors.value, ...passwordErrors };
      return;
    }

    const response = await $fetch<ApiResponse>("/api/setting/update-password", {
      method: "POST",
      body: {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword,
        confirmPassword: passwordForm.value.confirmPassword,
      },
    });

    if (response.statusCode === 200) {
      showModal("success", "Success", "Password has been changed successfully");
      // Reset form
      passwordForm.value = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
      // Clear errors
      errors.value = {};
    } else {
      showModal(
        "error",
        "Error",
        response.message || "Failed to change password"
      );
    }
  } catch (error) {
    const fetchError = error as FetchError;
    console.error(fetchError);
    showModal(
      "error",
      "Error",
      fetchError.message || "Failed to change password"
    );
  } finally {
    isChangingPassword.value = false;
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

.break-list-enter-active,
.break-list-leave-active {
  transition: all 0.3s ease;
}
.break-list-enter-from,
.break-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.break-list-move {
  transition: transform 0.3s ease;
}
</style>
