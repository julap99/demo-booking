<template>
  <div>
    <!-- Floating Music Control - Made smaller and more subtle on mobile -->
    <div class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <button
        @click="toggleMusic"
        class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#3C2A21]/90 text-white shadow-lg hover:bg-[#3C2A21] transition-all duration-200"
        :class="{ 'animate-pulse': isMusicPlaying }"
      >
        <svg
          class="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          :class="{ hidden: isMusicPlaying }"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.536 8.464a5 5 0 010 7.072M12 9.64a3 3 0 010 4.72M14 7.97v8.05c0 1.1-.9 2-2 2H6L2 22V4l4 4h6c1.1 0 2 .9 2 2z"
          />
        </svg>
        <svg
          class="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          :class="{ hidden: !isMusicPlaying }"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      </button>
    </div>

    <div
      class="min-h-screen font-sans"
      :style="{
        background: `linear-gradient(to bottom right, var(--color-bg-primary), var(--color-bg-secondary), var(--color-bg-tertiary))`
      }"
    >
      <div class="max-w-lg mx-auto px-4 py-4 sm:py-8">
        <!-- Main Card -->
        <div
          class="bg-white rounded-2xl sm:rounded-[32px] shadow-xl shadow-[#3C2A21]/10 overflow-hidden"
        >
          <!-- Header with Steps -->
          <div class="relative bg-white px-4 sm:px-6 py-6 sm:py-8 border-[#3C2A21]/10">
            <h1
              class="text-lg sm:text-2xl font-semibold text-[#3C2A21] text-center mb-6 sm:mb-10 font-playfair"
            >
              Book Your Session
            </h1>

            <!-- Mobile Step Indicator -->
            <div class="block sm:hidden mb-4">
              <div class="flex items-center justify-center space-x-2">
                <span class="text-sm text-[#3C2A21]">Step {{ currentStep }} of {{ steps.length }}</span>
                <span class="text-sm text-[#3C2A21]/60">- {{ steps[currentStep - 1].label }}</span>
              </div>
              <!-- Progress bar for mobile -->
              <div class="mt-2 h-1 bg-[#3C2A21]/20 rounded-full">
                <div
                  class="h-1 bg-[#3C2A21] rounded-full transition-all duration-500"
                  :style="{ width: ((currentStep) / steps.length) * 100 + '%' }"
                ></div>
              </div>
            </div>

            <!-- Desktop Progress Steps - Hidden on mobile -->
            <div class="hidden sm:block">
              <div class="max-w-2xl mx-auto">
                <div class="relative flex items-center justify-between">
                  <!-- Progress Line -->
                  <div class="absolute left-0 top-1/2 w-full h-0.5 -translate-y-1/2">
                    <div class="absolute inset-0 bg-[#3C2A21]/20 rounded-full"></div>
                    <div
                      class="absolute inset-0 rounded-full bg-[#3C2A21] transition-all duration-500 ease-out"
                      :style="{
                        width: ((currentStep - 1) / (steps.length - 1)) * 100 + '%',
                      }"
                    ></div>
                  </div>

                  <!-- Steps -->
                  <template v-for="(step, index) in steps" :key="step.number">
                    <div class="relative flex flex-col items-center">
                      <button
                        @click="goToStep(step.number)"
                        :disabled="step.number > currentStep + 1"
                        :class="[
                          'relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300',
                          currentStep >= step.number
                            ? 'bg-[#3C2A21] text-white shadow-lg shadow-[#3C2A21]/20'
                            : 'bg-white text-[#3C2A21]/60 border-2 border-[#3C2A21]/20',
                          step.number <= currentStep + 1 && 'cursor-pointer hover:scale-105',
                          step.number > currentStep + 1 && 'cursor-not-allowed opacity-60',
                        ]"
                      >
                        <div class="relative flex items-center justify-center">
                          <svg
                            v-if="currentStep > step.number"
                            class="w-4 h-4 sm:w-5 sm:h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2.5"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span v-else class="text-xs sm:text-sm font-medium">
                            {{ step.number }}
                          </span>
                        </div>
                      </button>
                      <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 w-max">
                        <span
                          class="text-xs whitespace-nowrap font-playfair"
                          :class="currentStep >= step.number ? 'text-[#3C2A21]' : 'text-[#3C2A21]/60'"
                        >
                          {{ step.label }}
                        </span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Content -->
          <div class="px-4 sm:px-6 py-6 sm:py-8">
            <TransitionGroup name="fade">
              <!-- Step 1: Session (Select Date & Time) -->
              <div v-show="currentStep === 1" key="step1" class="space-y-6">
                <div class="max-w-sm mx-auto">
                  <h2 class="text-base sm:text-lg font-semibold text-gray-900 mb-4 font-playfair">
                    Select Date & Time
                  </h2>

                  <!-- Horizontal Date Picker -->
                  <div class="bg-[#F5E6E0] rounded-xl p-4 sm:p-6">
                    <!-- Month Navigation -->
                    <div class="flex items-center justify-between mb-4">
                      <button
                        @click="previousMonth"
                        class="p-2 hover:bg-white/50 rounded-lg transition-colors"
                      >
                        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <h4 class="text-sm sm:text-base font-medium">
                        {{ currentMonthName }} {{ currentYear }}
                      </h4>
                      <button
                        @click="nextMonth"
                        class="p-2 hover:bg-white/50 rounded-lg transition-colors"
                      >
                        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    <!-- Scrollable Date Cards -->
                    <div class="relative">
                      <!-- Shadow Indicators -->
                      <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#F5E6E0] to-transparent pointer-events-none z-10"></div>
                      <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F5E6E0] to-transparent pointer-events-none z-10"></div>
                      
                      <!-- Desktop Navigation Buttons -->
                      <button 
                        @click="slideDates('prev')"
                        class="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center bg-white rounded-full shadow-lg hover:bg-[#3C2A21] hover:text-white transition-all duration-200"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        @click="slideDates('next')"
                        class="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center bg-white rounded-full shadow-lg hover:bg-[#3C2A21] hover:text-white transition-all duration-200"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      <!-- Scrollable Container -->
                      <div class="overflow-x-auto hide-scrollbar" ref="dateScrollContainer">
                        <div class="flex space-x-3 py-2 px-2 min-w-min">
                          <template v-for="day in calendarDays" :key="day.date">
                            <button
                              v-if="day.isCurrentMonth"
                              @click="day.isSelectable && selectDate(day.date)"
                              :disabled="!day.isSelectable"
                              :class="[
                                'flex-shrink-0 w-20 p-3 rounded-xl transition-all duration-200',
                                isDateSelected(day.date)
                                  ? 'bg-[#3C2A21] text-white shadow-lg'
                                  : day.isSelectable
                                  ? 'bg-white hover:bg-[#3C2A21]/5'
                                  : 'bg-white/50 cursor-not-allowed opacity-50',
                              ]"
                            >
                              <!-- Day Name -->
                              <div class="text-xs font-medium mb-1">
                                {{ new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }) }}
                              </div>
                              <!-- Date -->
                              <div class="text-lg font-semibold mb-1">
                                {{ new Date(day.date).getDate() }}
                              </div>
                              <!-- Event Count -->
                              <div class="text-xs">
                                {{ getEventCount(day.date) }} slots
                              </div>
                            </button>
                          </template>
                        </div>
                      </div>
                    </div>

                    <!-- Time Slots -->
                    <div v-if="formData.date" ref="timeSlotsSection" class="mt-6">
                      <h4 class="text-sm font-medium text-[#3C2A21] mb-3 font-playfair">
                        Available Time Slots
                      </h4>
                      <div class="grid grid-cols-2 gap-2">
                        <button
                          v-for="slot in timeSlots"
                          :key="slot"
                          @click="selectTimeSlot(slot)"
                          :class="[
                            'py-3 px-3 rounded-lg text-sm font-medium transition-all active:scale-95',
                            formData.timeSlot === slot
                              ? 'bg-[#3C2A21] text-white'
                              : 'bg-white hover:bg-[#3C2A21]/5 text-[#3C2A21]',
                          ]"
                        >
                          {{ slot }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Choose Theme -->
              <div v-show="currentStep === 2" key="step2" class="space-y-6">
                <div class="max-w-sm mx-auto">
                  <h2 class="text-base sm:text-lg font-semibold text-gray-900 mb-4 font-playfair">
                    Choose your theme
                  </h2>

                  <!-- Session Type Cards - Optimized for mobile -->
                  <div class="space-y-4">
                    <div
                      v-for="type in sessionTypes"
                      :key="type.value"
                      @click="selectSessionType(type.value)"
                      class="relative"
                    >
                      <div
                        :class="[
                          'p-4 sm:p-6 rounded-xl transition-all duration-300 cursor-pointer bg-white',
                          'border-2 hover:shadow-lg active:scale-98',
                          formData.sessionType === type.value
                            ? 'border-[#3C2A21] shadow-lg shadow-[#3C2A21]/10'
                            : 'border-[#3C2A21]/10 hover:border-[#3C2A21]/30',
                        ]"
                      >
                        <!-- Content -->
                        <div class="space-y-3">
                          <div>
                            <h3 class="text-lg font-semibold text-[#3C2A21] font-playfair mb-1">
                              {{ type.label }}
                            </h3>
                            <p class="text-sm text-[#3C2A21]/70">
                              {{ type.description }}
                            </p>
                          </div>

                          <!-- Footer -->
                          <div class="pt-3 border-t border-[#3C2A21]/10">
                            <div class="flex items-center justify-between">
                              <div>
                                <p class="text-xs text-[#3C2A21]/70">Price</p>
                                <p class="text-lg font-semibold text-[#3C2A21]">
                                  {{ formatPrice(type.price) }}
                                </p>
                              </div>
                              <button
                                :class="[
                                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                  formData.sessionType === type.value
                                    ? 'bg-[#3C2A21] text-white'
                                    : 'bg-[#F5E6E0] text-[#3C2A21] hover:bg-[#3C2A21] hover:text-white',
                                ]"
                              >
                                {{ formData.sessionType === type.value ? "Selected" : "Select" }}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 3: Personal Information -->
              <div v-show="currentStep === 3" key="step3" class="space-y-6">
                <div class="max-w-sm mx-auto">
                  <h2 class="text-base sm:text-lg font-semibold text-[#3C2A21] mb-4 font-playfair">
                    Tell us about yourself
                  </h2>
                  <div class="space-y-4">
                    <!-- Name Input -->
                    <div class="form-group">
                      <input
                        type="text"
                        id="name"
                        v-model="formData.name"
                        class="form-input peer"
                        :class="{ error: errors.name }"
                        placeholder=" "
                        required
                        @blur="validateField('name')"
                      />
                      <label for="name" class="form-label">Full Name</label>
                      <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
                    </div>

                    <!-- Email Input -->
                    <div class="form-group">
                      <input
                        type="email"
                        id="email"
                        v-model="formData.email"
                        class="form-input peer"
                        :class="{ error: errors.email }"
                        placeholder=" "
                        required
                        @blur="validateField('email')"
                      />
                      <label for="email" class="form-label">Email Address</label>
                      <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
                    </div>

                    <!-- Phone Input -->
                    <div class="form-group">
                      <input
                        type="tel"
                        id="phone"
                        v-model="formData.phone"
                        class="form-input peer"
                        :class="{ error: errors.phone }"
                        placeholder=" "
                        required
                        @blur="validateField('phone')"
                      />
                      <label for="phone" class="form-label">Phone Number</label>
                      <p v-if="errors.phone" class="form-error">{{ errors.phone }}</p>
                    </div>

                    <!-- Address Input -->
                    <div class="form-group">
                      <textarea
                        id="address"
                        v-model="formData.address"
                        rows="3"
                        class="form-input peer min-h-[100px] resize-none"
                        :class="{ error: errors.address }"
                        placeholder=" "
                        required
                        @blur="validateField('address')"
                      ></textarea>
                      <label for="address" class="form-label">Address</label>
                      <p v-if="errors.address" class="form-error">{{ errors.address }}</p>
                    </div>

                    <!-- Terms & Conditions -->
                    <div class="pt-2">
                      <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0">
                          <div class="custom-checkbox">
                            <input
                              id="terms"
                              type="checkbox"
                              v-model="formData.termsAccepted"
                              class="hidden"
                              required
                              @blur="validateField('terms')"
                            />
                            <label
                              for="terms"
                              class="checkbox-label"
                              :class="{ 'checkbox-error': errors.terms }"
                            >
                              <svg class="checkbox-icon" viewBox="0 0 24 24">
                                <path
                                  d="M5 13l4 4L19 7"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="3"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </label>
                          </div>
                        </div>
                        <div class="text-sm">
                          <label for="terms" class="text-[#3C2A21] font-playfair">
                            I agree to the
                            <button
                              type="button"
                              @click="showTerms = true"
                              class="text-[#3C2A21] hover:text-[#5C4033] transition-colors font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[#3C2A21]/20 rounded"
                            >
                              Terms and Conditions
                            </button>
                          </label>
                          <p v-if="errors.terms" class="text-xs text-red-500 mt-1">
                            {{ errors.terms }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 4: Payment -->
              <div v-show="currentStep === 4" key="step4" class="space-y-6">
                <div class="max-w-sm mx-auto">
                  <h2 class="text-base sm:text-lg font-semibold text-[#3C2A21] mb-4 font-playfair">
                    Complete your booking
                  </h2>

                  <!-- Session Summary -->
                  <div class="bg-[#F5E6E0] rounded-xl p-4 sm:p-6 mb-6">
                    <h3 class="text-base font-medium text-[#3C2A21] mb-4 font-playfair">
                      Booking Summary
                    </h3>
                    <div class="space-y-3">
                      <div class="flex justify-between items-center">
                        <span class="text-sm text-[#3C2A21]/70">Session Type</span>
                        <span class="text-sm font-medium text-[#3C2A21]">
                          {{ formData.sessionType === "wedding" ? "Wedding Photography" : "Event Photography" }}
                        </span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-sm text-[#3C2A21]/70">Date & Time</span>
                        <span class="text-sm font-medium text-[#3C2A21]">
                          {{ formatDate(formData.date) }} at {{ formData.timeSlot }}
                        </span>
                      </div>
                      <div class="pt-3 mt-3 border-t border-[#3C2A21]/10">
                        <div class="space-y-2">
                          <div class="flex justify-between items-center text-[#3C2A21]/70">
                            <span class="text-sm">Total Package Price</span>
                            <span class="text-sm">{{ sessionPrice }}</span>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-[#3C2A21]">Deposit Amount (Required)</span>
                            <span class="text-base font-semibold text-[#3C2A21]">{{ depositAmount }}</span>
                          </div>
                          <p class="text-xs text-[#3C2A21]/70 mt-2">
                            * Balance payment will be required on the day of the session
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Payment Method Selection -->
                  <div class="space-y-4">
                    <h3 class="text-base font-medium text-[#3C2A21] mb-3 font-playfair">
                      Select Payment Method
                    </h3>

                    <!-- Online Banking -->
                    <div class="p-4 rounded-xl border-2 border-[#3C2A21] bg-[#3C2A21]/5 cursor-pointer active:scale-98 transition-transform">
                      <div class="flex items-center">
                        <div class="w-4 h-4 rounded-full border-2 border-[#3C2A21] bg-[#3C2A21] mr-3 flex items-center justify-center">
                          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                        <div>
                          <h4 class="text-sm font-medium text-[#3C2A21] font-playfair">FPX Online Banking</h4>
                          <p class="text-xs text-[#3C2A21]/70 mt-0.5">
                            Pay securely with your online banking account
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Credit/Debit Card (Disabled) -->
                    <div class="p-4 rounded-xl border-2 border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed">
                      <div class="flex items-center">
                        <div class="w-4 h-4 rounded-full border-2 border-gray-300 mr-3"></div>
                        <div>
                          <h4 class="text-sm font-medium text-gray-400">Credit / Debit Card</h4>
                          <p class="text-xs text-gray-400 mt-0.5">Currently unavailable</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- Navigation Footer -->
          <div class="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-br from-[#F5E6E0] via-[#E6CCB2] to-[#DDB892] flex justify-between items-center">
            <button
              v-if="currentStep > 1"
              @click="currentStep--"
              class="btn btn-secondary text-sm"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
            <NuxtLink v-else to="/" class="btn btn-secondary text-sm">
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </NuxtLink>

            <button
              v-if="currentStep < 4"
              @click="nextStep"
              class="btn btn-primary text-sm"
            >
              Continue
              <svg
                class="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              v-else
              @click="processPayment"
              :disabled="isProcessing"
              class="btn btn-primary text-sm"
            >
              <span v-if="isProcessing" class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Processing...
              </span>
              <span v-else>Complete Booking</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Terms and Conditions Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showTerms"
          class="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <!-- Background overlay -->
          <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

          <div class="flex min-h-screen items-center justify-center p-4">
            <!-- Modal panel -->
            <div class="relative transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all w-full max-w-lg">
              <!-- Header -->
              <div class="border-b border-[#3C2A21]/10 px-4 sm:px-6 py-4 flex items-center justify-between">
                <h3 class="text-base sm:text-lg font-semibold text-[#3C2A21]" id="modal-title">
                  Terms and Conditions
                </h3>
                <button
                  @click="showTerms = false"
                  class="text-[#3C2A21]/60 hover:text-[#3C2A21] transition-colors p-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- Content -->
              <div class="px-4 sm:px-6 py-4 max-h-[60vh] overflow-y-auto">
                <div class="space-y-6 text-[#3C2A21]">
                  <!-- Booking & Payment -->
                  <section>
                    <h4 class="text-sm sm:text-base font-semibold mb-3 font-playfair">
                      1. Booking & Payment
                    </h4>
                    <div class="space-y-2 text-xs sm:text-sm">
                      <p>• A deposit payment is required to secure your booking date.</p>
                      <p>• For Wedding Photography: RM500 deposit</p>
                      <p>• For Event Photography: RM300 deposit</p>
                      <p>• The remaining balance must be paid on the day of the session before the shoot begins.</p>
                      <p>• Deposits are non-refundable but transferable to another date (subject to availability).</p>
                    </div>
                  </section>

                  <!-- Cancellation & Rescheduling -->
                  <section>
                    <h4 class="text-sm sm:text-base font-semibold mb-3 font-playfair">
                      2. Cancellation & Rescheduling
                    </h4>
                    <div class="space-y-2 text-xs sm:text-sm">
                      <p>• Cancellations made 30 days or more before the session: 50% deposit refund</p>
                      <p>• Cancellations made less than 30 days before the session: No refund</p>
                      <p>• Rescheduling is allowed once, subject to availability</p>
                      <p>• Rescheduling must be requested at least 14 days before the session</p>
                    </div>
                  </section>

                  <!-- Image Rights & Delivery -->
                  <section>
                    <h4 class="text-sm sm:text-base font-semibold mb-3 font-playfair">
                      3. Image Rights & Delivery
                    </h4>
                    <div class="space-y-2 text-xs sm:text-sm">
                      <p>• The photographer retains copyright of all images</p>
                      <p>• Images may be used for portfolio and marketing purposes</p>
                      <p>• High-resolution digital images will be delivered via online gallery</p>
                      <p>• Wedding photos: Delivery within 4-6 weeks</p>
                      <p>• Event photos: Delivery within 2-3 weeks</p>
                    </div>
                  </section>

                  <!-- Session Guidelines -->
                  <section>
                    <h4 class="text-sm sm:text-base font-semibold mb-3 font-playfair">
                      4. Session Guidelines
                    </h4>
                    <div class="space-y-2 text-xs sm:text-sm">
                      <p>• Please arrive on time for your session</p>
                      <p>• The photographer reserves the right to leave after 30 minutes of waiting</p>
                      <p>• Additional hours can be added on the day at RM200 per hour</p>
                      <p>• Weather contingency plans will be discussed prior to outdoor sessions</p>
                    </div>
                  </section>
                </div>
              </div>

              <!-- Footer -->
              <div class="border-t border-[#3C2A21]/10 px-4 sm:px-6 py-4 flex justify-end">
                <button
                  @click="showTerms = false"
                  class="px-4 py-2 text-sm font-medium text-white bg-[#3C2A21] rounded-lg hover:bg-[#5C4033] transition-colors active:scale-95"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";

// Define page meta to use empty layout
definePageMeta({
  layout: "empty",
  head: {
    link: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap",
      },
    ],
  },
});

// Add ref for html2pdf instance
const html2pdf = ref(null);

// Load html2pdf only on client side
onMounted(async () => {
  try {
    html2pdf.value = (await import("html2pdf.js")).default;
  } catch (error) {
    console.error("Failed to load html2pdf:", error);
  }
});

// Enhanced steps configuration
const steps = [
  {
    number: 1,
    label: "Session",
    description: "Select date and time for your session",
  },
  {
    number: 2,
    label: "Choose Theme",
    description: "Select your preferred photography theme",
  },
  {
    number: 3,
    label: "Your Details",
    description: "Basic information needed for booking",
  },
  {
    number: 4,
    label: "Payment",
    description: "Secure payment to confirm booking",
  },
];

// Session types configuration
const sessionTypes = [
  {
    value: "themeA",
    label: "Theme A",
    description:
      "A luxurious and elegant theme with warm, earthy tones and sophisticated compositions.",
    price: 1500,
    deposit: 500,
    details: {
      duration: "10 hours coverage",
      deliverables: [
        "300+ professionally edited photos",
        "Premium photo album (30 pages)",
        "Online gallery with downloading",
        "All high-resolution images",
        "Artistic color grading",
        "Premium retouching service",
      ],
      timeframe: "Photos delivered within 4-6 weeks",
      additionalInfo: "Includes pre-session consultation",
    },
  },
  {
    value: "themeB",
    label: "Theme B",
    description:
      "A modern and vibrant theme with bright, airy aesthetics and contemporary styling.",
    price: 800,
    deposit: 300,
    details: {
      duration: "6 hours coverage",
      deliverables: [
        "200+ professionally edited photos",
        "Online gallery with downloading",
        "All high-resolution images",
        "Modern color treatment",
      ],
      timeframe: "Photos delivered within 2-3 weeks",
      additionalInfo: "Includes theme consultation",
    },
  },
];

// Form state
const currentStep = ref(1);
const isProcessing = ref(false);
const formData = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
  termsAccepted: false,
  date: "",
  timeSlot: "",
  sessionType: "",
});

