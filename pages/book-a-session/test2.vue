<template>
  <div>
    <!-- Floating Music Control - Made smaller and more subtle on mobile -->
    <!-- <div class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
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
    </div> -->

    <div
      class="min-h-screen bg-gradient-to-br from-[#F5E6E0] via-[#E6CCB2] to-[#DDB892] font-sans"
    >
      <div class="max-w-lg mx-auto px-4 py-4 sm:py-8">
        <!-- Main Card -->
        <div
          class="bg-white rounded-2xl sm:rounded-[32px] shadow-xl shadow-[#3C2A21]/10 overflow-hidden"
        >
          <!-- Header with Steps -->
          <div
            class="relative bg-white px-4 sm:px-6 py-4 sm:py-6 border-[#3C2A21]/10"
          >
            <h1
              class="text-lg sm:text-2xl font-semibold text-[#3C2A21] text-center mb-6 sm:mb-10 font-playfair"
            >
              Book Your Session
            </h1>

            <!-- Mobile Step Indicator -->
            <div class="block sm:hidden mb-4">
              <div class="flex items-center justify-center space-x-2">
                <span class="text-sm text-[#3C2A21]"
                  >Step {{ currentStep }} of {{ steps.length }}</span
                >
                <span class="text-sm text-[#3C2A21]/60"
                  >- {{ steps[currentStep - 1].label }}</span
                >
              </div>
              <!-- Progress bar for mobile -->
              <div class="mt-2 h-1 bg-[#3C2A21]/20 rounded-full">
                <div
                  class="h-1 bg-[#3C2A21] rounded-full transition-all duration-500"
                  :style="{ width: (currentStep / steps.length) * 100 + '%' }"
                ></div>
              </div>
            </div>

            <!-- Desktop Progress Steps - Hidden on mobile -->
            <div class="hidden sm:block">
              <div class="max-w-2xl mx-auto">
                <div class="relative flex items-center justify-between">
                  <!-- Progress Line -->
                  <div
                    class="absolute left-0 top-1/2 w-full h-0.5 -translate-y-1/2"
                  >
                    <div
                      class="absolute inset-0 bg-[#3C2A21]/20 rounded-full"
                    ></div>
                    <div
                      class="absolute inset-0 rounded-full bg-[#3C2A21] transition-all duration-500 ease-out"
                      :style="{
                        width:
                          ((currentStep - 1) / (steps.length - 1)) * 100 + '%',
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
                          step.number <= currentStep + 1 &&
                            'cursor-pointer hover:scale-105',
                          step.number > currentStep + 1 &&
                            'cursor-not-allowed opacity-60',
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
                      <div
                        class="absolute -bottom-6 left-1/2 -translate-x-1/2 w-max"
                      >
                        <span
                          class="text-xs whitespace-nowrap font-playfair"
                          :class="
                            currentStep >= step.number
                              ? 'text-[#3C2A21]'
                              : 'text-[#3C2A21]/60'
                          "
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
                  <h1 class="text-2xl font-bold text-[#1a1a1a] mb-2">
                    Pick a date & time
                  </h1>
                  <p class="text-md text-[#6b7280] mb-8">
                    Choose a date and time that suits your Raya photo session
                  </p>

                  <!-- Update the Month Selector -->
                  <div class="relative mb-8">
                    <select
                      v-model="currentMonth"
                      class="w-full appearance-none bg-white border-2 border-[#3C2A21]/10 hover:border-[#3C2A21]/20 rounded-2xl px-6 py-4 text-lg font-medium text-[#3C2A21] focus:outline-none focus:ring-2 focus:ring-[#3C2A21]/10 focus:border-[#3C2A21]/20 transition-all duration-200 cursor-pointer font-playfair"
                    >
                      <option
                        v-for="(month, index) in months"
                        :key="index"
                        :value="index"
                        class="py-3 text-base font-medium"
                      >
                        {{ month }} {{ currentYear }}
                      </option>
                    </select>
                    <div
                      class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none flex items-center space-x-2"
                    >
                      <div class="h-5 w-[1px] bg-[#3C2A21]/10"></div>
                      <svg
                        class="w-5 h-5 text-[#3C2A21]/60"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  <!-- Calendar Grid -->
                  <div class="relative mb-6">
                    <!-- Shadow Indicators -->
                    <div
                      class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"
                    ></div>
                    <div
                      class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"
                    ></div>

                    <!-- Navigation Buttons -->
                    <button
                      @click="slideDates('prev')"
                      class="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      <svg
                        class="w-4 h-4 text-gray-600"
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
                    </button>
                    <button
                      @click="slideDates('next')"
                      class="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      <svg
                        class="w-4 h-4 text-gray-600"
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

                    <!-- Scrollable Container -->
                    <div
                      class="overflow-x-auto hide-scrollbar"
                      ref="dateScrollContainer"
                    >
                      <div class="flex space-x-4 py-2 px-2 min-w-min">
                        <template v-for="day in calendarDays" :key="day.date">
                          <button
                            @click="day.isSelectable && selectDate(day.date)"
                            :disabled="!day.isSelectable"
                            :data-date="day.date"
                            class="flex-shrink-0 w-[120px] p-4 rounded-2xl border-2 transition-all duration-200 focus:outline-none relative"
                            :class="[
                              isDateSelected(day.date)
                                ? 'border-[#3C2A21] bg-white shadow-sm'
                                : day.isSelectable
                                ? 'border-gray-200 bg-white hover:border-gray-300'
                                : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50',
                              day.isToday && !isDateSelected(day.date)
                                ? 'border-[#3C2A21]/50'
                                : '',
                            ]"
                          >
                            <!-- Today Indicator -->
                            <div
                              v-if="day.isToday"
                              class="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#3C2A21] text-white text-xs px-2 py-0.5 rounded-full"
                            >
                              Today
                            </div>
                            <!-- Day Name -->
                            <div class="text-sm font-medium text-gray-600 mb-1">
                              {{
                                new Date(day.date).toLocaleDateString("en-US", {
                                  weekday: "short",
                                })
                              }}
                            </div>
                            <!-- Date -->
                            <div
                              class="text-2xl font-semibold text-gray-900 mb-2"
                            >
                              {{ new Date(day.date).getDate() }}
                            </div>
                            <!-- Slot Indicator -->
                            <div class="flex items-center space-x-2">
                              <div
                                class="w-2 h-2 rounded-full"
                                :class="
                                  getSlotIndicatorColor(getEventCount(day.date))
                                "
                              ></div>
                              <span class="text-sm text-gray-600">
                                {{ getEventCount(day.date) }} slots
                              </span>
                            </div>
                          </button>
                        </template>
                      </div>
                    </div>
                  </div>

                  <div v-if="formData.date">
                    <!-- Session Duration Indicator -->
                    <div class="flex items-center space-x-2 mb-6">
                      <svg
                        class="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span class="text-lg text-gray-600">30 min session</span>
                    </div>

                    <!-- Time Slots -->
                    <div
                      ref="timeSlotsSection"
                      class="grid grid-cols-3 gap-3 scroll-mt-8"
                    >
                      <button
                        v-for="slot in timeSlots"
                        :key="slot"
                        @click="selectTimeSlot(slot)"
                        :class="[
                          'py-4 px-3 rounded-2xl text-center transition-all duration-200 text-base',
                          formData.timeSlot === slot
                            ? 'bg-white border-2 border-[#3C2A21] text-[#1a1a1a] font-medium shadow-sm'
                            : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300',
                        ]"
                      >
                        {{ slot }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Choose Theme -->
              <div v-show="currentStep === 2" key="step2" class="space-y-6">
                <div class="max-w-sm mx-auto">
                  <h1 class="text-2xl font-bold text-[#1a1a1a] mb-2">
                    Choose your theme
                  </h1>
                  <p class="text-md text-[#6b7280] mb-8">
                    Choose your preferred studio theme asdnajk akjsdbakjsd k
                    ajsdnakjsdn akjsdn lorem
                  </p>

                  <!-- Session Type Cards -->
                  <div class="space-y-6">
                    <div
                      v-for="type in sessionTypes"
                      :key="type.value"
                      @click="selectSessionType(type.value)"
                      class="relative group cursor-pointer"
                    >
                      <div
                        class="relative h-[280px] rounded-2xl overflow-hidden transition-all duration-300"
                        :class="[
                          formData.sessionType === type.value
                            ? 'ring-4 ring-[#3C2A21] ring-offset-2'
                            : 'hover:ring-2 hover:ring-[#3C2A21]/50 hover:ring-offset-2',
                        ]"
                      >
                        <!-- Background Image -->
                        <div class="absolute inset-0">
                          <img
                            :src="type.image"
                            :alt="type.label"
                            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <!-- Gradient Overlay -->
                          <div
                            class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
                          ></div>
                        </div>

                        <!-- Content -->
                        <div
                          class="relative h-full p-6 flex flex-col justify-end"
                        >
                          <!-- Theme Label -->
                          <div class="mb-2">
                            <h3
                              class="text-2xl font-semibold text-white font-playfair mb-2"
                            >
                              {{ type.label }}
                            </h3>
                            <p class="text-sm text-white/90 line-clamp-2">
                              {{ type.description }}
                            </p>
                          </div>

                          <!-- Price and Features -->
                          <div class="mt-4">
                            <div class="flex items-center justify-between">
                              <div>
                                <p class="text-xs text-white/80">
                                  Starting from
                                </p>
                                <p class="text-xl font-semibold text-white">
                                  {{ formatPrice(type.price) }}
                                </p>
                              </div>
                              <div
                                class="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                                :class="[
                                  formData.sessionType === type.value
                                    ? 'bg-[#3C2A21] text-white'
                                    : 'bg-white/90 text-[#3C2A21] group-hover:bg-[#3C2A21] group-hover:text-white',
                                ]"
                              >
                                {{
                                  formData.sessionType === type.value
                                    ? "Selected"
                                    : "Select Theme"
                                }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Number of Persons Selection -->
                  <div class="space-y-6 mt-8">
                    <div class="max-w-sm mx-auto">
                      <h3
                        class="text-base font-medium text-[#3C2A21] mb-4 font-playfair"
                      >
                        Select Number of Persons
                      </h3>
                      <div class="relative">
                        <select
                          v-model="formData.numberOfPax"
                          class="w-full appearance-none bg-white border-2 border-[#3C2A21]/10 hover:border-[#3C2A21]/20 rounded-2xl px-6 py-4 text-lg font-medium text-[#3C2A21] focus:outline-none focus:ring-2 focus:ring-[#3C2A21]/10 focus:border-[#3C2A21]/20 transition-all duration-200 cursor-pointer font-playfair"
                          :class="{
                            'border-red-300 focus:ring-red-100 focus:border-red-500':
                              errors.numberOfPax,
                          }"
                          @blur="validateField('numberOfPax')"
                        >
                          <option value="" disabled selected>
                            Select number of persons
                          </option>
                          <option
                            v-for="option in paxOptions"
                            :key="option.value"
                            :value="option.value"
                            class="py-3 text-base font-medium"
                          >
                            {{ option.label }}
                          </option>
                        </select>
                        <div
                          class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none flex items-center space-x-2"
                        >
                          <div class="h-5 w-[1px] bg-[#3C2A21]/10"></div>
                          <svg
                            class="w-5 h-5 text-[#3C2A21]/60"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                        <p
                          v-if="errors.numberOfPax"
                          class="mt-2 text-xs text-red-500"
                        >
                          {{ errors.numberOfPax }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 3: Personal Information -->
              <div v-show="currentStep === 3" key="step3" class="space-y-6">
                <div class="max-w-sm mx-auto">
                  <!-- Selected theme preview -->
                  <div class="mb-6">
                    <!-- Preview Card -->
                    <div
                      class="bg-white rounded-xl border border-[#3C2A21]/10 overflow-hidden"
                    >
                      <!-- Theme Image and Details -->
                      <div
                        class="flex items-center p-3 border-b border-[#3C2A21]/10"
                      >
                        <div
                          class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
                        >
                          <img
                            :src="selectedTheme?.image"
                            :alt="selectedTheme?.label"
                            class="w-full h-full object-cover"
                          />
                        </div>
                        <div class="ml-3">
                          <h3
                            class="text-base font-medium text-[#3C2A21] font-playfair"
                          >
                            {{ selectedTheme?.label }}
                          </h3>
                          <p class="text-xs text-[#3C2A21]/60 line-clamp-2">
                            {{ selectedTheme?.description }}
                          </p>
                        </div>
                      </div>

                      <!-- Booking Details -->
                      <div class="p-3 space-y-2 text-sm">
                        <!-- Date and Time -->
                        <div class="flex items-center text-[#3C2A21]">
                          <svg
                            class="w-4 h-4 mr-2 text-[#3C2A21]/60"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span
                            >{{ formatDate(formData.date) }} •
                            {{ formData.timeSlot }}</span
                          >
                        </div>

                        <!-- Number of Persons -->
                        <div class="flex items-center text-[#3C2A21]">
                          <svg
                            class="w-4 h-4 mr-2 text-[#3C2A21]/60"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span>{{ formData.numberOfPax }} persons</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 class="text-2xl font-bold text-[#1a1a1a] mb-2">
                    Enter your details
                  </h2>
                  <p class="text-md text-[#6b7280] mb-8">
                    Please give your details bla bla akjsdbakjsd k ajsdnakjsdn
                    akjsdn lorem
                  </p>
                  <div class="space-y-4">
                    <!-- Name Input -->
                    <div class="form-group">
                      <input
                        type="text"
                        id="name"
                        v-model="formData.name"
                        class="form-input peer"
                        :class="{ error: errors.name }"
                        placeholder="First Last"
                        required
                        @blur="validateField('name')"
                      />
                      <label for="name" class="form-label">Name</label>
                      <p v-if="errors.name" class="form-error">
                        {{ errors.name }}
                      </p>
                    </div>

                    <!-- Phone Input -->
                    <div class="form-group">
                      <input
                        type="tel"
                        id="phone"
                        v-model="formData.phone"
                        class="form-input peer"
                        :class="{ error: errors.phone }"
                        placeholder="+601234567890"
                        required
                        @blur="validateField('phone')"
                      />
                      <label for="phone" class="form-label">Phone number</label>
                      <p v-if="errors.phone" class="form-error">
                        {{ errors.phone }}
                      </p>
                    </div>

                    <!-- Email Input -->
                    <div class="form-group">
                      <input
                        type="email"
                        id="email"
                        v-model="formData.email"
                        class="form-input peer"
                        :class="{ error: errors.email }"
                        placeholder="example@exmaple.com"
                        required
                        @blur="validateField('email')"
                      />
                      <label for="email" class="form-label">Email</label>
                      <p v-if="errors.email" class="form-error">
                        {{ errors.email }}
                      </p>
                    </div>

                    <!-- Where did you find us? Dropdown -->
                    <div class="form-group">
                      <select
                        id="source"
                        v-model="formData.source"
                        class="form-input peer"
                        :class="{ error: errors.source }"
                        required
                        @blur="validateField('source')"
                      >
                        <option value="" disabled selected>
                          Select an option
                        </option>
                        <option value="social_media">Social Media</option>
                        <option value="search">Search Engine</option>
                        <option value="friend">Friend Referral</option>
                        <option value="other">Other</option>
                      </select>
                      <label for="source" class="form-label"
                        >Where did you find us?</label
                      >
                      <p v-if="errors.source" class="form-error">
                        {{ errors.source }}
                      </p>
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
                          <label
                            for="terms"
                            class="text-[#3C2A21] font-playfair"
                          >
                            I agree to the
                            <button
                              type="button"
                              @click="showTerms = true"
                              class="text-[#3C2A21] hover:text-[#5C4033] transition-colors font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[#3C2A21]/20 rounded"
                            >
                              Terms and Conditions
                            </button>
                          </label>
                          <p
                            v-if="errors.terms"
                            class="text-xs text-red-500 mt-1"
                          >
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
                  <!-- Booking Summary Card -->
                  <div
                    class="bg-white rounded-xl border border-[#3C2A21]/10 overflow-hidden mb-6"
                  >
                    <div class="p-4 bg-[#F5E6E0]">
                      <h3
                        class="text-base font-medium text-[#3C2A21] font-playfair"
                      >
                        Booking Summary
                      </h3>
                    </div>

                    <!-- Theme Details -->
                    <div
                      class="flex items-center p-3 border-b border-[#3C2A21]/10"
                    >
                      <div
                        class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
                      >
                        <img
                          :src="selectedTheme?.image"
                          :alt="selectedTheme?.label"
                          class="w-full h-full object-cover"
                        />
                      </div>
                      <div class="ml-3">
                        <h4 class="text-sm font-medium text-[#3C2A21]">
                          {{ selectedTheme?.label }}
                        </h4>
                        <p class="text-xs text-[#3C2A21]/60">
                          {{ formData.numberOfPax }} persons
                        </p>
                        <p class="text-xs text-[#3C2A21]/60">
                          {{ formatDate(formData.date) }} •
                          {{ formData.timeSlot }}
                        </p>
                      </div>
                    </div>

                    <!-- Price Breakdown -->
                    <div class="p-3 space-y-2 text-sm">
                      <div class="flex justify-between text-[#3C2A21]/70">
                        <span>Package Price</span>
                        <span>{{ sessionPrice }}</span>
                      </div>
                      <div
                        class="flex justify-between font-medium text-[#3C2A21] pt-2 border-t border-[#3C2A21]/10"
                      >
                        <span>Deposit Required</span>
                        <span>{{ depositAmount }}</span>
                      </div>
                      <p class="text-xs text-[#3C2A21]/60 pt-1">
                        Balance payment will be collected on the session day
                      </p>
                    </div>
                  </div>

                  <!-- Payment Method -->
                  <div class="space-y-4">
                    <h3
                      class="text-base font-medium text-[#3C2A21] font-playfair"
                    >
                      Select Payment Method
                    </h3>

                    <!-- FPX Option -->
                    <button class="w-full group">
                      <div
                        class="flex items-center p-3 border-2 border-[#3C2A21] bg-[#3C2A21]/5 rounded-xl"
                      >
                        <div
                          class="w-12 h-12 flex items-center justify-center bg-white rounded-lg border border-[#3C2A21]/10"
                        >
                          <svg
                            class="w-6 h-6 text-[#3C2A21]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                        </div>
                        <div class="ml-3 text-left">
                          <p class="text-sm font-medium text-[#3C2A21]">
                            FPX Online Banking
                          </p>
                          <p class="text-xs text-[#3C2A21]/60">
                            Pay securely with your online banking account
                          </p>
                        </div>
                      </div>
                    </button>

                    <!-- Disabled Card Option -->
                    <div class="opacity-50 cursor-not-allowed">
                      <div
                        class="flex items-center p-3 border-2 border-[#3C2A21]/20 rounded-xl"
                      >
                        <div
                          class="w-12 h-12 flex items-center justify-center bg-white rounded-lg border border-[#3C2A21]/10"
                        >
                          <svg
                            class="w-6 h-6 text-[#3C2A21]/60"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                        </div>
                        <div class="ml-3 text-left">
                          <p class="text-sm font-medium text-[#3C2A21]/60">
                            Credit / Debit Card
                          </p>
                          <p class="text-xs text-[#3C2A21]/60">
                            Currently unavailable
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Terms Reminder -->
                  <div class="mt-6 p-3 bg-[#F5E6E0]/50 rounded-xl">
                    <p class="text-xs text-[#3C2A21]/70">
                      By proceeding with the payment, you agree to our terms and
                      conditions. The deposit is non-refundable but transferable
                      to another date (subject to availability).
                    </p>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- Navigation Footer -->
          <div
            class="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-br from-[#F5E6E0] via-[#E6CCB2] to-[#DDB892] flex justify-between items-center"
          >
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
          <div
            class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          ></div>

          <div class="flex min-h-screen items-center justify-center p-4">
            <!-- Modal panel -->
            <div
              class="relative transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all w-full max-w-lg"
            >
              <!-- Header -->
              <div
                class="border-b border-[#3C2A21]/10 px-4 sm:px-6 py-4 flex items-center justify-between"
              >
                <h3
                  class="text-base sm:text-lg font-semibold text-[#3C2A21]"
                  id="modal-title"
                >
                  Terms and Conditions
                </h3>
                <button
                  @click="showTerms = false"
                  class="text-[#3C2A21]/60 hover:text-[#3C2A21] transition-colors p-2"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
                    <h4
                      class="text-sm sm:text-base font-semibold mb-3 font-playfair"
                    >
                      1. Booking & Payment
                    </h4>
                    <div class="space-y-2 text-xs sm:text-sm">
                      <p>
                        • A deposit payment is required to secure your booking
                        date.
                      </p>
                      <p>• For Wedding Photography: RM500 deposit</p>
                      <p>• For Event Photography: RM300 deposit</p>
                      <p>
                        • The remaining balance must be paid on the day of the
                        session before the shoot begins.
                      </p>
                      <p>
                        • Deposits are non-refundable but transferable to
                        another date (subject to availability).
                      </p>
                    </div>
                  </section>

                  <!-- Cancellation & Rescheduling -->
                  <section>
                    <h4
                      class="text-sm sm:text-base font-semibold mb-3 font-playfair"
                    >
                      2. Cancellation & Rescheduling
                    </h4>
                    <div class="space-y-2 text-xs sm:text-sm">
                      <p>
                        • Cancellations made 30 days or more before the session:
                        50% deposit refund
                      </p>
                      <p>
                        • Cancellations made less than 30 days before the
                        session: No refund
                      </p>
                      <p>
                        • Rescheduling is allowed once, subject to availability
                      </p>
                      <p>
                        • Rescheduling must be requested at least 14 days before
                        the session
                      </p>
                    </div>
                  </section>

                  <!-- Image Rights & Delivery -->
                  <section>
                    <h4
                      class="text-sm sm:text-base font-semibold mb-3 font-playfair"
                    >
                      3. Image Rights & Delivery
                    </h4>
                    <div class="space-y-2 text-xs sm:text-sm">
                      <p>• The photographer retains copyright of all images</p>
                      <p>
                        • Images may be used for portfolio and marketing
                        purposes
                      </p>
                      <p>
                        • High-resolution digital images will be delivered via
                        online gallery
                      </p>
                      <p>• Wedding photos: Delivery within 4-6 weeks</p>
                      <p>• Event photos: Delivery within 2-3 weeks</p>
                    </div>
                  </section>

                  <!-- Session Guidelines -->
                  <section>
                    <h4
                      class="text-sm sm:text-base font-semibold mb-3 font-playfair"
                    >
                      4. Session Guidelines
                    </h4>
                    <div class="space-y-2 text-xs sm:text-sm">
                      <p>• Please arrive on time for your session</p>
                      <p>
                        • The photographer reserves the right to leave after 30
                        minutes of waiting
                      </p>
                      <p>
                        • Additional hours can be added on the day at RM200 per
                        hour
                      </p>
                      <p>
                        • Weather contingency plans will be discussed prior to
                        outdoor sessions
                      </p>
                    </div>
                  </section>
                </div>
              </div>

              <!-- Footer -->
              <div
                class="border-t border-[#3C2A21]/10 px-4 sm:px-6 py-4 flex justify-end"
              >
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
import { format } from "date-fns";

// Define page meta to use empty layout
definePageMeta({
  layout: "empty",
  head: {
    link: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap",
      },
    ],
  },
});