const paymentData = ref({
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
});

const errors = ref({});

// Calendar state
const currentDate = ref(new Date());
const selectedDate = ref(null);

// Calendar computed properties
const currentMonthName = computed(() => {
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    currentDate.value
  );
});

const currentYear = computed(() => {
  return currentDate.value.getFullYear();
});

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  
  // Add current month's days
  for (let i = 1; i <= lastDay; i++) {
    const date = new Date(year, month, i);
    days.push({
      date: date.toISOString().split('T')[0],
      isCurrentMonth: true,
      isSelectable: date >= today
    });
  }

  return days;
});

// Calendar methods
const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

// Add ref for time slots section
const timeSlotsSection = ref(null);

// Update selectDate function
const selectDate = async (date) => {
  formData.value.date = date;
  validateField("date");

  // Wait for DOM update then scroll to time slots
  await nextTick();
  if (timeSlotsSection.value) {
    timeSlotsSection.value.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

const isDateSelected = (date) => {
  return formData.value.date === date;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Session selection
const selectSessionType = (type) => {
  formData.value.sessionType = type;
  validateField("sessionType");
};

// Time slots
const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

const selectTimeSlot = (slot) => {
  formData.value.timeSlot = slot;
  validateField("timeSlot");
};

// Computed session price based on type
const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};

const sessionPrice = computed(() => {
  const type = sessionTypes.find((t) => t.value === formData.value.sessionType);
  return type ? formatPrice(type.price) : formatPrice(0);
});

const depositAmount = computed(() => {
  const type = sessionTypes.find((t) => t.value === formData.value.sessionType);
  return type ? formatPrice(type.deposit) : formatPrice(0);
});

// Validation functions
const validateField = (field) => {
  errors.value[field] = "";

  switch (field) {
    case "name":
      if (!formData.value.name) {
        errors.value.name = "Name is required";
      } else if (formData.value.name.length < 2) {
        errors.value.name = "Name must be at least 2 characters";
      }
      break;
    case "email":
      if (!formData.value.email) {
        errors.value.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
        errors.value.email = "Please enter a valid email address";
      }
      break;
    case "phone":
      if (!formData.value.phone) {
        errors.value.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.value.phone.replace(/\D/g, ""))) {
        errors.value.phone = "Please enter a valid 10-digit phone number";
      }
      break;
    case "address":
      if (!formData.value.address) {
        errors.value.address = "Address is required";
      } else if (formData.value.address.length < 10) {
        errors.value.address = "Please enter a complete address";
      }
      break;
    case "sessionType":
      if (!formData.value.sessionType) {
        errors.value.sessionType = "Please select a theme";
      }
      break;
    case "date":
      if (!formData.value.date) {
        errors.value.date = "Please select a date";
      }
      break;
    case "timeSlot":
      if (!formData.value.timeSlot) {
        errors.value.timeSlot = "Please select a time slot";
      }
      break;
    case "cardName":
      if (!paymentData.value.cardName) {
        errors.value.cardName = "Card holder name is required";
      }
      break;
    case "cardNumber":
      if (!paymentData.value.cardNumber) {
        errors.value.cardNumber = "Card number is required";
      } else if (
        paymentData.value.cardNumber.replace(/\s/g, "").length !== 16
      ) {
        errors.value.cardNumber = "Please enter a valid card number";
      }
      break;
    case "expiry":
      if (!paymentData.value.expiry) {
        errors.value.expiry = "Expiry date is required";
      } else if (!/^\d{2}\/\d{2}$/.test(paymentData.value.expiry)) {
        errors.value.expiry = "Please enter a valid expiry date (MM/YY)";
      }
      break;
    case "cvv":
      if (!paymentData.value.cvv) {
        errors.value.cvv = "CVV is required";
      } else if (!/^\d{3}$/.test(paymentData.value.cvv)) {
        errors.value.cvv = "Please enter a valid CVV";
      }
      break;
    case "terms":
      if (!formData.value.termsAccepted) {
        errors.value.terms = "You must accept the terms and conditions";
      }
      break;
  }
};

// Format input functions
const formatCardNumber = (e) => {
  let value = e.target.value.replace(/\D/g, "");
  value = value.replace(/(\d{4})/g, "$1 ").trim();
  paymentData.value.cardNumber = value;
};

const formatExpiry = (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.slice(0, 2) + "/" + value.slice(2);
  }
  paymentData.value.expiry = value;
};

const formatCVV = (e) => {
  paymentData.value.cvv = e.target.value.replace(/\D/g, "");
};

// Form navigation and validation
const validateStep = (step) => {
  switch (step) {
    case 1:
      validateField("date");
      validateField("timeSlot");
      return !errors.value.date && !errors.value.timeSlot;
    case 2:
      validateField("sessionType");
      return !errors.value.sessionType;
    case 3:
      validateField("name");
      validateField("email");
      validateField("phone");
      validateField("address");
      validateField("terms");
      return (
        !errors.value.name &&
        !errors.value.email &&
        !errors.value.phone &&
        !errors.value.address &&
        !errors.value.terms
      );
    case 4:
      return true;
    default:
      return true;
  }
};

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    currentStep.value++;
  }
};

// Add this function to convert 12-hour to 24-hour format
const convertTo24Hour = (time12h) => {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  // Convert hours to number for calculation
  hours = parseInt(hours);

  if (hours === 12) {
    hours = modifier === "PM" ? 12 : 0;
  } else if (modifier === "PM") {
    hours += 12;
  }

  const hoursStr = hours.toString().padStart(2, "0");
  return `${hoursStr}:${minutes}`;
};

// Add this function to format date to YYYY-MM-DD
const formatToYYYYMMDD = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

// Update the processPayment function
const processPayment = async () => {
  if (!validateStep(3)) return;

  isProcessing.value = true;

  try {
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate receipt number
    const receiptNumber = generateReceiptNumber();

    // Convert time to 24-hour format
    const time24h = convertTo24Hour(formData.value.timeSlot);
    console.log("Converted time:", time24h);

    // Format date to YYYY-MM-DD
    const formattedDate = formatToYYYYMMDD(formData.value.date);
    console.log("Formatted date:", formattedDate);

    // Hit API to proceed booking
    const response = await $fetch("/api/booking/proceed", {
      method: "POST",
      body: {
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone,
        address: formData.value.address,
        theme: formData.value.sessionType,
        date: formattedDate,
        time: time24h,
        termsAccepted: formData.value.termsAccepted,
      },
    });

    console.log("API Response:", response);

    // Navigate to receipt page with booking data
    if (response.status === "success") {
      navigateTo({
        path: "/book-a-session/receipt",
        query: {
          booking: response.data.id,
        },
      });
    }
  } catch (error) {
    console.error("Booking error:", error);
    alert(
      error.data?.message || "An error occurred while processing your booking"
    );
  } finally {
    isProcessing.value = false;
  }
};