// Add ref for html2pdf instance
const html2pdf = ref(null);

// Load html2pdf only on client side
onMounted(() => {
  // Initialize audio player
  audioPlayer.value = new Audio("/music/music.mp3");
  audioPlayer.value.loop = true;
  audioPlayer.value.volume = 0.3;

  // Wait for next tick before trying to scroll
  nextTick(() => {
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");
    scrollToDate(todayStr);
  });

  // Load html2pdf
  try {
    import("html2pdf.js").then((module) => {
      html2pdf.value = module.default;
    });
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
    label: "Classic Raya",
    description:
      "Traditional elegance with modern sophistication. Perfect for family portraits and formal gatherings.",
    image:
      "data:image/jpeg;base64,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",
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
    label: "Modern Raya",
    description:
      "Contemporary styling with bright, airy aesthetics. Ideal for modern families and creative expressions.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0XTwmmKj-9sQcnOQX8ypI35boAu6sgmh0Mg&s",
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

// Add this after the sessionTypes array
const paxOptions = [
  { value: "2", label: "2 persons" },
  { value: "3", label: "3 persons" },
  { value: "4", label: "4 persons" },
  { value: "5", label: "5 persons" },
];

// Form state
const currentStep = ref(1);
const isProcessing = ref(false);
const formData = ref({
  name: "",
  email: "",
  phone: "",
  source: "",
  termsAccepted: false,
  date: "",
  timeSlot: "",
  sessionType: "",
  numberOfPax: "",
});

const paymentData = ref({
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
});

const errors = ref({});

// First declare the refs
const currentDate = ref(new Date());
const selectedDate = ref(null);
const dateScrollContainer = ref(null);
const initialScrollComplete = ref(false);
const timeSlotsSection = ref(null);

// Then declare the computed properties
const currentMonthName = computed(() => {
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    currentDate.value
  );
});

const currentYear = computed(() => {
  return currentDate.value.getFullYear();
});

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Update calendarDays computed to fix date format
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  const firstDay = new Date(year, month, 1); // First day of current month
  const lastDay = new Date(year, month + 1, 0); // Last day of current month

  // Loop through all days of the current month only
  let date = new Date(firstDay);
  while (date <= lastDay) {
    const dateStr = format(date, "yyyy-MM-dd"); // Format: YYYY-MM-DD
    const dayOfWeek = date.getDay();

    days.push({
      date: dateStr,
      isSelectable: dayOfWeek >= 1 && dayOfWeek <= 4 && date >= today,
      isToday: date.toDateString() === today.toDateString(),
    });

    // Move to next day
    date = new Date(date.setDate(date.getDate() + 1));
  }

  return days;
});