// Function to handle step navigation
const goToStep = (stepNumber) => {
  // Only allow going to completed steps or next step
  if (stepNumber <= currentStep.value || stepNumber === currentStep.value + 1) {
    if (validateStep(currentStep.value)) {
      currentStep.value = stepNumber;
    }
  }
};

// Add a Terms Modal component
const showTerms = ref(false);

// Add these new refs and functions in the script section
const showReceipt = ref(false);
const receiptContent = ref(null);
const receiptNumber = ref("");

const generateReceiptNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `INV-${timestamp.slice(-6)}${random}`;
};

const getBalanceAmount = () => {
  const type = sessionTypes.find((t) => t.value === formData.value.sessionType);
  return type ? type.price - type.deposit : 0;
};

const downloadReceipt = async () => {
  if (!html2pdf.value) {
    console.error("html2pdf not loaded");
    return;
  }

  const element = receiptContent.value;
  const opt = {
    margin: 1,
    filename: `booking-receipt-${receiptNumber.value}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  html2pdf.value().set(opt).from(element).save();
};

const closeReceipt = () => {
  showReceipt.value = false;
  // Reset form and redirect to home
  formData.value = {
    name: "",
    email: "",
    phone: "",
    address: "",
    termsAccepted: false,
    date: "",
    timeSlot: "",
    sessionType: "",
  };
  currentStep.value = 1;
};

// Music player state
const isMusicPlaying = ref(false);
const audioPlayer = ref(null);

// Initialize audio player
onMounted(() => {
  audioPlayer.value = new Audio("/music/music.mp3");
  audioPlayer.value.loop = true;
  audioPlayer.value.volume = 0.3; // Set initial volume to 30%
});

// Toggle music playback
const toggleMusic = () => {
  if (!audioPlayer.value) return;

  if (isMusicPlaying.value) {
    audioPlayer.value.pause();
  } else {
    audioPlayer.value.play();
  }
  isMusicPlaying.value = !isMusicPlaying.value;
};

// Add function to get event count for a date
function getEventCount(date) {
  // This is a mock function - replace with actual event counting logic
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  
  // For demo purposes, generate random number of events (2-8) for each date
  // In production, this should come from your backend
  return Math.floor(Math.random() * 7) + 2;
}

// Add new refs and functions for slide dates
const dateScrollContainer = ref(null);
const slideDates = (direction) => {
  if (!dateScrollContainer.value) return;

  const container = dateScrollContainer.value;
  const cardWidth = 92; // 80px (w-20) + 12px (space-x-3)
  const visibleCards = Math.floor(container.offsetWidth / cardWidth);
  const scrollAmount = cardWidth * Math.max(1, Math.floor(visibleCards / 2));

  if (direction === 'prev') {
    container.scrollLeft -= scrollAmount;
  } else if (direction === 'next') {
    container.scrollLeft += scrollAmount;
  }
};
</script>

<style lang="scss" scoped>
/* Hide scrollbar but keep functionality */
.hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scroll-behavior: smooth; /* Add smooth scrolling */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.form-group {
  @apply relative;
}

.form-input {
  @apply block w-full px-3 sm:px-4 pt-5 sm:pt-6 pb-1.5 sm:pb-2 text-sm sm:text-base text-[#3C2A21] bg-white border border-[#3C2A21]/20 rounded-xl appearance-none transition-all duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-[#3C2A21]/20 focus:border-[#3C2A21];
  @apply placeholder-transparent;

  &.error {
    @apply border-red-300 focus:ring-red-100 focus:border-red-500;
  }
}

.form-label {
  @apply absolute left-3 sm:left-4 top-3.5 sm:top-4 text-xs sm:text-sm text-[#3C2A21]/60 transition-all duration-200 cursor-text;

  .form-input:focus + &,
  .form-input:not(:placeholder-shown) + & {
    @apply transform -translate-y-2.5 scale-75 text-[#3C2A21];
  }

  .form-input.error:focus + &,
  .form-input.error:not(:placeholder-shown) + & {
    @apply text-red-500;
  }
}

.form-error {
  @apply mt-1.5 text-xs text-red-500;
}

.btn {
  @apply inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium rounded-xl transition-all duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95;

  &.btn-primary {
    @apply text-white bg-[#3C2A21] hover:bg-[#5C4033] focus:ring-[#3C2A21];
    @apply disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100;
  }

  &.btn-secondary {
    @apply text-[#3C2A21] bg-white border border-[#3C2A21]/20 hover:bg-[#F5E6E0] focus:ring-[#3C2A21];
  }
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* Custom Checkbox */
.custom-checkbox {
  @apply relative inline-block;
}

.checkbox-label {
  @apply block w-5 h-5 rounded border-2 border-[#3C2A21]/30 cursor-pointer transition-all duration-200;
  @apply hover:border-[#3C2A21]/50;
}

.checkbox-label.checkbox-error {
  @apply border-red-300;
}

.checkbox-icon {
  @apply absolute inset-0 w-full h-full text-white opacity-0 transition-all duration-200 scale-50;
}

input:checked + .checkbox-label {
  @apply bg-[#3C2A21] border-[#3C2A21];
}

input:checked + .checkbox-label .checkbox-icon {
  @apply opacity-100 scale-100;
}

input:focus + .checkbox-label {
  @apply ring-2 ring-[#3C2A21]/20;
}

@keyframes checkbox-pop {
  0% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

input:checked + .checkbox-label {
  animation: checkbox-pop 0.2s ease-in-out;
}

/* Add Playfair Display font family */
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap");

/* Add font family utility class */
.font-playfair {
  font-family: "Playfair Display", serif;
}

/* Music control animation */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

<style>
:root {
  /* Primary Colors */
  --color-primary: #3C2A21;
  --color-primary-light: #5C3D2E;
  --color-primary-dark: #2C1810;
  
  /* Background Colors */
  --color-bg-primary: #F5E6E0;
  --color-bg-secondary: #E6CCB2;
  --color-bg-tertiary: #DDB892;
  
  /* Text Colors */
  --color-text-primary: #1F1F1F;
  --color-text-secondary: #4A4A4A;
  --color-text-light: #FFFFFF;
}
</style>