// Update the currentMonth computed setter
const currentMonth = computed({
  get: () => currentDate.value.getMonth(),
  set: (month) => {
    const newDate = new Date(currentDate.value.getFullYear(), month, 1);
    currentDate.value = newDate;

    // Reset form data date when changing months
    formData.value.date = "";
    formData.value.timeSlot = "";

    // After month change, scroll to appropriate date without selecting it
    const today = new Date();
    const isCurrentMonth =
      month === today.getMonth() &&
      newDate.getFullYear() === today.getFullYear();

    // Use nextTick to ensure calendar is updated
    nextTick(() => {
      if (isCurrentMonth) {
        // If current month, scroll to today's date
        const todayStr = format(today, "yyyy-MM-dd");
        scrollToDate(todayStr);
      } else {
        // For other months, scroll to first date of the month
        const firstOfMonth = format(newDate, "yyyy-MM-dd");
        scrollToDate(firstOfMonth);
      }
    });
  },
});

function getSlotIndicatorColor(slots) {
  if (slots === 0) return "bg-gray-300";
  if (slots <= 3) return "bg-yellow-400";
  return "bg-green-400";
}

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

// Update selectDate function
const selectDate = async (date) => {
  formData.value.date = date;
  formData.value.timeSlot = ""; // Clear time slot when date changes
  validateField("date");

  // Wait for DOM update then scroll to time slots
  await nextTick();
  if (timeSlotsSection.value) {
    timeSlotsSection.value.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
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
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
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
      } else if (
        !/^\+?[0-9]{10,}$/.test(formData.value.phone.replace(/\D/g, ""))
      ) {
        errors.value.phone = "Please enter a valid phone number";
      }
      break;
    case "source":
      if (!formData.value.source) {
        errors.value.source = "Please select how you found us";
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
    case "terms":
      if (!formData.value.termsAccepted) {
        errors.value.terms = "You must accept the terms and conditions";
      }
      break;
    case "numberOfPax":
      if (!formData.value.numberOfPax) {
        errors.value.numberOfPax = "Please select number of persons";
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
      validateField("numberOfPax");
      return !errors.value.sessionType && !errors.value.numberOfPax;
    case 3:
      validateField("name");
      validateField("email");
      validateField("phone");
      validateField("source");
      validateField("terms");
      return (
        !errors.value.name &&
        !errors.value.email &&
        !errors.value.phone &&
        !errors.value.source &&
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
        theme_price: sessionTypes.find(
          (t) => t.value === formData.value.sessionType
        ).price,
        theme_deposit: sessionTypes.find(
          (t) => t.value === formData.value.sessionType
        ).deposit,
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
const slideDates = (direction) => {
  if (!dateScrollContainer.value) return;

  const container = dateScrollContainer.value;
  const scrollAmount = 240; // 2 cards (120px width + 16px gap)

  if (direction === "prev") {
    container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  } else {
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }
};

const scrollToSelectedDate = () => {
  if (!dateScrollContainer.value || !formData.value.date) return;

  // Find the selected date element
  const selectedDateButton = dateScrollContainer.value.querySelector(
    `[data-date="${formData.value.date}"]`
  );

  if (selectedDateButton) {
    // Calculate scroll position to center the element
    const container = dateScrollContainer.value;
    const scrollLeft =
      selectedDateButton.offsetLeft -
      container.clientWidth / 2 +
      selectedDateButton.clientWidth / 2;

    // Smooth scroll to the position
    container.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: "smooth",
    });

    initialScrollComplete.value = true;
  }
};

// Update the scrollToDate function
const scrollToDate = (date) => {
  if (!date) return;

  // Use nextTick to ensure DOM is updated
  nextTick(() => {
    // Double check if container exists after DOM update
    if (!dateScrollContainer.value) return;

    // Add a small delay to ensure the DOM is fully rendered
    setTimeout(() => {
      const dateButton = dateScrollContainer.value.querySelector(
        `[data-date="${date}"]`
      );

      if (dateButton) {
        // Calculate scroll position to center the element
        const container = dateScrollContainer.value;
        const scrollLeft =
          dateButton.offsetLeft -
          container.clientWidth / 2 +
          dateButton.clientWidth / 2;

        // Smooth scroll to the position
        container.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: "smooth",
        });
      }
    }, 50); // Small delay for DOM rendering
  });
};

// Selected theme
const selectedTheme = computed(() => {
  return sessionTypes.find((type) => type.value === formData.value.sessionType);
});
</script>

<style lang="scss" scoped>
/* Hide scrollbar but keep functionality */
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
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
@import url("https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap");

/* Add font family utility class */
.font-playfair {
  font-family: "Geist", serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
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

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.date-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Smooth transitions for date cards */
button {
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
}

/* Smooth scrolling for the entire container */
.space-y-6 {
  scroll-behavior: smooth;
}

/* Add some padding at the bottom for better scrolling */
.grid-cols-3 {
  padding-bottom: 2rem;
}

/* Today indicator styles */
.absolute.-top-2 {
  font-size: 0.65rem;
  line-height: 1rem;
  white-space: nowrap;
}

/* Enhanced Custom select styling */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: none;
  cursor: pointer;
  font-family: "Playfair Display", serif;
}

select::-ms-expand {
  display: none;
}

/* Style for the option elements */
select option {
  padding: 1rem 1.5rem;
  font-size: 1rem;
  background-color: white;
  color: #3c2a21;
  font-family: "Playfair Display", serif;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Style for option hover and selected states */
select option:checked,
select option:hover {
  background: linear-gradient(to right, #f5e6e0, #e6ccb2);
  color: #3c2a21;
}

/* Style for Firefox */
@-moz-document url-prefix() {
  select {
    color: #3c2a21;
    background-color: white;
    padding-right: 3rem;
  }

  select option {
    background-color: white;
    color: #3c2a21;
  }

  select option:checked,
  select option:hover {
    box-shadow: 0 0 10px 100px #f5e6e0 inset;
    color: #3c2a21;
  }
}

/* Style for Webkit browsers */
select:focus {
  border-color: rgba(60, 42, 33, 0.2);
  outline: none;
}

select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px white inset;
  -webkit-text-fill-color: #3c2a21;
}

/* Theme Card Styles */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ring-offset-2 {
  --tw-ring-offset-width: 2px;
}

/* Smooth image scale transition */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}
</style>
